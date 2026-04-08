import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Forms Imports
import ToolHistoryForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/ToolHistoryForm';
import ToolPrevMaintenanceForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/ToolPrevMaintenanceForm';
import ToolBreakdownForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/ToolBreakdownForm';
import WeldingFixtureForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/WeldingFixtureForm'; // 🔥 Ensure this import exists

// Views Imports
import ToolDailyReports from '../components/All_Deperments_Hub/MaintenanceHub/views/ToolDailyReports';

const ToolRoutes = () => {
    return (
        <Routes>
            {/* Relative paths use karein (No leading slash) */}
            <Route path="history-form" element={<ToolHistoryForm />} />
            <Route path="pm-checklist" element={<ToolPrevMaintenanceForm />} />
            <Route path="breakdown-form" element={<ToolBreakdownForm />} />
            
            {/* 🔥 Path should be 'daily' because MaintenanceHub navigates to /Maintenance/Tool/daily */}
            <Route path="daily" element={<ToolDailyReports />} />
            
            {/* 🔥 FIX: Path should only be the last part of the URL */}
            <Route path="welding-fixture-checklist" element={<WeldingFixtureForm />} />
        </Routes>
    );
};

export default ToolRoutes;