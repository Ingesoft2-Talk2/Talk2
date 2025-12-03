import N8nChatWidget from "@/components/shared/N8nChatWidget";
import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";

/**
 * Layout for the home section of the application.
 * Includes the Navbar, Sidebar, and the main content area.
 * Also integrates the N8nChatWidget.
 *
 * @component
 * @param children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The rendered home layout.
 */
export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative">
      <Navbar showHamburgerMenu={true} />

      <div className="flex">
        <Sidebar />

        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
          <div className="w-full">{children}</div>
        </section>
      </div>
      <N8nChatWidget />
    </main>
  );
}
