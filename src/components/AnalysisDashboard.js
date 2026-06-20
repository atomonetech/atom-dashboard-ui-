import React, { useState } from 'react';
import { Factory, ArrowLeft } from 'lucide-react';
import PlantAnalysis from './PlantAnalysis';
import { useNavigate } from 'react-router-dom';

const AnalysisDashboard = () => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const navigate = useNavigate();

  if (selectedPlant) {
    return <PlantAnalysis plant={selectedPlant} goBack={() => setSelectedPlant(null)} />;
  }

  const plants = [
    { id: 'Plant 1', title: 'Plant 1 Live', iconColor: 'bg-blue-50 text-blue-500', totalDepts: '3 Departments', status: 'Live Analytics' },
    { id: 'Plant 2', title: 'Plant 2 Live', iconColor: 'bg-purple-50 text-purple-500', totalDepts: '3 Departments', status: 'Live Analytics' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Strictly Top-Left Header */}
      <div className="w-full p-6 md:p-8 flex items-center gap-3 text-emerald-700">
        <ArrowLeft className="w-6 h-6 cursor-pointer hover:text-emerald-500 transition-colors" onClick={() => navigate('/dashboard')} />
        <h2 className="text-2xl font-bold">Analysis Hub</h2>
      </div>

      {/* Centered Content - Bigger Cards */}
      <div className="flex-1 flex items-center justify-center p-6 pb-24">
        <div className="flex flex-wrap justify-center gap-10 w-full max-w-[1200px]">
          {plants.map((plant) => (
            <div 
              key={plant.id} 
              onClick={() => setSelectedPlant(plant.id)}
              className="bg-white p-10 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all w-full md:w-[460px]"
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${plant.iconColor}`}>
                <Factory className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-8">{plant.title}</h3>
              
              <div className="w-full border border-gray-200 text-gray-600 text-sm py-3.5 px-4 rounded-lg mb-4 font-medium">
                 {plant.totalDepts}
              </div>
              <div className="w-full border border-gray-200 text-gray-600 text-sm py-3.5 px-4 rounded-lg font-medium">
                 {plant.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;