package repositories

import (
	"arthamna/NiLaundry/internal/models"
	"context"

	"gorm.io/gorm"
)

type NotifikasiRepository interface {
	ListByPelanggan(ctx context.Context, pelangganID int) ([]models.Notifikasi, error)
}

type notifikasiRepo struct{ db *gorm.DB }

func NewNotifikasiRepository(db *gorm.DB) NotifikasiRepository {
	return &notifikasiRepo{db: db}
}

func (r *notifikasiRepo) ListByPelanggan(ctx context.Context, pelangganID int) ([]models.Notifikasi, error) {
	var rows []models.Notifikasi
	err := r.db.WithContext(ctx).
		Joins("JOIN notifikasi_pelanggan np ON np.notifikasi_id_notifikasi = notifikasi.id_notifikasi").
		Where("np.pelanggan_id_pelanggan = ?", pelangganID).
		Order("notifikasi.id_notifikasi DESC").
		Find(&rows).Error
	if err != nil {
		return nil, err
	}
	return rows, nil
}
