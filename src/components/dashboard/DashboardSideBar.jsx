"use client";

import {
  LayoutSideContentLeft,
  Bell,
  Envelope,
  Gear,
  House,
  Magnifier,
  Person,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardSideBar({ user }) {
  const navItems = [
    { icon: House, label: "Home" },
    { icon: Magnifier, label: "Search" },
    { icon: Bell, label: "Notifications" },
    { icon: Envelope, label: "Messages" },
    { icon: Person, label: "Profile" },
    { icon: Gear, label: "Settings" },
  ];

  const navContent = (
    <nav className="flex flex-col gap-1">
      <Link href="/" className="flex items-center">
          <div className="transition-transform duration-300 hover:scale-105">
            <Image
              src="/assets/logox.png"
              alt="GymNest Logo"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Gym
            <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Nest
            </span>
          </h1>
        </Link>

         {/* User */}
              <div className="border-b border-t border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={user?.image || "/assets/default-user.png"}
                    alt={user?.name || "User"}
                    width={48}
                    height={48}
                    className="rounded-full border border-pink-500 object-cover"
                  />
        
                  <div>
                    <h3 className="font-semibold text-white">
                      {user?.name}
                    </h3>
        
                    <span className="rounded-full bg-pink-500/20 px-2 py-1 text-xs text-pink-400">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>
      {navItems.map((item) => (
        <button
          key={item.label}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
          type="button"
        >
          <item.icon className="size-5 text-muted" />
          {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
        {navContent}
      </aside>
      <Drawer>
        <Button className="lg:hidden" variant="secondary">
          <LayoutSideContentLeft />
          Menu
        </Button>
        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header>
              </Drawer.Header>
              <Drawer.Body>{navContent}</Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}
