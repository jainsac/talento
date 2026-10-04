import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talento — India's Digital Competition Network",
  description: "Discover, enter and win talent competitions across India."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}