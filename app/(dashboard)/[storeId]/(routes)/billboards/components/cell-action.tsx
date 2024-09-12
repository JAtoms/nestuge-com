'use client'

import {BillboardColumn} from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/columns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Copy, Edit, MoreHorizontal, Trash} from "lucide-react";
import toast from "react-hot-toast";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import {useState} from "react";
import AlertModal from "@/components/modals/alert-modal";

interface Props {
    data: BillboardColumn
}

export default function CellAction({data}: Props) {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onCopy = () => navigator.clipboard.writeText(data.id)
        .then(r => toast.success("Billboard id copied to clipboard."))

    const onDelete = async () => {
        try {
            console.log(`logo: /api/${params.storeId}/billboards/${data.id}`);

            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`)
            toast.success('Billboard deleted')
            router.refresh()

        } catch (error) {
            toast.error('Make sure all categories are removed using this billboard first.')
            setLoading(false)
            setOpen(false)
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                loading={loading}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}/>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'ghost'} className={'h-8 w-8 p-0'}>
                        <span className={'sr-only'}>Open Menu</span>
                        <MoreHorizontal className={'h-4 w-4'}/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={'end'}>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className={'cursor-pointer'}
                                      onClick={() => router.push(`/${params.storeId}/billboards/${data.id}`)}>
                        <Edit className={'mr-2 h-4 w-4'}/>
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem className={'cursor-pointer'} onClick={onCopy}>
                        <Copy className={'mr-2 h-4 w-4'}/>
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem className={'cursor-pointer'} onClick={() => setOpen(true)}>
                        <Trash className={'mr-2 h-4 w-4'}/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>

    );
}