import React from "react";
import prismadb from "@/lib/prismadb";
import BillboardForm from "@/app/(dashboard)/[storeId]/(routes)/billboards/[billboardId]/components/billboard-form";

interface Props {
    params: { billboardId: string }
}

export default async function BillboardPage({params}: Props) {

    const billboards = await prismadb.billboard.findUnique({
        where: {id: params.billboardId}
    })

    return (
        <div className={'flex-col '}>
            <div className={'flex-1 space-y-4 p-8 pt-6'}>
                <BillboardForm initialData={billboards}/>
            </div>
        </div>
    );
}


