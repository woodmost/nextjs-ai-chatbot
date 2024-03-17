import Link from "next/link";

import React from "react";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

interface HeaderProps {
  children: React.ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  return (
    <header className="flex h-14 items-center gap-4 px-6 dark:bg-gray-800/40 lg:h-[60px]">
      <Link className="lg:hidden" href="#">
        <span className="sr-only">Home</span>
      </Link>
      <div className="flex flex-1 items-center space-x-4">
        <h1 className="text-lg font-semibold mr-auto">GPT-3.5</h1>
        <>
          {children}
          <SignedIn>
            {/* Mount the UserButton component */}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            {/* Signed out users get sign in button */}
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </>
      </div>
    </header>
  );
};

export default Header;
