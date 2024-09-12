import React from "react";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import prismadb from "@/lib/prismadb";

interface Props {
    children: React.ReactNode
}

export default async function SetupLayout({children}: Props) {

    const {userId} = auth()
    if (!userId) redirect('/sign-in')

    const billboard = prismadb.billboard

    const store = await prismadb.store.findFirst({
        where: {userId}
    })

    if (store) redirect(`/${store.id}`)

    return (
        <>
            {children}
        </>
    );
}