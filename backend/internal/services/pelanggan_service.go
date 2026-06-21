package services

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/repositories"
	"arthamna/NiLaundry/pkg/common"
	"context"
	"net/http"
)

type PelangganService interface {
	GetMe(ctx context.Context, pelangganID int) (*dtos.PelangganResponse, error)
	UpdateMe(ctx context.Context, pelangganID int, req dtos.UpdatePelangganRequest) (*dtos.PelangganResponse, error)
}

type pelangganService struct {
	repo repositories.PelangganRepository
}

func NewPelangganService(r repositories.PelangganRepository) PelangganService {
	return &pelangganService{repo: r}
}

func (s *pelangganService) GetMe(ctx context.Context, pelangganID int) (*dtos.PelangganResponse, error) {
	p, err := s.repo.FindByID(ctx, pelangganID)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, common.NewAppError(http.StatusNotFound, "pelanggan not found")
	}
	res := dtos.ToPelangganResponse(p)
	return &res, nil
}

func (s *pelangganService) UpdateMe(ctx context.Context, pelangganID int, req dtos.UpdatePelangganRequest) (*dtos.PelangganResponse, error) {
	p, err := s.repo.FindByID(ctx, pelangganID)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, common.NewAppError(http.StatusNotFound, "pelanggan not found")
	}
	if req.Nama != nil {
		p.NamaPelanggan = *req.Nama
	}
	if req.Email != nil {
		p.EmailPelanggan = *req.Email
	}
	if req.NoTelp != nil {
		p.NoTelpPelanggan = *req.NoTelp
	}
	if req.Alamat != nil {
		p.AlamatPelanggan = *req.Alamat
	}
	if err := s.repo.Update(ctx, p); err != nil {
		return nil, err
	}
	res := dtos.ToPelangganResponse(p)
	return &res, nil
}
