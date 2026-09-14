import React, { useState } from 'react';
import './OperatorAssignmentMaster.css';

// Yahan imports ko dhyan se match karo
import OperatorDashboard from './OperatorDashboard'; // Naya naam
import AssignMachine from './AssignMachine';
import MachineHistory from './MachineHistory';
import OperatorProfile from './OperatorProfile';
import WorkPlan from './WorkPlan';

export default function OperatorAssignmentMaster() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="operator-module-container">
      <div className="module-tabs-wrapper">
        <div className="module-tabs">
          <button 
            className={`mod-tab ${activeTab === 'dashboard' ? 'active' : ''}`} 
            onClick={() => setActiveTab('dashboard')}
          >
            Current Assignments
          </button>
          <button 
            className={`mod-tab ${activeTab === 'assign' ? 'active' : ''}`} 
            onClick={() => setActiveTab('assign')}
          >
            Assign Operator
          </button>
          <button 
            className={`mod-tab ${activeTab === 'machine_history' ? 'active' : ''}`} 
            onClick={() => setActiveTab('machine_history')}
          >
            Machine History
          </button>
          <button 
            className={`mod-tab ${activeTab === 'operator_history' ? 'active' : ''}`} 
            onClick={() => setActiveTab('operator_history')}
          >
            Operator History
          </button>
          <button 
            className={`mod-tab ${activeTab === 'work_plan' ? 'active' : ''}`} 
            onClick={() => setActiveTab('work_plan')}
          >
            Work Plan
          </button>
        </div>
      </div>

      {/* Render the selected screen */}
      <div className="module-content">
        {activeTab === 'dashboard' && <OperatorDashboard />}
        {activeTab === 'assign' && <AssignMachine />}
        {activeTab === 'machine_history' && <MachineHistory />}
        {activeTab === 'operator_history' && <OperatorProfile />}
        {activeTab === 'work_plan' && <WorkPlan />}
      </div>
    </div>
  );
}