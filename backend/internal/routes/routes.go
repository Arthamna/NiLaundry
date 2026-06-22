package routes

import (
	"arthamna/NiLaundry/constants"
	"arthamna/NiLaundry/internal/handlers"
	"arthamna/NiLaundry/internal/repositories"
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
	Kurir      handlers.KurirHandler
	Branch     handlers.BranchHandler
}

func SetupRoutes(
	r *gin.Engine,
	jwtService auth.JWTService,
	penggunaRepo repositories.PenggunaRepository,
	h Handlers,
) {
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
		// Branch + service catalog for the "create new order" form.
		api.GET("/katalog", h.Pesanan.Katalog)

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
			owned.POST("/pesanan/:pesananId/cancel", h.Pesanan.Cancel)

			// Kurir picker for customer add-new-order (only relevant when
			// pickup/delivery is selected; the endpoint itself is unfiltered).
			owned.GET("/kurir", h.Kurir.List)

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

	// Branch (admin per cabang) endpoints. Superadmin can access any
	// cabangId; admin can only access their own (RequireBranchAccess does a
	// DB lookup on pengguna.cabang_laundry_id_cabang).
	branch := r.Group("/branch/:cabangId")
	branch.Use(
		middleware.Authenticate(jwtService),
		middleware.RequireAnyRole(constants.RoleAdmin, constants.RoleSuperAdmin),
		middleware.RequireBranchAccess(penggunaRepo, "cabangId"),
	)
	{
		// Dashboard
		branch.GET("/order/statistik/data", h.Branch.OrderStatistik)
		branch.GET("/order/list", h.Branch.ListOrders)
		branch.GET("/orders", h.Branch.ListOrders) // alias from doc
		branch.GET("/payments", h.Branch.RecentPayments)
		branch.GET("/reviews", h.Branch.RecentReviews)

		// Orders
		branch.GET("/order/statistik/status", h.Branch.OrderStatusStatistik)
		branch.GET("/order/:pesananId/detail", h.Branch.OrderDetail)
		branch.PUT("/order/:pesananId/detail", h.Branch.UpdateOrderDetail)

		// Reports
		branch.GET("/order/statistik/payment/done", h.Branch.PaymentByCustomer)
		branch.GET("/order/statistik/payment/method/chart", h.Branch.PaymentMethodChart)
		branch.GET("/order/statistik/payment/method/total", h.Branch.PaymentMethodTotal)
		branch.GET("/order/statistik/payment/method/average", h.Branch.PaymentMethodAverage)

		// Reviews
		branch.GET("/ulasan", h.Branch.ListUlasan)
		branch.GET("/ulasan/distribusi", h.Branch.UlasanDistribusi)
		branch.GET("/ulasan/average", h.Branch.UlasanAverage)

		// Staff
		branch.GET("/pegawai", h.Branch.ListPegawai)
	}
}
