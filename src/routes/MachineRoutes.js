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
import PipeCuttingMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/PipeCuttingMaintenanceForm";
import VibraMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/VibraMentinanceForm";
import TappingMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/TappingMentinanceForm";

// ✅ NEW MACHINES ADDED HERE:
import LatheMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/LatheMaintenanceForm";
import DrillMachineMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/DrillMachineMaintenanceForm";
import SurfaceGrinderMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/SurfaceGrinderMaintenanceForm";
import BeltGrinderMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/BeltGrinderMaintenanceForm";
import BaseGrinderMaintenanceForm from "../components/All_Deperments_Hub/MaintenanceHub/forms/BaseGrinderMaintenanceForm";

// Reports & Views
// import MachinebreakdownSummary from "../components/All_Deperments_Hub/MaintenanceHub/forms/MachinebreakdownSummary";
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
      <Route path="breakdown-form" element={<MachineBreakDownForm />} />
      <Route
        path="power-press-checksheet"
        element={<DailyPowerPressChecksheet />}
      />{" "}
      {/* This is Daily, so no weekly in path */}
      {/* <Route path="breakdown-form" element={<MachinebreakdownSummary />} /> */}
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
      <Route path="weekly/preventive-powerpress" element={<PowerPressForm />} />
      <Route
        path="weekly/preventive-mig"
        element={<HydraulicMaintenanceForm />}
      />
      <Route
        path="weekly/projection-welding"
        element={<ProjectionWeldingMaintenanceForm />}
      />
      <Route path="weekly/vmm" element={<VMMMaintenanceForm />} />
      <Route path="weekly/tig" element={<TIGMaintenanceForm />} />
      <Route
        path="weekly/spot-welding"
        element={<SpotWeldingMaintenanceForm />}
      />
      <Route path="weekly/compressor" element={<CompressorMaintenanceForm />} />
      {/* ✅ NEW MACHINE ROUTES ADDED HERE: */}
      <Route path="weekly/lathe" element={<LatheMaintenanceForm />} />
      <Route path="weekly/drill" element={<DrillMachineMaintenanceForm />} />
      <Route
        path="weekly/surface-grinder"
        element={<SurfaceGrinderMaintenanceForm />}
      />
      <Route
        path="weekly/belt-grinder"
        element={<BeltGrinderMaintenanceForm />}
      />
      <Route
        path="weekly/base-grinder"
        element={<BaseGrinderMaintenanceForm />}
      />
      <Route
        path="weekly/preventive-machine"
        element={<TappingMaintenanceForm />}
      />
      
      

      <Route
        path="weekly/preventive-cutting"
        element={< PipeCuttingMaintenanceForm />}
      />
      <Route
        path="weekly/preventive-vibra"
        element={<VibraMaintenanceForm  />}
      />

     
      <Route
        path="weekly/preventive-molding"
        element={<DipMoldingMaintenanceForm  />}
      />

       <Route
        path="weekly/preventive-press"
        element={<ServoPressMaintenanceForm />}
      />
      {/* Dynamic weekly route */}
      <Route
        path="weekly/preventive-:machineName"
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
