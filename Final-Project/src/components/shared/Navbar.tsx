import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import HamburgerMenu from "./HamburgerMenu";

interface NavbarProps {
  showHamburgerMenu: boolean;
}

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
