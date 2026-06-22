package services

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/repositories"
	"context"
)

type KurirService interface {
	List(ctx context.Context, page, limit int) ([]dtos.KurirResponse, error)
}

type kurirService struct {
	repo repositories.KurirRepository
}

func NewKurirService(repo repositories.KurirRepository) KurirService {
	return &kurirService{repo: repo}
}

func (s *kurirService) List(ctx context.Context, page, limit int) ([]dtos.KurirResponse, error) {
	if limit <= 0 {
		limit = 50
	}
	if page < 1 {
		page = 1
	}
	offset := (page - 1) * limit
	rows, err := s.repo.List(ctx, limit, offset)
	if err != nil {
		return nil, err
	}
	return dtos.ToKurirResponseList(rows), nil
}
