import type { Metadata } from "next";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/ui/page-header";
import "./globals.css";

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
        className={`antialiased bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen`}
      >
        <PageHeader>
          <PageHeaderHeading className="rainbow-text">
            AweDashboard
          </PageHeaderHeading>
          <PageHeaderDescription>{metadata.description as string}</PageHeaderDescription>
        </PageHeader>
        {children}
      </body>
    </html>
  );
}
