/*
 * This file defines the HamburgerMenu component.
 * It provides a mobile-responsive navigation menu that slides in from the left.
 */

"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { sidebarLinks } from "@/utils/staticLinks";

/**
 * HamburgerMenu component for mobile navigation.
 * Manages the open/close state of the mobile menu.
 */
export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => setIsOpen(false);

  return (
    <section className="w-full max-w-[264px] text-black">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="sm:hidden cursor-pointer"
        aria-label="Abrir menú"
      >
        <Menu width={36} height={36} />
      </button>

      <div
        className={`fixed inset-0 z-50 flex transition-opacity duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/50 cursor-default"
        ></button>

        <div
          className={`relative z-10 w-[264px] bg-white h-full flex flex-col p-4 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Link
            href="/"
            className="flex items-center gap-2 mb-6"
            onClick={handleLinkClick}
          >
            <p className="text-[26px] font-extrabold text-blue-600">Talk2</p>
          </Link>

          <nav className="flex flex-col gap-3 overflow-y-auto">
            {sidebarLinks.map((item) => {
              const isActive = pathname === item.route;
              const Icon = item.icon;

              return (
                <Link
                  href={item.route}
                  key={item.label}
                  onClick={handleLinkClick}
                  className={`flex gap-4 items-center p-4 rounded-lg w-full max-w-60 hover:bg-blue-200 transition ${
                    isActive ? "bg-blue-200" : ""
                  }`}
                >
                  <Icon size={24} />
                  <p className="font-semibold">{item.label}</p>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-xl cursor-pointer"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
      </div>
    </section>
  );
}
