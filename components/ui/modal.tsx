"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
    DialogTitle
} from "@/components/ui/dialog";

interface ModalProps {
    title: string
    description: string
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

export default function Modal({title, description, isOpen, onClose, children}: ModalProps) {
    const onChange = (open: boolean) => {
        if (!open) onClose()
    }
    return (
        <Dialog
            open={isOpen}
            onOpenChange={onChange}>
            <DialogOverlay className={'bg-white bg-opacity-5'} />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}