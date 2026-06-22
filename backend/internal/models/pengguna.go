package models

type Pengguna struct {
	IDPengguna             int    `gorm:"column:id_pengguna;primaryKey;autoIncrement"`
	NamaPengguna           string `gorm:"column:nama_pengguna"`
	EmailPengguna          string `gorm:"column:email_pengguna;unique"`
	PasswordPengguna       string `gorm:"column:password_pengguna"`
	RoleIDRole             int    `gorm:"column:role_id_role"`
	CabangLaundryIDCabang  *int   `gorm:"column:cabang_laundry_id_cabang"`
	Role                   *Role  `gorm:"foreignKey:RoleIDRole;references:IDRole"`
	CabangLaundry          *CabangLaundry `gorm:"foreignKey:CabangLaundryIDCabang;references:IDCabang"`
}

func (Pengguna) TableName() string { return "pengguna" }
