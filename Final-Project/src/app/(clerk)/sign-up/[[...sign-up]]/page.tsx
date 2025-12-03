import { SignUp } from "@clerk/nextjs";

/**
 * Page for user sign-up.
 * Renders the Clerk SignUp component centered on the screen.
 *
 * @component
 * @returns {JSX.Element} The rendered sign-up page.
 */
export default function SignUpPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignUp />
    </main>
  );
}
