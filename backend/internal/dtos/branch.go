package dtos

import "time"

// ============================================================================
// Branch (admin per cabang) DTOs. Wire format is camelCase to match the
// frontend types in `src/app/lib/api/types.ts`.
//
// Note: schema doesn't carry `ulasan.waktu_ulasan`, so the review DTOs omit
// that field; ordering is by id_ulasan DESC. Payment status filter uses
// 'Lunas' (existing convention) — the admin doc says 'paid' but we keep the
// codebase convention without altering migrations/customer flow.
// ============================================================================

// --- Dashboard --------------------------------------------------------------

type OrderStatistikResponse struct {
	TodaysOrder   int     `json:"todaysOrder"`
	TodaysRevenue float64 `json:"todaysRevenue"`
}

type PelangganRingkasResponse struct {
	ID     int    `json:"id"`
	Nama   string `json:"nama"`
	NoTelp string `json:"noTelp"`
}

type AdminOrderResponse struct {
	ID              int                      `json:"id"`
	Status          string                   `json:"status"`
	JumlahItem      int                      `json:"jumlahItem"`
	EstimasiSelesai time.Time                `json:"estimasiSelesai"`
	TotalHarga      float64                  `json:"totalHarga"`
	Catatan         string                   `json:"catatan"`
	VoucherID       *int                     `json:"voucherId"`
	PegawaiID       int                      `json:"pegawaiId"`
	Pelanggan       PelangganRingkasResponse `json:"pelanggan"`
}

type OrderStatusCountResponse struct {
	Status string `json:"status"`
	Count  int    `json:"count"`
}

type OrderStatusStatistikResponse struct {
	Total  int                        `json:"total"`
	Counts []OrderStatusCountResponse `json:"counts"`
}

// --- Order detail -----------------------------------------------------------

type AdminOrderItemResponse struct {
	ID          int     `json:"id"`
	LayananNama string  `json:"layananNama"`
	Satuan      string  `json:"satuan"`
	Kuantitas   int     `json:"kuantitas"`
	Subtotal    float64 `json:"subtotal"`
	Catatan     *string `json:"catatan"`
	TarifID     int     `json:"tarifId"`
}

type AdminPembayaranResponse struct {
	ID     int       `json:"id"`
	Waktu  time.Time `json:"waktu"`
	Metode string    `json:"metode"`
	Status string    `json:"status"`
	Jumlah float64   `json:"jumlah"`
}

type AdminOrderDetailResponse struct {
	AdminOrderResponse
	Items      []AdminOrderItemResponse `json:"items"`
	Pembayaran *AdminPembayaranResponse `json:"pembayaran"`
}

// UpdateOrderDetailRequest is the body for PUT /branch/:cabangId/order/:pesananId/detail.
// pegawaiId is required (employee verification). PIN is intentionally absent.
type UpdateOrderDetailRequest struct {
	PegawaiID       int        `json:"pegawaiId" binding:"required"`
	Status          *string    `json:"status"`
	Catatan         *string    `json:"catatan"`
	EstimasiSelesai *time.Time `json:"estimasiSelesai"`
	TotalHarga      *float64   `json:"totalHarga"`
	JumlahItem      *int       `json:"jumlahItem"`
	VoucherID       *int       `json:"voucherId"`
}

// --- Payments ---------------------------------------------------------------

type AdminPaymentLedgerResponse struct {
	ID              int       `json:"id"`
	PesananID       int       `json:"pesananId"`
	PelangganNama   string    `json:"pelangganNama"`
	PelangganNoTelp string    `json:"pelangganNoTelp"`
	Waktu           time.Time `json:"waktu"`
	Metode          string    `json:"metode"`
	Jumlah          float64   `json:"jumlah"`
}

type PaymentByCustomerResponse struct {
	PelangganID   int     `json:"pelangganId"`
	PelangganNama string  `json:"pelangganNama"`
	TotalOrder    int     `json:"totalOrder"`
	TotalPayment  float64 `json:"totalPayment"`
}

type PaymentMethodChartItemResponse struct {
	Metode       string  `json:"metode"`
	TotalEntries int     `json:"totalEntries"`
	Persentase   float64 `json:"persentase"`
}

type PaymentTotalResponse struct {
	Total float64 `json:"total"`
}

type PaymentAverageResponse struct {
	Average float64 `json:"average"`
}

// --- Reviews ----------------------------------------------------------------

type UlasanAdminResponse struct {
	ID              int     `json:"id"`
	Rating          int     `json:"rating"`
	Komentar        string  `json:"komentar"`
	PesananID       int     `json:"pesananId"`
	PelangganID     int     `json:"pelangganId"`
	PelangganNama   string  `json:"pelangganNama"`
	PelangganEmail  string  `json:"pelangganEmail"`
	PegawaiID       int     `json:"pegawaiId"`
	PegawaiNama     string  `json:"pegawaiNama"`
	LayananNama     *string `json:"layananNama"`
}

type UlasanDistribusiResponse struct {
	Rating1 int `json:"rating1"`
	Rating2 int `json:"rating2"`
	Rating3 int `json:"rating3"`
	Rating4 int `json:"rating4"`
	Rating5 int `json:"rating5"`
	Total   int `json:"total"`
}

type UlasanAverageResponse struct {
	AverageRating float64 `json:"averageRating"`
	Rating1       int     `json:"rating1"`
	Rating2       int     `json:"rating2"`
	Rating3       int     `json:"rating3"`
	Rating4       int     `json:"rating4"`
	Rating5       int     `json:"rating5"`
	TotalUlasan   int     `json:"totalUlasan"`
}

// --- Staff ------------------------------------------------------------------

type AdminPegawaiResponse struct {
	ID       int    `json:"id"`
	Nama     string `json:"nama"`
	Email    string `json:"email"`
	NoTelp   string `json:"noTelp"`
	Alamat   string `json:"alamat"`
	CabangID int    `json:"cabangId"`
}
