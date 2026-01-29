import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "sonner";
import AutoTitle from "@/components/custom-ui/CustomTitle";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "Home | myCodeLabs",
    template: "%s | myCodeLabs",
  },
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
            <Toaster/>
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
