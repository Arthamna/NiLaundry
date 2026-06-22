package repositories

import (
	"context"
	"errors"
	"strings"
	"time"

	"gorm.io/gorm"
)

// SuperadminRepository owns every query for /admin/* endpoints. PDF originally
// said /superadmin/ — renamed to /admin/ to match frontend `(user)/admin/`
// (superadmin pages). Code applies these mappings:
//   - 'paid' (PDF) -> 'Lunas' (codebase trigger convention).
//   - 'aktif' (PDF) -> 'processing' (narrow definition per user decision).
type SuperadminRepository interface {
	// Dashboard
	StatistikUmum(ctx context.Context) (SuperStatRow, error)
	StatistikLayananTop6(ctx context.Context) ([]ServiceStatRow, error)
	StatistikLiveOrdersPerCabang(ctx context.Context) ([]LiveOrdersPerCabangRow, error)
	AmbilTopCabang(ctx context.Context) ([]CabangStatRow, error)
	StatistikPembayaranToday(ctx context.Context) ([]PaymentMixRow, error)

	// Orders
	ListPesananAktif(ctx context.Context, page, limit int, status, search string) ([]PesananJoinRow, error)
	OrdersStats(ctx context.Context) (OrdersStatsRow, error)

	// Services
	ServiceStatsAll(ctx context.Context) ([]ServiceStatRow, error)

	// Vouchers
	ListVouchers(ctx context.Context) ([]VoucherRow, error)
	VouchersStatistik(ctx context.Context) (VoucherStatRow, error)
	CreateVoucher(ctx context.Context, v VoucherCreate) (*VoucherRow, error)
	GetVoucher(ctx context.Context, id int) (*VoucherRow, error)
	UpdateVoucher(ctx context.Context, id int, v VoucherUpdate) (*VoucherRow, error)
	SoftDeleteVoucher(ctx context.Context, id int) (bool, error)

	// Staffs
	ListPegawaiAll(ctx context.Context) ([]PegawaiJoinRow, error)
	CreatePegawai(ctx context.Context, p PegawaiCreate) (*PegawaiJoinRow, error)
	UpdatePegawai(ctx context.Context, id int, p PegawaiUpdate) (*PegawaiJoinRow, error)
	SoftDeletePegawai(ctx context.Context, id int) (bool, error)

	// Couriers
	ListKurirAll(ctx context.Context) ([]KurirJoinRow, error)
	CreateKurir(ctx context.Context, k KurirCreate) (*KurirJoinRow, error)
	UpdateKurir(ctx context.Context, id int, k KurirUpdate) (*KurirJoinRow, error)
	SoftDeleteKurir(ctx context.Context, id int) (bool, error)
	ListTipeKendaraan(ctx context.Context) ([]TipeKendaraanRow, error)

	// Branches
	ListCabangAll(ctx context.Context) ([]CabangRow, error)
	GetCabangByID(ctx context.Context, id int) (*CabangRow, error)
	SoftDeleteCabang(ctx context.Context, id int) (bool, error)
	BranchPerformance(ctx context.Context) ([]CabangPerfRow, error)
	BranchServices(ctx context.Context, cabangID int) ([]CabangServiceRow, error)
	BranchReviews(ctx context.Context, cabangID, limit, offset int) ([]BranchReviewRow2, error)
	CreateCabang(ctx context.Context, c CabangCreate) (*CabangRow, error)
	UpdateCabang(ctx context.Context, id int, c CabangUpdate) (*CabangRow, error)
	CreateTarif(ctx context.Context, cabangID int, t TarifCreate) error
	UpdateTarif(ctx context.Context, cabangID, tarifID int, t TarifUpdate) error

	// Payments
	ListPaymentsAll(ctx context.Context, method, search string, limit, offset int) ([]PaymentJoinRow, error)
	PaymentByCustomerForCabang(ctx context.Context, cabangID, limit, offset int) ([]PaymentByCustomerRow, error)

	// Customers
	ListCustomers(ctx context.Context, search string, limit, offset int) ([]CustomerStatRow, error)
	GetCustomerDetail(ctx context.Context, id int) (*CustomerStatRow, []CustomerOrderRow, error)

	// Catalog
	ListLayanan(ctx context.Context) ([]LayananRow, error)
}

// --- Row types --------------------------------------------------------------

type SuperStatRow struct {
	RevenueToday     float64 `gorm:"column:revenue_today"`
	RevenueThisMonth float64 `gorm:"column:revenue_this_month"`
	OrderToday       int     `gorm:"column:order_today"`
	AverageRating    float64 `gorm:"column:average_rating"`
}

type ServiceStatRow struct {
	IDLayanan    int     `gorm:"column:id_layanan"`
	NamaLayanan  string  `gorm:"column:nama_layanan"`
	TotalPesanan int     `gorm:"column:total_pesanan"`
	TotalRevenue float64 `gorm:"column:total_revenue"`
}

type LiveOrdersPerCabangRow struct {
	IDCabang        int    `gorm:"column:id_cabang"`
	NamaCabang      string `gorm:"column:nama_cabang"`
	TotalLiveOrders int    `gorm:"column:total_live_orders"`
}

type CabangStatRow struct {
	IDCabang     int     `gorm:"column:id_cabang"`
	NamaCabang   string  `gorm:"column:nama_cabang"`
	TotalOrder   int     `gorm:"column:total_order"`
	TotalRevenue float64 `gorm:"column:total_revenue"`
}

type PaymentMixRow struct {
	Metode       string  `gorm:"column:metode_pembayaran"`
	TotalEntries int     `gorm:"column:total_entries"`
	Persentase   float64 `gorm:"column:persentase"`
}

type PesananJoinRow struct {
	IDPesanan              int       `gorm:"column:id_pesanan"`
	JumlahItemPesanan      int       `gorm:"column:jumlah_item_pesanan"`
	StatusPesanan          string    `gorm:"column:status_pesanan"`
	CatatanPesanan         string    `gorm:"column:catatan_pesanan"`
	EstimasiSelesaiPesanan time.Time `gorm:"column:estimasi_selesai_pesanan"`
	TotalHargaPesanan      float64   `gorm:"column:total_harga_pesanan"`
	PelangganIDPelanggan   int       `gorm:"column:pelanggan_id_pelanggan"`
	VoucherIDVoucher       *int      `gorm:"column:voucher_id_voucher"`
	PegawaiIDPegawai       int       `gorm:"column:pegawai_id_pegawai"`
	NamaPelanggan          string    `gorm:"column:nama_pelanggan"`
	NoTelpPelanggan        string    `gorm:"column:no_telp_pelanggan"`
	NamaPegawai            string    `gorm:"column:nama_pegawai"`
	NamaCabang             string    `gorm:"column:nama_cabang"`
	IDCabang               int       `gorm:"column:id_cabang"`
}

type OrdersStatsRow struct {
	Total      int
	Pickup     int
	Processing int
	Delivery   int
	Completed  int
}

type VoucherRow struct {
	ID            int       `gorm:"column:id_voucher"`
	Kode          string    `gorm:"column:kode_voucher"`
	TipeDiskon    string    `gorm:"column:tipe_diskon_voucher"`
	NilaiDiskon   float64   `gorm:"column:nilai_diskon_voucher"`
	MinPembelian  float64   `gorm:"column:min_pembelian_voucher"`
	BerlakuHingga time.Time `gorm:"column:berlaku_hingga_voucher"`
	Kuota         int       `gorm:"column:kuota_voucher"`
	Terpakai      int       `gorm:"column:terpakai_voucher"`
}

type VoucherStatRow struct {
	ActiveVoucherWeek  int
	TotalCustomerSave  float64
	NearestExpiryHours float64
}

type VoucherCreate struct {
	Kode          string
	TipeDiskon    string
	NilaiDiskon   float64
	MinPembelian  float64
	BerlakuHingga time.Time
	Kuota         int
}

type VoucherUpdate struct {
	Kode          *string
	TipeDiskon    *string
	NilaiDiskon   *float64
	MinPembelian  *float64
	BerlakuHingga *time.Time
	Kuota         *int
}

type PegawaiJoinRow struct {
	ID         int    `gorm:"column:id_pegawai"`
	Nama       string `gorm:"column:nama_pegawai"`
	Email      string `gorm:"column:email_pegawai"`
	NoTelp     string `gorm:"column:no_telp_pegawai"`
	Alamat     string `gorm:"column:alamat_pegawai"`
	CabangID   int    `gorm:"column:cabang_laundry_id_cabang"`
	CabangNama string `gorm:"column:nama_cabang"`
}

type PegawaiCreate struct {
	Nama, Email, NoTelp, Alamat string
	CabangID                    int
}

type PegawaiUpdate struct {
	Nama, Email, NoTelp, Alamat *string
	CabangID                    *int
}

type KurirJoinRow struct {
	ID              int    `gorm:"column:id_kurir"`
	Nama            string `gorm:"column:nama_kurir"`
	NoTelp          string `gorm:"column:no_telp_kurir"`
	NoPlat          string `gorm:"column:no_plat_kurir"`
	TipeKendaraanID int    `gorm:"column:tipe_kendaraan_id_kendaraan"`
	JenisKendaraan  string `gorm:"column:jenis_kendaraan"`
}

type KurirCreate struct {
	Nama, NoTelp, NoPlat string
	TipeKendaraanID      int
}

type KurirUpdate struct {
	Nama, NoTelp, NoPlat *string
	TipeKendaraanID      *int
}

type TipeKendaraanRow struct {
	ID             int    `gorm:"column:id_kendaraan"`
	JenisKendaraan string `gorm:"column:jenis_kendaraan"`
}

type CabangRow struct {
	ID       int    `gorm:"column:id_cabang"`
	Nama     string `gorm:"column:nama_cabang"`
	Alamat   string `gorm:"column:alamat_cabang"`
	NoTelp   string `gorm:"column:no_telp_cabang"`
	// Postgres TIME columns are returned as strings by the pgx driver — there
	// is no implicit conversion to time.Time, so we scan into a string and
	// cast in SQL to the exact "HH:MM" shape via TO_CHAR.
	JamBuka  string `gorm:"column:jam_buka_cabang"`
	JamTutup string `gorm:"column:jam_tutup_cabang"`
}

type CabangCreate struct {
	Nama, Alamat, NoTelp string
	JamBuka, JamTutup    string // "HH:MM"
}

type CabangUpdate struct {
	Nama, Alamat, NoTelp *string
	JamBuka, JamTutup    *string
}

type CabangPerfRow struct {
	IDCabang     int     `gorm:"column:id_cabang"`
	NamaCabang   string  `gorm:"column:nama_cabang"`
	TotalOrder   int     `gorm:"column:total_order"`
	TotalRevenue float64 `gorm:"column:total_revenue"`
	TotalPaid    float64 `gorm:"column:total_paid"`
}

type CabangServiceRow struct {
	IDLayanan        int     `gorm:"column:id_layanan"`
	NamaLayanan      string  `gorm:"column:nama_layanan"`
	SatuanLayanan    string  `gorm:"column:satuan_layanan"`
	DeskripsiLayanan *string `gorm:"column:deskripsi_layanan"`
	IDTarif          int     `gorm:"column:id_tarif"`
	HargaPerSatuan   float64 `gorm:"column:harga_per_satuan"`
	TotalItem        int     `gorm:"column:total_item"`
	TotalRevenue     float64 `gorm:"column:total_revenue"`
}

type TarifCreate struct {
	HargaPerSatuan   float64
	LayananIDLayanan int
}

type TarifUpdate struct {
	HargaPerSatuan   *float64
	LayananIDLayanan *int
}

type BranchReviewRow2 struct {
	IDUlasan      int     `gorm:"column:id_ulasan"`
	Rating        int     `gorm:"column:rating_ulasan"`
	Komentar      string  `gorm:"column:komentar_ulasan"`
	PesananID     int     `gorm:"column:pesanan_id_pesanan"`
	PelangganNama string  `gorm:"column:nama_pelanggan"`
	PegawaiNama   string  `gorm:"column:nama_pegawai"`
	LayananNama   *string `gorm:"column:nama_layanan"`
}

type PaymentJoinRow struct {
	ID            int       `gorm:"column:id_pembayaran"`
	PesananID     int       `gorm:"column:pesanan_id_pesanan"`
	PelangganNama string    `gorm:"column:nama_pelanggan"`
	PelangganTelp string    `gorm:"column:no_telp_pelanggan"`
	Waktu         time.Time `gorm:"column:waktu_pembayaran"`
	Metode        string    `gorm:"column:metode_pembayaran"`
	Jumlah        float64   `gorm:"column:jumlah_pembayaran"`
	NamaCabang    string    `gorm:"column:nama_cabang"`
}

type PaymentByCustomerRow struct {
	PelangganID   int     `gorm:"column:id_pelanggan"`
	PelangganNama string  `gorm:"column:nama_pelanggan"`
	TotalOrder    int     `gorm:"column:total_order"`
	TotalPayment  float64 `gorm:"column:total_payment"`
}

type CustomerStatRow struct {
	ID         int        `gorm:"column:id_pelanggan"`
	Nama       string     `gorm:"column:nama_pelanggan"`
	Email      string     `gorm:"column:email_pelanggan"`
	NoTelp     string     `gorm:"column:no_telp_pelanggan"`
	Alamat     string     `gorm:"column:alamat_pelanggan"`
	TotalOrder int        `gorm:"column:total_order"`
	TotalSpend float64    `gorm:"column:total_spend"`
	AvgRating  float64    `gorm:"column:avg_rating"`
	LastOrder  *time.Time `gorm:"column:last_order"`
}

type CustomerOrderRow struct {
	IDPesanan       int       `gorm:"column:id_pesanan"`
	Status          string    `gorm:"column:status_pesanan"`
	TotalHarga      float64   `gorm:"column:total_harga_pesanan"`
	EstimasiSelesai time.Time `gorm:"column:estimasi_selesai_pesanan"`
	NamaCabang      string    `gorm:"column:nama_cabang"`
}

type LayananRow struct {
	ID        int     `gorm:"column:id_layanan"`
	Nama      string  `gorm:"column:nama_layanan"`
	Satuan    string  `gorm:"column:satuan_layanan"`
	Deskripsi *string `gorm:"column:deskripsi_layanan"`
}

// --- impl -------------------------------------------------------------------

type superadminRepo struct{ db *gorm.DB }

func NewSuperadminRepository(db *gorm.DB) SuperadminRepository {
	return &superadminRepo{db: db}
}

// Dashboard -----------------------------------------------------------------

func (r *superadminRepo) StatistikUmum(ctx context.Context) (SuperStatRow, error) {
	const q = `
		SELECT
			COALESCE((
				SELECT SUM(b.jumlah_pembayaran)::float8
				FROM pembayaran b
				WHERE LOWER(b.status_pembayaran) = 'lunas'
				  AND b.waktu_pembayaran::date = CURRENT_DATE
			), 0) AS revenue_today,
			COALESCE((
				SELECT SUM(b.jumlah_pembayaran)::float8
				FROM pembayaran b
				WHERE LOWER(b.status_pembayaran) = 'lunas'
				  AND date_trunc('month', b.waktu_pembayaran) = date_trunc('month', CURRENT_DATE)
			), 0) AS revenue_this_month,
			COALESCE((
				SELECT COUNT(DISTINCT p.id_pesanan)::int
				FROM pesanan p
				JOIN pembayaran b ON b.pesanan_id_pesanan = p.id_pesanan
				WHERE LOWER(b.status_pembayaran) = 'lunas'
				  AND b.waktu_pembayaran::date = CURRENT_DATE
			), 0) AS order_today,
			COALESCE((
				SELECT ROUND(AVG(u.rating_ulasan)::numeric, 2)::float8
				FROM ulasan u
			), 0) AS average_rating`

	var out SuperStatRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&out).Error; err != nil {
		return SuperStatRow{}, err
	}
	return out, nil
}

func (r *superadminRepo) StatistikLayananTop6(ctx context.Context) ([]ServiceStatRow, error) {
	const q = `
		SELECT
			l.id_layanan,
			l.nama_layanan,
			COUNT(ip.id_item_pesanan) AS total_pesanan,
			COALESCE(SUM(ip.subtotal_pesanan), 0)::float8 AS total_revenue
		FROM item_pesanan ip
		JOIN tarif t ON t.id_tarif = ip.tarif_id_tarif
		JOIN layanan l ON l.id_layanan = t.layanan_id_layanan
		GROUP BY l.id_layanan, l.nama_layanan
		ORDER BY total_pesanan DESC, total_revenue DESC
		LIMIT 6`

	var rows []ServiceStatRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *superadminRepo) StatistikLiveOrdersPerCabang(ctx context.Context) ([]LiveOrdersPerCabangRow, error) {
	// PDF: status_pesanan='aktif' -> codebase 'processing'.
	const q = `
		SELECT
			cl.id_cabang,
			cl.nama_cabang,
			COUNT(*) AS total_live_orders
		FROM pesanan p
		JOIN pegawai pg ON pg.id_pegawai = p.pegawai_id_pegawai
		JOIN cabang_laundry cl ON cl.id_cabang = pg.cabang_laundry_id_cabang
		WHERE p.status_pesanan = 'processing'
		GROUP BY cl.id_cabang, cl.nama_cabang
		ORDER BY total_live_orders DESC, cl.nama_cabang ASC`

	var rows []LiveOrdersPerCabangRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *superadminRepo) AmbilTopCabang(ctx context.Context) ([]CabangStatRow, error) {
	const q = `
		SELECT
			cl.id_cabang,
			cl.nama_cabang,
			COUNT(DISTINCT p.id_pesanan) AS total_order,
			COALESCE(SUM(p.total_harga_pesanan), 0)::float8 AS total_revenue
		FROM cabang_laundry cl
		JOIN pegawai pg ON pg.cabang_laundry_id_cabang = cl.id_cabang
		JOIN pesanan p ON p.pegawai_id_pegawai = pg.id_pegawai
		GROUP BY cl.id_cabang, cl.nama_cabang
		ORDER BY total_revenue DESC, total_order DESC`

	var rows []CabangStatRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *superadminRepo) StatistikPembayaranToday(ctx context.Context) ([]PaymentMixRow, error) {
	const q = `
		WITH total_entries AS (
			SELECT COUNT(*)::numeric AS total_count
			FROM pembayaran x
			WHERE LOWER(x.status_pembayaran) = 'lunas'
			  AND x.waktu_pembayaran::date = CURRENT_DATE
		)
		SELECT
			b.metode_pembayaran,
			COUNT(*) AS total_entries,
			ROUND(
				(COUNT(*)::numeric / NULLIF((SELECT total_count FROM total_entries), 0)) * 100,
				2
			)::float8 AS persentase
		FROM pembayaran b
		WHERE LOWER(b.status_pembayaran) = 'lunas'
		  AND b.waktu_pembayaran::date = CURRENT_DATE
		GROUP BY b.metode_pembayaran
		ORDER BY total_entries DESC, b.metode_pembayaran ASC`

	var rows []PaymentMixRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

// Orders --------------------------------------------------------------------

func (r *superadminRepo) ListPesananAktif(ctx context.Context, page, limit int, status, search string) ([]PesananJoinRow, error) {
	if limit <= 0 {
		limit = 20
	}
	if page < 1 {
		page = 1
	}
	offset := (page - 1) * limit

	var b strings.Builder
	b.WriteString(`
		SELECT
			p.id_pesanan,
			p.jumlah_item_pesanan,
			p.status_pesanan,
			p.catatan_pesanan,
			p.estimasi_selesai_pesanan,
			p.total_harga_pesanan,
			p.pelanggan_id_pelanggan,
			p.voucher_id_voucher,
			p.pegawai_id_pegawai,
			pl.nama_pelanggan,
			pl.no_telp_pelanggan,
			pg.nama_pegawai,
			cl.nama_cabang,
			cl.id_cabang
		FROM pesanan p
		JOIN pelanggan pl ON pl.id_pelanggan = p.pelanggan_id_pelanggan
		JOIN pegawai pg ON pg.id_pegawai = p.pegawai_id_pegawai
		JOIN cabang_laundry cl ON cl.id_cabang = pg.cabang_laundry_id_cabang
		WHERE 1=1`)

	args := []interface{}{}
	if status != "" {
		b.WriteString(` AND p.status_pesanan = ?`)
		args = append(args, status)
	}
	if search != "" {
		b.WriteString(` AND (pl.nama_pelanggan ILIKE ? OR CAST(p.id_pesanan AS TEXT) ILIKE ?)`)
		s := "%" + search + "%"
		args = append(args, s, s)
	}
	b.WriteString(` ORDER BY p.id_pesanan DESC LIMIT ? OFFSET ?`)
	args = append(args, limit, offset)

	var rows []PesananJoinRow
	if err := r.db.WithContext(ctx).Raw(b.String(), args...).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *superadminRepo) OrdersStats(ctx context.Context) (OrdersStatsRow, error) {
	const q = `
		SELECT
			COUNT(*) AS total,
			COUNT(*) FILTER (WHERE status_pesanan = 'pickup')     AS pickup,
			COUNT(*) FILTER (WHERE status_pesanan = 'processing') AS processing,
			COUNT(*) FILTER (WHERE status_pesanan = 'delivery')   AS delivery,
			COUNT(*) FILTER (WHERE status_pesanan = 'completed' OR status_pesanan = 'selesai') AS completed
		FROM pesanan`
	var out OrdersStatsRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&out).Error; err != nil {
		return OrdersStatsRow{}, err
	}
	return out, nil
}

// Services ------------------------------------------------------------------

func (r *superadminRepo) ServiceStatsAll(ctx context.Context) ([]ServiceStatRow, error) {
	// /admin/services powers both the chart and the ranking table on the
	// Services page — both display the top 6 layanan by order count, so the
	// LIMIT is enforced server-side.
	const q = `
		SELECT
			l.id_layanan,
			l.nama_layanan,
			COUNT(ip.id_item_pesanan) AS total_pesanan,
			COALESCE(SUM(ip.subtotal_pesanan), 0)::float8 AS total_revenue
		FROM layanan l
		LEFT JOIN tarif t ON t.layanan_id_layanan = l.id_layanan
		LEFT JOIN item_pesanan ip ON ip.tarif_id_tarif = t.id_tarif
		GROUP BY l.id_layanan, l.nama_layanan
		ORDER BY total_pesanan DESC, total_revenue DESC
		LIMIT 6`
	var rows []ServiceStatRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

// Vouchers ------------------------------------------------------------------

func (r *superadminRepo) ListVouchers(ctx context.Context) ([]VoucherRow, error) {
	const q = `
		SELECT id_voucher, kode_voucher, tipe_diskon_voucher, nilai_diskon_voucher,
		       min_pembelian_voucher, berlaku_hingga_voucher, kuota_voucher, terpakai_voucher
		FROM voucher
		WHERE deleted_at IS NULL
		ORDER BY id_voucher DESC`
	var rows []VoucherRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *superadminRepo) VouchersStatistik(ctx context.Context) (VoucherStatRow, error) {
	const q = `
		SELECT
			COUNT(*) FILTER (
				WHERE v.berlaku_hingga_voucher >= NOW()
				  AND v.berlaku_hingga_voucher < NOW() + INTERVAL '7 days'
			)::int AS active_voucher_week,
			COALESCE(SUM(v.nilai_diskon_voucher) FILTER (WHERE vp.voucher_id_voucher IS NOT NULL), 0)::float8 AS total_customer_save,
			COALESCE(EXTRACT(EPOCH FROM (MIN(v.berlaku_hingga_voucher) - NOW())) / 3600.0, 0)::float8 AS nearest_expiry_hours
		FROM voucher v
		LEFT JOIN voucher_pelanggan vp ON vp.voucher_id_voucher = v.id_voucher
		WHERE v.berlaku_hingga_voucher >= NOW()
		  AND v.deleted_at IS NULL`
	var out VoucherStatRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&out).Error; err != nil {
		return VoucherStatRow{}, err
	}
	return out, nil
}

func (r *superadminRepo) CreateVoucher(ctx context.Context, v VoucherCreate) (*VoucherRow, error) {
	// id_voucher is IDENTITY → let DB allocate.
	const q = `
		INSERT INTO voucher (
			kode_voucher, tipe_diskon_voucher, nilai_diskon_voucher,
			min_pembelian_voucher, berlaku_hingga_voucher, kuota_voucher, terpakai_voucher
		) VALUES (?, ?, ?, ?, ?, ?, 0)
		RETURNING id_voucher, kode_voucher, tipe_diskon_voucher, nilai_diskon_voucher,
		          min_pembelian_voucher, berlaku_hingga_voucher, kuota_voucher, terpakai_voucher`
	var out VoucherRow
	if err := r.db.WithContext(ctx).Raw(q,
		v.Kode, v.TipeDiskon, v.NilaiDiskon, v.MinPembelian, v.BerlakuHingga, v.Kuota,
	).Scan(&out).Error; err != nil {
		return nil, err
	}
	return &out, nil
}

func (r *superadminRepo) GetVoucher(ctx context.Context, id int) (*VoucherRow, error) {
	return r.findVoucherByID(ctx, id)
}

func (r *superadminRepo) findVoucherByID(ctx context.Context, id int) (*VoucherRow, error) {
	const q = `
		SELECT id_voucher, kode_voucher, tipe_diskon_voucher, nilai_diskon_voucher,
		       min_pembelian_voucher, berlaku_hingga_voucher, kuota_voucher, terpakai_voucher
		FROM voucher WHERE id_voucher = ? AND deleted_at IS NULL`
	var row VoucherRow
	if err := r.db.WithContext(ctx).Raw(q, id).Scan(&row).Error; err != nil {
		return nil, err
	}
	if row.ID == 0 {
		return nil, nil
	}
	return &row, nil
}

func (r *superadminRepo) UpdateVoucher(ctx context.Context, id int, v VoucherUpdate) (*VoucherRow, error) {
	const q = `
		UPDATE voucher SET
			kode_voucher = COALESCE(?, kode_voucher),
			tipe_diskon_voucher = COALESCE(?, tipe_diskon_voucher),
			nilai_diskon_voucher = COALESCE(?, nilai_diskon_voucher),
			min_pembelian_voucher = COALESCE(?, min_pembelian_voucher),
			berlaku_hingga_voucher = COALESCE(?, berlaku_hingga_voucher),
			kuota_voucher = COALESCE(?, kuota_voucher)
		WHERE id_voucher = ?`
	if err := r.db.WithContext(ctx).Exec(q,
		v.Kode, v.TipeDiskon, v.NilaiDiskon, v.MinPembelian, v.BerlakuHingga, v.Kuota, id,
	).Error; err != nil {
		return nil, err
	}
	return r.findVoucherByID(ctx, id)
}

// SoftDeleteVoucher marks a voucher deleted. Returns false when no active row
// matched (already deleted / nonexistent). Soft delete keeps historical orders
// and customer claims that reference the voucher intact.
func (r *superadminRepo) SoftDeleteVoucher(ctx context.Context, id int) (bool, error) {
	res := r.db.WithContext(ctx).Exec(
		`UPDATE voucher SET deleted_at = NOW() WHERE id_voucher = ? AND deleted_at IS NULL`, id)
	if res.Error != nil {
		return false, res.Error
	}
	return res.RowsAffected > 0, nil
}

// Staffs --------------------------------------------------------------------

func (r *superadminRepo) ListPegawaiAll(ctx context.Context) ([]PegawaiJoinRow, error) {
	const q = `
		SELECT pg.id_pegawai, pg.nama_pegawai, pg.email_pegawai, pg.no_telp_pegawai,
		       pg.alamat_pegawai, pg.cabang_laundry_id_cabang, cl.nama_cabang
		FROM pegawai pg
		LEFT JOIN cabang_laundry cl ON cl.id_cabang = pg.cabang_laundry_id_cabang
		WHERE pg.deleted_at IS NULL
		ORDER BY pg.id_pegawai DESC`
	var rows []PegawaiJoinRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *superadminRepo) CreatePegawai(ctx context.Context, p PegawaiCreate) (*PegawaiJoinRow, error) {
	// id_pegawai is plain INT (no IDENTITY) — allocate manually inside tx.
	var newID int
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Raw(`SELECT COALESCE(MAX(id_pegawai), 0) + 1 FROM pegawai`).Scan(&newID).Error; err != nil {
			return err
		}
		return tx.Exec(`
			INSERT INTO pegawai (id_pegawai, nama_pegawai, email_pegawai, no_telp_pegawai, alamat_pegawai, cabang_laundry_id_cabang)
			VALUES (?, ?, ?, ?, ?, ?)`,
			newID, p.Nama, p.Email, p.NoTelp, p.Alamat, p.CabangID).Error
	})
	if err != nil {
		return nil, err
	}
	return r.findPegawaiByID(ctx, newID)
}

func (r *superadminRepo) UpdatePegawai(ctx context.Context, id int, p PegawaiUpdate) (*PegawaiJoinRow, error) {
	const q = `
		UPDATE pegawai SET
			nama_pegawai = COALESCE(?, nama_pegawai),
			email_pegawai = COALESCE(?, email_pegawai),
			no_telp_pegawai = COALESCE(?, no_telp_pegawai),
			alamat_pegawai = COALESCE(?, alamat_pegawai),
			cabang_laundry_id_cabang = COALESCE(?, cabang_laundry_id_cabang)
		WHERE id_pegawai = ?`
	if err := r.db.WithContext(ctx).Exec(q,
		p.Nama, p.Email, p.NoTelp, p.Alamat, p.CabangID, id,
	).Error; err != nil {
		return nil, err
	}
	return r.findPegawaiByID(ctx, id)
}

func (r *superadminRepo) findPegawaiByID(ctx context.Context, id int) (*PegawaiJoinRow, error) {
	const q = `
		SELECT pg.id_pegawai, pg.nama_pegawai, pg.email_pegawai, pg.no_telp_pegawai,
		       pg.alamat_pegawai, pg.cabang_laundry_id_cabang, cl.nama_cabang
		FROM pegawai pg
		LEFT JOIN cabang_laundry cl ON cl.id_cabang = pg.cabang_laundry_id_cabang
		WHERE pg.id_pegawai = ? AND pg.deleted_at IS NULL`
	var row PegawaiJoinRow
	if err := r.db.WithContext(ctx).Raw(q, id).Scan(&row).Error; err != nil {
		return nil, err
	}
	if row.ID == 0 {
		return nil, nil
	}
	return &row, nil
}

// SoftDeletePegawai marks a staff row deleted. Returns false when no active row
// matched (already deleted / nonexistent). Historical orders keep referencing it.
func (r *superadminRepo) SoftDeletePegawai(ctx context.Context, id int) (bool, error) {
	res := r.db.WithContext(ctx).Exec(
		`UPDATE pegawai SET deleted_at = NOW() WHERE id_pegawai = ? AND deleted_at IS NULL`, id)
	if res.Error != nil {
		return false, res.Error
	}
	return res.RowsAffected > 0, nil
}

// Couriers ------------------------------------------------------------------

func (r *superadminRepo) ListKurirAll(ctx context.Context) ([]KurirJoinRow, error) {
	const q = `
		SELECT k.id_kurir, k.nama_kurir, k.no_telp_kurir, k.no_plat_kurir,
		       k.tipe_kendaraan_id_kendaraan, tk.jenis_kendaraan
		FROM kurir k
		JOIN tipe_kendaraan tk ON tk.id_kendaraan = k.tipe_kendaraan_id_kendaraan
		WHERE k.deleted_at IS NULL
		ORDER BY k.id_kurir DESC`
	var rows []KurirJoinRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *superadminRepo) CreateKurir(ctx context.Context, k KurirCreate) (*KurirJoinRow, error) {
	var newID int
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Raw(`SELECT COALESCE(MAX(id_kurir), 0) + 1 FROM kurir`).Scan(&newID).Error; err != nil {
			return err
		}
		return tx.Exec(`
			INSERT INTO kurir (id_kurir, nama_kurir, no_telp_kurir, no_plat_kurir, tipe_kendaraan_id_kendaraan)
			VALUES (?, ?, ?, ?, ?)`,
			newID, k.Nama, k.NoTelp, k.NoPlat, k.TipeKendaraanID).Error
	})
	if err != nil {
		return nil, err
	}
	return r.findKurirByID(ctx, newID)
}

func (r *superadminRepo) UpdateKurir(ctx context.Context, id int, k KurirUpdate) (*KurirJoinRow, error) {
	const q = `
		UPDATE kurir SET
			nama_kurir = COALESCE(?, nama_kurir),
			no_telp_kurir = COALESCE(?, no_telp_kurir),
			no_plat_kurir = COALESCE(?, no_plat_kurir),
			tipe_kendaraan_id_kendaraan = COALESCE(?, tipe_kendaraan_id_kendaraan)
		WHERE id_kurir = ?`
	if err := r.db.WithContext(ctx).Exec(q,
		k.Nama, k.NoTelp, k.NoPlat, k.TipeKendaraanID, id,
	).Error; err != nil {
		return nil, err
	}
	return r.findKurirByID(ctx, id)
}

func (r *superadminRepo) findKurirByID(ctx context.Context, id int) (*KurirJoinRow, error) {
	const q = `
		SELECT k.id_kurir, k.nama_kurir, k.no_telp_kurir, k.no_plat_kurir,
		       k.tipe_kendaraan_id_kendaraan, tk.jenis_kendaraan
		FROM kurir k
		JOIN tipe_kendaraan tk ON tk.id_kendaraan = k.tipe_kendaraan_id_kendaraan
		WHERE k.id_kurir = ? AND k.deleted_at IS NULL`
	var row KurirJoinRow
	if err := r.db.WithContext(ctx).Raw(q, id).Scan(&row).Error; err != nil {
		return nil, err
	}
	if row.ID == 0 {
		return nil, nil
	}
	return &row, nil
}

// SoftDeleteKurir marks a courier row deleted. Returns false when no active row
// matched. Historical deliveries keep referencing it.
func (r *superadminRepo) SoftDeleteKurir(ctx context.Context, id int) (bool, error) {
	res := r.db.WithContext(ctx).Exec(
		`UPDATE kurir SET deleted_at = NOW() WHERE id_kurir = ? AND deleted_at IS NULL`, id)
	if res.Error != nil {
		return false, res.Error
	}
	return res.RowsAffected > 0, nil
}

func (r *superadminRepo) ListTipeKendaraan(ctx context.Context) ([]TipeKendaraanRow, error) {
	const q = `SELECT id_kendaraan, jenis_kendaraan FROM tipe_kendaraan ORDER BY id_kendaraan ASC`
	var rows []TipeKendaraanRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

// Branches ------------------------------------------------------------------

func (r *superadminRepo) ListCabangAll(ctx context.Context) ([]CabangRow, error) {
	const q = `
		SELECT
			id_cabang,
			nama_cabang,
			alamat_cabang,
			no_telp_cabang,
			TO_CHAR(jam_buka_cabang,  'HH24:MI') AS jam_buka_cabang,
			TO_CHAR(jam_tutup_cabang, 'HH24:MI') AS jam_tutup_cabang
		FROM cabang_laundry
		WHERE deleted_at IS NULL
		ORDER BY id_cabang DESC`
	var rows []CabangRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *superadminRepo) GetCabangByID(ctx context.Context, id int) (*CabangRow, error) {
	const q = `
		SELECT
			id_cabang,
			nama_cabang,
			alamat_cabang,
			no_telp_cabang,
			TO_CHAR(jam_buka_cabang,  'HH24:MI') AS jam_buka_cabang,
			TO_CHAR(jam_tutup_cabang, 'HH24:MI') AS jam_tutup_cabang
		FROM cabang_laundry
		WHERE id_cabang = ? AND deleted_at IS NULL`
	var row CabangRow
	err := r.db.WithContext(ctx).Raw(q, id).Scan(&row).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	if row.ID == 0 {
		return nil, nil
	}
	return &row, nil
}

// SoftDeleteCabang marks a branch row deleted. Returns false when no active row
// matched. Historical orders/payments keep referencing it.
func (r *superadminRepo) SoftDeleteCabang(ctx context.Context, id int) (bool, error) {
	res := r.db.WithContext(ctx).Exec(
		`UPDATE cabang_laundry SET deleted_at = NOW() WHERE id_cabang = ? AND deleted_at IS NULL`, id)
	if res.Error != nil {
		return false, res.Error
	}
	return res.RowsAffected > 0, nil
}

func (r *superadminRepo) BranchPerformance(ctx context.Context) ([]CabangPerfRow, error) {
	const q = `
		SELECT
			cl.id_cabang,
			cl.nama_cabang,
			COUNT(DISTINCT p.id_pesanan) AS total_order,
			COALESCE(SUM(p.total_harga_pesanan), 0)::float8 AS total_revenue,
			COALESCE(SUM(b.jumlah_pembayaran), 0)::float8 AS total_paid
		FROM cabang_laundry cl
		LEFT JOIN pegawai pg ON pg.cabang_laundry_id_cabang = cl.id_cabang
		LEFT JOIN pesanan p ON p.pegawai_id_pegawai = pg.id_pegawai
		LEFT JOIN pembayaran b
		  ON b.pesanan_id_pesanan = p.id_pesanan
		 AND LOWER(b.status_pembayaran) = 'lunas'
		GROUP BY cl.id_cabang, cl.nama_cabang
		ORDER BY total_revenue DESC, total_order DESC`
	var rows []CabangPerfRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *superadminRepo) BranchServices(ctx context.Context, cabangID int) ([]CabangServiceRow, error) {
	const q = `
		SELECT
			l.id_layanan, l.nama_layanan, l.satuan_layanan, l.deskripsi_layanan,
			t.id_tarif, t.harga_per_satuan,
			COUNT(ip.id_item_pesanan) AS total_item,
			COALESCE(SUM(ip.subtotal_pesanan), 0)::float8 AS total_revenue
		FROM tarif t
		JOIN layanan l ON l.id_layanan = t.layanan_id_layanan
		LEFT JOIN item_pesanan ip ON ip.tarif_id_tarif = t.id_tarif
		WHERE t.cabang_laundry_id_cabang = ?
		GROUP BY l.id_layanan, l.nama_layanan, l.satuan_layanan, l.deskripsi_layanan, t.id_tarif, t.harga_per_satuan
		ORDER BY total_item DESC, l.nama_layanan ASC`
	var rows []CabangServiceRow
	if err := r.db.WithContext(ctx).Raw(q, cabangID).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *superadminRepo) BranchReviews(ctx context.Context, cabangID, limit, offset int) ([]BranchReviewRow2, error) {
	if limit <= 0 {
		limit = 20
	}
	const q = `
		SELECT
			u.id_ulasan,
			u.rating_ulasan,
			u.komentar_ulasan,
			u.pesanan_id_pesanan,
			pl.nama_pelanggan,
			pg.nama_pegawai,
			(
				SELECT l.nama_layanan
				FROM item_pesanan ip
				JOIN tarif t ON t.id_tarif = ip.tarif_id_tarif
				JOIN layanan l ON l.id_layanan = t.layanan_id_layanan
				WHERE ip.pesanan_id_pesanan = u.pesanan_id_pesanan
				ORDER BY ip.id_item_pesanan ASC
				LIMIT 1
			) AS nama_layanan
		FROM ulasan u
		JOIN pesanan p ON p.id_pesanan = u.pesanan_id_pesanan
		JOIN pegawai pg ON pg.id_pegawai = p.pegawai_id_pegawai
		JOIN pelanggan pl ON pl.id_pelanggan = p.pelanggan_id_pelanggan
		WHERE pg.cabang_laundry_id_cabang = ?
		ORDER BY u.id_ulasan DESC
		LIMIT ? OFFSET ?`
	var rows []BranchReviewRow2
	if err := r.db.WithContext(ctx).Raw(q, cabangID, limit, offset).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *superadminRepo) CreateCabang(ctx context.Context, c CabangCreate) (*CabangRow, error) {
	// id_cabang is IDENTITY → DB allocates.
	const q = `
		INSERT INTO cabang_laundry (nama_cabang, alamat_cabang, no_telp_cabang, jam_buka_cabang, jam_tutup_cabang)
		VALUES (?, ?, ?, ?::time, ?::time)
		RETURNING
			id_cabang,
			nama_cabang,
			alamat_cabang,
			no_telp_cabang,
			TO_CHAR(jam_buka_cabang,  'HH24:MI') AS jam_buka_cabang,
			TO_CHAR(jam_tutup_cabang, 'HH24:MI') AS jam_tutup_cabang`
	var row CabangRow
	if err := r.db.WithContext(ctx).Raw(q, c.Nama, c.Alamat, c.NoTelp, c.JamBuka, c.JamTutup).Scan(&row).Error; err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *superadminRepo) UpdateCabang(ctx context.Context, id int, c CabangUpdate) (*CabangRow, error) {
	// JamBuka/JamTutup may be NULL — cast inside COALESCE.
	const q = `
		UPDATE cabang_laundry SET
			nama_cabang = COALESCE(?, nama_cabang),
			alamat_cabang = COALESCE(?, alamat_cabang),
			no_telp_cabang = COALESCE(?, no_telp_cabang),
			jam_buka_cabang = COALESCE(?::time, jam_buka_cabang),
			jam_tutup_cabang = COALESCE(?::time, jam_tutup_cabang)
		WHERE id_cabang = ?`
	if err := r.db.WithContext(ctx).Exec(q, c.Nama, c.Alamat, c.NoTelp, c.JamBuka, c.JamTutup, id).Error; err != nil {
		return nil, err
	}
	return r.GetCabangByID(ctx, id)
}

func (r *superadminRepo) CreateTarif(ctx context.Context, cabangID int, t TarifCreate) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var newID int
		if err := tx.Raw(`SELECT COALESCE(MAX(id_tarif), 0) + 1 FROM tarif`).Scan(&newID).Error; err != nil {
			return err
		}
		return tx.Exec(`
			INSERT INTO tarif (id_tarif, harga_per_satuan, cabang_laundry_id_cabang, layanan_id_layanan)
			VALUES (?, ?, ?, ?)`,
			newID, t.HargaPerSatuan, cabangID, t.LayananIDLayanan).Error
	})
}

func (r *superadminRepo) UpdateTarif(ctx context.Context, cabangID, tarifID int, t TarifUpdate) error {
	const q = `
		UPDATE tarif SET
			harga_per_satuan = COALESCE(?, harga_per_satuan),
			layanan_id_layanan = COALESCE(?, layanan_id_layanan)
		WHERE id_tarif = ?
		  AND cabang_laundry_id_cabang = ?`
	return r.db.WithContext(ctx).Exec(q, t.HargaPerSatuan, t.LayananIDLayanan, tarifID, cabangID).Error
}

// Payments ------------------------------------------------------------------

func (r *superadminRepo) ListPaymentsAll(ctx context.Context, method, search string, limit, offset int) ([]PaymentJoinRow, error) {
	if limit <= 0 {
		limit = 20
	}
	var b strings.Builder
	b.WriteString(`
		SELECT
			b.id_pembayaran,
			b.pesanan_id_pesanan,
			pl.nama_pelanggan,
			pl.no_telp_pelanggan,
			b.waktu_pembayaran,
			b.metode_pembayaran,
			b.jumlah_pembayaran,
			cl.nama_cabang
		FROM pembayaran b
		JOIN pesanan p ON p.id_pesanan = b.pesanan_id_pesanan
		JOIN pelanggan pl ON pl.id_pelanggan = p.pelanggan_id_pelanggan
		JOIN pegawai pg ON pg.id_pegawai = p.pegawai_id_pegawai
		JOIN cabang_laundry cl ON cl.id_cabang = pg.cabang_laundry_id_cabang
		WHERE LOWER(b.status_pembayaran) = 'lunas'`)

	args := []interface{}{}
	if method != "" && strings.ToLower(method) != "all" {
		b.WriteString(` AND UPPER(b.metode_pembayaran) = UPPER(?)`)
		args = append(args, method)
	}
	if search != "" {
		b.WriteString(` AND (pl.nama_pelanggan ILIKE ? OR CAST(b.id_pembayaran AS TEXT) ILIKE ?)`)
		s := "%" + search + "%"
		args = append(args, s, s)
	}
	b.WriteString(` ORDER BY b.id_pembayaran DESC LIMIT ? OFFSET ?`)
	args = append(args, limit, offset)

	var rows []PaymentJoinRow
	if err := r.db.WithContext(ctx).Raw(b.String(), args...).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *superadminRepo) PaymentByCustomerForCabang(ctx context.Context, cabangID, limit, offset int) ([]PaymentByCustomerRow, error) {
	if limit <= 0 {
		limit = 20
	}
	const q = `
		SELECT
			pl.id_pelanggan,
			pl.nama_pelanggan,
			COUNT(p.id_pesanan) AS total_order,
			COALESCE(SUM(b.jumlah_pembayaran), 0)::float8 AS total_payment
		FROM pembayaran b
		JOIN pesanan p ON p.id_pesanan = b.pesanan_id_pesanan
		JOIN pelanggan pl ON pl.id_pelanggan = p.pelanggan_id_pelanggan
		JOIN pegawai pg ON pg.id_pegawai = p.pegawai_id_pegawai
		JOIN cabang_laundry cl ON cl.id_cabang = pg.cabang_laundry_id_cabang
		WHERE cl.id_cabang = ?
		  AND LOWER(b.status_pembayaran) = 'lunas'
		GROUP BY pl.id_pelanggan, pl.nama_pelanggan
		ORDER BY total_payment DESC, pl.nama_pelanggan ASC
		LIMIT ? OFFSET ?`
	var rows []PaymentByCustomerRow
	if err := r.db.WithContext(ctx).Raw(q, cabangID, limit, offset).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

// Customers -----------------------------------------------------------------

func (r *superadminRepo) ListCustomers(ctx context.Context, search string, limit, offset int) ([]CustomerStatRow, error) {
	if limit <= 0 {
		limit = 50
	}
	var b strings.Builder
	b.WriteString(`
		SELECT
			pl.id_pelanggan,
			pl.nama_pelanggan,
			pl.email_pelanggan,
			pl.no_telp_pelanggan,
			pl.alamat_pelanggan,
			COUNT(DISTINCT p.id_pesanan)::int AS total_order,
			COALESCE(SUM(p.total_harga_pesanan), 0)::float8 AS total_spend,
			COALESCE(ROUND(AVG(u.rating_ulasan)::numeric, 2), 0)::float8 AS avg_rating,
			MAX(p.estimasi_selesai_pesanan) AS last_order
		FROM pelanggan pl
		LEFT JOIN pesanan p ON p.pelanggan_id_pelanggan = pl.id_pelanggan
		LEFT JOIN ulasan u ON u.pesanan_id_pesanan = p.id_pesanan
		WHERE 1=1`)

	args := []interface{}{}
	if search != "" {
		b.WriteString(` AND (pl.nama_pelanggan ILIKE ? OR pl.email_pelanggan ILIKE ?)`)
		s := "%" + search + "%"
		args = append(args, s, s)
	}
	b.WriteString(`
		GROUP BY pl.id_pelanggan, pl.nama_pelanggan, pl.email_pelanggan, pl.no_telp_pelanggan, pl.alamat_pelanggan
		ORDER BY total_spend DESC, pl.id_pelanggan DESC
		LIMIT ? OFFSET ?`)
	args = append(args, limit, offset)

	var rows []CustomerStatRow
	if err := r.db.WithContext(ctx).Raw(b.String(), args...).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *superadminRepo) GetCustomerDetail(ctx context.Context, id int) (*CustomerStatRow, []CustomerOrderRow, error) {
	const q = `
		SELECT
			pl.id_pelanggan, pl.nama_pelanggan, pl.email_pelanggan,
			pl.no_telp_pelanggan, pl.alamat_pelanggan,
			COUNT(DISTINCT p.id_pesanan)::int AS total_order,
			COALESCE(SUM(p.total_harga_pesanan), 0)::float8 AS total_spend,
			COALESCE(ROUND(AVG(u.rating_ulasan)::numeric, 2), 0)::float8 AS avg_rating,
			MAX(p.estimasi_selesai_pesanan) AS last_order
		FROM pelanggan pl
		LEFT JOIN pesanan p ON p.pelanggan_id_pelanggan = pl.id_pelanggan
		LEFT JOIN ulasan u ON u.pesanan_id_pesanan = p.id_pesanan
		WHERE pl.id_pelanggan = ?
		GROUP BY pl.id_pelanggan, pl.nama_pelanggan, pl.email_pelanggan, pl.no_telp_pelanggan, pl.alamat_pelanggan`
	var stat CustomerStatRow
	if err := r.db.WithContext(ctx).Raw(q, id).Scan(&stat).Error; err != nil {
		return nil, nil, err
	}
	if stat.ID == 0 {
		return nil, nil, nil
	}

	const qOrders = `
		SELECT
			p.id_pesanan, p.status_pesanan, p.total_harga_pesanan,
			p.estimasi_selesai_pesanan, cl.nama_cabang
		FROM pesanan p
		JOIN pegawai pg ON pg.id_pegawai = p.pegawai_id_pegawai
		JOIN cabang_laundry cl ON cl.id_cabang = pg.cabang_laundry_id_cabang
		WHERE p.pelanggan_id_pelanggan = ?
		ORDER BY p.id_pesanan DESC
		LIMIT 50`
	var orders []CustomerOrderRow
	if err := r.db.WithContext(ctx).Raw(qOrders, id).Scan(&orders).Error; err != nil {
		return &stat, nil, err
	}
	return &stat, orders, nil
}

// Catalog -------------------------------------------------------------------

func (r *superadminRepo) ListLayanan(ctx context.Context) ([]LayananRow, error) {
	const q = `SELECT id_layanan, nama_layanan, satuan_layanan, deskripsi_layanan
	           FROM layanan ORDER BY id_layanan ASC`
	var rows []LayananRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}
