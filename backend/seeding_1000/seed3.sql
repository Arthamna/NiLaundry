BEGIN;

INSERT INTO cabang_laundry (id_cabang, nama_cabang, alamat_cabang, no_telp_cabang, jam_buka_cabang, jam_tutup_cabang) VALUES
    (1, 'NiLaundry Aster', 'Jl. Aster Raya No. 10, Jakarta', '0213000000', '08:00', '22:00'),
    (2, 'NiLaundry Aurora', 'Jl. Aurora Raya No. 11, Bandung', '0213000001', '07:30', '21:00'),
    (3, 'NiLaundry Binar', 'Jl. Binar Raya No. 12, Surabaya', '0213000002', '08:00', '21:00'),
ON CONFLICT DO NOTHING;

INSERT INTO pengguna (id_pengguna, nama_pengguna, email_pengguna, password_pengguna, role_id_role, cabang_laundry_id_cabang) VALUES
    (1, 'Tama Mahendra', 'tama.mahendra@nilaundry.com', '$2y$10$Ow0o848vaFSa060.TWy0BeQSLQ6TbfVmYp99nfNrzL2lqa9liCu2.', 1, NULL),
    (2, 'Zahra Kirana', 'zahra.kirana@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 1),
    (3, 'Nadia Salsabila', 'nadia.salsabila@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 2),
ON CONFLICT DO NOTHING;


INSERT INTO pelanggan (id_pelanggan, nama_pelanggan, password_pelanggan, email_pelanggan, no_telp_pelanggan, alamat_pelanggan) VALUES
    (1, 'Rani Amelinda', '$2y$10$mVRp04wrCIXDeFA5xRX80eZY0c9OEh9EBAfmTq.yLAFUPFAF0.BGy', 'rani.amelinda@mail.com', '081370000000', 'Jl. Melati No. 5, Jakarta'),
    (2, 'Damar Hafiz', '$2y$10$uJcWMGBgQgMpkPp.sCIZCuj6Hg2lO4GE3Nhxm1W/VewF0Wi7kdx1O', 'damar.hafiz@mail.com', '081370000001', 'Jl. Melati No. 6, Surabaya'),
    (3, 'Tasya Melati', '$2y$10$L81c9CVv9moFGRby1D.gveWVDw3wfd8gkFtqNtRkJVS8l/nHspwXi', 'tasya.melati@mail.com', '081370000002', 'Jl. Melati No. 7, Bogor'),
ON CONFLICT DO NOTHING;


INSERT INTO pegawai (id_pegawai, nama_pegawai, email_pegawai, no_telp_pegawai, alamat_pegawai, cabang_laundry_id_cabang)
SELECT
    gs,
    (ARRAY['Andi', 'Budi', 'Candra', 'Deni', 'Eko', 'Fajar', 'Gilang', 'Hadi', 'Ilham', 'Joko', 'Kiki', 'Luthfi', 'Miko', 'Nanda', 'Oka', 'Putra', 'Qori', 'Rendi', 'Sandi', 'Taufik', 'Umar', 'Vino', 'Wahyu', 'Xavier', 'Yusuf', 'Zaki', 'Arman', 'Bagus', 'Cahyo', 'Dimas', 'Erwin', 'Faiz', 'Guntur', 'Herman', 'Irfan', 'Janu', 'Kamal', 'Lucky', 'Mukti', 'Nugroho'])[((gs - 1) % 40) + 1] || ' ' ||
    (ARRAY['Pratama', 'Santoso', 'Wijaya', 'Saputra', 'Nugraha', 'Kusuma', 'Mahendra', 'Prakoso', 'Ramadhan', 'Setiawan', 'Wicaksana', 'Hidayat', 'Rahman', 'Prabowo', 'Purnama', 'Kurniawan', 'Laksana', 'Hafidz', 'Ariyanto', 'Suryana', 'Wibisana', 'Yudhistira', 'Firmansyah', 'Anugerah', 'Maulana'])[((gs - 1) / 40) % 25 + 1],
    'pegawai' || lpad(gs::text, 4, '0') || '@nilaundry.com',
    '0812' || lpad(gs::text, 8, '0'),
    'Alamat ' || (ARRAY['Jakarta', 'Bandung', 'Surabaya', 'Depok', 'Bogor', 'Bekasi', 'Tangerang', 'Semarang', 'Yogyakarta', 'Malang', 'Medan', 'Palembang', 'Makassar', 'Denpasar', 'Sidoarjo', 'Cimahi', 'Solo', 'Cirebon', 'Karawang', 'Cianjur', 'Purwakarta', 'Pekanbaru', 'Balikpapan', 'Manado', 'Lampung'])[((gs - 1) % 25) + 1],
    ((gs - 1) % 25) + 1
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;


INSERT INTO layanan (id_layanan, nama_layanan, satuan_layanan, deskripsi_layanan)
SELECT
    gs,
    (ARRAY['Cepat', 'Rapi', 'Premium', 'Hemat', 'Ekspres', 'Bersih', 'Aman', 'Presisi', 'Plus', 'Express', 'Natural', 'Sejuk', 'Wangi', 'Mudah', 'Cerah', 'Sakti', 'Prima', 'Mewah', 'Tuntas', 'Mantap', 'Halus', 'Ringan', 'Kilap', 'Segar', 'Ceria', 'Tepat', 'Murni', 'Gres', 'Akurat', 'Simpel', 'Mitra', 'Lancar', 'Santun', 'Cerdas', 'Pasti', 'Nyaman', 'Tangguh', 'Lestari', 'Optimal', 'Maksimal'])[((gs - 1) % 40) + 1] || ' ' ||
    (ARRAY['Kiloan', 'Selimut', 'Sepatu', 'Sprei', 'Jaket', 'Sajadah', 'Boneka', 'Karpet', 'Bedcover', 'Tas', 'Uniform', 'Harian', 'Sport', 'Bayi', 'Kantor', 'Komplit', 'Express', 'Mix', 'Deluxe', 'Eco', 'VIP', 'Family', 'Anak', 'Musim', 'Weekend'])[((gs - 1) / 40) % 25 + 1],
    CASE (gs % 4)
        WHEN 0 THEN 'kg'
        WHEN 1 THEN 'pcs'
        WHEN 2 THEN 'pasang'
        ELSE 'jam'
    END,
    (ARRAY['Perawatan kain dengan hasil bersih dan wangi', 'Paket pencucian yang efisien untuk kebutuhan harian', 'Paket setrika dan finishing yang lebih rapi', 'Pilihan cepat untuk kebutuhan mendesak', 'Perawatan khusus untuk bahan sensitif', 'Pembersihan menyeluruh dengan standar toko', 'Layanan ringan untuk item kecil dan praktis', 'Layanan spesial untuk barang berukuran besar', 'Perawatan premium dengan hasil maksimal', 'Program hemat untuk pelanggan rutin', 'Perawatan ekstra dengan kontrol kualitas', 'Paket nyaman untuk kebutuhan keluarga', 'Layanan cepat dengan proses prioritas', 'Paket terbaik untuk hasil tampilan rapi', 'Perawatan aman untuk pakaian berwarna', 'Layanan lengkap dari cuci hingga finishing', 'Paket ekonomis dengan hasil konsisten', 'Pilihan fleksibel untuk kebutuhan campuran', 'Perawatan lembut untuk barang bernilai', 'Layanan harian dengan durasi singkat', 'Paket khusus untuk pelanggan langganan', 'Perawatan detail untuk hasil lebih bersih', 'Paket praktis dengan proses terukur', 'Layanan musiman untuk kebutuhan tertentu', 'Paket santai untuk penggunaan rutin'])[((gs - 1) % 25) + 1]
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;



INSERT INTO tarif (id_tarif, harga_per_satuan, cabang_laundry_id_cabang, layanan_id_layanan)
SELECT
    gs,
    (5000 + ((gs - 1) % 50) * 500)::numeric(12,2),
    ((gs - 1) % 25) + 1,
    gs
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;


INSERT INTO voucher (
    id_voucher, kode_voucher, tipe_diskon_voucher, nilai_diskon_voucher,
    min_pembelian_voucher, berlaku_hingga_voucher, kuota_voucher, terpakai_voucher
)
SELECT
    gs,
    'VCH' || lpad(gs::text, 4, '0'),
    CASE WHEN gs % 2 = 0 THEN 'persen' ELSE 'nominal' END,
    CASE WHEN gs % 2 = 0 THEN (5 + (gs % 46))::numeric(12,2) ELSE (1000 + ((gs % 18) * 500))::numeric(12,2) END,
    (10000 + ((gs % 30) * 2500))::numeric(12,2),
    NOW() + ((gs % 120) + 1) * INTERVAL '1 day',
    50 + (gs % 951),
    gs % 20
FROM generate_series(1, 2000) gs
ON CONFLICT DO NOTHING;



INSERT INTO voucher_pelanggan (voucher_id_voucher, pelanggan_id_pelanggan)
SELECT
    gs,
    ((gs - 1) % 25) + 1
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;

INSERT INTO notifikasi (id_notifikasi, judul_notifikasi, pesan_notifikasi, tipe_notifikasi)
SELECT
    gs,
    (ARRAY['Pesanan Diproses', 'Pesanan Selesai', 'Voucher Baru', 'Pengiriman Berangkat', 'Pembayaran Diterima', 'Status Diperbarui', 'Pesanan Dijemput', 'Pesanan Siap Diambil', 'Promo Mingguan', 'Layanan Tersedia'])[((gs - 1) % 10) + 1],
    (ARRAY['Status pesanan Anda sudah diperbarui di sistem.', 'Tim kami sedang memproses pesanan Anda dengan hati-hati.', 'Voucher baru sudah tersedia untuk akun Anda.', 'Kurir sedang menuju alamat yang terdaftar.', 'Pembayaran Anda berhasil dicatat oleh sistem.', 'Pesanan Anda siap dipantau pada halaman riwayat.', 'Kami sudah menerima permintaan layanan Anda.', 'Pesanan Anda sudah selesai dan menunggu konfirmasi.', 'Ada promo yang bisa digunakan untuk transaksi berikutnya.', 'Mohon cek detail pesanan pada aplikasi Anda.'])[((gs - 1) / 10) % 10 + 1] || ' #' || gs::text,
    CASE (gs % 4)
        WHEN 0 THEN 'pesanan'
        WHEN 1 THEN 'promo'
        WHEN 2 THEN 'pengiriman'
        ELSE 'pembayaran'
    END
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;

INSERT INTO notifikasi_pelanggan (notifikasi_id_notifikasi, pelanggan_id_pelanggan)
SELECT
    gs,
    ((gs - 1) % 25) + 1
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;

INSERT INTO pesanan (
    id_pesanan,
    jumlah_item_pesanan,
    status_pesanan,
    catatan_pesanan,
    estimasi_selesai_pesanan,
    total_harga_pesanan,
    pelanggan_id_pelanggan,
    voucher_id_voucher,
    pegawai_id_pegawai,
    jenis_ambil,
    jenis_antar
)
SELECT
    gs,
    ((gs - 1) % 5) + 1,
    CASE
        WHEN gs <= 1000 THEN 'completed'
        WHEN gs % 3 = 0 THEN 'processing'
        WHEN gs % 3 = 1 THEN 'pickup'
        ELSE 'delivery'
    END,
    (ARRAY['harap lipat rapi', 'tolong pisahkan pakaian dalam', 'mohon jangan gunakan pewangi berlebihan', 'harap cek noda bagian lengan', 'tolong jaga warna tetap aman', 'mohon proses lebih cepat', 'harap setrika rapi bagian kerah', 'tolong bungkus terpisah', 'mohon prioritaskan barang halus', 'harap teliti bagian kantong', 'tolong perhatikan kancing', 'mohon lipat dengan ukuran kecil', 'harap pakai hanger', 'tolong hindari panas berlebih', 'mohon jangan campur dengan item lain', 'harap jaga tekstur kain', 'tolong beri tanda pada barang khusus', 'mohon pisahkan item basah', 'harap finishing lebih halus', 'tolong cek ulang jumlah item'])[((gs - 1) % 20) + 1] || ' ' ||
    (ARRAY['karena akan dipakai besok', 'untuk acara keluarga', 'supaya tetap nyaman dipakai', 'karena bahan cukup lembut', 'agar hasilnya lebih rapi', 'untuk kebutuhan kerja', 'karena item ini mudah kusut', 'supaya warna tidak pudar', 'karena ada noda kecil', 'agar mudah disimpan', 'untuk penjemputan berikutnya', 'karena termasuk barang favorit', 'supaya tidak tercampur', 'karena akan dibawa bepergian', 'untuk pakaian harian', 'karena perlu perlakuan khusus', 'agar hasil setrikanya rata', 'karena ingin cepat selesai', 'supaya tetap wangi', 'karena butuh finishing maksimal'])[((gs - 1) / 20) % 20 + 1],
    NOW() + ((gs % 30) + 1) * INTERVAL '1 day',
    (20000 + ((gs % 60) * 1500))::numeric(12,2),
    ((gs - 1) % 25) + 1,
    CASE WHEN gs % 4 = 0 THEN NULL ELSE ((gs - 1) % 2000) + 1 END,
    ((gs - 1) % 1000) + 1,
    CASE WHEN gs % 2 = 0 THEN 'pickup' ELSE 'walkin' END,
    CASE WHEN gs <= 1000 THEN 'delivery' ELSE 'walkin' END
FROM generate_series(1, 2000) gs
ON CONFLICT DO NOTHING;


INSERT INTO item_pesanan (
    id_item_pesanan,
    kuantitas_satuan_item_pesanan,
    subtotal_pesanan,
    catatan_item_pesanan,
    pesanan_id_pesanan,
    tarif_id_tarif
)
SELECT
    gs,
    ((gs - 1) % 4) + 1,
    (t.harga_per_satuan * (((gs - 1) % 4) + 1))::numeric(12,2),
    CASE WHEN gs % 3 = 0 THEN NULL ELSE 'Item ' || gs::text || ' diproses dengan teliti' END,
    gs,
    ((gs - 1) % 1000) + 1
FROM generate_series(1, 2000) gs
JOIN tarif t ON t.id_tarif = ((gs - 1) % 1000) + 1
ON CONFLICT DO NOTHING;



INSERT INTO pembayaran (
    id_pembayaran,
    waktu_pembayaran,
    metode_pembayaran,
    status_pembayaran,
    jumlah_pembayaran,
    pesanan_id_pesanan
)
SELECT
    gs,
    NOW() + ((gs - 1) % 48) * INTERVAL '1 hour',
    (ARRAY['transfer_bank', 'ewallet', 'cash', 'qris'])[((gs - 1) % 4) + 1],
    CASE
        WHEN gs <= 1000 THEN 'lunas'
        WHEN gs % 2 = 0 THEN 'pending'
        ELSE 'gagal'
    END,
    p.total_harga_pesanan,
    gs
FROM generate_series(1, 2000) gs
JOIN pesanan p ON p.id_pesanan = gs
ON CONFLICT DO NOTHING;


INSERT INTO tipe_kendaraan (id_kendaraan, jenis_kendaraan)
SELECT
    gs,
    (ARRAY['Motor Bebek', 'Motor Matic', 'Motor Sport', 'Motor Listrik', 'Motor Box', 'Mobil Hatchback', 'Mobil Sedan', 'Mobil SUV', 'Mobil MPV', 'Mobil Van', 'Pickup Ringan', 'Pickup Box', 'Van Kargo', 'Beban Ringan', 'Kendaraan Niaga', 'Skuter Urban', 'Skuter Cargo', 'Mobil Kompak', 'Motor Delivery', 'Mobil Operasional'])[((gs - 1) % 20) + 1] || ' ' || gs::text
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;

INSERT INTO kurir (id_kurir, nama_kurir, no_telp_kurir, no_plat_kurir, tipe_kendaraan_id_kendaraan)
SELECT
    gs,
    (ARRAY['Andi', 'Budi', 'Candra', 'Deni', 'Eko', 'Fajar', 'Gilang', 'Hadi', 'Ilham', 'Joko', 'Kiki', 'Luthfi', 'Miko', 'Nanda', 'Oka', 'Putra', 'Qori', 'Rendi', 'Sandi', 'Taufik', 'Umar', 'Vino', 'Wahyu', 'Xavier', 'Yusuf', 'Zaki', 'Arman', 'Bagus', 'Cahyo', 'Dimas', 'Erwin', 'Faiz', 'Guntur', 'Herman', 'Irfan', 'Janu', 'Kamal', 'Lucky', 'Mukti', 'Nugroho'])[((gs - 1) % 40) + 1] || ' ' ||
    (ARRAY['Pratama', 'Santoso', 'Wijaya', 'Saputra', 'Nugraha', 'Kusuma', 'Mahendra', 'Prakoso', 'Ramadhan', 'Setiawan', 'Wicaksana', 'Hidayat', 'Rahman', 'Prabowo', 'Purnama', 'Kurniawan', 'Laksana', 'Hafidz', 'Ariyanto', 'Suryana', 'Wibisana', 'Yudhistira', 'Firmansyah', 'Anugerah', 'Maulana'])[((gs - 1) / 40) % 25 + 1],
    '0817' || lpad(gs::text, 8, '0'),
    'B ' || lpad((1000 + gs)::text, 4, '0') || ' ' ||
    chr(65 + ((gs - 1) % 26)) || chr(65 + ((gs - 1) / 26) % 26),
    gs
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;

INSERT INTO pengiriman (
    id_pengiriman,
    waktu_pengiriman,
    jenis_pengiriman,
    alamat_pengiriman,
    status_pengiriman,
    ongkir_pengiriman,
    bukti_pengiriman,
    pesanan_id_pesanan,
    kurir_id_kurir
)
SELECT
    gs,
    NOW() + (gs % 24) * INTERVAL '1 hour',
    'delivery',
    'Alamat pengiriman ' || gs::text || ', ' || c.nama_pelanggan,
    CASE WHEN gs % 3 = 0 THEN 'dikirim' WHEN gs % 3 = 1 THEN 'dalam_perjalanan' ELSE 'diterima' END,
    (8000 + ((gs % 15) * 1000))::numeric(12,2),
    'https://example.com/bukti/' || lpad(gs::text, 4, '0') || '.jpg',
    gs,
    gs
FROM generate_series(1, 1000) gs
JOIN pelanggan c ON c.id_pelanggan = ((gs - 1) % 25) + 1
ON CONFLICT DO NOTHING;

INSERT INTO pesanan_notifikasi (pesanan_id_pesanan, notifikasi_id_notifikasi)
SELECT
    gs,
    gs
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;


INSERT INTO ulasan (id_ulasan, rating_ulasan, komentar_ulasan, waktu_ulasan, pesanan_id_pesanan)
SELECT
    gs,
    ((gs - 1) % 5) + 1,
    (ARRAY['harap lipat rapi', 'tolong pisahkan pakaian dalam', 'mohon jangan gunakan pewangi berlebihan', 'harap cek noda bagian lengan', 'tolong jaga warna tetap aman', 'mohon proses lebih cepat', 'harap setrika rapi bagian kerah', 'tolong bungkus terpisah', 'mohon prioritaskan barang halus', 'harap teliti bagian kantong', 'tolong perhatikan kancing', 'mohon lipat dengan ukuran kecil', 'harap pakai hanger', 'tolong hindari panas berlebih', 'mohon jangan campur dengan item lain', 'harap jaga tekstur kain', 'tolong beri tanda pada barang khusus', 'mohon pisahkan item basah', 'harap finishing lebih halus', 'tolong cek ulang jumlah item'])[((gs - 1) % 20) + 1] || ' dan hasilnya memuaskan',
    NOW() + ((gs - 1) % 30) * INTERVAL '1 day',
    gs
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;

COMMIT;


