import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MachineHistoryCard from '../components/All_Deperments_Hub/MaintenanceHub/forms/MachineHistoryCard';
import DailyPowerPressChecksheet from '../components/All_Deperments_Hub/MaintenanceHub/forms/DailyPowerPressChecksheet';
import MachineBreakDownForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/MachineBreakDownForm';
import MachinePreventMainForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/MachinePreventMainForm';
import CncPreventiveMaintenanceForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/CNCPreventiveMaintenanceForm';
import WeeklyReports from '../components/All_Deperments_Hub/MaintenanceHub/views/ToolWeekly';
import DailyPowerPressChecksheetPrint from '../components/All_Deperments_Hub/MaintenanceHub/Report/DailyPowerPressChecksheetprint';

// Routes ke andar add karo:


const MachineRoutes = () => {
    return (
        <Routes>
            <Route path="history-card" element={<MachineHistoryCard />} />
            <Route path="power-press-checksheet" element={<DailyPowerPressChecksheet />} />
            <Route path="breakdown-form" element={<MachineBreakDownForm />} />
            <Route path="preventive-vmc" element={<MachinePreventMainForm />} />
            <Route path="preventive-cnc" element={<CncPreventiveMaintenanceForm />} />
            <Route path="weekly-reports" element={<WeeklyReports />} />
            {/* 19 Machines ke liye dynamic route agar aapne banaya hai */}
            <Route path="preventive-:machineName" element={<MachinePreventMainForm />} />
            <Route path="power-press-checksheet/print" element={<DailyPowerPressChecksheetPrint />} />
        </Routes>
    );
};

export default MachineRoutes;