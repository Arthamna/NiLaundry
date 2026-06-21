package models

type Pelanggan struct {
	IDPelanggan       int    `gorm:"column:id_pelanggan;primaryKey;autoIncrement"`
	NamaPelanggan     string `gorm:"column:nama_pelanggan"`
	PasswordPelanggan string `gorm:"column:password_pelanggan"`
	EmailPelanggan    string `gorm:"column:email_pelanggan;unique"`
	NoTelpPelanggan   string `gorm:"column:no_telp_pelanggan"`
	AlamatPelanggan   string `gorm:"column:alamat_pelanggan"`
}

func (Pelanggan) TableName() string { return "pelanggan" }
