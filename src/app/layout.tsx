import type { Metadata } from "next";
import { Fraunces, Inter, Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import { Suspense } from "react";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BookNook",
    template: "%s · BookNook",
  },
  description: "BookNook is a cozy home for your books.",
};

/** Applies the saved theme before paint so dark mode never flashes. */
const themeScript = `(function(){try{var key="booknook-theme";var saved=localStorage.getItem(key);var dark=saved?saved==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(dark){document.documentElement.classList.add("dark");}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        inter.variable,
        fraunces.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <main className="flex flex-1 flex-col">
          <Suspense fallback={<div>The page is loading...</div>}>
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </Suspense>
        </main>
      </body>
    </html>
  );
}
