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
        {/* Background gradient */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            background: "linear-gradient(135deg, #ede9fe 0%, #dbeafe 40%, #cffafe 70%, #d1fae5 100%)",
          }}
        />
        {/* Decorative blobs */}
        <div
          style={{
            position: "fixed",
            top: "-120px",
            left: "-120px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 70%)",
            zIndex: -1,
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: "-150px",
            right: "-100px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.30) 0%, transparent 70%)",
            zIndex: -1,
            filter: "blur(50px)",
          }}
        />
        <div
          style={{
            position: "fixed",
            top: "40%",
            left: "55%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(110,231,183,0.25) 0%, transparent 70%)",
            zIndex: -1,
            filter: "blur(40px)",
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
