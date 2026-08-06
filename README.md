# Inventory Management System

A modern **Inventory Management System** built with **React + Vite** and powered by **Supabase** as backend services.

Project ini dirancang untuk membantu perusahaan mengelola stok barang, gudang, transaksi masuk/keluar, serta monitoring inventory secara real-time.

Menggunakan konsep **Single Codebase with Multi-Tenant Flavoring**, satu aplikasi dapat digunakan oleh beberapa tenant/perusahaan dengan konfigurasi tampilan, fitur, dan data yang berbeda.

---

## 🚀 Features

### Authentication
- User registration
- User login
- Secure authentication menggunakan Supabase Auth
- Protected route untuk halaman dashboard
- Role-based access (Admin / User)

---

### Inventory Management

- Management data barang
- Monitoring jumlah stok
- Tracking barang masuk
- Tracking barang keluar
- Status inventory secara real-time
- Multi warehouse support

---

### Dashboard

- Overview inventory
- Total barang
- Stok tersedia
- Aktivitas transaksi terbaru
- Monitoring kondisi gudang

---

### Multi-Tenant Flavoring

Project menggunakan konsep:

```
Single Codebase
        |
        |
        ├── Tenant A
        |     ├── Custom Logo
        |     ├── Custom Theme
        |     ├── Custom Feature
        |
        ├── Tenant B
        |     ├── Custom Branding
        |     ├── Custom Configuration
        |
        └── Tenant C
```

Keuntungan:

- Satu source code untuk banyak perusahaan
- Custom branding setiap tenant
- Data terisolasi berdasarkan tenant
- Mudah dikembangkan menjadi SaaS Application

---

# 🏗️ Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- CSS / Custom Styling


## Backend Service

- Supabase
  - Authentication
  - PostgreSQL Database
  - Row Level Security (RLS)


## Deployment

- GitHub
- Vercel
- Cloudflare DNS


Architecture:

```
User
 |
Domain
 |
Cloudflare DNS
 |
Vercel Hosting
 |
React + Vite
 |
Supabase
 |
PostgreSQL Database
```

---

# 📂 Project Structure

```
src
│
├── assets
│
├── components
│
├── config
│   ├── tenants.js
│   └── themes.js
│
├── pages
│   ├── LandingPage.jsx
│   │
│   ├── auth
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   └── dashboard
│       └── Dashboard.jsx
│
├── routes
│   └── ProtectedRoute.jsx
│
├── supabase.js
├── App.jsx
└── main.jsx
```

---

# 🔐 Authentication Flow

```
User
 |
Register/Login
 |
Supabase Auth
 |
Create Session
 |
Protected Route
 |
Dashboard
```

User yang belum login tidak dapat mengakses halaman dashboard.

---

# 🗄️ Database Design

Database menggunakan PostgreSQL dari Supabase.


## Users

Menyimpan data pengguna.

```
users
 |
 ├── id
 ├── email
 ├── password
 └── role
```


## Tenants

Menyimpan informasi perusahaan.

```
tenants
 |
 ├── id
 ├── name
 ├── domain
 ├── logo
 └── theme
```


## Profiles

Relasi user dengan tenant.

```
profiles
 |
 ├── id
 ├── user_id
 ├── tenant_id
 └── role
```


## Products

Data barang.

```
products
 |
 ├── id
 ├── tenant_id
 ├── name
 ├── sku
 ├── stock
 └── warehouse_id
```


## Transactions

Riwayat barang masuk dan keluar.

```
transactions
 |
 ├── id
 ├── tenant_id
 ├── product_id
 ├── type
 ├── quantity
 └── created_at
```

---

# 🔒 Security

Menggunakan Supabase Row Level Security (RLS).

Setiap tenant hanya dapat melihat data miliknya sendiri.

Contoh:

```
Tenant A

Products:
- Laptop
- Mouse


Tenant B

Products:
- Printer
- Scanner
```

Tenant A tidak dapat mengakses data Tenant B.

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/username/inventory-management.git
```

Masuk ke folder:

```bash
cd inventory-management
```

---

## 2. Install Dependency

```bash
npm install
```

---

## 3. Setup Environment Variable

Buat file:

```
.env
```

Isi:

```env
VITE_SUPABASE_URL=your_supabase_url

VITE_SUPABASE_ANON_KEY=your_supabase_key
```

---

## 4. Run Development Server

```bash
npm run dev
```

Project berjalan:

```
http://localhost:5173
```

---

# 🌎 Deployment

Project menggunakan:

```
GitHub
   |
   |
Vercel
   |
   |
Custom Domain
   |
   |
Cloudflare DNS
```

Environment variable harus ditambahkan pada:

```
Vercel
→ Project Settings
→ Environment Variables
```

---

# 🔑 Environment Variables

Required:

| Variable | Description |
|---|---|
| VITE_SUPABASE_URL | Supabase project URL |
| VITE_SUPABASE_ANON_KEY | Supabase public key |

---

# 🧪 Development

Available commands:

## Start Development

```bash
npm run dev
```


## Build Production

```bash
npm run build
```


## Preview Production Build

```bash
npm run preview
```

---

# 📌 Roadmap

## Phase 1
- [x] Landing Page
- [x] Authentication
- [x] Supabase Integration
- [ ] Dashboard Inventory


## Phase 2

- [ ] Product Management
- [ ] Warehouse Management
- [ ] Stock Transaction
- [ ] Reporting


## Phase 3

- [ ] Multi Tenant Management
- [ ] Role Permission
- [ ] Audit Log
- [ ] Analytics Dashboard


---

# 🎯 Project Goals

Inventory Management System dibuat untuk:

- Mengurangi pencatatan manual menggunakan spreadsheet
- Memberikan informasi stok secara real-time
- Mempermudah monitoring banyak gudang
- Mendukung banyak perusahaan dalam satu platform


---

# 👨‍💻 Author

Developed by **Faiz Ali**
