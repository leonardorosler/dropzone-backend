import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "DropZone",
  description: "Streetwear brasileiro",
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="pt-BR"><body><AuthProvider>{children}</AuthProvider></body></html>;
}
