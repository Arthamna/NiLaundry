package models

type TipeKendaraan struct {
	IDKendaraan     int    `gorm:"column:id_kendaraan;primaryKey"`
	JenisKendaraan  string `gorm:"column:jenis_kendaraan"`
}

func (TipeKendaraan) TableName() string { return "tipe_kendaraan" }

type Kurir struct {
	IDKurir                  int    `gorm:"column:id_kurir;primaryKey"`
	NamaKurir                string `gorm:"column:nama_kurir"`
	NoTelpKurir              string `gorm:"column:no_telp_kurir"`
	NoPlatKurir              string `gorm:"column:no_plat_kurir"`
	TipeKendaraanIDKendaraan int    `gorm:"column:tipe_kendaraan_id_kendaraan"`
}

func (Kurir) TableName() string { return "kurir" }
