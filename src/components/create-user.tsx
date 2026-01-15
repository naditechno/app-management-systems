"use client";
import { useEffect, useState } from "react";
import {
  useDeleteUserMutation,
  useGetRolesQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useValidateUserEmailMutation,
} from "@/services/users.service";
import FormCreateUser from "./form-modal/form-create-user";
import FormUpdatePassword from "./form-modal/form-update-password";
import useModal from "@/hooks/use-modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical, IconKey, IconMailCheck } from "@tabler/icons-react";
import { User } from "@/types/user";
import { Button } from "./ui/button";
import Swal from "sweetalert2";
import { getErrorMessage } from "@/lib/error-utils";

export default function CreateUser() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchBy] = useState("name");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [usersPerPage] = useState(10);

  // ✅ State khusus untuk Modal Ubah Password
  const [passwordModalUser, setPasswordModalUser] = useState<User | null>(null);

  // --- API HOOKS ---
  const {
    data: result,
    isLoading,
    isError,
    refetch,
  } = useGetUsersQuery({
    page: currentPage,
    paginate: usersPerPage,
    search,
    search_by: searchBy,
  });

  const { data: roles = [] } = useGetRolesQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();

  // New Mutations
  const [validateEmail] = useValidateUserEmailMutation();

  // Modal untuk Create/Edit User (Bukan Password)
  const { isOpen, openModal, closeModal } = useModal();

  const users: User[] = result?.data?.data || [];
  const totalPages = result?.data?.last_page || 1;

  // --- HANDLERS ---

  const handleAddUser = () => {
    setEditingUser(undefined);
    openModal();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    openModal();
  };

  const handleDelete = async (user: User) => {
    const result = await Swal.fire({
      title: `Hapus ${user.name}?`,
      text: "Apakah Anda yakin ingin menghapus user ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(user.id).unwrap();
        Swal.fire("Berhasil!", "User berhasil dihapus.", "success");
        refetch();
      } catch (error: unknown) {
        console.error(error);

        const errorMessage = getErrorMessage(error);

        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: errorMessage,
        });
      }
    }
  };

  const toggleStatus = async (user: User) => {
    const action = user.status ? "Nonaktifkan" : "Aktifkan";
    const result = await Swal.fire({
      title: `${action} ${user.name}?`,
      text: `Apakah Anda yakin ingin me-${action.toLowerCase()} user ini?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: action,
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const payload = {
          role_id: user.roles?.[0]?.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.status ? 0 : 1,
        };
        await updateUserStatus({ id: user.id, payload }).unwrap();
        Swal.fire(
          "Berhasil!",
          `Status user ${user.name} diperbarui.`,
          "success"
        );
        refetch();
      } catch (error: unknown) {
        console.error(error);

        const errorMessage = getErrorMessage(error);

        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: errorMessage,
        });
      }
    }
  };

  // ✅ Handler: Buka Modal Password
  const handleOpenPasswordModal = (user: User) => {
    setPasswordModalUser(user);
  };

  // ✅ Handler: Validasi Email
  const handleValidateEmail = async (user: User) => {
    const result = await Swal.fire({
      title: "Validasi Email?",
      text: `Kirim validasi email untuk ${user.email}?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Ya, Validasi",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await validateEmail(user.id).unwrap();
        Swal.fire("Berhasil!", "Email user berhasil divalidasi.", "success");
      } catch (err: unknown) {
        console.error(err);
        Swal.fire("Error", "Gagal memvalidasi email.", "error");
      }
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <main className="p-6 w-full mx-auto">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Data Pengguna</h2>
            <p className="text-sm text-muted-foreground">
              Kelola semua akun pengguna di sistem.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Pencarian nama..."
              className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md text-sm bg-white dark:bg-neutral-800"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md text-sm bg-white dark:bg-neutral-800"
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">Semua Peran</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAddUser}
              className="px-4 py-2 text-sm bg-primary text-white rounded-md"
            >
              Tambah Akun
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-neutral-800 shadow rounded overflow-auto">
          {isLoading ? (
            <p className="text-center animate-pulse py-6">
              Memuat data pengguna...
            </p>
          ) : isError ? (
            <p className="text-center py-6">Gagal memuat data!</p>
          ) : (
            <>
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-neutral-700">
                  <tr>
                    {"No Nama Email Telepon Peran Aksi".split(" ").map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users
                    .filter((u) => {
                      // Logic Filter Status
                      const matchStatus =
                        statusFilter === "" ||
                        (statusFilter === "active" ? u.status : !u.status);

                      // Logic Filter Role
                      const userRoleName =
                        u.role_name || u.roles?.[0]?.name || "";
                      const matchRole =
                        roleFilter === "" ||
                        userRoleName.toLowerCase() === roleFilter.toLowerCase();

                      return matchStatus && matchRole;
                    })
                    .map((u, idx) => (
                      <tr key={u.id}>
                        <td className="px-4 py-2">
                          {(currentPage - 1) * usersPerPage + idx + 1}
                        </td>
                        <td className="px-4 py-2">{u.name}</td>
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2">{u.phone}</td>
                        <td className="px-4 py-2">{u.role_name}</td>
                        <td className="px-4 py-2 flex items-center gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleEdit(u)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(u)}
                          >
                            Delete
                          </Button>

                          {/* DROPDOWN MENU */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-700">
                                <IconDotsVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* 1. Update Password */}
                              <DropdownMenuItem
                                onClick={() => handleOpenPasswordModal(u)}
                              >
                                <IconKey className="w-4 h-4 mr-2" />
                                Ubah Password
                              </DropdownMenuItem>

                              {/* 2. Validate Email */}
                              <DropdownMenuItem
                                onClick={() => handleValidateEmail(u)}
                              >
                                <IconMailCheck className="w-4 h-4 mr-2" />
                                Validasi Email
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              {/* 3. Status Toggle */}
                              <DropdownMenuItem
                                className={
                                  u.status ? "text-red-600" : "text-green-600"
                                }
                                onClick={() => toggleStatus(u)}
                              >
                                {u.status ? "Nonaktifkan" : "Aktifkan"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {/* Pagination UI */}
              <div className="flex justify-between items-center p-4 bg-neutral-100 dark:bg-neutral-700">
                <p>Halaman {currentPage}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 dark:bg-neutral-700 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 dark:bg-neutral-700 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* MODAL Create/Edit User */}
      {isOpen && (
        <FormCreateUser
          onClose={closeModal}
          onSuccess={refetch}
          initialData={editingUser ?? undefined}
        />
      )}

      {/* MODAL Ubah Password */}
      {passwordModalUser && (
        <FormUpdatePassword
          user={passwordModalUser}
          onClose={() => setPasswordModalUser(null)}
          onSuccess={() => {
            // Opsional: refetch jika perlu
          }}
        />
      )}
    </main>
  );
}
