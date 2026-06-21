package dtos

import "arthamna/NiLaundry/internal/models"

type NotifikasiResponse struct {
	ID    int    `json:"id"`
	Judul string `json:"judul"`
	Pesan string `json:"pesan"`
	Tipe  string `json:"tipe"`
}

func ToNotifikasiResponse(n *models.Notifikasi) NotifikasiResponse {
	return NotifikasiResponse{
		ID:    n.IDNotifikasi,
		Judul: n.JudulNotifikasi,
		Pesan: n.PesanNotifikasi,
		Tipe:  n.TipeNotifikasi,
	}
}

func ToNotifikasiResponseList(rows []models.Notifikasi) []NotifikasiResponse {
	out := make([]NotifikasiResponse, 0, len(rows))
	for i := range rows {
		out = append(out, ToNotifikasiResponse(&rows[i]))
	}
	return out
}
