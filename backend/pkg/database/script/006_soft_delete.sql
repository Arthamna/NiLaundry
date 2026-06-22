-- Soft-delete support for management entities (pegawai, kurir, cabang_laundry).
-- A non-NULL deleted_at hides the row from the superadmin management lists while
-- preserving foreign-key references from historical orders. Idempotent so it can
-- be applied to databases provisioned before the column existed.

ALTER TABLE pegawai        ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE kurir          ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE cabang_laundry ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
