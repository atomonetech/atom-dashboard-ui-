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

// weekly Reports Print Route import
import VerticalMillingMachineMaintenancePrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/VMMMaintenancePrint";
import ProjectionWeldingMaintenancePrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/ProjectionWeldPrint";
import VMCMaintenancePrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/VMCMaintenancePrint";
import CNCMaintenancePrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/CNCMaintenancePrint";
import PowerPressPreventiveMaintenanceCheckSheetPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/PowerPressPMChecksheetPrint";
import HydraulicMachinePreventiveMaintenanceCheckSheetPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/HydraulicPMCheckSheetPrint";
import TigWeldingMachinePreventiveMaintenanceCheckSheetPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/TIGChecksheetPrint";
import SpotWeldingMachinePreventiveMaintenanceCheckSheetPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/SpotWeldingPMPrint";
import CompressorPreventiveMaintenanceCheckSheetPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/CompressorPMChecksheetPrint";
import LatheMachinePMCheckSheetPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/LathePMChecksheetPrint";
import DrillMachinePMCheckSheetPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/DrillPMChecksheetPrint";
import SurfaceGrinderPMCheckSheetPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/SurfaceGrinderPMPrint";
import BeltGrinderPMCheckSheetPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/BeltGrinderPMPrint";
import BaseGrinderPMCheckSheetPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/BaseGrinderPMPrint";
import PipeCutterPMCheckSheetPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/PipeCutterPMPrint";
import VibraPMCheckSheetPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/VibraPMPrint";
import DipMoldingPMCheckSheetPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/DipMoldingPMPrint";
import ServoPressPMCheckSheetPrint from "../components/All_Deperments_Hub/MaintenanceHub/Report/ServoPressPMPrint";




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
      <Route 
      path="weekly/vmm" element={<VMMMaintenanceForm />} />

      <Route 
      path="weekly/tig" element={<TIGMaintenanceForm />} />

      <Route
        path="weekly/spot-welding"
        element={<SpotWeldingMaintenanceForm />}
      />

      <Route 
      path="weekly/compressor" element={<CompressorMaintenanceForm />} />
      
      {/* ✅ NEW MACHINE ROUTES ADDED HERE: */}
      <Route 
      path="weekly/lathe" element={<LatheMaintenanceForm />} />
      <Route 
      path="weekly/drill" element={<DrillMachineMaintenanceForm />} />
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
        element={<PipeCuttingMaintenanceForm />}
      />
      <Route
        path="weekly/preventive-vibra"
        element={<VibraMaintenanceForm />}
      />
      <Route
        path="weekly/preventive-molding"
        element={<DipMoldingMaintenanceForm />}
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
      <Route
        path="breakdown-form/print"
        element={<MachineBreakdownSummaryPrint />} />

      <Route path="history-card/print" element={<MachineHistoryCardPrint />} />

     
       



      {/* Weekly Reports Print Route */}

      <Route path="weekly/vmm/print" element={<VerticalMillingMachineMaintenancePrint />} />
      <Route path="weekly/projection-welding/print" element={<ProjectionWeldingMaintenancePrint />} />
      <Route path="weekly/preventive-vmc/print" element={<VMCMaintenancePrint />} />
      <Route path="weekly/preventive-cnc/print" element={<CNCMaintenancePrint />} />
      <Route path="weekly/preventive-powerpress/print" element={<PowerPressPreventiveMaintenanceCheckSheetPrint />} />
      <Route path="weekly/preventive-mig/print" element={<HydraulicMachinePreventiveMaintenanceCheckSheetPrint />} />
      <Route path="weekly/tig/print" element={<TigWeldingMachinePreventiveMaintenanceCheckSheetPrint />} />
      <Route path="weekly/spot-welding/print" element={<SpotWeldingMachinePreventiveMaintenanceCheckSheetPrint />} />
      <Route path="weekly/compressor/print" element={<CompressorPreventiveMaintenanceCheckSheetPrint />} />
      <Route path="weekly/lathe/print" element={<LatheMachinePMCheckSheetPrint />} />
      <Route path="weekly/drill/print" element={<DrillMachinePMCheckSheetPrint />} />
      <Route path="weekly/surface-grinder/print" element={<SurfaceGrinderPMCheckSheetPrint />} />
      <Route path="weekly/belt-grinder/print" element={<BeltGrinderPMCheckSheetPrint />} />
      <Route path="weekly/base-grinder/print" element={<BaseGrinderPMCheckSheetPrint />} />
      <Route path="weekly/preventive-cutting/print" element={<PipeCutterPMCheckSheetPrint />} />
      <Route path="weekly/preventive-vibra/print" element={<VibraPMCheckSheetPrint />} />
      <Route path="weekly/preventive-molding/print" element={<DipMoldingPMCheckSheetPrint />} />
      <Route path="weekly/preventive-press/print" element={<ServoPressPMCheckSheetPrint />} />
      

     
     
     
     
     
     
     
     
     
     
      {/* FOOLPROOF POKA YOKE PRINT ROUTES */}
      <Route path="PokaYoke-report" element={<PokaYokeChecksheetprint />} />

      <Route path="poka_yoke_check/print"
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
