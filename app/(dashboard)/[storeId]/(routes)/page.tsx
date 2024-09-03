import React from "react";
import prismadb from "@/lib/prismadb";
import {redirect} from "next/navigation";

interface Props {
    params: { storeId: string }
}

export default async function DashboardPage({params}: Props) {

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId
        }
    })

    if (!store) redirect('/')
    return (
        <div>
            Active store: {store?.name}
        </div>
    );
}