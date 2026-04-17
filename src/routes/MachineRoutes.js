import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Existing Imports
import MachineHistoryCard from '../components/All_Deperments_Hub/MaintenanceHub/forms/MachineHistoryCard';
import DailyPowerPressChecksheet from '../components/All_Deperments_Hub/MaintenanceHub/forms/DailyPowerPressChecksheet';
import MachineBreakDownForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/MachineBreakDownForm';
import MachinePreventMainForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/MachinePreventMainForm';
import CncPreventiveMaintenanceForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/CNCPreventiveMaintenanceForm';
import WeeklyReports from '../components/All_Deperments_Hub/MaintenanceHub/views/ToolWeekly';
import MachineBreakdownSummary from '../components/All_Deperments_Hub/MaintenanceHub/forms/MachineBreakdownSummary';
import MachineMonthlyReport from '../components/All_Deperments_Hub/MaintenanceHub/views/MachineMonthlyReport';
import WhyAnalysisForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/WhyAnalysisForm";
import CriticalSparesForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/CriticalSpareForm";
import MachineYearlyReport from "../components/All_Deperments_Hub/MaintenanceHub/views/MachineYearlyReport";
import MasterMachineList from "../components/All_Deperments_Hub/MaintenanceHub/forms/MasterMachineList";
import MachineOverhaulingList from "../components/All_Deperments_Hub/MaintenanceHub/forms/MachineOverhaulingList";
import AnnualOverhaulingPlan from '../components/All_Deperments_Hub/MaintenanceHub/forms/AnnualOverhaulingPlan';



// Report Imports
import DailyPowerPressChecksheetPrint from '../components/All_Deperments_Hub/MaintenanceHub/Report/DailyPowerPressChecksheetprint';
import MachineBreakdownSummaryPrint from '../components/All_Deperments_Hub/MaintenanceHub/Report/MachineBreakdownSummaryPrint';
import MachineHistoryCardPrint from '../components/All_Deperments_Hub/MaintenanceHub/Report/MachineHistoryCardprint';
import ToolHistoryReport from '../components/All_Deperments_Hub/MaintenanceHub/Report/ToolHistoryReport';

const MachineRoutes = () => {
    return (
        <Routes>
<<<<<<< Updated upstream
            {/* Forms Routes */}
=======
            {/* --- DAILY ROUTES --- */}
>>>>>>> Stashed changes
            <Route path="history-card" element={<MachineHistoryCard />} />
            <Route path="power-press-checksheet" element={<DailyPowerPressChecksheet />} />
            <Route path="breakdown-form" element={<MachineBreakDownForm />} />
            
            {/* --- WEEKLY ROUTES --- */}
            <Route path="weekly-reports" element={<WeeklyReports />} />
            <Route path="preventive-vmc" element={<MachinePreventMainForm />} />
            <Route path="preventive-cnc" element={<CncPreventiveMaintenanceForm />} />
<<<<<<< Updated upstream
            <Route path="weekly-reports" element={<WeeklyReports />} />
            
            {/* Dynamic route */}
            <Route path="preventive-:machineName" element={<MachinePreventMainForm />} />

            {/* --- Report / Print Routes (Paths updated to match your URL) --- */}
            
            {/* Ab ye URL "breakdown-form/print" par khulega */}
            <Route path="breakdown-form/print" element={<MachineBreakdownSummaryPrint />} />
            
            <Route path="power-press-checksheet/print" element={<DailyPowerPressChecksheetPrint />} />
            <Route path="history-card/print" element={<MachineHistoryCardPrint />} />
            <Route path="tool-history/report" element={<ToolHistoryReport />} />
=======
            <Route path="preventive-:machineName" element={<MachinePreventMainForm />} />

            {/* --- MONTHLY ROUTES --- */}
            <Route path="monthly" element={<MachineMonthlyReport />} />
            <Route path="breakdown-summary" element={<MachineBreakdownSummary/>} />
            <Route path="why-why-analysis" element={<WhyAnalysisForm />} />
            <Route path="critical-spares" element={<CriticalSparesForm />} />

            {/* --- YEARLY ROUTES --- */}
            <Route path="yearly" element={<MachineYearlyReport />} />
            
            {/* 🔥 Yearly Sub-Forms Routes (Machine Hub) */}
            <Route path="master-list-mc" element={<MasterMachineList />} /> {/* Master List of Machine */}
            <Route path="annual-preventive-plan" element={<MachineOverhaulingList />} /> {/* Annual Preventive Plan */}
            <Route path="mc-overhauling-list" element={<MachineOverhaulingList/>} /> {/* List of Machine for Overhauling */}
            <Route path="annual-overhauling-plan" element={<AnnualOverhaulingPlan  />} /> {/* Annual Overhauling Plan */}

>>>>>>> Stashed changes
        </Routes>
    );
};

export default MachineRoutes;