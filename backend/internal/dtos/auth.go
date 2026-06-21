package dtos

import "arthamna/NiLaundry/internal/models"

type RegisterRequest struct {
	Nama     string `json:"nama" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	NoTelp   string `json:"noTelp" binding:"required"`
	Alamat   string `json:"alamat" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// AuthResponse is what POST /auth/register returns — pelanggan-only, since
// only customers can self-register.
type AuthResponse struct {
	Token     string            `json:"token"`
	Pelanggan PelangganResponse `json:"pelanggan"`
}

// PenggunaResponse is the public projection of `pengguna` returned by login.
// CabangID is nil for superadmin (manages all branches).
type PenggunaResponse struct {
	ID       int    `json:"id"`
	Nama     string `json:"nama"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	CabangID *int   `json:"cabangId"`
}

// UnifiedAuthResponse is returned by POST /auth/login regardless of which
// table the subject was found in. The frontend reads `subjectType` to decide
// where to redirect:
//   - "pelanggan" -> customer dashboard, profile in `pelanggan`
//   - "pengguna"  -> admin/superadmin dashboard, profile in `pengguna`
type UnifiedAuthResponse struct {
	Token       string             `json:"token"`
	SubjectType string             `json:"subjectType"` // "pelanggan" | "pengguna"
	Role        string             `json:"role"`        // "customer" | "admin" | "superadmin"
	Pelanggan   *PelangganResponse `json:"pelanggan"`
	Pengguna    *PenggunaResponse  `json:"pengguna"`
}

func ToPenggunaResponse(p *models.Pengguna, roleName string) PenggunaResponse {
	return PenggunaResponse{
		ID:       p.IDPengguna,
		Nama:     p.NamaPengguna,
		Email:    p.EmailPengguna,
		Role:     roleName,
		CabangID: p.CabangLaundryIDCabang,
	}
}
