# Logistik Gen-Z

Aplikasi web satu halaman untuk **kas logistik** dan **seragam** madrasah: pencatatan kas, LPJ triwulan (tanggal Hijriyah), rekap, stok dan penjualan seragam, ekspor Excel, serta cadangan data. Berjalan di browser, bisa dipasang sebagai aplikasi, dan bisa dipakai offline.

## Fitur
- Catat kas masuk dan keluar, riwayat, dan pengingat (nota, cadangan, LPJ)
- LPJ triwulan dan tahun Hijriyah, dengan arsip, grafik tren bulanan, dan ekspor Excel
- Data seragam: siswa (impor CSV atau tempel), jenis dan ukuran yang bisa ditambah atau dihapus sendiri, stok per ukuran, harga, penjualan, indent
- Impor kas dari Excel (.xlsx atau .csv), lengkap dengan template
- Cadangan dan pemulihan `.json` (kas, seragam, atau gabungan), plus **Gabungkan** cadangan dari beberapa perangkat tanpa menimpa
- PIN pengunci tampilan, tema gelap dan terang, intro bersuara
- PWA: dapat dipasang dan jalan offline

## Struktur
```
index.html          aplikasi utama (semua kode di satu file)
manifest.json       pengaturan aplikasi terpasang
service-worker.js   cache untuk mode offline
icons/              ikon 192, 512, dan maskable
.nojekyll           agar GitHub Pages menyajikan file apa adanya
```

## Cara publikasi di GitHub Pages
1. Buat repositori baru di GitHub (misalnya `logistik-genz`).
2. Unggah semua isi folder ini ke cabang `main` (jangan folder pembungkusnya).
3. Buka **Settings → Pages**, pilih **Deploy from a branch**, cabang `main`, folder `/ (root)`, lalu **Save**.
4. Tunggu 1 sampai 2 menit. Alamatnya: `https://NAMA-PENGGUNA.github.io/NAMA-REPO/`.
5. Buka alamat itu di HP lalu pasang lewat menu browser (Chrome: **Instal aplikasi**, iPhone: **Bagikan → Tambah ke Layar Utama**).

Setelah mengubah `index.html`, naikkan angka `VERSI` di `service-worker.js` supaya perangkat mengambil versi baru.

## Data dan privasi
- Semua data disimpan di **localStorage browser** pada perangkat yang dipakai. Tidak ada server dan tidak ada data yang dikirim ke mana pun.
- Data tidak ikut berpindah antar perangkat. Pindahkan lewat **Atur → Unduh cadangan**, lalu **Pulihkan** di perangkat tujuan. Kalau dua perangkat sama-sama punya catatan baru, pakai **Gabungkan file cadangan** agar tidak saling menimpa.
- Menghapus data situs di browser akan menghapus data aplikasi. Unduh cadangan secara berkala.
- PIN hanya mengunci tampilan, bukan enkripsi data.

## Lisensi
Tentukan sendiri sebelum dipublikasikan, mis. MIT, atau biarkan hak cipta penuh jika hanya untuk internal madrasah.
