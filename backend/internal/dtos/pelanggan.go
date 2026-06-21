package dtos

import "arthamna/NiLaundry/internal/models"

type PelangganResponse struct {
	ID     int    `json:"id"`
	Nama   string `json:"nama"`
	Email  string `json:"email"`
	NoTelp string `json:"noTelp"`
	Alamat string `json:"alamat"`
}

type UpdatePelangganRequest struct {
	Nama   *string `json:"nama"`
	Email  *string `json:"email" binding:"omitempty,email"`
	NoTelp *string `json:"noTelp"`
	Alamat *string `json:"alamat"`
}

func ToPelangganResponse(p *models.Pelanggan) PelangganResponse {
	return PelangganResponse{
		ID:     p.IDPelanggan,
		Nama:   p.NamaPelanggan,
		Email:  p.EmailPelanggan,
		NoTelp: p.NoTelpPelanggan,
		Alamat: p.AlamatPelanggan,
	}
}
