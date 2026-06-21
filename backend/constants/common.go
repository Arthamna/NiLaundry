package constants

const (
	// Subject types embedded in the JWT to disambiguate which table the
	// subject_id refers to (pelanggan vs pengguna).
	SubjectTypePelanggan = "pelanggan"
	SubjectTypePengguna  = "pengguna"

	// Role values stored in the JWT claim and (for non-customer) in the
	// `role` table.
	RoleCustomer   = "customer"
	RoleAdmin      = "admin"
	RoleSuperAdmin = "superadmin"

	JWTExpireMinutes = 60 * 24

	StatusPesananMenunggu = "Menunggu"
	StatusPesananDiproses = "Diproses"
	StatusPesananSelesai  = "selesai"
	StatusPesananActive   = "active"

	StatusPembayaranPending = "pending"
	StatusPembayaranLunas   = "Lunas"

	TipeDiskonPersen  = "persen"
	TipeDiskonNominal = "nominal"
)
