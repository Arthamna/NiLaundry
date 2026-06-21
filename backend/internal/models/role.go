package models

type Role struct {
	IDRole   int    `gorm:"column:id_role;primaryKey;autoIncrement"`
	NamaRole string `gorm:"column:nama_role;unique"`
}

func (Role) TableName() string { return "role" }
