import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/redux/provider"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AmazonClone - Tu tienda online",
  description: "MVP de una tienda virtual similar a Amazon",
  metadataBase: new URL("https://amazonclone.vercel.app"),
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
