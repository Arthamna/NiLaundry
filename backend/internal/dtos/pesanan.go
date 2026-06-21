package dtos

import (
	"arthamna/NiLaundry/internal/models"
	"time"
)

type PesananResponse struct {
	ID              int       `json:"id"`
	JumlahItem      int       `json:"jumlahItem"`
	Status          string    `json:"status"`
	Catatan         string    `json:"catatan"`
	EstimasiSelesai time.Time `json:"estimasiSelesai"`
	TotalHarga      float64   `json:"totalHarga"`
	PelangganID     int       `json:"pelangganId"`
	VoucherID       *int      `json:"voucherId"`
	PegawaiID       int       `json:"pegawaiId"`
	JenisAmbil      string    `json:"jenisAmbil"` // 'pickup' | 'walkin'
	JenisAntar      string    `json:"jenisAntar"` // 'delivery' | 'walkin'
}

type ItemPesananResponse struct {
	ID        int     `json:"id"`
	Kuantitas int     `json:"kuantitas"`
	Subtotal  float64 `json:"subtotal"`
	Catatan   *string `json:"catatan"`
	PesananID int     `json:"pesananId"`
	TarifID   int     `json:"tarifId"`
}

type PesananDetailResponse struct {
	PesananResponse
	Items  []ItemPesananResponse `json:"items"`
	Ulasan *UlasanResponse       `json:"ulasan"`
}

type ItemPesananInput struct {
	TarifID   int     `json:"tarifId" binding:"required"`
	Kuantitas int     `json:"kuantitas" binding:"required,min=1"`
	Catatan   *string `json:"catatan"`
}

type CreatePesananRequest struct {
	CabangID         int                `json:"cabangId" binding:"required"`
	Catatan          string             `json:"catatan"`
	EstimasiSelesai  *time.Time         `json:"estimasiSelesai"`
	MetodePembayaran string             `json:"metodePembayaran" binding:"required"`
	JenisAmbil       string             `json:"jenisAmbil" binding:"required,oneof=pickup walkin"`
	JenisAntar       string             `json:"jenisAntar" binding:"required,oneof=delivery walkin"`
	Items            []ItemPesananInput `json:"items" binding:"required,min=1,dive"`
}

type SubtotalResponse struct {
	Subtotal float64 `json:"subtotal"`
}

type SubtotalRequest struct {
	Items []ItemPesananInput `json:"items" binding:"required,min=1,dive"`
}

func ToPesananResponse(p *models.Pesanan) PesananResponse {
	return PesananResponse{
		ID:              p.IDPesanan,
		JumlahItem:      p.JumlahItemPesanan,
		Status:          p.StatusPesanan,
		Catatan:         p.CatatanPesanan,
		EstimasiSelesai: p.EstimasiSelesaiPesanan,
		TotalHarga:      p.TotalHargaPesanan,
		PelangganID:     p.PelangganIDPelanggan,
		VoucherID:       p.VoucherIDVoucher,
		PegawaiID:       p.PegawaiIDPegawai,
		JenisAmbil:      p.JenisAmbil,
		JenisAntar:      p.JenisAntar,
	}
}

func ToPesananResponseList(rows []models.Pesanan) []PesananResponse {
	out := make([]PesananResponse, 0, len(rows))
	for i := range rows {
		out = append(out, ToPesananResponse(&rows[i]))
	}
	return out
}

func ToItemPesananResponse(it *models.ItemPesanan) ItemPesananResponse {
	return ItemPesananResponse{
		ID:        it.IDItemPesanan,
		Kuantitas: it.KuantitasSatuanItemPesanan,
		Subtotal:  it.SubtotalPesanan,
		Catatan:   it.CatatanItemPesanan,
		PesananID: it.PesananIDPesanan,
		TarifID:   it.TarifIDTarif,
	}
}

func ToItemPesananResponseList(rows []models.ItemPesanan) []ItemPesananResponse {
	out := make([]ItemPesananResponse, 0, len(rows))
	for i := range rows {
		out = append(out, ToItemPesananResponse(&rows[i]))
	}
	return out
}
