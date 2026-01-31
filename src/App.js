// import './index.css';              
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Count52Live from './components/Count52Live';
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
// import Notifications from './components/Notifications';  // ✅ ADDED
// // import Settings from './components/Settings';            // ✅ ADDED (if exists)
// import Profile from './components/Profile';              // ✅ ADDED (if exists)
// import Support from './components/Support';              // ✅ ADDED (if exists)
// import './App.css';


// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const handleLogin = () => {
//     console.log('✅ Login successful - Auth TRUE');
//     setIsAuthenticated(true);
//   };

//   const handleLogout = () => {
//     console.log('🚪 Logout - Auth FALSE');
//     setIsAuthenticated(false);
//   };

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* ========== PUBLIC ROUTES ========== */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Auth onLogin={handleLogin} />} />
//           <Route path="/signup" element={<SignUpPage onLogin={handleLogin} />} />

//           {/* ========== PROTECTED DASHBOARD ========== */}
//           <Route 
//             path="/dashboard" 
//             element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />

//           {/* ========== PLANT ROUTES (BOTH VERSIONS) ========== */}
//           {/* New router style */}
//           <Route 
//             path="/plant1" 
//             element={isAuthenticated ? <Plant1Live onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
//           <Route 
//             path="/plant2" 
//             element={isAuthenticated ? <Plant2Live onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
          
//           {/* Old router style - Redirect to new */}
//           <Route 
//             path="/plant1-live" 
//             element={<Navigate to="/plant1" replace />} 
//           />
//           <Route 
//             path="/plant2-live" 
//             element={<Navigate to="/plant2" replace />} 
//           />

//           {/* ========== OPERATIONS & ASSIGNMENTS ========== */}
//           <Route 
//             path="/assignment" 
//             element={isAuthenticated ? <AssignMachine onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
//           <Route 
//             path="/assign-machine" 
//             element={<Navigate to="/assignment" replace />} 
//           />
          
//           <Route 
//             path="/machine-assignments" 
//             element={isAuthenticated ? <MachineAssignments onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />

//           {/* ========== IDLE REPORTS ========== */}
//           <Route 
//             path="/idle-case" 
//             element={isAuthenticated ? <IdleCase onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
//           <Route 
//             path="/idle-report-submit" 
//             element={isAuthenticated ? <IdleCase onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
//           <Route 
//             path="/idle-reports-list" 
//             element={isAuthenticated ? <IdleReportsList onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />

//           {/* ========== MACHINES STATUS ========== */}
//           <Route 
//             path="/machines-status" 
//             element={isAuthenticated ? <MachinesStatus onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
//           <Route 
//             path="/count52" 
//             element={isAuthenticated ? <Count52Live onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />

//           {/* ========== SETTINGS & PROFILE ========== */}
//           <Route 
//             path="/notifications" 
//             element={isAuthenticated ? <Notifications onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
//           {/* <Route 
//             path="/settings" 
//             element={isAuthenticated ? <Settings onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           /> */}
//           <Route 
//             path="/profile" 
//             element={isAuthenticated ? <Profile onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
//           <Route 
//             path="/support" 
//             element={isAuthenticated ? <Support onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />

//           {/* ========== 404 NOT FOUND ========== */}
//           <Route 
//             path="*" 
//             element={
//               <div style={{
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 alignItems: 'center', 
//                 height: '100vh',
//                 backgroundColor: '#0f172a',
//                 color: 'white',
//                 fontSize: '24px',
//                 flexDirection: 'column',
//                 gap: '20px'
//               }}>
//                 <div style={{ fontSize: '72px' }}>404</div>
//                 <div>Page Not Found</div>
//                 <button 
//                   onClick={() => window.location.href = '/'}
//                   style={{
//                     padding: '12px 24px',
//                     background: 'linear-gradient(to right, #06b6d4, #fbbf24)',
//                     border: 'none',
//                     borderRadius: '8px',
//                     color: '#0f172a',
//                     fontSize: '16px',
//                     cursor: 'pointer',
//                     fontWeight: 'bold'
//                   }}
//                 >
//                   Go to Home
//                 </button>
//               </div>
//             } 
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;



// import './index.css';              
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Count52Live from './components/Count52Live';
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
// import Profile from './components/Profile';              // ✅ IMPORTED
// import Support from './components/Support';
// import './App.css';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const handleLogin = () => {
//     console.log('✅ Login successful - Auth TRUE');
//     setIsAuthenticated(true);
//   };

//   const handleLogout = () => {
//     console.log('🚪 Logout - Auth FALSE');
//     setIsAuthenticated(false);
//   };

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* ========== PUBLIC ROUTES ========== */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Auth onLogin={handleLogin} />} />
//           <Route path="/signup" element={<SignUpPage onLogin={handleLogin} />} />

//           {/* ========== PROTECTED DASHBOARD ========== */}
//           <Route 
//             path="/dashboard" 
//             element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />

//           {/* ========== PLANT ROUTES ========== */}
//           <Route 
//             path="/plant1" 
//             element={isAuthenticated ? <Plant1Live onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
//           <Route 
//             path="/plant1-live" 
//             element={isAuthenticated ? <Plant1Live onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
          
//           <Route 
//             path="/plant2" 
//             element={isAuthenticated ? <Plant2Live onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
//           <Route 
//             path="/plant2-live" 
//             element={isAuthenticated ? <Plant2Live onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />

//           {/* ========== OPERATIONS & ASSIGNMENTS ========== */}
//           <Route 
//             path="/assignment" 
//             element={isAuthenticated ? <AssignMachine onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
//           <Route 
//             path="/assign-machine" 
//             element={isAuthenticated ? <AssignMachine onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
          
//           <Route 
//             path="/machine-assignments" 
//             element={isAuthenticated ? <MachineAssignments onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />

//           {/* ========== IDLE REPORTS ========== */}
//           <Route 
//             path="/idle-case" 
//             element={isAuthenticated ? <IdleCase onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
//           <Route 
//             path="/idle-report-submit" 
//             element={isAuthenticated ? <IdleCase onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
//           <Route 
//             path="/idle-reports-list" 
//             element={isAuthenticated ? <IdleReportsList onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />

//           {/* ========== MACHINES STATUS ========== */}
//           <Route 
//             path="/machines-status" 
//             element={isAuthenticated ? <MachinesStatus onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
//           <Route 
//             path="/count52" 
//             element={isAuthenticated ? <Count52Live onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />

//           {/* ========== PROFILE & SETTINGS ========== */}
//           <Route 
//             path="/profile" 
//             element={isAuthenticated ? <Profile onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
//           <Route 
//             path="/notifications" 
//             element={isAuthenticated ? <Notifications onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />
//           <Route 
//             path="/support" 
//             element={isAuthenticated ? <Support onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
//           />

//           {/* ========== 404 NOT FOUND ========== */}
//           <Route 
//             path="*" 
//             element={
//               <div style={{
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 alignItems: 'center', 
//                 height: '100vh',
//                 backgroundColor: '#0f172a',
//                 color: 'white',
//                 fontSize: '24px',
//                 flexDirection: 'column',
//                 gap: '20px'
//               }}>
//                 <div style={{ fontSize: '72px' }}>404</div>
//                 <div>Page Not Found</div>
//                 <button 
//                   onClick={() => window.location.href = '/'}
//                   style={{
//                     padding: '12px 24px',
//                     background: 'linear-gradient(to right, #06b6d4, #fbbf24)',
//                     border: 'none',
//                     borderRadius: '8px',
//                     color: '#0f172a',
//                     fontSize: '16px',
//                     cursor: 'pointer',
//                     fontWeight: 'bold'
//                   }}
//                 >
//                   Go to Home
//                 </button>
//               </div>
//             } 
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


// import './index.css';              
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Count52Live from './components/Count52Live';
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
// import QMSDashboard from './components/qms/QMSDashboard';  // ✅ YE LINE ADD KARO
// import './App.css';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const handleLogin = () => {
//     console.log('✅ Login successful - Auth TRUE');
//     setIsAuthenticated(true);
//   };

//   const handleLogout = () => {
//     console.log('🚪 Logout - Auth FALSE');
//     setIsAuthenticated(false);
//   };

//   const ProtectedRoute = ({ children }) => {
//     return isAuthenticated ? children : <Navigate to="/login" replace />;
//   };

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* ========== PUBLIC ROUTES ========== */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Auth onLogin={handleLogin} />} />
//           <Route path="/signup" element={<SignUpPage onLogin={handleLogin} />} />

//           {/* ========== PROTECTED DASHBOARD ========== */}
//           <Route 
//             path="/dashboard" 
//             element={
//               <ProtectedRoute>
//                 <Dashboard onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== QMS DASHBOARD ========== */}
//           <Route 
//             path="/qms" 
//             element={
//               <ProtectedRoute>
//                 <QMSDashboard onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/qms-dashboard" 
//             element={
//               <ProtectedRoute>
//                 <QMSDashboard onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/quality-management" 
//             element={
//               <ProtectedRoute>
//                 <QMSDashboard onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== PLANT ROUTES ========== */}
//           <Route 
//             path="/plant1" 
//             element={
//               <ProtectedRoute>
//                 <Plant1Live onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/plant1-live" 
//             element={
//               <ProtectedRoute>
//                 <Plant1Live onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
          
//           <Route 
//             path="/plant2" 
//             element={
//               <ProtectedRoute>
//                 <Plant2Live onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/plant2-live" 
//             element={
//               <ProtectedRoute>
//                 <Plant2Live onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== OPERATIONS & ASSIGNMENTS ========== */}
//           <Route 
//             path="/assignment" 
//             element={
//               <ProtectedRoute>
//                 <AssignMachine onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/assign-machine" 
//             element={
//               <ProtectedRoute>
//                 <AssignMachine onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
          
//           <Route 
//             path="/machine-assignments" 
//             element={
//               <ProtectedRoute>
//                 <MachineAssignments onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== IDLE REPORTS ========== */}
//           <Route 
//             path="/idle-case" 
//             element={
//               <ProtectedRoute>
//                 <IdleCase onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/idle-report-submit" 
//             element={
//               <ProtectedRoute>
//                 <IdleCase onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/idle-reports-list" 
//             element={
//               <ProtectedRoute>
//                 <IdleReportsList onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== MACHINES STATUS ========== */}
//           <Route 
//             path="/machines-status" 
//             element={
//               <ProtectedRoute>
//                 <MachinesStatus onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/count52" 
//             element={
//               <ProtectedRoute>
//                 <Count52Live onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== PROFILE & SETTINGS ========== */}
//           <Route 
//             path="/profile" 
//             element={
//               <ProtectedRoute>
//                 <Profile onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/notifications" 
//             element={
//               <ProtectedRoute>
//                 <Notifications onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/support" 
//             element={
//               <ProtectedRoute>
//                 <Support onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== 404 NOT FOUND ========== */}
//           <Route 
//             path="*" 
//             element={
//               <div style={{
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 alignItems: 'center', 
//                 height: '100vh',
//                 backgroundColor: '#0f172a',
//                 color: 'white',
//                 fontSize: '24px',
//                 flexDirection: 'column',
//                 gap: '20px'
//               }}>
//                 <div style={{ fontSize: '72px', fontWeight: 'bold' }}>404</div>
//                 <div>Page Not Found</div>
//                 <button 
//                   onClick={() => window.location.href = '/'}
//                   style={{
//                     padding: '12px 24px',
//                     background: 'linear-gradient(to right, #06b6d4, #fbbf24)',
//                     border: 'none',
//                     borderRadius: '8px',
//                     color: '#0f172a',
//                     fontSize: '16px',
//                     cursor: 'pointer',
//                     fontWeight: 'bold',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
//                   onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
//                 >
//                   Go to Home
//                 </button>
//               </div>
//             } 
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

// import './index.css';              
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Count52Live from './components/Count52Live';
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
// import QMSDashboard from './components/qms/QMSDashboard';
// import ReportDetail from './components/qms/ReportDetail';
// import './App.css';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const handleLogin = () => {
//     console.log('✅ Login successful - Auth TRUE');
//     setIsAuthenticated(true);
//   };

//   const handleLogout = () => {
//     console.log('🚪 Logout - Auth FALSE');
//     setIsAuthenticated(false);
//   };

//   const ProtectedRoute = ({ children }) => {
//     return isAuthenticated ? children : <Navigate to="/login" replace />;
//   };

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* ========== PUBLIC ROUTES ========== */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Auth onLogin={handleLogin} />} />
//           <Route path="/signup" element={<SignUpPage onLogin={handleLogin} />} />

//           {/* ========== PROTECTED DASHBOARD ========== */}
//           <Route 
//             path="/dashboard" 
//             element={
//               <ProtectedRoute>
//                 <Dashboard onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== QMS DASHBOARD ========== */}
//           <Route 
//             path="/qms" 
//             element={
//               <ProtectedRoute>
//                 <QMSDashboard onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/qms-dashboard" 
//             element={
//               <ProtectedRoute>
//                 <QMSDashboard onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/quality-management" 
//             element={
//               <ProtectedRoute>
//                 <QMSDashboard onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== QMS REPORT DETAIL ========== */}
//           <Route 
//             path="/qms/report/:reportId" 
//             element={
//               <ProtectedRoute>
//                 <ReportDetail />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== PLANT ROUTES ========== */}
//           <Route 
//             path="/plant1" 
//             element={
//               <ProtectedRoute>
//                 <Plant1Live onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/plant1-live" 
//             element={
//               <ProtectedRoute>
//                 <Plant1Live onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
          
//           <Route 
//             path="/plant2" 
//             element={
//               <ProtectedRoute>
//                 <Plant2Live onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/plant2-live" 
//             element={
//               <ProtectedRoute>
//                 <Plant2Live onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== OPERATIONS & ASSIGNMENTS ========== */}
//           <Route 
//             path="/assignment" 
//             element={
//               <ProtectedRoute>
//                 <AssignMachine onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/assign-machine" 
//             element={
//               <ProtectedRoute>
//                 <AssignMachine onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
          
//           <Route 
//             path="/machine-assignments" 
//             element={
//               <ProtectedRoute>
//                 <MachineAssignments onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== IDLE REPORTS ========== */}
//           <Route 
//             path="/idle-case" 
//             element={
//               <ProtectedRoute>
//                 <IdleCase onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/idle-report-submit" 
//             element={
//               <ProtectedRoute>
//                 <IdleCase onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/idle-reports-list" 
//             element={
//               <ProtectedRoute>
//                 <IdleReportsList onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== MACHINES STATUS ========== */}
//           <Route 
//             path="/machines-status" 
//             element={
//               <ProtectedRoute>
//                 <MachinesStatus onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/count52" 
//             element={
//               <ProtectedRoute>
//                 <Count52Live onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== PROFILE & SETTINGS ========== */}
//           <Route 
//             path="/profile" 
//             element={
//               <ProtectedRoute>
//                 <Profile onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/notifications" 
//             element={
//               <ProtectedRoute>
//                 <Notifications onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/support" 
//             element={
//               <ProtectedRoute>
//                 <Support onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== 404 NOT FOUND ========== */}
//           <Route 
//             path="*" 
//             element={
//               <div style={{
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 alignItems: 'center', 
//                 height: '100vh',
//                 backgroundColor: '#0f172a',
//                 color: 'white',
//                 fontSize: '24px',
//                 flexDirection: 'column',
//                 gap: '20px'
//               }}>
//                 <div style={{ fontSize: '72px', fontWeight: 'bold' }}>404</div>
//                 <div>Page Not Found</div>
//                 <button 
//                   onClick={() => window.location.href = '/'}
//                   style={{
//                     padding: '12px 24px',
//                     background: 'linear-gradient(to right, #06b6d4, #fbbf24)',
//                     border: 'none',
//                     borderRadius: '8px',
//                     color: '#0f172a',
//                     fontSize: '16px',
//                     cursor: 'pointer',
//                     fontWeight: 'bold',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
//                   onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
//                 >
//                   Go to Home
//                 </button>
//               </div>
//             } 
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;




// import './index.css';              
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Count52Live from './components/Count52Live';
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
// import QMSDashboard from './components/qms/QMSDashboard';
// import ReportDetail from './components/qms/ReportDetail';
// import ReportEditor from './components/qms/ReportEditor'; // 🔥 NEW IMPORT

// import './App.css';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const handleLogin = () => {
//     console.log('✅ Login successful - Auth TRUE');
//     setIsAuthenticated(true);
//   };

//   const handleLogout = () => {
//     console.log('🚪 Logout - Auth FALSE');
//     setIsAuthenticated(false);
//   };

//   const ProtectedRoute = ({ children }) => {
//     return isAuthenticated ? children : <Navigate to="/login" replace />;
//   };

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* ========== PUBLIC ROUTES ========== */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Auth onLogin={handleLogin} />} />
//           <Route path="/signup" element={<SignUpPage onLogin={handleLogin} />} />

//           {/* ========== PROTECTED DASHBOARD ========== */}
//           <Route 
//             path="/dashboard" 
//             element={
//               <ProtectedRoute>
//                 <Dashboard onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== QMS DASHBOARD ========== */}
//           <Route 
//             path="/qms" 
//             element={
//               <ProtectedRoute>
//                 <QMSDashboard onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/qms-dashboard" 
//             element={
//               <ProtectedRoute>
//                 <QMSDashboard onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/quality-management" 
//             element={
//               <ProtectedRoute>
//                 <QMSDashboard onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== QMS REPORT DETAIL (VIEW MODE) ========== */}
//           <Route 
//             path="/qms/report/:reportId" 
//             element={
//               <ProtectedRoute>
//                 <ReportDetail />
//               </ProtectedRoute>
//             } 
//           />

//           {/* 🔥 ========== QMS REPORT EDITOR (EDIT MODE) ========== */}
//           <Route 
//             path="/qms/report/:reportId/edit" 
//             element={
//               <ProtectedRoute>
//                 <ReportEditor />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== PLANT ROUTES ========== */}
//           <Route 
//             path="/plant1" 
//             element={
//               <ProtectedRoute>
//                 <Plant1Live onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/plant1-live" 
//             element={
//               <ProtectedRoute>
//                 <Plant1Live onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
          
//           <Route 
//             path="/plant2" 
//             element={
//               <ProtectedRoute>
//                 <Plant2Live onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/plant2-live" 
//             element={
//               <ProtectedRoute>
//                 <Plant2Live onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== OPERATIONS & ASSIGNMENTS ========== */}
//           <Route 
//             path="/assignment" 
//             element={
//               <ProtectedRoute>
//                 <AssignMachine onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/assign-machine" 
//             element={
//               <ProtectedRoute>
//                 <AssignMachine onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
          
//           <Route 
//             path="/machine-assignments" 
//             element={
//               <ProtectedRoute>
//                 <MachineAssignments onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== IDLE REPORTS ========== */}
//           <Route 
//             path="/idle-case" 
//             element={
//               <ProtectedRoute>
//                 <IdleCase onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/idle-report-submit" 
//             element={
//               <ProtectedRoute>
//                 <IdleCase onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/idle-reports-list" 
//             element={
//               <ProtectedRoute>
//                 <IdleReportsList onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== MACHINES STATUS ========== */}
//           <Route 
//             path="/machines-status" 
//             element={
//               <ProtectedRoute>
//                 <MachinesStatus onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/count52" 
//             element={
//               <ProtectedRoute>
//                 <Count52Live onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== PROFILE & SETTINGS ========== */}
//           <Route 
//             path="/profile" 
//             element={
//               <ProtectedRoute>
//                 <Profile onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/notifications" 
//             element={
//               <ProtectedRoute>
//                 <Notifications onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/support" 
//             element={
//               <ProtectedRoute>
//                 <Support onLogout={handleLogout} />
//               </ProtectedRoute>
//             } 
//           />

//           {/* ========== 404 NOT FOUND ========== */}
//           <Route 
//             path="*" 
//             element={
//               <div style={{
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 alignItems: 'center', 
//                 height: '100vh',
//                 backgroundColor: '#0f172a',
//                 color: 'white',
//                 fontSize: '24px',
//                 flexDirection: 'column',
//                 gap: '20px'
//               }}>
//                 <div style={{ fontSize: '72px', fontWeight: 'bold' }}>404</div>
//                 <div>Page Not Found</div>
//                 <button 
//                   onClick={() => window.location.href = '/'}
//                   style={{
//                     padding: '12px 24px',
//                     background: 'linear-gradient(to right, #06b6d4, #fbbf24)',
//                     border: 'none',
//                     borderRadius: '8px',
//                     color: '#0f172a',
//                     fontSize: '16px',
//                     cursor: 'pointer',
//                     fontWeight: 'bold',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
//                   onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
//                 >
//                   Go to Home
//                 </button>
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
import QMSDashboard from './components/qms/QMSDashboard';
import ReportDetail from './components/qms/ReportDetail';
import ReportEditor from './components/qms/ReportEditor';
import PatrolInspection from './components/qms/PatrolInspection';
import './App.css';

function App() {
  // Check localStorage for existing auth
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth === 'true';
  });

  // Save auth state to localStorage
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
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUpPage onLogin={handleLogin} />} />

          {/* ========== PROTECTED DASHBOARD ========== */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* ========== QMS ROUTES ========== */}
          <Route 
            path="/qms" 
            element={
              <ProtectedRoute>
                <QMSDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/qms-dashboard" 
            element={
              <ProtectedRoute>
                <QMSDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/quality-management" 
            element={
              <ProtectedRoute>
                <QMSDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* QMS REPORT ROUTES */}
          <Route 
            path="/qms/report/:reportId" 
            element={
              <ProtectedRoute>
                <ReportDetail />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/qms/report/:reportId/edit" 
            element={
              <ProtectedRoute>
                <ReportEditor />
              </ProtectedRoute>
            } 
          />

          {/* 🔥 PATROL INSPECTION - FIXED */}
          <Route 
            path="/qms/patrol-inspection" 
            element={
              <ProtectedRoute>
                <PatrolInspection />
              </ProtectedRoute>
            } 
          />

          {/* ========== PLANT ROUTES ========== */}
          <Route 
            path="/plant1" 
            element={
              <ProtectedRoute>
                <Plant1Live onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/plant1-live" 
            element={
              <ProtectedRoute>
                <Plant1Live onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/plant2" 
            element={
              <ProtectedRoute>
                <Plant2Live onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/plant2-live" 
            element={
              <ProtectedRoute>
                <Plant2Live onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* ========== OPERATIONS & ASSIGNMENTS ========== */}
          <Route 
            path="/assignment" 
            element={
              <ProtectedRoute>
                <AssignMachine onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/assign-machine" 
            element={
              <ProtectedRoute>
                <AssignMachine onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/machine-assignments" 
            element={
              <ProtectedRoute>
                <MachineAssignments onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* ========== IDLE REPORTS ========== */}
          <Route 
            path="/idle-case" 
            element={
              <ProtectedRoute>
                <IdleCase onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/idle-report-submit" 
            element={
              <ProtectedRoute>
                <IdleCase onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/idle-reports-list" 
            element={
              <ProtectedRoute>
                <IdleReportsList onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* ========== MACHINES STATUS ========== */}
          <Route 
            path="/machines-status" 
            element={
              <ProtectedRoute>
                <MachinesStatus onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/count52" 
            element={
              <ProtectedRoute>
                <Count52Live onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* ========== PROFILE & SETTINGS ========== */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <Notifications onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/support" 
            element={
              <ProtectedRoute>
                <Support onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* ========== 404 NOT FOUND ========== */}
          <Route 
            path="*" 
            element={
              <div style={{
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                backgroundColor: '#0f172a',
                color: 'white',
                fontSize: '24px',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <div style={{ fontSize: '72px', fontWeight: 'bold' }}>404</div>
                <div>Page Not Found</div>
                <button 
                  onClick={() => window.location.href = '/'}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(to right, #06b6d4, #fbbf24)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Go to Home
                </button>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;