import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, Cell
} from 'recharts';

const ParetoAnalysis = () => {
    const navigate = useNavigate();

    // Empty list for user input
    const [defects, setDefects] = useState([]);
    const [newDefect, setNewDefect] = useState({ name: '', qty: '' });

    // Pareto Calculation Logic
    const chartData = useMemo(() => {
        if (defects.length === 0) return [];

        // 1. Sort Descending by Quantity
        const sorted = [...defects].sort((a, b) => Number(b.qty) - Number(a.qty));
        const totalQty = sorted.reduce((sum, item) => sum + Number(item.qty), 0);
        
        let cumulativeSum = 0;
        return sorted.map(item => {
            cumulativeSum += Number(item.qty);
            return {
                name: item.name,
                qty: Number(item.qty),
                cumPercentage: totalQty > 0 ? Number(((cumulativeSum / totalQty) * 100).toFixed(1)) : 0
            };
        });
    }, [defects]);

    const addDefect = (e) => {
        e.preventDefault();
        if (newDefect.name && newDefect.qty) {
            setDefects([...defects, { id: Date.now(), ...newDefect }]);
            setNewDefect({ name: '', qty: '' });
        }
    };

    const removeDefect = (id) => {
        setDefects(defects.filter(d => d.id !== id));
    };

    const resetForm = () => {
        if (window.confirm("Are you sure you want to clear all data?")) {
            setDefects([]);
            setNewDefect({ name: '', qty: '' });
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans pb-24">
            {/* Indigo Gradient Header - Clean Version (No DOC NO bar) */}
            <div className="bg-gradient-to-br from-[#4338ca] via-[#6366f1] to-[#818cf8] pt-12 pb-28 px-4 md:px-6">
                <div className="max-w-6xl mx-auto flex items-center gap-5 text-white">
                    <button 
                        onClick={() => navigate('/qa-hub/monthly')} 
                        className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/30 transition backdrop-blur-md"
                    >
                        <i className="bi bi-chevron-left text-xl"></i>
                    </button>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight">Pareto Analysis</h1>
                        <p className="text-indigo-100 text-xs font-bold tracking-[0.2em] uppercase opacity-80">Automatic Defect Distribution Chart</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 space-y-8">
                
                {/* User Input Section */}
                <div className="bg-white rounded-3xl shadow-xl shadow-indigo-900/5 p-6 md:p-8 border border-white">
                    <h3 className="text-[#6366f1] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                        <i className="bi bi-plus-circle-fill text-lg"></i> Add New Defect Entry
                    </h3>
                    
                    <form onSubmit={addDefect} className="flex flex-col lg:flex-row gap-5 mb-8">
                        <div className="flex-1 space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Defect Description</label>
                            <input 
                                required
                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#6366f1] focus:bg-white outline-none transition-all font-semibold text-sm shadow-sm"
                                placeholder="e.g. Surface Scratches"
                                value={newDefect.name}
                                onChange={(e) => setNewDefect({...newDefect, name: e.target.value})}
                            />
                        </div>
                        <div className="w-full lg:w-48 space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Quantity (Freq)</label>
                            <input 
                                required
                                type="number"
                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#6366f1] focus:bg-white outline-none transition-all font-semibold text-sm shadow-sm"
                                placeholder="0"
                                value={newDefect.qty}
                                onChange={(e) => setNewDefect({...newDefect, qty: e.target.value})}
                            />
                        </div>
                        <button 
                            type="submit"
                            className="mt-auto px-10 py-4 bg-[#6366f1] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#4f46e5] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/30 h-[52px]"
                        >
                            Plot Data
                        </button>
                    </form>

                    {/* Temporary List Table */}
                    {defects.length > 0 && (
                        <div className="overflow-hidden rounded-2xl border border-slate-50 shadow-inner">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black">
                                    <tr>
                                        <th className="px-8 py-4">Defect Name</th>
                                        <th className="px-8 py-4">Frequency</th>
                                        <th className="px-8 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {defects.map((d) => (
                                        <tr key={d.id} className="hover:bg-indigo-50/40 transition-colors group">
                                            <td className="px-8 py-4 font-bold text-slate-700">{d.name}</td>
                                            <td className="px-8 py-4 font-black text-[#6366f1]">{d.qty}</td>
                                            <td className="px-8 py-4 text-right">
                                                <button onClick={() => removeDefect(d.id)} className="w-9 h-9 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all">
                                                    <i className="bi bi-trash3-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pareto Chart Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-indigo-900/5 p-6 md:p-8 border border-white min-h-[450px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                        <h3 className="text-slate-800 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                            <i className="bi bi-bar-chart-fill text-[#6366f1] text-lg"></i> Live Pareto Visualization
                        </h3>
                        {defects.length > 0 && (
                            <span className="text-[10px] bg-indigo-50 text-[#6366f1] px-4 py-1.5 rounded-full font-black uppercase border border-indigo-100">
                                Total Count: {defects.reduce((s, i) => s + Number(i.qty), 0)}
                            </span>
                        )}
                    </div>
                    
                    {defects.length > 0 ? (
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={1}/>
                                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0.8}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" fontSize={10} fontWeight="900" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="left" orientation="left" stroke="#6366f1" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={10} fontWeight="bold" unit="%" axisLine={false} tickLine={false} domain={[0, 100]} />
                                    <Tooltip 
                                        cursor={{fill: '#f8fafc'}}
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '15px' }}
                                    />
                                    <Legend verticalAlign="top" height={40} iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'}}/>
                                    <Bar yAxisId="left" dataKey="qty" fill="url(#barGradient)" radius={[12, 12, 0, 0]} barSize={50} name="Frequency" />
                                    <Line yAxisId="right" type="monotone" dataKey="cumPercentage" stroke="#4338ca" strokeWidth={4} dot={{ r: 6, fill: '#4338ca', strokeWidth: 3, stroke: '#fff' }} name="Cumulative %" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex flex-col items-center justify-center text-slate-300 gap-5">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                                <i className="bi bi-graph-up text-4xl opacity-20"></i>
                            </div>
                            <p className="font-bold text-[11px] tracking-[0.3em] uppercase">Enter defect data above to generate chart</p>
                        </div>
                    )}
                </div>

                {/* Bottom Action Bar */}
                <div className="bg-white/90 backdrop-blur-xl fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-white shadow-2xl p-4 flex justify-between items-center z-30">
                    <button type="button" onClick={() => navigate('/qa-hub/monthly')} className="px-8 py-2 text-slate-400 font-bold hover:text-red-500 transition-all text-xs uppercase tracking-widest">
                        <i className="bi bi-x-circle me-2"></i> Close
                    </button>
                    
                    <div className="flex gap-4">
                        <button type="button" onClick={resetForm} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">
                            Reset
                        </button>
                        <button onClick={() => alert('Pareto Report Saved!')} className="px-12 py-3 bg-[#6366f1] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Submit Analysis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParetoAnalysis;