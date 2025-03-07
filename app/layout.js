import { Nabla, Doto, Silkscreen } from "next/font/google";
import "./globals.css";

const nabla = Nabla({ subsets: ['latin'] })
const doto = Doto({ subsets: ['latin'] })

export const metadata = {
  title: "Fun.Pump",
  description: "Create token listings",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     <body className={`${nabla.className} ${doto.className}`}>
        {children}
      </body>
    </html>
  );
}
