import './index.css';              
import 'bootstrap/dist/css/bootstrap.min.css';
import Count52Live from './components/Count52Live';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import AssignMachine from './components/AssignMachine';
import IdleCase from './components/IdleCase';
import MachineAssignments from './components/MachineAssignments';
import IdleReportsList from './components/IdleReportsList';
import MachinesStatus from './components/MachinesStatus';
import Plant2Live from './components/Plant2Live';
import Plant1Live from './components/Plant1Live';
import LandingPage from './components/LandingPage';
import SignUpPage from './components/SignUpPage';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import Support from './components/Support';

// ========== QMS IMPORTS ==========
import QMSDashboard from './components/qms/QMSDashboard';
import ReportDetail from './components/qms/ReportDetail';
import ReportEditor from './components/qms/ReportEditor';
import PatrolInspection from './components/qms/PatrolInspection';
import ReportsDashboard from './components/qms/ReportsDashboard';
import RawMaterialForm from './components/qms/RawMaterialForm'; 
import MaintenanceHub from './components/All_Deperments_Hub/MaintenanceHub/MaintenanceHub';


// ========== QaHub IMPORTS ==========
import QaHub from './components/All_Deperments_Hub/QaHub/QaHub';
import IncomingMaterialInsp from './components/All_Deperments_Hub/QaHub/IncomingMaterialInsp';
import RedbinAttendance from './components/All_Deperments_Hub/QaHub/RedbinAttendance';
import RedBinForm from './components/All_Deperments_Hub/QaHub/RedBinForm';
import ScrapNote from "./components/All_Deperments_Hub/QaHub/ScrapNoteForm";
import GoodReceiptFrom from './components/All_Deperments_Hub/QaHub/GoodReceiptFrom';
import PokaYokeChecksheet from './components/All_Deperments_Hub/QaHub/PokaYokeChecksheet';
import ReworkRepair from './components/All_Deperments_Hub/QaHub/ReworkRepair';
import InspectionForm from './components/All_Deperments_Hub/QaHub/InspectionForm';
import PdiReportForm from './components/All_Deperments_Hub/QaHub/PdiReportForm';
import SampleInspectionReport from './components/All_Deperments_Hub/QaHub/SampleInspectionReport';



// ========== ProductionHub & HrSafetyHub IMPORTS ==========
import ProductionHub from './components/All_Deperments_Hub/ProductionHub/ProductionHub';
import Operator5S from './components/All_Deperments_Hub/ProductionHub/Operator_5s';
import HrSafetyHub from './components/All_Deperments_Hub/HrSafetyHub/HrSafetyHub';
import InductionTrainingForm from './components/All_Deperments_Hub/HrSafetyHub/InductionTrainingForm';
import TrainingHistoryCard from './components/All_Deperments_Hub/HrSafetyHub/TrainingHistoryCard';
import BinTrollingForm from './components/All_Deperments_Hub/ProductionHub/BinTrollingForm';
import DailyProdForm from './components/All_Deperments_Hub/ProductionHub/DailyProdForm';
import TipChangeMonitorForm from './components/All_Deperments_Hub/ProductionHub/TipChangeMonitorForm';
import M_ChangeTrackForm from './components/All_Deperments_Hub/ProductionHub/M_ChangeTrackForm';
import MachineHistoryCard from './components/All_Deperments_Hub/MaintenanceHub/MachineHistoryCard';
import DailyPowerPressChecksheet from '././components/All_Deperments_Hub/MaintenanceHub/DailyPowerPressChecksheet'
import ToolHistoryForm from './components/All_Deperments_Hub/MaintenanceHub/ToolHistoryForm';
import MachineBreakDownForm from './components/All_Deperments_Hub/MaintenanceHub/MachineBreakDownForm';
import ToolPrevMaintenanceForm from './components/All_Deperments_Hub/MaintenanceHub/ToolPrevMaintenanceForm';
import SampleInsForm from './components/All_Deperments_Hub/QaHub/SampleInsForm';
import For_M_Change_Ins_Form from './components/All_Deperments_Hub/ProductionHub/For_M_Change_Ins_Form';
import DeviationApprovalForm from './components/All_Deperments_Hub/QaHub/DeviationApprovalForm';
import './App.css';
import ForMChangeInsPrint from './components/All_Deperments_Hub/ProductionHub/ForMChangeInsPrint';

import BinTrollingprint from './components/All_Deperments_Hub/ProductionHub/BinTrollingprint';
import DailyProdprint from './components/All_Deperments_Hub/ProductionHub/DailyProdprint';
import ForMChangeRecordPrint from './components/All_Deperments_Hub/ProductionHub/ForMChangeRecordPrint';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = () => {
    console.log('✅ Login successful - Auth TRUE');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    console.log('🚪 Logout - Auth FALSE');
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const ProtectedRoute = ({ children }) => {
    console.log('🔒 Protected Route Check - isAuthenticated:', isAuthenticated);
    if (!isAuthenticated) {
      console.log('❌ Not authenticated - Redirecting to /login');
      return <Navigate to="/login" replace />;
    }
    console.log('✅ Authenticated - Rendering component');
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUpPage onLogin={handleLogin} />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard onLogout={handleLogout} /></ProtectedRoute>} />

          {/* ========== QMS ROUTES ========== */}
          <Route path="/qms" element={<ProtectedRoute><ReportsDashboard /></ProtectedRoute>} />
          <Route path="/ReportsDashboard" element={<ProtectedRoute><ReportsDashboard /></ProtectedRoute>} /> 
          <Route path="/qms/reports-dashboard" element={<ProtectedRoute><ReportsDashboard /></ProtectedRoute>} />
          
          <Route path="/qms-dashboard" element={<ProtectedRoute><QMSDashboard onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/quality-management" element={<ProtectedRoute><QMSDashboard onLogout={handleLogout} /></ProtectedRoute>} />

          {/* QMS REPORT ROUTES */}
          <Route path="/qms/report/:reportId" element={<ProtectedRoute><ReportDetail /></ProtectedRoute>} />
          <Route path="/qms/report/:reportId/edit" element={<ProtectedRoute><ReportEditor /></ProtectedRoute>} />
          <Route path="/qms/patrol-inspection" element={<ProtectedRoute><PatrolInspection /></ProtectedRoute>} />
          <Route path="/qms/inspection-form" element={<ProtectedRoute><InspectionForm /></ProtectedRoute>} />
          <Route path="/qms/raw-material-form" element={<ProtectedRoute><RawMaterialForm /></ProtectedRoute>} />
          <Route path="/qms/pdi-report-form" element={<ProtectedRoute><PdiReportForm /></ProtectedRoute>} />

          {/* ========== PLANT ROUTES ========== */}
          <Route path="/plant1" element={<ProtectedRoute><Plant1Live onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/plant1-live" element={<ProtectedRoute><Plant1Live onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/plant2" element={<ProtectedRoute><Plant2Live onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/plant2-live" element={<ProtectedRoute><Plant2Live onLogout={handleLogout} /></ProtectedRoute>} />

          {/* ========== OPERATIONS & ASSIGNMENTS ========== */}
          <Route path="/assignment" element={<ProtectedRoute><AssignMachine onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/assign-machine" element={<ProtectedRoute><AssignMachine onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/machine-assignments" element={<ProtectedRoute><MachineAssignments onLogout={handleLogout} /></ProtectedRoute>} />

          {/* ========== IDLE REPORTS ========== */}
          <Route path="/idle-case" element={<ProtectedRoute><IdleCase onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/idle-report-submit" element={<ProtectedRoute><IdleCase onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/idle-reports-list" element={<ProtectedRoute><IdleReportsList onLogout={handleLogout} /></ProtectedRoute>} />

          {/* ========== MACHINES STATUS ========== */}
          <Route path="/machines-status" element={<ProtectedRoute><MachinesStatus onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/count52" element={<ProtectedRoute><Count52Live onLogout={handleLogout} /></ProtectedRoute>} />

          {/* ========== PROFILE & SETTINGS ========== */}
          <Route path="/profile" element={<ProtectedRoute><Profile onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><Support onLogout={handleLogout} /></ProtectedRoute>} />

          {/* 🔥 SIDEBAR HUB ROUTES 🔥 */}
          <Route path="/maintenance-hub" element={<ProtectedRoute><MaintenanceHub /></ProtectedRoute>} />
          
                 
          {/*----- QaHub Pages -----*/}
          <Route path="/qa-hub" element={<ProtectedRoute><QaHub /></ProtectedRoute>} />
          <Route path="/Incoming-Material" element={<ProtectedRoute><IncomingMaterialInsp /></ProtectedRoute>} />
          <Route path="/Redbin-Attendance" element={<ProtectedRoute><RedbinAttendance /></ProtectedRoute>} />
          <Route path="/RedBin-Form" element={<ProtectedRoute><RedBinForm /></ProtectedRoute>} />
          <Route path="/Scrap-Note" element={<ProtectedRoute><ScrapNote /></ProtectedRoute>} />
          <Route path="/Good-Receipt" element={<ProtectedRoute><GoodReceiptFrom /></ProtectedRoute>} />
          <Route path="/Poka-Yoke" element={<ProtectedRoute><PokaYokeChecksheet /></ProtectedRoute>} />
          <Route path="/inspection-form" element={<ProtectedRoute><InspectionForm /></ProtectedRoute>} />
          <Route path="/Rework" element={<ProtectedRoute><ReworkRepair /></ProtectedRoute>} />
          <Route path="/pdi-report-form" element={<ProtectedRoute><PdiReportForm /></ProtectedRoute>} />
          <Route path="/sample-inspection" element={<ProtectedRoute><SampleInspectionReport /></ProtectedRoute>} />
          {/* ----- HrSafetyHub Pages ----- */}
          <Route path="/hiring-departments" element={<ProtectedRoute><HrSafetyHub /></ProtectedRoute>} />
          <Route path="/Induction-Training" element={<ProtectedRoute><InductionTrainingForm /></ProtectedRoute>} />
          <Route path="/Training-History" element={<ProtectedRoute><TrainingHistoryCard /></ProtectedRoute>} />

          {/* ----- ProductionHub Pages ----- */}
          <Route path="/production-hub" element={<ProtectedRoute><ProductionHub /></ProtectedRoute>} />

          <Route path="/Operator5S" element={<ProtectedRoute><Operator5S/></ProtectedRoute>}/>
           <Route path="/Daily-Prod-Plan-Form" element={<ProtectedRoute><DailyProdForm /></ProtectedRoute>} />
             <Route path="/Bin-Trolly-Cleaning-Form" element={<ProtectedRoute><BinTrollingForm /></ProtectedRoute>} />
               <Route path="/Tip-Change-Monitor-Form" element={<ProtectedRoute><TipChangeMonitorForm /></ProtectedRoute>} />
               <Route path="/4M-Change-Tracking-Form" element={<ProtectedRoute><M_ChangeTrackForm/></ProtectedRoute>}/>
               <Route path='/Machine-Card-Form' element={<ProtectedRoute><MachineHistoryCard/></ProtectedRoute>}/>
                <Route path='/Tool-History-Form' element={<ProtectedRoute><ToolHistoryForm/></ProtectedRoute>}/>
            <Route path='/Daily-PowerPress-Checksheet' element={<ProtectedRoute><DailyPowerPressChecksheet/></ProtectedRoute>}/>

            <Route path='/Tool-Breakdown-Form' element={<ProtectedRoute><MachineBreakDownForm/></ProtectedRoute>}/>
            <Route path='/Tool-PM-Checklist-Form' element={<ProtectedRoute><ToolPrevMaintenanceForm/></ProtectedRoute>}/>
            <Route path='/Sample-Ins-Form' element={<ProtectedRoute><SampleInsForm/></ProtectedRoute>}/>
            <Route path='/4-M-Ins-Form' element={<ProtectedRoute><For_M_Change_Ins_Form/></ProtectedRoute>}/>
            <Route path='/Deviation-Approval-Form' element={<ProtectedRoute><DeviationApprovalForm/></ProtectedRoute>}/>
            <Route path='/4M-Change-Inspection-Report' element={<ProtectedRoute><ForMChangeInsPrint/></ProtectedRoute>}/>



           <Route path="/Bin-Trolly-Cleaning-Report" element={<BinTrollingprint currentReport={null} />} />
           <Route path="/Daily-Prod-Plan-Report" element={<DailyProdprint currentReport={null}/>} />
           <Route path="/4M-Change-Tracking-Report" element={<ForMChangeRecordPrint currentReport={null} />} />
          {/* ========== 404 NOT FOUND ========== */}
          <Route 
            path="*" 
            element={
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: 'white', fontSize: '24px', flexDirection: 'column', gap: '20px'}}>
                <div style={{ fontSize: '72px', fontWeight: 'bold' }}>404</div>
                <div>Page Not Found</div>
                <button onClick={() => window.location.href = '/'} style={{padding: '12px 24px', background: 'linear-gradient(to right, #06b6d4, #fbbf24)', border: 'none', borderRadius: '8px', color: '#0f172a', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s ease'}}>Go to Home</button>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;