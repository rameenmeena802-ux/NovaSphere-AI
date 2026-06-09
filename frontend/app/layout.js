import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import Toast from "../components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Novasphere AI Universe - 3D Multi-Agent Network",
  description: "An immersive, next-generation 3D platform for distributed cognitive agents, sub-atomic visual simulations, and decentralized neural networks.",
  keywords: ["Artificial Intelligence", "3D Web", "Multi-Agent System", "Neural Networks", "Quantum Simulation", "Next.js"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#030014] text-white selection:bg-cyber-cyan/35 selection:text-white">
        <AuthProvider>
          <SocketProvider>
            <Navbar />
            <main className="flex-grow pt-20 flex flex-col">
              {children}
            </main>
            <Footer />
            <Toast />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
