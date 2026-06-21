package models

type Ulasan struct {
	IDUlasan         int    `gorm:"column:id_ulasan;primaryKey;autoIncrement"`
	RatingUlasan     int    `gorm:"column:rating_ulasan"`
	KomentarUlasan   string `gorm:"column:komentar_ulasan"`
	PesananIDPesanan int    `gorm:"column:pesanan_id_pesanan"`
}

func (Ulasan) TableName() string { return "ulasan" }
