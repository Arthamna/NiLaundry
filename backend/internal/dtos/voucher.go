package dtos

import (
	"arthamna/NiLaundry/internal/models"
	"time"
)

type VoucherResponse struct {
	ID            int       `json:"id"`
	Kode          string    `json:"kode"`
	TipeDiskon    string    `json:"tipeDiskon"`
	NilaiDiskon   float64   `json:"nilaiDiskon"`
	MinPembelian  float64   `json:"minPembelian"`
	BerlakuHingga time.Time `json:"berlakuHingga"`
	Kuota         int       `json:"kuota"`
	Terpakai      int       `json:"terpakai"`
	// UsedByMe is true when the logged-in customer has already applied this
	// owned voucher to one of their orders. Only meaningful for the 'owned'
	// scope; false otherwise.
	UsedByMe bool `json:"usedByMe"`
}

type VoucherHematResponse struct {
	TotalHemat float64 `json:"totalHemat"`
}

type ClaimVoucherRequest struct {
	Kode string `json:"kode" binding:"required"`
}

func ToVoucherResponse(v *models.Voucher) VoucherResponse {
	return VoucherResponse{
		ID:            v.IDVoucher,
		Kode:          v.KodeVoucher,
		TipeDiskon:    v.TipeDiskonVoucher,
		NilaiDiskon:   v.NilaiDiskonVoucher,
		MinPembelian:  v.MinPembelianVoucher,
		BerlakuHingga: v.BerlakuHinggaVoucher,
		Kuota:         v.KuotaVoucher,
		Terpakai:      v.TerpakaiVoucher,
	}
}

func ToVoucherResponseList(rows []models.Voucher) []VoucherResponse {
	out := make([]VoucherResponse, 0, len(rows))
	for i := range rows {
		out = append(out, ToVoucherResponse(&rows[i]))
	}
	return out
}
