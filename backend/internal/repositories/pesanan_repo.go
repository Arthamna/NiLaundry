package repositories

import (
	"arthamna/NiLaundry/internal/models"
	"context"
	"errors"

	"gorm.io/gorm"
)

type PesananRepository interface {
	ListByPelanggan(ctx context.Context, pelangganID int, statuses []string) ([]models.Pesanan, error)
	FindOwned(ctx context.Context, pelangganID, pesananID int) (*models.Pesanan, error)
	FindByID(ctx context.Context, pesananID int) (*models.Pesanan, error)
	ListItems(ctx context.Context, pesananID int) ([]models.ItemPesanan, error)
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
