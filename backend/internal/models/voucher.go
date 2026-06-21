package models

import "time"

type Voucher struct {
	IDVoucher           int       `gorm:"column:id_voucher;primaryKey;autoIncrement"`
	KodeVoucher         string    `gorm:"column:kode_voucher;unique"`
	TipeDiskonVoucher   string    `gorm:"column:tipe_diskon_voucher"`
	NilaiDiskonVoucher  float64   `gorm:"column:nilai_diskon_voucher"`
	MinPembelianVoucher float64   `gorm:"column:min_pembelian_voucher"`
	BerlakuHinggaVoucher time.Time `gorm:"column:berlaku_hingga_voucher"`
	KuotaVoucher        int       `gorm:"column:kuota_voucher"`
	TerpakaiVoucher     int       `gorm:"column:terpakai_voucher"`
}

func (Voucher) TableName() string { return "voucher" }

type VoucherPelanggan struct {
	VoucherIDVoucher     int `gorm:"column:voucher_id_voucher;primaryKey"`
	PelangganIDPelanggan int `gorm:"column:pelanggan_id_pelanggan;primaryKey"`
}

func (VoucherPelanggan) TableName() string { return "voucher_pelanggan" }
