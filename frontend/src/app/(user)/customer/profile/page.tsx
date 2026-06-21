import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import ProfileContent from '@/components/ui/customer/ProfileContent';

export default function ProfilePage() {
    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader />
            <ProfileContent />
        </div>
    );
}
