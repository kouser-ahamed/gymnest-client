"use client";

import {
  LayoutSideContentLeft,
  ArrowRightFromSquare,
  House,
  SquareChartBar,
  PersonWorker,
  FilePlus,
  Paperclip,
  PersonPlus,
  PersonsLock,
  ShieldCheck,
  GearDot,
  CircleDollar,
  Comment,
  Calendar,
  Star,
  BookOpen,
} from "@gravity-ui/icons";

import { Button, Drawer } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function DashboardSideBar({ user }) {
  const pathname = usePathname();
  const route = useRouter();

  const roll = user?.role || "member";

  const handleLogout = async () => {
    await signOut();
    route.push("/");
  };

  const dashboardItems = {
    member: [
      { label: "Home", href: "/", icon: House },
      { label: "Overview", href: "/dashboard/member", icon: SquareChartBar },
      { label: "Booked Classes", href: "/dashboard/member/booked-classes", icon: Calendar },
      { label: "Apply as Trainer", href: "/dashboard/member/apply-trainer", icon: PersonPlus },
      { label: "Favorite Classes", href: "/dashboard/member/favorite-classes", icon: Star },
    ],

    trainer: [
      { label: "Home", href: "/", icon: House },
      { label: "Overview", href: "/dashboard/trainer", icon: SquareChartBar },
      { label: "Add Class", href: "/dashboard/trainer/add-class", icon: FilePlus },
      { label: "My Classes", href: "/dashboard/trainer/my-classes", icon: Paperclip },
      { label: "Add Forum Post", href: "/dashboard/trainer/add-forum", icon: Comment },
      { label: "My Forum Posts", href: "/dashboard/trainer/my-posts", icon: BookOpen },
    ],

    admin: [
      { label: "Home", href: "/", icon: House },
      { label: "Overview", href: "/dashboard/admin", icon: ShieldCheck },
      { label: "Manage Users", href: "/dashboard/admin/users", icon: PersonsLock },
      { label: "Applied Trainers", href: "/dashboard/admin/applied-trainers", icon: PersonPlus },
      { label: "Manage Trainers", href: "/dashboard/admin/trainers", icon: PersonWorker },
      { label: "Manage Classes", href: "/dashboard/admin/classes", icon: Paperclip },
      { label: "Transactions", href: "/dashboard/admin/transactions", icon: CircleDollar },
      { label: "Forum Management", href: "/dashboard/admin/forum", icon: Comment },
      { label: "Settings", href: "/dashboard/admin/settings", icon: GearDot },
    ],
  };

  const navItems = dashboardItems[roll];

  const navContent = (
    <nav className="flex flex-col gap-1">

      {/* LOGO */}
      <Link href="/" className="flex items-center gap-2 px-2 py-2">
        <Image
          src="/assets/logox.png"
          alt="GymNest Logo"
          width={42}
          height={42}
          className="object-contain"
          priority
        />

        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Gym
          <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            Nest
          </span>
        </h1>
      </Link>

      {/* USER */}
      <div className="border-y border-slate-200 dark:border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Image
            src={user?.image || "/assets/default-user.png"}
            alt={user?.name || "User"}
            width={44}
            height={44}
            className="rounded-full border border-pink-500 object-cover"
          />

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {user?.name}
            </h3>

            <span className="rounded-full bg-pink-500/10 px-2 py-1 text-xs text-pink-600 dark:text-pink-400">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* NAV ITEMS */}
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
              isActive
                ? "bg-gradient-to-r from-fuchsia-500/15 to-orange-500/15 text-pink-600 dark:text-pink-400"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5 text-current" />
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* LOGOUT */}
      <div className="border-t border-slate-200 dark:border-white/10 p-4 mt-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
        >
          <ArrowRightFromSquare className="h-5 w-5" />
          Logout
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* DESKTOP */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#070b14] lg:block">
        {navContent}
      </aside>

      {/* MOBILE */}
      <Drawer>
        <Button className="lg:hidden" variant="secondary">
          <LayoutSideContentLeft />
          Menu
        </Button>

        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Body>{navContent}</Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}