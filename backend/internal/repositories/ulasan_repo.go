package repositories

import (
	"arthamna/NiLaundry/internal/models"
	"context"
	"errors"

	"gorm.io/gorm"
)

type UlasanRepository interface {
	ListByPelanggan(ctx context.Context, pelangganID int) ([]models.Ulasan, error)
	FindByPesananOwned(ctx context.Context, pelangganID, pesananID int) (*models.Ulasan, error)
	FindByPesanan(ctx context.Context, pesananID int) (*models.Ulasan, error)
	Create(ctx context.Context, u *models.Ulasan) error
}

type ulasanRepo struct{ db *gorm.DB }

func NewUlasanRepository(db *gorm.DB) UlasanRepository {
	return &ulasanRepo{db: db}
}

func (r *ulasanRepo) ListByPelanggan(ctx context.Context, pelangganID int) ([]models.Ulasan, error) {
	var rows []models.Ulasan
	err := r.db.WithContext(ctx).
		Joins("JOIN pesanan p ON p.id_pesanan = ulasan.pesanan_id_pesanan").
		Where("p.pelanggan_id_pelanggan = ?", pelangganID).
		Order("ulasan.id_ulasan DESC").
		Find(&rows).Error
	if err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *ulasanRepo) FindByPesananOwned(ctx context.Context, pelangganID, pesananID int) (*models.Ulasan, error) {
	var u models.Ulasan
	err := r.db.WithContext(ctx).
		Joins("JOIN pesanan p ON p.id_pesanan = ulasan.pesanan_id_pesanan").
		Where("p.id_pesanan = ? AND p.pelanggan_id_pelanggan = ?", pesananID, pelangganID).
		First(&u).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func (r *ulasanRepo) FindByPesanan(ctx context.Context, pesananID int) (*models.Ulasan, error) {
	var u models.Ulasan
	if err := r.db.WithContext(ctx).First(&u, "pesanan_id_pesanan = ?", pesananID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func (r *ulasanRepo) Create(ctx context.Context, u *models.Ulasan) error {
	return r.db.WithContext(ctx).Create(u).Error
}
