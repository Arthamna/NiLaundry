package models

import "time"

type Pembayaran struct {
	IDPembayaran      int       `gorm:"column:id_pembayaran;primaryKey;autoIncrement"`
	WaktuPembayaran   time.Time `gorm:"column:waktu_pembayaran"`
	MetodePembayaran  string    `gorm:"column:metode_pembayaran"`
	StatusPembayaran  string    `gorm:"column:status_pembayaran"`
	JumlahPembayaran  float64   `gorm:"column:jumlah_pembayaran"`
	PesananIDPesanan  int       `gorm:"column:pesanan_id_pesanan"`
}

func (Pembayaran) TableName() string { return "pembayaran" }
