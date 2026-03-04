import React from 'react';

export default function MedicationRequest() {
    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
             {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-end gap-3 p-8 border-b border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex flex-col gap-1">
                    <p className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Medication Request</p>
                    <p className="text-slate-500 text-sm font-normal">Patient: <span className="font-bold text-slate-900 dark:text-white">John Doe</span> | ID: 99482 | DOB: 05/12/1985</p>
                </div>
                <button className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-white text-sm font-bold border border-slate-200 dark:border-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors">
                    <span>View Patient Profile</span>
                </button>
            </div>
            {/* Two Column Layout for Medication Request */}
            <div className="flex flex-1 flex-col lg:flex-row p-6 gap-6 overflow-hidden">
                {/* Left Side: AI Intent Box */}
                <div className="flex flex-col w-full lg:w-1/3 gap-4">
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold px-1">AI Quick Action</h2>
                    <div className="flex flex-col bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-primary">Natural Language Intent</span>
                            </div>
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-gray-800/50">
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Input Instruction</label>
                            <textarea className="w-full min-h-[140px] resize-none border-none bg-transparent p-0 text-slate-900 dark:text-white focus:ring-0 text-base placeholder:text-slate-400 outline-none" placeholder="e.g., Refill John's Insulin and add 50mg of Aspirin">Refill John's Insulin and add 50mg of Aspirin</textarea>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <div className="flex items-center gap-4 justify-between">
                                <div className="flex gap-2">
                                    <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg"><span className="material-symbols-outlined">mic</span></button>
                                    <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg"><span className="material-symbols-outlined">attach_file</span></button>
                                </div>
                                <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-primary/90 transition-colors">Process Intent</button>
                            </div>
                            <div className="mt-2 pt-4 border-t border-slate-100 dark:border-gray-800">
                                <p className="text-xs text-slate-500 leading-relaxed italic">
                                    "AI interpreted 2 actions: Found existing Insulin (NPH) prescription to refill and matched Aspirin (Acetylsalicylic Acid) 50mg for new entry."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right Side: Medication Table */}
                <div className="flex flex-col flex-1 gap-4 overflow-hidden">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-slate-900 dark:text-white text-lg font-bold">Prescription Review</h2>
                        <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-1 rounded-full uppercase">Auto-Filled from History</span>
                    </div>
                    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
                        <div className="overflow-x-auto overflow-y-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 dark:bg-gray-800 border-b border-slate-200 dark:border-gray-800 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Medication</th>
                                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Dosage</th>
                                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Pharmacy Stock</th>
                                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                                    {/* Row 1: Existing Refill */}
                                    <tr className="hover:bg-primary/5 transition-colors bg-blue-50/30 dark:bg-primary/5">
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-slate-900 dark:text-white">Insulin (Humulin N)</span>
                                                <span className="text-xs text-slate-500">NPH Isophane Suspension</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-slate-700 dark:text-slate-300">25 Units daily, Sub-Q</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase">Refill</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium text-xs">
                                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                                In Stock
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-sm">edit</span></button>
                                        </td>
                                    </tr>
                                    {/* Row 2: New Entry with Stock Warning */}
                                    <tr className="hover:bg-primary/5 transition-colors bg-primary/5 border-l-4 border-primary">
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-slate-900 dark:text-white">Aspirin</span>
                                                    <span className="bg-primary text-white text-[9px] px-1 rounded uppercase">New</span>
                                                </div>
                                                <span className="text-xs text-slate-500">Acetylsalicylic Acid</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm font-bold text-primary">50 mg Oral Tablet</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="px-2 py-1 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[10px] font-bold uppercase">New Rx</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold text-xs">
                                                    <span className="material-symbols-outlined text-sm">warning</span>
                                                    Stock Warning
                                                </div>
                                                <span className="text-[10px] text-slate-500">Low at Local Pharmacy</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-sm">edit</span></button>
                                                <button className="text-red-400 hover:text-red-600"><span className="material-symbols-outlined text-sm">delete</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Empty states or footer for table */}
                        <div className="mt-auto p-4 bg-slate-50 dark:bg-gray-800/30 border-t border-slate-200 dark:border-gray-800 flex justify-between items-center">
                            <p className="text-xs text-slate-500">Showing 2 medication items verified by AI Engine</p>
                            <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                                <span className="material-symbols-outlined text-sm">add</span> Add Medication Manually
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer Action Bar */}
            <footer className="p-6 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 flex justify-end items-center gap-4 sticky bottom-0">
                <button className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 font-bold text-sm hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
                    Save to History
                </button>
                <button className="px-8 py-2.5 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">print</span>
                    Authorize & Print Prescription
                </button>
            </footer>
        </div>
    );
}