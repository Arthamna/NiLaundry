package repositories

import (
	"arthamna/NiLaundry/internal/models"
	"context"

	"gorm.io/gorm"
)

// KatalogRow is a flattened cabang × tarif × layanan row used to build the
// "create new order" catalog (one row per sellable tarif at a branch).
type KatalogRow struct {
	CabangID       int     `gorm:"column:cabang_id"`
	NamaCabang     string  `gorm:"column:nama_cabang"`
	AlamatCabang   string  `gorm:"column:alamat_cabang"`
	TarifID        int     `gorm:"column:tarif_id"`
	LayananID      int     `gorm:"column:layanan_id"`
	NamaLayanan    string  `gorm:"column:nama_layanan"`
	SatuanLayanan  string  `gorm:"column:satuan_layanan"`
	HargaPerSatuan float64 `gorm:"column:harga_per_satuan"`
}

type TarifRepository interface {
	FindByIDs(ctx context.Context, ids []int) ([]models.Tarif, error)
	// ListKatalog returns every branch's sellable services (tarif joined with
	// its cabang and layanan), ordered by branch then layanan.
	ListKatalog(ctx context.Context) ([]KatalogRow, error)
}

type tarifRepo struct{ db *gorm.DB }

func NewTarifRepository(db *gorm.DB) TarifRepository {
	return &tarifRepo{db: db}
}

func (r *tarifRepo) ListKatalog(ctx context.Context) ([]KatalogRow, error) {
	const q = `
		SELECT
			c.id_cabang        AS cabang_id,
			c.nama_cabang      AS nama_cabang,
			c.alamat_cabang    AS alamat_cabang,
			t.id_tarif         AS tarif_id,
			l.id_layanan       AS layanan_id,
			l.nama_layanan     AS nama_layanan,
			l.satuan_layanan   AS satuan_layanan,
			t.harga_per_satuan AS harga_per_satuan
		FROM tarif t
		JOIN cabang_laundry c ON c.id_cabang   = t.cabang_laundry_id_cabang
		JOIN layanan l        ON l.id_layanan  = t.layanan_id_layanan
		ORDER BY c.id_cabang ASC, l.id_layanan ASC`
	var rows []KatalogRow
	if err := r.db.WithContext(ctx).Raw(q).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *tarifRepo) FindByIDs(ctx context.Context, ids []int) ([]models.Tarif, error) {
	if len(ids) == 0 {
		return nil, nil
	}
	var rows []models.Tarif
	if err := r.db.WithContext(ctx).Where("id_tarif IN ?", ids).Find(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}
