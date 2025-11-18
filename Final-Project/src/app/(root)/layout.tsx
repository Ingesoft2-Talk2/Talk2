import { ToastContainer } from "react-toastify";
import StreamVideoProvider from "@/providers/StreamClientProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <StreamVideoProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={false}
          limit={3}
        />
        {children}
      </StreamVideoProvider>
    </main>
  );
}
