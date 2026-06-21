package repositories

import (
	"arthamna/NiLaundry/internal/models"
	"context"
	"errors"

	"gorm.io/gorm"
)

type PegawaiRepository interface {
	PickRandomByCabang(ctx context.Context, cabangID int) (*models.Pegawai, error)
}

type pegawaiRepo struct{ db *gorm.DB }

func NewPegawaiRepository(db *gorm.DB) PegawaiRepository {
	return &pegawaiRepo{db: db}
}

// PickRandomByCabang returns a random pegawai for a given branch.
// PostgreSQL ORDER BY RANDOM() — fine for the data sizes in this project.
func (r *pegawaiRepo) PickRandomByCabang(ctx context.Context, cabangID int) (*models.Pegawai, error) {
	var p models.Pegawai
	err := r.db.WithContext(ctx).
		Where("cabang_laundry_id_cabang = ?", cabangID).
		Order("RANDOM()").
		Limit(1).
		First(&p).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}
