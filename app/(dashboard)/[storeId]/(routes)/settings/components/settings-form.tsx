'use client'

import {Store} from "@prisma/client";
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
import ApiAlert from "@/components/ui/api-alert";
import {useOrigin} from "@/hooks/use-origin";


interface Props {
    initialData: Store
}

const formSchema = zods.object({
    name: zods.string().min(1, 'Store name is required')
})

type SettingsFormValues = zods.infer<typeof formSchema>

export default function SettingsForm({initialData}: Props) {
    const params = useParams()
    const router = useRouter()
    const origin = useOrigin()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })
    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh()
            toast.success('Store updated')
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
            await axios.delete(`/api/stores/${params.storeId}`)
            toast.success('Store deleted')
            router.refresh()
        } catch (error) {
            toast.error('Make sure all products and categories are removed first.')
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
                <Heading title={'Settings'} description={'Manage store preferences'}/>
                <Button
                    variant={'destructive'}
                    onClick={() => setOpen(true)}
                    disabled={loading}
                    size={'sm'}>
                    <Trash className={'h-4 w-4'}/>
                </Button>
            </div>
            <Separator/>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={'space-y-8 w-full'}
                    action="">
                    <div className={'grid grid-cols-3 gap-8'}>
                        <FormField control={form.control} name={'name'} render={({field}) => (
                            <FormItem>
                                <FormLabel> Name </FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder={'Store name'} {...field}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                    </div>
                    <Button
                        disabled={loading}
                        className={'ml-auto'}
                        type={'submit'}>
                        Save changes
                    </Button>
                </form>
            </Form>
            <Separator/>
            <ApiAlert title={'NEXT_PUBLIC_API_URL'} description={`${origin}/api/${params.storeId}`} variant={'public'}/>
        </>
    );
}