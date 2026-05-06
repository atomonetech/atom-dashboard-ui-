// import React from 'react';
// import { Routes, Route } from 'react-router-dom';

// // ========== DAILY FORMS IMPORTS ==========
// import IncomingMaterialInsp from '../components/All_Deperments_Hub/QaHub/forms/daily/IncomingMaterialInsp';
// import RedBinForm from '../components/All_Deperments_Hub/QaHub/forms/daily/RedBinForm';
// import ScrapNote from "../components/All_Deperments_Hub/QaHub/forms/daily/ScrapNoteForm";
// import RedbinAttendance from '../components/All_Deperments_Hub/QaHub/forms/daily/RedbinAttendance';
// import PokaYokeChecksheet from '../components/All_Deperments_Hub/QaHub/forms/daily/PokaYokeChecksheet';
// import InspectionForm from '../components/All_Deperments_Hub/QaHub/forms/daily/InspectionForm';
// import PdiReportForm from '../components/All_Deperments_Hub/QaHub/forms/daily/PdiReportForm';
// import ReworkRepair from '../components/All_Deperments_Hub/QaHub/forms/daily/ReworkRepair';
// import DeviationApprovalForm from '../components/All_Deperments_Hub/QaHub/forms/daily/DeviationApprovalForm';
// import GoodReceiptFrom from '../components/All_Deperments_Hub/QaHub/forms/daily/GoodReceiptFrom';
// import SampleInspectionReport from '../components/All_Deperments_Hub/QaHub/forms/daily/SampleInspectionReport';

// // ========== DAILY PRINTS IMPORTS ==========
// import IncomingMaterialprint from '../components/All_Deperments_Hub/QaHub/forms/daily/IncomingMaterialprint';
// import RedBinprint from '../components/All_Deperments_Hub/QaHub/forms/daily/RedBinprint';
// import RedBinAttendanceprint from '../components/All_Deperments_Hub/QaHub/forms/daily/RedBinAttendanceprint';
// import Scrapnoteprint from '../components/All_Deperments_Hub/QaHub/forms/daily/Scrapnoteprint';
// import PokaYokeChecksheetprint from '../components/All_Deperments_Hub/QaHub/forms/daily/PokaYokeChecksheetprint';
// import Inspectionprint from '../components/All_Deperments_Hub/QaHub/forms/daily/Inspectionprint';
// import Reworkrepairprint from '../components/All_Deperments_Hub/QaHub/forms/daily/Reworkrepairprint';
// import SampleInspectionprint from '../components/All_Deperments_Hub/QaHub/forms/daily/SampleInspectionprint';
// import DeviationApprovalprint from '../components/All_Deperments_Hub/QaHub/forms/daily/DeviationApprovalprint';
// import PdiReportprint from '../components/All_Deperments_Hub/QaHub/forms/daily/PdiReportprint';

// // ========== MONTHLY FORMS IMPORTS ==========
// import ProcessAuditChecksheet from '../components/All_Deperments_Hub/QaHub/forms/monthly/ProcessAuditChecksheet';
// import BoQualityPlan from '../components/All_Deperments_Hub/QaHub/forms/monthly/BoQualityPlan';
// import CaPaReport from '../components/All_Deperments_Hub/QaHub/forms/monthly/CaPaReport';
// import CoherenceChecklist from '../components/All_Deperments_Hub/QaHub/forms/monthly/CoherenceChecklist';
// import ControlPlan from '../components/All_Deperments_Hub/QaHub/forms/monthly/ControlPlan';
// import CopqGuideline from '../components/All_Deperments_Hub/QaHub/forms/monthly/CopqGuideline';
// import CustomerRequirement from '../components/All_Deperments_Hub/QaHub/forms/monthly/CustomerRequirement';
// import CustomerSatisfactionCard from '../components/All_Deperments_Hub/QaHub/forms/monthly/CustomerSatisfactionCard';
// import GaugeValidationReport from '../components/All_Deperments_Hub/QaHub/forms/monthly/GaugeValidationReport';
// import ImprovementSuggestion from '../components/All_Deperments_Hub/QaHub/forms/monthly/ImprovementSuggestion';
// import LayoutInspectionReport from '../components/All_Deperments_Hub/QaHub/forms/monthly/LayoutInspectionReport';
// import MinutesOfMeetings from '../components/All_Deperments_Hub/QaHub/forms/monthly/MinutesOfMeetings';
// import MsaReport from '../components/All_Deperments_Hub/QaHub/forms/monthly/MsaReport';
// import ParetoAnalysis from '../components/All_Deperments_Hub/QaHub/forms/monthly/ParetoAnalysis';
// import ProcessCapabilityStudy from '../components/All_Deperments_Hub/QaHub/forms/monthly/ProcessCapabilityStudy';
// import ProductAuditChecksheet from '../components/All_Deperments_Hub/QaHub/forms/monthly/ProductAuditChecksheet';
// import SupplierPartList from '../components/All_Deperments_Hub/QaHub/forms/monthly/SupplierPartList';
// import CustomerComplaintRegister from '../components/All_Deperments_Hub/QaHub/forms/monthly/CustomerComplaintRegister';
// // import VisuallnspectionStandard from '../components/All_Deperments_Hub/QaHub/forms/monthly/VisuallnspectionStandard';
// import WarrantyClaimRegister from '../components/All_Deperments_Hub/QaHub/forms/monthly/WarrantyClaimRegister';
// import WorkInstruction from '../components/All_Deperments_Hub/QaHub/forms/monthly/WorkInstruction';


// // yearly 
// import AnnualLayoutPlan from '../components/All_Deperments_Hub/QaHub/forms/yearly/AnnualLayoutPlan';
// import SamplingPlan from '../components/All_Deperments_Hub/QaHub/forms/yearly/SamplingPlan';
// import PokaYokeList from '../components/All_Deperments_Hub/QaHub/forms/yearly/PokaYokeList';
// import CustomerSurvey from '../components/All_Deperments_Hub/QaHub/forms/yearly/CustomerSurvey';
// import CpCpkPlan from '../components/All_Deperments_Hub/QaHub/forms/yearly/CpCpkPlan';
// import ProductAuditPlan from '../components/All_Deperments_Hub/QaHub/forms/yearly/ProductAuditPlan';
// import ProcessAuditPlan from '../components/All_Deperments_Hub/QaHub/forms/yearly/ProcessAuditPlan';
// import CheckingFixtureList from '../components/All_Deperments_Hub/QaHub/forms/yearly/CheckingFixtureList';
// const QaRoutes = () => {
//     return (
//         <Routes>
//             {/* Yahan humne path="daily/..." use kiya hai. 
//                 URL bar mein /qa-hub-form/daily/Scrap-Note hone par ye turant match ho jayega.
//             */}

//             {/* --- DAILY SECTION --- */}
//             <Route path="daily/Incoming-Material" element={<IncomingMaterialInsp />} />
//             <Route path="daily/RedBin-Form" element={<RedBinForm />} />
//             <Route path="daily/Scrap-Note" element={<ScrapNote />} />
//             <Route path="daily/Redbin-Attendance" element={<RedbinAttendance />} />
//             <Route path="daily/Poka-Yoke" element={<PokaYokeChecksheet />} />
//             <Route path="daily/inspection-form" element={<InspectionForm />} />
//             <Route path="daily/pdi-report-form" element={<PdiReportForm />} />
//             <Route path="daily/Rework" element={<ReworkRepair />} />
//             <Route path="daily/sample-inspection" element={<SampleInspectionReport />} />
//             <Route path="daily/Deviation-Approval-Form" element={<DeviationApprovalForm />} />
//             <Route path="daily/Good-Receipt" element={<GoodReceiptFrom />} />

//             {/* Daily Prints/Reports */}
//             <Route path="daily/incomingmaterial-report" element={<IncomingMaterialprint />} />
//             <Route path="daily/redbin-analysis-report" element={<RedBinprint />} />
//             <Route path="daily/scrap-note-report" element={<Scrapnoteprint />} />
//             <Route path="daily/redbin-attendance-report" element={<RedBinAttendanceprint />} />
//             <Route path="daily/PokaYoke-report" element={<PokaYokeChecksheetprint />} />
//             <Route path="daily/inspection-report" element={<Inspectionprint />} />
//             <Route path="daily/rework-report" element={<Reworkrepairprint />} />
//             <Route path="daily/sample-inspection-report" element={<SampleInspectionprint />} />
//             <Route path="daily/Deviation-report" element={<DeviationApprovalprint />} />
//             <Route path="daily/pdiprint-report" element={<PdiReportprint />} />

//             {/* --- MONTHLY SECTION --- */}
//          <Route path="monthly/bo-quality-plan" element={<BoQualityPlan />} />
//             <Route path="monthly/8d-report" element={<CaPaReport />} />
//             <Route path="monthly/coherence-checklist" element={<CoherenceChecklist />} />
//             <Route path="monthly/control-plan" element={<ControlPlan />} />
//             <Route path="monthly/copq" element={<CopqGuideline />} />
//             <Route path="monthly/customer-req" element={<CustomerRequirement />} />
//             <Route path="monthly/complaint-reg" element={<CustomerComplaintRegister/>}/>
//             <Route path="monthly/gauge-validation" element={<GaugeValidationReport />} />
//             <Route path="monthly/suggestions" element={<ImprovementSuggestion />} />
//             <Route path="monthly/layout-report" element={<LayoutInspectionReport />} />
//             <Route path="monthly/mom" element={<MinutesOfMeetings />} />
//             <Route path="monthly/msa-report" element={<MsaReport />} />
//             <Route path="monthly/pareto-analysis" element={<ParetoAnalysis />} />
//             <Route path="monthly/process-audit" element={<ProcessAuditChecksheet />} />
//             <Route path="monthly/cp-cpk" element={<ProcessCapabilityStudy />} />
//             <Route path="monthly/product-audit" element={<ProductAuditChecksheet />} />
//             <Route path="monthly/supplier-list" element={<SupplierPartList />} />
//             {/* <Route path="monthly/visual-std" element={<VisuallnspectionStandard />} /> */}
//             <Route path="monthly/warranty-reg" element={<WarrantyClaimRegister />} />
//             <Route path="monthly/work-instruction" element={<WorkInstruction />} />
//             <Route path="monthly/customer-satisfaction" element={<CustomerSatisfactionCard/>}/>

//             {/* --- YEARLY SECTION --- */}
//           <Route path="yearly/layout-plan" element={<AnnualLayoutPlan />} />
//        <Route path="yearly/sampling-plan" element={<SamplingPlan />} />
//         <Route path="yearly/poka-yoke-list" element={<PokaYokeList />} />
//        <Route path="yearly/customer-survey" element={<CustomerSurvey />} />
//        <Route path="yearly/cp-cpk-plan" element={<CpCpkPlan />} />
//         <Route path="yearly/product-audit-plan" element={<ProductAuditPlan />} />
//        <Route path="yearly/process-audit-plan" element={<ProcessAuditPlan />} />
//          <Route path="yearly/fixture-list" element={<CheckingFixtureList />} />
//         </Routes>
//     );
// };

// export default QaRoutes;


import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ========== MAIN QAHUB & VIEW COMPONENT IMPORT ==========
import QaHub from '../components/All_Deperments_Hub/QaHub/QaHub';
import Qaview from '../components/All_Deperments_Hub/QaHub/Qaview';

// ========== DAILY FORMS IMPORTS ==========
import IncomingMaterialInsp from '../components/All_Deperments_Hub/QaHub/forms/daily/IncomingMaterialInsp';
import RedBinForm from '../components/All_Deperments_Hub/QaHub/forms/daily/RedBinForm';
import ScrapNote from "../components/All_Deperments_Hub/QaHub/forms/daily/ScrapNoteForm";
import RedbinAttendance from '../components/All_Deperments_Hub/QaHub/forms/daily/RedbinAttendance';
import PokaYokeChecksheet from '../components/All_Deperments_Hub/QaHub/forms/daily/PokaYokeChecksheet';
import InspectionForm from '../components/All_Deperments_Hub/QaHub/forms/daily/InspectionForm';
import PdiReportForm from '../components/All_Deperments_Hub/QaHub/forms/daily/PdiReportForm';
import ReworkRepair from '../components/All_Deperments_Hub/QaHub/forms/daily/ReworkRepair';
import DeviationApprovalForm from '../components/All_Deperments_Hub/QaHub/forms/daily/DeviationApprovalForm';
import GoodReceiptFrom from '../components/All_Deperments_Hub/QaHub/forms/daily/GoodReceiptFrom';
import SampleInspectionReport from '../components/All_Deperments_Hub/QaHub/forms/daily/SampleInspectionReport';

// ========== DAILY PRINTS IMPORTS ==========
import IncomingMaterialprint from '../components/All_Deperments_Hub/QaHub/forms/daily/IncomingMaterialprint';
import RedBinprint from '../components/All_Deperments_Hub/QaHub/forms/daily/RedBinprint';
import RedBinAttendanceprint from '../components/All_Deperments_Hub/QaHub/forms/daily/RedBinAttendanceprint';
import Scrapnoteprint from '../components/All_Deperments_Hub/QaHub/forms/daily/Scrapnoteprint';
import PokaYokeChecksheetprint from '../components/All_Deperments_Hub/QaHub/forms/daily/PokaYokeChecksheetprint';
import Inspectionprint from '../components/All_Deperments_Hub/QaHub/forms/daily/Inspectionprint';
import Reworkrepairprint from '../components/All_Deperments_Hub/QaHub/forms/daily/Reworkrepairprint';
import SampleInspectionprint from '../components/All_Deperments_Hub/QaHub/forms/daily/SampleInspectionprint';
import DeviationApprovalprint from '../components/All_Deperments_Hub/QaHub/forms/daily/DeviationApprovalprint';
import PdiReportprint from '../components/All_Deperments_Hub/QaHub/forms/daily/PdiReportprint';

// ========== MONTHLY FORMS IMPORTS ==========
import ProcessAuditChecksheet from '../components/All_Deperments_Hub/QaHub/forms/monthly/ProcessAuditChecksheet';
import BoQualityPlan from '../components/All_Deperments_Hub/QaHub/forms/monthly/BoQualityPlan';
import CaPaReport from '../components/All_Deperments_Hub/QaHub/forms/monthly/CaPaReport';
import CoherenceChecklist from '../components/All_Deperments_Hub/QaHub/forms/monthly/CoherenceChecklist';
import ControlPlan from '../components/All_Deperments_Hub/QaHub/forms/monthly/ControlPlan';
import CopqGuideline from '../components/All_Deperments_Hub/QaHub/forms/monthly/CopqGuideline';
import CustomerRequirement from '../components/All_Deperments_Hub/QaHub/forms/monthly/CustomerRequirement';
import CustomerSatisfactionCard from '../components/All_Deperments_Hub/QaHub/forms/monthly/CustomerSatisfactionCard';
import GaugeValidationReport from '../components/All_Deperments_Hub/QaHub/forms/monthly/GaugeValidationReport';
import ImprovementSuggestion from '../components/All_Deperments_Hub/QaHub/forms/monthly/ImprovementSuggestion';
import LayoutInspectionReport from '../components/All_Deperments_Hub/QaHub/forms/monthly/LayoutInspectionReport';
import MinutesOfMeetings from '../components/All_Deperments_Hub/QaHub/forms/monthly/MinutesOfMeetings';
import MsaReport from '../components/All_Deperments_Hub/QaHub/forms/monthly/MsaReport';
import ParetoAnalysis from '../components/All_Deperments_Hub/QaHub/forms/monthly/ParetoAnalysis';
import ProcessCapabilityStudy from '../components/All_Deperments_Hub/QaHub/forms/monthly/ProcessCapabilityStudy';
import ProductAuditChecksheet from '../components/All_Deperments_Hub/QaHub/forms/monthly/ProductAuditChecksheet';
import SupplierPartList from '../components/All_Deperments_Hub/QaHub/forms/monthly/SupplierPartList';
import CustomerComplaintRegister from '../components/All_Deperments_Hub/QaHub/forms/monthly/CustomerComplaintRegister';
import WarrantyClaimRegister from '../components/All_Deperments_Hub/QaHub/forms/monthly/WarrantyClaimRegister';
import WorkInstruction from '../components/All_Deperments_Hub/QaHub/forms/monthly/WorkInstruction';

// ========== YEARLY FORMS IMPORTS ==========
import AnnualLayoutPlan from '../components/All_Deperments_Hub/QaHub/forms/yearly/AnnualLayoutPlan';
import SamplingPlan from '../components/All_Deperments_Hub/QaHub/forms/yearly/SamplingPlan';
import PokaYokeList from '../components/All_Deperments_Hub/QaHub/forms/yearly/PokaYokeList';
import CustomerSurvey from '../components/All_Deperments_Hub/QaHub/forms/yearly/CustomerSurvey';
import CpCpkPlan from '../components/All_Deperments_Hub/QaHub/forms/yearly/CpCpkPlan';
import ProductAuditPlan from '../components/All_Deperments_Hub/QaHub/forms/yearly/ProductAuditPlan';
import ProcessAuditPlan from '../components/All_Deperments_Hub/QaHub/forms/yearly/ProcessAuditPlan';
import CheckingFixtureList from '../components/All_Deperments_Hub/QaHub/forms/yearly/CheckingFixtureList';

const QaRoutes = () => {
    return (
        <Routes>
            {/* 🔥 ROOT REDIRECT 🔥 */}
            <Route path="/" element={<Navigate to="daily" replace />} />
            
            {/* 🔥 VIEW ROUTE (Isko Upar rakhna zaroori hai) 🔥 */}
            <Route path="view/:formKey" element={<Qaview />} />

            {/* 🔥 TABS & DASHBOARD ROUTING 🔥 */}
            <Route path=":category" element={<QaHub />} />

            {/* --- DAILY SECTION --- */}
            <Route path="daily/Incoming-Material" element={<IncomingMaterialInsp />} />
            <Route path="daily/RedBin-Form" element={<RedBinForm />} />
            <Route path="daily/Scrap-Note" element={<ScrapNote />} />
            <Route path="daily/Redbin-Attendance" element={<RedbinAttendance />} />
            <Route path="daily/Poka-Yoke" element={<PokaYokeChecksheet />} />
            <Route path="daily/inspection-form" element={<InspectionForm />} />
            <Route path="daily/pdi-report-form" element={<PdiReportForm />} />
            <Route path="daily/Rework" element={<ReworkRepair />} />
            <Route path="daily/sample-inspection" element={<SampleInspectionReport />} />
            <Route path="daily/Deviation-Approval-Form" element={<DeviationApprovalForm />} />
            <Route path="daily/Good-Receipt" element={<GoodReceiptFrom />} />

            {/* Daily Prints/Reports */}
            <Route path="daily/incomingmaterial-report" element={<IncomingMaterialprint />} />
            <Route path="daily/redbin-analysis-report" element={<RedBinprint />} />
            <Route path="daily/scrap-note-report" element={<Scrapnoteprint />} />
            <Route path="daily/redbin-attendance-report" element={<RedBinAttendanceprint />} />
            <Route path="daily/PokaYoke-report" element={<PokaYokeChecksheetprint />} />
            <Route path="daily/inspection-report" element={<Inspectionprint />} />
            <Route path="daily/rework-report" element={<Reworkrepairprint />} />
            <Route path="daily/sample-inspection-report" element={<SampleInspectionprint />} />
            <Route path="daily/Deviation-report" element={<DeviationApprovalprint />} />
            <Route path="daily/pdiprint-report" element={<PdiReportprint />} />

            {/* --- MONTHLY SECTION --- */}
            <Route path="monthly/bo-quality-plan" element={<BoQualityPlan />} />
            <Route path="monthly/8d-report" element={<CaPaReport />} />
            <Route path="monthly/coherence-checklist" element={<CoherenceChecklist />} />
            <Route path="monthly/control-plan" element={<ControlPlan />} />
            <Route path="monthly/copq" element={<CopqGuideline />} />
            <Route path="monthly/customer-req" element={<CustomerRequirement />} />
            <Route path="monthly/complaint-reg" element={<CustomerComplaintRegister/>}/>
            <Route path="monthly/gauge-validation" element={<GaugeValidationReport />} />
            <Route path="monthly/suggestions" element={<ImprovementSuggestion />} />
            <Route path="monthly/layout-report" element={<LayoutInspectionReport />} />
            <Route path="monthly/mom" element={<MinutesOfMeetings />} />
            <Route path="monthly/msa-report" element={<MsaReport />} />
            <Route path="monthly/pareto-analysis" element={<ParetoAnalysis />} />
            <Route path="monthly/process-audit" element={<ProcessAuditChecksheet />} />
            <Route path="monthly/cp-cpk" element={<ProcessCapabilityStudy />} />
            <Route path="monthly/product-audit" element={<ProductAuditChecksheet />} />
            <Route path="monthly/supplier-list" element={<SupplierPartList />} />
            <Route path="monthly/warranty-reg" element={<WarrantyClaimRegister />} />
            <Route path="monthly/work-instruction" element={<WorkInstruction />} />
            <Route path="monthly/customer-satisfaction" element={<CustomerSatisfactionCard/>}/>

            {/* --- YEARLY SECTION --- */}
            <Route path="yearly/layout-plan" element={<AnnualLayoutPlan />} />
            <Route path="yearly/sampling-plan" element={<SamplingPlan />} />
            <Route path="yearly/poka-yoke-list" element={<PokaYokeList />} />
            <Route path="yearly/customer-survey" element={<CustomerSurvey />} />
            <Route path="yearly/cp-cpk-plan" element={<CpCpkPlan />} />
            <Route path="yearly/product-audit-plan" element={<ProductAuditPlan />} />
            <Route path="yearly/process-audit-plan" element={<ProcessAuditPlan />} />
            <Route path="yearly/fixture-list" element={<CheckingFixtureList />} />
        </Routes>
    );
};

export default QaRoutes;