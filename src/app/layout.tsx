import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ReduxProvider } from "@/providers/redux-provider";
const inter = Inter({ subsets: ["latin"] });

//context
import { LanguageProvider } from "@/context/language-context";

export const metadata: Metadata = {
  title: "Chatbot",
  description: "Generated by create next app",
};

interface RootLayoutProps {
  children: React.ReactNode;

}





export default function RootLayout({
  children,

}: Readonly<RootLayoutProps>) {
  return (
    <html>
      <body className={inter.className + " backgroundimage"}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
          <div className="flex-grow">
            <LanguageProvider>
              <ReduxProvider>
                <Navbar />
                {children}
              </ReduxProvider>
            </LanguageProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
