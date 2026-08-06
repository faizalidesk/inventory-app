// Listed directory scratch

// Berikut adalah versi komponen **Register** yang telah diperbarui dengan desain **modern, futuristik, dan elegan** (gaya *dark glassmorphism* seperti aplikasi web SaaS modern saat ini).

// ### 🚀 Fitur & Peningkatan UI/UX:
// 1. **Desain Card Split-Screen (Hero Panel & Form)**: Memiliki side panel branding di sebelah kiri (pada layar besar/desktop) yang menampilkan *benefit checklist*.
// 2. **Ambient Glow & Dark Glassmorphism**: Background efek *blurred mesh gradient* memberikan kesan aplikasi premium.
// 3. **Ikon Input (`lucide-react`)**: Setiap input dilengkapi ikon visual (`User`, `Mail`, `Lock`) untuk *usability* yang lebih baik.
// 4. **Show / Hide Password**: Tombol mata (`Eye` / `EyeOff`) untuk melihat/menyembunyikan kata sandi.
// 5. **Indikator Kekuatan Password**: Bar warna dinamis (Lemah, Sedang, Baik, Sangat Kuat) yang berubah secara *real-time* saat pengguna mengetik.
// 6. **Animasi & Hover States**: Tombol dengan *gradient glow*, spinner animasi saat *loading*, dan transisi halus pada *focus rings*.
// 7. **Pesan Error yang Jelas**: Banner alert merah transparan dilengkapi ikon `AlertCircle`.

// ---

// ### 💻 Kode Komponen `Register.jsx` (atau `Register.tsx`):

// > **Catatan:** Komponen ini menggunakan ikon dari paket [`lucide-react`](https://lucide.dev/). Pastikan Anda sudah menginstalnya (`npm install lucide-react`), atau sesuaikan ikon sesuai library yang Anda gunakan.

// ```jsx
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Kalkulator kekuatan password
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "", color: "bg-slate-800" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: "Lemah", color: "bg-red-500", text: "text-red-400" };
      case 2:
        return { score: 50, label: "Sedang", color: "bg-amber-500", text: "text-amber-400" };
      case 3:
        return { score: 75, label: "Baik", color: "bg-blue-500", text: "text-blue-400" };
      case 4:
        return { score: 100, label: "Sangat Kuat", color: "bg-emerald-500", text: "text-emerald-400" };
      default:
        return { score: 0, label: "", color: "bg-slate-800", text: "text-slate-400" };
    }
  };

  const passStrength = getPasswordStrength(form.password);

  async function register(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password minimal harus 6 karakter.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans p-4 sm:p-6 lg:p-8">
      {/* Visual Background Lighting & Ambient Blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse delay-700" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Utama */}
      <div className="relative w-full max-w-4xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Panel Kiri: Hero & Branding (Khusus Layar Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl text-white shadow-inner border border-white/20">
              <Sparkles className="w-5 h-5 text-indigo-200" />
            </div>
            <span className="font-bold text-xl tracking-tight">AppLogo</span>
          </div>

          {/* Value Proposition */}
          <div className="my-auto py-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-indigo-100 border border-white/15 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Registrasi Cepat & Aman
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Mulai perjalanan Anda bersama kami.
            </h2>
            <p className="mt-3 text-indigo-100/80 text-sm leading-relaxed">
              Bergabunglah dengan pengguna lainnya dan nikmati akses penuh ke berbagai fitur unggulan aplikasi kami.
            </p>

            {/* Feature Checklist */}
            <div className="mt-8 space-y-3">
              {[
                "Akses langsung ke seluruh fitur",
                "Keamanan data terenkripsi",
                "Dukungan penuh 24/7",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-indigo-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-xs text-indigo-200/60">
            © {new Date().getFullYear()} AppName. All rights reserved.
          </p>
        </div>

        {/* Panel Kanan: Form Registrasi */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-slate-900/60">
          <div className="max-w-md mx-auto w-full">
            
            {/* Header Form */}
            <div className="text-center sm:text-left mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Buat akun baru ✨
              </h1>
              <p className="text-sm text-slate-400 mt-1.5">
                Daftar hanya dalam beberapa detik untuk memulai
              </p>
            </div>

            {/* Alert Error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-3.5 text-sm text-red-400 animate-fadeIn">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={register} className="space-y-4">
              {/* Field: Nama */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={change}
                    placeholder="Contoh: Alex Ferguson"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Field: Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={change}
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Field: Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={change}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Meter Kekuatan Password */}
                {form.password && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passStrength.color}`}
                        style={{ width: `${passStrength.score}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Kekuatan password:</span>
                      <span className={`font-semibold ${passStrength.text}`}>
                        {passStrength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 group relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Akun</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              {/* Link ke Login */}
              <p className="mt-6 text-center text-sm text-slate-400">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition"
                >
                  Masuk di sini
                </button>
              </p>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
