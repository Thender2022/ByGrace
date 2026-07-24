import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/CartSidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";  // ← Add this import
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skate Shop | Luxury Collection",
  description: "Premium skateboards, parts, and apparel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />  {/* ← Add this line */}
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}