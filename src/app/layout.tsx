import type { Metadata } from "next";
import { pageMetadata, SEO_NAME, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/seo";
import {  Rubik } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import NavBar from "@/components/NavBar";
import Footer from "@/components/landing/Footer";
import Container from "@/components/Container";
import { Toaster } from "sonner";
import MobileNavBar from "@/components/MobileNavBar";

const rubik = Rubik({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...pageMetadata(SITE_TITLE, SITE_DESCRIPTION, "/"),
  metadataBase: SITE_URL,
  applicationName: SITE_TITLE,
  authors: [{ name: SEO_NAME, url: SITE_URL.href }],
  creator: SEO_NAME,
  keywords: [SEO_NAME, "AI Design Engineer", "Design Engineer", "User Experience", "Frontend Development", "Full Stack Development", "Portfolio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${rubik.className} bg-neutral-100 antialiased [--pattern-fg:var(--color-gray-950)]/5 dark:bg-black dark:[--pattern-fg:var(--color-white)]/10`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="max-md:hidden">
            <NavBar />
          </div>
          <div className="md:hidden">
            <MobileNavBar/>
          </div>

          {children}
          <Container className="px-0 pt-0 md:px-0 max-md:pt-0" >
            <div className="mx-auto block h-[2px] w-full bg-muted" />
            <div className="x-4 md:px-10">
              <Footer />
            </div>
          </Container>
        </ThemeProvider>
        <Toaster position="top-center" closeButton  richColors />
      </body>
    </html>
  );
}
