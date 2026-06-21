package services

import (
	"arthamna/NiLaundry/constants"
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/models"
	"arthamna/NiLaundry/internal/repositories"
	"arthamna/NiLaundry/pkg/auth"
	"arthamna/NiLaundry/pkg/common"
	"context"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Register(ctx context.Context, req dtos.RegisterRequest) (*dtos.AuthResponse, error)
	Login(ctx context.Context, req dtos.LoginRequest) (*dtos.UnifiedAuthResponse, error)
}

type authService struct {
	pelangganRepo repositories.PelangganRepository
	penggunaRepo  repositories.PenggunaRepository
	jwt           auth.JWTService
}

func NewAuthService(
	pelangganRepo repositories.PelangganRepository,
	penggunaRepo repositories.PenggunaRepository,
	jwt auth.JWTService,
) AuthService {
	return &authService{
		pelangganRepo: pelangganRepo,
		penggunaRepo:  penggunaRepo,
		jwt:           jwt,
	}
}

func (s *authService) Register(ctx context.Context, req dtos.RegisterRequest) (*dtos.AuthResponse, error) {
	// Email must be unique across BOTH pelanggan and pengguna — otherwise the
	// unified login flow would be ambiguous.
	existingP, err := s.pelangganRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if existingP != nil {
		return nil, common.NewAppError(http.StatusConflict, "email already registered")
	}
	existingU, err := s.penggunaRepo.FindByEmailWithRole(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if existingU != nil {
		return nil, common.NewAppError(http.StatusConflict, "email already registered")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	p := &models.Pelanggan{
		NamaPelanggan:     req.Nama,
		EmailPelanggan:    req.Email,
		PasswordPelanggan: string(hash),
		NoTelpPelanggan:   req.NoTelp,
		AlamatPelanggan:   req.Alamat,
	}
	if err := s.pelangganRepo.Create(ctx, p); err != nil {
		return nil, err
	}

	token, err := s.jwt.GenerateForPelanggan(p.IDPelanggan)
	if err != nil {
		return nil, err
	}
	return &dtos.AuthResponse{Token: token, Pelanggan: dtos.ToPelangganResponse(p)}, nil
}

// Login looks up the email in `pelanggan` first, then `pengguna`. The first
// table that contains the email decides the subject type — we then validate
// the password against THAT row. We don't fall through on wrong password, so
// the same email can't shadow across tables (and email collision is blocked
// at Register time anyway).
func (s *authService) Login(ctx context.Context, req dtos.LoginRequest) (*dtos.UnifiedAuthResponse, error) {
	pelanggan, err := s.pelangganRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if pelanggan != nil {
		if err := bcrypt.CompareHashAndPassword([]byte(pelanggan.PasswordPelanggan), []byte(req.Password)); err != nil {
			return nil, common.NewAppError(http.StatusUnauthorized, "invalid email or password")
		}
		token, err := s.jwt.GenerateForPelanggan(pelanggan.IDPelanggan)
		if err != nil {
			return nil, err
		}
		pelangganRes := dtos.ToPelangganResponse(pelanggan)
		return &dtos.UnifiedAuthResponse{
			Token:       token,
			SubjectType: constants.SubjectTypePelanggan,
			Role:        constants.RoleCustomer,
			Pelanggan:   &pelangganRes,
			Pengguna:    nil,
		}, nil
	}

	pengguna, err := s.penggunaRepo.FindByEmailWithRole(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if pengguna == nil || pengguna.Role == nil {
		return nil, common.NewAppError(http.StatusUnauthorized, "invalid email or password")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(pengguna.PasswordPengguna), []byte(req.Password)); err != nil {
		return nil, common.NewAppError(http.StatusUnauthorized, "invalid email or password")
	}
	token, err := s.jwt.GenerateForPengguna(pengguna.IDPengguna, pengguna.Role.NamaRole)
	if err != nil {
		return nil, err
	}
	penggunaRes := dtos.ToPenggunaResponse(pengguna, pengguna.Role.NamaRole)
	return &dtos.UnifiedAuthResponse{
		Token:       token,
		SubjectType: constants.SubjectTypePengguna,
		Role:        pengguna.Role.NamaRole,
		Pelanggan:   nil,
		Pengguna:    &penggunaRes,
	}, nil
}
