package services

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/repositories"
	"arthamna/NiLaundry/pkg/common"
	"context"
	"net/http"

	"gorm.io/gorm"
)

type PembayaranService interface {
	Konfirmasi(ctx context.Context, pelangganID int, req dtos.KonfirmasiPembayaranRequest) (*dtos.PembayaranResponse, error)
}

type pembayaranService struct {
	pembayaranRepo repositories.PembayaranRepository
	pesananRepo    repositories.PesananRepository
	voucherRepo    repositories.VoucherRepository
}

func NewPembayaranService(
	pembayaranRepo repositories.PembayaranRepository,
	pesananRepo repositories.PesananRepository,
	voucherRepo repositories.VoucherRepository,
) PembayaranService {
	return &pembayaranService{
		pembayaranRepo: pembayaranRepo,
		pesananRepo:    pesananRepo,
		voucherRepo:    voucherRepo,
	}
}

func (s *pembayaranService) Konfirmasi(ctx context.Context, pelangganID int, req dtos.KonfirmasiPembayaranRequest) (*dtos.PembayaranResponse, error) {
	pesanan, err := s.pesananRepo.FindOwned(ctx, pelangganID, req.PesananID)
	if err != nil {
		return nil, err
	}
	if pesanan == nil {
		return nil, common.NewAppError(http.StatusNotFound, "pesanan not found")
	}

	var updatedPembayaran *dtos.PembayaranResponse
	err = s.pesananRepo.DB().WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if req.VoucherID != nil {
			v, err := s.voucherRepo.FindByID(ctx, *req.VoucherID)
			if err != nil {
				return err
			}
			if v == nil {
				return common.NewAppError(http.StatusBadRequest, "voucher not found")
			}
			total := applyDiscount(pesanan.TotalHargaPesanan, v.TipeDiskonVoucher, v.NilaiDiskonVoucher)
			if err := s.pesananRepo.UpdateVoucherAndTotal(ctx, tx, pesanan.IDPesanan, &v.IDVoucher, total); err != nil {
				return err
			}
		}
		pb, err := s.pembayaranRepo.UpdateLunas(ctx, tx, pesanan.IDPesanan, req.Metode)
		if err != nil {
			return err
		}
		res := dtos.ToPembayaranResponse(pb)
		updatedPembayaran = &res
		return nil
	})
	if err != nil {
		return nil, err
	}
	return updatedPembayaran, nil
}

func applyDiscount(total float64, tipe string, nilai float64) float64 {
	switch tipe {
	case "persen":
		return total - (total * nilai / 100.0)
	case "nominal":
		v := total - nilai
		if v < 0 {
			return 0
		}
		return v
	default:
		return total
	}
}
