package repositories

import (
	"arthamna/NiLaundry/internal/models"
	"context"

	"gorm.io/gorm"
)

type TarifRepository interface {
	FindByIDs(ctx context.Context, ids []int) ([]models.Tarif, error)
}

type tarifRepo struct{ db *gorm.DB }

func NewTarifRepository(db *gorm.DB) TarifRepository {
	return &tarifRepo{db: db}
}

func (r *tarifRepo) FindByIDs(ctx context.Context, ids []int) ([]models.Tarif, error) {
	if len(ids) == 0 {
		return nil, nil
	}
	var rows []models.Tarif
	if err := r.db.WithContext(ctx).Where("id_tarif IN ?", ids).Find(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}
