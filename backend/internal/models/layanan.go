package models

type Layanan struct {
	IDLayanan        int     `gorm:"column:id_layanan;primaryKey;autoIncrement"`
	NamaLayanan      string  `gorm:"column:nama_layanan"`
	SatuanLayanan    string  `gorm:"column:satuan_layanan"`
	DeskripsiLayanan *string `gorm:"column:deskripsi_layanan"`
}

func (Layanan) TableName() string { return "layanan" }
