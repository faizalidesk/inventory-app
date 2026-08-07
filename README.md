# ✦ Desktopalie — Personal Creative Workspace

> **Desktopalie** is my personal space for projects, experiments, and digital creations—documenting my journey through web development, UI/UX design, and modern technology.

---

## 🚀 Overview

Desktopalie adalah platform personal workspace yang dirancang untuk mengelola dan mempublikasikan karya kreatif:
- **Projects**: Portofolio karya, case studies, dan aplikasi web pilihan.
- **Experiments**: Prototipe kecil, eksperimen UI/UX, animasi, dan studi teknologi.
- **Notes**: Catatan ide, prinsip desain, dan jurnal pembelajaran.
- **Bookmarks**: Koleksi referensi web dan dokumentasi berharga.

---

## 🏗️ Tech Stack

### Frontend
- **React 19** + **Vite 8**
- **React Router DOM v7** (Multi-page & Protected Routing)
- **Vanilla CSS** dengan Design System Kustom (Dark/Light Mode dengan **View Transitions API**)
- **React Icons** & **Custom SVG Components**

### Backend & Database
- **Supabase**
  - **Auth**: Autentikasi dengan PKCE Flow & Auto Idle Timeout (30 min)
  - **PostgreSQL Database**: Menyimpan data real-time `projects`, `experiments`, `notes`, dan `bookmarks`
  - **Row Level Security (RLS)**: Keamanan data per pengguna

### Tooling & Deployment
- **OxLint** (Fast JavaScript/React Linting)
- **Vercel** (Deployment Hosting)
- **Cloudflare DNS**

---

## 📂 Project Structure

```
src/
├── assets/
├── component/        # DesktopalieMark, UserAvatar, AntigravityLogo
├── context/          # AuthContext (Supabase Auth & Session Timeout)
├── lib/              # Supabase Client Configuration
├── pages/
│   ├── auth/         # Login, Register, Recovery
│   ├── dashboard/    # Workspace Dashboard, Overview, Settings, Profile
│   ├── LandingPage.jsx
│   ├── PublicPage.jsx
│   └── NotFound.jsx
├── routes/           # ProtectedRoute & PublicOnlyRoute
├── services/         # Workspace Real-Time Supabase Service
└── utils/            # Circular Theme View Transition Utility
```

---

## 🔐 Database Schema (Supabase)

Aplikasi terhubung langsung ke database PostgreSQL Supabase dengan tabel-tabel utama:

- `public.projects` — Data karya dan case studies
- `public.experiments` — Data prototipe dan eksperimen
- `public.notes` — Data catatan dan ide
- `public.bookmarks` — Data referensi favorit

Script skema awal dan RLS tersedia di [`supabase_schema.sql`](file:///d:/faizali/desktop-alie/supabase_schema.sql).

---

## 👨‍💻 Author

Developed by **Faiz Ali**
