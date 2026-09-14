import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './OperatorAssignmentMaster.css';

// Components
import OperatorDashboard from './OperatorDashboard'; 
import AssignMachine from './AssignMachine';
import MachineHistory from './MachineHistory';
import OperatorProfile from './OperatorProfile';
import WorkPlan from './WorkPlan';

// Main Sidebar import
import Sidebar from '../Sidebar';

export default function OperatorAssignmentMaster({ onLogout }) {
  return (
    <div className="operator-layout-wrapper">
      
      {/* 1. Global Sidebar */}
      <Sidebar onLogout={onLogout} />

      {/* 2. Direct Content Area (No top tabs) */}
      <div className="operator-module-container">
        <Routes>
          {/* Default redirect to Current Assignments */}
          <Route path="/" element={<Navigate to="current-assignments" replace />} />
          
          {/* Individual Pages */}
          <Route path="current-assignments" element={<OperatorDashboard />} />
          <Route path="assign-operator" element={<AssignMachine />} />
          <Route path="machine-history" element={<MachineHistory />} />
          <Route path="operator-history" element={<OperatorProfile />} />
          <Route path="work-plan" element={<WorkPlan />} />
        </Routes>
      </div>

    </div>
  );
}