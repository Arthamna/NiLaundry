package models

import "time"

type Pesanan struct {
	IDPesanan              int       `gorm:"column:id_pesanan;primaryKey;autoIncrement"`
	JumlahItemPesanan      int       `gorm:"column:jumlah_item_pesanan"`
	StatusPesanan          string    `gorm:"column:status_pesanan"`
	CatatanPesanan         string    `gorm:"column:catatan_pesanan"`
	EstimasiSelesaiPesanan time.Time `gorm:"column:estimasi_selesai_pesanan"`
	TotalHargaPesanan      float64   `gorm:"column:total_harga_pesanan"`
	PelangganIDPelanggan   int       `gorm:"column:pelanggan_id_pelanggan"`
	VoucherIDVoucher       *int      `gorm:"column:voucher_id_voucher"`
	PegawaiIDPegawai       int       `gorm:"column:pegawai_id_pegawai"`
	JenisAmbil             string    `gorm:"column:jenis_ambil"` // 'pickup' | 'walkin'
	JenisAntar             string    `gorm:"column:jenis_antar"` // 'delivery' | 'walkin'
}

func (Pesanan) TableName() string { return "pesanan" }
