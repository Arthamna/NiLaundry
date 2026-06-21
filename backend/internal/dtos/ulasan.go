package dtos

import "arthamna/NiLaundry/internal/models"

type UlasanResponse struct {
	ID        int    `json:"id"`
	Rating    int    `json:"rating"`
	Komentar  string `json:"komentar"`
	PesananID int    `json:"pesananId"`
}

type CreateUlasanRequest struct {
	Rating   int    `json:"rating" binding:"required,min=1,max=5"`
	Komentar string `json:"komentar" binding:"required"`
}

func ToUlasanResponse(u *models.Ulasan) UlasanResponse {
	return UlasanResponse{
		ID:        u.IDUlasan,
		Rating:    u.RatingUlasan,
		Komentar:  u.KomentarUlasan,
		PesananID: u.PesananIDPesanan,
	}
}

func ToUlasanResponseList(rows []models.Ulasan) []UlasanResponse {
	out := make([]UlasanResponse, 0, len(rows))
	for i := range rows {
		out = append(out, ToUlasanResponse(&rows[i]))
	}
	return out
}

func ToUlasanResponsePtr(u *models.Ulasan) *UlasanResponse {
	if u == nil {
		return nil
	}
	v := ToUlasanResponse(u)
	return &v
}
