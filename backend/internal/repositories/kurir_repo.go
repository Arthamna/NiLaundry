package repositories

import (
	"context"
	"errors"

	"gorm.io/gorm"
)

// KurirRow projects the join used by GET /pelanggan/{id}/kurir.
type KurirRow struct {
	IDKurir        int    `gorm:"column:id_kurir"`
	NamaKurir      string `gorm:"column:nama_kurir"`
	NoPlatKurir    string `gorm:"column:no_plat_kurir"`
	JenisKendaraan string `gorm:"column:jenis_kendaraan"`
}

// OrderKurirRow projects the courier assigned to a specific order leg
// (pengiriman → kurir → tipe_kendaraan), used by the customer order-detail
// courier card. JenisPengiriman is 'pickup' or 'delivery'.
type OrderKurirRow struct {
	JenisPengiriman string `gorm:"column:jenis_pengiriman"`
	NamaKurir       string `gorm:"column:nama_kurir"`
	NoPlatKurir     string `gorm:"column:no_plat_kurir"`
	JenisKendaraan  string `gorm:"column:jenis_kendaraan"`
}

type KurirRepository interface {
	List(ctx context.Context, limit, offset int) ([]KurirRow, error)
	// PickRandom returns one kurir picked at random, used to auto-assign a
	// courier when a customer creates an order with pickup or delivery.
	// Returns nil when the kurir table is empty.
	PickRandom(ctx context.Context) (*KurirRow, error)
	// ListByPesanan returns the courier(s) assigned to an order's pickup /
	// delivery legs. Ownership is enforced in the query (the pesanan must
	// belong to pelangganID), so a wrong owner yields an empty slice.
	ListByPesanan(ctx context.Context, pelangganID, pesananID int) ([]OrderKurirRow, error)
}

type kurirRepo struct{ db *gorm.DB }

func NewKurirRepository(db *gorm.DB) KurirRepository {
	return &kurirRepo{db: db}
}

func (r *kurirRepo) List(ctx context.Context, limit, offset int) ([]KurirRow, error) {
	if limit <= 0 {
		limit = 50
	}
	if offset < 0 {
		offset = 0
	}
	const q = `
		SELECT
			k.id_kurir,
			k.nama_kurir,
			k.no_plat_kurir,
			tk.jenis_kendaraan
		FROM kurir k
		JOIN tipe_kendaraan tk
		  ON tk.id_kendaraan = k.tipe_kendaraan_id_kendaraan
		ORDER BY k.id_kurir ASC
		LIMIT ? OFFSET ?`

	var rows []KurirRow
	if err := r.db.WithContext(ctx).Raw(q, limit, offset).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *kurirRepo) PickRandom(ctx context.Context) (*KurirRow, error) {
	const q = `
		SELECT
			k.id_kurir,
			k.nama_kurir,
			k.no_plat_kurir,
			tk.jenis_kendaraan
		FROM kurir k
		JOIN tipe_kendaraan tk
		  ON tk.id_kendaraan = k.tipe_kendaraan_id_kendaraan
		ORDER BY RANDOM()
		LIMIT 1`

	var row KurirRow
	err := r.db.WithContext(ctx).Raw(q).Scan(&row).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	// GORM's Scan into a struct returns the zero value (no error) when no
	// row matched; detect via the id field.
	if row.IDKurir == 0 {
		return nil, nil
	}
	return &row, nil
}

func (r *kurirRepo) ListByPesanan(ctx context.Context, pelangganID, pesananID int) ([]OrderKurirRow, error) {
	const q = `
		SELECT
			pg.jenis_pengiriman,
			k.nama_kurir,
			k.no_plat_kurir,
			tk.jenis_kendaraan
		FROM pengiriman pg
		JOIN pesanan p          ON p.id_pesanan  = pg.pesanan_id_pesanan
		JOIN kurir k            ON k.id_kurir    = pg.kurir_id_kurir
		JOIN tipe_kendaraan tk  ON tk.id_kendaraan = k.tipe_kendaraan_id_kendaraan
		WHERE pg.pesanan_id_pesanan = ?
		  AND p.pelanggan_id_pelanggan = ?
		ORDER BY pg.id_pengiriman ASC`

	var rows []OrderKurirRow
	if err := r.db.WithContext(ctx).Raw(q, pesananID, pelangganID).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}
