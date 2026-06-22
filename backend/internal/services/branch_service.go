package services

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/repositories"
	"arthamna/NiLaundry/pkg/common"
	"context"
	"net/http"
)

type BranchService interface {
	// Dashboard
	OrderStatistik(ctx context.Context, cabangID int) (*dtos.OrderStatistikResponse, error)
	ListOrders(ctx context.Context, cabangID int, params repositories.ListOrdersParams) ([]dtos.AdminOrderResponse, error)
	RecentPayments(ctx context.Context, cabangID, limit int) ([]dtos.AdminPaymentLedgerResponse, error)
	RecentReviews(ctx context.Context, cabangID, limit int) ([]dtos.UlasanAdminResponse, error)

	// Orders
	OrderStatusStatistik(ctx context.Context, cabangID int) (*dtos.OrderStatusStatistikResponse, error)
	OrderDetail(ctx context.Context, cabangID, pesananID int) (*dtos.AdminOrderDetailResponse, error)
	UpdateOrderDetail(ctx context.Context, cabangID, pesananID int, req dtos.UpdateOrderDetailRequest) (*dtos.AdminOrderDetailResponse, error)

	// Reports
	PaymentByCustomer(ctx context.Context, cabangID, page, limit int) ([]dtos.PaymentByCustomerResponse, error)
	PaymentMethodChart(ctx context.Context, cabangID int) ([]dtos.PaymentMethodChartItemResponse, error)
	PaymentMethodTotal(ctx context.Context, cabangID int) (*dtos.PaymentTotalResponse, error)
	PaymentMethodAverage(ctx context.Context, cabangID int) (*dtos.PaymentAverageResponse, error)

	// Reviews
	ListUlasan(ctx context.Context, cabangID, page, limit int) ([]dtos.UlasanAdminResponse, error)
	UlasanDistribusi(ctx context.Context, cabangID int) (*dtos.UlasanDistribusiResponse, error)
	UlasanAverage(ctx context.Context, cabangID int) (*dtos.UlasanAverageResponse, error)

	// Staff
	ListPegawai(ctx context.Context, cabangID int) ([]dtos.AdminPegawaiResponse, error)
}

type branchService struct {
	repo repositories.BranchRepository
}

func NewBranchService(repo repositories.BranchRepository) BranchService {
	return &branchService{repo: repo}
}

// --- Dashboard --------------------------------------------------------------

func (s *branchService) OrderStatistik(ctx context.Context, cabangID int) (*dtos.OrderStatistikResponse, error) {
	count, revenue, err := s.repo.TodaysOrderAndRevenue(ctx, cabangID)
	if err != nil {
		return nil, err
	}
	return &dtos.OrderStatistikResponse{TodaysOrder: count, TodaysRevenue: revenue}, nil
}

func (s *branchService) ListOrders(ctx context.Context, cabangID int, params repositories.ListOrdersParams) ([]dtos.AdminOrderResponse, error) {
	rows, err := s.repo.ListOrders(ctx, cabangID, params)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.AdminOrderResponse, len(rows))
	for i, r := range rows {
		out[i] = mapOrderRow(&r)
	}
	return out, nil
}

func (s *branchService) RecentPayments(ctx context.Context, cabangID, limit int) ([]dtos.AdminPaymentLedgerResponse, error) {
	rows, err := s.repo.ListRecentPayments(ctx, cabangID, limit)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.AdminPaymentLedgerResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.AdminPaymentLedgerResponse{
			ID:              r.IDPembayaran,
			PesananID:       r.PesananIDPesanan,
			PelangganNama:   r.NamaPelanggan,
			PelangganNoTelp: r.NoTelpPelanggan,
			Waktu:           r.WaktuPembayaran,
			Metode:          r.MetodePembayaran,
			Jumlah:          r.JumlahPembayaran,
		}
	}
	return out, nil
}

func (s *branchService) RecentReviews(ctx context.Context, cabangID, limit int) ([]dtos.UlasanAdminResponse, error) {
	rows, err := s.repo.ListRecentReviews(ctx, cabangID, limit)
	if err != nil {
		return nil, err
	}
	return mapReviewRows(rows), nil
}

// --- Orders -----------------------------------------------------------------

func (s *branchService) OrderStatusStatistik(ctx context.Context, cabangID int) (*dtos.OrderStatusStatistikResponse, error) {
	total, counts, err := s.repo.OrderStatusCounts(ctx, cabangID)
	if err != nil {
		return nil, err
	}
	out := dtos.OrderStatusStatistikResponse{Total: total, Counts: make([]dtos.OrderStatusCountResponse, len(counts))}
	for i, c := range counts {
		out.Counts[i] = dtos.OrderStatusCountResponse{Status: c.Status, Count: c.Count}
	}
	return &out, nil
}

func (s *branchService) OrderDetail(ctx context.Context, cabangID, pesananID int) (*dtos.AdminOrderDetailResponse, error) {
	row, items, payment, err := s.repo.OrderDetail(ctx, cabangID, pesananID)
	if err != nil {
		return nil, err
	}
	if row == nil {
		return nil, common.NewAppError(http.StatusNotFound, "order not found in this cabang")
	}
	resp := dtos.AdminOrderDetailResponse{
		AdminOrderResponse: mapOrderRow(row),
		Items:              make([]dtos.AdminOrderItemResponse, len(items)),
	}
	for i, it := range items {
		resp.Items[i] = dtos.AdminOrderItemResponse{
			ID:          it.IDItemPesanan,
			LayananNama: it.NamaLayanan,
			Satuan:      it.SatuanLayanan,
			Kuantitas:   it.Kuantitas,
			Subtotal:    it.Subtotal,
			Catatan:     it.Catatan,
			TarifID:     it.TarifID,
		}
	}
	if payment != nil {
		resp.Pembayaran = &dtos.AdminPembayaranResponse{
			ID:     payment.IDPembayaran,
			Waktu:  payment.WaktuPembayaran,
			Metode: payment.MetodePembayaran,
			Status: payment.StatusPembayaran,
			Jumlah: payment.JumlahPembayaran,
		}
	}
	return &resp, nil
}

func (s *branchService) UpdateOrderDetail(ctx context.Context, cabangID, pesananID int, req dtos.UpdateOrderDetailRequest) (*dtos.AdminOrderDetailResponse, error) {
	err := s.repo.UpdateOrderDetail(ctx, repositories.UpdateOrderDetailArgs{
		CabangID:        cabangID,
		PesananID:       pesananID,
		PegawaiID:       req.PegawaiID,
		Status:          req.Status,
		Catatan:         req.Catatan,
		EstimasiSelesai: req.EstimasiSelesai,
		TotalHarga:      req.TotalHarga,
		JumlahItem:      req.JumlahItem,
		VoucherID:       req.VoucherID,
		NotifyOnSelesai: true,
	})
	if err != nil {
		return nil, common.NewAppError(http.StatusBadRequest, err.Error())
	}
	return s.OrderDetail(ctx, cabangID, pesananID)
}

// --- Reports ----------------------------------------------------------------

func (s *branchService) PaymentByCustomer(ctx context.Context, cabangID, page, limit int) ([]dtos.PaymentByCustomerResponse, error) {
	offset := (page - 1) * limit
	if offset < 0 {
		offset = 0
	}
	rows, err := s.repo.PaymentByCustomer(ctx, cabangID, limit, offset)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.PaymentByCustomerResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.PaymentByCustomerResponse{
			PelangganID:   r.IDPelanggan,
			PelangganNama: r.NamaPelanggan,
			TotalOrder:    r.TotalOrder,
			TotalPayment:  r.TotalPayment,
		}
	}
	return out, nil
}

func (s *branchService) PaymentMethodChart(ctx context.Context, cabangID int) ([]dtos.PaymentMethodChartItemResponse, error) {
	rows, err := s.repo.PaymentMethodChart(ctx, cabangID)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.PaymentMethodChartItemResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.PaymentMethodChartItemResponse{
			Metode:       r.Metode,
			TotalEntries: r.TotalEntries,
			Persentase:   r.Persentase,
		}
	}
	return out, nil
}

func (s *branchService) PaymentMethodTotal(ctx context.Context, cabangID int) (*dtos.PaymentTotalResponse, error) {
	v, err := s.repo.PaymentMethodTotal(ctx, cabangID)
	if err != nil {
		return nil, err
	}
	return &dtos.PaymentTotalResponse{Total: v}, nil
}

func (s *branchService) PaymentMethodAverage(ctx context.Context, cabangID int) (*dtos.PaymentAverageResponse, error) {
	v, err := s.repo.PaymentMethodAverage(ctx, cabangID)
	if err != nil {
		return nil, err
	}
	return &dtos.PaymentAverageResponse{Average: v}, nil
}

// --- Reviews ----------------------------------------------------------------

func (s *branchService) ListUlasan(ctx context.Context, cabangID, page, limit int) ([]dtos.UlasanAdminResponse, error) {
	offset := (page - 1) * limit
	if offset < 0 {
		offset = 0
	}
	rows, err := s.repo.ListUlasan(ctx, cabangID, limit, offset)
	if err != nil {
		return nil, err
	}
	return mapReviewRows(rows), nil
}

func (s *branchService) UlasanDistribusi(ctx context.Context, cabangID int) (*dtos.UlasanDistribusiResponse, error) {
	d, err := s.repo.UlasanDistribusi(ctx, cabangID)
	if err != nil {
		return nil, err
	}
	return &dtos.UlasanDistribusiResponse{
		Rating1: d.Rating1, Rating2: d.Rating2, Rating3: d.Rating3,
		Rating4: d.Rating4, Rating5: d.Rating5, Total: d.Total,
	}, nil
}

func (s *branchService) UlasanAverage(ctx context.Context, cabangID int) (*dtos.UlasanAverageResponse, error) {
	a, err := s.repo.UlasanAverage(ctx, cabangID)
	if err != nil {
		return nil, err
	}
	return &dtos.UlasanAverageResponse{
		AverageRating: a.AverageRating,
		Rating1:       a.Rating1, Rating2: a.Rating2, Rating3: a.Rating3,
		Rating4: a.Rating4, Rating5: a.Rating5,
		TotalUlasan: a.TotalUlasan,
	}, nil
}

// --- Staff ------------------------------------------------------------------

func (s *branchService) ListPegawai(ctx context.Context, cabangID int) ([]dtos.AdminPegawaiResponse, error) {
	rows, err := s.repo.ListPegawai(ctx, cabangID)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.AdminPegawaiResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.AdminPegawaiResponse{
			ID:       r.IDPegawai,
			Nama:     r.NamaPegawai,
			Email:    r.EmailPegawai,
			NoTelp:   r.NoTelpPegawai,
			Alamat:   r.AlamatPegawai,
			CabangID: r.CabangLaundryIDCabang,
		}
	}
	return out, nil
}

// --- helpers ----------------------------------------------------------------

func mapOrderRow(r *repositories.BranchOrderRow) dtos.AdminOrderResponse {
	return dtos.AdminOrderResponse{
		ID:              r.IDPesanan,
		Status:          r.StatusPesanan,
		JumlahItem:      r.JumlahItem,
		EstimasiSelesai: r.EstimasiSelesaiPesanan,
		TotalHarga:      r.TotalHargaPesanan,
		Catatan:         r.CatatanPesanan,
		VoucherID:       r.VoucherIDVoucher,
		PegawaiID:       r.PegawaiIDPegawai,
		Pelanggan: dtos.PelangganRingkasResponse{
			ID:     r.PelangganIDPelanggan,
			Nama:   r.NamaPelanggan,
			NoTelp: r.NoTelpPelanggan,
		},
	}
}

func mapReviewRows(rows []repositories.BranchReviewRow) []dtos.UlasanAdminResponse {
	out := make([]dtos.UlasanAdminResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.UlasanAdminResponse{
			ID:             r.IDUlasan,
			Rating:         r.RatingUlasan,
			Komentar:       r.KomentarUlasan,
			PesananID:      r.PesananIDPesanan,
			PelangganID:    r.IDPelanggan,
			PelangganNama:  r.NamaPelanggan,
			PelangganEmail: r.EmailPelanggan,
			PegawaiID:      r.IDPegawai,
			PegawaiNama:    r.NamaPegawai,
			LayananNama:    r.LayananNama,
		}
	}
	return out
}
