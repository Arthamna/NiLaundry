-- NiLaundry seed (customized to your schema and requested counts).
-- Passwords are stored as real bcrypt hashes (cost 10).
-- Superadmin plaintext: SuperAdmin@2026!
-- Admin plaintext: Admin@2026!
-- Pelanggan plaintexts: Pelanggan@2026!01 .. Pelanggan@2026!25

BEGIN;

-- ============================================================================
-- role
-- ============================================================================
INSERT INTO role (id_role, nama_role) VALUES
    (1, 'superadmin'),
    (2, 'admin')
ON CONFLICT DO NOTHING;

SELECT setval(pg_get_serial_sequence('role', 'id_role'), COALESCE((SELECT MAX(id_role) FROM role), 1), true);

-- ============================================================================
-- cabang_laundry (25 rows)
-- ============================================================================
INSERT INTO cabang_laundry (id_cabang, nama_cabang, alamat_cabang, no_telp_cabang, jam_buka_cabang, jam_tutup_cabang) VALUES
    (1, 'NiLaundry Aster', 'Jl. Aster Raya No. 10, Jakarta', '0213000000', '08:00', '22:00'),
    (2, 'NiLaundry Aurora', 'Jl. Aurora Raya No. 11, Bandung', '0213000001', '07:30', '21:00'),
    (3, 'NiLaundry Binar', 'Jl. Binar Raya No. 12, Surabaya', '0213000002', '08:00', '21:00'),
    (4, 'NiLaundry Cakra', 'Jl. Cakra Raya No. 13, Depok', '0213000003', '07:30', '22:00'),
    (5, 'NiLaundry Delima', 'Jl. Delima Raya No. 14, Bogor', '0213000004', '08:00', '21:00'),
    (6, 'NiLaundry Embun', 'Jl. Embun Raya No. 15, Bekasi', '0213000005', '07:30', '21:00'),
    (7, 'NiLaundry Fajar', 'Jl. Fajar Raya No. 16, Tangerang', '0213000006', '08:00', '22:00'),
    (8, 'NiLaundry Gading', 'Jl. Gading Raya No. 17, Semarang', '0213000007', '07:30', '21:00'),
    (9, 'NiLaundry Harsa', 'Jl. Harsa Raya No. 18, Yogyakarta', '0213000008', '08:00', '21:00'),
    (10, 'NiLaundry Ilalang', 'Jl. Ilalang Raya No. 19, Malang', '0213000009', '07:30', '22:00'),
    (11, 'NiLaundry Jati', 'Jl. Jati Raya No. 20, Medan', '0213000010', '08:00', '21:00'),
    (12, 'NiLaundry Kencana', 'Jl. Kencana Raya No. 21, Palembang', '0213000011', '07:30', '21:00'),
    (13, 'NiLaundry Laksana', 'Jl. Laksana Raya No. 22, Makassar', '0213000012', '08:00', '22:00'),
    (14, 'NiLaundry Mawar', 'Jl. Mawar Raya No. 23, Denpasar', '0213000013', '07:30', '21:00'),
    (15, 'NiLaundry Nirmala', 'Jl. Nirmala Raya No. 24, Sidoarjo', '0213000014', '08:00', '21:00'),
    (16, 'NiLaundry Oase', 'Jl. Oase Raya No. 25, Cimahi', '0213000015', '07:30', '22:00'),
    (17, 'NiLaundry Puspa', 'Jl. Puspa Raya No. 26, Solo', '0213000016', '08:00', '21:00'),
    (18, 'NiLaundry Rimba', 'Jl. Rimba Raya No. 27, Cirebon', '0213000017', '07:30', '21:00'),
    (19, 'NiLaundry Senja', 'Jl. Senja Raya No. 28, Karawang', '0213000018', '08:00', '22:00'),
    (20, 'NiLaundry Tembaga', 'Jl. Tembaga Raya No. 29, Cianjur', '0213000019', '07:30', '21:00'),
    (21, 'NiLaundry Utama', 'Jl. Utama Raya No. 30, Purwakarta', '0213000020', '08:00', '21:00'),
    (22, 'NiLaundry Violet', 'Jl. Violet Raya No. 31, Pekanbaru', '0213000021', '07:30', '22:00'),
    (23, 'NiLaundry Wana', 'Jl. Wana Raya No. 32, Balikpapan', '0213000022', '08:00', '21:00'),
    (24, 'NiLaundry Xenia', 'Jl. Xenia Raya No. 33, Manado', '0213000023', '07:30', '21:00'),
    (25, 'NiLaundry Yudhistira', 'Jl. Yudhistira Raya No. 34, Lampung', '0213000024', '08:00', '22:00')
ON CONFLICT DO NOTHING;

SELECT setval(pg_get_serial_sequence('cabang_laundry', 'id_cabang'), COALESCE((SELECT MAX(id_cabang) FROM cabang_laundry), 1), true);

-- ============================================================================
-- pengguna (25 rows total: 1 superadmin + 24 admin)
-- ============================================================================
INSERT INTO pengguna (id_pengguna, nama_pengguna, email_pengguna, password_pengguna, role_id_role, cabang_laundry_id_cabang) VALUES
    (1, 'Tama Mahendra', 'tama.mahendra@nilaundry.com', '$2y$10$Ow0o848vaFSa060.TWy0BeQSLQ6TbfVmYp99nfNrzL2lqa9liCu2.', 1, NULL),
    (2, 'Zahra Kirana', 'zahra.kirana@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 1),
    (3, 'Nadia Salsabila', 'nadia.salsabila@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 2),
    (4, 'Raka Pratama', 'raka.pratama@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 3),
    (5, 'Dinda Permata', 'dinda.permata@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 4),
    (6, 'Fikri Ramadhan', 'fikri.ramadhan@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 5),
    (7, 'Maya Aurelia', 'maya.aurelia@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 6),
    (8, 'Bima Saputra', 'bima.saputra@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 7),
    (9, 'Putri Nandini', 'putri.nandini@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 8),
    (10, 'Rizky Aldiansyah', 'rizky.aldiansyah@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 9),
    (11, 'Salsa Kirana', 'salsa.kirana@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 10),
    (12, 'Yoga Pradana', 'yoga.pradana@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 11),
    (13, 'Citra Amalia', 'citra.amalia@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 12),
    (14, 'Farhan Nugraha', 'farhan.nugraha@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 13),
    (15, 'Alya Nirmala', 'alya.nirmala@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 14),
    (16, 'Dewangga Kusuma', 'dewangga.kusuma@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 15),
    (17, 'Nabila Rahma', 'nabila.rahma@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 16),
    (18, 'Daffa Wicaksana', 'daffa.wicaksana@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 17),
    (19, 'Sinta Wulandari', 'sinta.wulandari@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 18),
    (20, 'Reza Hidayat', 'reza.hidayat@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 19),
    (21, 'Kinanti Laras', 'kinanti.laras@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 20),
    (22, 'Adit Setiawan', 'adit.setiawan@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 21),
    (23, 'Salma Fadhila', 'salma.fadhila@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 22),
    (24, 'Bayu Wijaya', 'bayu.wijaya@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 23),
    (25, 'Kezia Mutiara', 'kezia.mutiara@nilaundry.com', '$2y$10$Z4ED4GOwbwxzqku4fFwB3epPP8lbUhF7pkmpQo2dJEVjNj8IePJ/m', 2, 24)
ON CONFLICT DO NOTHING;

SELECT setval(pg_get_serial_sequence('pengguna', 'id_pengguna'), COALESCE((SELECT MAX(id_pengguna) FROM pengguna), 1), true);

-- ============================================================================
-- pelanggan (25 rows)
-- ============================================================================
INSERT INTO pelanggan (id_pelanggan, nama_pelanggan, password_pelanggan, email_pelanggan, no_telp_pelanggan, alamat_pelanggan) VALUES
    (1, 'Rani Amelinda', '$2y$10$mVRp04wrCIXDeFA5xRX80eZY0c9OEh9EBAfmTq.yLAFUPFAF0.BGy', 'rani.amelinda@mail.com', '081370000000', 'Jl. Melati No. 5, Jakarta'),
    (2, 'Damar Hafiz', '$2y$10$uJcWMGBgQgMpkPp.sCIZCuj6Hg2lO4GE3Nhxm1W/VewF0Wi7kdx1O', 'damar.hafiz@mail.com', '081370000001', 'Jl. Melati No. 6, Surabaya'),
    (3, 'Tasya Melati', '$2y$10$L81c9CVv9moFGRby1D.gveWVDw3wfd8gkFtqNtRkJVS8l/nHspwXi', 'tasya.melati@mail.com', '081370000002', 'Jl. Melati No. 7, Bogor'),
    (4, 'Fauzan Akbar', '$2y$10$f.SfRDmAehJ540nyLzew3e/q/h5q5WFPF8gAWivdSegzhMMqhErzW', 'fauzan.akbar@mail.com', '081370000003', 'Jl. Melati No. 8, Tangerang'),
    (5, 'Niken Prameswari', '$2y$10$NIP/ohzfbZPH8B0PSUttAOcs5oGpXBV3m5IffiBP5Dhzz5eUR5tkO', 'niken.prameswari@mail.com', '081370000004', 'Jl. Melati No. 9, Yogyakarta'),
    (6, 'Rangga Aditya', '$2y$10$oHn4wst/478vZqo/qI14Fe1/8R2GURTg2Nal2MYcHnRzpkrT4hC/O', 'rangga.aditya@mail.com', '081370000005', 'Jl. Melati No. 10, Medan'),
    (7, 'Vina Safitri', '$2y$10$1cxrJ70nQpE2ekTAd1lSWuDK3vvPNAP4Aa0SDL0c9dN0nfm.Gx4em', 'vina.safitri@mail.com', '081370000006', 'Jl. Melati No. 11, Makassar'),
    (8, 'Galang Saptono', '$2y$10$y4KzZYJc80mkkHlpOq5qtun56N57/rwUTYYnL6XY.UivSdGEISxaS', 'galang.saptono@mail.com', '081370000007', 'Jl. Melati No. 12, Sidoarjo'),
    (9, 'Ayu Septiani', '$2y$10$vjB6Urr/Ix3rYxAAWy1JMe2KStCDqaIB2tMnxDUUeo7duJQ54G17i', 'ayu.septiani@mail.com', '081370000008', 'Jl. Melati No. 13, Solo'),
    (10, 'Bagas Kurnia', '$2y$10$RN1fqI4CikGj28RdYltfC.agzBXhK1CnOdOm3TgHsEe5Pxm3uh6PO', 'bagas.kurnia@mail.com', '081370000009', 'Jl. Melati No. 14, Karawang'),
    (11, 'Intan Lestari', '$2y$10$rbmINN3TiOCRYtNvATBKBOsxltW3Y0vlhHlh02ef3VyNZRzbTvovG', 'intan.lestari@mail.com', '081370000010', 'Jl. Melati No. 15, Purwakarta'),
    (12, 'Rafi Maulana', '$2y$10$l.aB0fjnoIsLy6GS2V1l/OqIz7Y4KQUvUicLRg6jLJ6YJjAlKU2PK', 'rafi.maulana@mail.com', '081370000011', 'Jl. Melati No. 16, Balikpapan'),
    (13, 'Caca Nadira', '$2y$10$Jt6kmp3BdrscABeMJSQ7geyx7TuR22MeLdR9vLoN82yD.ZAcL4FeC', 'caca.nadira@mail.com', '081370000012', 'Jl. Melati No. 17, Lampung'),
    (14, 'Rizal Fauzi', '$2y$10$RHHsB.SrWbZ9CNcI///OXuANPqekf5S.g2jHxbJEL5/m.DeSNux..', 'rizal.fauzi@mail.com', '081370000013', 'Jl. Melati No. 18, Bandung'),
    (15, 'Nabila Sukma', '$2y$10$c4EYnm6TlXHEWiVGy7/ytOrxr/6aq6sxx27OcuZOL.q6wqpTXRvt.', 'nabila.sukma@mail.com', '081370000014', 'Jl. Melati No. 19, Depok'),
    (16, 'Hana Putri', '$2y$10$ze23CvomfTVhXm4P1infqOyNT8n4NRt.7aLDYIyw9e2/ckCitYnYe', 'hana.putri@mail.com', '081370000015', 'Jl. Melati No. 20, Bekasi'),
    (17, 'Tegar Nugroho', '$2y$10$yXuLOKAmyt3Iu/oH.CfS/OcYGNHBjNZ36YYCDq0SyH7BMQS1wPBTu', 'tegar.nugroho@mail.com', '081370000016', 'Jl. Melati No. 21, Semarang'),
    (18, 'Laras Dwiyanti', '$2y$10$hqPBHaxw.XJa39qEZYgyO.Yyid8ra8YXG.Hi9r03ZP2Up.hWmQanS', 'laras.dwiyanti@mail.com', '081370000017', 'Jl. Melati No. 22, Malang'),
    (19, 'Naufal Hakim', '$2y$10$Qty/BVcDGNFwg2d9Nk/4MeAKnrKvYMQEZarFQzIM7c0a24DPLA8iG', 'naufal.hakim@mail.com', '081370000018', 'Jl. Melati No. 23, Palembang'),
    (20, 'Mira Cendana', '$2y$10$M.DVDiqslybaDRelzz5Ujeb2/khfbOxCrxaiAhvu05aksA.fl/RTK', 'mira.cendana@mail.com', '081370000019', 'Jl. Melati No. 24, Denpasar'),
    (21, 'Gibran Faris', '$2y$10$lNDWql2zPAuOXymFfviuae8rzvN8/iyCiIU2jlAJGRk0MzofSQwsi', 'gibran.faris@mail.com', '081370000020', 'Jl. Melati No. 25, Cimahi'),
    (22, 'Oliv Ananda', '$2y$10$oKYKtR5zVRdEi8SIpyz1wOG9kTkpYW4rtg0BlU/sX9yGbt4yhFKe2', 'oliv.ananda@mail.com', '081370000021', 'Jl. Melati No. 26, Cirebon'),
    (23, 'Aldi Prakoso', '$2y$10$4C6Co62.a4aDX6Pftf4P/uMOSyHoi09x4ao8YlsvUCypvFjxarNK2', 'aldi.prakoso@mail.com', '081370000022', 'Jl. Melati No. 27, Cianjur'),
    (24, 'Dhea Ayuningtyas', '$2y$10$C1OyfG1L1wxG9M/cL23kB.sSqFTX1zwXABr9vcl50y.07jgJ4mh46', 'dhea.ayuningtyas@mail.com', '081370000023', 'Jl. Melati No. 28, Pekanbaru'),
    (25, 'Satria Wicaksono', '$2y$10$SL7ChYsu2isThYgM2FiLV.F2trUmDt7.yieuQBA.rMS2aVZ91lMvC', 'satria.wicaksono@mail.com', '081370000024', 'Jl. Melati No. 29, Manado')
ON CONFLICT DO NOTHING;

SELECT setval(pg_get_serial_sequence('pelanggan', 'id_pelanggan'), COALESCE((SELECT MAX(id_pelanggan) FROM pelanggan), 1), true);

-- ============================================================================
-- pegawai (1000 rows)
-- ============================================================================
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

SELECT setval(pg_get_serial_sequence('pegawai', 'id_pegawai'), COALESCE((SELECT MAX(id_pegawai) FROM pegawai), 1), true);

-- ============================================================================
-- layanan (1000 rows)
-- ============================================================================
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

SELECT setval(pg_get_serial_sequence('layanan', 'id_layanan'), COALESCE((SELECT MAX(id_layanan) FROM layanan), 1), true);

-- ============================================================================
-- tarif (1000 rows)
-- ============================================================================
INSERT INTO tarif (id_tarif, harga_per_satuan, cabang_laundry_id_cabang, layanan_id_layanan)
SELECT
    gs,
    (5000 + ((gs - 1) % 50) * 500)::numeric(12,2),
    ((gs - 1) % 25) + 1,
    gs
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;

SELECT setval(pg_get_serial_sequence('tarif', 'id_tarif'), COALESCE((SELECT MAX(id_tarif) FROM tarif), 1), true);

-- ============================================================================
-- voucher (2000 rows)
-- ============================================================================
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

SELECT setval(pg_get_serial_sequence('voucher', 'id_voucher'), COALESCE((SELECT MAX(id_voucher) FROM voucher), 1), true);

-- ============================================================================
-- voucher_pelanggan (1000 rows)
-- ============================================================================
INSERT INTO voucher_pelanggan (voucher_id_voucher, pelanggan_id_pelanggan)
SELECT
    gs,
    ((gs - 1) % 25) + 1
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;

-- ============================================================================
-- notifikasi (1000 rows)
-- ============================================================================
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

SELECT setval(pg_get_serial_sequence('notifikasi', 'id_notifikasi'), COALESCE((SELECT MAX(id_notifikasi) FROM notifikasi), 1), true);

-- ============================================================================
-- notifikasi_pelanggan (1000 rows)
-- ============================================================================
INSERT INTO notifikasi_pelanggan (notifikasi_id_notifikasi, pelanggan_id_pelanggan)
SELECT
    gs,
    ((gs - 1) % 25) + 1
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;

-- ============================================================================
-- pesanan (2000 rows)
-- ============================================================================
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

SELECT setval(pg_get_serial_sequence('pesanan', 'id_pesanan'), COALESCE((SELECT MAX(id_pesanan) FROM pesanan), 1), true);

-- ============================================================================
-- item_pesanan (2000 rows)
-- ============================================================================
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

SELECT setval(pg_get_serial_sequence('item_pesanan', 'id_item_pesanan'), COALESCE((SELECT MAX(id_item_pesanan) FROM item_pesanan), 1), true);

-- ============================================================================
-- pembayaran (2000 rows)
-- ============================================================================
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

SELECT setval(pg_get_serial_sequence('pembayaran', 'id_pembayaran'), COALESCE((SELECT MAX(id_pembayaran) FROM pembayaran), 1), true);

-- ============================================================================
-- tipe_kendaraan (1000 rows)
-- ============================================================================
INSERT INTO tipe_kendaraan (id_kendaraan, jenis_kendaraan)
SELECT
    gs,
    (ARRAY['Motor Bebek', 'Motor Matic', 'Motor Sport', 'Motor Listrik', 'Motor Box', 'Mobil Hatchback', 'Mobil Sedan', 'Mobil SUV', 'Mobil MPV', 'Mobil Van', 'Pickup Ringan', 'Pickup Box', 'Van Kargo', 'Beban Ringan', 'Kendaraan Niaga', 'Skuter Urban', 'Skuter Cargo', 'Mobil Kompak', 'Motor Delivery', 'Mobil Operasional'])[((gs - 1) % 20) + 1] || ' ' || gs::text
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;

-- ============================================================================
-- kurir (1000 rows)
-- ============================================================================
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

-- ============================================================================
-- pengiriman (1000 rows)
-- ============================================================================
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

-- ============================================================================
-- pesanan_notifikasi (1000 rows)
-- ============================================================================
INSERT INTO pesanan_notifikasi (pesanan_id_pesanan, notifikasi_id_notifikasi)
SELECT
    gs,
    gs
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;

-- ============================================================================
-- ulasan (1000 rows)
-- ============================================================================
INSERT INTO ulasan (id_ulasan, rating_ulasan, komentar_ulasan, waktu_ulasan, pesanan_id_pesanan)
SELECT
    gs,
    ((gs - 1) % 5) + 1,
    (ARRAY['harap lipat rapi', 'tolong pisahkan pakaian dalam', 'mohon jangan gunakan pewangi berlebihan', 'harap cek noda bagian lengan', 'tolong jaga warna tetap aman', 'mohon proses lebih cepat', 'harap setrika rapi bagian kerah', 'tolong bungkus terpisah', 'mohon prioritaskan barang halus', 'harap teliti bagian kantong', 'tolong perhatikan kancing', 'mohon lipat dengan ukuran kecil', 'harap pakai hanger', 'tolong hindari panas berlebih', 'mohon jangan campur dengan item lain', 'harap jaga tekstur kain', 'tolong beri tanda pada barang khusus', 'mohon pisahkan item basah', 'harap finishing lebih halus', 'tolong cek ulang jumlah item'])[((gs - 1) % 20) + 1] || ' dan hasilnya memuaskan',
    NOW() + ((gs - 1) % 30) * INTERVAL '1 day',
    gs
FROM generate_series(1, 1000) gs
ON CONFLICT DO NOTHING;

SELECT setval(pg_get_serial_sequence('ulasan', 'id_ulasan'), COALESCE((SELECT MAX(id_ulasan) FROM ulasan), 1), true);

COMMIT;