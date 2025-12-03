import { SignIn } from "@clerk/nextjs";

/**
 * Page for user sign-in.
 * Renders the Clerk SignIn component centered on the screen.
 *
 * @component
 * @returns {JSX.Element} The rendered sign-in page.
 */
export default function SiginInPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignIn />
    </main>
  );
}
