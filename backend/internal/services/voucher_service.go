package services

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/repositories"
	"arthamna/NiLaundry/pkg/common"
	"context"
	"net/http"
)

type VoucherScope string

const (
	VoucherScopeAvailable VoucherScope = "available"
	VoucherScopeOwned     VoucherScope = "owned"
)

type VoucherService interface {
	List(ctx context.Context, pelangganID int, scope VoucherScope) ([]dtos.VoucherResponse, error)
	TotalHemat(ctx context.Context, pelangganID int) (*dtos.VoucherHematResponse, error)
	Claim(ctx context.Context, pelangganID int, kode string) (*dtos.VoucherResponse, error)
}

type voucherService struct {
	repo repositories.VoucherRepository
}

func NewVoucherService(r repositories.VoucherRepository) VoucherService {
	return &voucherService{repo: r}
}

func (s *voucherService) List(ctx context.Context, pelangganID int, scope VoucherScope) ([]dtos.VoucherResponse, error) {
	switch scope {
	case VoucherScopeOwned:
		rows, err := s.repo.ListOwnedWithUsage(ctx, pelangganID)
		if err != nil {
			return nil, err
		}
		out := make([]dtos.VoucherResponse, 0, len(rows))
		for i := range rows {
			res := dtos.ToVoucherResponse(&rows[i].Voucher)
			res.UsedByMe = rows[i].UsedByMe
			out = append(out, res)
		}
		return out, nil
	default:
		rows, err := s.repo.ListAvailable(ctx, pelangganID)
		if err != nil {
			return nil, err
		}
		return dtos.ToVoucherResponseList(rows), nil
	}
}

func (s *voucherService) TotalHemat(ctx context.Context, pelangganID int) (*dtos.VoucherHematResponse, error) {
	t, err := s.repo.TotalHemat(ctx, pelangganID)
	if err != nil {
		return nil, err
	}
	return &dtos.VoucherHematResponse{TotalHemat: t}, nil
}

func (s *voucherService) Claim(ctx context.Context, pelangganID int, kode string) (*dtos.VoucherResponse, error) {
	v, err := s.repo.FindByKode(ctx, kode)
	if err != nil {
		return nil, err
	}
	if v == nil {
		return nil, common.NewAppError(http.StatusNotFound, "voucher not found")
	}
	if err := s.repo.ClaimVoucher(ctx, pelangganID, v.IDVoucher); err != nil {
		return nil, common.NewAppError(http.StatusBadRequest, err.Error())
	}
	// re-fetch to return up-to-date terpakai_voucher
	updated, err := s.repo.FindByID(ctx, v.IDVoucher)
	if err != nil {
		return nil, err
	}
	res := dtos.ToVoucherResponse(updated)
	return &res, nil
}
