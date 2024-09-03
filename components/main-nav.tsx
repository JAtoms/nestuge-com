'use client'
import React from "react";
import {cn} from "@/lib/utils";
import {useParams, usePathname, useRouter} from "next/navigation";
import Link from "next/link";

interface HandleClickParams {
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>;
    path: string;
}

export default function MainNav({className, ...props}: React.HTMLAttributes<HTMLElement>) {
    const pathName = usePathname()
    const params = useParams()
    const router = useRouter();
    const routes = [
        {
            href: `/${params.storeId}/`,
            label: 'Dashboard',
            active: pathName === `/${params.storeId}/`
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Settings',
            active: pathName === `/${params.storeId}/settings`
        }
    ]

    const handleClick = ({event, path}: HandleClickParams) => {
        event.preventDefault(); // Prevent default link behavior
        pathName === path
            ? router.refresh()
            : router.push(path)
    };

    return (
        <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
            {routes.map((route) => (
                <Link
                    key={route.label}
                    href={route.href}
                    onClick={(event) => handleClick({event: event, path: route.href})}
                    className={cn('text-sm font-medium transition-colors hover:text-primary',
                        route.active ? 'text-black dark:text-white' : 'text-muted-foreground')}>
                    {route.label}
                </Link>
            ))}
        </nav>
    );
}