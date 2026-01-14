"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// UI Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { CarouselAuth } from "@/components/carousel-auth";

// API Hooks (Sesuaikan path import ini dengan lokasi file services.ts Anda)
import {
  useRegisterMutation,
  useForgotPasswordMutation,
} from "@/services/auth.service";
import { ApiError } from "@/lib/error-handle";

type ViewState = "login" | "register" | "forgot_password";

export default function AuthPage() {
  const router = useRouter();

  // State untuk mengontrol tampilan form
  const [view, setView] = useState<ViewState>("login");

  // State global error/success message
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- API HOOKS ---
  const [registerApi] = useRegisterMutation();
  const [forgotPasswordApi] = useForgotPasswordMutation();

  // --- FORM STATES ---
  // Kita gabung state biar ringkas, atau bisa dipisah per form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // --- HANDLERS ---

  // 1. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Email atau password salah.");
    }
  };

  // 2. Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (formData.password !== formData.password_confirmation) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    setIsLoading(true);

    try {
      await registerApi({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      }).unwrap();

      setSuccessMsg("Registrasi berhasil! Silakan login.");
      // Reset form dan pindah ke view login setelah delay dikit atau user manual
      setTimeout(() => {
        setView("login");
        setSuccessMsg(""); // clear msg pas pindah
        setFormData({ ...formData, password: "", password_confirmation: "" }); // keep email
      }, 2000);
    } catch (err: unknown) {
      console.error(err);
      const error = err as ApiError;
      setError(error?.data?.message || "Gagal melakukan registrasi.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      await forgotPasswordApi({ email: formData.email }).unwrap();
      setSuccessMsg("Link reset password telah dikirim ke email Anda.");
    } catch (err: unknown) {
      console.error(err);
      const error = err as ApiError;
      setError(error?.data?.message || "Gagal meminta reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER CONTENT BASED ON VIEW ---

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-5 bg-white text-black dark:bg-black dark:text-white">
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 left-4 z-10">
        <ModeToggle />
      </div>

      {/* Left: Form Area */}
      <div className="flex items-center justify-center px-6 py-12 col-span-2">
        <div className="w-full max-w-md space-y-6">
          {/* Header Dynamic */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">
              {view === "login" && "Masuk ke Akun Anda"}
              {view === "register" && "Buat Akun Baru"}
              {view === "forgot_password" && "Reset Password"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {view === "login" && "Masukkan email Anda untuk masuk ke akun"}
              {view === "register" && "Lengkapi data diri Anda untuk mendaftar"}
              {view === "forgot_password" && "Masukkan email yang terdaftar"}
            </p>
          </div>

          {/* VIEW: LOGIN */}
          {view === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setView("forgot_password")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700"
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {successMsg && (
                <p className="text-sm text-green-500">{successMsg}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-900 dark:hover:bg-neutral-100"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Login"}
              </Button>

              <div className="text-center text-sm">
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setView("register");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="font-bold hover:underline"
                >
                  Daftar disini
                </button>
              </div>
            </form>
          )}

          {/* VIEW: REGISTER */}
          {view === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">No. HP</Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="0812..."
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">
                  Konfirmasi Password
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700"
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {successMsg && (
                <p className="text-sm text-green-500">{successMsg}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-900 dark:hover:bg-neutral-100"
                disabled={isLoading}
              >
                {isLoading ? "Mendaftar..." : "Register"}
              </Button>

              <div className="text-center text-sm">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="font-bold hover:underline"
                >
                  Login disini
                </button>
              </div>
            </form>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {view === "forgot_password" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700"
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {successMsg && (
                <p className="text-sm text-green-500">{successMsg}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-900 dark:hover:bg-neutral-100"
                disabled={isLoading}
              >
                {isLoading ? "Mengirim..." : "Kirim Link Reset"}
              </Button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="text-gray-500 hover:underline"
                >
                  &larr; Kembali ke Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="hidden lg:block bg-neutral-300 dark:bg-neutral-900 relative col-span-3">
        <CarouselAuth />
      </div>
    </div>
  );
}