package models

import "time"

// Pengiriman is the delivery/pickup row that ties a kurir to a pesanan.
// We create one row per pickup/delivery leg (jenis_pengiriman = 'pickup'
// or 'delivery'). id_pengiriman is plain INT (no IDENTITY in schema) — we
// allocate it via MAX(id)+1 inside the create-order transaction.
type Pengiriman struct {
	IDPengiriman     int       `gorm:"column:id_pengiriman;primaryKey"`
	WaktuPengiriman  time.Time `gorm:"column:waktu_pengiriman"`
	JenisPengiriman  string    `gorm:"column:jenis_pengiriman"`
	AlamatPengiriman string    `gorm:"column:alamat_pengiriman"`
	StatusPengiriman string    `gorm:"column:status_pengiriman"`
	OngkirPengiriman float64   `gorm:"column:ongkir_pengiriman"`
	BuktiPengiriman  string    `gorm:"column:bukti_pengiriman"`
	PesananIDPesanan int       `gorm:"column:pesanan_id_pesanan"`
	KurirIDKurir     int       `gorm:"column:kurir_id_kurir"`
}

func (Pengiriman) TableName() string { return "pengiriman" }
