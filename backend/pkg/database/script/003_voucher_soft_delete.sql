-- 003_voucher_soft_delete.sql
-- Adds soft-delete support to vouchers, matching pegawai/kurir/cabang_laundry.
-- Non-destructive: nullable column; existing rows stay active (deleted_at IS NULL).

ALTER TABLE voucher ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
