'use client'

import Modal from "@/components/ui/modal";
import {useStoreModal} from "@/hooks/use-store-modal";
import * as zods from 'zod'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";

const formSchema = zods.object({
    name: zods.string().min(1, 'Store name is required'),
})

export default function StoreModal() {
    const storeModal = useStoreModal()
    const [loading, setLoading] = useState(false)
    const form = useForm<zods.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const onSubmit = async (values: zods.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            const response = await axios.post('/api/stores', values)

            // This refreshes the page giving room for newly created store to be loaded
            window.location.assign(`/${response.data.id}`)
            toast.success('Store created')
        } catch (error) {
            toast.error('Something went wrong.')
        } finally {
            setLoading(false)
        }
    }
    return (
        <Modal
            title={'Create store'}
            description={'Just describing'}
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}>
            <div>
                <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name={'name'}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder={'E-Commerce'} {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className={'pt-6 space-x-2 flex items-center justify-end w-full'}>
                                <Button
                                    disabled={loading}
                                    variant={'outline'}
                                    onClick={storeModal.onClose}
                                > Cancel </Button>
                                <Button
                                    disabled={loading}
                                    type={'submit'}> Continue </Button>
                            </div>
                        </form>
                    </Form>

            </div>
        </Modal>
    );
}