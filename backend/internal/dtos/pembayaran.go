package dtos

import (
	"arthamna/NiLaundry/internal/models"
	"time"
)

type PembayaranResponse struct {
	ID        int       `json:"id"`
	Waktu     time.Time `json:"waktu"`
	Metode    string    `json:"metode"`
	Status    string    `json:"status"`
	Jumlah    float64   `json:"jumlah"`
	PesananID int       `json:"pesananId"`
}

type KonfirmasiPembayaranRequest struct {
	PesananID int    `json:"pesananId" binding:"required"`
	Metode    string `json:"metode" binding:"required"`
	VoucherID *int   `json:"voucherId"`
}

func ToPembayaranResponse(p *models.Pembayaran) PembayaranResponse {
	return PembayaranResponse{
		ID:        p.IDPembayaran,
		Waktu:     p.WaktuPembayaran,
		Metode:    p.MetodePembayaran,
		Status:    p.StatusPembayaran,
		Jumlah:    p.JumlahPembayaran,
		PesananID: p.PesananIDPesanan,
	}
}
