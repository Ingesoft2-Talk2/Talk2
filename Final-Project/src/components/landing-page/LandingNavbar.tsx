import Link from "next/link";

/**
 * A simple navigation bar for the landing page.
 * Displays the application logo/title with a link to the home page.
 *
 * @component
 * @returns {JSX.Element} The rendered navigation bar.
 */
export default function NavBar() {
  return (
    <nav className="flex">
      <Link href="/">
        <h1 className="text-3xl font-semibold text-blue-600">Talk2</h1>
      </Link>
    </nav>
  );
}
