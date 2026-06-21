package repositories

import (
	"arthamna/NiLaundry/internal/models"
	"context"
	"errors"

	"gorm.io/gorm"
)

type PelangganRepository interface {
	Create(ctx context.Context, p *models.Pelanggan) error
	FindByID(ctx context.Context, id int) (*models.Pelanggan, error)
	FindByEmail(ctx context.Context, email string) (*models.Pelanggan, error)
	Update(ctx context.Context, p *models.Pelanggan) error
}

type pelangganRepo struct{ db *gorm.DB }

func NewPelangganRepository(db *gorm.DB) PelangganRepository {
	return &pelangganRepo{db: db}
}

func (r *pelangganRepo) Create(ctx context.Context, p *models.Pelanggan) error {
	return r.db.WithContext(ctx).Create(p).Error
}

func (r *pelangganRepo) FindByID(ctx context.Context, id int) (*models.Pelanggan, error) {
	var p models.Pelanggan
	if err := r.db.WithContext(ctx).First(&p, "id_pelanggan = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

func (r *pelangganRepo) FindByEmail(ctx context.Context, email string) (*models.Pelanggan, error) {
	var p models.Pelanggan
	if err := r.db.WithContext(ctx).First(&p, "email_pelanggan = ?", email).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

func (r *pelangganRepo) Update(ctx context.Context, p *models.Pelanggan) error {
	return r.db.WithContext(ctx).Save(p).Error
}
