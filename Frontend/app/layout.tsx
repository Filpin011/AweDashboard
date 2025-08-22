import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/ui/page-header";
import "./globals.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AweDashboard",
  description: "This is your dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        />
        <PageHeader>
        <PageHeaderHeading>{"AweDashboard"}</PageHeaderHeading>
        <PageHeaderDescription>{metadata.description}</PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            
            <a href="#themes"><PlusIcon/>Add a new link</a>
          </Button>
        </PageActions>
      </PageHeader>
        {children}
      </body>
    </html>
  );
}
