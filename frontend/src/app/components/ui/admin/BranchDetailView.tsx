'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';

import AnalysisCards from '@/components/ui/admin/AnalysisCards';
import BranchReviewSection from '@/components/ui/admin/BranchReviewSection';
import BranchServicesTable from '@/components/ui/admin/BranchServicesTable';
import ServiceModal from '@/components/ui/admin/ServiceModal';
import StaffTable from '@/components/ui/admin/StaffTable';
import AddStaffModal from '@/components/ui/admin/AddStaffModal';
import { STAFF } from '@/components/ui/admin/staffData';
import { Branch, BRANCH_SERVICES, BranchService } from '@/components/ui/admin/branchData';

type Tab = 'Performance' | 'Staff' | 'Services';
type ModalState =
    | null
    | { type: 'addStaff' }
    | { type: 'addService' }
    | { type: 'editService'; service: BranchService };

const TABS: Tab[] = ['Performance', 'Staff', 'Services'];

// Branch detail page with Performance / Staff / Services tabs (Figma nodes 466:5705 / 466:6413 / 466:7108).
export default function BranchDetailView({ branch }: { branch: Branch }) {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('Performance');
    const [modal, setModal] = useState<ModalState>(null);

    const closeModal = () => setModal(null);

    return (
        <div className="flex w-full flex-col gap-[24px] p-[40px]">
            {/* Back button */}
            <button
                type="button"
                onClick={() => router.push('/admin/branches')}
                className="flex h-[40px] w-fit items-center gap-[6px] rounded-full bg-[#f41313] px-[12px] py-[5px] text-[16px] font-semibold text-white transition-colors hover:bg-[#d40f0f]"
            >
                <ArrowLeft size={18} className="shrink-0" />
                Kembali
            </button>

            {/* Title + tabs */}
            <div className="flex flex-col gap-[8px]">
                <h1 className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#181c1c]">
                    {branch.name} Branch
                </h1>
                <div className="flex items-center border-b border-[#e0e3e1]">
                    {TABS.map((t) => {
                        const isActive = tab === t;
                        return (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setTab(t)}
                                className={`px-[16px] py-[9px] text-[14px] font-semibold transition-colors ${
                                    isActive
                                        ? 'border-b-[2px] border-[#181c1c] text-[#181c1c]'
                                        : 'text-[#6e7977] hover:text-[#3e4947]'
                                }`}
                            >
                                {t}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Performance */}
            {tab === 'Performance' && (
                <div className="flex flex-col gap-[24px]">
                    <div className="flex flex-col gap-[16px]">
                        <h2 className="text-[24px] leading-[32px] font-bold tracking-[-0.6px] text-[#181c1c]">
                            Analysis
                        </h2>
                        <AnalysisCards />
                    </div>
                    <BranchReviewSection />
                </div>
            )}

            {/* Staff */}
            {tab === 'Staff' && (
                <div className="flex flex-col gap-[20px]">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setModal({ type: 'addStaff' })}
                            className="flex items-center gap-[8px] rounded-[8px] bg-[#005c55] px-[16px] py-[9px] text-[14px] leading-[20px] font-semibold text-white transition-colors hover:bg-[#00514b]"
                        >
                            <Plus size={16} className="shrink-0" />
                            Tambah Staff
                        </button>
                    </div>
                    <StaffTable staff={STAFF} title={`Staff ${branch.name} Branch`} />
                </div>
            )}

            {/* Services */}
            {tab === 'Services' && (
                <div className="flex flex-col gap-[20px]">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setModal({ type: 'addService' })}
                            className="flex items-center gap-[8px] rounded-[8px] bg-[#005c55] px-[16px] py-[9px] text-[14px] leading-[20px] font-semibold text-white transition-colors hover:bg-[#00514b]"
                        >
                            <Plus size={16} className="shrink-0" />
                            Tambah Service
                        </button>
                    </div>
                    <BranchServicesTable
                        branchName={branch.name}
                        services={BRANCH_SERVICES}
                        onRowClick={(service) => setModal({ type: 'editService', service })}
                    />
                </div>
            )}

            {/* Modals */}
            {modal?.type === 'addStaff' && <AddStaffModal onClose={closeModal} />}
            {modal?.type === 'addService' && <ServiceModal mode="add" onClose={closeModal} />}
            {modal?.type === 'editService' && (
                <ServiceModal mode="edit" service={modal.service} onClose={closeModal} />
            )}
        </div>
    );
}
