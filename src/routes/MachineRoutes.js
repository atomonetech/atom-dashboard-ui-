import React from "react";
import { Routes, Route } from "react-router-dom";

// Existing Imports
import MachineHistoryCard from "../components/All_Deperments_Hub/MaintenanceHub/forms/MachineHistoryCard";
import DailyPowerPressChecksheet from "../components/All_Deperments_Hub/MaintenanceHub/forms/DailyPowerPressChecksheet";
import MachineBreakDownForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/MachineBreakDownForm";
import PokaYokeChecksheet from "../components/All_Deperments_Hub/MaintenanceHub/forms/PokaYokeChecksheet";
import PokaYokeChecksheetprint from "../components/All_Deperments_Hub/MaintenanceHub/forms/PokaYokeChecksheetprint";
import MachinePreventMainForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/MachinePreventMainForm";
import CncPreventiveMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/CNCPreventiveMaintenanceForm";
import ProjectionWeldingMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/ProjectionWeldingMaintenanceForm";
import VMMMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/VMMMaintenanceForm";
import PowerPressForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/PowerPressPreventiveMaintenanceForm";
import HydraulicMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/HydraulicMaintenanceForm";
import ServoPressMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/ServoPressMentinanceForm";

// Existing New Machine Forms
import TIGMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/TIGMaintenanceForm";
import SpotWeldingMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/SpotWeldingMaintenanceForm";
import CompressorMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/CompressorMaintenanceForm";
import DipMoldingMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/DipMoldingMentinanceForm";
import PipeCuttingMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/PipeCuttingMentinanceForm";
import VibraMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/VibraMentinanceForm";
import TappingMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/TappingMentinanceForm";

// ✅ NEW MACHINES ADDED HERE:
import LatheMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/LatheMaintenanceForm";
import DrillMachineMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/DrillMachineMaintenanceForm";
import SurfaceGrinderMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/SurfaceGrinderMaintenanceForm";
import BeltGrinderMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/BeltGrinderMaintenanceForm";
import BaseGrinderMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/BaseGrinderMaintenanceForm";

// Reports & Views
import MachineBreakDownSummary from "../components/All_Deperments_Hub/MaintenanceHub/forms/Machine-Break-Down-Summary";
import MachineMonthlyReport from "../components/All_Deperments_Hub/MaintenanceHub/views/MachineMonthlyReport";
import WhyAnalysisForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/WhyAnalysisForm";
import CriticalSparesForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/CriticslSpareForm";
import MachineYearlyReport from "../components/All_Deperments_Hub/MaintenanceHub/views/MachineYearlyReport";
import MasterMachineList from "../components/All_Deperments_Hub/MaintenanceHub/forms/MasterMachineList";
import MachineOverhaulingList from "../components/All_Deperments_Hub/MaintenanceHub/forms/MachineOverhaulingList";
import AnnualOverhaulingPlan from "../components/All_Deperments_Hub/MaintenanceHub/forms/AnnualOverhaulingPlan";
import WeeklyReports from "../components/All_Deperments_Hub/MaintenanceHub/views/ToolWeekly";

// Report Imports
import DailyPowerPressChecksheetPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/DailyPowerPressChecksheetprint";
import MachineBreakdownSummaryPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/MachineBreakdownSummaryPrint";
import MachineHistoryCardPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/MachineHistoryCardprint";
import ToolHistoryReport from "../components/All_Deperments_Hub/MaintenanceHub/Report/ToolHistoryReport";
import { Pi } from "lucide-react";

const MachineRoutes = () => {
  return (
    <Routes>
      {/* --- FORMS ROUTES --- */}
      <Route path="history-card" element={<MachineHistoryCard />} />
      <Route
        path="view-report/machine-history/:id"
        element={<MachineHistoryCard />}
      />
      <Route
        path="power-press-checksheet"
        element={<DailyPowerPressChecksheet />}
      />
      <Route
        path="view-report/power-press-checksheet/:id"
        element={<DailyPowerPressChecksheet />}
      />
      <Route path="breakdown-form" element={<MachineBreakDownForm />} />
      <Route
        path="view-report/machine-breakdown/:id"
        element={<MachineBreakDownForm />}
      />
      <Route path="Poka-Yoke" element={<PokaYokeChecksheet />} />
      <Route path="poka_yoke_check" element={<PokaYokeChecksheet />} />

      <Route
        path="view-report/poka-yoke/:id"
        element={<PokaYokeChecksheet />}
      />
      <Route path="breakdown-summary" element={<MachineBreakDownSummary />} />
      {/* FOOLPROOF POKA YOKE ROUTES */}
      <Route path="Poka-Yoke" element={<PokaYokeChecksheet />} />
      <Route path="poka_yoke_check" element={<PokaYokeChecksheet />} />
      {/* --- WEEKLY ROUTES --- */}
      <Route path="weekly-reports" element={<WeeklyReports />} />
      <Route
        path="weekly/preventive-vmc"
        element={<MachinePreventMainForm />}
      />
      <Route
        path="weekly/preventive-cnc"
        element={<CncPreventiveMaintenanceForm />}
      />
       <Route
        path="view-report/cnc/:id"
        element={<CncPreventiveMaintenanceForm />}
      />

      <Route path="weekly/preventive-powerpress" element={<PowerPressForm />} />
       <Route
        path="view-report/power-press-pm/:id"
        element={<PowerPressForm />}
      />

      <Route
        path="weekly/preventive-mig"
        element={<HydraulicMaintenanceForm />}
      />
       <Route
        path="view-report/hydraulic-pm/:id"
        element={<HydraulicMaintenanceForm />}
      />
      <Route
        path="weekly/projection-welding"
        element={<ProjectionWeldingMaintenanceForm />}
      />
      <Route
        path="view-report/projection-welding/:id"
        element={<ProjectionWeldingMaintenanceForm />}
      />

      <Route path="weekly/vmm" element={<VMMMaintenanceForm />} />
      <Route
        path="view-report/vmm/:id"
        element={<VMMMaintenanceForm />}
      />
      <Route path="weekly/tig" element={<TIGMaintenanceForm />} />
       <Route
        path="view-report/tig-welding-maintenance/:id"
        element={<TIGMaintenanceForm />}
      />
      <Route
        path="weekly/spot-welding"
        element={<SpotWeldingMaintenanceForm />}
      />
       <Route
        path="view-report/spot-welding-maintenance/:id"
        element={<SpotWeldingMaintenanceForm />}
      />
      <Route path="weekly/compressor" element={<CompressorMaintenanceForm />} />
         <Route
        path="view-report/compressor-maintenance/:id"
        element={<CompressorMaintenanceForm />}
      />
      {/* ✅ NEW MACHINE ROUTES ADDED HERE: */}
      <Route path="weekly/lathe" element={<LatheMaintenanceForm />} />
      <Route
        path="view-report/lathe-machine-maintenance/:id"
        element={<LatheMaintenanceForm />}
      />
      <Route path="weekly/drill" element={<DrillMachineMaintenanceForm />} />
      <Route
        path="view-report/vertical-drill-maintenance/:id"
        element={<DrillMachineMaintenanceForm />}
      />
      <Route
        path="weekly/surface-grinder"
        element={<SurfaceGrinderMaintenanceForm />}
      />
      <Route
        path="view-report/surface-grinder/:id"
        element={<SurfaceGrinderMaintenanceForm />}
      />
      <Route
        path="weekly/belt-grinder"
        element={<BeltGrinderMaintenanceForm />}
      />
       <Route
        path="view-report/belt-grinder/:id"
        element={<BeltGrinderMaintenanceForm />}
      />
      <Route
        path="weekly/base-grinder"
        element={<BaseGrinderMaintenanceForm />}
      />
       <Route
        path="view-report/base-grinder/:id"
        element={<BaseGrinderMaintenanceForm />}
      />
      <Route
        path="weekly/preventive-machine"
        element={<TappingMaintenanceForm />}
      />
      <Route
        path="weekly/preventive-cutting"
        element={<PipeCuttingMaintenanceForm />}
      />
      <Route
        path="view-report/pipe-cutting/:id"
        element={<PipeCuttingMaintenanceForm />}
      />
    
      <Route
        path="weekly/preventive-vibra"
        element={<VibraMaintenanceForm />}
      />
       <Route
        path="view-report/vibra/:id"
        element={<VibraMaintenanceForm />}
      />
      <Route
        path="weekly/preventive-molding"
        element={<DipMoldingMaintenanceForm />}
      />
       <Route
        path="view-report/dip-molding/:id"
        element={<DipMoldingMaintenanceForm />}
      />

      <Route
        path="weekly/preventive-press"
        element={<ServoPressMaintenanceForm />}
      />
       <Route
        path="view-report/servo-press/:id"
        element={<ServoPressMaintenanceForm />}
      />
      {/* Dynamic weekly route */}
      <Route
        path="weekly/preventive-:machineName"
        element={<MachinePreventMainForm />}

      />
      <Route
        path="view-report/preventive-maintenance/:id"
        element={<MachinePreventMainForm />}
      />
      {/* --- REPORT / PRINT ROUTES --- */}
      <Route
        path="power-press-checksheet/print"
        element={<DailyPowerPressChecksheetPrint />}
      />
      <Route path="history-card/print" element={<MachineHistoryCardPrint />} />
      <Route path="tool-history/report" element={<ToolHistoryReport />} />
      {/* FOOLPROOF POKA YOKE PRINT ROUTES */}
      <Route path="PokaYoke-report" element={<PokaYokeChecksheetprint />} />
      <Route
        path="poka_yoke_check/print"
        element={<PokaYokeChecksheetprint />}
      />
      {/* --- MONTHLY ROUTES --- */}
      <Route path="monthly" element={<MachineMonthlyReport />} />
      {/* <Route path="breakdown-summary" element={<MachineBreakdownSummary />} /> */}
      <Route path="why-why-analysis" element={<WhyAnalysisForm />} />
      <Route path="critical-spares" element={<CriticalSparesForm />} />
      {/* --- YEARLY ROUTES --- */}
      <Route path="yearly" element={<MachineYearlyReport />} />
      <Route path="master-list-mc" element={<MasterMachineList />} />
      <Route path="mc-overhauling-list" element={<MachineOverhaulingList />} />
    </Routes>
  );
};

export default MachineRoutes;
