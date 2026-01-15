"use client";
import { useState } from "react";
import { useUpdateUserPasswordMutation } from "@/services/users.service";
import { User } from "@/types/user";
import Swal from "sweetalert2";
import { IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";
import { getErrorMessage } from "@/lib/error-utils";

interface FormUpdatePasswordProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FormUpdatePassword({
  user,
  onClose,
  onSuccess,
}: FormUpdatePasswordProps) {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [updatePassword, { isLoading }] = useUpdateUserPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      Swal.fire({
        icon: "error",
        title: "Validasi Gagal",
        text: "Password dan konfirmasi password tidak cocok.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      await updatePassword({
        id: user.id,
        payload: {
          password,
          password_confirmation: passwordConfirmation,
        },
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Password berhasil diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      });

      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error(error);

      const errorMessage = getErrorMessage(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Modal Card */}
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-neutral-800 transform transition-all scale-100">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-neutral-800/50 px-6 py-4 border-b border-gray-100 dark:border-neutral-800 flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
            <IconLock size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ubah Password
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              User: <span className="font-medium">{user.name}</span>
            </p>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-10"
                placeholder="Masukkan password baru"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showPassword ? (
                  <IconEyeOff size={18} />
                ) : (
                  <IconEye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-10"
                placeholder="Ulangi password baru"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showConfirmPassword ? (
                  <IconEyeOff size={18} />
                ) : (
                  <IconEye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-700 dark:hover:bg-neutral-700"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? "Menyimpan..." : "Simpan Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
