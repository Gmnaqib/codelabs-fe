import { Poppins } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "sonner";
import AutoTitle from "@/components/custom-ui/CustomTitle";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CodeLabs Attendance",
  description: "Attendance and management system for CodeLabs",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CodeLabs",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased bg-secondary`}>
        <AuthProvider>
          <LayoutWrapper>
            <AutoTitle />
              {children}
            <Toaster richColors />
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}