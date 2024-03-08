import Link from "next/link";

import React from "react";

import { HomeIcon } from "@radix-ui/react-icons";

import MessageCircleIcon from "@/components/icon/MessageCircleIcon";
import Package2Icon from "@/components/icon/Package2Icon";

const SideNavbar = () => {
  return (
    <aside className="w-64 bg-gray-100/40 dark:bg-gray-800/40 border-r">
      <div className="flex flex-col gap-2">
        <div className="flex h-[60px] items-center px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <Package2Icon className="h-6 w-6" />
            <span className="">AI Assistant</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-4 text-sm font-medium">
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="/"
            >
              <HomeIcon className="w-4 h-4" />
              Home
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
              href="/"
            >
              <MessageCircleIcon className="w-4 h-4" />
              AI Chat
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default SideNavbar;
