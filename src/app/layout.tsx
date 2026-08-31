import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/context";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { LiveSimulatorBar } from "@/components/simulation/LiveSimulatorBar";
import { BookingDetailDrawer } from "@/components/bookings/BookingDetailDrawer";
import { CreateBookingModal } from "@/components/bookings/CreateBookingModal";

export const metadata: Metadata = {
  title: "Instant Mechanic - Live Operations SaaS Dashboard",
  description:
    "Production-grade Live Vehicle Service Operations Dashboard for Instant Mechanic. Real-time fleet tracking, booking dispatch, telematics, and financial analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-zinc-100 min-h-screen flex flex-col font-sans">
        <AppProvider>
          <Navbar />
          <LiveSimulatorBar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#090d16]/90">
              <div className="mx-auto max-w-7xl">{children}</div>
            </main>
          </div>
          {/* Global Drawers & Modals */}
          <BookingDetailDrawer />
          <CreateBookingModal />
        </AppProvider>
      </body>
    </html>
  );
}
