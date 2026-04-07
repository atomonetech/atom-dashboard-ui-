import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DailyReports from '../components/All_Deperments_Hub/MaintenanceHub/views/DailyReports';
import WeeklyReports from '../components/All_Deperments_Hub/MaintenanceHub/views/WeeklyReports'; // 👈 Check this name

const MachineRoutes = () => {
    return (
        <Routes>
            <Route path="Daily-Reports" element={<DailyReports />} />
            {/* 🔥 Yeh route exact hona chahiye jo MaintenanceHub navigate kar raha hai */}
            <Route path="Weekly-Reports" element={<WeeklyReports />} /> 
            <Route path="Monthly-Reports" element={<div>Monthly Page Coming Soon</div>} />
        </Routes>
    );
};

export default MachineRoutes;