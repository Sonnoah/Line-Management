import { Kanit } from "next/font/google"
import Liff_login from "./component/liff_login"
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
        <Liff_login>
          <Nav/>
          {children}
        </Liff_login>
      </body>
    </html>
  )
}
