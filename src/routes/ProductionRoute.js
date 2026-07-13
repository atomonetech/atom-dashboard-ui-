import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProductionHub from '../components/All_Deperments_Hub/ProductionHub/ProductionHub';
import ProductionView from '../components/All_Deperments_Hub/ProductionHub/ProductionView';

// --- DAILY FORMS ---
import DailyProdForm from '../components/All_Deperments_Hub/ProductionHub/forms/daily/DailyProdForm';
import BinTrollingForm from '../components/All_Deperments_Hub/ProductionHub/forms/daily/BinTrollingForm';
import ForMChangeInsForm from '../components/All_Deperments_Hub/ProductionHub/forms/daily/For_M_Change_Ins_Form';
import MChangeTrackForm from '../components/All_Deperments_Hub/ProductionHub/forms/daily/M_ChangeTrackForm';
import Operator5s from '../components/All_Deperments_Hub/ProductionHub/forms/daily/Operator_5s';
import TipChangeMonitorForm from '../components/All_Deperments_Hub/ProductionHub/forms/daily/TipChangeMonitorForm';
import FourMChangeDisplay from '../components/All_Deperments_Hub/ProductionHub/forms/daily/FourMChangeDisplay';
import FourMSummarySheet from '../components/All_Deperments_Hub/ProductionHub/forms/daily/FourMSummarySheet';
import FourMInformatinSheet from '../components/All_Deperments_Hub/ProductionHub/forms/daily/FourMInformatinSheet';
import ForMChangeInfoPrint from '../components/All_Deperments_Hub/ProductionHub/Views/daily/ForMChangeInfoPrint';
// --- DAILY VIEWS (PRINTS) ---
import DailyProdprint from '../components/All_Deperments_Hub/ProductionHub/Views/daily/DailyProdprint';
import BinTrollingprint from '../components/All_Deperments_Hub/ProductionHub/Views/daily/BinTrollingprint';
import ForMChangeInsPrint from '../components/All_Deperments_Hub/ProductionHub/Views/daily/ForMChangeInsPrint';
import ForMChangeRecordPrint from '../components/All_Deperments_Hub/ProductionHub/Views/daily/ForMChangeRecordPrint';
import Operator5sprint from '../components/All_Deperments_Hub/ProductionHub/Views/daily/Operator5sprint';
import TipChangeMonitorprint from '../components/All_Deperments_Hub/ProductionHub/Views/daily/TipChangeMonitorprint';

//--- Monthly Form ---
import MonthlyProdPlanForm from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/MonthlyProdPlanForm';
import MonthlyProdPlanPrint from '../components/All_Deperments_Hub/ProductionHub/Views/Monthly/MonthlyProdPlanPrint'
 import MonthlyProcessValidationPrint from  '../components/All_Deperments_Hub/ProductionHub/Views/Monthly/MonthlyProcessValidationPrint'
 import PreventiveMaintenancePrint from '../components/All_Deperments_Hub/ProductionHub/Views/Monthly/PreventiveMaintenancePrint'
 import OperatorObservancePlanPrint from '../components/All_Deperments_Hub/ProductionHub/Views/Monthly/OperatorObservancePlanPrint'
 import OperatorObservanceCheckSheetPrint from '../components/All_Deperments_Hub/ProductionHub/Views/Monthly/OperatorObservanceCheckSheetPrint'
import ProcessValidationForm from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/ProcessValidationForm';
import WelderQualificationForm from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/WelderQualTigMigForm';
import ProjectionWelderForm from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/ProjectionWelderForm';
import SpotWelderForm from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/WelderQualSpotForm';
import PreventiveMaintChecklist from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/PMChecklistMHEForm';
import OperatorObservancePlan from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/OperatorObservancePlanForm';
import OperatorObservanceChecklistForm from '../components/All_Deperments_Hub/ProductionHub/forms/monthly/OperatorObservanceChecklistForm';

//----Yearly Form---
import PlantCapacityForm from '../components/All_Deperments_Hub/ProductionHub/forms/yearly/PlantCapacityForm';
import MHEListForm from '../components/All_Deperments_Hub/ProductionHub/forms/yearly/MHEListForm';

const ProductionRoutes = () => {
  return (
    <Routes>
      {/* Root redirect & View Route */}
      <Route path="/" element={<Navigate to="daily" replace />} />
      <Route path="view/:formKey" element={<ProductionView />} />
      
      {/* Dynamic Tabs */}
      <Route path=":category" element={<ProductionHub />} />

      {/* --- DAILY ROUTES --- */}
      <Route path="daily/Daily-Prod-Plan-Form" element={<DailyProdForm />} />
      <Route path="daily/Daily-Prod-Plan-Report" element={<DailyProdprint />} />
      
      <Route path="daily/Operator-5S-Checklist" element={<Operator5s />} />
      <Route path="daily/Operator-5S-Report" element={<Operator5sprint />} />
      
      <Route path="daily/Bin-Trolling-Form" element={<BinTrollingForm />} />
      <Route path="daily/Bin-Trolley-Cleaning-Report" element={<BinTrollingprint />} />

      <Route path="daily/Tip-Change-Monitor-Form" element={<TipChangeMonitorForm />} />
      <Route path="daily/Tip-Change-Monitor-Report" element={<TipChangeMonitorprint />} />

      <Route path="daily/4M-Ins-Form" element={<ForMChangeInsForm />} />
      <Route path="daily/4M-Ins-Report" element={<ForMChangeInsPrint />} />

      <Route path="daily/4M-Tracking-Form" element={<MChangeTrackForm />} />
      <Route path="daily/4M-Change-Tracking-Report" element={<ForMChangeRecordPrint />} />
      <Route path="daily/4M-Change-Display-Board" element={<FourMChangeDisplay />} />
      <Route path="daily/4M-Summary-Sheet" element={<FourMSummarySheet />} />
      <Route path="daily/4m-Information-Sheet" element={<FourMInformatinSheet/>} />
       <Route path="daily/Information-Sheet-Report" element={<ForMChangeInfoPrint/>} />
      
      {/* --- MONTHLY ROUTES --- */}
      <Route path="monthly/Monthly-Prod-Plan-Form" element={<MonthlyProdPlanForm />} />
     <Route path="monthly/Monthly-Prod-Plan-Report" element={<MonthlyProdPlanPrint />} />
     
      <Route path="monthly/Process-Validation-Form" element={<ProcessValidationForm />} />
      <Route path="monthly/Process-Validation-Report" element={<MonthlyProcessValidationPrint />} />
      
      <Route path="monthly/Welder-Qual-TIG-MIG-Form" element={<WelderQualificationForm />} />
      <Route path="monthly/Welder-Qual-Proj-Form" element={<ProjectionWelderForm />} />
      <Route path="monthly/Welder-Qual-Spot-Form" element={<SpotWelderForm />} />
      <Route path="monthly/PM-Checklist-MHE-Form" element={<PreventiveMaintChecklist />} />
       <Route path="monthly/PM-Report" element={<PreventiveMaintenancePrint />} />
      <Route path="monthly/Operator-Observance-Plan" element={<OperatorObservancePlan />} />
      <Route path="monthly/Operator-Observance-Report" element={<OperatorObservancePlanPrint />} />
      <Route path="monthly/Operator-Observance-Check-Form" element={<OperatorObservanceChecklistForm />} />
       <Route path="monthly/Operator-Observance-checksheet" element={<OperatorObservanceCheckSheetPrint />} />

      {/* --- YEARLY ROUTES --- */}
      <Route path="yearly/Plant-Capacity-Form" element={<PlantCapacityForm />} />
      <Route path="yearly/MHE-List-Form" element={<MHEListForm />} />

      {/* 🔥 --- VIEW / APPROVE MODE ROUTES (NOTIFICATION CLICK HOOKS) --- 🔥 */}
      
      {/* Daily View Routes */}
      <Route path="view-report/daily-prod-plan/:id" element={<DailyProdForm />} />
      <Route path="view-report/five-s/:id" element={<Operator5s />} />
      <Route path="view-report/bin-trolley/:id" element={<BinTrollingForm />} />
      <Route path="view-report/tip-change/:id" element={<TipChangeMonitorForm />} />
      <Route path="view-report/four-m-inspection/:id" element={<ForMChangeInsForm />} />
      <Route path="view-report/four-m-record/:id" element={<MChangeTrackForm />} />
      <Route path="view-report/four-m-display/:id" element={<FourMChangeDisplay />} />
      <Route path="view-report/four-m-summary/:id" element={<FourMSummarySheet />} />
      <Route path="view-report/four-m-information/:id" element={<FourMInformatinSheet />}/>
      <Route path="view-report/information-sheet/:id" element={<FourMInformatinSheet />} />
      {/* Monthly View Routes */}
      <Route path="view-report/monthly-prod-plan/:id" element={<MonthlyProdPlanForm />} />
      <Route path="view-report/process-validation/:id" element={<ProcessValidationForm />} />
      <Route path="view-report/tig-mig-welder/:id" element={<WelderQualificationForm />} />
      <Route path="view-report/projection-welder/:id" element={<ProjectionWelderForm />} />
      <Route path="view-report/spot-welder/:id" element={<SpotWelderForm />} />
      <Route path="view-report/pm-checklist-mhe/:id" element={<PreventiveMaintChecklist />} />
      <Route path="view-report/operator-observance-plan/:id" element={<OperatorObservancePlan />} />
      <Route path="view-report/operator-observance-checklist/:id" element={<OperatorObservanceChecklistForm />} />
      
      {/* Yearly View Routes */}
      <Route path="view-report/plant-capacity/:id" element={<PlantCapacityForm />} />
      <Route path="view-report/mhe-list/:id" element={<MHEListForm />} />

    </Routes>
  );
};

export default ProductionRoutes;