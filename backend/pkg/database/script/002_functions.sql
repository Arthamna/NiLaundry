-- 1) HitungTotalHematVoucher
CREATE OR REPLACE FUNCTION hitung_total_hemat_voucher(p_id_pelanggan INT)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    total_hemat NUMERIC := 0;
BEGIN
    SELECT COALESCE(SUM(v.nilai_diskon_voucher), 0)
      INTO total_hemat
      FROM pesanan p
      JOIN voucher v
        ON v.id_voucher = p.voucher_id_voucher
     WHERE p.pelanggan_id_pelanggan = p_id_pelanggan
       AND p.voucher_id_voucher IS NOT NULL;
    RETURN total_hemat;
END;
$$;

-- 2) HitungSubtotalPesanan
CREATE OR REPLACE FUNCTION hitung_subtotal_pesanan(p_id_pesanan INT)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    subtotal NUMERIC := 0;
BEGIN
    SELECT COALESCE(SUM(ip.subtotal_pesanan), 0)
      INTO subtotal
      FROM item_pesanan ip
     WHERE ip.pesanan_id_pesanan = p_id_pesanan;
    RETURN subtotal;
END;
$$;
