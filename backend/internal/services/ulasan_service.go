package services

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/models"
	"arthamna/NiLaundry/internal/repositories"
	"arthamna/NiLaundry/pkg/common"
	"context"
	"net/http"
	"time"
)

type UlasanService interface {
	ListMine(ctx context.Context, pelangganID int) ([]dtos.UlasanResponse, error)
	GetByPesanan(ctx context.Context, pelangganID, pesananID int) (*dtos.UlasanResponse, error)
	Create(ctx context.Context, pelangganID, pesananID int, req dtos.CreateUlasanRequest) (*dtos.UlasanResponse, error)
}

type ulasanService struct {
	ulasanRepo  repositories.UlasanRepository
	pesananRepo repositories.PesananRepository
}

func NewUlasanService(u repositories.UlasanRepository, p repositories.PesananRepository) UlasanService {
	return &ulasanService{ulasanRepo: u, pesananRepo: p}
}

func (s *ulasanService) ListMine(ctx context.Context, pelangganID int) ([]dtos.UlasanResponse, error) {
	rows, err := s.ulasanRepo.ListByPelanggan(ctx, pelangganID)
	if err != nil {
		return nil, err
	}
	return dtos.ToUlasanResponseList(rows), nil
}

func (s *ulasanService) GetByPesanan(ctx context.Context, pelangganID, pesananID int) (*dtos.UlasanResponse, error) {
	u, err := s.ulasanRepo.FindByPesananOwned(ctx, pelangganID, pesananID)
	if err != nil {
		return nil, err
	}
	return dtos.ToUlasanResponsePtr(u), nil
}

func (s *ulasanService) Create(ctx context.Context, pelangganID, pesananID int, req dtos.CreateUlasanRequest) (*dtos.UlasanResponse, error) {
	pesanan, err := s.pesananRepo.FindOwned(ctx, pelangganID, pesananID)
	if err != nil {
		return nil, err
	}
	if pesanan == nil {
		return nil, common.NewAppError(http.StatusNotFound, "pesanan not found")
	}
	u := &models.Ulasan{
		RatingUlasan:     req.Rating,
		KomentarUlasan:   req.Komentar,
		PesananIDPesanan: pesananID,
		WaktuUlasan:      time.Now(),
	}
	if err := s.ulasanRepo.Create(ctx, u); err != nil {
		return nil, common.NewAppError(http.StatusBadRequest, err.Error())
	}
	res := dtos.ToUlasanResponse(u)
	return &res, nil
}
