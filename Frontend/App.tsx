import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Directory from './pages/Directory';
import Schedule from './pages/Schedule';
import AIMoveAppointment from './pages/AI_MoveAppointment';
import AIAddDriver from './pages/AI_AddDriver';
import BookAppointment from './pages/BookAppointment';
import MedicationRequest from './pages/MedicationRequest';
import { Patient, Driver } from './types';

// Mock Data for Directories
const patientsData: Patient[] = [
    { id: '8821', name: 'Eleanor Rigby', avatar: 'https://i.pravatar.cc/150?u=eleanor', condition: 'Chronic Arthritis', status: 'High Risk', transportStatus: 'Scheduled', nextAppt: 'Oct 24, 2:00 PM' },
    { id: '9204', name: 'Jim Halpert', avatar: 'https://i.pravatar.cc/150?u=jim', condition: 'Hypertension', status: 'Stable', transportStatus: 'Completed', nextAppt: 'Oct 25, 9:00 AM' },
    { id: '3991', name: 'Michael Scott', avatar: 'https://i.pravatar.cc/150?u=michael', condition: 'None', status: 'Stable', transportStatus: 'Completed', nextAppt: 'Oct 26, 11:30 AM' },
    { id: '1029', name: 'Pam Beesly', avatar: 'https://i.pravatar.cc/150?u=pam', condition: 'Pregnancy Checkup', status: 'Stable', transportStatus: 'Requested', nextAppt: 'Oct 24, 4:00 PM' },
    { id: '5552', name: 'Dwight Schrute', avatar: 'https://i.pravatar.cc/150?u=dwight', condition: 'Back Pain', status: 'Critical', transportStatus: 'Scheduled', nextAppt: 'Oct 28, 8:00 AM' },
    { id: '4421', name: 'Stanley Hudson', avatar: 'https://i.pravatar.cc/150?u=stanley', condition: 'Diabetes', status: 'High Risk', transportStatus: 'Scheduled', nextAppt: 'Oct 29, 1:00 PM' },
];

export default function App() {
    return (
        <HashRouter>
            <Routes>
                {/* Main App Layout Routes */}
                <Route path="/*" element={
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/patients" element={<Directory type="patients" data={patientsData} />} />
                            <Route path="/schedule" element={<Schedule />} />
                            <Route path="/book" element={<BookAppointment />} />
                            <Route path="/meds" element={<MedicationRequest />} />
                            <Route path="/ai/move-appointment" element={<AIMoveAppointment />} />
                            <Route path="/ai/add-driver" element={<AIAddDriver />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Layout>
                } />
            </Routes>
        </HashRouter>
    );
}