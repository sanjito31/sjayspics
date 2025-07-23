import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"
import "./globals.css";
// import { Toaster } from "sonner";
// import { ThemeProvider } from "@/components/theme-provider";

const ibmSans = IBM_Plex_Sans({
  variable: "--font-IBM-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"]
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-IBM-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  title: "sanjays pics",
  description: "An EXIF photo portfolio for the photography of Sanjay Kumar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${ibmSans.variable} ${ibmMono.variable} 
                    antialiased
                    dark
                    bg-background`}
      >
        {/* <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          > */}
          {children}

        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
