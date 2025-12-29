import { Kanit } from "next/font/google"
import LiffLogin from "@/lib/liff_login"
import Nav from "./component/nav"
import "./globals.css"
import "./style/icon.css"
import "./style/from.css"
import "./style/profile.css"

const kanit = Kanit({
  subsets: ["thai","latin"],
  weight: ["300","400","500","600","700"],
  variable: "--font-kanit",
})

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={kanit.className}>
        <LiffLogin>
          <Nav/>
          {children}
        </LiffLogin>
      </body>
    </html>
  )
}
