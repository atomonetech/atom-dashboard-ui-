// ///////////////////////////////

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

// // ========== MODULAR ROUTE IMPORTS ==========
// import QaRoutes from './routes/QaRoutes'; 
// import ProductionRoutes from './routes/ProductionRoute'; 

// // ========== QMS IMPORTS ==========
// import QMSDashboard from './components/qms/QMSDashboard';
// import ReportDetail from './components/qms/ReportDetail';
// import ReportEditor from './components/qms/ReportEditor';
// import PatrolInspection from './components/qms/PatrolInspection';
// import ReportsDashboard from './components/qms/ReportsDashboard';
// import RawMaterialForm from './components/qms/RawMaterialForm'; 

// import PdiReportForm from './components/All_Deperments_Hub/QaHub/forms/daily/PdiReportForm';

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
// import MachineMonthlyReport from './components/All_Deperments_Hub/MaintenanceHub/views/MachineMonthlyReport';
// import MachineRoutes from './routes/MachineRoutes';
// import ToolRoutes from './routes/ToolRoutes';
// import DailyPowerPressChecksheetprint from './components/All_Deperments_Hub/MaintenanceHub/Report/DailyPowerPressChecksheetprint';
// import MachineHistoryCardprint from './components/All_Deperments_Hub/MaintenanceHub/Report/MachineHistoryCardprint';
// import MachineBreakdownSummaryPrint from './components/All_Deperments_Hub/MaintenanceHub/Report/MachineBreakdownSummaryPrint';

// // ========== HrSafetyHub IMPORTS ==========
// import HrSafetyHub from './components/All_Deperments_Hub/HrSafetyHub/HrSafetyHub';
// import InductionTrainingForm from './components/All_Deperments_Hub/HrSafetyHub/InductionTrainingForm';
// import TrainingHistoryCard from './components/All_Deperments_Hub/HrSafetyHub/TrainingHistoryCard';

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

// // 🔥 REUSABLE COMPONENT: Red Access Denied Page
// const AccessDeniedScreen = () => (
//   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#fef2f2', color: '#991b1b' }}>
//     <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Access Denied! 🚫</h1>
//     <p>You do not have the required permissions to view this department's page.</p>
//     <button 
//       onClick={() => window.history.back()} 
//       style={{ marginTop: '15px', padding: '10px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
//       Go Back
//     </button>
//   </div>
// );

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     const savedAuth = localStorage.getItem('isAuthenticated');
//     return savedAuth === 'true';
//   });

//   // ==========================================
//   // PUSH NOTIFICATION LIFECYCLE hsi
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
//     localStorage.removeItem('user_role'); 
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('username'); // 🔥 YAHAN ADD KIYA HAI: User track history ke liye username hatana 🔥
//   };

//   // 🔥 UPDATED PROTECTED ROUTE: Master Admin Bypass 🔥
//   const ProtectedRoute = ({ children, allowedRole, adminOnly }) => {
//     if (!isAuthenticated) return <Navigate to="/login" replace />;
    
//     const userRole = localStorage.getItem('user_role');

//     // MASTER ADMIN BYPASS: Agar role Admin hai, toh koi restriction nahi
//     if (userRole === 'Admin') {
//       return children;
//     }

//     // 1. Agar specific department required hai
//     if (allowedRole && userRole !== allowedRole) {
//       return <AccessDeniedScreen />;
//     }

//     // 2. Agar sirf Admin ka page hai (Workers allowed nahi hain)
//     if (adminOnly) {
//       const isWorker = userRole === 'QA_Hub' || userRole === 'Production_Hub' || userRole === 'Maintenance_Hub';
//       if (isWorker) {
//         return <AccessDeniedScreen />;
//       }
//     }

//     return children;
//   };

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* Core Routes (No Role Required) */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Auth onLogin={handleLogin} />} />
//           <Route path="/signup" element={<SignUpPage onLogin={handleLogin} />} />
          
//           {/* Main Dashboard */}
//           <Route path="/dashboard" element={<ProtectedRoute><Dashboard onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/profile" element={<ProtectedRoute><Profile onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/notifications" element={<ProtectedRoute><Notifications onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/support" element={<ProtectedRoute><Support onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/machine-assignments" element={<ProtectedRoute><MachineAssignments onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path='/Production-history' element={<ProtectedRoute><ProductionHistory/></ProtectedRoute>}/>

//           {/* ================= QA HUB MODULAR ROUTE ================= */}
//           <Route 
//             path="/qa-hub/*" 
//             element={
//               <ProtectedRoute allowedRole="QA_Hub">
//                 <QaRoutes />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ================= PRODUCTION HUB MODULAR ROUTE ================= */}
//           <Route 
//             path="/production-hub/*" 
//             element={
//               <ProtectedRoute allowedRole="Production_Hub">
//                 <ProductionRoutes />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ================= MAINTENANCE HUB ROUTES ================= */}
//           <Route path="/maintenance-hub" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MaintenanceHub /></ProtectedRoute>} />
//           <Route path="/Maintenance/Machine" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MaintenanceHub /></ProtectedRoute>} />
//           <Route path="/Maintenance/Tool" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MaintenanceHub /></ProtectedRoute>} />
//           <Route path="/Machine-Card-Form" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MachineHistoryCard/></ProtectedRoute>}/>
//           <Route path="/Tool-History-Form" element={<ProtectedRoute allowedRole="Maintenance_Hub"><ToolHistoryForm/></ProtectedRoute>}/>
//           <Route path="/Daily-PowerPress-Checksheet" element={<ProtectedRoute allowedRole="Maintenance_Hub"><DailyPowerPressChecksheet/></ProtectedRoute>}/>
//           <Route path="/Weekly-VMC-Form" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MachinePreventForm /></ProtectedRoute>} />
//           <Route path="/Weekly-CNC-Form" element={<ProtectedRoute allowedRole="Maintenance_Hub"><CNCPreventiveMaintenanceForm/></ProtectedRoute>}/>
//           <Route path="/Weekly-Power-Press-Form" element={<ProtectedRoute allowedRole="Maintenance_Hub"><PowerPressForm/></ProtectedRoute>}/>
//           <Route path="/Tool-PM-Checklist-Form" element={<ProtectedRoute allowedRole="Maintenance_Hub"><ToolPrevMaintenanceForm/></ProtectedRoute>}/>
//           <Route path="/Tool-Breakdown-Form" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MachineBreakDownForm/></ProtectedRoute>}/>

//           {/* Maintenance Hubs Specific Views & Reports */}
//           <Route path="/maintenance-view/:formKey" element={<ProtectedRoute><MaintenanceView /></ProtectedRoute>} />
//           <Route path="/Maintenance/Machine/daily" element={<ProtectedRoute><MachineDailyReport/></ProtectedRoute>}/>
//           <Route path="/Maintenance/Machine/weekly" element={<ProtectedRoute><MachineWeeklyReports /></ProtectedRoute>} />
//           <Route path="/Maintenance/Tool/daily" element={<ProtectedRoute><ToolDailyReports /></ProtectedRoute>} />
//           <Route path="/Maintenance/Tool/weekly" element={<ProtectedRoute><ToolWeekly /></ProtectedRoute>} />
//           <Route path='/Machine-Card-Report' element={<ProtectedRoute><MachineHistoryCardprint/></ProtectedRoute>}/>
//           <Route path='/Machine-Breakdown-Report' element={<ProtectedRoute><MachineBreakdownSummaryPrint/></ProtectedRoute>}/>
//           <Route path="/Daily-PowerPress-Report" element={<ProtectedRoute><DailyPowerPressChecksheetprint /></ProtectedRoute>} />
          
//           {/* Wildcard Sub-Routes */}
//           <Route path="/Maintenance/Machine/*" element={<ProtectedRoute><MachineRoutes /></ProtectedRoute>} />
//           <Route path="/Maintenance/Tool/*" element={<ProtectedRoute><ToolRoutes /></ProtectedRoute>} />
          
//           {/* ================= ADMIN ONLY ROUTES ================= */}
//           <Route path="/machines-status" element={<ProtectedRoute adminOnly={true}><MachinesStatus onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/plant1-live" element={<ProtectedRoute adminOnly={true}><Plant1Live onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/plant2-live" element={<ProtectedRoute adminOnly={true}><Plant2Live onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/assignment" element={<ProtectedRoute adminOnly={true}><AssignMachine onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/idle-case" element={<ProtectedRoute adminOnly={true}><IdleCase onLogout={handleLogout} /></ProtectedRoute>} />
//           <Route path="/idle-reports-list" element={<ProtectedRoute adminOnly={true}><IdleReportsList onLogout={handleLogout} /></ProtectedRoute>} />
          
//           {/* ================= QMS ROUTES ================= */}
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
 
//           {/* ================= HrSafetyHub ================= */}
//           <Route path="/hiring-departments" element={<ProtectedRoute><HrSafetyHub /></ProtectedRoute>} />
//           <Route path="/Induction-Training" element={<ProtectedRoute><InductionTrainingForm /></ProtectedRoute>} />
//           <Route path="/Training-History" element={<ProtectedRoute><TrainingHistoryCard /></ProtectedRoute>} />   
          
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

// ========== MODULAR ROUTE IMPORTS ==========
import QaRoutes from './routes/QaRoutes'; 
import ProductionRoutes from './routes/ProductionRoute'; 

// ========== QMS IMPORTS ==========
import QMSDashboard from './components/qms/QMSDashboard';
import ReportDetail from './components/qms/ReportDetail';
import ReportEditor from './components/qms/ReportEditor';
import PatrolInspection from './components/qms/PatrolInspection';
import ReportsDashboard from './components/qms/ReportsDashboard';
import RawMaterialForm from './components/qms/RawMaterialForm'; 

import PdiReportForm from './components/All_Deperments_Hub/QaHub/forms/daily/PdiReportForm';

// ========== Maintenance Hub IMPORTS ==========
import MaintenanceHub from './components/All_Deperments_Hub/MaintenanceHub/MaintenanceHub';
import MaintenanceView from './components/All_Deperments_Hub/MaintenanceHub/MaintenanceView';
import MachineWeeklyReports from './components/All_Deperments_Hub/MaintenanceHub/views/MachineWeeklyReport';
import ToolDailyReports from './components/All_Deperments_Hub/MaintenanceHub/views/ToolDailyReports';
import ToolWeekly from './components/All_Deperments_Hub/MaintenanceHub/views/ToolWeekly'; 
import MachineDailyReport from './components/All_Deperments_Hub/MaintenanceHub/views/MachineDailyReport';
import MachineRoutes from './routes/MachineRoutes';
import ToolRoutes from './routes/ToolRoutes';
import DailyPowerPressChecksheetprint from './components/All_Deperments_Hub/MaintenanceHub/Report/DailyPowerPressChecksheetprint';
import MachineHistoryCardprint from './components/All_Deperments_Hub/MaintenanceHub/Report/MachineHistoryCardprint';
import MachineBreakdownSummaryPrint from './components/All_Deperments_Hub/MaintenanceHub/Report/MachineBreakdownSummaryPrint';

// ========== HrSafetyHub IMPORTS ==========
import HrSafetyHub from './components/All_Deperments_Hub/HrSafetyHub/HrSafetyHub';
import InductionTrainingForm from './components/All_Deperments_Hub/HrSafetyHub/InductionTrainingForm';
import TrainingHistoryCard from './components/All_Deperments_Hub/HrSafetyHub/TrainingHistoryCard';

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

const AccessDeniedScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#fef2f2', color: '#991b1b' }}>
    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Access Denied! 🛑</h1>
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
      fetch('http://192.168.0.34:8000/api/save-subscription/', {
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

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user_role'); 
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
  };

  // 🔥 UPDATED PROTECTED ROUTE LOGIC 🔥
  const ProtectedRoute = ({ children, allowedRole, allowedRoles, adminOnly }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    const userRole = localStorage.getItem('user_role');
    
    // Admin ko full access hai
    if (userRole === 'Admin') return children;

    // Agar route sirf Admin/Manager/Supervisor ke liye hai, toh baaki sab block (Plant_1, Plant_2, QA, etc)
    if (adminOnly) {
      if (userRole !== 'Manager' && userRole !== 'Supervisor') {
        return <AccessDeniedScreen />;
      }
    }

    // Naya logic: Multiple roles ke liye (Jaise sirf Plant_1_User ko allow karna)
    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(userRole)) return <AccessDeniedScreen />;
    } 
    // Purana logic: Single role ke liye (QA, Production etc)
    else if (allowedRole && userRole !== allowedRole) {
      return <AccessDeniedScreen />;
    }

    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUpPage onLogin={handleLogin} />} />
          
          {/* Dashboards - Accessible to all logged-in users initially */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><Support onLogout={handleLogout} /></ProtectedRoute>} />
          
          {/* Admin Only Routes */}
          <Route path="/machine-assignments" element={<ProtectedRoute adminOnly={true}><MachineAssignments onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path='/Production-history' element={<ProtectedRoute adminOnly={true}><ProductionHistory/></ProtectedRoute>}/>
          <Route path="/machines-status" element={<ProtectedRoute adminOnly={true}><MachinesStatus onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/assignment" element={<ProtectedRoute adminOnly={true}><AssignMachine onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/idle-case" element={<ProtectedRoute adminOnly={true}><IdleCase onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/idle-reports-list" element={<ProtectedRoute adminOnly={true}><IdleReportsList onLogout={handleLogout} /></ProtectedRoute>} />

          {/* 🔥 SPECIFIC PLANT ROUTES (Maha Important Fix) 🔥 */}
          <Route path="/plant1-live" element={<ProtectedRoute allowedRoles={['Plant_1_User']}><Plant1Live onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/plant2-live" element={<ProtectedRoute allowedRoles={['Plant_2_User']}><Plant2Live onLogout={handleLogout} /></ProtectedRoute>} />

          {/* Department Hubs */}
          <Route path="/qa-hub/*" element={<ProtectedRoute allowedRole="QA_Hub"><QaRoutes /></ProtectedRoute>} />
          <Route path="/production-hub/*" element={<ProtectedRoute allowedRole="Production_Hub"><ProductionRoutes /></ProtectedRoute>} />

          <Route path="/maintenance-hub" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MaintenanceHub /></ProtectedRoute>} />
          <Route path="/Maintenance/Machine" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MaintenanceHub /></ProtectedRoute>} />
          <Route path="/Maintenance/Tool" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MaintenanceHub /></ProtectedRoute>} />

          {/* Maintenance Views & Reports */}
          <Route path="/maintenance-view/:formKey" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MaintenanceView /></ProtectedRoute>} />
          <Route path="/Maintenance/Machine/daily" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MachineDailyReport/></ProtectedRoute>}/>
          <Route path="/Maintenance/Machine/weekly" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MachineWeeklyReports /></ProtectedRoute>} />
          <Route path="/Maintenance/Tool/daily" element={<ProtectedRoute allowedRole="Maintenance_Hub"><ToolDailyReports /></ProtectedRoute>} />
          <Route path="/Maintenance/Tool/weekly" element={<ProtectedRoute allowedRole="Maintenance_Hub"><ToolWeekly /></ProtectedRoute>} />
          <Route path='/Machine-Card-Report' element={<ProtectedRoute allowedRole="Maintenance_Hub"><MachineHistoryCardprint/></ProtectedRoute>}/>
          <Route path='/Machine-Breakdown-Report' element={<ProtectedRoute allowedRole="Maintenance_Hub"><MachineBreakdownSummaryPrint/></ProtectedRoute>}/>
          <Route path="/Daily-PowerPress-Report" element={<ProtectedRoute allowedRole="Maintenance_Hub"><DailyPowerPressChecksheetprint /></ProtectedRoute>} />
          
          <Route path="/Maintenance/Machine/*" element={<ProtectedRoute allowedRole="Maintenance_Hub"><MachineRoutes /></ProtectedRoute>} />
          <Route path="/Maintenance/Tool/*" element={<ProtectedRoute allowedRole="Maintenance_Hub"><ToolRoutes /></ProtectedRoute>} />
          
          <Route path="/qms" element={<ProtectedRoute allowedRole="QA_Hub"><ReportsDashboard /></ProtectedRoute>} />
          <Route path="/ReportsDashboard" element={<ProtectedRoute allowedRole="QA_Hub"><ReportsDashboard /></ProtectedRoute>} /> 
          <Route path="/qms-dashboard" element={<ProtectedRoute allowedRole="QA_Hub"><QMSDashboard onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/qms/report/:reportId" element={<ProtectedRoute allowedRole="QA_Hub"><ReportDetail /></ProtectedRoute>} />
          <Route path="/qms/report/:reportId/edit" element={<ProtectedRoute allowedRole="QA_Hub"><ReportEditor /></ProtectedRoute>} />
          <Route path="/qms/patrol-inspection" element={<ProtectedRoute allowedRole="QA_Hub"><PatrolInspection /></ProtectedRoute>} />
          <Route path="/qms/raw-material-form" element={<ProtectedRoute allowedRole="QA_Hub"><RawMaterialForm /></ProtectedRoute>} />
          <Route path="/qms/pdi-report-form" element={<ProtectedRoute allowedRole="QA_Hub"><PdiReportForm /></ProtectedRoute>} />
 
          <Route path="/hiring-departments" element={<ProtectedRoute adminOnly={true}><HrSafetyHub /></ProtectedRoute>} />
          <Route path="/Induction-Training" element={<ProtectedRoute adminOnly={true}><InductionTrainingForm /></ProtectedRoute>} />
          <Route path="/Training-History" element={<ProtectedRoute adminOnly={true}><TrainingHistoryCard /></ProtectedRoute>} />   
          
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