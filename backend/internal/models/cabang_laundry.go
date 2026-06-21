package models

import "time"

type CabangLaundry struct {
	IDCabang        int       `gorm:"column:id_cabang;primaryKey;autoIncrement"`
	NamaCabang      string    `gorm:"column:nama_cabang"`
	AlamatCabang    string    `gorm:"column:alamat_cabang"`
	NoTelpCabang    string    `gorm:"column:no_telp_cabang"`
	JamBukaCabang   time.Time `gorm:"column:jam_buka_cabang"`
	JamTutupCabang  time.Time `gorm:"column:jam_tutup_cabang"`
}

func (CabangLaundry) TableName() string { return "cabang_laundry" }
