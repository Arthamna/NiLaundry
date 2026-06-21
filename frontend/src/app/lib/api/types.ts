// API DTOs for the NiLaundry customer backend.
//
// These mirror the PostgreSQL schema in `db.sql`, mapped to clean camelCase.
// Responses from the backend are wrapped in an { success, data, error } envelope
// (see client.ts); the types below describe the *unwrapped* `data` payload.
//
// db.sql column -> DTO field mapping is documented per-interface so the Go
// backend can emit matching JSON (e.g. via struct tags) for smooth parsing.

/** Generic response envelope every backend endpoint returns. */
export interface ApiEnvelope<T> {
    success: boolean;
    data: T | null;
    error: string | null;
}

// --- pelanggan ---------------------------------------------------------------
// db.sql: pelanggan(id_pelanggan, nama_pelanggan, email_pelanggan,
//                   no_telp_pelanggan, alamat_pelanggan)
export interface Pelanggan {
    id: number; // id_pelanggan
    nama: string; // nama_pelanggan
    email: string; // email_pelanggan
    noTelp: string; // no_telp_pelanggan
    alamat: string; // alamat_pelanggan
}

/** Payload accepted by PUT /pelanggan/me. All fields optional (partial update). */
export interface UpdatePelangganInput {
    nama?: string;
    email?: string;
    noTelp?: string;
    alamat?: string;
}

// --- voucher -----------------------------------------------------------------
// db.sql: voucher(id_voucher, kode_voucher, tipe_diskon_voucher,
//                 nilai_diskon_voucher, min_pembelian_voucher,
//                 berlaku_hingga_voucher, kuota_voucher, terpakai_voucher)
export type TipeDiskon = 'persen' | 'nominal' | string;

export interface Voucher {
    id: number; // id_voucher
    kode: string; // kode_voucher
    tipeDiskon: TipeDiskon; // tipe_diskon_voucher
    nilaiDiskon: number; // nilai_diskon_voucher
    minPembelian: number; // min_pembelian_voucher
    berlakuHingga: string; // berlaku_hingga_voucher (ISO timestamp)
    kuota: number; // kuota_voucher
    terpakai: number; // terpakai_voucher
}

/** Result of GET /pelanggan/{id}/voucher/hemat (Function: HitungTotalHematVoucher). */
export interface VoucherHemat {
    totalHemat: number;
}

// --- layanan / tarif ---------------------------------------------------------
// db.sql: layanan(id_layanan, nama_layanan, satuan_layanan, deskripsi_layanan)
export interface Layanan {
    id: number; // id_layanan
    nama: string; // nama_layanan
    satuan: string; // satuan_layanan
    deskripsi: string | null; // deskripsi_layanan
}

// db.sql: tarif(id_tarif, harga_per_satuan, cabang_laundry_id_cabang, layanan_id_layanan)
export interface Tarif {
    id: number; // id_tarif
    hargaPerSatuan: number; // harga_per_satuan
    cabangId: number; // cabang_laundry_id_cabang
    layananId: number; // layanan_id_layanan
}

// --- item pesanan ------------------------------------------------------------
// db.sql: item_pesanan(id_item_pesanan, kuantitas_satuan_item_pesanan,
//                      subtotal_pesanan, catatan_item_pesanan,
//                      pesanan_id_pesanan, tarif_id_tarif)
export interface ItemPesanan {
    id: number; // id_item_pesanan
    kuantitas: number; // kuantitas_satuan_item_pesanan
    subtotal: number; // subtotal_pesanan
    catatan: string | null; // catatan_item_pesanan
    pesananId: number; // pesanan_id_pesanan
    tarifId: number; // tarif_id_tarif
}

/** Line item the client sends when creating a new order. */
export interface ItemPesananInput {
    tarifId: number;
    kuantitas: number;
    catatan?: string;
}

// --- pesanan -----------------------------------------------------------------
// db.sql: pesanan(id_pesanan, jumlah_item_pesanan, status_pesanan,
//                 catatan_pesanan, estimasi_selesai_pesanan,
//                 total_harga_pesanan, pelanggan_id_pelanggan,
//                 voucher_id_voucher, pegawai_id_pegawai)
//
// status_pesanan known values per CUSTOMER_ENDPOINT.md: 'active', 'selesai',
// plus payment-flow values 'unpaid' / 'paid'. Kept open as string.
export type StatusPesanan = 'active' | 'selesai' | 'unpaid' | 'paid' | string;

export interface Pesanan {
    id: number; // id_pesanan
    jumlahItem: number; // jumlah_item_pesanan
    status: StatusPesanan; // status_pesanan
    catatan: string; // catatan_pesanan
    estimasiSelesai: string; // estimasi_selesai_pesanan (ISO timestamp)
    totalHarga: number; // total_harga_pesanan
    pelangganId: number; // pelanggan_id_pelanggan
    voucherId: number | null; // voucher_id_voucher (nullable)
    pegawaiId: number; // pegawai_id_pegawai
}

/** Order detail = pesanan + its line items + optional review (ulasan). */
export interface PesananDetail extends Pesanan {
    items: ItemPesanan[];
    ulasan: Ulasan | null;
}

/** Payload for POST /pelanggan/{id}/pesanan. Starts voucher=null, payment=pending. */
export interface CreatePesananInput {
    items: ItemPesananInput[];
    catatan?: string;
}

/** Result of GET /pelanggan/{id}/pesanan/subtotal (Function: HitungSubtotalPesanan). */
export interface SubtotalPesanan {
    subtotal: number;
}

// --- ulasan ------------------------------------------------------------------
// db.sql: ulasan(id_ulasan, rating_ulasan, komentar_ulasan, pesanan_id_pesanan)
export interface Ulasan {
    id: number; // id_ulasan
    rating: number; // rating_ulasan (1..5)
    komentar: string; // komentar_ulasan
    pesananId: number; // pesanan_id_pesanan
}

/** Payload for POST /pelanggan/{id}/ulasan/{pesanan_id} (Trigger: Validasi Insert Ulasan). */
export interface CreateUlasanInput {
    rating: number;
    komentar: string;
}

// --- notifikasi --------------------------------------------------------------
// db.sql: notifikasi(id_notifikasi, judul_notifikasi, pesan_notifikasi, tipe_notifikasi)
export interface Notifikasi {
    id: number; // id_notifikasi
    judul: string; // judul_notifikasi
    pesan: string; // pesan_notifikasi
    tipe: string; // tipe_notifikasi
}

// --- pembayaran --------------------------------------------------------------
// db.sql: pembayaran(id_pembayaran, waktu_pembayaran, metode_pembayaran,
//                    status_pembayaran, jumlah_pembayaran, pesanan_id_pesanan)
export type StatusPembayaran = 'pending' | 'paid' | string;

export interface Pembayaran {
    id: number; // id_pembayaran
    waktu: string; // waktu_pembayaran (ISO timestamp)
    metode: string; // metode_pembayaran
    status: StatusPembayaran; // status_pembayaran
    jumlah: number; // jumlah_pembayaran
    pesananId: number; // pesanan_id_pesanan
}

/** Payload for POST /pelanggan/{id}/pembayaran/konfirmasi. */
export interface KonfirmasiPembayaranInput {
    pesananId: number;
    metode: string;
    voucherId?: number | null; // optionally apply a voucher at confirmation
}

// --- auth --------------------------------------------------------------------
export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    nama: string;
    email: string;
    noTelp: string;
    alamat: string;
    password: string;
}

/** Subject types embedded in the unified login response. */
export type SubjectType = 'pelanggan' | 'pengguna';

/** Role values returned by /auth/login. */
export type Role = 'customer' | 'admin' | 'superadmin';

/**
 * Backoffice user (admin / superadmin). Returned by /auth/login when the
 * email was found in the `pengguna` table.
 * - role = 'admin'      -> cabangId is the branch this admin manages
 * - role = 'superadmin' -> cabangId is null (manages all branches)
 */
export interface Pengguna {
    id: number;
    nama: string;
    email: string;
    role: 'admin' | 'superadmin';
    cabangId: number | null;
}

/** Response from POST /auth/register — pelanggan-only, since only customers can self-register. */
export interface RegisterResponse {
    token: string;
    pelanggan: Pelanggan;
}

/**
 * Response from POST /auth/login. The backend searches both `pelanggan` and
 * `pengguna` tables; `subjectType` tells the frontend which one matched so
 * the UI can route to the right dashboard.
 */
export interface UnifiedAuthResponse {
    token: string;
    subjectType: SubjectType;
    role: Role;
    pelanggan: Pelanggan | null;
    pengguna: Pengguna | null;
}

// =============================================================================
// ADMIN (ADMIN_ENDPOINT.md) — branch-scoped staff console (the /branch pages).
//
// Admins authenticate through the unified /auth/login as a `pengguna` with
// role 'admin'; their id_cabang comes from Pengguna.cabangId. The DTOs below
// describe the *data* payloads that GET/PUT /branch/{id_cabang}/... return.
// =============================================================================

// --- Dashboard: GET /branch/{id_cabang}/order/statistik/data ------------------
/** Today's Order (count) + Today's Revenue (SUM total_harga_pesanan paid today). */
export interface OrderStatistik {
    todaysOrder: number;
    todaysRevenue: number;
}

// --- Orders: list + per-status grouping --------------------------------------
/** A summary of one customer attached to an order row. */
export interface PelangganRingkas {
    id: number; // id_pelanggan
    nama: string; // nama_pelanggan
    noTelp: string; // no_telp_pelanggan
}

/**
 * Order row for the admin order list (GET /branch/{id_cabang}/order/list).
 * Mirrors `pesanan` joined with its `pelanggan`.
 */
export interface AdminOrder {
    id: number; // id_pesanan
    status: StatusPesanan; // status_pesanan
    jumlahItem: number; // jumlah_item_pesanan
    estimasiSelesai: string; // estimasi_selesai_pesanan (ISO timestamp)
    totalHarga: number; // total_harga_pesanan
    catatan: string; // catatan_pesanan
    voucherId: number | null; // voucher_id_voucher
    pegawaiId: number; // pegawai_id_pegawai
    pelanggan: PelangganRingkas;
}

/** One status bucket for GET /branch/{id_cabang}/order/statistik/status. */
export interface OrderStatusCount {
    status: StatusPesanan; // status_pesanan
    count: number; // COUNT(*) GROUP BY status_pesanan
}

/** Per-status counts plus the branch-wide total order count. */
export interface OrderStatusStatistik {
    total: number;
    counts: OrderStatusCount[];
}

// --- Order detail: GET/PUT /branch/{id_cabang}/order/{id_pesanan}/detail -------
/** One line item in an order detail, joined with its layanan/tarif. */
export interface AdminOrderItem {
    id: number; // id_item_pesanan
    layananNama: string; // layanan.nama_layanan
    satuan: string; // layanan.satuan_layanan
    kuantitas: number; // kuantitas_satuan_item_pesanan
    subtotal: number; // subtotal_pesanan
    catatan: string | null; // catatan_item_pesanan
    tarifId: number; // tarif_id_tarif
}

/** Full order detail = the order row + its line items (+ payment when present). */
export interface AdminOrderDetail extends AdminOrder {
    items: AdminOrderItem[];
    pembayaran: Pembayaran | null;
}

/**
 * Payload for PUT /branch/{id_cabang}/order/{id_pesanan}/detail.
 * status values follow the transition table in ADMIN_ENDPOINT.md
 * (paid | pickup | processing | completed | delivery). employeeId/pin carry the
 * "Employee Verification" the status-update drawer collects to confirm the change.
 */
export interface UpdateOrderDetailInput {
    status?: StatusPesanan;
    estimasiSelesai?: string; // ISO timestamp
    employeeId?: string; // pegawai id or name entered for verification
    pin?: string; // staff PIN / password
}

/** Query params for the paginated/sortable/filterable order list (go-pagination). */
export interface ListOrdersParams {
    page?: number;
    limit?: number;
    sort?: string; // e.g. 'estimasi_selesai_pesanan desc'
    search?: string;
    status?: StatusPesanan;
}

// --- Report: payment statistics ----------------------------------------------
/**
 * A paid payment row for GET /branch/{id_cabang}/order/statistik/payment
 * (only status_pembayaran = paid). Used for the Report ledger.
 */
export interface AdminPayment {
    id: number; // id_pembayaran (shown as Invoice ID)
    pesananId: number; // pesanan_id_pesanan
    pelangganNama: string; // pelanggan.nama_pelanggan
    pelangganNoTelp: string; // pelanggan.no_telp_pelanggan
    waktu: string; // waktu_pembayaran (ISO timestamp)
    metode: string; // metode_pembayaran
    jumlah: number; // jumlah_pembayaran
}

/** Per-method count: GET /branch/{id_cabang}/order/statistik/payment/method. */
export interface PaymentMethodStat {
    metode: string; // metode_pembayaran
    count: number; // COUNT(*) of paid payments with this method
}

/** Per-method count + summed amount: .../payment/method/total. */
export interface PaymentMethodTotal {
    metode: string; // metode_pembayaran
    count: number;
    total: number; // SUM(jumlah_pembayaran)
}
