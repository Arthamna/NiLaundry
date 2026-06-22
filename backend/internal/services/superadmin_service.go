package services

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/repositories"
	"arthamna/NiLaundry/pkg/common"
	"context"
	"net/http"
)

type SuperadminService interface {
	// Dashboard
	StatistikUmum(ctx context.Context) (*dtos.SuperStatistikUmumResponse, error)
	StatistikLayananTop6(ctx context.Context) ([]dtos.SuperStatistikLayananResponse, error)
	StatistikLiveOrdersPerCabang(ctx context.Context) ([]dtos.SuperLiveOrdersPerCabangResponse, error)
	AmbilTopCabang(ctx context.Context) ([]dtos.SuperTopCabangResponse, error)
	StatistikPembayaran(ctx context.Context) ([]dtos.SuperPaymentMixResponse, error)

	// Orders
	ListPesanan(ctx context.Context, page, limit int, status, search string) ([]dtos.SuperPesananResponse, error)
	OrdersStats(ctx context.Context) (*dtos.SuperOrdersStatsResponse, error)

	// Services
	ListServiceStats(ctx context.Context) ([]dtos.SuperStatistikLayananResponse, error)

	// Vouchers
	ListVouchers(ctx context.Context) ([]dtos.SuperVoucherResponse, error)
	VouchersStatistik(ctx context.Context) (*dtos.SuperVoucherStatResponse, error)
	CreateVoucher(ctx context.Context, req dtos.CreateVoucherRequest) (*dtos.SuperVoucherResponse, error)

	// Staffs
	ListPegawai(ctx context.Context) ([]dtos.SuperPegawaiResponse, error)
	CreatePegawai(ctx context.Context, req dtos.CreatePegawaiRequest) (*dtos.SuperPegawaiResponse, error)
	UpdatePegawai(ctx context.Context, id int, req dtos.UpdatePegawaiRequest) (*dtos.SuperPegawaiResponse, error)

	// Couriers
	ListKurir(ctx context.Context) ([]dtos.SuperKurirResponse, error)
	CreateKurir(ctx context.Context, req dtos.CreateKurirRequest) (*dtos.SuperKurirResponse, error)
	UpdateKurir(ctx context.Context, id int, req dtos.UpdateKurirRequest) (*dtos.SuperKurirResponse, error)
	ListTipeKendaraan(ctx context.Context) ([]dtos.SuperTipeKendaraanResponse, error)

	// Branches
	ListCabang(ctx context.Context) ([]dtos.SuperCabangResponse, error)
	GetCabang(ctx context.Context, id int) (*dtos.SuperCabangResponse, error)
	BranchPerformance(ctx context.Context) ([]dtos.SuperCabangPerformanceResponse, error)
	BranchServices(ctx context.Context, cabangID int) ([]dtos.SuperCabangServiceResponse, error)
	BranchReviews(ctx context.Context, cabangID, page, limit int) ([]dtos.SuperBranchReviewResponse, error)
	CreateCabang(ctx context.Context, req dtos.CreateCabangRequest) (*dtos.SuperCabangResponse, error)
	UpdateCabang(ctx context.Context, id int, req dtos.UpdateCabangRequest) (*dtos.SuperCabangResponse, error)
	CreateTarif(ctx context.Context, cabangID int, req dtos.CreateTarifRequest) error
	UpdateTarif(ctx context.Context, cabangID int, req dtos.UpdateTarifRequest) error

	// Payments
	ListPayments(ctx context.Context, method, search string, page, limit int) ([]dtos.SuperPaymentResponse, error)
	PaymentByCustomerForCabang(ctx context.Context, cabangID, page, limit int) ([]dtos.SuperPaymentByCustomerResponse, error)

	// Customers
	ListCustomers(ctx context.Context, search string, page, limit int) ([]dtos.SuperCustomerResponse, error)
	GetCustomer(ctx context.Context, id int) (*dtos.SuperCustomerDetailResponse, error)

	// Catalog
	ListLayanan(ctx context.Context) ([]dtos.SuperLayananResponse, error)
}

type superadminService struct {
	repo repositories.SuperadminRepository
}

func NewSuperadminService(repo repositories.SuperadminRepository) SuperadminService {
	return &superadminService{repo: repo}
}

func offsetOf(page, limit int) int {
	if page < 1 {
		page = 1
	}
	if limit <= 0 {
		limit = 20
	}
	return (page - 1) * limit
}

// Dashboard ------------------------------------------------------------------

func (s *superadminService) StatistikUmum(ctx context.Context) (*dtos.SuperStatistikUmumResponse, error) {
	r, err := s.repo.StatistikUmum(ctx)
	if err != nil {
		return nil, err
	}
	return &dtos.SuperStatistikUmumResponse{
		RevenueToday:     r.RevenueToday,
		RevenueThisMonth: r.RevenueThisMonth,
		OrderToday:       r.OrderToday,
		AverageRating:    r.AverageRating,
	}, nil
}

func (s *superadminService) StatistikLayananTop6(ctx context.Context) ([]dtos.SuperStatistikLayananResponse, error) {
	rows, err := s.repo.StatistikLayananTop6(ctx)
	if err != nil {
		return nil, err
	}
	return mapServiceStats(rows), nil
}

func (s *superadminService) StatistikLiveOrdersPerCabang(ctx context.Context) ([]dtos.SuperLiveOrdersPerCabangResponse, error) {
	rows, err := s.repo.StatistikLiveOrdersPerCabang(ctx)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperLiveOrdersPerCabangResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.SuperLiveOrdersPerCabangResponse{
			IDCabang:        r.IDCabang,
			NamaCabang:      r.NamaCabang,
			TotalLiveOrders: r.TotalLiveOrders,
		}
	}
	return out, nil
}

func (s *superadminService) AmbilTopCabang(ctx context.Context) ([]dtos.SuperTopCabangResponse, error) {
	rows, err := s.repo.AmbilTopCabang(ctx)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperTopCabangResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.SuperTopCabangResponse{
			IDCabang:     r.IDCabang,
			NamaCabang:   r.NamaCabang,
			TotalOrder:   r.TotalOrder,
			TotalRevenue: r.TotalRevenue,
		}
	}
	return out, nil
}

func (s *superadminService) StatistikPembayaran(ctx context.Context) ([]dtos.SuperPaymentMixResponse, error) {
	rows, err := s.repo.StatistikPembayaranToday(ctx)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperPaymentMixResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.SuperPaymentMixResponse{
			Metode:       r.Metode,
			TotalEntries: r.TotalEntries,
			Persentase:   r.Persentase,
		}
	}
	return out, nil
}

// Orders --------------------------------------------------------------------

func (s *superadminService) ListPesanan(ctx context.Context, page, limit int, status, search string) ([]dtos.SuperPesananResponse, error) {
	rows, err := s.repo.ListPesananAktif(ctx, page, limit, status, search)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperPesananResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.SuperPesananResponse{
			IDPesanan:              r.IDPesanan,
			JumlahItemPesanan:      r.JumlahItemPesanan,
			StatusPesanan:          r.StatusPesanan,
			CatatanPesanan:         r.CatatanPesanan,
			EstimasiSelesaiPesanan: r.EstimasiSelesaiPesanan,
			TotalHargaPesanan:      r.TotalHargaPesanan,
			PelangganID:            r.PelangganIDPelanggan,
			VoucherID:              r.VoucherIDVoucher,
			PegawaiID:              r.PegawaiIDPegawai,
			NamaPelanggan:          r.NamaPelanggan,
			NoTelpPelanggan:        r.NoTelpPelanggan,
			NamaPegawai:            r.NamaPegawai,
			NamaCabang:             r.NamaCabang,
			IDCabang:               r.IDCabang,
		}
	}
	return out, nil
}

func (s *superadminService) OrdersStats(ctx context.Context) (*dtos.SuperOrdersStatsResponse, error) {
	r, err := s.repo.OrdersStats(ctx)
	if err != nil {
		return nil, err
	}
	return &dtos.SuperOrdersStatsResponse{
		Total: r.Total, Pickup: r.Pickup, Processing: r.Processing,
		Delivery: r.Delivery, Completed: r.Completed,
	}, nil
}

// Services ------------------------------------------------------------------

func (s *superadminService) ListServiceStats(ctx context.Context) ([]dtos.SuperStatistikLayananResponse, error) {
	rows, err := s.repo.ServiceStatsAll(ctx)
	if err != nil {
		return nil, err
	}
	return mapServiceStats(rows), nil
}

func mapServiceStats(rows []repositories.ServiceStatRow) []dtos.SuperStatistikLayananResponse {
	out := make([]dtos.SuperStatistikLayananResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.SuperStatistikLayananResponse{
			IDLayanan: r.IDLayanan, NamaLayanan: r.NamaLayanan,
			TotalPesanan: r.TotalPesanan, TotalRevenue: r.TotalRevenue,
		}
	}
	return out
}

// Vouchers ------------------------------------------------------------------

func (s *superadminService) ListVouchers(ctx context.Context) ([]dtos.SuperVoucherResponse, error) {
	rows, err := s.repo.ListVouchers(ctx)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperVoucherResponse, len(rows))
	for i, r := range rows {
		out[i] = mapVoucher(r)
	}
	return out, nil
}

func mapVoucher(r repositories.VoucherRow) dtos.SuperVoucherResponse {
	return dtos.SuperVoucherResponse{
		ID: r.ID, Kode: r.Kode, TipeDiskon: r.TipeDiskon,
		NilaiDiskon: r.NilaiDiskon, MinPembelian: r.MinPembelian,
		BerlakuHingga: r.BerlakuHingga, Kuota: r.Kuota, Terpakai: r.Terpakai,
	}
}

func (s *superadminService) VouchersStatistik(ctx context.Context) (*dtos.SuperVoucherStatResponse, error) {
	r, err := s.repo.VouchersStatistik(ctx)
	if err != nil {
		return nil, err
	}
	return &dtos.SuperVoucherStatResponse{
		ActiveVoucherWeek:          r.ActiveVoucherWeek,
		TotalCustomerSave:          r.TotalCustomerSave,
		WaktuKadaluarsaTerdekat:    "", // human format computed client-side
		WaktuKadaluarsaTerdekatHrs: r.NearestExpiryHours,
	}, nil
}

func (s *superadminService) CreateVoucher(ctx context.Context, req dtos.CreateVoucherRequest) (*dtos.SuperVoucherResponse, error) {
	v, err := s.repo.CreateVoucher(ctx, repositories.VoucherCreate{
		Kode: req.Kode, TipeDiskon: req.TipeDiskon, NilaiDiskon: req.NilaiDiskon,
		MinPembelian: req.MinPembelian, BerlakuHingga: req.BerlakuHingga, Kuota: req.Kuota,
	})
	if err != nil {
		return nil, common.NewAppError(http.StatusBadRequest, err.Error())
	}
	out := mapVoucher(*v)
	return &out, nil
}

// Staffs --------------------------------------------------------------------

func (s *superadminService) ListPegawai(ctx context.Context) ([]dtos.SuperPegawaiResponse, error) {
	rows, err := s.repo.ListPegawaiAll(ctx)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperPegawaiResponse, len(rows))
	for i, r := range rows {
		out[i] = mapPegawai(r)
	}
	return out, nil
}

func mapPegawai(r repositories.PegawaiJoinRow) dtos.SuperPegawaiResponse {
	return dtos.SuperPegawaiResponse{
		ID: r.ID, Nama: r.Nama, Email: r.Email, NoTelp: r.NoTelp,
		Alamat: r.Alamat, CabangID: r.CabangID, CabangNama: r.CabangNama,
	}
}

func (s *superadminService) CreatePegawai(ctx context.Context, req dtos.CreatePegawaiRequest) (*dtos.SuperPegawaiResponse, error) {
	p, err := s.repo.CreatePegawai(ctx, repositories.PegawaiCreate{
		Nama: req.Nama, Email: req.Email, NoTelp: req.NoTelp,
		Alamat: req.Alamat, CabangID: req.CabangID,
	})
	if err != nil {
		return nil, common.NewAppError(http.StatusBadRequest, err.Error())
	}
	out := mapPegawai(*p)
	return &out, nil
}

func (s *superadminService) UpdatePegawai(ctx context.Context, id int, req dtos.UpdatePegawaiRequest) (*dtos.SuperPegawaiResponse, error) {
	p, err := s.repo.UpdatePegawai(ctx, id, repositories.PegawaiUpdate{
		Nama: req.Nama, Email: req.Email, NoTelp: req.NoTelp,
		Alamat: req.Alamat, CabangID: req.CabangID,
	})
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, common.NewAppError(http.StatusNotFound, "pegawai not found")
	}
	out := mapPegawai(*p)
	return &out, nil
}

// Couriers ------------------------------------------------------------------

func (s *superadminService) ListKurir(ctx context.Context) ([]dtos.SuperKurirResponse, error) {
	rows, err := s.repo.ListKurirAll(ctx)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperKurirResponse, len(rows))
	for i, r := range rows {
		out[i] = mapKurir(r)
	}
	return out, nil
}

func mapKurir(r repositories.KurirJoinRow) dtos.SuperKurirResponse {
	return dtos.SuperKurirResponse{
		ID: r.ID, Nama: r.Nama, NoTelp: r.NoTelp, NoPlat: r.NoPlat,
		TipeKendaraanID: r.TipeKendaraanID, JenisKendaraan: r.JenisKendaraan,
	}
}

func (s *superadminService) CreateKurir(ctx context.Context, req dtos.CreateKurirRequest) (*dtos.SuperKurirResponse, error) {
	k, err := s.repo.CreateKurir(ctx, repositories.KurirCreate{
		Nama: req.Nama, NoTelp: req.NoTelp, NoPlat: req.NoPlat, TipeKendaraanID: req.TipeKendaraanID,
	})
	if err != nil {
		return nil, common.NewAppError(http.StatusBadRequest, err.Error())
	}
	out := mapKurir(*k)
	return &out, nil
}

func (s *superadminService) UpdateKurir(ctx context.Context, id int, req dtos.UpdateKurirRequest) (*dtos.SuperKurirResponse, error) {
	k, err := s.repo.UpdateKurir(ctx, id, repositories.KurirUpdate{
		Nama: req.Nama, NoTelp: req.NoTelp, NoPlat: req.NoPlat, TipeKendaraanID: req.TipeKendaraanID,
	})
	if err != nil {
		return nil, err
	}
	if k == nil {
		return nil, common.NewAppError(http.StatusNotFound, "kurir not found")
	}
	out := mapKurir(*k)
	return &out, nil
}

func (s *superadminService) ListTipeKendaraan(ctx context.Context) ([]dtos.SuperTipeKendaraanResponse, error) {
	rows, err := s.repo.ListTipeKendaraan(ctx)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperTipeKendaraanResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.SuperTipeKendaraanResponse{ID: r.ID, JenisKendaraan: r.JenisKendaraan}
	}
	return out, nil
}

// Branches ------------------------------------------------------------------

func (s *superadminService) ListCabang(ctx context.Context) ([]dtos.SuperCabangResponse, error) {
	rows, err := s.repo.ListCabangAll(ctx)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperCabangResponse, len(rows))
	for i, r := range rows {
		out[i] = mapCabang(r)
	}
	return out, nil
}

func mapCabang(r repositories.CabangRow) dtos.SuperCabangResponse {
	// Repo now formats jam_buka/tutup as "HH:MM" strings via TO_CHAR, so we
	// don't have to format anything here.
	return dtos.SuperCabangResponse{
		ID: r.ID, Nama: r.Nama, Alamat: r.Alamat, NoTelp: r.NoTelp,
		JamBuka: r.JamBuka, JamTutup: r.JamTutup,
	}
}

func (s *superadminService) GetCabang(ctx context.Context, id int) (*dtos.SuperCabangResponse, error) {
	r, err := s.repo.GetCabangByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if r == nil {
		return nil, common.NewAppError(http.StatusNotFound, "cabang not found")
	}
	out := mapCabang(*r)
	return &out, nil
}

func (s *superadminService) BranchPerformance(ctx context.Context) ([]dtos.SuperCabangPerformanceResponse, error) {
	rows, err := s.repo.BranchPerformance(ctx)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperCabangPerformanceResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.SuperCabangPerformanceResponse{
			IDCabang: r.IDCabang, NamaCabang: r.NamaCabang,
			TotalOrder: r.TotalOrder, TotalRevenue: r.TotalRevenue, TotalPaid: r.TotalPaid,
		}
	}
	return out, nil
}

func (s *superadminService) BranchServices(ctx context.Context, cabangID int) ([]dtos.SuperCabangServiceResponse, error) {
	rows, err := s.repo.BranchServices(ctx, cabangID)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperCabangServiceResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.SuperCabangServiceResponse{
			IDLayanan: r.IDLayanan, NamaLayanan: r.NamaLayanan,
			SatuanLayanan: r.SatuanLayanan, DeskripsiLayanan: r.DeskripsiLayanan,
			IDTarif: r.IDTarif, HargaPerSatuan: r.HargaPerSatuan,
			TotalItem: r.TotalItem, TotalRevenue: r.TotalRevenue,
		}
	}
	return out, nil
}

func (s *superadminService) BranchReviews(ctx context.Context, cabangID, page, limit int) ([]dtos.SuperBranchReviewResponse, error) {
	rows, err := s.repo.BranchReviews(ctx, cabangID, limit, offsetOf(page, limit))
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperBranchReviewResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.SuperBranchReviewResponse{
			IDUlasan: r.IDUlasan, Rating: r.Rating, Komentar: r.Komentar,
			PesananID: r.PesananID, PelangganNama: r.PelangganNama,
			PegawaiNama: r.PegawaiNama, LayananNama: r.LayananNama,
		}
	}
	return out, nil
}

func (s *superadminService) CreateCabang(ctx context.Context, req dtos.CreateCabangRequest) (*dtos.SuperCabangResponse, error) {
	r, err := s.repo.CreateCabang(ctx, repositories.CabangCreate{
		Nama: req.Nama, Alamat: req.Alamat, NoTelp: req.NoTelp,
		JamBuka: req.JamBuka, JamTutup: req.JamTutup,
	})
	if err != nil {
		return nil, common.NewAppError(http.StatusBadRequest, err.Error())
	}
	out := mapCabang(*r)
	return &out, nil
}

func (s *superadminService) UpdateCabang(ctx context.Context, id int, req dtos.UpdateCabangRequest) (*dtos.SuperCabangResponse, error) {
	r, err := s.repo.UpdateCabang(ctx, id, repositories.CabangUpdate{
		Nama: req.Nama, Alamat: req.Alamat, NoTelp: req.NoTelp,
		JamBuka: req.JamBuka, JamTutup: req.JamTutup,
	})
	if err != nil {
		return nil, err
	}
	if r == nil {
		return nil, common.NewAppError(http.StatusNotFound, "cabang not found")
	}
	out := mapCabang(*r)
	return &out, nil
}

func (s *superadminService) CreateTarif(ctx context.Context, cabangID int, req dtos.CreateTarifRequest) error {
	if err := s.repo.CreateTarif(ctx, cabangID, repositories.TarifCreate{
		HargaPerSatuan: req.HargaPerSatuan, LayananIDLayanan: req.LayananIDLayanan,
	}); err != nil {
		return common.NewAppError(http.StatusBadRequest, err.Error())
	}
	return nil
}

func (s *superadminService) UpdateTarif(ctx context.Context, cabangID int, req dtos.UpdateTarifRequest) error {
	if err := s.repo.UpdateTarif(ctx, cabangID, req.IDTarif, repositories.TarifUpdate{
		HargaPerSatuan: req.HargaPerSatuan, LayananIDLayanan: req.LayananIDLayanan,
	}); err != nil {
		return common.NewAppError(http.StatusBadRequest, err.Error())
	}
	return nil
}

// Payments ------------------------------------------------------------------

func (s *superadminService) ListPayments(ctx context.Context, method, search string, page, limit int) ([]dtos.SuperPaymentResponse, error) {
	rows, err := s.repo.ListPaymentsAll(ctx, method, search, limit, offsetOf(page, limit))
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperPaymentResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.SuperPaymentResponse{
			ID: r.ID, PesananID: r.PesananID, PelangganNama: r.PelangganNama,
			PelangganTelp: r.PelangganTelp, Waktu: r.Waktu, Metode: r.Metode,
			Jumlah: r.Jumlah, NamaCabang: r.NamaCabang,
		}
	}
	return out, nil
}

func (s *superadminService) PaymentByCustomerForCabang(ctx context.Context, cabangID, page, limit int) ([]dtos.SuperPaymentByCustomerResponse, error) {
	rows, err := s.repo.PaymentByCustomerForCabang(ctx, cabangID, limit, offsetOf(page, limit))
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperPaymentByCustomerResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.SuperPaymentByCustomerResponse{
			PelangganID: r.PelangganID, PelangganNama: r.PelangganNama,
			TotalOrder: r.TotalOrder, TotalPayment: r.TotalPayment,
		}
	}
	return out, nil
}

// Customers -----------------------------------------------------------------

func (s *superadminService) ListCustomers(ctx context.Context, search string, page, limit int) ([]dtos.SuperCustomerResponse, error) {
	rows, err := s.repo.ListCustomers(ctx, search, limit, offsetOf(page, limit))
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperCustomerResponse, len(rows))
	for i, r := range rows {
		out[i] = mapCustomerStat(r)
	}
	return out, nil
}

func mapCustomerStat(r repositories.CustomerStatRow) dtos.SuperCustomerResponse {
	return dtos.SuperCustomerResponse{
		ID: r.ID, Nama: r.Nama, Email: r.Email, NoTelp: r.NoTelp, Alamat: r.Alamat,
		TotalOrder: r.TotalOrder, TotalSpend: r.TotalSpend, AvgRating: r.AvgRating,
		LastOrder: r.LastOrder,
	}
}

func (s *superadminService) GetCustomer(ctx context.Context, id int) (*dtos.SuperCustomerDetailResponse, error) {
	stat, orders, err := s.repo.GetCustomerDetail(ctx, id)
	if err != nil {
		return nil, err
	}
	if stat == nil {
		return nil, common.NewAppError(http.StatusNotFound, "customer not found")
	}
	history := make([]dtos.SuperCustomerOrderHistoryResponse, len(orders))
	for i, o := range orders {
		history[i] = dtos.SuperCustomerOrderHistoryResponse{
			IDPesanan: o.IDPesanan, Status: o.Status, TotalHarga: o.TotalHarga,
			EstimasiSelesai: o.EstimasiSelesai, NamaCabang: o.NamaCabang,
		}
	}
	return &dtos.SuperCustomerDetailResponse{
		SuperCustomerResponse: mapCustomerStat(*stat),
		OrderHistory:          history,
	}, nil
}

// Catalog -------------------------------------------------------------------

func (s *superadminService) ListLayanan(ctx context.Context) ([]dtos.SuperLayananResponse, error) {
	rows, err := s.repo.ListLayanan(ctx)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.SuperLayananResponse, len(rows))
	for i, r := range rows {
		out[i] = dtos.SuperLayananResponse{
			ID: r.ID, Nama: r.Nama, Satuan: r.Satuan, Deskripsi: r.Deskripsi,
		}
	}
	return out, nil
}
