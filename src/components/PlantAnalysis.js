import React, { useState } from 'react';
import { ShieldCheck, Settings, Wrench, ArrowLeft } from 'lucide-react';
import DepartmentStats from './DepartmentStats';

const PlantAnalysis = ({ plant, goBack }) => {
  const [selectedDept, setSelectedDept] = useState(null);

  if (selectedDept) {
    return <DepartmentStats plant={plant} department={selectedDept} goBack={() => setSelectedDept(null)} />;
  }

  const departments = [
    { name: 'Quality Hub', icon: <ShieldCheck className="w-9 h-9" />, color: 'bg-red-50 text-red-500', reports: 'AOT/QMS/LIVE', head: 'Quality Manager' },
    { name: 'Production Hub', icon: <Settings className="w-9 h-9" />, color: 'bg-orange-50 text-orange-500', reports: 'AOT/PROD/LIVE', head: 'Production Manager' },
    { name: 'Maintenance Hub', icon: <Wrench className="w-9 h-9" />, color: 'bg-green-50 text-green-500', reports: 'AOT/MNT/LIVE', head: 'Maintenance Incharge' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Strictly Top-Left Header */}
      <div className="w-full p-6 md:p-8 flex items-center gap-3 text-emerald-700">
        <ArrowLeft className="w-6 h-6 cursor-pointer hover:text-emerald-500 transition-colors" onClick={goBack} />
        <h2 className="text-2xl font-bold">{plant} / Departments</h2>
      </div>

      {/* Centered Content - Bigger Cards */}
      <div className="flex-1 flex items-center justify-center p-6 pb-24">
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-[1400px]">
          {departments.map((dept, index) => (
            <div 
              key={index}
              onClick={() => setSelectedDept(dept.name)} 
              className="bg-white p-8 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all w-full md:w-[400px]"
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${dept.color}`}>
                {dept.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-8">{dept.name}</h3>
              
              <div className="w-full border border-gray-200 text-gray-600 text-sm py-3 px-4 rounded-lg mb-3 font-medium">
                📄 {dept.reports}
              </div>
              <div className="w-full border border-gray-200 text-gray-600 text-sm py-3 px-4 rounded-lg font-medium">
                👤 Head: {dept.head}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantAnalysis;