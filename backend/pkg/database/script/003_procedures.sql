-- Klaim Voucher Pelanggan
CREATE OR REPLACE PROCEDURE klaim_voucher_pelanggan(
    IN p_id_pelanggan INT,
    IN p_id_voucher INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
          FROM voucher v
         WHERE v.id_voucher = p_id_voucher
           AND v.berlaku_hingga_voucher >= NOW()
           AND v.kuota_voucher > v.terpakai_voucher
    ) THEN
        RAISE EXCEPTION 'Voucher tidak tersedia';
    END IF;

    IF EXISTS (
        SELECT 1
          FROM voucher_pelanggan vp
         WHERE vp.voucher_id_voucher = p_id_voucher
           AND vp.pelanggan_id_pelanggan = p_id_pelanggan
    ) THEN
        RAISE EXCEPTION 'Voucher sudah diklaim';
    END IF;

    INSERT INTO voucher_pelanggan (voucher_id_voucher, pelanggan_id_pelanggan)
    VALUES (p_id_voucher, p_id_pelanggan);

    UPDATE voucher
       SET terpakai_voucher = terpakai_voucher + 1
     WHERE id_voucher = p_id_voucher;
END;
$$;
