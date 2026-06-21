package services

import (
	"arthamna/NiLaundry/constants"
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/models"
	"arthamna/NiLaundry/internal/repositories"
	"arthamna/NiLaundry/pkg/common"
	"context"
	"net/http"
	"time"

	"gorm.io/gorm"
)

type PesananService interface {
	List(ctx context.Context, pelangganID int, statusFilter string) ([]dtos.PesananResponse, error)
	GetDetail(ctx context.Context, pelangganID, pesananID int) (*dtos.PesananDetailResponse, error)
	Subtotal(ctx context.Context, items []dtos.ItemPesananInput) (*dtos.SubtotalResponse, error)
	Create(ctx context.Context, pelangganID int, req dtos.CreatePesananRequest) (*dtos.PesananResponse, error)
}

type pesananService struct {
	pesananRepo repositories.PesananRepository
	ulasanRepo  repositories.UlasanRepository
	tarifRepo   repositories.TarifRepository
	pegawaiRepo repositories.PegawaiRepository
}

func NewPesananService(
	pesananRepo repositories.PesananRepository,
	ulasanRepo repositories.UlasanRepository,
	tarifRepo repositories.TarifRepository,
	pegawaiRepo repositories.PegawaiRepository,
) PesananService {
	return &pesananService{
		pesananRepo: pesananRepo,
		ulasanRepo:  ulasanRepo,
		tarifRepo:   tarifRepo,
		pegawaiRepo: pegawaiRepo,
	}
}

func (s *pesananService) List(ctx context.Context, pelangganID int, statusFilter string) ([]dtos.PesananResponse, error) {
	// Default: list every order for the customer. Status values used by seed
	// data ("baru", "diproses", "diambil", "selesai") aren't canonicalized,
	// so we don't apply a default whitelist — callers can pass `?status=` to
	// restrict.
	var statuses []string
	if statusFilter != "" {
		statuses = []string{statusFilter}
	}
	rows, err := s.pesananRepo.ListByPelanggan(ctx, pelangganID, statuses)
	if err != nil {
		return nil, err
	}
	return dtos.ToPesananResponseList(rows), nil
}

func (s *pesananService) GetDetail(ctx context.Context, pelangganID, pesananID int) (*dtos.PesananDetailResponse, error) {
	p, err := s.pesananRepo.FindOwned(ctx, pelangganID, pesananID)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, common.NewAppError(http.StatusNotFound, "pesanan not found")
	}
	items, err := s.pesananRepo.ListItems(ctx, pesananID)
	if err != nil {
		return nil, err
	}
	ulasan, err := s.ulasanRepo.FindByPesanan(ctx, pesananID)
	if err != nil {
		return nil, err
	}
	return &dtos.PesananDetailResponse{
		PesananResponse: dtos.ToPesananResponse(p),
		Items:           dtos.ToItemPesananResponseList(items),
		Ulasan:          dtos.ToUlasanResponsePtr(ulasan),
	}, nil
}

func (s *pesananService) Subtotal(ctx context.Context, items []dtos.ItemPesananInput) (*dtos.SubtotalResponse, error) {
	if len(items) == 0 {
		return &dtos.SubtotalResponse{Subtotal: 0}, nil
	}
	ids := make([]int, 0, len(items))
	for _, it := range items {
		ids = append(ids, it.TarifID)
	}
	tarifs, err := s.tarifRepo.FindByIDs(ctx, ids)
	if err != nil {
		return nil, err
	}
	priceByID := make(map[int]float64, len(tarifs))
	for _, t := range tarifs {
		priceByID[t.IDTarif] = t.HargaPerSatuan
	}
	var subtotal float64
	for _, it := range items {
		price, ok := priceByID[it.TarifID]
		if !ok {
			return nil, common.NewAppError(http.StatusBadRequest, "tarif not found")
		}
		subtotal += price * float64(it.Kuantitas)
	}
	return &dtos.SubtotalResponse{Subtotal: subtotal}, nil
}

func (s *pesananService) Create(ctx context.Context, pelangganID int, req dtos.CreatePesananRequest) (*dtos.PesananResponse, error) {
	pegawai, err := s.pegawaiRepo.PickRandomByCabang(ctx, req.CabangID)
	if err != nil {
		return nil, err
	}
	if pegawai == nil {
		return nil, common.NewAppError(http.StatusBadRequest, "no available pegawai for selected cabang")
	}

	ids := make([]int, 0, len(req.Items))
	for _, it := range req.Items {
		ids = append(ids, it.TarifID)
	}
	tarifs, err := s.tarifRepo.FindByIDs(ctx, ids)
	if err != nil {
		return nil, err
	}
	priceByID := make(map[int]float64, len(tarifs))
	for _, t := range tarifs {
		// ensure tarif belongs to the selected cabang
		if t.CabangLaundryIDCabang != req.CabangID {
			return nil, common.NewAppError(http.StatusBadRequest, "tarif does not belong to selected cabang")
		}
		priceByID[t.IDTarif] = t.HargaPerSatuan
	}

	var total float64
	itemModels := make([]models.ItemPesanan, 0, len(req.Items))
	for _, it := range req.Items {
		price, ok := priceByID[it.TarifID]
		if !ok {
			return nil, common.NewAppError(http.StatusBadRequest, "tarif not found")
		}
		sub := price * float64(it.Kuantitas)
		total += sub
		itemModels = append(itemModels, models.ItemPesanan{
			KuantitasSatuanItemPesanan: it.Kuantitas,
			SubtotalPesanan:            sub,
			CatatanItemPesanan:         it.Catatan,
			TarifIDTarif:               it.TarifID,
		})
	}

	estimasi := time.Now().Add(48 * time.Hour)
	if req.EstimasiSelesai != nil {
		estimasi = *req.EstimasiSelesai
	}

	pesanan := &models.Pesanan{
		JumlahItemPesanan:      len(req.Items),
		StatusPesanan:          constants.StatusPesananMenunggu,
		CatatanPesanan:         req.Catatan,
		EstimasiSelesaiPesanan: estimasi,
		TotalHargaPesanan:      total,
		PelangganIDPelanggan:   pelangganID,
		VoucherIDVoucher:       nil,
		PegawaiIDPegawai:       pegawai.IDPegawai,
	}

	err = s.pesananRepo.CreateOrderTx(ctx, func(tx *gorm.DB) error {
		if err := tx.Create(pesanan).Error; err != nil {
			return err
		}
		for i := range itemModels {
			itemModels[i].PesananIDPesanan = pesanan.IDPesanan
		}
		if err := tx.Create(&itemModels).Error; err != nil {
			return err
		}
		pembayaran := &models.Pembayaran{
			WaktuPembayaran:  time.Now(),
			MetodePembayaran: req.MetodePembayaran,
			StatusPembayaran: constants.StatusPembayaranPending,
			JumlahPembayaran: total,
			PesananIDPesanan: pesanan.IDPesanan,
		}
		if err := tx.Create(pembayaran).Error; err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	res := dtos.ToPesananResponse(pesanan)
	return &res, nil
}
