import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Sahi paths yahan hain:
import ToolDailyReports from '../components/All_Deperments_Hub/MaintenanceHub/views/ToolDailyReports';
import BushPinChart from '../components/All_Deperments_Hub/MaintenanceHub/forms/BushPinChart';
import WeldingFixtureForm from '../components/All_Deperments_Hub/MaintenanceHub/forms/WeldingFixtureForm';

const ToolRoutes = () => {
    return (
        <Routes>
            {/* Base path /Maintenance/Tool/ se linked sub-routes */}
            <Route path="Daily-Reports" element={<ToolDailyReports />} />
            <Route path="Weekly-Chart" element={<BushPinChart />} />
            <Route path="Weekly-Checklist" element={<WeldingFixtureForm />} />
        </Routes>
    );
};

export default ToolRoutes;