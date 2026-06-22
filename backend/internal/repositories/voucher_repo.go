package repositories

import (
	"arthamna/NiLaundry/internal/models"
	"context"
	"errors"

	"gorm.io/gorm"
)

// OwnedVoucherRow is a claimed voucher plus whether the customer has already
// applied it to one of their orders (used).
type OwnedVoucherRow struct {
	models.Voucher
	UsedByMe bool `gorm:"column:used_by_me"`
}

type VoucherRepository interface {
	ListAvailable(ctx context.Context, pelangganID int) ([]models.Voucher, error)
	ListOwned(ctx context.Context, pelangganID int) ([]models.Voucher, error)
	// ListOwnedWithUsage returns claimed vouchers tagged with a per-customer
	// "used" flag (true when applied to any of the customer's orders).
	ListOwnedWithUsage(ctx context.Context, pelangganID int) ([]OwnedVoucherRow, error)
	FindByID(ctx context.Context, id int) (*models.Voucher, error)
	FindByKode(ctx context.Context, kode string) (*models.Voucher, error)
	TotalHemat(ctx context.Context, pelangganID int) (float64, error)
	ClaimVoucher(ctx context.Context, pelangganID, voucherID int) error
}

type voucherRepo struct{ db *gorm.DB }

func NewVoucherRepository(db *gorm.DB) VoucherRepository {
	return &voucherRepo{db: db}
}

func (r *voucherRepo) ListAvailable(ctx context.Context, pelangganID int) ([]models.Voucher, error) {
	var rows []models.Voucher
	err := r.db.WithContext(ctx).
		Where("berlaku_hingga_voucher >= NOW() AND kuota_voucher > terpakai_voucher").
		Where(`NOT EXISTS (
			SELECT 1 FROM pesanan p
			WHERE p.pelanggan_id_pelanggan = ? AND p.voucher_id_voucher = voucher.id_voucher
		)`, pelangganID).
		Order("id_voucher DESC").
		Find(&rows).Error
	if err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *voucherRepo) ListOwned(ctx context.Context, pelangganID int) ([]models.Voucher, error) {
	var rows []models.Voucher
	err := r.db.WithContext(ctx).
		Joins("JOIN voucher_pelanggan vp ON vp.voucher_id_voucher = voucher.id_voucher").
		Where("vp.pelanggan_id_pelanggan = ?", pelangganID).
		Order("voucher.id_voucher DESC").
		Find(&rows).Error
	if err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *voucherRepo) ListOwnedWithUsage(ctx context.Context, pelangganID int) ([]OwnedVoucherRow, error) {
	const q = `
		SELECT
			v.id_voucher,
			v.kode_voucher,
			v.tipe_diskon_voucher,
			v.nilai_diskon_voucher,
			v.min_pembelian_voucher,
			v.berlaku_hingga_voucher,
			v.kuota_voucher,
			v.terpakai_voucher,
			EXISTS (
				SELECT 1 FROM pesanan p
				WHERE p.pelanggan_id_pelanggan = vp.pelanggan_id_pelanggan
				  AND p.voucher_id_voucher = v.id_voucher
			) AS used_by_me
		FROM voucher v
		JOIN voucher_pelanggan vp ON vp.voucher_id_voucher = v.id_voucher
		WHERE vp.pelanggan_id_pelanggan = ?
		ORDER BY v.id_voucher DESC`
	var rows []OwnedVoucherRow
	if err := r.db.WithContext(ctx).Raw(q, pelangganID).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *voucherRepo) FindByID(ctx context.Context, id int) (*models.Voucher, error) {
	var v models.Voucher
	if err := r.db.WithContext(ctx).First(&v, "id_voucher = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &v, nil
}

func (r *voucherRepo) FindByKode(ctx context.Context, kode string) (*models.Voucher, error) {
	var v models.Voucher
	if err := r.db.WithContext(ctx).First(&v, "kode_voucher = ?", kode).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &v, nil
}

func (r *voucherRepo) TotalHemat(ctx context.Context, pelangganID int) (float64, error) {
	var out float64
	row := r.db.WithContext(ctx).Raw(
		`SELECT hitung_total_hemat_voucher(?) AS total_hemat_voucher`, pelangganID,
	).Row()
	if err := row.Scan(&out); err != nil {
		return 0, err
	}
	return out, nil
}

// ClaimVoucher calls the stored procedure documented in pdm spec.
func (r *voucherRepo) ClaimVoucher(ctx context.Context, pelangganID, voucherID int) error {
	return r.db.WithContext(ctx).Exec(`CALL klaim_voucher_pelanggan(?, ?)`, pelangganID, voucherID).Error
}
