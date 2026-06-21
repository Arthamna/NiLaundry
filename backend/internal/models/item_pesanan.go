package models

type ItemPesanan struct {
	IDItemPesanan              int     `gorm:"column:id_item_pesanan;primaryKey;autoIncrement"`
	KuantitasSatuanItemPesanan int     `gorm:"column:kuantitas_satuan_item_pesanan"`
	SubtotalPesanan            float64 `gorm:"column:subtotal_pesanan"`
	CatatanItemPesanan         *string `gorm:"column:catatan_item_pesanan"`
	PesananIDPesanan           int     `gorm:"column:pesanan_id_pesanan"`
	TarifIDTarif               int     `gorm:"column:tarif_id_tarif"`
}

func (ItemPesanan) TableName() string { return "item_pesanan" }
