"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  LayoutDashboard,
  Newspaper,
  RefreshCcw,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
type MenuItem = {
  label: string;
  icon: React.ReactNode;
  href?: string;
  submenu?: {
    label: string;
    href: string;
  }[];
};

export function Sidebar() {
  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-6 w-6" />,
      href: "/dashboard",
    },
    {
      label: "Article",
      icon: <Newspaper className="h-6 w-6" />,
      href: "/dashboard/article",
    },
    {
      label: "Auto dealership",
      icon: <RefreshCcw className="h-6 w-6" />,
      href: "/dashboard/dealership",
    },
    {
      label: "Blog",
      icon: <FileSpreadsheet className="h-6 w-6" />,
      href: "/dashboard/blog",
      submenu: [
        { label: "Blog Category", href: "/dashboard/blog/category" },
        { label: "Blog Page", href: "/dashboard/blog/blogpage" },
        { label: "Blog", href: "/dashboard/blog" },
      ],
    },
    {
      label: "Career",
      icon: <BriefcaseBusiness className="h-6 w-6" />,
      href: "/users",
    },
    {
      label: "Country, state, city",
      icon: <User className="h-5 w-5" />,
      href: "/users",
    },
    {
      label: "FAQ's",
      icon: <User className="h-5 w-5" />,
      href: "/users",
    },
    {
      label: "Free shop news",
      icon: <User className="h-5 w-5" />,
      href: "/users",
    },
    {
      label: "Help Center",
      icon: <User className="h-5 w-5" />,
      href: "/users",
    },
    {
      label: "How it works",
      icon: <User className="h-5 w-5" />,
      href: "/users",
    },
  ];

  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-4 flex flex-col">
      <div className="flex justify-start w-full">
        <img src={"/image/logo.png"} width={60} height={60} />
      </div>
      <nav className="flex flex-col gap-2 cursor-pointer pt-[12px]">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.submenu ? (
              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-start flex items-center gap-4"
                  onClick={() => toggleSubmenu(item.label)}
                >
                  <span>{item.icon}</span>
                  <span className="">{item.label}</span>
                  <span className="ml-auto">
                    {openMenus[item.label] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                </Button>
                {openMenus[item.label] && (
                  <div className="ml-6 mt-1 flex flex-col gap-1">
                    {item.submenu.map((sub) => (
                      <Link key={sub.href} href={sub.href}>
                        <Button
                          variant={
                            pathname === sub.href ? "secondary" : "ghost"
                          }
                          className={cn("w-full justify-start")}
                        >
                          {sub.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link className="" href={item.href!}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  className={`w-full justify-start flex items-center gap-4 h-11 ${
                    pathname === item?.href ? "bg-[#199FB1] text-white" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 w-full">
                    <span>{item.icon}</span>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                </Button>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
