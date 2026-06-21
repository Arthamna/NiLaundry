package routes

import (
	"arthamna/NiLaundry/internal/handlers"
	"arthamna/NiLaundry/pkg/auth"
	"arthamna/NiLaundry/pkg/middleware"

	"github.com/gin-gonic/gin"
)

type Handlers struct {
	Auth       handlers.AuthHandler
	Pelanggan  handlers.PelangganHandler
	Pesanan    handlers.PesananHandler
	Ulasan     handlers.UlasanHandler
	Voucher    handlers.VoucherHandler
	Notifikasi handlers.NotifikasiHandler
	Pembayaran handlers.PembayaranHandler
}

func SetupRoutes(r *gin.Engine, jwtService auth.JWTService, h Handlers) {
	// Public auth endpoints. /auth/login is unified — searches pelanggan
	// then pengguna, response carries subjectType so the frontend can route.
	authGroup := r.Group("/auth")
	{
		authGroup.POST("/register", h.Auth.Register)
		authGroup.POST("/login", h.Auth.Login)
	}

	// Customer protected endpoints
	api := r.Group("/")
	api.Use(middleware.Authenticate(jwtService), middleware.RequirePelanggan())
	{
		me := api.Group("/pelanggan/me")
		{
			me.GET("", h.Pelanggan.GetMe)
			me.PUT("", h.Pelanggan.UpdateMe)
		}

		owned := api.Group("/pelanggan/:id")
		{
			owned.GET("/pesanan", h.Pesanan.List)
			owned.POST("/pesanan", h.Pesanan.Create)
			owned.GET("/pesanan/subtotal", h.Pesanan.Subtotal)
			owned.GET("/pesanan/:pesananId", h.Pesanan.GetDetail)

			owned.GET("/ulasan", h.Ulasan.ListMine)
			owned.GET("/ulasan/:pesananId", h.Ulasan.GetByPesanan)
			owned.POST("/ulasan/:pesananId", h.Ulasan.Create)

			owned.GET("/voucher", h.Voucher.List)
			owned.GET("/voucher/hemat", h.Voucher.TotalHemat)
			owned.POST("/voucher/klaim", h.Voucher.Claim)

			owned.GET("/notifikasi", h.Notifikasi.List)

			owned.POST("/pembayaran/konfirmasi", h.Pembayaran.Konfirmasi)
		}
	}
}
