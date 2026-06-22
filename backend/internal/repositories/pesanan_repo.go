package repositories

import (
	"arthamna/NiLaundry/internal/models"
	"context"
	"errors"

	"gorm.io/gorm"
)

// ItemPesananDetailRow is an order line item enriched with its layanan name and
// unit, for the customer order-detail "services summary".
type ItemPesananDetailRow struct {
	IDItemPesanan int     `gorm:"column:id_item_pesanan"`
	NamaLayanan   string  `gorm:"column:nama_layanan"`
	SatuanLayanan string  `gorm:"column:satuan_layanan"`
	Kuantitas     int     `gorm:"column:kuantitas"`
	Subtotal      float64 `gorm:"column:subtotal"`
	Catatan       *string `gorm:"column:catatan"`
	PesananID     int     `gorm:"column:pesanan_id"`
	TarifID       int     `gorm:"column:tarif_id"`
}

type PesananRepository interface {
	ListByPelanggan(ctx context.Context, pelangganID int, statuses []string) ([]models.Pesanan, error)
	FindOwned(ctx context.Context, pelangganID, pesananID int) (*models.Pesanan, error)
	FindByID(ctx context.Context, pesananID int) (*models.Pesanan, error)
	ListItems(ctx context.Context, pesananID int) ([]models.ItemPesanan, error)
	// ListItemsWithLayanan returns the order's line items joined to tarif→layanan
	// (adds the service name + unit for display).
	ListItemsWithLayanan(ctx context.Context, pesananID int) ([]ItemPesananDetailRow, error)
	// ServiceSummaryByPesanan returns, per pesanan id, a comma-joined list of the
	// distinct layanan names in that order (for order-list cards).
	ServiceSummaryByPesanan(ctx context.Context, pesananIDs []int) (map[int]string, error)
	CreateOrderTx(ctx context.Context, fn func(tx *gorm.DB) error) error
	UpdateVoucherAndTotal(ctx context.Context, tx *gorm.DB, pesananID int, voucherID *int, total float64) error
	DB() *gorm.DB
}

type pesananRepo struct{ db *gorm.DB }

func NewPesananRepository(db *gorm.DB) PesananRepository {
	return &pesananRepo{db: db}
}

func (r *pesananRepo) DB() *gorm.DB { return r.db }

func (r *pesananRepo) ListByPelanggan(ctx context.Context, pelangganID int, statuses []string) ([]models.Pesanan, error) {
	var rows []models.Pesanan
	q := r.db.WithContext(ctx).Where("pelanggan_id_pelanggan = ?", pelangganID)
	if len(statuses) > 0 {
		q = q.Where("status_pesanan IN ?", statuses)
	}
	if err := q.Order("id_pesanan DESC").Find(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *pesananRepo) FindOwned(ctx context.Context, pelangganID, pesananID int) (*models.Pesanan, error) {
	var p models.Pesanan
	err := r.db.WithContext(ctx).
		Where("id_pesanan = ? AND pelanggan_id_pelanggan = ?", pesananID, pelangganID).
		First(&p).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

func (r *pesananRepo) FindByID(ctx context.Context, pesananID int) (*models.Pesanan, error) {
	var p models.Pesanan
	if err := r.db.WithContext(ctx).First(&p, "id_pesanan = ?", pesananID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

func (r *pesananRepo) ListItems(ctx context.Context, pesananID int) ([]models.ItemPesanan, error) {
	var rows []models.ItemPesanan
	if err := r.db.WithContext(ctx).
		Where("pesanan_id_pesanan = ?", pesananID).
		Order("id_item_pesanan ASC").
		Find(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *pesananRepo) ListItemsWithLayanan(ctx context.Context, pesananID int) ([]ItemPesananDetailRow, error) {
	const q = `
		SELECT
			ip.id_item_pesanan,
			l.nama_layanan                   AS nama_layanan,
			l.satuan_layanan                 AS satuan_layanan,
			ip.kuantitas_satuan_item_pesanan AS kuantitas,
			ip.subtotal_pesanan              AS subtotal,
			ip.catatan_item_pesanan          AS catatan,
			ip.pesanan_id_pesanan            AS pesanan_id,
			ip.tarif_id_tarif                AS tarif_id
		FROM item_pesanan ip
		JOIN tarif t   ON t.id_tarif   = ip.tarif_id_tarif
		JOIN layanan l ON l.id_layanan = t.layanan_id_layanan
		WHERE ip.pesanan_id_pesanan = ?
		ORDER BY ip.id_item_pesanan ASC`
	var rows []ItemPesananDetailRow
	if err := r.db.WithContext(ctx).Raw(q, pesananID).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *pesananRepo) ServiceSummaryByPesanan(ctx context.Context, pesananIDs []int) (map[int]string, error) {
	if len(pesananIDs) == 0 {
		return map[int]string{}, nil
	}
	const q = `
		SELECT
			ip.pesanan_id_pesanan                      AS pesanan_id,
			string_agg(DISTINCT l.nama_layanan, ', ')  AS ringkasan
		FROM item_pesanan ip
		JOIN tarif t   ON t.id_tarif   = ip.tarif_id_tarif
		JOIN layanan l ON l.id_layanan = t.layanan_id_layanan
		WHERE ip.pesanan_id_pesanan IN ?
		GROUP BY ip.pesanan_id_pesanan`
	var rows []struct {
		PesananID int    `gorm:"column:pesanan_id"`
		Ringkasan string `gorm:"column:ringkasan"`
	}
	if err := r.db.WithContext(ctx).Raw(q, pesananIDs).Scan(&rows).Error; err != nil {
		return nil, err
	}
	out := make(map[int]string, len(rows))
	for _, v := range rows {
		out[v.PesananID] = v.Ringkasan
	}
	return out, nil
}

func (r *pesananRepo) CreateOrderTx(ctx context.Context, fn func(tx *gorm.DB) error) error {
	return r.db.WithContext(ctx).Transaction(fn)
}

func (r *pesananRepo) UpdateVoucherAndTotal(ctx context.Context, tx *gorm.DB, pesananID int, voucherID *int, total float64) error {
	db := tx
	if db == nil {
		db = r.db.WithContext(ctx)
	}
	return db.Model(&models.Pesanan{}).
		Where("id_pesanan = ?", pesananID).
		Updates(map[string]interface{}{
			"voucher_id_voucher":  voucherID,
			"total_harga_pesanan": total,
		}).Error
}
