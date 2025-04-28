
import "../globals.css";

import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Header } from "@/components/Header/Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col relative">
          <div
            className="absolute inset-0 bg-no-repeat bg-top bg-cover"
            style={{
              backgroundImage: "url('/image/Vector.png')",
              height: "482px",
              zIndex: 0,
            }}
          />

          <div className="relative z-10">
            <Header />
          </div>

          <main className="relative flex-1 p-4 z-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
