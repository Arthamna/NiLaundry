// Demo staff data mirrors the Figma design (nodes 364:4789 / 466:2760 / 422:5078) one-for-one.

export interface Staff {
    id: string;
    name: string;
    initials: string;
    branch: string;
    email: string;
    phone: string;
    address: string;
    /** Avatar background / text colors taken verbatim from the Figma rows. */
    avatarBg: string;
    avatarText: string;
}

export const STAFF: Staff[] = [
    {
        id: 'ahmad-fauzi',
        name: 'Ahmad Fauzi',
        initials: 'AF',
        branch: 'Keputih',
        email: 'halo@gmail.com',
        phone: '+62 812-3456-7890',
        address: 'Jalan Keputih Perlimaan',
        avatarBg: '#6df5e1',
        avatarText: '#006f64',
    },
    {
        id: 'siti-rahayu',
        name: 'Siti Rahayu',
        initials: 'SR',
        branch: 'Keputih',
        email: 'halo@gmail.com',
        phone: '+62 813-4567-8901',
        address: 'Jalan Keputih Perlimaan',
        avatarBg: '#e0f2fe',
        avatarText: '#0369a1',
    },
    {
        id: 'budi-santoso',
        name: 'Budi Santoso',
        initials: 'BS',
        branch: 'Keputih',
        email: 'halo@gmail.com',
        phone: '+62 814-5678-9012',
        address: 'Jalan Keputih Perlimaan',
        avatarBg: '#fef3c6',
        avatarText: '#b45309',
    },
    {
        id: 'dewi-kusuma',
        name: 'Dewi Kusuma',
        initials: 'DK',
        branch: 'Keputih',
        email: 'halo@gmail.com',
        phone: '+62 815-6789-0123',
        address: 'Jalan Keputih Perlimaan',
        avatarBg: '#e5e9e7',
        avatarText: '#3e4947',
    },
    {
        id: 'eko-prasetyo',
        name: 'Eko Prasetyo',
        initials: 'EP',
        branch: 'Keputih',
        email: 'halo@gmail.com',
        phone: '+62 816-7890-1234',
        address: 'Jalan Keputih Perlimaan',
        avatarBg: '#ede9fe',
        avatarText: '#6d28d9',
    },
    {
        id: 'fitriani',
        name: 'Fitriani',
        initials: 'FT',
        branch: 'Keputih',
        email: 'halo@gmail.com',
        phone: '+62 817-8901-2345',
        address: 'Jalan Keputih Perlimaan',
        avatarBg: '#fce7f3',
        avatarText: '#be185d',
    },
    {
        id: 'gunawan',
        name: 'Gunawan',
        initials: 'GW',
        branch: 'Keputih',
        email: 'halo@gmail.com',
        phone: '+62 818-9012-3456',
        address: 'Jalan Keputih Perlimaan',
        avatarBg: '#d1fae5',
        avatarText: '#065f46',
    },
];

export const BRANCHES: string[] = ['Keputih', 'Sukolilo', 'Gebang', 'Mulyosari'];

export function findStaff(id: string): Staff | undefined {
    return STAFF.find((s) => s.id === id);
}
