// import './index.css';              
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Core Components
// import Auth from './components/Auth';
// import Dashboard from './components/Dashboard';
// import AssignMachine from './components/AssignMachine';
// import IdleCase from './components/IdleCase';
// import MachineAssignments from './components/MachineAssignments';
// import IdleReportsList from './components/IdleReportsList';
// import MachinesStatus from './components/MachinesStatus';
// import Plant2Live from './components/Plant2Live';
// import Plant1Live from './components/Plant1Live';
// import LandingPage from './components/LandingPage';
// import SignUpPage from './components/SignUpPage';
// import Notifications from './components/Notifications';
// import Profile from './components/Profile';
// import Support from './components/Support';
// import ProductionHistory from './components/ProductionHistory';

// // ========== QMS IMPORTS ==========
// import QMSDashboard from './components/qms/QMSDashboard';
// import ReportDetail from './components/qms/ReportDetail';
// import ReportEditor from './components/qms/ReportEditor';
// import PatrolInspection from './components/qms/PatrolInspection';
// import ReportsDashboard from './components/qms/ReportsDashboard';
// import RawMaterialForm from './components/qms/RawMaterialForm'; 

// // ========== QaHub IMPORTS ==========
// import QaHub from './components/All_Deperments_Hub/QaHub/QaHub';
// import IncomingMaterialInsp from './components/All_Deperments_Hub/QaHub/IncomingMaterialInsp';
// import RedbinAttendance from './components/All_Deperments_Hub/QaHub/RedbinAttendance';
// import RedBinForm from './components/All_Deperments_Hub/QaHub/RedBinForm';
// import ScrapNote from "./components/All_Deperments_Hub/QaHub/ScrapNoteForm";
// import GoodReceiptFrom from './components/All_Deperments_Hub/QaHub/GoodReceiptFrom';
// import PokaYokeChecksheet from './components/All_Deperments_Hub/QaHub/PokaYokeChecksheet';
// import ReworkRepair from './components/All_Deperments_Hub/QaHub/ReworkRepair';
// import InspectionForm from './components/All_Deperments_Hub/QaHub/InspectionForm';
// import PdiReportForm from './components/All_Deperments_Hub/QaHub/PdiReportForm';
// import SampleInspectionReport from './components/All_Deperments_Hub/QaHub/SampleInspectionReport';
// import DeviationApprovalForm from './components/All_Deperments_Hub/QaHub/DeviationApprovalForm';

// // Print Components (QA)
// import RedBinprint from './components/All_Deperments_Hub/QaHub/RedBinprint';
// import RedBinAttendanceprint from './components/All_Deperments_Hub/QaHub/RedBinAttendanceprint';
// import Scrapnoteprint from './components/All_Deperments_Hub/QaHub/Scrapnoteprint';
// import Reworkrepairprint from './components/All_Deperments_Hub/QaHub/Reworkrepairprint';
// import PdiReportprint from './components/All_Deperments_Hub/QaHub/PdiReportprint';
// import PokaYokeChecksheetprint from './components/All_Deperments_Hub/QaHub/PokaYokeChecksheetprint';
// import DeviationApprovalprint from './components/All_Deperments_Hub/QaHub/DeviationApprovalprint';
// import Inspectionprint from './components/All_Deperments_Hub/QaHub/Inspectionprint';
// import IncomingMaterialprint from './components/All_Deperments_Hub/QaHub/IncomingMaterialprint';
// import SampleInspectionprint from './components/All_Deperments_Hub/QaHub/SampleInspectionprint';

// import ProductionHub from './components/All_Deperments_Hub/ProductionHub/ProductionHub';
// import ProductionView from './components/All_Deperments_Hub/ProductionHub/ProductionView';
// import Operator5S from './components/All_Deperments_Hub/ProductionHub/Operator_5s';
// import Operator5sprint from './components/All_Deperments_Hub/ProductionHub/Operator5sprint';
// import HrSafetyHub from './components/All_Deperments_Hub/HrSafetyHub/HrSafetyHub';
// import InductionTrainingForm from './components/All_Deperments_Hub/HrSafetyHub/InductionTrainingForm';
// import TrainingHistoryCard from './components/All_Deperments_Hub/HrSafetyHub/TrainingHistoryCard';
// import BinTrollingForm from './components/All_Deperments_Hub/ProductionHub/BinTrollingForm';
// import DailyProdForm from './components/All_Deperments_Hub/ProductionHub/DailyProdForm';
// import TipChangeMonitorForm from './components/All_Deperments_Hub/ProductionHub/TipChangeMonitorForm';
// import TipChangeMonitorprint from './components/All_Deperments_Hub/ProductionHub/TipChangeMonitorprint';
// import MChangeTrackForm from './components/All_Deperments_Hub/ProductionHub/M_ChangeTrackForm'; 
// import ForMChangeInsForm from './components/All_Deperments_Hub/ProductionHub/For_M_Change_Ins_Form'; 

// // ========== Maintenance Hub IMPORTS ==========
// import MaintenanceHub from './components/All_Deperments_Hub/MaintenanceHub/MaintenanceHub';
// import MaintenanceView from './components/All_Deperments_Hub/MaintenanceHub/MaintenanceView';
// import MachineHistoryCard from './components/All_Deperments_Hub/MaintenanceHub/forms/MachineHistoryCard';
// import DailyPowerPressChecksheet from './components/All_Deperments_Hub/MaintenanceHub/forms/DailyPowerPressChecksheet';

// import ToolHistoryForm from './components/All_Deperments_Hub/MaintenanceHub/forms/ToolHistoryForm';
// import MachineBreakDownForm from './components/All_Deperments_Hub/MaintenanceHub/forms/MachineBreakDownForm';
// import ToolPrevMaintenanceForm from './components/All_Deperments_Hub/MaintenanceHub/forms/ToolPrevMaintenanceForm';


// import MachinePreventForm from './components/All_Deperments_Hub/MaintenanceHub/forms/MachinePreventMainForm';
// import CNCPreventiveMaintenanceForm from './components/All_Deperments_Hub/MaintenanceHub/forms/CNCPreventiveMaintenanceForm';
// import PowerPressForm from './components/All_Deperments_Hub/MaintenanceHub/forms/PowerPressPreventiveMaintenanceForm';
// import MachineDailyReport from './components/All_Deperments_Hub/MaintenanceHub/views/MachineDailyReport';
// import MachineWeeklyReports from './components/All_Deperments_Hub/MaintenanceHub/views/MachineWeeklyReport';
// import ToolDailyReports from './components/All_Deperments_Hub/MaintenanceHub/views/ToolDailyReports';
// import ToolWeekly from './components/All_Deperments_Hub/MaintenanceHub/views/ToolWeekly'; 
// import MachineRoutes from './routes/MachineRoutes';
// import ToolRoutes from './routes/ToolRoutes';

// import ForMChangeInsPrint from './components/All_Deperments_Hub/ProductionHub/ForMChangeInsPrint';
// import BinTrollingprint from './components/All_Deperments_Hub/ProductionHub/BinTrollingprint';
// import DailyProdprint from './components/All_Deperments_Hub/ProductionHub/DailyProdprint';
// import ForMChangeRecordPrint from './components/All_Deperments_Hub/ProductionHub/ForMChangeRecordPrint';
// import DailyPowerPressChecksheetprint from './components/All_Deperments_Hub/MaintenanceHub/Report/DailyPowerPressChecksheetprint';
// import MachineHistoryCardprint from './components/All_Deperments_Hub/MaintenanceHub/Report/MachineHistoryCardprint';
// import MachineBreakdownSummaryPrint from './components/All_Deperments_Hub/MaintenanceHub/Report/MachineBreakdownSummaryPrint';
// import Qaview from './components/All_Deperments_Hub/QaHub/Qaview';
// // ==========================================
// // PUSH NOTIFICATION CONFIGURATION
// // ==========================================
// const publicVapidKey = 'BEvBWcf0GgkwpO5snMzIeJy2btb1tjKfUZbkIvBoFfZx6TqwB5EKe7uYhhrBasBgmHJkm2GRa1aDNSsWX8KPPZk';

// function urlBase64ToUint8Array(base64String) {
//   const padding = '='.repeat((4 - base64String.length % 4) % 4);
//   const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);
//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }
// // ==========================================

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     const savedAuth = localStorage.getItem('isAuthenticated');
//     return savedAuth === 'true';
//   });

//   // ==========================================
//   // PUSH NOTIFICATION LIFECYCLE
//   // ==========================================
//   useEffect(() => {
//     if ('serviceWorker' in navigator && 'PushManager' in window) {
//       navigator.serviceWorker.register('/sw.js')
//         .then(function(registration) {
//           console.log('Service Worker Registered Successfully');
          
//           Notification.requestPermission().then(permission => {
//             if (permission === 'granted') {
//               subscribeUser(registration);
//             }
//           });
//         })
//         .catch(function(error) {
//           console.error('Service Worker Error:', error);
//         });
//     }
//   }, []); 

//   const subscribeUser = async (registration) => {
//     try {
//       const subscription = await registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
//       });
      
//       console.log('Subscription Object Generated:', subscription);

//       // Backend API ko data bhejna
//       fetch('http://192.168.0.34:8000/api/save-subscription/', {
//         method: 'POST',
//         body: JSON.stringify(subscription),
//         headers: { 'Content-Type': 'application/json' }
//       })
//       .then(res => res.json())
//       .then(data => console.log('Saved in Django Database:', data))
//       .catch(err => console.log('API Fetch Error:', err));

//     } catch (err) {
//       console.log('Failed to subscribe user:', err);
//     }
//   };
//   // ==========================================

//   useEffect(() => {
//     localStorage.setItem('isAuthenticated', isAuthenticated);
//   }, [isAuthenticated]);

//   const handleLogin = () => setIsAuthenticated(true);
//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     localStorage.removeItem('isAuthenticated');
//   };

//   const ProtectedRoute = ({ children }) => {
//     if (!isAuthenticated) return <Navigate to="/login" replace />;
//     return children;
//   };

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* Core Routes */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Auth onLogin={handleLogin} />} />
//           <Route path="/signup" element={<SignUpPage onLogin={handleLogin} />} />
//           <Route path="/dashboard" element={<ProtectedRoute><Dashboard onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path='/Production-history' element={<ProtectedRoute><ProductionHistory/></ProtectedRoute>}/>

//           {/* QMS ROUTES */}
//           <Route path="/qms" element={<ProtectedRoute><ReportsDashboard /></ProtectedRoute>} />
//           <Route path="/ReportsDashboard" element={<ProtectedRoute><ReportsDashboard /></ProtectedRoute>} /> 
//           <Route path="/qms/reports-dashboard" element={<ProtectedRoute><ReportsDashboard /></ProtectedRoute>} />
//           <Route path="/qms-dashboard" element={<ProtectedRoute><QMSDashboard onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/quality-management" element={<ProtectedRoute><QMSDashboard onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/qms/report/:reportId" element={<ProtectedRoute><ReportDetail /></ProtectedRoute>} />
//           <Route path="/qms/report/:reportId/edit" element={<ProtectedRoute><ReportEditor /></ProtectedRoute>} />
//           <Route path="/qms/patrol-inspection" element={<ProtectedRoute><PatrolInspection /></ProtectedRoute>} />
//           <Route path="/qms/raw-material-form" element={<ProtectedRoute><RawMaterialForm /></ProtectedRoute>} />
//           <Route path="/qms/pdi-report-form" element={<ProtectedRoute><PdiReportForm /></ProtectedRoute>} />

//           {/* PLANT STATUS */}
//           <Route path="/plant1-live" element={<ProtectedRoute><Plant1Live onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/plant2-live" element={<ProtectedRoute><Plant2Live onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/machines-status" element={<ProtectedRoute><MachinesStatus onLogout={handleLogout} /></ProtectedRoute>} />

//           {/* OPERATIONS */}
//           <Route path="/assignment" element={<ProtectedRoute><AssignMachine onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/machine-assignments" element={<ProtectedRoute><MachineAssignments onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/idle-case" element={<ProtectedRoute><IdleCase onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/idle-reports-list" element={<ProtectedRoute><IdleReportsList onLogout={handleLogout} /></ProtectedRoute>} />

//           {/* PROFILE */}
//           <Route path="/profile" element={<ProtectedRoute><Profile onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/notifications" element={<ProtectedRoute><Notifications onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/support" element={<ProtectedRoute><Support onLogout={handleLogout} /></ProtectedRoute>} />

//           {/* QaHub Pages */}
//           <Route path="/qa-hub" element={<ProtectedRoute><QaHub /></ProtectedRoute>} />
//           <Route path="/Incoming-Material" element={<ProtectedRoute><IncomingMaterialInsp /></ProtectedRoute>} />
//           <Route path="/Redbin-Attendance" element={<ProtectedRoute><RedbinAttendance /></ProtectedRoute>} />
//           <Route path="/RedBin-Form" element={<ProtectedRoute><RedBinForm /></ProtectedRoute>} />
//           <Route path="/Scrap-Note" element={<ProtectedRoute><ScrapNote /></ProtectedRoute>} />
//           <Route path="/Good-Receipt" element={<ProtectedRoute><GoodReceiptFrom /></ProtectedRoute>} />
//           <Route path="/Poka-Yoke" element={<ProtectedRoute><PokaYokeChecksheet /></ProtectedRoute>} />
//           <Route path="/inspection-form" element={<ProtectedRoute><InspectionForm /></ProtectedRoute>} />
//           <Route path="/Rework" element={<ProtectedRoute><ReworkRepair /></ProtectedRoute>} />
//           <Route path="/sample-inspection" element={<ProtectedRoute><SampleInspectionReport /></ProtectedRoute>} />
//           <Route path="/Deviation-Approval-Form" element={<ProtectedRoute><DeviationApprovalForm/></ProtectedRoute>}/>
//           <Route path="/pdi-report-form" element={<ProtectedRoute><PdiReportForm /></ProtectedRoute>} />
//           {/* QaHub Print */}
//           <Route path="/incomingmaterial-report" element={<ProtectedRoute><IncomingMaterialprint /></ProtectedRoute>} />
//           <Route path="/redbin-analysis-report" element={<ProtectedRoute><RedBinprint /></ProtectedRoute>} />
//           <Route path="/scrap-note-report" element={<ProtectedRoute><Scrapnoteprint /></ProtectedRoute>} />
//           <Route path="/redbin-attendance-report" element={<ProtectedRoute><RedBinAttendanceprint /></ProtectedRoute>} />
//           <Route path="/PokaYoke-report" element={<ProtectedRoute><PokaYokeChecksheetprint /></ProtectedRoute>} />
//           <Route path="/inspection-report" element={<ProtectedRoute><Inspectionprint /></ProtectedRoute>} />
//           <Route path="/rework-report" element={<ProtectedRoute><Reworkrepairprint /></ProtectedRoute>} />
//           <Route path="/sample-inspection-report" element={<ProtectedRoute><SampleInspectionprint /></ProtectedRoute>} />
//           <Route path="/Deviation-report" element={<ProtectedRoute><DeviationApprovalprint /></ProtectedRoute>} />
//           <Route path="/pdiprint-report" element={<ProtectedRoute><PdiReportprint /></ProtectedRoute>} />

//           {/* HrSafetyHub */}
//           <Route path="/hiring-departments" element={<ProtectedRoute><HrSafetyHub /></ProtectedRoute>} />
//           <Route path="/Induction-Training" element={<ProtectedRoute><InductionTrainingForm /></ProtectedRoute>} />
//           <Route path="/Training-History" element={<ProtectedRoute><TrainingHistoryCard /></ProtectedRoute>} />

//           {/* ProductionHub */}
//           <Route path="/production-hub" element={<ProtectedRoute><ProductionHub /></ProtectedRoute>} />
//           <Route path="/Production/View/:formKey" element={<ProtectedRoute><ProductionView /></ProtectedRoute>} />
//           <Route path="/Operator5S" element={<ProtectedRoute><Operator5S/></ProtectedRoute>}/>
//           <Route path="/Operator5S-Report" element={<ProtectedRoute><Operator5sprint/></ProtectedRoute>} />
//           <Route path="/Daily-Prod-Plan-Form" element={<ProtectedRoute><DailyProdForm /></ProtectedRoute>} />
//           <Route path="/Bin-Trolly-Cleaning-Form" element={<ProtectedRoute><BinTrollingForm /></ProtectedRoute>} />
          // <Route path="/Tip-Change-Monitor-Form" element={<ProtectedRoute><TipChangeMonitorForm /></ProtectedRoute>} />
          // <Route path="/Tip-Change-Monitor-Report" element={<ProtectedRoute><TipChangeMonitorprint /></ProtectedRoute>} />
//           <Route path="/4M-Change-Tracking-Form" element={<ProtectedRoute><MChangeTrackForm/></ProtectedRoute>}/>
//           <Route path='/4-M-Ins-Form' element={<ProtectedRoute><ForMChangeInsForm/></ProtectedRoute>}/>
//           <Route path='/4M-Change-Inspection-Report' element={<ProtectedRoute><ForMChangeInsPrint/></ProtectedRoute>}/>
//           <Route path="/Bin-Trolly-Cleaning-Report" element={<BinTrollingprint currentReport={null} />} />
//           <Route path="/Daily-Prod-Plan-Report" element={<DailyProdprint currentReport={null}/>} />
//           <Route path="/4M-Change-Tracking-Report" element={<ForMChangeRecordPrint currentReport={null} />} />

//           {/* ========== 🔥 MAINTENANCE HUB ROUTES 🔥 ========== */}
//           {/* Main Hubs */}
//           <Route path="/maintenance-hub" element={<ProtectedRoute><MaintenanceHub /></ProtectedRoute>} />
//           <Route path="/maintenance-view/:formKey" element={<ProtectedRoute><MaintenanceView /></ProtectedRoute>} />
//           <Route path="/Maintenance/Machine" element={<ProtectedRoute><MaintenanceHub /></ProtectedRoute>} />
//           <Route path="/Maintenance/Tool" element={<ProtectedRoute><MaintenanceHub /></ProtectedRoute>} />

//           {/* High Priority Specific Views */}
//           <Route path="/Maintenance/Machine/daily" element={<ProtectedRoute><MachineDailyReport/></ProtectedRoute>}/>
//           <Route path="/Maintenance/Machine/weekly" element={<ProtectedRoute><MachineWeeklyReports /></ProtectedRoute>} />
//           <Route path="/Maintenance/Tool/daily" element={<ProtectedRoute><ToolDailyReports /></ProtectedRoute>} />
//           <Route path="/Maintenance/Tool/weekly" element={<ProtectedRoute><ToolWeekly /></ProtectedRoute>} />
          
//           {/* Wildcard Sub-Routes */}
//           <Route path="/Maintenance/Machine/*" element={<ProtectedRoute><MachineRoutes /></ProtectedRoute>} />
//           <Route path="/Maintenance/Tool/*" element={<ProtectedRoute><ToolRoutes /></ProtectedRoute>} />

//           {/* Forms */}
//           <Route path='/Machine-Card-Form' element={<ProtectedRoute><MachineHistoryCard/></ProtectedRoute>}/>
//           <Route path='/Tool-History-Form' element={<ProtectedRoute><ToolHistoryForm/></ProtectedRoute>}/>
//           <Route path='/Daily-PowerPress-Checksheet' element={<ProtectedRoute><DailyPowerPressChecksheet/></ProtectedRoute>}/>
//           <Route path="/Weekly-VMC-Form" element={<ProtectedRoute><MachinePreventForm /></ProtectedRoute>} />
//           <Route path='/Weekly-CNC-Form' element={<ProtectedRoute><CNCPreventiveMaintenanceForm/></ProtectedRoute>}/>
//           <Route path='/Weekly-Power-Press-Form' element={<ProtectedRoute><PowerPressForm/></ProtectedRoute>}/>
//           <Route path='/Tool-PM-Checklist-Form' element={<ProtectedRoute><ToolPrevMaintenanceForm/></ProtectedRoute>}/>
//           <Route path='/Tool-Breakdown-Form' element={<ProtectedRoute><MachineBreakDownForm/></ProtectedRoute>}/>

//           {/* Reports & Print */}
//           <Route path='/Machine-Card-Report' element={<ProtectedRoute><MachineHistoryCardprint/></ProtectedRoute>}/>
//           <Route path='/Machine-Breakdown-Report' element={<ProtectedRoute><MachineBreakdownSummaryPrint/></ProtectedRoute>}/>
//           <Route path="/Daily-PowerPress-Report" element={<ProtectedRoute><DailyPowerPressChecksheetprint /></ProtectedRoute>} />
//           <Route path="/qa-view/:formKey" element={<Qaview />} />
//           {/* 404 NOT FOUND */}
//           <Route path="*" element={
//               <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: 'white', fontSize: '24px', flexDirection: 'column', gap: '20px'}}>
//                 <div style={{ fontSize: '72px', fontWeight: 'bold' }}>404</div>
//                 <div>Page Not Found</div>
//                 <button onClick={() => window.location.href = '/'} style={{padding: '12px 24px', background: 'linear-gradient(to right, #06b6d4, #fbbf24)', border: 'none', borderRadius: '8px', color: '#0f172a', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold'}}>Go to Home</button>
//               </div>
//             } 
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;




import './index.css';              
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Core Components
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
import ProductionHistory from './components/ProductionHistory';

// ========== QMS IMPORTS ==========
import QMSDashboard from './components/qms/QMSDashboard';
import ReportDetail from './components/qms/ReportDetail';
import ReportEditor from './components/qms/ReportEditor';
import PatrolInspection from './components/qms/PatrolInspection';
import ReportsDashboard from './components/qms/ReportsDashboard';
import RawMaterialForm from './components/qms/RawMaterialForm'; 

// ========== QaHub IMPORTS ==========
import QaHub from './components/All_Deperments_Hub/QaHub/QaHub';
// import IncomingMaterialInsp from './components/All_Deperments_Hub/QaHub/IncomingMaterialInsp';
// import RedbinAttendance from './components/All_Deperments_Hub/QaHub/RedbinAttendance';
// import RedBinForm from './components/All_Deperments_Hub/QaHub/RedBinForm';
// import ScrapNote from "./components/All_Deperments_Hub/QaHub/ScrapNoteForm";
// import GoodReceiptFrom from './components/All_Deperments_Hub/QaHub/GoodReceiptFrom';
// import PokaYokeChecksheet from './components/All_Deperments_Hub/QaHub/PokaYokeChecksheet';
// import ReworkRepair from './components/All_Deperments_Hub/QaHub/ReworkRepair';
// import InspectionForm from './components/All_Deperments_Hub/QaHub/InspectionForm';
// import PdiReportForm from './components/All_Deperments_Hub/QaHub/PdiReportForm';
// import SampleInspectionReport from './components/All_Deperments_Hub/QaHub/SampleInspectionReport';
// import DeviationApprovalForm from './components/All_Deperments_Hub/QaHub/DeviationApprovalForm';

import { productionRoutes } from './routes/productionRoutes';

// ========== ProductionHub IMPORTS ==========
import ProductionHub from './components/All_Deperments_Hub/ProductionHub/ProductionHub';
import ProductionView from './components/All_Deperments_Hub/ProductionHub/ProductionView';
import Operator5S from './components/All_Deperments_Hub/ProductionHub/Operator_5s';
import Operator5sprint from './components/All_Deperments_Hub/ProductionHub/Operator5sprint';
import HrSafetyHub from './components/All_Deperments_Hub/HrSafetyHub/HrSafetyHub';
import InductionTrainingForm from './components/All_Deperments_Hub/HrSafetyHub/InductionTrainingForm';
import TrainingHistoryCard from './components/All_Deperments_Hub/HrSafetyHub/TrainingHistoryCard';
import BinTrollingForm from './components/All_Deperments_Hub/ProductionHub/BinTrollingForm';
import DailyProdForm from './components/All_Deperments_Hub/ProductionHub/DailyProdForm';
import TipChangeMonitorForm from './components/All_Deperments_Hub/ProductionHub/TipChangeMonitorForm';
import TipChangeMonitorprint from './components/All_Deperments_Hub/ProductionHub/TipChangeMonitorprint';
import MChangeTrackForm from './components/All_Deperments_Hub/ProductionHub/M_ChangeTrackForm'; 
import ForMChangeInsForm from './components/All_Deperments_Hub/ProductionHub/For_M_Change_Ins_Form'; 
import ForMChangeInsPrint from './components/All_Deperments_Hub/ProductionHub/ForMChangeInsPrint';
import BinTrollingprint from './components/All_Deperments_Hub/ProductionHub/BinTrollingprint';
import DailyProdprint from './components/All_Deperments_Hub/ProductionHub/DailyProdprint';
import ForMChangeRecordPrint from './components/All_Deperments_Hub/ProductionHub/ForMChangeRecordPrint';

// ========== Maintenance Hub IMPORTS ==========
import MaintenanceHub from './components/All_Deperments_Hub/MaintenanceHub/MaintenanceHub';
import MaintenanceView from './components/All_Deperments_Hub/MaintenanceHub/MaintenanceView';
import MachineHistoryCard from './components/All_Deperments_Hub/MaintenanceHub/forms/MachineHistoryCard';
import DailyPowerPressChecksheet from './components/All_Deperments_Hub/MaintenanceHub/forms/DailyPowerPressChecksheet';
import ToolHistoryForm from './components/All_Deperments_Hub/MaintenanceHub/forms/ToolHistoryForm';
import MachineBreakDownForm from './components/All_Deperments_Hub/MaintenanceHub/forms/MachineBreakDownForm';
import ToolPrevMaintenanceForm from './components/All_Deperments_Hub/MaintenanceHub/forms/ToolPrevMaintenanceForm';
import MachinePreventForm from './components/All_Deperments_Hub/MaintenanceHub/forms/MachinePreventMainForm';
import CNCPreventiveMaintenanceForm from './components/All_Deperments_Hub/MaintenanceHub/forms/CNCPreventiveMaintenanceForm';
import PowerPressForm from './components/All_Deperments_Hub/MaintenanceHub/forms/PowerPressPreventiveMaintenanceForm';
import MachineDailyReport from './components/All_Deperments_Hub/MaintenanceHub/views/MachineDailyReport';
import MachineWeeklyReports from './components/All_Deperments_Hub/MaintenanceHub/views/MachineWeeklyReport';
import ToolDailyReports from './components/All_Deperments_Hub/MaintenanceHub/views/ToolDailyReports';
import ToolWeekly from './components/All_Deperments_Hub/MaintenanceHub/views/ToolWeekly'; 
import MachineMonthlyReport from './components/All_Deperments_Hub/MaintenanceHub/views/MachineMonthlyReport';
import MachineRoutes from './routes/MachineRoutes';
import ToolRoutes from './routes/ToolRoutes';
import DailyPowerPressChecksheetprint from './components/All_Deperments_Hub/MaintenanceHub/Report/DailyPowerPressChecksheetprint';
import MachineHistoryCardprint from './components/All_Deperments_Hub/MaintenanceHub/Report/MachineHistoryCardprint';
import MachineBreakdownSummaryPrint from './components/All_Deperments_Hub/MaintenanceHub/Report/MachineBreakdownSummaryPrint';
import Qaview from './components/All_Deperments_Hub/QaHub/Qaview';

// ==========================================
// PUSH NOTIFICATION CONFIGURATION
// ==========================================
const publicVapidKey = 'BEvBWcf0GgkwpO5snMzIeJy2btb1tjKfUZbkIvBoFfZx6TqwB5EKe7uYhhrBasBgmHJkm2GRa1aDNSsWX8KPPZk';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
// ==========================================


// 🔥 REUSABLE COMPONENT: Red Access Denied Page (Jab galat tab par click karenge)
const AccessDeniedScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#fef2f2', color: '#991b1b' }}>
    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Access Denied! 🚫</h1>
    <p>You do not have the required permissions to view this department's page.</p>
    <button 
      onClick={() => window.history.back()} 
      style={{ marginTop: '15px', padding: '10px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
      Go Back
    </button>
  </div>
);


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth === 'true';
  });

  // ==========================================
  // PUSH NOTIFICATION LIFECYCLE hsi
  // ==========================================
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
          console.log('Service Worker Registered Successfully');
          
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              subscribeUser(registration);
            }
          });
        })
        .catch(function(error) {
          console.error('Service Worker Error:', error);
        });
    }
  }, []); 

  const subscribeUser = async (registration) => {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
      
      console.log('Subscription Object Generated:', subscription);

      fetch('http://localhost:8000/api/save-subscription/', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => res.json())
      .then(data => console.log('Saved in Django Database:', data))
      .catch(err => console.log('API Fetch Error:', err));

    } catch (err) {
      console.log('Failed to subscribe user:', err);
    }
  };
  // ==========================================

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user_role'); 
    localStorage.removeItem('access_token');
  };

  // 🔥 UPDATED PROTECTED ROUTE (Role Check aur Admin Check ke sath) 🔥
  const ProtectedRoute = ({ children, allowedRole, adminOnly }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    
    const userRole = localStorage.getItem('user_role');

    // 1. Agar specific department required hai
    if (allowedRole && userRole !== allowedRole) {
      return <AccessDeniedScreen />;
    }

    // 2. Agar sirf Admin ka page hai (Workers allowed nahi hain, e.g. Idle Case)
    if (adminOnly) {
      const isWorker = userRole === 'QA_Hub' || userRole === 'Production_Hub' || userRole === 'Maintenance_Hub';
      if (isWorker) {
        return <AccessDeniedScreen />;
      }
    }

    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Core Routes (No Role Required) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUpPage onLogin={handleLogin} />} />
          
          {/* 🔥 MAIN DASHBOARD: Wapas normal kar diya hai 🔥 */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard onLogout={handleLogout} /></ProtectedRoute>} />

          <Route path="/profile" element={<ProtectedRoute><Profile onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><Support onLogout={handleLogout} /></ProtectedRoute>} />
          
          <Route path="/machine-assignments" element={<ProtectedRoute><MachineAssignments onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path='/Production-history' element={<ProtectedRoute><ProductionHistory/></ProtectedRoute>}/>

          
          {/* ================= QA HUB ROUTES (Only QA_Hub) ================= */}
         

          {/* ================= PRODUCTION HUB ROUTES (Only Production_Hub) ================= */}
          <Route path="/production-hub" element={<ProtectedRoute allowedRole="Production_Hub"><ProductionHub /></ProtectedRoute>} />
          <Route path="/Production/View/:formKey" element={<ProtectedRoute><ProductionView /></ProtectedRoute>} />
          <Route path="/Daily-Prod-Plan-Form" element={<ProtectedRoute allowedRole="Production_Hub"><DailyProdForm /></ProtectedRoute>} />
          <Route path="/Operator5S" element={<ProtectedRoute allowedRole="Production_Hub"><Operator5S/></ProtectedRoute>}/>
          <Route path="/Bin-Trolly-Cleaning-Form" element={<ProtectedRoute allowedRole="Production_Hub"><BinTrollingForm /></ProtectedRoute>} />
          <Route path="/Tip-Change-Monitor-Form" element={<ProtectedRoute allowedRole="Production_Hub"><TipChangeMonitorForm /></ProtectedRoute>} />
          <Route path="/4M-Change-Tracking-Form" element={<ProtectedRoute allowedRole="Production_Hub"><MChangeTrackForm/></ProtectedRoute>}/>
          <Route path="/4-M-Ins-Form" element={<ProtectedRoute allowedRole="Production_Hub"><ForMChangeInsForm/></ProtectedRoute>}/>

          {/* ================= MAINTENANCE HUB ROUTES (Only Maintenance_Hub) ================= */}
          <Route path="/maintenance-hub" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MaintenanceHub /></ProtectedRoute>} />
          <Route path="/Maintenance/Machine" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MaintenanceHub /></ProtectedRoute>} />
          <Route path="/Maintenance/Tool" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MaintenanceHub /></ProtectedRoute>} />
          <Route path="/Machine-Card-Form" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MachineHistoryCard/></ProtectedRoute>}/>
          <Route path="/Tool-History-Form" element={<ProtectedRoute allowedRole="Maintenance_Hub"><ToolHistoryForm/></ProtectedRoute>}/>
          <Route path="/Daily-PowerPress-Checksheet" element={<ProtectedRoute allowedRole="Maintenance_Hub"><DailyPowerPressChecksheet/></ProtectedRoute>}/>
          <Route path="/Weekly-VMC-Form" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MachinePreventForm /></ProtectedRoute>} />
          <Route path="/Weekly-CNC-Form" element={<ProtectedRoute allowedRole="Maintenance_Hub"><CNCPreventiveMaintenanceForm/></ProtectedRoute>}/>
          <Route path="/Weekly-Power-Press-Form" element={<ProtectedRoute allowedRole="Maintenance_Hub"><PowerPressForm/></ProtectedRoute>}/>
          <Route path="/Tool-PM-Checklist-Form" element={<ProtectedRoute allowedRole="Maintenance_Hub"><ToolPrevMaintenanceForm/></ProtectedRoute>}/>
          <Route path="/Tool-Breakdown-Form" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MachineBreakDownForm/></ProtectedRoute>}/>

          {/* ================= ADMIN ONLY ROUTES (Workers are Blocked from these) ================= */}
          <Route path="/machines-status" element={<ProtectedRoute adminOnly={true}><MachinesStatus onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/plant1-live" element={<ProtectedRoute adminOnly={true}><Plant1Live onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/plant2-live" element={<ProtectedRoute adminOnly={true}><Plant2Live onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/assignment" element={<ProtectedRoute adminOnly={true}><AssignMachine onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/idle-case" element={<ProtectedRoute adminOnly={true}><IdleCase onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/idle-reports-list" element={<ProtectedRoute adminOnly={true}><IdleReportsList onLogout={handleLogout} /></ProtectedRoute>} />
          
          <Route path="/Tip-Change-Monitor-Report" element={<ProtectedRoute><TipChangeMonitorprint /></ProtectedRoute>} />
          <Route path='/4-M-Ins-Form' element={<ProtectedRoute><ForMChangeInsForm/></ProtectedRoute>}/>
          <Route path='/4M-Change-Inspection-Report' element={<ProtectedRoute><ForMChangeInsPrint/></ProtectedRoute>}/>
          <Route path="/Bin-Trolly-Cleaning-Report" element={<BinTrollingprint currentReport={null} />} />
          <Route path="/Daily-Prod-Plan-Report" element={<DailyProdprint currentReport={null}/>} />
          <Route path="/4M-Change-Tracking-Report" element={<ForMChangeRecordPrint currentReport={null} />} />
          <Route path="/Operator5S-Report" element={<ProtectedRoute><Operator5sprint/></ProtectedRoute>} />


            {/* QaHub Print */}
         

                                                 {/* Main Hubs */}
           <Route path="/maintenance-hub" element={<ProtectedRoute><MaintenanceHub /></ProtectedRoute>} />
          <Route path="/maintenance-view/:formKey" element={<ProtectedRoute><MaintenanceView /></ProtectedRoute>} />
          <Route path="/Maintenance/Machine" element={<ProtectedRoute><MaintenanceHub /></ProtectedRoute>} />
          <Route path="/Maintenance/Tool" element={<ProtectedRoute><MaintenanceHub /></ProtectedRoute>} />

           {/* High Priority Specific Views */}
          <Route path="/Maintenance/Machine/daily" element={<ProtectedRoute><MachineDailyReport/></ProtectedRoute>}/>
          <Route path="/Maintenance/Machine/weekly" element={<ProtectedRoute><MachineWeeklyReports /></ProtectedRoute>} />
          {/* Pehle jo galat tha usse change karke yeh likho */}
          <Route path="/Maintenance/Machine/monthly" element={<ProtectedRoute><MachineMonthlyReport /></ProtectedRoute>} />
         
          <Route path="/Maintenance/Tool/daily" element={<ProtectedRoute><ToolDailyReports /></ProtectedRoute>} />
          <Route path="/Maintenance/Tool/weekly" element={<ProtectedRoute><ToolWeekly /></ProtectedRoute>} />

             {/* Reports & Print */}
            <Route path='/Machine-Card-Report' element={<ProtectedRoute><MachineHistoryCardprint/></ProtectedRoute>}/>
            <Route path='/Machine-Breakdown-Report' element={<ProtectedRoute><MachineBreakdownSummaryPrint/></ProtectedRoute>}/>
            <Route path="/Daily-PowerPress-Report" element={<ProtectedRoute><DailyPowerPressChecksheetprint /></ProtectedRoute>} />
          {/* Wildcard Sub-Routes */}
          <Route path="/Maintenance/Machine/*" element={<ProtectedRoute><MachineRoutes /></ProtectedRoute>} />
          <Route path="/Maintenance/Tool/*" element={<ProtectedRoute><ToolRoutes /></ProtectedRoute>} />
          <Route path="/qa-view/:formKey" element={<Qaview />} />
          <Route path="/Production/View/:formKey" element={<ProtectedRoute><ProductionView /></ProtectedRoute>} />
    

 
           {/* HrSafetyHub */}
           <Route path="/hiring-departments" element={<ProtectedRoute><HrSafetyHub /></ProtectedRoute>} />
           <Route path="/Induction-Training" element={<ProtectedRoute><InductionTrainingForm /></ProtectedRoute>} />
           <Route path="/Training-History" element={<ProtectedRoute><TrainingHistoryCard /></ProtectedRoute>} />   
          {/* 404 NOT FOUND */}
          <Route path="*" element={
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: 'white', fontSize: '24px', flexDirection: 'column', gap: '20px'}}>
                <div style={{ fontSize: '72px', fontWeight: 'bold' }}>404</div>
                <div>Page Not Found</div>
                <button onClick={() => window.location.href = '/'} style={{padding: '12px 24px', background: 'linear-gradient(to right, #06b6d4, #fbbf24)', border: 'none', borderRadius: '8px', color: '#0f172a', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold'}}>Go to Home</button>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;