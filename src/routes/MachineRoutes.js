import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Existing Imports
import MachineHistoryCard from '../components/All_Deperments_Hub/MaintenanceHub/forms/MachineHistoryCard';
import DailyPowerPressChecksheet from '../components/All_Deperments_Hub/MaintenanceHub/forms/DailyPowerPressChecksheet';
import MachineBreakDownForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/MachineBreakDownForm';
import PokaYokeChecksheet from '../components/All_Deperments_Hub/MaintenanceHub/forms/PokaYokeChecksheet';
import PokaYokeChecksheetprint from '../components/All_Deperments_Hub/MaintenanceHub/forms/PokaYokeChecksheetprint';
import MachinePreventMainForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/MachinePreventMainForm';
import CncPreventiveMaintenanceForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/CNCPreventiveMaintenanceForm';

import MachineBreakDownSummary from '../components/All_Deperments_Hub/MaintenanceHub/forms/MachineBreakDownSummary';
import MachineMonthlyReport from '../components/All_Deperments_Hub/MaintenanceHub/views/MachineMonthlyReport';
import WhyAnalysisForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/WhyAnalysisForm";
import CriticalSparesForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/CriticslSpareForm";
import MachineYearlyReport from "../components/All_Deperments_Hub/MaintenanceHub/views/MachineYearlyReport";
import MasterMachineList from "../components/All_Deperments_Hub/MaintenanceHub/forms/MasterMachineList";
import MachineOverhaulingList from "../components/All_Deperments_Hub/MaintenanceHub/forms/MachineOverhaulingList";
import AnnualOverhaulingPlan from '../components/All_Deperments_Hub/MaintenanceHub/forms/AnnualOverhaulingPlan';
import WeeklyReports from '../components/All_Deperments_Hub/MaintenanceHub/views/ToolWeekly';

// Report Imports
import DailyPowerPressChecksheetPrint from '../components/All_Deperments_Hub/MaintenanceHub/Report/DailyPowerPressChecksheetprint';
import MachineBreakdownSummaryPrint from '../components/All_Deperments_Hub/MaintenanceHub/Report/MachineBreakdownSummaryPrint';
import MachineHistoryCardPrint from '../components/All_Deperments_Hub/MaintenanceHub/Report/MachineHistoryCardprint';
import ToolHistoryReport from '../components/All_Deperments_Hub/MaintenanceHub/Report/ToolHistoryReport';

const MachineRoutes = () => {
    return (
        <Routes>
            {/* --- FORMS ROUTES --- */}
            <Route path="history-card" element={<MachineHistoryCard />} />
            <Route path="power-press-checksheet" element={<DailyPowerPressChecksheet />} />
            <Route path="breakdown-form" element={<MachineBreakDownForm />} />
            
            {/* ✅ FOOLPROOF POKA YOKE ROUTES (Chahe UI id bheje ya fillRoute, dono handle ho jayenge) */}
            <Route path="Poka-Yoke" element={<PokaYokeChecksheet />} />
            <Route path="poka_yoke_check" element={<PokaYokeChecksheet />} />
            
            {/* --- WEEKLY ROUTES --- */}
            <Route path="weekly-reports" element={<WeeklyReports />} />
            <Route path="preventive-vmc" element={<MachinePreventMainForm />} />
            <Route path="preventive-cnc" element={<CncPreventiveMaintenanceForm />} />
            <Route path="preventive-:machineName" element={<MachinePreventMainForm />} />

            {/* --- REPORT / PRINT ROUTES --- */}
            <Route path="breakdown-form/print" element={<MachineBreakdownSummaryPrint />} />
            <Route path="power-press-checksheet/print" element={<DailyPowerPressChecksheetPrint />} />
            <Route path="history-card/print" element={<MachineHistoryCardPrint />} />
            <Route path="tool-history/report" element={<ToolHistoryReport />} />
            
            {/* ✅ FOOLPROOF POKA YOKE PRINT ROUTES */}
            <Route path="PokaYoke-report" element={<PokaYokeChecksheetprint />} />
            <Route path="poka_yoke_check/print" element={<PokaYokeChecksheetprint />} />

            {/* --- MONTHLY ROUTES --- */}
            <Route path="monthly" element={<MachineMonthlyReport />} /> 
            <Route path="breakdown-summary" element={<MachineBreakDownSummary />} />
            <Route path="why-why-analysis" element={<WhyAnalysisForm />} />
            <Route path="critical-spares" element={<CriticalSparesForm />} />

            {/* --- YEARLY ROUTES --- */}
            <Route path="yearly" element={<MachineYearlyReport />} />
            <Route path="master-list-mc" element={<MasterMachineList />} /> 
            <Route path="mc-overhauling-list" element={<MachineOverhaulingList />} />
            <Route path="annual-overhauling-plan" element={<AnnualOverhaulingPlan />} />
        </Routes>
    );
};

export default MachineRoutes;