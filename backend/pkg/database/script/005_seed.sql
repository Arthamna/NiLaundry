-- NiLaundry seed. Idempotent via ON CONFLICT DO NOTHING + setval afterwards.

BEGIN;

-- ============================================================================
-- role (superadmin, admin). Pelanggan role is implicit, not stored here.
-- ============================================================================
INSERT INTO role (id_role, nama_role) VALUES
    (1, 'superadmin'),
    (2, 'admin')
ON CONFLICT (id_role) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('role', 'id_role'),
    COALESCE((SELECT MAX(id_role) FROM role), 1),
    true
);

-- ============================================================================
-- cabang_laundry
-- ============================================================================
INSERT INTO cabang_laundry (id_cabang, nama_cabang, alamat_cabang, no_telp_cabang, jam_buka_cabang, jam_tutup_cabang) VALUES
    (1, 'NiLaundry Pusat',  'Jl. Sudirman No. 1, Jakarta',      '021-1111111', '08:00', '21:00'),
    (2, 'NiLaundry Depok',  'Jl. Margonda Raya No. 100, Depok', '021-2222222', '08:00', '20:00'),
    (3, 'NiLaundry Bogor',  'Jl. Pajajaran No. 50, Bogor',      '0251-333333', '07:00', '22:00')
ON CONFLICT (id_cabang) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('cabang_laundry', 'id_cabang'),
    COALESCE((SELECT MAX(id_cabang) FROM cabang_laundry), 1),
    true
);

-- ============================================================================
-- pengguna: 1 superadmin + 3 admins (one per cabang).
-- Passwords (bcrypt cost=10, golang.org/x/crypto/bcrypt):
--   superadmin@nilaundry.com / superadmin123
--   admin.pusat@nilaundry.com / admin123
--   admin.depok@nilaundry.com / admin123
--   admin.bogor@nilaundry.com / admin123
-- Superadmin has cabang_laundry_id_cabang = NULL (manages all branches).
-- ============================================================================
INSERT INTO pengguna (id_pengguna, nama_pengguna, email_pengguna, password_pengguna, role_id_role, cabang_laundry_id_cabang) VALUES
    (1, 'Super Admin',     'superadmin@nilaundry.com',
        '$2a$10$wpWfRtM.PdT/FHkutjd1Fu6FU3iftSde1PeJrEZVGr8tvfd3GTqGa', 1, NULL),
    (2, 'Admin Pusat',     'admin.pusat@nilaundry.com',
        '$2a$10$X3E/D.2/TWU56IrzVItud.Bv7qxbMb3Bd4JOi7fyLsGhIsaWL7cby', 2, 1),
    (3, 'Admin Depok',     'admin.depok@nilaundry.com',
        '$2a$10$X3E/D.2/TWU56IrzVItud.Bv7qxbMb3Bd4JOi7fyLsGhIsaWL7cby', 2, 2),
    (4, 'Admin Bogor',     'admin.bogor@nilaundry.com',
        '$2a$10$X3E/D.2/TWU56IrzVItud.Bv7qxbMb3Bd4JOi7fyLsGhIsaWL7cby', 2, 3)
ON CONFLICT (id_pengguna) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('pengguna', 'id_pengguna'),
    COALESCE((SELECT MAX(id_pengguna) FROM pengguna), 1),
    true
);

-- ============================================================================
-- pegawai (3 per cabang)
-- ============================================================================
INSERT INTO pegawai (id_pegawai, nama_pegawai, email_pegawai, no_telp_pegawai, alamat_pegawai, cabang_laundry_id_cabang) VALUES
    (1, 'Andi Pratama',   'andi.pusat@nilaundry.com',  '081200000001', 'Jakarta', 1),
    (2, 'Budi Santoso',   'budi.pusat@nilaundry.com',  '081200000002', 'Jakarta', 1),
    (3, 'Citra Lestari',  'citra.pusat@nilaundry.com', '081200000003', 'Jakarta', 1),
    (4, 'Dewi Anggraini', 'dewi.depok@nilaundry.com',  '081200000004', 'Depok',   2),
    (5, 'Eko Susanto',    'eko.depok@nilaundry.com',   '081200000005', 'Depok',   2),
    (6, 'Fajar Nugroho',  'fajar.depok@nilaundry.com', '081200000006', 'Depok',   2),
    (7, 'Gita Maharani',  'gita.bogor@nilaundry.com',  '081200000007', 'Bogor',   3),
    (8, 'Hadi Wijaya',    'hadi.bogor@nilaundry.com',  '081200000008', 'Bogor',   3),
    (9, 'Indah Permata',  'indah.bogor@nilaundry.com', '081200000009', 'Bogor',   3)
ON CONFLICT (id_pegawai) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('pegawai', 'id_pegawai'),
    COALESCE((SELECT MAX(id_pegawai) FROM pegawai), 1),
    true
);

-- ============================================================================
-- layanan
-- ============================================================================
INSERT INTO layanan (id_layanan, nama_layanan, satuan_layanan, deskripsi_layanan) VALUES
    (1, 'Cuci Kering',        'kg',     'Cuci tanpa setrika'),
    (2, 'Cuci Setrika',       'kg',     'Cuci + setrika rapi'),
    (3, 'Setrika Saja',       'kg',     'Hanya setrika'),
    (4, 'Cuci Express 6 Jam', 'kg',     'Selesai dalam 6 jam'),
    (5, 'Cuci Sepatu',        'pasang', 'Cuci sepatu lengkap'),
    (6, 'Cuci Bed Cover',     'pcs',    'Cuci bed cover ukuran besar')
ON CONFLICT (id_layanan) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('layanan', 'id_layanan'),
    COALESCE((SELECT MAX(id_layanan) FROM layanan), 1),
    true
);

-- ============================================================================
-- tarif: setiap cabang punya 6 layanan
-- ============================================================================
INSERT INTO tarif (id_tarif, harga_per_satuan, cabang_laundry_id_cabang, layanan_id_layanan) VALUES
    (1,  7000, 1, 1),
    (2, 10000, 1, 2),
    (3,  5000, 1, 3),
    (4, 15000, 1, 4),
    (5, 25000, 1, 5),
    (6, 35000, 1, 6),

    (7,  6500, 2, 1),
    (8,  9500, 2, 2),
    (9,  4500, 2, 3),
    (10, 14000, 2, 4),
    (11, 24000, 2, 5),
    (12, 33000, 2, 6),

    (13,  6000, 3, 1),
    (14,  9000, 3, 2),
    (15,  4000, 3, 3),
    (16, 13000, 3, 4),
    (17, 23000, 3, 5),
    (18, 32000, 3, 6)
ON CONFLICT (id_tarif) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('tarif', 'id_tarif'),
    COALESCE((SELECT MAX(id_tarif) FROM tarif), 1),
    true
);

-- ============================================================================
-- voucher
-- ============================================================================
INSERT INTO voucher (
    id_voucher,
    kode_voucher,
    tipe_diskon_voucher,
    nilai_diskon_voucher,
    min_pembelian_voucher,
    berlaku_hingga_voucher,
    kuota_voucher,
    terpakai_voucher
) VALUES
    (1, 'WELCOME10', 'persen',  10,   20000, NOW() + INTERVAL '60 days', 100, 0),
    (2, 'HEMAT5K',   'nominal', 5000, 25000, NOW() + INTERVAL '30 days', 200, 0),
    (3, 'SUPERSALE', 'persen',  25,   50000, NOW() + INTERVAL '14 days',  50, 0),
    (4, 'GRATIS3K',  'nominal', 3000, 15000, NOW() + INTERVAL '90 days', 500, 0)
ON CONFLICT (id_voucher) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('voucher', 'id_voucher'),
    COALESCE((SELECT MAX(id_voucher) FROM voucher), 1),
    true
);

-- ============================================================================
-- notifikasi dasar
-- ============================================================================
INSERT INTO notifikasi (id_notifikasi, judul_notifikasi, pesan_notifikasi, tipe_notifikasi) VALUES
    (1, 'Pesanan Diproses',     'Pesanan Anda sedang diproses oleh pegawai.',      'pesanan'),
    (2, 'Pesanan Selesai',      'Pesanan Anda sudah selesai dan siap diambil.',    'pesanan'),
    (3, 'Promo Voucher',        'Gunakan voucher untuk mendapatkan diskon.',       'promo'),
    (4, 'Pesanan Dijemput',     'Pesanan Anda sudah dijemput dan sedang diproses.','pesanan'),
    (5, 'Pesanan Siap Diambil', 'Pesanan Anda sudah selesai dan siap diambil.',    'pesanan')
ON CONFLICT (id_notifikasi) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('notifikasi', 'id_notifikasi'),
    COALESCE((SELECT MAX(id_notifikasi) FROM notifikasi), 1),
    true
);

-- ============================================================================
-- pelanggan: demo customer agar id_pelanggan = 1 valid.
-- Password (bcrypt cost=10): rina.amelia@nilaundry.com / password123
-- ============================================================================
INSERT INTO pelanggan (
    id_pelanggan,
    nama_pelanggan,
    password_pelanggan,
    email_pelanggan,
    no_telp_pelanggan,
    alamat_pelanggan
) VALUES
    (1, 'Rina Amelia',
       '$2a$10$KDJAL9Mc3M1Lp3GPbTTRUOHBgYHSmAM6Uc06MIEesOjAhfk1QY6PO',
       'rina.amelia@nilaundry.com', '081300000001', 'Jakarta')
ON CONFLICT (id_pelanggan) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('pelanggan', 'id_pelanggan'),
    COALESCE((SELECT MAX(id_pelanggan) FROM pelanggan), 1),
    true
);

-- voucher untuk pelanggan 1
INSERT INTO voucher_pelanggan (voucher_id_voucher, pelanggan_id_pelanggan) VALUES
    (1, 1),
    (2, 1),
    (3, 1)
ON CONFLICT DO NOTHING;

-- 5 pesanan untuk pelanggan 1, pegawai dibuat bervariasi
INSERT INTO pesanan (
    id_pesanan,
    jumlah_item_pesanan,
    status_pesanan,
    catatan_pesanan,
    estimasi_selesai_pesanan,
    total_harga_pesanan,
    pelanggan_id_pelanggan,
    voucher_id_voucher,
    pegawai_id_pegawai
) VALUES
    (1, 2, 'selesai',  '', NOW() + INTERVAL '2 days', 14000, 1, 1,    1),
    (2, 1, 'diproses', '', NOW() + INTERVAL '1 day',  26000, 1, NULL, 4),
    (3, 2, 'selesai',  '', NOW() + INTERVAL '3 days', 15000, 1, 2,    7),
    (4, 1, 'diambil',  '', NOW() + INTERVAL '4 days', 35000, 1, 3,    2),
    (5, 2, 'baru',     '', NOW() + INTERVAL '1 day',  23500, 1, NULL, 5)
ON CONFLICT (id_pesanan) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('pesanan', 'id_pesanan'),
    COALESCE((SELECT MAX(id_pesanan) FROM pesanan), 1),
    true
);

-- detail item pesanan yang terhubung ke tarif
INSERT INTO item_pesanan (
    id_item_pesanan,
    kuantitas_satuan_item_pesanan,
    subtotal_pesanan,
    catatan_item_pesanan,
    pesanan_id_pesanan,
    tarif_id_tarif
) VALUES
    (1, 2, 14000, NULL, 1, 1),
    (2, 1, 10000, NULL, 1, 2),

    (3, 4, 26000, NULL, 2, 7),

    (4, 3, 18000, NULL, 3, 13),
    (5, 1,  9000, NULL, 3, 14),

    (6, 2, 35000, NULL, 4, 6),

    (7, 2, 19000, NULL, 5, 8),
    (8, 1,  4500, NULL, 5, 9)
ON CONFLICT (id_item_pesanan) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('item_pesanan', 'id_item_pesanan'),
    COALESCE((SELECT MAX(id_item_pesanan) FROM item_pesanan), 1),
    true
);

-- notifikasi pelanggan
INSERT INTO notifikasi_pelanggan (notifikasi_id_notifikasi, pelanggan_id_pelanggan) VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 1),
    (5, 1)
ON CONFLICT DO NOTHING;

-- ulasan dari pesanan id=1 (status='selesai' agar lolos trigger validasi_insert_ulasan)
INSERT INTO ulasan (id_ulasan, rating_ulasan, komentar_ulasan, pesanan_id_pesanan) VALUES
    (1, 5, 'Hasil bersih, rapi, dan selesai tepat waktu.', 1)
ON CONFLICT (id_ulasan) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('ulasan', 'id_ulasan'),
    COALESCE((SELECT MAX(id_ulasan) FROM ulasan), 1),
    true
);

COMMIT;
