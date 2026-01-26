import { Kanit } from "next/font/google"
import LiffLogin from "@/script/liff_login"
import Nav from "./components/nav"
import "./globals.css"
import "./style/icon.css"
import "./style/from.css"
import "./style/profile.css"
import "./style/admin.css"
import "./style/checkin.css"

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
