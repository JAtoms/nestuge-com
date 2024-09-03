import React from "react";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

interface Props {
    children: React.ReactNode
    params: { storeId: string }
}

export default async function DashboardLayout({children, params}: Props) {
    const {userId} = auth()
    if (!userId) redirect('/sign-in')

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId: userId
        }
    })
    if (!store) redirect('/')
    return (
        <div>
            <Navbar/>
            {children}
        </div>
    );
}