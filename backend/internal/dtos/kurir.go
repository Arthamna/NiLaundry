package dtos

import "arthamna/NiLaundry/internal/repositories"

// KurirResponse matches the SELECT in GET /pelanggan/{id}/kurir:
//   id_kurir, nama_kurir, no_plat_kurir, jenis_kendaraan (from tipe_kendaraan).
// Used by the customer add-new-order page to pick a courier for orders that
// involve pickup or delivery.
type KurirResponse struct {
	ID             int    `json:"id"`
	Nama           string `json:"nama"`
	NoPlat         string `json:"noPlat"`
	JenisKendaraan string `json:"jenisKendaraan"`
}

func ToKurirResponse(r *repositories.KurirRow) KurirResponse {
	return KurirResponse{
		ID:             r.IDKurir,
		Nama:           r.NamaKurir,
		NoPlat:         r.NoPlatKurir,
		JenisKendaraan: r.JenisKendaraan,
	}
}

func ToKurirResponseList(rows []repositories.KurirRow) []KurirResponse {
	out := make([]KurirResponse, 0, len(rows))
	for i := range rows {
		out = append(out, ToKurirResponse(&rows[i]))
	}
	return out
}
