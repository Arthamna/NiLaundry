import CustomerShell from '@/components/layouts/CustomerShell';

// Admin (top-level) shell is currently a clone of the customer shell — replace
// with an admin-specific layout when navigation diverges.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <CustomerShell>{children}</CustomerShell>;
}
