"use client";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2 md:py-0">
      <div className="container mx-auto flex items-center justify-between h-auto md:h-16">
        <Link
          href="/"
          className="flex flex-row items-center gap-1 md:gap-3 cursor-pointer"
        >
          <Image
            src="/logo.png"
            alt="WORDSMITH logo"
            width={64}
            height={64}
            className="w-11 h-11 md:w-16 md:h-16 object-contain"
          />
          <span className="font-display text-2xl md:text-3xl font-bold text-gradient leading-tight md:leading-none">
            WORDSMITH
          </span>
        </Link>
        <nav className="flex items-center">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
