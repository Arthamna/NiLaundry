package services

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/repositories"
	"context"
)

type KurirService interface {
	List(ctx context.Context, page, limit int) ([]dtos.KurirResponse, error)
	// ListByPesanan returns the courier(s) assigned to a customer's order
	// (pickup/delivery legs), for the order-detail courier card.
	ListByPesanan(ctx context.Context, pelangganID, pesananID int) ([]dtos.OrderKurirResponse, error)
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

func (s *kurirService) ListByPesanan(ctx context.Context, pelangganID, pesananID int) ([]dtos.OrderKurirResponse, error) {
	rows, err := s.repo.ListByPesanan(ctx, pelangganID, pesananID)
	if err != nil {
		return nil, err
	}
	return dtos.ToOrderKurirResponseList(rows), nil
}
