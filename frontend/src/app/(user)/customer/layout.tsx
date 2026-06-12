import CustomerShell from '@/components/layouts/CustomerShell';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return <CustomerShell>{children}</CustomerShell>;
}
