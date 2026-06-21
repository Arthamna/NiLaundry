package services

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/repositories"
	"context"
)

type NotifikasiService interface {
	ListMine(ctx context.Context, pelangganID int) ([]dtos.NotifikasiResponse, error)
}

type notifikasiService struct {
	repo repositories.NotifikasiRepository
}

func NewNotifikasiService(r repositories.NotifikasiRepository) NotifikasiService {
	return &notifikasiService{repo: r}
}

func (s *notifikasiService) ListMine(ctx context.Context, pelangganID int) ([]dtos.NotifikasiResponse, error) {
	rows, err := s.repo.ListByPelanggan(ctx, pelangganID)
	if err != nil {
		return nil, err
	}
	return dtos.ToNotifikasiResponseList(rows), nil
}
