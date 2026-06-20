import CustomerShell from '@/components/layouts/CustomerShell';

export default function HelpLayout({ children }: { children: React.ReactNode }) {
    return <CustomerShell>{children}</CustomerShell>;
}
