package repositories

import (
	"arthamna/NiLaundry/internal/models"
	"context"
	"errors"

	"gorm.io/gorm"
)

type PenggunaRepository interface {
	FindByEmailWithRole(ctx context.Context, email string) (*models.Pengguna, error)
	FindByIDWithRole(ctx context.Context, id int) (*models.Pengguna, error)
}

type penggunaRepo struct{ db *gorm.DB }

func NewPenggunaRepository(db *gorm.DB) PenggunaRepository {
	return &penggunaRepo{db: db}
}

func (r *penggunaRepo) FindByEmailWithRole(ctx context.Context, email string) (*models.Pengguna, error) {
	var p models.Pengguna
	err := r.db.WithContext(ctx).
		Preload("Role").
		// Select only the columns we need: the cabang_laundry TIME columns
		// (jam_buka/jam_tutup) don't scan into time.Time and would error.
		Preload("CabangLaundry", func(tx *gorm.DB) *gorm.DB {
			return tx.Select("id_cabang", "nama_cabang")
		}).
		First(&p, "email_pengguna = ?", email).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

func (r *penggunaRepo) FindByIDWithRole(ctx context.Context, id int) (*models.Pengguna, error) {
	var p models.Pengguna
	err := r.db.WithContext(ctx).
		Preload("Role").
		// Select only the columns we need: the cabang_laundry TIME columns
		// (jam_buka/jam_tutup) don't scan into time.Time and would error.
		Preload("CabangLaundry", func(tx *gorm.DB) *gorm.DB {
			return tx.Select("id_cabang", "nama_cabang")
		}).
		First(&p, "id_pengguna = ?", id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}
