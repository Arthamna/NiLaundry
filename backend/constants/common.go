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

	// Delivery-flow statuses (the order detail timeline). A pickup-flow order
	// starts at "pickup"; a walk-in (drop-off) order starts at "processing".
	StatusPesananPickup     = "pickup"
	StatusPesananProcessing = "processing"
	StatusPesananDelivery   = "delivery"
	StatusPesananCompleted  = "completed"

	// jenis_ambil: how the laundry reaches the branch.
	JenisAmbilPickup = "pickup" // courier pickup
	JenisAmbilWalkin = "walkin" // customer drops off

	// jenis_antar: how the finished laundry gets back to the customer.
	JenisAntarDelivery = "delivery" // courier delivery
	JenisAntarWalkin   = "walkin"   // customer self pick-up

	StatusPembayaranPending = "pending"
	StatusPembayaranLunas   = "Lunas"

	TipeDiskonPersen  = "persen"
	TipeDiskonNominal = "nominal"
)
