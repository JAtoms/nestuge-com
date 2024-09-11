import {NextResponse} from "next/server";
import prismadb from "@/lib/prismadb";
import {auth} from "@clerk/nextjs/server";

interface Props {
    storeId: string;
}

export async function POST(req: Request, {params}: { params: Props }) {

    try {
        const {userId} = auth()
        const body = await req.json()

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        // Destructuring from body
        const {label, imageUrl} = body;
        if (!label) {
            return new NextResponse("Label is required", {status: 400})
        }
        if (!imageUrl) {
            return new NextResponse("ImageUrl is required", {status: 400})
        }
        if (!params.storeId) {
            return new NextResponse("StoreId is required", {status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorised", {status: 403})
        }

        const billboard = await prismadb.billboard.create({
            data: {
                label, imageUrl, storeId: params.storeId
            }
        })
        return NextResponse.json(billboard)
    } catch (error) {
        console.log('[BILLBOARDS_POST]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function GET(req: Request, {params}: { params: Props }) {

    try {

        const billboard = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        })
        return NextResponse.json(billboard)
    } catch (error) {
        console.log('[GET_POST]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}