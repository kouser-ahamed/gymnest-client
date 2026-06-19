"use client";

import Image from "next/image";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

import {
  House,
  SquareChartBar,
  PersonWorker,
  Persons,
  ArrowRightFromSquare,
} from "@gravity-ui/icons";


export function DashboardSidebar({ user }) {
  const pathname = usePathname();

  const route = useRouter();

  const role = user?.role || "member";

  const handleLogout = async () => {
  await signOut();
  route.push("/");
};

  const menuItems = {
    admin: [

      {
        label: "Home",
        href: "/",
        icon: House,
      },
      {
        label: "Overview",
        href: "/dashboard/admin",
        icon: SquareChartBar,
      },
      {
        label: "Manage Users",
        href: "/dashboard/admin/users",
        icon: Persons,
      },
      {
        label: "Manage Trainers",
        href: "/dashboard/admin/trainers",
        icon: PersonWorker,
      },
    ],

    trainer: [
      {
        label: "Overview",
        href: "/dashboard/trainer",
        icon: SquareChartBar,
      },
      {
        label: "Add Class",
        href: "/dashboard/trainer/add-class",
        icon: House,
      },
      {
        label: "My Classes",
        href: "/dashboard/trainer/my-classes",
        icon: Persons,
      },
      {
        label: "Add Forum Post",
        href: "/dashboard/trainer/add-forum",
        icon: SquareChartBar,
      },
      {
        label: "My Posts",
        href: "/dashboard/trainer/my-posts",
        icon: Persons,
      },
    ],

    member: [
      {
        label: "Overview",
        href: "/dashboard/member",
        icon: SquareChartBar,
      },
      {
        label: "Booked Classes",
        href: "/dashboard/member/booked-classes",
        icon: Persons,
      },
      {
        label: "Profile",
        href: "/dashboard/member/profile",
        icon: House,
      },
    ],
  };

  const navItems = menuItems[role] || menuItems.member;

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-white/10 bg-[#070b14]">
      
      {/* Logo */}
      <div className="border-b border-white/10 p-5">
        <NextLink href="/" className="flex items-center gap-3">
          <Image
            src="/assets/logox.png"
            alt="GymNest"
            width={48}
            height={48}
          />

          <h2 className="text-xl font-bold text-white">
            Gym
            <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Nest
            </span>
          </h2>
        </NextLink>
      </div>

      {/* User */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Image
            src={user?.image || "/assets/default-user.png"}
            alt={user?.name || "User"}
            width={50}
            height={50}
            className="rounded-full border border-pink-500 object-cover"
          />

          <div>
            <h3 className="font-semibold text-white">
              {user?.name}
            </h3>

            <span className="rounded-full bg-pink-500/20 px-2 py-1 text-xs text-pink-400">
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <NextLink
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-gradient-to-r from-fuchsia-500/20 to-orange-500/20 text-pink-400"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />

              <span>{item.label}</span>
            </NextLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-red-400 transition hover:bg-red-500/10"
        >
          <ArrowRightFromSquare className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}