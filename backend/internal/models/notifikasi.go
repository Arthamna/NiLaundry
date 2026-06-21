package models

type Notifikasi struct {
	IDNotifikasi     int    `gorm:"column:id_notifikasi;primaryKey;autoIncrement"`
	JudulNotifikasi  string `gorm:"column:judul_notifikasi"`
	PesanNotifikasi  string `gorm:"column:pesan_notifikasi"`
	TipeNotifikasi   string `gorm:"column:tipe_notifikasi"`
}

func (Notifikasi) TableName() string { return "notifikasi" }

type NotifikasiPelanggan struct {
	NotifikasiIDNotifikasi int `gorm:"column:notifikasi_id_notifikasi;primaryKey"`
	PelangganIDPelanggan   int `gorm:"column:pelanggan_id_pelanggan;primaryKey"`
}

func (NotifikasiPelanggan) TableName() string { return "notifikasi_pelanggan" }
