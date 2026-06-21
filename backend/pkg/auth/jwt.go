package auth

import (
	"arthamna/NiLaundry/constants"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// Claims carries who the caller is (SubjectID + SubjectType) and what role
// they hold. SubjectType disambiguates which table SubjectID refers to:
//   - SubjectTypePelanggan -> pelanggan.id_pelanggan
//   - SubjectTypePengguna  -> pengguna.id_pengguna
type Claims struct {
	SubjectID   int    `json:"sub"`
	SubjectType string `json:"type"`
	Role        string `json:"role"`
	jwt.RegisteredClaims
}

type JWTService interface {
	GenerateForPelanggan(pelangganID int) (string, error)
	GenerateForPengguna(penggunaID int, role string) (string, error)
	ValidateToken(tokenString string) (*Claims, error)
}

type jwtService struct {
	secretKey string
	issuer    string
}

func NewJWTService() JWTService {
	return &jwtService{
		secretKey: getSecretKey(),
		issuer:    "NiLaundry",
	}
}

func getSecretKey() string {
	secret := os.Getenv("JWT_SECRET_KEY")
	if secret == "" {
		secret = "NiLaundry-dev-secret"
	}
	return secret
}

func (j *jwtService) sign(claims *Claims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(j.secretKey))
}

func (j *jwtService) GenerateForPelanggan(pelangganID int) (string, error) {
	return j.sign(&Claims{
		SubjectID:   pelangganID,
		SubjectType: constants.SubjectTypePelanggan,
		Role:        constants.RoleCustomer,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    j.issuer,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * constants.JWTExpireMinutes)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	})
}

func (j *jwtService) GenerateForPengguna(penggunaID int, role string) (string, error) {
	return j.sign(&Claims{
		SubjectID:   penggunaID,
		SubjectType: constants.SubjectTypePengguna,
		Role:        role,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    j.issuer,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * constants.JWTExpireMinutes)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	})
}

func (j *jwtService) ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return []byte(j.secretKey), nil
	})
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}
	return claims, nil
}
