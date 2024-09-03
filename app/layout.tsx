import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {ClerkProvider} from "@clerk/nextjs";

import ModalProvider from "@/providers/modal-provider";

import "./globals.css";
import ToastProvider from "@/providers/toast-provider";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Admin",
    description: "Admin dashboard",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {

    return (
        <ClerkProvider afterSignOutUrl={'/'}>
            <html lang="en">
            <body className={inter.className}>
            <ModalProvider/>
            <ToastProvider/>
            {children}</body>
            </html>
        </ClerkProvider>
    );
}
