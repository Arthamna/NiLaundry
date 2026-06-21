-- 1) Validasi Insert Ulasan
CREATE OR REPLACE FUNCTION fn_validasi_insert_ulasan()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_status_pesanan VARCHAR(64);
    v_jumlah_ulasan  INT;
BEGIN
    SELECT p.status_pesanan
      INTO v_status_pesanan
      FROM pesanan p
     WHERE p.id_pesanan = NEW.pesanan_id_pesanan;

    IF v_status_pesanan IS NULL THEN
        RAISE EXCEPTION 'Pesanan tidak ditemukan';
    END IF;

    IF v_status_pesanan <> 'selesai' THEN
        RAISE EXCEPTION 'Ulasan hanya dapat dibuat untuk pesanan selesai';
    END IF;

    SELECT COUNT(*) INTO v_jumlah_ulasan
      FROM ulasan u
     WHERE u.pesanan_id_pesanan = NEW.pesanan_id_pesanan;

    IF v_jumlah_ulasan > 0 THEN
        RAISE EXCEPTION 'Ulasan untuk pesanan ini sudah ada';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validasi_insert_ulasan ON ulasan;
CREATE TRIGGER validasi_insert_ulasan
BEFORE INSERT ON ulasan
FOR EACH ROW
EXECUTE FUNCTION fn_validasi_insert_ulasan();

-- 2) Update Status ketika Pembayaran Lunas
CREATE OR REPLACE FUNCTION fn_after_update_pembayaran_lunas()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_pelanggan_id INT;
    v_notif_id     INT;
BEGIN
    IF OLD.status_pembayaran IS DISTINCT FROM 'Lunas'
       AND NEW.status_pembayaran = 'Lunas' THEN

        UPDATE pesanan
           SET status_pesanan = 'Diproses'
         WHERE id_pesanan = NEW.pesanan_id_pesanan
           AND status_pesanan = 'Menunggu';

        SELECT p.pelanggan_id_pelanggan
          INTO v_pelanggan_id
          FROM pesanan p
         WHERE p.id_pesanan = NEW.pesanan_id_pesanan;

        INSERT INTO notifikasi (
            judul_notifikasi,
            pesan_notifikasi,
            tipe_notifikasi
        )
        VALUES (
            'Pembayaran Berhasil',
            'Pembayaran untuk pesanan #' || NEW.pesanan_id_pesanan ||
            ' sebesar Rp ' || TO_CHAR(NEW.jumlah_pembayaran, 'FM999G999G999G999') ||
            ' telah diterima. Pesanan Anda sedang diproses.',
            'PEMBAYARAN'
        )
        RETURNING id_notifikasi INTO v_notif_id;

        INSERT INTO notifikasi_pelanggan (
            notifikasi_id_notifikasi,
            pelanggan_id_pelanggan
        )
        VALUES (v_notif_id, v_pelanggan_id);
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_after_update_pembayaran_lunas ON pembayaran;
CREATE TRIGGER trg_after_update_pembayaran_lunas
AFTER UPDATE OF status_pembayaran ON pembayaran
FOR EACH ROW
EXECUTE FUNCTION fn_after_update_pembayaran_lunas();
