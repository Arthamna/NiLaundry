import CustomerShell from '@/components/layouts/CustomerShell';

// Superadmin shell is currently a clone of the customer shell — replace with
// a superadmin-specific layout when navigation diverges.
export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
    return <CustomerShell>{children}</CustomerShell>;
}
