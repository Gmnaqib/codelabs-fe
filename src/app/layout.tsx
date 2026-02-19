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
  title: 'CodeLabs Attendance',
  description: 'Attendance and management system for CodeLabs',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CodeLabs',
  },
  formatDetection: {
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${poppins.className} antialiased bg-secondary`}>
        <AuthProvider>
          <LayoutWrapper>
            <AutoTitle />
            {children}
            <Toaster />
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}