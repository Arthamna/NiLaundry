package dtos

import "time"

// ============================================================================
// Superadmin DTOs — wire format for `/admin/...` endpoints (PDF originally
// said `/superadmin/`, renamed to match frontend `(user)/admin/` convention).
//
// Conventions:
//   - status_pembayaran filter is 'Lunas' (codebase convention; PDF said 'paid').
//   - status_pesanan='aktif' in PDF means status='processing' here (narrow).
//   - Field names camelCase to match frontend types.ts.
// ============================================================================

// --- Dashboard --------------------------------------------------------------

type SuperStatistikUmumResponse struct {
	RevenueToday     float64 `json:"revenueToday"`
	RevenueThisMonth float64 `json:"revenueThisMonth"`
	OrderToday       int     `json:"orderToday"`
	AverageRating    float64 `json:"averageRating"`
}

type SuperStatistikLayananResponse struct {
	IDLayanan    int     `json:"idLayanan"`
	NamaLayanan  string  `json:"namaLayanan"`
	TotalPesanan int     `json:"totalPesanan"`
	TotalRevenue float64 `json:"totalRevenue"`
}

type SuperLiveOrderResponse struct {
	IDPesanan       int       `json:"id"`
	NamaPelanggan   string    `json:"customer"`
	NamaCabang      string    `json:"branch"`
	Status          string    `json:"status"`
	EstimasiSelesai time.Time `json:"deadline"`
	TotalHarga      float64   `json:"total"`
}

type SuperTopCabangResponse struct {
	IDCabang     int     `json:"idCabang"`
	NamaCabang   string  `json:"namaCabang"`
	TotalOrder   int     `json:"totalOrder"`
	TotalRevenue float64 `json:"totalRevenue"`
}

type SuperPaymentMixResponse struct {
	Metode       string  `json:"metode"`
	TotalEntries int     `json:"totalEntries"`
	Persentase   float64 `json:"persentase"`
}

type SuperLiveOrdersPerCabangResponse struct {
	IDCabang        int    `json:"idCabang"`
	NamaCabang      string `json:"namaCabang"`
	TotalLiveOrders int    `json:"totalLiveOrders"`
}

// --- Orders -----------------------------------------------------------------

type SuperPesananResponse struct {
	IDPesanan              int       `json:"id"`
	JumlahItemPesanan      int       `json:"jumlahItem"`
	StatusPesanan          string    `json:"status"`
	CatatanPesanan         string    `json:"catatan"`
	EstimasiSelesaiPesanan time.Time `json:"estimasiSelesai"`
	TotalHargaPesanan      float64   `json:"totalHarga"`
	PelangganID            int       `json:"pelangganId"`
	VoucherID              *int      `json:"voucherId"`
	PegawaiID              int       `json:"pegawaiId"`
	NamaPelanggan          string    `json:"namaPelanggan"`
	NoTelpPelanggan        string    `json:"noTelpPelanggan"`
	NamaPegawai            string    `json:"namaPegawai"`
	NamaCabang             string    `json:"namaCabang"`
	IDCabang               int       `json:"idCabang"`
}

type SuperOrdersStatsResponse struct {
	Total      int `json:"total"`
	Pickup     int `json:"pickup"`
	Processing int `json:"processing"`
	Delivery   int `json:"delivery"`
	Completed  int `json:"completed"`
}

// --- Voucher ----------------------------------------------------------------

type SuperVoucherResponse struct {
	ID            int       `json:"id"`
	Kode          string    `json:"kode"`
	TipeDiskon    string    `json:"tipeDiskon"`
	NilaiDiskon   float64   `json:"nilaiDiskon"`
	MinPembelian  float64   `json:"minPembelian"`
	BerlakuHingga time.Time `json:"berlakuHingga"`
	Kuota         int       `json:"kuota"`
	Terpakai      int       `json:"terpakai"`
}

type SuperVoucherStatResponse struct {
	ActiveVoucherWeek         int     `json:"activeVoucherWeek"`
	TotalCustomerSave         float64 `json:"totalCustomerSave"`
	WaktuKadaluarsaTerdekat   string  `json:"waktuKadaluarsaTerdekat"` // ISO 8601 duration-ish string
	WaktuKadaluarsaTerdekatHrs float64 `json:"waktuKadaluarsaTerdekatHours"`
}

type CreateVoucherRequest struct {
	Kode          string    `json:"kode" binding:"required"`
	TipeDiskon    string    `json:"tipeDiskon" binding:"required"`
	NilaiDiskon   float64   `json:"nilaiDiskon" binding:"required"`
	MinPembelian  float64   `json:"minPembelian"`
	BerlakuHingga time.Time `json:"berlakuHingga" binding:"required"`
	Kuota         int       `json:"kuota" binding:"required"`
}

// --- Staffs -----------------------------------------------------------------

type SuperPegawaiResponse struct {
	ID         int    `json:"id"`
	Nama       string `json:"nama"`
	Email      string `json:"email"`
	NoTelp     string `json:"noTelp"`
	Alamat     string `json:"alamat"`
	CabangID   int    `json:"cabangId"`
	CabangNama string `json:"cabangNama"`
}

type CreatePegawaiRequest struct {
	Nama     string `json:"nama" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	NoTelp   string `json:"noTelp" binding:"required"`
	Alamat   string `json:"alamat" binding:"required"`
	CabangID int    `json:"cabangId" binding:"required"`
}

type UpdatePegawaiRequest struct {
	Nama     *string `json:"nama"`
	Email    *string `json:"email" binding:"omitempty,email"`
	NoTelp   *string `json:"noTelp"`
	Alamat   *string `json:"alamat"`
	CabangID *int    `json:"cabangId"`
}

// --- Couriers ---------------------------------------------------------------

type SuperKurirResponse struct {
	ID               int    `json:"id"`
	Nama             string `json:"nama"`
	NoTelp           string `json:"noTelp"`
	NoPlat           string `json:"noPlat"`
	TipeKendaraanID  int    `json:"tipeKendaraanId"`
	JenisKendaraan   string `json:"jenisKendaraan"`
}

type CreateKurirRequest struct {
	Nama            string `json:"nama" binding:"required"`
	NoTelp          string `json:"noTelp" binding:"required"`
	NoPlat          string `json:"noPlat" binding:"required"`
	TipeKendaraanID int    `json:"tipeKendaraanId" binding:"required"`
}

type UpdateKurirRequest struct {
	Nama            *string `json:"nama"`
	NoTelp          *string `json:"noTelp"`
	NoPlat          *string `json:"noPlat"`
	TipeKendaraanID *int    `json:"tipeKendaraanId"`
}

type SuperTipeKendaraanResponse struct {
	ID              int    `json:"id"`
	JenisKendaraan  string `json:"jenisKendaraan"`
}

// --- Branches ---------------------------------------------------------------

type SuperCabangResponse struct {
	ID         int    `json:"id"`
	Nama       string `json:"nama"`
	Alamat     string `json:"alamat"`
	NoTelp     string `json:"noTelp"`
	JamBuka    string `json:"jamBuka"`
	JamTutup   string `json:"jamTutup"`
}

type SuperCabangPerformanceResponse struct {
	IDCabang     int     `json:"idCabang"`
	NamaCabang   string  `json:"namaCabang"`
	TotalOrder   int     `json:"totalOrder"`
	TotalRevenue float64 `json:"totalRevenue"`
	TotalPaid    float64 `json:"totalPaid"`
}

type SuperCabangServiceResponse struct {
	IDLayanan        int     `json:"idLayanan"`
	NamaLayanan      string  `json:"namaLayanan"`
	SatuanLayanan    string  `json:"satuanLayanan"`
	DeskripsiLayanan *string `json:"deskripsiLayanan"`
	IDTarif          int     `json:"idTarif"`
	HargaPerSatuan   float64 `json:"hargaPerSatuan"`
	TotalItem        int     `json:"totalItem"`
	TotalRevenue     float64 `json:"totalRevenue"`
}

type CreateCabangRequest struct {
	Nama     string `json:"nama" binding:"required"`
	Alamat   string `json:"alamat" binding:"required"`
	NoTelp   string `json:"noTelp" binding:"required"`
	JamBuka  string `json:"jamBuka" binding:"required"`  // "08:00"
	JamTutup string `json:"jamTutup" binding:"required"` // "21:00"
}

type UpdateCabangRequest struct {
	Nama     *string `json:"nama"`
	Alamat   *string `json:"alamat"`
	NoTelp   *string `json:"noTelp"`
	JamBuka  *string `json:"jamBuka"`
	JamTutup *string `json:"jamTutup"`
}

type CreateTarifRequest struct {
	HargaPerSatuan   float64 `json:"hargaPerSatuan" binding:"required"`
	LayananIDLayanan int     `json:"layananIdLayanan" binding:"required"`
}

type UpdateTarifRequest struct {
	IDTarif          int      `json:"idTarif" binding:"required"`
	HargaPerSatuan   *float64 `json:"hargaPerSatuan"`
	LayananIDLayanan *int     `json:"layananIdLayanan"`
}

type SuperBranchReviewResponse struct {
	IDUlasan       int     `json:"id"`
	Rating         int     `json:"rating"`
	Komentar       string  `json:"komentar"`
	PesananID      int     `json:"pesananId"`
	PelangganNama  string  `json:"pelangganNama"`
	PegawaiNama    string  `json:"pegawaiNama"`
	LayananNama    *string `json:"layananNama"`
}

// --- Payments ---------------------------------------------------------------

type SuperPaymentResponse struct {
	ID            int       `json:"id"`
	PesananID     int       `json:"pesananId"`
	PelangganNama string    `json:"pelangganNama"`
	PelangganTelp string    `json:"pelangganNoTelp"`
	Waktu         time.Time `json:"waktu"`
	Metode        string    `json:"metode"`
	Jumlah        float64   `json:"jumlah"`
	NamaCabang    string    `json:"namaCabang"`
}

type SuperPaymentByCustomerResponse struct {
	PelangganID   int     `json:"pelangganId"`
	PelangganNama string  `json:"pelangganNama"`
	TotalOrder    int     `json:"totalOrder"`
	TotalPayment  float64 `json:"totalPayment"`
}

// --- Customers --------------------------------------------------------------

type SuperCustomerResponse struct {
	ID         int     `json:"id"`
	Nama       string  `json:"nama"`
	Email      string  `json:"email"`
	NoTelp     string  `json:"noTelp"`
	Alamat     string  `json:"alamat"`
	TotalOrder int     `json:"totalOrder"`
	TotalSpend float64 `json:"totalSpend"`
	AvgRating  float64 `json:"avgRating"`
	LastOrder  *time.Time `json:"lastOrder"`
}

type SuperCustomerOrderHistoryResponse struct {
	IDPesanan       int       `json:"id"`
	Status          string    `json:"status"`
	TotalHarga      float64   `json:"totalHarga"`
	EstimasiSelesai time.Time `json:"estimasiSelesai"`
	NamaCabang      string    `json:"namaCabang"`
}

type SuperCustomerDetailResponse struct {
	SuperCustomerResponse
	OrderHistory []SuperCustomerOrderHistoryResponse `json:"orderHistory"`
}

// --- Layanan catalog --------------------------------------------------------

type SuperLayananResponse struct {
	ID         int     `json:"id"`
	Nama       string  `json:"nama"`
	Satuan     string  `json:"satuan"`
	Deskripsi  *string `json:"deskripsi"`
}
