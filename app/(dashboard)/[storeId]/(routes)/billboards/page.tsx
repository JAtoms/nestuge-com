import BillboardClient from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/client";
import prismadb from "@/lib/prismadb";

interface Props {
    storeId: string;
}

export default async function BillboardPage({params}: { params: Props }) {
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return (
        <div className={'flex-col'}>
            <div className={'flex-1 space-y-4 p-8 pt-6'}>
                <BillboardClient data = {billboards}/>
            </div>
        </div>
    );
}