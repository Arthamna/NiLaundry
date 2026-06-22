package repositories

import (
	"context"
	"errors"
	"strings"
	"time"

	"gorm.io/gorm"
)

// BranchRepository owns every query that powers the /branch/:cabangId/...
// endpoints. All queries scope by cabang via pegawai (or pengguna where
// relevant), since `pesanan` doesn't carry a cabang FK directly.
//
// Implementation note: every cross-table read uses raw SQL with explicit
// column lists so the column order matches the Scan target — far safer than
// SELECT * across joins.
type BranchRepository interface {
	// Dashboard
	TodaysOrderAndRevenue(ctx context.Context, cabangID int) (int, float64, error)
	ListOrders(ctx context.Context, cabangID int, params ListOrdersParams) ([]BranchOrderRow, error)
	ListRecentPayments(ctx context.Context, cabangID int, limit int) ([]BranchPaymentRow, error)
	ListRecentReviews(ctx context.Context, cabangID int, limit int) ([]BranchReviewRow, error)

	// Orders
	OrderStatusCounts(ctx context.Context, cabangID int) (int, []BranchStatusCount, error)
	OrderDetail(ctx context.Context, cabangID, pesananID int) (*BranchOrderRow, []BranchOrderItemRow, *BranchPaymentRow, error)
	UpdateOrderDetail(ctx context.Context, args UpdateOrderDetailArgs) error

	// Reports
	PaymentByCustomer(ctx context.Context, cabangID, limit, offset int) ([]BranchPaymentByCustomer, error)
	PaymentMethodChart(ctx context.Context, cabangID int) ([]BranchPaymentMethodChart, error)
	PaymentMethodTotal(ctx context.Context, cabangID int) (float64, error)
	PaymentMethodAverage(ctx context.Context, cabangID int) (float64, error)

	// Reviews
	ListUlasan(ctx context.Context, cabangID, limit, offset int) ([]BranchReviewRow, error)
	UlasanDistribusi(ctx context.Context, cabangID int) (BranchUlasanDistribusi, error)
	UlasanAverage(ctx context.Context, cabangID int) (BranchUlasanAverage, error)

	// Staff
	ListPegawai(ctx context.Context, cabangID int) ([]BranchPegawaiRow, error)
}

// --- raw result rows --------------------------------------------------------

type ListOrdersParams struct {
	Status string
	Search string
	Sort   string // "field asc|desc"
	Limit  int    // 0 = no limit
	Offset int
}

type BranchOrderRow struct {
	IDPesanan              int
	JumlahItem             int
	StatusPesanan          string
	CatatanPesanan         string
	EstimasiSelesaiPesanan time.Time
	TotalHargaPesanan      float64
	PelangganIDPelanggan   int
	VoucherIDVoucher       *int
	PegawaiIDPegawai       int
	NamaPelanggan          string
	NoTelpPelanggan        string
}

type BranchPaymentRow struct {
	IDPembayaran     int
	PesananIDPesanan int
	NamaPelanggan    string
	NoTelpPelanggan  string
	WaktuPembayaran  time.Time
	MetodePembayaran string
	JumlahPembayaran float64
	StatusPembayaran string
}

type BranchReviewRow struct {
	IDUlasan         int
	RatingUlasan     int
	KomentarUlasan   string
	PesananIDPesanan int
	IDPelanggan      int
	NamaPelanggan    string
	EmailPelanggan   string
	IDPegawai        int
	NamaPegawai      string
	LayananNama      *string
}

type BranchOrderItemRow struct {
	IDItemPesanan int
	NamaLayanan   string
	SatuanLayanan string
	Kuantitas     int
	Subtotal      float64
	Catatan       *string
	TarifID       int
}

type BranchStatusCount struct {
	Status string
	Count  int
}

type BranchPaymentByCustomer struct {
	IDPelanggan   int
	NamaPelanggan string
	TotalOrder    int
	TotalPayment  float64
}

type BranchPaymentMethodChart struct {
	Metode       string
	TotalEntries int
	Persentase   float64
}

type BranchUlasanDistribusi struct {
	Rating1 int
	Rating2 int
	Rating3 int
	Rating4 int
	Rating5 int
	Total   int
}

type BranchUlasanAverage struct {
	AverageRating float64
	Rating1       int
	Rating2       int
	Rating3       int
	Rating4       int
	Rating5       int
	TotalUlasan   int
}

type BranchPegawaiRow struct {
	IDPegawai             int
	NamaPegawai           string
	EmailPegawai          string
	NoTelpPegawai         string
	AlamatPegawai         string
	CabangLaundryIDCabang int
}

type UpdateOrderDetailArgs struct {
	CabangID        int
	PesananID       int
	PegawaiID       int
	Status          *string
	Catatan         *string
	EstimasiSelesai *time.Time
	TotalHarga      *float64
	JumlahItem      *int
	VoucherID       *int
	NotifyOnSelesai bool // true => insert notifikasi + notifikasi_pelanggan when new status == 'selesai'
}

// --- impl -------------------------------------------------------------------

type branchRepo struct{ db *gorm.DB }

func NewBranchRepository(db *gorm.DB) BranchRepository {
	return &branchRepo{db: db}
}

// Dashboard ------------------------------------------------------------------

func (r *branchRepo) TodaysOrderAndRevenue(ctx context.Context, cabangID int) (int, float64, error) {
	// status_pembayaran kept as 'Lunas' to match the existing customer trigger.
	const q = `
		SELECT
			COUNT(DISTINCT p.id_pesanan)                       AS todays_order,
			COALESCE(SUM(p.total_harga_pesanan), 0)::float8    AS todays_revenue
		FROM pembayaran b
		JOIN pesanan p ON p.id_pesanan = b.pesanan_id_pesanan
		JOIN pegawai g ON g.id_pegawai = p.pegawai_id_pegawai
		WHERE g.cabang_laundry_id_cabang = ?
		  AND LOWER(b.status_pembayaran) = 'lunas'
		  AND b.waktu_pembayaran::date = CURRENT_DATE`

	var out struct {
		TodaysOrder   int     `gorm:"column:todays_order"`
		TodaysRevenue float64 `gorm:"column:todays_revenue"`
	}
	if err := r.db.WithContext(ctx).Raw(q, cabangID).Scan(&out).Error; err != nil {
		return 0, 0, err
	}
	return out.TodaysOrder, out.TodaysRevenue, nil
}

func (r *branchRepo) ListOrders(ctx context.Context, cabangID int, params ListOrdersParams) ([]BranchOrderRow, error) {
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
			pl.no_telp_pelanggan
		FROM pesanan p
		JOIN pegawai g  ON g.id_pegawai = p.pegawai_id_pegawai
		JOIN pelanggan pl ON pl.id_pelanggan = p.pelanggan_id_pelanggan
		WHERE g.cabang_laundry_id_cabang = ?`)

	args := []interface{}{cabangID}
	if params.Status != "" {
		b.WriteString(` AND p.status_pesanan = ?`)
		args = append(args, params.Status)
	}
	if params.Search != "" {
		b.WriteString(` AND (pl.nama_pelanggan ILIKE ? OR CAST(p.id_pesanan AS TEXT) ILIKE ?)`)
		s := "%" + params.Search + "%"
		args = append(args, s, s)
	}
	b.WriteString(` ORDER BY ` + orderBySort(params.Sort))
	if params.Limit > 0 {
		b.WriteString(` LIMIT ? OFFSET ?`)
		args = append(args, params.Limit, params.Offset)
	}

	rows := make([]struct {
		IDPesanan              int       `gorm:"column:id_pesanan"`
		JumlahItem             int       `gorm:"column:jumlah_item_pesanan"`
		StatusPesanan          string    `gorm:"column:status_pesanan"`
		CatatanPesanan         string    `gorm:"column:catatan_pesanan"`
		EstimasiSelesaiPesanan time.Time `gorm:"column:estimasi_selesai_pesanan"`
		TotalHargaPesanan      float64   `gorm:"column:total_harga_pesanan"`
		PelangganIDPelanggan   int       `gorm:"column:pelanggan_id_pelanggan"`
		VoucherIDVoucher       *int      `gorm:"column:voucher_id_voucher"`
		PegawaiIDPegawai       int       `gorm:"column:pegawai_id_pegawai"`
		NamaPelanggan          string    `gorm:"column:nama_pelanggan"`
		NoTelpPelanggan        string    `gorm:"column:no_telp_pelanggan"`
	}, 0)

	if err := r.db.WithContext(ctx).Raw(b.String(), args...).Scan(&rows).Error; err != nil {
		return nil, err
	}
	out := make([]BranchOrderRow, len(rows))
	for i, r := range rows {
		out[i] = BranchOrderRow(r)
	}
	return out, nil
}

func orderBySort(sort string) string {
	// Whitelist sort to prevent injection. Default: newest first.
	switch sort {
	case "id_pesanan asc":
		return "p.id_pesanan ASC"
	case "id_pesanan desc":
		return "p.id_pesanan DESC"
	case "estimasi_selesai_pesanan asc":
		return "p.estimasi_selesai_pesanan ASC"
	case "estimasi_selesai_pesanan desc":
		return "p.estimasi_selesai_pesanan DESC"
	case "total_harga_pesanan asc":
		return "p.total_harga_pesanan ASC"
	case "total_harga_pesanan desc":
		return "p.total_harga_pesanan DESC"
	default:
		return "p.id_pesanan DESC"
	}
}

func (r *branchRepo) ListRecentPayments(ctx context.Context, cabangID, limit int) ([]BranchPaymentRow, error) {
	if limit <= 0 {
		limit = 50
	}
	const q = `
		SELECT
			b.id_pembayaran,
			b.pesanan_id_pesanan,
			pl.nama_pelanggan,
			pl.no_telp_pelanggan,
			b.waktu_pembayaran,
			b.metode_pembayaran,
			b.jumlah_pembayaran,
			b.status_pembayaran
		FROM pembayaran b
		JOIN pesanan p   ON p.id_pesanan = b.pesanan_id_pesanan
		JOIN pegawai g   ON g.id_pegawai = p.pegawai_id_pegawai
		JOIN pelanggan pl ON pl.id_pelanggan = p.pelanggan_id_pelanggan
		WHERE g.cabang_laundry_id_cabang = ?
		  AND LOWER(b.status_pembayaran) = 'lunas'
		ORDER BY b.id_pembayaran DESC
		LIMIT ?`

	rows := make([]struct {
		IDPembayaran     int       `gorm:"column:id_pembayaran"`
		PesananIDPesanan int       `gorm:"column:pesanan_id_pesanan"`
		NamaPelanggan    string    `gorm:"column:nama_pelanggan"`
		NoTelpPelanggan  string    `gorm:"column:no_telp_pelanggan"`
		WaktuPembayaran  time.Time `gorm:"column:waktu_pembayaran"`
		MetodePembayaran string    `gorm:"column:metode_pembayaran"`
		JumlahPembayaran float64   `gorm:"column:jumlah_pembayaran"`
		StatusPembayaran string    `gorm:"column:status_pembayaran"`
	}, 0)
	if err := r.db.WithContext(ctx).Raw(q, cabangID, limit).Scan(&rows).Error; err != nil {
		return nil, err
	}
	out := make([]BranchPaymentRow, len(rows))
	for i, v := range rows {
		out[i] = BranchPaymentRow(v)
	}
	return out, nil
}

func (r *branchRepo) ListRecentReviews(ctx context.Context, cabangID, limit int) ([]BranchReviewRow, error) {
	if limit <= 0 {
		limit = 50
	}
	return r.listReviewsInternal(ctx, cabangID, limit, 0)
}

func (r *branchRepo) ListUlasan(ctx context.Context, cabangID, limit, offset int) ([]BranchReviewRow, error) {
	if limit <= 0 {
		limit = 20
	}
	return r.listReviewsInternal(ctx, cabangID, limit, offset)
}

// listReviewsInternal supports both recent (offset=0) and paginated.
// Schema doesn't have ulasan.waktu_ulasan — we order by id_ulasan DESC.
// LayananNama is best-effort: ulasan tied to a pesanan with one or many
// items; we pick the first layanan via DISTINCT ON for display.
func (r *branchRepo) listReviewsInternal(ctx context.Context, cabangID, limit, offset int) ([]BranchReviewRow, error) {
	const q = `
		SELECT
			u.id_ulasan,
			u.rating_ulasan,
			u.komentar_ulasan,
			u.pesanan_id_pesanan,
			pl.id_pelanggan,
			pl.nama_pelanggan,
			pl.email_pelanggan,
			pg.id_pegawai,
			pg.nama_pegawai,
			(
				SELECT l.nama_layanan
				FROM item_pesanan ip
				JOIN tarif t ON t.id_tarif = ip.tarif_id_tarif
				JOIN layanan l ON l.id_layanan = t.layanan_id_layanan
				WHERE ip.pesanan_id_pesanan = u.pesanan_id_pesanan
				ORDER BY ip.id_item_pesanan ASC
				LIMIT 1
			) AS layanan_nama
		FROM ulasan u
		JOIN pesanan p   ON p.id_pesanan = u.pesanan_id_pesanan
		JOIN pegawai pg  ON pg.id_pegawai = p.pegawai_id_pegawai
		JOIN pelanggan pl ON pl.id_pelanggan = p.pelanggan_id_pelanggan
		WHERE pg.cabang_laundry_id_cabang = ?
		ORDER BY u.id_ulasan DESC
		LIMIT ? OFFSET ?`

	rows := make([]struct {
		IDUlasan         int     `gorm:"column:id_ulasan"`
		RatingUlasan     int     `gorm:"column:rating_ulasan"`
		KomentarUlasan   string  `gorm:"column:komentar_ulasan"`
		PesananIDPesanan int     `gorm:"column:pesanan_id_pesanan"`
		IDPelanggan      int     `gorm:"column:id_pelanggan"`
		NamaPelanggan    string  `gorm:"column:nama_pelanggan"`
		EmailPelanggan   string  `gorm:"column:email_pelanggan"`
		IDPegawai        int     `gorm:"column:id_pegawai"`
		NamaPegawai      string  `gorm:"column:nama_pegawai"`
		LayananNama      *string `gorm:"column:layanan_nama"`
	}, 0)
	if err := r.db.WithContext(ctx).Raw(q, cabangID, limit, offset).Scan(&rows).Error; err != nil {
		return nil, err
	}
	out := make([]BranchReviewRow, len(rows))
	for i, v := range rows {
		out[i] = BranchReviewRow(v)
	}
	return out, nil
}

// Orders ---------------------------------------------------------------------

func (r *branchRepo) OrderStatusCounts(ctx context.Context, cabangID int) (int, []BranchStatusCount, error) {
	const q = `
		SELECT
			COALESCE(p.status_pesanan, '__TOTAL__') AS status_pesanan,
			COUNT(*)                                AS total_order
		FROM pesanan p
		JOIN pegawai g ON g.id_pegawai = p.pegawai_id_pegawai
		WHERE g.cabang_laundry_id_cabang = ?
		GROUP BY GROUPING SETS ((p.status_pesanan), ())
		ORDER BY CASE WHEN p.status_pesanan IS NULL THEN 1 ELSE 0 END,
		         p.status_pesanan`

	rows := make([]struct {
		Status string `gorm:"column:status_pesanan"`
		Count  int    `gorm:"column:total_order"`
	}, 0)
	if err := r.db.WithContext(ctx).Raw(q, cabangID).Scan(&rows).Error; err != nil {
		return 0, nil, err
	}
	total := 0
	counts := make([]BranchStatusCount, 0, len(rows))
	for _, v := range rows {
		if v.Status == "__TOTAL__" {
			total = v.Count
			continue
		}
		counts = append(counts, BranchStatusCount{Status: v.Status, Count: v.Count})
	}
	return total, counts, nil
}

func (r *branchRepo) OrderDetail(ctx context.Context, cabangID, pesananID int) (*BranchOrderRow, []BranchOrderItemRow, *BranchPaymentRow, error) {
	orders, err := r.ListOrders(ctx, cabangID, ListOrdersParams{}) // status-agnostic
	if err != nil {
		return nil, nil, nil, err
	}
	var target *BranchOrderRow
	for i := range orders {
		if orders[i].IDPesanan == pesananID {
			target = &orders[i]
			break
		}
	}
	if target == nil {
		return nil, nil, nil, nil
	}

	// Items
	const qItems = `
		SELECT
			ip.id_item_pesanan,
			l.nama_layanan       AS nama_layanan,
			l.satuan_layanan     AS satuan_layanan,
			ip.kuantitas_satuan_item_pesanan AS kuantitas,
			ip.subtotal_pesanan  AS subtotal,
			ip.catatan_item_pesanan AS catatan,
			ip.tarif_id_tarif    AS tarif_id
		FROM item_pesanan ip
		JOIN tarif t   ON t.id_tarif = ip.tarif_id_tarif
		JOIN layanan l ON l.id_layanan = t.layanan_id_layanan
		WHERE ip.pesanan_id_pesanan = ?
		ORDER BY ip.id_item_pesanan ASC`

	itemRows := make([]struct {
		IDItemPesanan int     `gorm:"column:id_item_pesanan"`
		NamaLayanan   string  `gorm:"column:nama_layanan"`
		SatuanLayanan string  `gorm:"column:satuan_layanan"`
		Kuantitas     int     `gorm:"column:kuantitas"`
		Subtotal      float64 `gorm:"column:subtotal"`
		Catatan       *string `gorm:"column:catatan"`
		TarifID       int     `gorm:"column:tarif_id"`
	}, 0)
	if err := r.db.WithContext(ctx).Raw(qItems, pesananID).Scan(&itemRows).Error; err != nil {
		return nil, nil, nil, err
	}
	items := make([]BranchOrderItemRow, len(itemRows))
	for i, v := range itemRows {
		items[i] = BranchOrderItemRow(v)
	}

	// Payment (optional)
	const qPay = `
		SELECT
			b.id_pembayaran,
			b.pesanan_id_pesanan,
			''  AS nama_pelanggan,
			''  AS no_telp_pelanggan,
			b.waktu_pembayaran,
			b.metode_pembayaran,
			b.jumlah_pembayaran,
			b.status_pembayaran
		FROM pembayaran b
		WHERE b.pesanan_id_pesanan = ?
		LIMIT 1`

	var payRow struct {
		IDPembayaran     int       `gorm:"column:id_pembayaran"`
		PesananIDPesanan int       `gorm:"column:pesanan_id_pesanan"`
		NamaPelanggan    string    `gorm:"column:nama_pelanggan"`
		NoTelpPelanggan  string    `gorm:"column:no_telp_pelanggan"`
		WaktuPembayaran  time.Time `gorm:"column:waktu_pembayaran"`
		MetodePembayaran string    `gorm:"column:metode_pembayaran"`
		JumlahPembayaran float64   `gorm:"column:jumlah_pembayaran"`
		StatusPembayaran string    `gorm:"column:status_pembayaran"`
	}
	err = r.db.WithContext(ctx).Raw(qPay, pesananID).Scan(&payRow).Error
	var payment *BranchPaymentRow
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil, nil, err
	}
	if payRow.IDPembayaran != 0 {
		v := BranchPaymentRow(payRow)
		payment = &v
	}

	return target, items, payment, nil
}

// UpdateOrderDetail is the inline equivalent of sp_update_detail_order_admin.
// Validates ownership (cabang+pegawai+pesanan), updates fields the caller
// provided (NULL-safe), and on transition to status 'selesai' inserts a
// notification linked to the order's customer.
func (r *branchRepo) UpdateOrderDetail(ctx context.Context, args UpdateOrderDetailArgs) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// 1. Ownership check
		const qOwn = `
			SELECT 1
			FROM pesanan p
			JOIN pegawai pg ON pg.id_pegawai = p.pegawai_id_pegawai
			WHERE p.id_pesanan = ?
			  AND p.pegawai_id_pegawai = ?
			  AND pg.cabang_laundry_id_cabang = ?
			LIMIT 1`
		var got int
		err := tx.Raw(qOwn, args.PesananID, args.PegawaiID, args.CabangID).Scan(&got).Error
		if err != nil {
			return err
		}
		if got != 1 {
			return errors.New("Order tidak sesuai dengan credential pegawai")
		}

		// 2. UPDATE with COALESCE on optional fields
		const qUpd = `
			UPDATE pesanan SET
				status_pesanan           = COALESCE(?, status_pesanan),
				catatan_pesanan          = COALESCE(?, catatan_pesanan),
				estimasi_selesai_pesanan = COALESCE(?, estimasi_selesai_pesanan),
				total_harga_pesanan      = COALESCE(?, total_harga_pesanan),
				jumlah_item_pesanan      = COALESCE(?, jumlah_item_pesanan),
				voucher_id_voucher       = COALESCE(?, voucher_id_voucher)
			WHERE id_pesanan = ?`
		if err := tx.Exec(qUpd,
			args.Status, args.Catatan, args.EstimasiSelesai,
			args.TotalHarga, args.JumlahItem, args.VoucherID,
			args.PesananID,
		).Error; err != nil {
			return err
		}

		// 3. Notify on completion. The canonical completion status is
		// 'completed' (see pesanan seed + customer flow); 'selesai' is accepted
		// as a legacy alias so older rows still trigger the notification.
		if args.Status != nil && (*args.Status == "completed" || *args.Status == "selesai") && args.NotifyOnSelesai {
			var pelangganID int
			if err := tx.Raw(`SELECT pelanggan_id_pelanggan FROM pesanan WHERE id_pesanan = ?`, args.PesananID).
				Scan(&pelangganID).Error; err != nil {
				return err
			}

			var notifID int
			if err := tx.Raw(`
				INSERT INTO notifikasi (judul_notifikasi, pesan_notifikasi, tipe_notifikasi)
				VALUES ('Pesanan Selesai',
				        'Pesanan Anda dengan nomor #' || ?::text || ' telah selesai.',
				        'ORDER')
				RETURNING id_notifikasi`, args.PesananID).
				Scan(&notifID).Error; err != nil {
				return err
			}
			if err := tx.Exec(`
				INSERT INTO notifikasi_pelanggan (notifikasi_id_notifikasi, pelanggan_id_pelanggan)
				VALUES (?, ?)`, notifID, pelangganID).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

// Reports --------------------------------------------------------------------

func (r *branchRepo) PaymentByCustomer(ctx context.Context, cabangID, limit, offset int) ([]BranchPaymentByCustomer, error) {
	if limit <= 0 {
		limit = 20
	}
	const q = `
		SELECT
			pl.id_pelanggan,
			pl.nama_pelanggan,
			COUNT(p.id_pesanan)                       AS total_order,
			COALESCE(SUM(b.jumlah_pembayaran), 0)::float8 AS total_payment
		FROM pembayaran b
		JOIN pesanan p   ON p.id_pesanan = b.pesanan_id_pesanan
		JOIN pelanggan pl ON pl.id_pelanggan = p.pelanggan_id_pelanggan
		JOIN pegawai pg  ON pg.id_pegawai = p.pegawai_id_pegawai
		WHERE pg.cabang_laundry_id_cabang = ?
		  AND LOWER(b.status_pembayaran) = 'lunas'
		GROUP BY pl.id_pelanggan, pl.nama_pelanggan
		ORDER BY total_payment DESC, pl.nama_pelanggan ASC
		LIMIT ? OFFSET ?`

	rows := make([]struct {
		IDPelanggan   int     `gorm:"column:id_pelanggan"`
		NamaPelanggan string  `gorm:"column:nama_pelanggan"`
		TotalOrder    int     `gorm:"column:total_order"`
		TotalPayment  float64 `gorm:"column:total_payment"`
	}, 0)
	if err := r.db.WithContext(ctx).Raw(q, cabangID, limit, offset).Scan(&rows).Error; err != nil {
		return nil, err
	}
	out := make([]BranchPaymentByCustomer, len(rows))
	for i, v := range rows {
		out[i] = BranchPaymentByCustomer(v)
	}
	return out, nil
}

// PaymentMethodChart is the inline equivalent of the REFCURSOR SP in the doc.
func (r *branchRepo) PaymentMethodChart(ctx context.Context, cabangID int) ([]BranchPaymentMethodChart, error) {
	const q = `
		WITH total_entries AS (
			SELECT COUNT(*)::numeric AS total_count
			FROM pembayaran b
			JOIN pesanan p  ON p.id_pesanan = b.pesanan_id_pesanan
			JOIN pegawai pg ON pg.id_pegawai = p.pegawai_id_pegawai
			WHERE pg.cabang_laundry_id_cabang = ?
			  AND LOWER(b.status_pembayaran) = 'lunas'
		)
		SELECT
			b.metode_pembayaran AS metode,
			COUNT(*) AS total_entries,
			ROUND(
				(COUNT(*)::numeric / NULLIF((SELECT total_count FROM total_entries), 0)) * 100,
				2
			)::float8 AS persentase
		FROM pembayaran b
		JOIN pesanan p  ON p.id_pesanan = b.pesanan_id_pesanan
		JOIN pegawai pg ON pg.id_pegawai = p.pegawai_id_pegawai
		WHERE pg.cabang_laundry_id_cabang = ?
		  AND LOWER(b.status_pembayaran) = 'lunas'
		GROUP BY b.metode_pembayaran
		ORDER BY total_entries DESC`

	rows := make([]struct {
		Metode       string  `gorm:"column:metode"`
		TotalEntries int     `gorm:"column:total_entries"`
		Persentase   float64 `gorm:"column:persentase"`
	}, 0)
	if err := r.db.WithContext(ctx).Raw(q, cabangID, cabangID).Scan(&rows).Error; err != nil {
		return nil, err
	}
	out := make([]BranchPaymentMethodChart, len(rows))
	for i, v := range rows {
		out[i] = BranchPaymentMethodChart(v)
	}
	return out, nil
}

func (r *branchRepo) PaymentMethodTotal(ctx context.Context, cabangID int) (float64, error) {
	const q = `
		SELECT COALESCE(SUM(b.jumlah_pembayaran), 0)::float8
		FROM pembayaran b
		JOIN pesanan p  ON p.id_pesanan = b.pesanan_id_pesanan
		JOIN pegawai pg ON pg.id_pegawai = p.pegawai_id_pegawai
		WHERE pg.cabang_laundry_id_cabang = ?
		  AND LOWER(b.status_pembayaran) = 'lunas'`
	var out float64
	if err := r.db.WithContext(ctx).Raw(q, cabangID).Scan(&out).Error; err != nil {
		return 0, err
	}
	return out, nil
}

func (r *branchRepo) PaymentMethodAverage(ctx context.Context, cabangID int) (float64, error) {
	const q = `
		SELECT COALESCE(AVG(b.jumlah_pembayaran), 0)::float8
		FROM pembayaran b
		JOIN pesanan p  ON p.id_pesanan = b.pesanan_id_pesanan
		JOIN pegawai pg ON pg.id_pegawai = p.pegawai_id_pegawai
		WHERE pg.cabang_laundry_id_cabang = ?
		  AND LOWER(b.status_pembayaran) = 'lunas'`
	var out float64
	if err := r.db.WithContext(ctx).Raw(q, cabangID).Scan(&out).Error; err != nil {
		return 0, err
	}
	return out, nil
}

// Reviews --------------------------------------------------------------------

func (r *branchRepo) UlasanDistribusi(ctx context.Context, cabangID int) (BranchUlasanDistribusi, error) {
	const q = `
		SELECT
			COUNT(*) FILTER (WHERE u.rating_ulasan = 1) AS rating_1,
			COUNT(*) FILTER (WHERE u.rating_ulasan = 2) AS rating_2,
			COUNT(*) FILTER (WHERE u.rating_ulasan = 3) AS rating_3,
			COUNT(*) FILTER (WHERE u.rating_ulasan = 4) AS rating_4,
			COUNT(*) FILTER (WHERE u.rating_ulasan = 5) AS rating_5,
			COUNT(*)                                    AS total
		FROM ulasan u
		JOIN pesanan p  ON p.id_pesanan = u.pesanan_id_pesanan
		JOIN pegawai pg ON pg.id_pegawai = p.pegawai_id_pegawai
		WHERE pg.cabang_laundry_id_cabang = ?`
	var out struct {
		Rating1 int `gorm:"column:rating_1"`
		Rating2 int `gorm:"column:rating_2"`
		Rating3 int `gorm:"column:rating_3"`
		Rating4 int `gorm:"column:rating_4"`
		Rating5 int `gorm:"column:rating_5"`
		Total   int `gorm:"column:total"`
	}
	if err := r.db.WithContext(ctx).Raw(q, cabangID).Scan(&out).Error; err != nil {
		return BranchUlasanDistribusi{}, err
	}
	return BranchUlasanDistribusi(out), nil
}

func (r *branchRepo) UlasanAverage(ctx context.Context, cabangID int) (BranchUlasanAverage, error) {
	const q = `
		SELECT
			COALESCE(ROUND(AVG(u.rating_ulasan)::numeric, 2), 0)::float8 AS average_rating,
			COUNT(*) FILTER (WHERE u.rating_ulasan = 1) AS rating_1,
			COUNT(*) FILTER (WHERE u.rating_ulasan = 2) AS rating_2,
			COUNT(*) FILTER (WHERE u.rating_ulasan = 3) AS rating_3,
			COUNT(*) FILTER (WHERE u.rating_ulasan = 4) AS rating_4,
			COUNT(*) FILTER (WHERE u.rating_ulasan = 5) AS rating_5,
			COUNT(*)                                    AS total_ulasan
		FROM ulasan u
		JOIN pesanan p  ON p.id_pesanan = u.pesanan_id_pesanan
		JOIN pegawai pg ON pg.id_pegawai = p.pegawai_id_pegawai
		WHERE pg.cabang_laundry_id_cabang = ?`
	var out struct {
		AverageRating float64 `gorm:"column:average_rating"`
		Rating1       int     `gorm:"column:rating_1"`
		Rating2       int     `gorm:"column:rating_2"`
		Rating3       int     `gorm:"column:rating_3"`
		Rating4       int     `gorm:"column:rating_4"`
		Rating5       int     `gorm:"column:rating_5"`
		TotalUlasan   int     `gorm:"column:total_ulasan"`
	}
	if err := r.db.WithContext(ctx).Raw(q, cabangID).Scan(&out).Error; err != nil {
		return BranchUlasanAverage{}, err
	}
	return BranchUlasanAverage(out), nil
}

// Staff ----------------------------------------------------------------------

func (r *branchRepo) ListPegawai(ctx context.Context, cabangID int) ([]BranchPegawaiRow, error) {
	const q = `
		SELECT
			pg.id_pegawai,
			pg.nama_pegawai,
			pg.email_pegawai,
			pg.no_telp_pegawai,
			pg.alamat_pegawai,
			pg.cabang_laundry_id_cabang
		FROM pegawai pg
		WHERE pg.cabang_laundry_id_cabang = ?
		ORDER BY pg.id_pegawai DESC`

	rows := make([]struct {
		IDPegawai             int    `gorm:"column:id_pegawai"`
		NamaPegawai           string `gorm:"column:nama_pegawai"`
		EmailPegawai          string `gorm:"column:email_pegawai"`
		NoTelpPegawai         string `gorm:"column:no_telp_pegawai"`
		AlamatPegawai         string `gorm:"column:alamat_pegawai"`
		CabangLaundryIDCabang int    `gorm:"column:cabang_laundry_id_cabang"`
	}, 0)
	if err := r.db.WithContext(ctx).Raw(q, cabangID).Scan(&rows).Error; err != nil {
		return nil, err
	}
	out := make([]BranchPegawaiRow, len(rows))
	for i, v := range rows {
		out[i] = BranchPegawaiRow(v)
	}
	return out, nil
}
