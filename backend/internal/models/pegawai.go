package models

type Pegawai struct {
	IDPegawai             int    `gorm:"column:id_pegawai;primaryKey;autoIncrement"`
	NamaPegawai           string `gorm:"column:nama_pegawai"`
	EmailPegawai          string `gorm:"column:email_pegawai"`
	NoTelpPegawai         string `gorm:"column:no_telp_pegawai"`
	AlamatPegawai         string `gorm:"column:alamat_pegawai"`
	CabangLaundryIDCabang int    `gorm:"column:cabang_laundry_id_cabang"`
}

func (Pegawai) TableName() string { return "pegawai" }
