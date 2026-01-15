"use client";

import { Fragment, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { useGetNotificationsQuery } from "@/services/notification.service";
import { IconBell, IconChevronRight } from "@tabler/icons-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Swal from "sweetalert2";
import { useLogoutMutation } from "@/services/auth.service";

// --- DATA NAVIGASI ---
const NAV_ITEMS = [
  {
    title: "Dashboard",
    url: "/dashboard",
  },
  {
    title: "Manajemen",
    url: "#",
    children: [
      {
        title: "Program Kerja",
        url: "/management/program-kerja",
      },
      {
        title: "Inisiatif Strategis",
        url: "/management/inisiatif-strategis",
      },
    ],
  },
  {
    title: "Reports",
    url: "/reports",
  },
  {
    title: "Settings",
    url: "/setting",
  },
];

type NavItem = {
  title: string;
  url: string;
  children?: NavItem[];
};

export function SiteHeader({ title }: { title: string }) {
  const { data: session } = useSession();
  const name = session?.user?.name || "User";
  const role = session?.user?.roles?.[0]?.name || "Administrator";

  const pathname = usePathname();
  const route = useRouter();

  // --- LOGIC BREADCRUMB ---
  const breadcrumbs = useMemo(() => {
    // Helper untuk mencari path berdasarkan struktur menu
    const findPath = (
      items: NavItem[],
      targetUrl: string
    ): NavItem[] | null => {
      for (const item of items) {
        // 1. Cek Exact Match
        if (item.url === targetUrl) {
          return [item];
        }

        // 2. Cek Children (Recursive)
        if (item.children) {
          const childPath = findPath(item.children, targetUrl);
          if (childPath) {
            return [item, ...childPath];
          }
        }
      }
      return null;
    };

    // Helper untuk mencari item yang URL-nya menjadi awalan (prefix) dari current URL
    // Ini berguna untuk mendeteksi parent page (misal /program-kerja) saat kita di child page (/program-kerja/create)
    const findPrefixPath = (
      items: NavItem[],
      targetUrl: string
    ): NavItem[] | null => {
      const bestMatch: NavItem[] | null = null;

      for (const item of items) {
        // Skip URL root atau hash
        if (item.url === "/" || item.url === "#") {
          if (item.children) {
            const childPath = findPrefixPath(item.children, targetUrl);
            if (childPath) return [item, ...childPath];
          }
          continue;
        }

        // Jika item.url adalah bagian awal dari targetUrl (misal target: /a/b, item: /a)
        if (targetUrl.startsWith(item.url)) {
          // Simpan ini sebagai kandidat match
          const currentPath = [item];

          // Cek apakah ada match yang lebih spesifik di children
          if (item.children) {
            const childMatch = findPrefixPath(item.children, targetUrl);
            if (childMatch) {
              return [item, ...childMatch];
            }
          }
          return currentPath;
        }

        // Cek children meskipun parent tidak match (kasus parent url #)
        if (item.children) {
          const childPath = findPrefixPath(item.children, targetUrl);
          if (childPath) return [item, ...childPath];
        }
      }
      return bestMatch;
    };

    // 1. Coba cari Exact Match di menu
    let result = findPath(NAV_ITEMS, pathname);

    // 2. Jika tidak ketemu, coba cari Parent terdekat (Prefix Match)
    if (!result) {
      result = findPrefixPath(NAV_ITEMS, pathname);

      // Jika ketemu parent, tambahkan halaman saat ini sebagai "leaf" node manual
      if (result && result.length > 0) {
        // Cek apakah halaman terakhir di result benar-benar parent dari pathname
        // (Mencegah duplikasi jika exact match gagal tapi prefix match mengembalikan hal yang sama)
        const lastItem = result[result.length - 1];
        if (lastItem.url !== pathname) {
          // Tambahkan title halaman saat ini ke breadcrumb
          // Gunakan props 'title' sebagai nama breadcrumb terakhir
          result.push({ title: title, url: pathname });
        }
      }
    }

    // Fallback: Jika sama sekali tidak ada di menu, tampilkan Home > Title
    if (!result || result.length === 0) {
      // Opsional: return [{ title: "Home", url: "/" }, { title: title, url: pathname }];
      return [];
    }

    return result;
  }, [pathname, title]);

  // --- NOTIFIKASI ---
  const { data } = useGetNotificationsQuery(
    { page: 1, paginate: 10 },
    {
      pollingInterval: 300000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const notifications = data?.data || [];
  const hasUnread = notifications.some((n) => !n.read_at);

  const handleNotif = () => {
    route.push("/notifications");
  };

  // --- LOGOUT ---
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Logout?",
      text: "Anda akan keluar dari sesi saat ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, logout",
      cancelButtonText: "Batal",
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        popup: "z-[9999]",
      },
    });

    if (!confirm.isConfirmed) return;

    try {
      await logout().unwrap();
      await Swal.fire({
        title: "Berhasil keluar",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
      await signOut({ redirect: false });
      route.replace("/auth/login");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan saat logout.";
      await Swal.fire({
        title: "Gagal logout",
        text: message,
        icon: "error",
        confirmButtonText: "Tutup",
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-col">
          <h1 className="text-base font-semibold leading-none">{title}</h1>

          {breadcrumbs.length > 0 && (
            <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                const isUnclickable = item.url === "#";

                return (
                  <Fragment key={index}>
                    {isUnclickable || isLast ? (
                      <span
                        className={isLast ? "font-medium text-foreground" : ""}
                      >
                        {item.title}
                      </span>
                    ) : (
                      <Link
                        href={item.url}
                        className="hover:text-foreground transition-colors"
                      >
                        {item.title}
                      </Link>
                    )}

                    {!isLast && (
                      <IconChevronRight className="w-3 h-3 text-muted-foreground/50" />
                    )}
                  </Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <ModeToggle />

        <div
          className="relative cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          onClick={handleNotif}
        >
          <IconBell className="w-6 h-6" />
          {hasUnread && (
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer select-none hover:bg-accent/50 p-2 rounded-md transition-colors">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold leading-none">{name}</span>
                <span className="text-xs text-muted-foreground">{role}</span>
              </div>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src="" alt={name} />
                <AvatarFallback>
                  <UserIcon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLoggingOut ? "Keluar..." : "Logout"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}