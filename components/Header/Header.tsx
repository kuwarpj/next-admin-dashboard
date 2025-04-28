"use client";

import { Search } from "lucide-react";
import { Input } from "../ui/input";

export function Header() {
  return (
    <header className="h-[110px] bg-white dark:bg-gray-800 shadow flex items-center px-6">
      <div className="flex flex-row justify-around w-full">
        <div className="w-[388px]">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="text" placeholder="Search..." className="pl-10" />
          </div>
        </div>

        <div className="flex items-center justify-between w-[277px]">
          <div>
            <img src={"/image/bell.png"} />
          </div>
          <div className="flex gap-4">
            <div className="w-[44px] h-[44px] overflow-hidden rounded-full">
              <img src={"/image/profile.png"} />
            </div>

            <div className="flex flex-col ">
              <span className="text-base font-bold text-[#404040]">Kalyani Kumari</span>
              <span className="text-sm font-semibold text-[#565656]">Owner</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
