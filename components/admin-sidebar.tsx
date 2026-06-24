"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import SignOutButton from "@/components/auth/sign-out-button";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Beneficiary", href: "/admin/beneficiary" },
  { label: "Application", href: "/admin/application" },
  { label: "Program", href: "/admin/program" },
  { label: "Release Monitoring", href: "/admin/release-monitoring" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-slate-800 bg-slate-950 text-slate-100 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col p-4 sm:p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
            CAMS
          </p>
          <h1 className="mt-2 text-xl font-semibold text-white">Admin Panel</h1>
          <p className="mt-1 text-sm text-slate-400">
            Community Assistance Management System
          </p>
        </div>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-7 lg:flex-col lg:overflow-visible">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/admin/dashboard" && pathname === "/admin");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 lg:mt-auto lg:pt-6">
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}
