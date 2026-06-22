package main

import (
	"arthamna/NiLaundry/internal/handlers"
	"arthamna/NiLaundry/internal/repositories"
	"arthamna/NiLaundry/internal/routes"
	"arthamna/NiLaundry/internal/services"
	"arthamna/NiLaundry/pkg/auth"
	"arthamna/NiLaundry/pkg/database"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("warning: no .env file loaded:", err)
	}

	if os.Getenv("JWT_SECRET_KEY") == "" {
		log.Fatal("JWT_SECRET_KEY tidak ditemukan di environment variables")
	}

	db := database.ConnectToPostgresql()

	jwtService := auth.NewJWTService()

	// repositories
	pelangganRepo := repositories.NewPelangganRepository(db)
	penggunaRepo := repositories.NewPenggunaRepository(db)
	pesananRepo := repositories.NewPesananRepository(db)
	ulasanRepo := repositories.NewUlasanRepository(db)
	voucherRepo := repositories.NewVoucherRepository(db)
	notifRepo := repositories.NewNotifikasiRepository(db)
	pembayaranRepo := repositories.NewPembayaranRepository(db)
	pegawaiRepo := repositories.NewPegawaiRepository(db)
	tarifRepo := repositories.NewTarifRepository(db)
	branchRepo := repositories.NewBranchRepository(db)
	kurirRepo := repositories.NewKurirRepository(db)
	superadminRepo := repositories.NewSuperadminRepository(db)

	// services
	authSvc := services.NewAuthService(pelangganRepo, penggunaRepo, jwtService)
	pelangganSvc := services.NewPelangganService(pelangganRepo)
	pesananSvc := services.NewPesananService(pesananRepo, ulasanRepo, tarifRepo, pegawaiRepo, voucherRepo, kurirRepo, pelangganRepo, )
	ulasanSvc := services.NewUlasanService(ulasanRepo, pesananRepo)
	voucherSvc := services.NewVoucherService(voucherRepo)
	notifSvc := services.NewNotifikasiService(notifRepo)
	pembayaranSvc := services.NewPembayaranService(pembayaranRepo, pesananRepo, voucherRepo)
	branchSvc := services.NewBranchService(branchRepo)
	kurirSvc := services.NewKurirService(kurirRepo)
	superadminSvc := services.NewSuperadminService(superadminRepo)

	// handlers
	h := routes.Handlers{
		Auth:       handlers.NewAuthHandler(authSvc),
		Pelanggan:  handlers.NewPelangganHandler(pelangganSvc),
		Pesanan:    handlers.NewPesananHandler(pesananSvc),
		Ulasan:     handlers.NewUlasanHandler(ulasanSvc),
		Voucher:    handlers.NewVoucherHandler(voucherSvc),
		Notifikasi: handlers.NewNotifikasiHandler(notifSvc),
		Pembayaran: handlers.NewPembayaranHandler(pembayaranSvc),
		Kurir:      handlers.NewKurirHandler(kurirSvc),
		Branch:     handlers.NewBranchHandler(branchSvc),
		Superadmin: handlers.NewSuperadminHandler(superadminSvc),
	}

	r := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	r.Use(cors.New(corsConfig))

	routes.SetupRoutes(r, jwtService, penggunaRepo, h)

	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
