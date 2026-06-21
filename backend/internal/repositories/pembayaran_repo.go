package repositories

import (
	"arthamna/NiLaundry/internal/models"
	"context"
	"errors"

	"gorm.io/gorm"
)

type PembayaranRepository interface {
	FindByPesanan(ctx context.Context, pesananID int) (*models.Pembayaran, error)
	UpdateLunas(ctx context.Context, tx *gorm.DB, pesananID int, metode string) (*models.Pembayaran, error)
	DB() *gorm.DB
}

type pembayaranRepo struct{ db *gorm.DB }

func NewPembayaranRepository(db *gorm.DB) PembayaranRepository {
	return &pembayaranRepo{db: db}
}

func (r *pembayaranRepo) DB() *gorm.DB { return r.db }

func (r *pembayaranRepo) FindByPesanan(ctx context.Context, pesananID int) (*models.Pembayaran, error) {
	var p models.Pembayaran
	if err := r.db.WithContext(ctx).First(&p, "pesanan_id_pesanan = ?", pesananID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

func (r *pembayaranRepo) UpdateLunas(ctx context.Context, tx *gorm.DB, pesananID int, metode string) (*models.Pembayaran, error) {
	db := tx
	if db == nil {
		db = r.db.WithContext(ctx)
	}
	if err := db.Model(&models.Pembayaran{}).
		Where("pesanan_id_pesanan = ?", pesananID).
		Updates(map[string]interface{}{
			"metode_pembayaran": metode,
			"status_pembayaran": "Lunas",
		}).Error; err != nil {
		return nil, err
	}
	var p models.Pembayaran
	if err := db.First(&p, "pesanan_id_pesanan = ?", pesananID).Error; err != nil {
		return nil, err
	}
	return &p, nil
}
