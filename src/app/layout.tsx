import type { Metadata } from "next";
import "./../styles/globals.css";

export const metadata: Metadata = {
  title: "Current Lease Deals — Updated Monthly",
  description: "Find current car lease deals by monthly payment, make, type, MPG/MPGe, drivetrain, term and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
