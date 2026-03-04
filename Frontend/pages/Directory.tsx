import React, { useState } from 'react';
import { 
    MoreVertical, 
    X, 
    Plus, 
    User, 
    Activity, 
    Phone, 
    Mail, 
    Trash2, 
    History as HistoryIcon, 
    Truck,
    CheckCircle,
    Edit3,
    Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Avatar, Button, Input } from '../components/UI';
import { Patient, Driver } from '../types';
import { PatientDetailsModal } from '../components/PatientDetailsModal';

interface DirectoryProps {
    type: 'patients' | 'drivers';
    data: (Patient | Driver)[];
}

const DriverDetailsModal = ({ driver, onClose }: { driver: Driver, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="h-40 bg-slate-900 relative">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                    <div className="absolute -bottom-12 left-10 p-1.5 bg-white rounded-full shadow-xl">
                        <Avatar alt={driver.name} size="xl" className="border-4 border-white w-24 h-24" />
                    </div>
                </div>
                <div className="pt-16 p-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{driver.name}</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">{driver.vehicle} • {driver.vehicleType}</p>
                        </div>
                        <Badge variant={driver.status === 'Online' ? 'success' : 'neutral'} className="px-5 py-2 text-xs uppercase tracking-widest">{driver.status}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-6 mb-10">
                        <Card className="text-center p-5 bg-slate-50 border-none rounded-2xl">
                            <p className="text-2xl font-black text-slate-900">{driver.rides}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deployments</p>
                        </Card>
                        <Card className="text-center p-5 bg-slate-50 border-none rounded-2xl">
                            <p className="text-2xl font-black text-slate-900">{driver.rating}★</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quality Score</p>
                        </Card>
                        <Card className="text-center p-5 bg-primary-600 text-white border-none rounded-2xl">
                            <p className="text-2xl font-black">{driver.impact}</p>
                            <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest">Mesh Rating</p>
                        </Card>
                    </div>
                    <Button className="w-full py-5 font-black uppercase text-xs tracking-[0.2em]" onClick={onClose}>Back to Fleet</Button>
                </div>
            </div>
        </div>
    );
};

export default function Directory({ type, data: initialData }: DirectoryProps) {
    const [data, setData] = useState(initialData);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [newItemName, setNewItemName] = useState('');

    const isPatients = type === 'patients';

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        const id = Math.random().toString(36).substr(2, 4).toUpperCase();
        const nameToUse = newItemName.trim() || (isPatients ? "New Resident" : "New Fleet Asset");
        
        if (isPatients) {
            const newItem: Patient = { id, name: nameToUse, avatar: '', condition: "Evaluation In-Progress", status: 'Stable', transportStatus: 'Scheduled' };
            setData([newItem, ...data]);
        } else {
            const newItem: Driver = { id, name: nameToUse, avatar: '', vehicle: "Verified Unit", vehicleType: 'Sedan', status: 'Online', rides: 0, rating: 5.0, impact: "Level 1", availability: ["All Week"] };
            setData([newItem, ...data]);
        }
        setIsAddModalOpen(false);
        setNewItemName('');
    };

    const handleRemove = (id: string) => {
        setData(data.filter(i => i.id !== id));
        setOpenMenuId(null);
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">{isPatients ? 'Resident Directory' : 'Fleet Assets'}</h1>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Registered Database Count: {data.length}</p>
                </div>
                <Button className="font-black uppercase text-xs tracking-widest" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> ADD RECORD
                </Button>
            </header>

            <Card className="flex-1 overflow-hidden" noPadding>
                <div className="overflow-x-auto h-full">
                    <table className="w-full">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 text-left">Entity Identity</th>
                                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 text-left">{isPatients ? 'Diagnosis' : 'Unit Profile'}</th>
                                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 text-left">Status Badge</th>
                                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 text-right">Reference Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((item) => (
                                <tr key={item.id} onClick={() => setSelectedItem(item)} className="hover:bg-primary-50/20 transition-all group cursor-pointer">
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-4">
                                            <Avatar alt={item.name} size="md" />
                                            <div>
                                                <p className="font-black text-slate-900 group-hover:text-primary-600 transition-colors leading-none mb-1.5 tracking-tight">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">REF: {item.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        {isPatients ? (
                                            <p className="text-sm font-bold text-slate-600 truncate max-w-[200px]">{(item as Patient).condition}</p>
                                        ) : (
                                            <div className="text-sm font-bold text-slate-900">{(item as Driver).vehicle} <br/><span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{(item as Driver).vehicleType}</span></div>
                                        )}
                                    </td>
                                    <td className="py-5 px-8">
                                        <Badge variant={isPatients ? ((item as Patient).status === 'Stable' ? 'success' : 'danger') : ((item as Driver).status === 'Online' ? 'success' : 'neutral')}>
                                            {isPatients ? (item as Patient).status : (item as Driver).status}
                                        </Badge>
                                    </td>
                                    <td className="py-5 px-8 text-right relative">
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === item.id ? null : item.id); }} className="p-2.5 hover:bg-white hover:shadow-xl rounded-xl border border-transparent hover:border-slate-100 transition-all text-slate-300 hover:text-slate-900">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                        {openMenuId === item.id && (
                                            <div className="absolute right-10 top-14 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2" onMouseLeave={() => setOpenMenuId(null)}>
                                                {isPatients ? (
                                                    <>
                                                        <button className="w-full px-6 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-700 hover:bg-slate-50 flex items-center gap-3" onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}><Edit3 className="w-4 h-4 text-slate-400" /> Edit Patient</button>
                                                        <button className="w-full px-6 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-700 hover:bg-slate-50 flex items-center gap-3"><HistoryIcon className="w-4 h-4 text-slate-400" /> Medical Log</button>
                                                        <div className="h-px bg-slate-100 my-2" />
                                                        <button onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }} className="w-full px-6 py-3 text-left text-[11px] font-black uppercase tracking-wider text-red-600 hover:bg-red-50 flex items-center gap-3"><Trash2 className="w-4 h-4" /> REMOVE PATIENT</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button className="w-full px-6 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-700 hover:bg-slate-50 flex items-center gap-3"><Heart className="w-4 h-4 text-pink-500" /> Performance Like</button>
                                                        <button className="w-full px-6 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-700 hover:bg-slate-50 flex items-center gap-3"><HistoryIcon className="w-4 h-4 text-slate-400" /> Ride History</button>
                                                        <div className="h-px bg-slate-100 my-2" />
                                                        <button onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }} className="w-full px-6 py-3 text-left text-[11px] font-black uppercase tracking-wider text-red-600 hover:bg-red-50 flex items-center gap-3"><Trash2 className="w-4 h-4" /> REMOVE UNIT</button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {selectedItem && (isPatients ? <PatientDetailsModal patient={selectedItem} onClose={() => setSelectedItem(null)} /> : <DriverDetailsModal driver={selectedItem} onClose={() => setSelectedItem(null)} />)}

            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-7 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Entity Enrollment</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <form onSubmit={handleAddItem} className="p-10 space-y-6">
                            <Input 
                                label="Enrollment Name" 
                                placeholder="Jane Smith" 
                                required 
                                icon={User}
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                            />
                            {isPatients ? (
                                <Input label="Target Diagnosis" placeholder="Physical Therapy / Cardiac Care" icon={Activity} />
                            ) : (
                                <div className="grid grid-cols-2 gap-5">
                                    <Input label="Operational Unit" placeholder="Toyota Sedan" icon={Truck} />
                                    <Input label="Service Node" placeholder="MESH-99" icon={CheckCircle} />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-5">
                                <Input label="Emergency Bridge" placeholder="+1 (555) 000-0000" icon={Phone} />
                                <Input label="Email Hub" placeholder="user@clear-ride.org" icon={Mail} />
                            </div>
                            <div className="pt-6 flex gap-4">
                                <Button type="submit" className="flex-1 py-5 font-black uppercase text-xs tracking-widest">Onboard Entity</Button>
                                <Button type="button" variant="secondary" className="flex-1 font-bold text-xs uppercase" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}