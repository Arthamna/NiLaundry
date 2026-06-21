import BranchShell from '@/components/layouts/BranchShell';

export default function BranchLayout({ children }: { children: React.ReactNode }) {
    return <BranchShell>{children}</BranchShell>;
}
