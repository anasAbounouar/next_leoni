import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
import { ClerkProvider} from '@clerk/nextjs'
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

import { Providers } from "./providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider  publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
    <html lang="en">     
      <body className={`${inter.className} min-h-screen flex flex-col`}>
          <Providers
             
          >
          <Navbar />
          <main className="flex-grow min-h-[87dvh]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
      </html>
     </ClerkProvider>
  );
}
