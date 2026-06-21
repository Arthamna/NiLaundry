export type AvatarTone = 'mint' | 'teal' | 'gray' | 'pink' | 'purple' | 'blue' | 'amber' | 'green';

// Exact Figma fills for the circular avatars (dashboard node 347:3676, staff node 347:1742).
export const AVATAR_TONES: Record<AvatarTone, string> = {
    mint: 'bg-[#6df5e1] text-[#006f64]',
    teal: 'bg-[#0f766e] text-white',
    gray: 'bg-[#e5e9e7] text-[#3e4947]',
    pink: 'bg-[#fce7f3] text-[#be185d]',
    purple: 'bg-[#ede9fe] text-[#6d28d9]',
    blue: 'bg-[#e0f2fe] text-[#0369a1]',
    amber: 'bg-[#fef3c6] text-[#b45309]',
    green: 'bg-[#d1fae5] text-[#065f46]',
};
