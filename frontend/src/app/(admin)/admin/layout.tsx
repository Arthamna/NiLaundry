import CustomerShell from '@/components/layouts/CustomerShell';

// Admin shell is currently a clone of the customer shell — replace with an
// admin-specific layout when admin navigation diverges.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <CustomerShell>{children}</CustomerShell>;
}
