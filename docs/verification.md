# Verifikasi perubahan

Tanggal: 12 Oktober 2026.

- `npm run check`: lolos.
- `npm test`: 7 tes validasi KRS lolos (keranjang kosong, duplikasi, bentrok, jadwal bersebelahan, hari berbeda, dan batas SKS).
- `npm run build`: lolos; hasil di `dist/`.
- Chrome headless: 35 rute dibuka tanpa error JavaScript; tidak ada luapan lebar halaman pada viewport 390 px.
- Pencarian dan riwayat navigasi browser diperiksa.
- Keranjang KRS, tiket baru, dan balasan tiket tetap tersedia setelah reload.
- Unduhan jadwal ujian menghasilkan CSV.
- Drawer navigasi mobile membuka dan menutup setelah pemilihan halaman.
- Penyimpanan favorit dengan JSON rusak tidak menyebabkan halaman gagal dirender.
- Screenshot desktop 1440 px dan mobile 390 px diperiksa secara visual.

Uji memakai data contoh dan browser lokal. Layanan universitas, transaksi, autentikasi, pengiriman berkas, dan validasi dokumen resmi tidak termasuk karena backend belum tersedia.

## Pembaruan halaman masuk dan navigasi

- Desain halaman masuk mengikuti referensi: latar navy, informasi kampus dengan carousel, dan form dengan aksen oranye.
- TypeScript dan build produksi lolos; total 12 tes unit lolos.
- Chrome desktop dan mobile: login valid/tidak valid, domain email yang salah, persyaratan password, toggle password, sesi setelah reload, dan logout diperiksa.
- Sidebar dimulai tertutup. Klik seluruh baris kategori membuka/menutup anaknya; beralih kategori utama mereset submenu sebelumnya. Memilih halaman anak mempertahankan kategori aktif.
- Carousel, indikator slide, navigasi keyboard melalui tombol native, dan drawer mobile diperiksa.
- Tidak ada error runtime pada alur yang diuji.
- Login hanya memvalidasi format di frontend; tidak memverifikasi akun kampus. Password tidak disimpan.

## Pembaruan konsistensi desain dan sidebar

Tanggal: 12 Oktober 2026.

- Kategori dan sub-kategori sidebar sekarang membuka halaman direktori (kartu seluruh halaman anak) dan berwarna saat aktif; halaman anak yang dibuka lewat tautan langsung, pencarian, atau tombol kembali otomatis membuka dan menandai jalurnya di sidebar.
- Seluruh halaman memakai pola yang sama (judul halaman, panel, chip, tombol, tabel) dan seluruh teks tampilan berbahasa Indonesia.
- Perbaikan: pencarian tersedia di ponsel dan Enter membuka hasil teratas; hash URL rusak tidak lagi membuat halaman gagal dimuat; ID tiket tidak lagi gagal pada koneksi HTTP non-aman; waktu tiket memakai zona WIB; nilai huruf tidak lagi dibuat otomatis untuk mata kuliah tanpa nilai; status lulus per kategori SKKM dihitung dari poin; nilai tagihan semester 3 dikoreksi; formulir internship memakai FormData; area unggah dokumen dapat dioperasikan dengan keyboard dan batas ukuran konsisten (5 MB); alamat, telepon, dan email dapat dihapus, dan telepon/email dapat ditandai sebagai utama.
- Seluruh sisa berkas bawaan pembuat templat (header lisensi, metadata.json, .env.example, brief logo) dihapus.
- `npm run check`, `npm test` (13 tes), dan `npm run build` lolos. Chrome headless: 36 rute dibuka pada 1440 px dan 390 px tanpa error konsol dan tanpa luapan lebar halaman; alur sidebar desktop dan drawer mobile, pencarian, favorit, keranjang KRS, tukar/batal kelas, SKKM, tiket bantuan, serta validasi formulir diperiksa.

## Pembaruan bahasa dan mode gelap

- Seluruh teks antarmuka, data contoh, pesan validasi, nama berkas CSV, dan format tanggal tersedia dalam bahasa Indonesia dan English (`src/lib/preferences.tsx`). Data yang diketik pengguna tetap disimpan apa adanya.
- Mode gelap memakai token warna CSS yang sama untuk portal dan halaman masuk; tema diterapkan sebelum halaman tampil sehingga tidak berkedip.
- `npm run check`, `npm test` (14 tes), dan `npm run build` lolos. Chrome headless: 35 rute dalam English + mode gelap pada 1440 px dan 390 px tanpa error konsol, tanpa luapan lebar, dan tanpa sisa teks Indonesia; pergantian bahasa/tema lewat tombol, pesan error login yang ikut berganti bahasa, serta regresi alur sidebar, KRS, SKKM, tiket, dan formulir diperiksa.
