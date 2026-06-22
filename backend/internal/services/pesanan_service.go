package services

import (
	"arthamna/NiLaundry/constants"
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/models"
	"arthamna/NiLaundry/internal/repositories"
	"arthamna/NiLaundry/pkg/common"
	"context"
	"net/http"
	"strings"
	"time"

	"gorm.io/gorm"
)

type PesananService interface {
	List(ctx context.Context, pelangganID int, statusFilter string) ([]dtos.PesananResponse, error)
	GetDetail(ctx context.Context, pelangganID, pesananID int) (*dtos.PesananDetailResponse, error)
	Subtotal(ctx context.Context, items []dtos.ItemPesananInput) (*dtos.SubtotalResponse, error)
	Create(ctx context.Context, pelangganID int, req dtos.CreatePesananRequest) (*dtos.PesananResponse, error)
	Katalog(ctx context.Context) ([]dtos.KatalogCabangResponse, error)
	// Cancel flips a pending order to 'cancelled'. Returns true when the
	// status was actually flipped, false when the order was already paid
	// or already cancelled (idempotent). Used by the payment page to
	// auto-cancel when the customer leaves before confirming payment.
	Cancel(ctx context.Context, pelangganID, pesananID int) (bool, error)
}

type pesananService struct {
	pesananRepo   repositories.PesananRepository
	ulasanRepo    repositories.UlasanRepository
	tarifRepo     repositories.TarifRepository
	pegawaiRepo   repositories.PegawaiRepository
	voucherRepo repositories.VoucherRepository
	kurirRepo     repositories.KurirRepository
	pelangganRepo repositories.PelangganRepository
}

func NewPesananService(
	pesananRepo repositories.PesananRepository,
	ulasanRepo repositories.UlasanRepository,
	tarifRepo repositories.TarifRepository,
	pegawaiRepo repositories.PegawaiRepository,
	voucherRepo repositories.VoucherRepository,
	kurirRepo repositories.KurirRepository,
	pelangganRepo repositories.PelangganRepository,
) PesananService {
	return &pesananService{
		pesananRepo:   pesananRepo,
		ulasanRepo:    ulasanRepo,
		tarifRepo:     tarifRepo,
		pegawaiRepo:   pegawaiRepo,
		voucherRepo: voucherRepo,
		kurirRepo:     kurirRepo,
		pelangganRepo: pelangganRepo,
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
	resp := dtos.ToPesananResponseList(rows)

	// Attach a service-name summary per order so the order cards show the real
	// layanan instead of a generic placeholder.
	ids := make([]int, 0, len(resp))
	for _, r := range resp {
		ids = append(ids, r.ID)
	}
	summaries, err := s.pesananRepo.ServiceSummaryByPesanan(ctx, ids)
	if err != nil {
		return nil, err
	}
	for i := range resp {
		resp[i].RingkasanLayanan = summaries[resp[i].ID]
	}
	return resp, nil
}

func (s *pesananService) GetDetail(ctx context.Context, pelangganID, pesananID int) (*dtos.PesananDetailResponse, error) {
	p, err := s.pesananRepo.FindOwned(ctx, pelangganID, pesananID)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, common.NewAppError(http.StatusNotFound, "pesanan not found")
	}
	items, err := s.pesananRepo.ListItemsWithLayanan(ctx, pesananID)
	if err != nil {
		return nil, err
	}
	ulasan, err := s.ulasanRepo.FindByPesanan(ctx, pesananID)
	if err != nil {
		return nil, err
	}
	base := dtos.ToPesananResponse(p)
	itemResp := make([]dtos.ItemPesananResponse, 0, len(items))
	names := make([]string, 0, len(items))
	seen := make(map[string]bool)
	for _, it := range items {
		itemResp = append(itemResp, dtos.ItemPesananResponse{
			ID:          it.IDItemPesanan,
			LayananNama: it.NamaLayanan,
			Satuan:      it.SatuanLayanan,
			Kuantitas:   it.Kuantitas,
			Subtotal:    it.Subtotal,
			Catatan:     it.Catatan,
			PesananID:   it.PesananID,
			TarifID:     it.TarifID,
		})
		if !seen[it.NamaLayanan] {
			seen[it.NamaLayanan] = true
			names = append(names, it.NamaLayanan)
		}
	}
	base.RingkasanLayanan = strings.Join(names, ", ")

	// Attach the applied voucher (if any) so the detail summary can show the
	// discount line.
	var voucherResp *dtos.VoucherResponse
	if p.VoucherIDVoucher != nil {
		v, err := s.voucherRepo.FindByID(ctx, *p.VoucherIDVoucher)
		if err != nil {
			return nil, err
		}
		if v != nil {
			r := dtos.ToVoucherResponse(v)
			voucherResp = &r
		}
	}

	return &dtos.PesananDetailResponse{
		PesananResponse: base,
		Items:           itemResp,
		Ulasan:          dtos.ToUlasanResponsePtr(ulasan),
		Voucher:         voucherResp,
	}, nil
}

func (s *pesananService) Katalog(ctx context.Context) ([]dtos.KatalogCabangResponse, error) {
	rows, err := s.tarifRepo.ListKatalog(ctx)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.KatalogCabangResponse, 0)
	indexByCabang := make(map[int]int)
	for _, r := range rows {
		idx, ok := indexByCabang[r.CabangID]
		if !ok {
			out = append(out, dtos.KatalogCabangResponse{
				CabangID: r.CabangID,
				Nama:     r.NamaCabang,
				Alamat:   r.AlamatCabang,
				Services: []dtos.KatalogServiceResponse{},
			})
			idx = len(out) - 1
			indexByCabang[r.CabangID] = idx
		}
		out[idx].Services = append(out[idx].Services, dtos.KatalogServiceResponse{
			TarifID:        r.TarifID,
			LayananID:      r.LayananID,
			NamaLayanan:    r.NamaLayanan,
			Satuan:         r.SatuanLayanan,
			HargaPerSatuan: r.HargaPerSatuan,
		})
	}
	return out, nil
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

	// Auto-assign the default status to the first step of the chosen scenario:
	// a pickup-flow order starts at "pickup"; a walk-in order starts at "processing".
	defaultStatus := constants.StatusPesananProcessing
	if req.JenisAmbil == constants.JenisAmbilPickup {
		defaultStatus = constants.StatusPesananPickup
	}

	pesanan := &models.Pesanan{
		JumlahItemPesanan:      len(req.Items),
		StatusPesanan:          defaultStatus,
		CatatanPesanan:         req.Catatan,
		EstimasiSelesaiPesanan: estimasi,
		TotalHargaPesanan:      total,
		PelangganIDPelanggan:   pelangganID,
		VoucherIDVoucher:       nil,
		PegawaiIDPegawai:       pegawai.IDPegawai,
		JenisAmbil:             req.JenisAmbil,
		JenisAntar:             req.JenisAntar,
	}

	// Auto-assign a kurir when the order involves pickup or delivery —
	// the kurir is chosen by the system, not by the customer. Picked once
	// even when both legs apply (same courier handles both directions).
	needsKurir := req.JenisAmbil == constants.JenisAmbilPickup ||
		req.JenisAntar == constants.JenisAntarDelivery
	var assignedKurir *repositories.KurirRow
	if needsKurir {
		k, err := s.kurirRepo.PickRandom(ctx)
		if err != nil {
			return nil, err
		}
		if k == nil {
			return nil, common.NewAppError(http.StatusBadRequest, "no kurir available")
		}
		assignedKurir = k
	}

	// Pengiriman.alamat_pengiriman is NOT NULL — pull the customer's address
	// once outside the tx so we don't hit the DB inside it for read-only data.
	var alamatPengiriman string
	if needsKurir {
		p, err := s.pelangganRepo.FindByID(ctx, pelangganID)
		if err != nil {
			return nil, err
		}
		if p != nil {
			alamatPengiriman = p.AlamatPelanggan
		}
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

		if assignedKurir != nil {
			// pengiriman.id_pengiriman is plain INT (no IDENTITY in schema),
			// so we allocate the next id manually inside the tx.
			legs := make([]string, 0, 2)
			if req.JenisAmbil == constants.JenisAmbilPickup {
				legs = append(legs, "pickup")
			}
			if req.JenisAntar == constants.JenisAntarDelivery {
				legs = append(legs, "delivery")
			}
			for _, jenis := range legs {
				var nextID int
				if err := tx.Raw(
					`SELECT COALESCE(MAX(id_pengiriman), 0) + 1 FROM pengiriman`,
				).Scan(&nextID).Error; err != nil {
					return err
				}
				if err := tx.Create(&models.Pengiriman{
					IDPengiriman:     nextID,
					WaktuPengiriman:  time.Now(),
					JenisPengiriman:  jenis,
					AlamatPengiriman: alamatPengiriman,
					StatusPengiriman: "pending",
					OngkirPengiriman: 0,
					BuktiPengiriman:  "",
					PesananIDPesanan: pesanan.IDPesanan,
					KurirIDKurir:     assignedKurir.IDKurir,
				}).Error; err != nil {
					return err
				}
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	res := dtos.ToPesananResponse(pesanan)
	return &res, nil
}

func (s *pesananService) Cancel(ctx context.Context, pelangganID, pesananID int) (bool, error) {
	// First confirm the order belongs to this customer — gives a clean 404
	// instead of a silent no-op when the URL is wrong.
	p, err := s.pesananRepo.FindOwned(ctx, pelangganID, pesananID)
	if err != nil {
		return false, err
	}
	if p == nil {
		return false, common.NewAppError(http.StatusNotFound, "pesanan not found")
	}
	return s.pesananRepo.CancelIfPending(ctx, pelangganID, pesananID)
}
