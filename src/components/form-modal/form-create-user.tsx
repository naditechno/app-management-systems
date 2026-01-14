"use client";
import { useEffect, useState } from "react";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetRolesQuery,
} from "@/services/users.service";
import { User, Role, CreateUserPayload } from "@/types/user";
import Swal from "sweetalert2";
import { Combobox } from "@/components/ui/combo-box";

interface FormCreateUserProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: User;
}

const mapRoleLabel = (raw: string) => {
  const n = raw.toLowerCase();
  if (n === "pekerjaan") return "Pengawas";
  if (n === "pengawas") return "Pekerjaan";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

export default function FormCreateUser({
  onClose,
  onSuccess,
  initialData,
}: FormCreateUserProps) {
  const isEdit = Boolean(initialData?.id);

  // 1. State disederhanakan (Hapus phone & password)
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [roleId, setRoleId] = useState<number | null>(null);

  const { data: roles = [], isLoading: rolesLoading } = useGetRolesQuery();
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
  const isLoading = creating || updating;

  // 2. Effect disederhanakan
  useEffect(() => {
    if (isEdit && initialData) {
      const currentRoleFromApi = initialData.roles?.[0];
      setRoleId(currentRoleFromApi?.id ?? null);

      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        role: currentRoleFromApi?.name || "",
      });
    } else {
      setRoleId(null);
      setForm({
        name: "",
        email: "",
        role: "",
      });
    }
  }, [isEdit, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!roleId) {
      await Swal.fire({
        icon: "warning",
        title: "Peran belum dipilih",
        text: "Silakan pilih role terlebih dahulu.",
      });
      return;
    }

    try {
      // 3. Payload disederhanakan (Pastikan backend mengizinkan password kosong/default saat create)
      // Gunakan 'as any' atau 'Partial' jika TypeScript komplain soal missing properties di CreateUserPayload
      const payload: Partial<CreateUserPayload> = {
        role_id: roleId,
        name: form.name,
        email: form.email,
        status: 1,
        // Phone dan Password tidak dikirim
      };

      if (isEdit && initialData?.id) {
        // Untuk update, kita kirim partial payload
        await updateUser({
          id: initialData.id,
          payload: payload as Partial<CreateUserPayload>,
        }).unwrap();

        await Swal.fire(
          "Berhasil",
          "Data pengguna berhasil diperbarui.",
          "success"
        );
      } else {
        // Untuk create, pastikan Type payload sesuai.
        // Jika backend mewajibkan password, Anda mungkin perlu mengirim string kosong atau default di sini.
        await createUser(payload as CreateUserPayload).unwrap();

        await Swal.fire(
          "Berhasil",
          "Data pengguna berhasil ditambahkan.",
          "success"
        );
      }

      onSuccess();
      onClose();
    } catch (error: unknown) {
      if (typeof error === "object" && error && "data" in error) {
        const err = error as { data?: { message?: string }; error?: string };
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: err.data?.message || err.error || "Terjadi kesalahan",
        });
      } else {
        await Swal.fire("Gagal", "Terjadi kesalahan", "error");
      }
    }
  };

  return (
    <div className="px-4 fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg w-full max-w-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Pengguna" : "Tambah Pengguna Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* 4. UI Input hanya Name & Email */}
            {(["name", "email"] as const).map((field) => (
              <div key={field}>
                <label className="block mb-1 capitalize text-sm">
                  {field === "name" && "Nama"}
                  {field === "email" && "Email"}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-neutral-700 border-gray-300 dark:border-gray-600"
                />
              </div>
            ))}

            <div className="col-span-1">
              <label className="block mb-1 text-sm">Peran</label>
              <Combobox<Role>
                value={roleId}
                onChange={(val) => setRoleId(val)}
                data={roles}
                isLoading={rolesLoading}
                placeholder="Pilih Role"
                getOptionLabel={(r) => mapRoleLabel(r.name)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded bg-neutral-600 text-white hover:bg-neutral-700 text-sm disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}