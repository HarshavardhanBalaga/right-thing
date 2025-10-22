import { Exo_2, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const exo2 = Exo_2({
  subsets: ['latin'], // required
  weight: ['400', '500', '700'], // optional - you can specify weights
  display: 'swap', // recommended for better performance
  variable: '--font-exo2', // optional CSS variable name
});

export const metadata = {
  title: "Right. Thing - Make it the Right Moment",
  description: "The Right Thing to organise your self",
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${exo2.variable} ${exo2.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
