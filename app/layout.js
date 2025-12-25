import { Kanit } from "next/font/google"
import Nav from "./component/nav"
import "./globals.css"
import "./style/icon.css"
import "./style/from.css"

const kanit = Kanit({
  subsets: ["thai","latin"],
  weight: ["300","400","500","600","700"],
  variable: "--font-kanit",
})

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={kanit.className}>
        <Nav/>
        {children}
      </body>
    </html>
  )
}
