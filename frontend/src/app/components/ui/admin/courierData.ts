// Demo courier data mirrors the Figma design (nodes 120:6045 / 466:3920 / 466:4137) one-for-one.

export interface Courier {
    id: string;
    name: string;
    initials: string;
    /** Plate number, e.g. "B 4421 KZA". */
    plate: string;
    /** Vehicle type, e.g. "Motor" / "Mobil". */
    vehicleType: string;
    phone: string;
    pickups: number;
    deliveries: number;
}

// Every avatar in the Figma rows uses this exact teal gradient (135°, #00bba7 → #00786f).
export const AVATAR_GRADIENT = 'linear-gradient(135deg, #00bba7 0%, #00786f 100%)';

export const VEHICLE_TYPES: string[] = ['Motor', 'Mobil'];

export const COURIERS: Courier[] = [
    {
        id: 'budi-santoso',
        name: 'Budi Santoso',
        initials: 'BS',
        plate: 'B 4421 KZA',
        vehicleType: 'Motor',
        phone: '+62 812-3456-7890',
        pickups: 84,
        deliveries: 184,
    },
    {
        id: 'ahmad-fauzi',
        name: 'Ahmad Fauzi',
        initials: 'AF',
        plate: 'M 1577 AK',
        vehicleType: 'Motor',
        phone: '+62 813-2233-4455',
        pickups: 76,
        deliveries: 162,
    },
    {
        id: 'siti-rahayu',
        name: 'Siti Rahayu',
        initials: 'SR',
        plate: 'B 2231 PLA',
        vehicleType: 'Mobil',
        phone: '+62 821-7788-9900',
        pickups: 91,
        deliveries: 203,
    },
    {
        id: 'eko-prasetyo',
        name: 'Eko Prasetyo',
        initials: 'EP',
        plate: 'L 9087 QWE',
        vehicleType: 'Motor',
        phone: '+62 856-1122-3344',
        pickups: 68,
        deliveries: 147,
    },
    {
        id: 'dewi-kusuma',
        name: 'Dewi Kusuma',
        initials: 'DK',
        plate: 'W 5432 ZX',
        vehicleType: 'Motor',
        phone: '+62 878-5566-7788',
        pickups: 80,
        deliveries: 175,
    },
    {
        id: 'gunawan',
        name: 'Gunawan',
        initials: 'GW',
        plate: 'N 3120 HJ',
        vehicleType: 'Mobil',
        phone: '+62 811-9090-1212',
        pickups: 95,
        deliveries: 219,
    },
];

/** "B 4421 KZA · Motor" — the combined KENDARAAN cell from the Figma table. */
export function vehicleLabel(c: Courier): string {
    return `${c.plate} · ${c.vehicleType}`;
}

export function findCourier(id: string): Courier | undefined {
    return COURIERS.find((c) => c.id === id);
}
