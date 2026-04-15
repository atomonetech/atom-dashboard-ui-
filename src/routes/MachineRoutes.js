import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MachineHistoryCard from '../components/All_Deperments_Hub/MaintenanceHub/forms/MachineHistoryCard';
import DailyPowerPressChecksheet from '../components/All_Deperments_Hub/MaintenanceHub/forms/DailyPowerPressChecksheet';
import MachineBreakDownForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/MachineBreakDownForm';
import MachinePreventMainForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/MachinePreventMainForm';
import CncPreventiveMaintenanceForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/CNCPreventiveMaintenanceForm';
import WeeklyReports from '../components/All_Deperments_Hub/MaintenanceHub/views/ToolWeekly';

// Report Imports
import DailyPowerPressChecksheetPrint from '../components/All_Deperments_Hub/MaintenanceHub/Report/DailyPowerPressChecksheetprint';
import MachineBreakdownSummaryPrint from '../components/All_Deperments_Hub/MaintenanceHub/Report/MachineBreakdownSummaryPrint';
import MachineHistoryCardPrint from '../components/All_Deperments_Hub/MaintenanceHub/Report/MachineHistoryCardprint';
import ToolHistoryReport from '../components/All_Deperments_Hub/MaintenanceHub/Report/ToolHistoryReport';

const MachineRoutes = () => {
    return (
        <Routes>
            {/* Forms Routes */}
            <Route path="history-card" element={<MachineHistoryCard />} />
            <Route path="power-press-checksheet" element={<DailyPowerPressChecksheet />} />
            <Route path="breakdown-form" element={<MachineBreakDownForm />} />
            <Route path="preventive-vmc" element={<MachinePreventMainForm />} />
            <Route path="preventive-cnc" element={<CncPreventiveMaintenanceForm />} />
            <Route path="weekly-reports" element={<WeeklyReports />} />
            
            {/* Dynamic route */}
            <Route path="preventive-:machineName" element={<MachinePreventMainForm />} />

            {/* --- Report / Print Routes (Paths updated to match your URL) --- */}
            
            {/* Ab ye URL "breakdown-form/print" par khulega */}
            <Route path="breakdown-form/print" element={<MachineBreakdownSummaryPrint />} />
            
            <Route path="power-press-checksheet/print" element={<DailyPowerPressChecksheetPrint />} />
            <Route path="history-card/print" element={<MachineHistoryCardPrint />} />
            <Route path="tool-history/report" element={<ToolHistoryReport />} />
        </Routes>
    );
};

export default MachineRoutes;