package models

type Tarif struct {
	IDTarif              int     `gorm:"column:id_tarif;primaryKey;autoIncrement"`
	HargaPerSatuan       float64 `gorm:"column:harga_per_satuan"`
	CabangLaundryIDCabang int    `gorm:"column:cabang_laundry_id_cabang"`
	LayananIDLayanan     int     `gorm:"column:layanan_id_layanan"`
}

func (Tarif) TableName() string { return "tarif" }
