import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex">
      <Link href="/">
        <h1 className="text-3xl font-semibold text-blue-600">Talk2</h1>
      </Link>
    </nav>
  );
}
