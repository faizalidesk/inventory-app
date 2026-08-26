---
name: web-performance-optimizer
description: Digunakan saat pengguna ingin mengoptimalkan kecepatan website, Core Web Vitals, atau memperkecil ukuran aset gambar/CSS/JS.
---

# Panduan Optimasi Kinerja Web

## Kapan Menggunakan Skill Ini:
- Pengguna mengeluhkan website lambat.
- Optimasi skor Google Lighthouse atau LCP/CLS.

## Langkah-Langkah yang Harus Dilakukan:
1. Audit aset gambar (pastikan menggunakan WebP/AVIF atau SVG vektor).
2. Periksa cache header pada server/CDN.
3. Hapus kode JavaScript atau CSS yang tidak terpakai.
4. Gunakan dynamic import (code-splitting) untuk halaman sekunder.
5. Manfaatkan preconnect dan font-display: swap untuk resource eksternal.

## Hal yang Dilarang:
- Jangan mengompres gambar hingga merusak kualitas visual utama.
- Jangan menghapus skrip analitik atau meta SEO tanpa konfirmasi.
