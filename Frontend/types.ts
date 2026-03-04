export interface Patient {
    id: string;
    name: string;
    avatar: string;
    condition: string;
    status: 'Stable' | 'High Risk' | 'Mod Risk' | 'Critical';
    transportStatus: 'En Route' | 'Arrived' | 'Scheduled' | 'Completed' | 'Requested' | 'Negotiating';
    nextAppt?: string;
    phone?: string;
    email?: string;
    address?: string;
    medications?: string[];
    history?: { date: string; event: string }[];
}

export interface Driver {
    id: string;
    name: string;
    avatar: string;
    vehicle: string;
    vehicleType: 'Sedan' | 'Van' | 'SUV' | 'Wheelchair Lift';
    status: 'Online' | 'Offline' | 'On Call';
    rides: number;
    rating: number;
    impact: string; 
    availability: string[];
}

export interface Ride {
    id: string;
    patientName: string;
    driverName: string;
    status: 'On Time' | 'Delayed' | 'Arrived' | 'Scheduled';
    eta: string;
    department: string;
    date: string;
}

export interface AIIntentLog {
    id: string;
    message: string;
    status: 'success' | 'processing' | 'error';
    timestamp: string;
}