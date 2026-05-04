import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import AppLayout from '@/layouts/app-layout';
import ManagerLayout from '@/layouts/ManagerLayout';
import type { Auth, BreadcrumbItem } from '@/types';

interface Props {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

/**
 * A smart layout wrapper for settings pages.
 *
 * Renders the correct panel sidebar (Admin, Manager, or default)
 * based on the authenticated user's role, so the settings pages
 * maintain consistent navigation with the rest of the panel.
 */
export default function SettingsPageLayout({ children, breadcrumbs }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const role = auth?.user?.role;

    if (role === 'admin') {
        return (
            <AdminLayout title="Pengaturan">
                {children}
            </AdminLayout>
        );
    }

    if (role === 'manager') {
        return (
            <ManagerLayout title="Pengaturan">
                {children}
            </ManagerLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {children}
        </AppLayout>
    );
}
