import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    BedDouble,
    Building2,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Home,
    LayoutDashboard,
    LogOut,
    MapPin,
    Menu,
    Settings,
    Star,
    UtensilsCrossed,
    X,
} from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

import AppLogoIcon from '@/components/app-logo-icon';

interface Village {
    id: number;
    name: string;
    slug: string;
    status: 'pending' | 'verified' | 'rejected';
}

interface Props {
    children: ReactNode;
    title?: string;
    village?: Village;
}

const navGroups = [
    {
        label: null,
        items: [
            {
                label: 'Dashboard',
                href: '/manager',
                icon: LayoutDashboard,
                exact: true,
            },
        ],
    },
    {
        label: 'Desa Saya',
        items: [
            {
                label: 'Profil Desa',
                href: '/manager/village/edit',
                icon: Building2,
            },
        ],
    },
    {
        label: 'Konten',
        items: [
            { label: 'Acara', href: '/manager/events', icon: CalendarDays },
            {
                label: 'Wisata & Atraksi',
                href: '/manager/attractions',
                icon: MapPin,
            },
            {
                label: 'Kuliner & UMKM',
                href: '/manager/culinaries',
                icon: UtensilsCrossed,
            },
            {
                label: 'Akomodasi',
                href: '/manager/accommodations',
                icon: BedDouble,
            },
        ],
    },
    {
        label: 'Komunitas',
        items: [
            { label: 'Ulasan Masuk', href: '/manager/reviews', icon: Star },
        ],
    },
];

const statusConfig = {
    verified: {
        label: 'Terverifikasi',
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
    },
    pending: {
        label: 'Menunggu Verifikasi',
        bg: 'bg-amber-100',
        text: 'text-amber-700',
    },
    rejected: { label: 'Ditolak', bg: 'bg-red-100', text: 'text-red-700' },
};

function NavItem({
    item,
    currentPath,
    collapsed,
}: {
    item: (typeof navGroups)[0]['items'][0];
    currentPath: string;
    collapsed: boolean;
}) {
    const isActive = item.exact
        ? currentPath === item.href
        : currentPath.startsWith(item.href);

    return (
        <Link
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                    ? 'bg-[var(--singgah-green-100)] text-[var(--singgah-green-700)]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            } ${collapsed ? 'justify-center' : ''}`}
        >
            <item.icon
                className="h-4.5 w-4.5 shrink-0"
                style={{ width: 18, height: 18 }}
            />
            {!collapsed && <span className="truncate">{item.label}</span>}
            {isActive && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--singgah-green-600)]" />
            )}
        </Link>
    );
}

export default function ManagerLayout({ children, title, village }: Props) {
    const { props } = usePage<any>();
    const flash = (props as any).flash as
        | { success?: string; error?: string }
        | undefined;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const currentPath =
        typeof window !== 'undefined' ? window.location.pathname : '/manager';
    const isOnSettings =
        typeof window !== 'undefined'
            ? window.location.pathname.startsWith('/settings')
            : false;

    // Show toast on flash messages
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const sidebarContent = (onClose?: () => void) => (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div
                className={`flex items-center border-b border-gray-100 px-4 py-4 ${collapsed ? 'justify-center' : 'justify-between'}`}
            >
                {!collapsed && (
                    <Link href="/" className="flex items-center gap-2">
                        <AppLogoIcon className="w-7" />
                        <span
                            className="font-bold text-[var(--singgah-green-700)]"
                            style={{ fontFamily: 'var(--font-jakarta)' }}
                        >
                            Singgah
                        </span>
                    </Link>
                )}
                {onClose ? (
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                ) : (
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
                        title={
                            collapsed ? 'Perluas sidebar' : 'Perkecil sidebar'
                        }
                    >
                        {collapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </button>
                )}
            </div>

            {/* Village Info */}
            {village && !collapsed && (
                <div
                    className="mx-3 mt-3 rounded-xl p-3"
                    style={{
                        background: 'var(--singgah-green-50)',
                        border: '1px solid var(--singgah-green-100)',
                    }}
                >
                    <p className="mb-0.5 text-xs font-medium text-gray-500">
                        Desa yang dikelola
                    </p>
                    <p className="truncate text-sm font-semibold text-gray-800">
                        {village.name}
                    </p>
                    <span
                        className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusConfig[village.status].bg} ${statusConfig[village.status].text}`}
                    >
                        {statusConfig[village.status].label}
                    </span>
                </div>
            )}

            {/* Nav */}
            <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
                {navGroups.map((group, gi) => (
                    <div key={gi}>
                        {group.label && !collapsed && (
                            <p className="mb-1 px-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                {group.label}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {group.items.map((item) => (
                                <NavItem
                                    key={item.href}
                                    item={item}
                                    currentPath={currentPath}
                                    collapsed={collapsed}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className={`space-y-0.5 border-t border-gray-100 p-3`}>
                <Link
                    href="/settings/profile"
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-gray-100 ${collapsed ? 'justify-center' : ''} ${isOnSettings ? 'bg-[var(--singgah-green-50)] text-[var(--singgah-green-700)]' : 'text-gray-600'}`}
                    title={collapsed ? 'Pengaturan' : undefined}
                >
                    <Settings
                        style={{ width: 18, height: 18 }}
                        className="shrink-0"
                    />
                    {!collapsed && 'Pengaturan'}
                </Link>
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-all hover:bg-red-50 ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? 'Keluar' : undefined}
                >
                    <LogOut
                        style={{ width: 18, height: 18 }}
                        className="shrink-0"
                    />
                    {!collapsed && 'Keluar'}
                </Link>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Head
                title={title ? `${title} — Singgah Manager` : 'Singgah Manager'}
            />

            {/* Desktop Sidebar */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-30 hidden flex-col border-r border-gray-100 bg-white shadow-sm transition-all duration-300 lg:flex ${
                    collapsed ? 'w-16' : 'w-64'
                }`}
            >
                {sidebarContent()}
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <div
                className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {sidebarContent(() => setSidebarOpen(false))}
            </div>

            {/* Main Content */}
            <div
                className={`flex min-h-screen w-full flex-1 flex-col overflow-x-hidden transition-all duration-300 ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}`}
            >
                {/* Mobile Topbar */}
                <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-100"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <AppLogoIcon className="w-6" />
                        <span className="text-sm font-bold text-[var(--singgah-green-700)]">
                            Singgah Manager
                        </span>
                    </div>
                    {title && (
                        <span className="ml-auto max-w-[140px] truncate text-sm font-medium text-gray-500">
                            {title}
                        </span>
                    )}
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
            </div>

            {/* Sonner Toaster */}
            <Toaster position="top-right" richColors closeButton />
        </div>
    );
}
