import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- Views Imports ---
import ToolDailyReports from '../components/All_Deperments_Hub/MaintenanceHub/views/ToolDailyReports';
import ToolMonthlyReport from '../components/All_Deperments_Hub/MaintenanceHub/views/ToolMonthlyReport';

// --- Forms Imports ---
import ToolHistoryForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/ToolHistoryForm';
import ToolPrevMaintenanceForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/ToolPrevMaintenanceForm';
import ToolBreakdownForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/ToolBreakdownForm';
import WeldingFixtureForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/WeldingFixtureForm';
import BushPinChart from '../components/All_Deperments_Hub/MaintenanceHub/forms/BushPinChart';

// 🔥 FIX: Sahi file se sahi components import karein
import ToolBreakdownSummaryForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/ToolBreakdownSummaryForm';
import WhyToolAnalysisForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/WhyToolAnalysisForm';
import ToolCriticalSparesForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/ToolCriticalSparesForm';
import MasterToolList from '../components/All_Deperments_Hub/MaintenanceHub/forms/MasterToolList';
import MasterGaugeList from '../components/All_Deperments_Hub/MaintenanceHub/forms/MasterGaugeList';
import WeldingFixtureList from '../components/All_Deperments_Hub/MaintenanceHub/forms/WeldingFixtureList';

const ToolRoutes = () => {
    return (
        <Routes>
            {/* Standard Routes */}
            <Route path="daily" element={<ToolDailyReports />} />
            <Route path="monthly" element={<ToolMonthlyReport />} />
            
            {/* Form Routes */}
            <Route path="history-form" element={<ToolHistoryForm />} />
            <Route path="pm-checklist" element={<ToolPrevMaintenanceForm />} />
            <Route path="breakdown-form" element={<ToolBreakdownForm />} />
            <Route path="welding-fixture-checklist" element={<WeldingFixtureForm />} />
            <Route path="bush-check-point" element={<BushPinChart />} />

            {/* 🔥 Monthly Specific Form Routes */}
            <Route path="breakdown-summary" element={<ToolBreakdownSummaryForm />} />
            <Route path="why-analysis" element={<WhyToolAnalysisForm />} />
            <Route path="critical-spares" element={<ToolCriticalSparesForm />} />

            <Route path="master-tool-list" element={<MasterToolList />} />
            <Route path="master-gauge-list" element={<MasterGaugeList />} />
            <Route path="welding-fixture-list" element={<WeldingFixtureList />} /> 
        </Routes>
    );
};

export default ToolRoutes;