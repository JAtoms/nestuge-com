'use client'

import {Billboard} from "@prisma/client";
import Heading from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import * as zods from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";


interface Props {
    initialData: Billboard | null
}

const formSchema = zods.object({
    label: zods.string().min(1, 'Label name is required'),
    imageUrl: zods.string().min(1, 'Image is required')
})

type BillboardFormValues = zods.infer<typeof formSchema>

export default function BillboardForm({initialData}: Props) {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? 'Edit billboard' : 'Create billboard'
    const description = initialData ? 'Edit a billboard' : 'Add a new billboard'
    const toastMessage = initialData ? 'Billboard updated' : 'Billboard created'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: '',
        }
    })
    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true)
            initialData ?
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
                : await axios.post(`/api/${params.storeId}/billboards`, data)
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error('Something went wrong')
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            toast.success('Billboard deleted')
            router.push(`/${params.storeId}/billboards`)
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

            <div className={'flex items-center justify-between'}>
                <Heading title={title} description={description}/>

                {initialData && (
                    <Button
                        variant={'destructive'}
                        onClick={() => setOpen(true)}
                        disabled={loading}
                        size={'sm'}>
                        <Trash className={'h-4 w-4'}/>
                    </Button>
                )}

            </div>
            <Separator/>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={'space-y-8 w-full'}
                    action="">
                    <FormField control={form.control} name={'imageUrl'} render={({field}) => (
                        <FormItem>
                            <FormLabel> Background image </FormLabel>
                            <FormControl>
                                <ImageUpload onChange={(url) => field.onChange(url)}
                                             onRemove={() => field.onChange('')}
                                             disabled={loading}
                                             value={field.value ? [field.value] : []}/>
                            </FormControl>
                        </FormItem>
                    )}/>
                    <div className={'grid grid-cols-3 gap-8'}>
                        <FormField control={form.control} name={'label'} render={({field}) => (
                            <FormItem>
                                <FormLabel> Label </FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder={'Billboard label'} {...field}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                    </div>
                    <Button
                        disabled={loading}
                        className={'ml-auto'}
                        type={'submit'}>
                        {action}
                    </Button>
                </form>
            </Form>
            <Separator/>

        </>
    );
}