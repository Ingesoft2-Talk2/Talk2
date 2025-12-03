/*
 * This file defines the Navbar component.
 * It renders the top navigation bar, including the logo, user profile button, and mobile menu trigger.
 */

import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import HamburgerMenu from "./HamburgerMenu";

interface NavbarProps {
  /**
   * Boolean to control the visibility of the hamburger menu on smaller screens.
   */
  showHamburgerMenu: boolean;
}

/**
 * Navbar component for the application.
 * Displays the app logo and user controls.
 *
 * @param showHamburgerMenu - Prop to conditionally render the hamburger menu.
 */
export default function Navbar({ showHamburgerMenu }: NavbarProps) {
  return (
    <nav className="flex justify-between items-center fixed z-50 w-full px-6 py-4 lg:px-10 bg-white">
      <Link href="/" className="flex items-center gap-1">
        <p className="text-[26px] font-extrabold text-blue-600">Talk2</p>
      </Link>

      <div className="flex justify-between items-center gap-5">
        <SignedIn>
          <UserButton />
        </SignedIn>

        {showHamburgerMenu && <HamburgerMenu />}
      </div>
    </nav>
  );
}
