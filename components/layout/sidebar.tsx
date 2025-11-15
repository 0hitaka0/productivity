"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Heart,
  BookOpen,
  Settings,
  Sparkles,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Your daily overview",
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
    description: "Manage your intentions",
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
    description: "Time & schedule",
  },
  {
    name: "Habits",
    href: "/habits",
    icon: Heart,
    description: "Build consistency",
  },
  {
    name: "Journal",
    href: "/journal",
    icon: BookOpen,
    description: "Reflect & process",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sage-200 bg-cream-50/80 backdrop-blur-md dark:border-midnight-700 dark:bg-midnight-950/80 transition-gentle">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-sage-200 px-6 dark:border-midnight-700">
        <Sparkles className="h-6 w-6 text-lavender-600 dark:text-lavender-400" />
        <div className="flex flex-col">
          <span className="text-lg font-light text-midnight-900 dark:text-cream-50">
            Clarity
          </span>
          <span className="text-xs text-sage-500">Your sanctuary</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 transition-gentle",
                isActive
                  ? "bg-lavender-100 text-lavender-900 shadow-soft dark:bg-lavender-900/30 dark:text-lavender-300"
                  : "text-sage-700 hover:bg-sage-100 dark:text-sage-300 dark:hover:bg-midnight-800"
              )}
            >
              <Icon className="h-5 w-5 transition-gentle group-hover:scale-110" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-sage-500 dark:text-sage-600">
                  {item.description}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-sage-200 p-4 dark:border-midnight-700">
        <Link
          href="/settings"
          className={cn(
            "group flex items-center gap-3 rounded-xl px-4 py-3 text-sage-700 transition-gentle hover:bg-sage-100 dark:text-sage-300 dark:hover:bg-midnight-800",
            pathname === "/settings" &&
              "bg-lavender-100 text-lavender-900 shadow-soft dark:bg-lavender-900/30 dark:text-lavender-300"
          )}
        >
          <Settings className="h-5 w-5 transition-gentle group-hover:rotate-90" />
          <span className="text-sm font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
