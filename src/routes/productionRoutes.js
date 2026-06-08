// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';

// // Main Hub Component
// import ProductionHub from '../components/All_Deperments_Hub/ProductionHub/ProductionHub';

// // --- DAILY FORMS ---
// import DailyProdForm from '../components/All_Deperments_Hub/ProductionHub/forms/daily/DailyProdForm';
// import BinTrollingForm from '../components/All_Deperments_Hub/ProductionHub/forms/daily/BinTrollingForm';
// import ForMChangeInsForm from '../components/All_Deperments_Hub/ProductionHub/forms/daily/For_M_Change_Ins_Form';
// import MChangeTrackForm from '../components/All_Deperments_Hub/ProductionHub/forms/daily/M_ChangeTrackForm';
// import Operator5s from '../components/All_Deperments_Hub/ProductionHub/forms/daily/Operator_5s';
// import TipChangeMonitorForm from '../components/All_Deperments_Hub/ProductionHub/forms/daily/TipChangeMonitorForm';
// import FourMChangeDisplay from '../components/All_Deperments_Hub/ProductionHub/forms/daily/FourMChangeDisplay';
// // --- DAILY VIEWS (PRINTS) ---
// import DailyProdprint from '../components/All_Deperments_Hub/ProductionHub/Views/daily/DailyProdprint';
// import BinTrollingprint from '../components/All_Deperments_Hub/ProductionHub/Views/daily/BinTrollingprint';
// import ForMChangeInsPrint from '../components/All_Deperments_Hub/ProductionHub/Views/daily/ForMChangeInsPrint';
// import ForMChangeRecordPrint from '../components/All_Deperments_Hub/ProductionHub/Views/daily/ForMChangeRecordPrint';
// import Operator5sprint from '../components/All_Deperments_Hub/ProductionHub/Views/daily/Operator5sprint';
// import TipChangeMonitorprint from '../components/All_Deperments_Hub/ProductionHub/Views/daily/TipChangeMonitorprint';

// //--- Monthly Form ---
// import MonthlyProdPlanForm from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/MonthlyProdPlanForm';
// import ProcessValidationForm from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/ProcessValidationForm';
// import WelderQualificationForm from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/WelderQualTigMigForm';
// import ProjectionWelderForm from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/ProjectionWelderForm';
// import SpotWelderForm from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/WelderQualSpotForm';
// import PreventiveMaintChecklist from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/PMChecklistMHEForm';
// import OperatorObservancePlan from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/OperatorObservancePlanForm';
// import OperatorObservanceChecklistForm from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/OperatorObservanceChecklistForm';

// //----Yearly Form---
// import PlantCapacityForm from '../components/All_Deperments_Hub/ProductionHub/forms/yearly/PlantCapacityForm';
// import MHEListForm from '../components/All_Deperments_Hub/ProductionHub/forms/yearly/MHEListForm';

// export const productionRoutes = (
//   <Route path="/production-hub">
//     {/* 1. Root Redirect: /production-hub -> /production-hub/daily */}
//     <Route index element={<Navigate to="daily" replace />} />
    
//     {/* 2. The Main Grid Pages: /production-hub/daily, /production-hub/monthly, etc. */}
//     <Route path=":category" element={<ProductionHub />} />

//     {/* 3. Nested Action Routes (Forms & Reports) */}
    
//     {/* --- DAILY SECTION --- */}
//     {/* Daily Production Plan */}
//     <Route path="daily/Daily-Prod-Plan-Form" element={<DailyProdForm />} />
//     <Route path="daily/Daily-Prod-Plan-Report" element={<DailyProdprint />} />
    
//     {/* Operator 5S */}
//     <Route path="daily/Operator-5S-Checklist" element={<Operator5s />} />
//     <Route path="daily/Operator-5S-Report" element={<Operator5sprint />} />
    
//     {/* Bin Trolley */}
//     <Route path="daily/Bin-Trolling-Form" element={<BinTrollingForm />} />
//     <Route path="daily/Bin-Trolley-Cleaning-Report" element={<BinTrollingprint />} />

//     {/* Tip Change */}
//     <Route path="daily/Tip-Change-Monitor-Form" element={<TipChangeMonitorForm />} />
//     <Route path="daily/Tip-Change-Monitor-Report" element={<TipChangeMonitorprint />} />

//     {/* 4M Inspection */}
//     <Route path="daily/4M-Ins-Form" element={<ForMChangeInsForm />} />
//     <Route path="daily/4M-Ins-Report" element={<ForMChangeInsPrint />} />

//     {/* 4M Tracking */}
//     <Route path="daily/4M-Tracking-Form" element={<MChangeTrackForm />} />
//     <Route path="daily/4M-Change-Tracking-Report" element={<ForMChangeRecordPrint />} />

//     {/* Summary & Display (Add components when ready) */}
//     <Route path="daily/4M-Summary-Form" element={<div className="p-5">4M Summary Form Placeholder</div>} />
//     <Route path="daily/4M-Summary-Report" element={<div className="p-5">4M Summary Report Placeholder</div>} />
//     <Route path="daily/4M-Change-Display-Board" element={<FourMChangeDisplay />} />
//     {/* --- MONTHLY SECTION --- */}
//         <Route path="monthly/Monthly-Prod-Plan-Form" element={<MonthlyProdPlanForm/> } />
//         <Route path="monthly/Process-Validation-Form" element={<ProcessValidationForm />} />
//         <Route path="monthly/Welder-Qual-TIG-MIG-Form" element={<WelderQualificationForm />} />
//         <Route path="monthly/Welder-Qual-Proj-Form" element={<ProjectionWelderForm />} />
//         <Route path="monthly/Welder-Qual-Spot-Form" element={<SpotWelderForm />} />
//         <Route path="monthly/PM-Checklist-MHE-Form" element={<PreventiveMaintChecklist />} />
//         <Route path="monthly/Operator-Observance-Plan" element={<OperatorObservancePlan />} />
//         <Route path="monthly/Operator-Observance-Check-Form" element={<OperatorObservanceChecklistForm />} />
        
//     {/* --- YEARLY SECTION --- */}
//     <Route path="yearly/Plant-Capacity-Form" element={<PlantCapacityForm/>} />
//     <Route path="yearly/MHE-List-Form" element={<MHEListForm/>} />

//   </Route>
// );