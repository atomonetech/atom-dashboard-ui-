import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import AnalysisHubLanding from './AnalysisHubLanding';
import DepartmentHierarchy from './DepartmentHierarchy';
import TeamHierarchy from './TeamHierarchy';
import ReportDetails from './ReportDetails';


function AnalysisHubContent({
  currentView,
  selectedAnalysis,
  selectedDepartment,
  selectedHeadEmail,
  initialSearchFilter,
  handleAnalysisClick,
  handleDepartmentClick,
  handleBackToDepartments,
  handleBackToLanding,
  handleViewReports,
  handleBackFromReports
}) {
  return (
    <motion.div
      key={currentView}
      className="analysis-hub-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {currentView === 'landing' && (
        <AnalysisHubLanding onAnalysisClick={handleAnalysisClick} />
      )}

      {currentView === 'departments' && (
        <DepartmentHierarchy
          analysisType={selectedAnalysis}
          onDepartmentClick={handleDepartmentClick}
          onBack={handleBackToLanding}
        />
      )}

      {currentView === 'teamHierarchy' && (
        <TeamHierarchy
          department={selectedDepartment}
          analysisType={selectedAnalysis}
          onBack={handleBackToDepartments}
          onViewReports={handleViewReports}
        />
      )}

      {currentView === 'reports' && (
        <ReportDetails
          department={selectedDepartment}
          headEmail={selectedHeadEmail}
          initialSearch={initialSearchFilter}
          onBack={handleBackFromReports}
        />
      )}
    </motion.div>
  );
}


export default function AnalysisHub() {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedHeadEmail, setSelectedHeadEmail] = useState("");
  const [initialSearchFilter, setInitialSearchFilter] = useState("");
  const [breadcrumb, setBreadcrumb] = useState(['Analysis Hub']);

  const handleAnalysisClick = (analysisId, analysisTitle) => {
    setSelectedAnalysis(analysisId);
    setCurrentView('departments');
    setBreadcrumb(['Analysis Hub', analysisTitle || analysisId]);
  };

  const handleDepartmentClick = (deptName) => {
    setSelectedDepartment(deptName);
    setCurrentView('teamHierarchy');
    setBreadcrumb(['Analysis Hub', selectedAnalysis, deptName]);
  };

  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
    setCurrentView('departments');
    setBreadcrumb(['Analysis Hub', selectedAnalysis]);
  };

  const handleBackToLanding = () => {
    setSelectedAnalysis(null);
    setSelectedDepartment(null);
    setCurrentView('landing');
    setBreadcrumb(['Analysis Hub']);
  };

  const handleViewReports = (headEmail, operatorName = "") => {
    setSelectedHeadEmail(headEmail);
    setInitialSearchFilter(operatorName);
    setCurrentView("reports");

    const displayLabel = operatorName
      ? `${operatorName}'s Logs`
      : 'Reports';

    setBreadcrumb([
      'Analysis Hub',
      selectedAnalysis,
      selectedDepartment,
      displayLabel
    ]);
  };

  const handleBackFromReports = () => {
    setInitialSearchFilter("");
    setCurrentView('teamHierarchy');
    setBreadcrumb([
      'Analysis Hub',
      selectedAnalysis,
      selectedDepartment
    ]);
  };

  return (
    <div className="analysis-hub-theme min-h-screen">

      <style>{`
        /* =========================================
           ANALYSIS HUB DARK THEME
           Same Theme as Maintenance Dashboard
        ========================================== */

        .analysis-hub-theme {
          min-height: 100vh;
          background: #0f172a;
          color: #f8fafc;
          transition: background .3s, color .3s;
        }

        .analysis-hub-content {
          min-height: 100vh;
          background: #0f172a;
          color: #f8fafc;
        }


        /* =========================================
           MAIN LIGHT BACKGROUND OVERRIDES
        ========================================== */

        .analysis-hub-theme .bg-white {
          background-color: #182338 !important;
        }

        .analysis-hub-theme .bg-slate-50,
        .analysis-hub-theme .bg-gray-50 {
          background-color: #0f172a !important;
        }

        .analysis-hub-theme .bg-slate-100,
        .analysis-hub-theme .bg-gray-100 {
          background-color: #202d43 !important;
        }

        .analysis-hub-theme .bg-slate-200,
        .analysis-hub-theme .bg-gray-200 {
          background-color: #263750 !important;
        }


        /* =========================================
           GRADIENT BACKGROUND OVERRIDES
        ========================================== */

        .analysis-hub-theme .bg-gradient-to-br,
        .analysis-hub-theme .bg-gradient-to-r,
        .analysis-hub-theme .bg-gradient-to-b {
          background-image: none !important;
        }

        .analysis-hub-theme .from-slate-50,
        .analysis-hub-theme .via-white,
        .analysis-hub-theme .to-slate-50 {
          --tw-gradient-from: #0f172a !important;
          --tw-gradient-to: #0f172a !important;
          --tw-gradient-stops: #0f172a, #0f172a !important;
        }


        /* =========================================
           CARD / PANEL STYLE
        ========================================== */

        .analysis-hub-theme .rounded-xl,
        .analysis-hub-theme .rounded-2xl,
        .analysis-hub-theme .rounded-3xl {
          border-color: #263750;
        }

        .analysis-hub-theme .shadow-sm,
        .analysis-hub-theme .shadow,
        .analysis-hub-theme .shadow-md,
        .analysis-hub-theme .shadow-lg,
        .analysis-hub-theme .shadow-xl,
        .analysis-hub-theme .shadow-2xl {
          --tw-shadow-color: rgba(0,0,0,.25) !important;
        }


        /* =========================================
           DARK BORDERS
        ========================================== */

        .analysis-hub-theme .border-slate-50,
        .analysis-hub-theme .border-slate-100,
        .analysis-hub-theme .border-slate-200,
        .analysis-hub-theme .border-slate-300,
        .analysis-hub-theme .border-gray-100,
        .analysis-hub-theme .border-gray-200,
        .analysis-hub-theme .border-gray-300 {
          border-color: #263750 !important;
        }

        .analysis-hub-theme hr {
          border-color: #263750 !important;
        }


        /* =========================================
           MAIN TEXT
        ========================================== */

        .analysis-hub-theme .text-slate-950,
        .analysis-hub-theme .text-slate-900,
        .analysis-hub-theme .text-slate-800,
        .analysis-hub-theme .text-slate-700,
        .analysis-hub-theme .text-gray-950,
        .analysis-hub-theme .text-gray-900,
        .analysis-hub-theme .text-gray-800,
        .analysis-hub-theme .text-gray-700 {
          color: #f8fafc !important;
        }


        /* =========================================
           MUTED TEXT
        ========================================== */

        .analysis-hub-theme .text-slate-600,
        .analysis-hub-theme .text-slate-500,
        .analysis-hub-theme .text-slate-400,
        .analysis-hub-theme .text-gray-600,
        .analysis-hub-theme .text-gray-500,
        .analysis-hub-theme .text-gray-400 {
          color: #94a3b8 !important;
        }


        /* =========================================
           CYAN PRIMARY ACCENT
        ========================================== */

        .analysis-hub-theme .text-blue-500,
        .analysis-hub-theme .text-blue-600,
        .analysis-hub-theme .text-blue-700,
        .analysis-hub-theme .text-indigo-500,
        .analysis-hub-theme .text-indigo-600,
        .analysis-hub-theme .text-cyan-500,
        .analysis-hub-theme .text-cyan-600 {
          color: #22d3ee !important;
        }


        /* =========================================
           LIGHT BLUE / INDIGO BOXES
           -> DARK ICON / INFO BOXES
        ========================================== */

        .analysis-hub-theme .bg-blue-50,
        .analysis-hub-theme .bg-blue-100,
        .analysis-hub-theme .bg-indigo-50,
        .analysis-hub-theme .bg-indigo-100,
        .analysis-hub-theme .bg-cyan-50,
        .analysis-hub-theme .bg-cyan-100 {
          background-color: #10293a !important;
        }


        /* =========================================
           GREEN STATUS
        ========================================== */

        .analysis-hub-theme .bg-green-50,
        .analysis-hub-theme .bg-green-100,
        .analysis-hub-theme .bg-emerald-50,
        .analysis-hub-theme .bg-emerald-100 {
          background-color: #0f2f25 !important;
        }

        .analysis-hub-theme .text-green-600,
        .analysis-hub-theme .text-green-700,
        .analysis-hub-theme .text-emerald-600,
        .analysis-hub-theme .text-emerald-700 {
          color: #4ade80 !important;
        }


        /* =========================================
           RED / ERROR STATUS
        ========================================== */

        .analysis-hub-theme .bg-red-50,
        .analysis-hub-theme .bg-red-100,
        .analysis-hub-theme .bg-rose-50,
        .analysis-hub-theme .bg-rose-100 {
          background-color: #3b161c !important;
        }
        .analysis-hub-theme,
        .analysis-hub-content {
            min-height: 100vh;
            background: #0f172a !important;
            color: #f8fafc;
        }
              
        .analysis-hub-content > div {
            min-height: 100vh;
            background-color: #0f172a !important;
            background-image: none !important;
        }

        .analysis-hub-theme .text-red-600,
        .analysis-hub-theme .text-red-700,
        .analysis-hub-theme .text-rose-600,
        .analysis-hub-theme .text-rose-700 {
          color: #f87171 !important;
        }


        /* =========================================
           INPUT / SELECT / TEXTAREA
        ========================================== */

        .analysis-hub-theme input,
        .analysis-hub-theme select,
        .analysis-hub-theme textarea {
          background-color: #111c2f;
          color: #f8fafc;
          border-color: #263750;
        }

        .analysis-hub-theme input::placeholder,
        .analysis-hub-theme textarea::placeholder {
          color: #64748b;
        }

        .analysis-hub-theme input:focus,
        .analysis-hub-theme select:focus,
        .analysis-hub-theme textarea:focus {
          border-color: #22d3ee !important;
          outline-color: #22d3ee !important;
          box-shadow: 0 0 0 2px rgba(34,211,238,.08);
        }

        .analysis-hub-theme select option {
          background: #182338;
          color: #f8fafc;
        }


        /* =========================================
           TABLES
        ========================================== */

        .analysis-hub-theme table {
          color: #e2e8f0;
        }

        .analysis-hub-theme thead {
          background: #202d43;
        }

        .analysis-hub-theme th {
          background: #202d43 !important;
          color: #e2e8f0 !important;
          border-color: #263750 !important;
        }

        .analysis-hub-theme td {
          color: #e2e8f0;
          border-color: #263750 !important;
        }

        .analysis-hub-theme tbody tr {
          background: #182338;
        }

        .analysis-hub-theme tbody tr:nth-child(even) {
          background: #162033;
        }


        /* =========================================
           COMMON CARD HOVER
        ========================================== */

        .analysis-hub-theme .bg-white:hover {
          border-color: #22d3ee !important;
        }


        /* =========================================
           SCROLLBAR
        ========================================== */

        .analysis-hub-theme ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .analysis-hub-theme ::-webkit-scrollbar-track {
          background: #0f172a;
        }

        .analysis-hub-theme ::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 8px;
        }

        .analysis-hub-theme ::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }


        /* =========================================
           RESPONSIVE
        ========================================== */

        @media (max-width: 768px) {
          .analysis-hub-theme {
            overflow-x: hidden;
          }
        }
      `}</style>

      <Suspense
        fallback={
          <div
            style={{
              height: '64px',
              background: '#0f172a',
              color: '#94a3b8'
            }}
          />
        }
      >
      </Suspense>

      <AnalysisHubContent
        currentView={currentView}
        selectedAnalysis={selectedAnalysis}
        selectedDepartment={selectedDepartment}
        selectedHeadEmail={selectedHeadEmail}
        initialSearchFilter={initialSearchFilter}
        handleAnalysisClick={handleAnalysisClick}
        handleDepartmentClick={handleDepartmentClick}
        handleBackToDepartments={handleBackToDepartments}
        handleBackToLanding={handleBackToLanding}
        handleViewReports={handleViewReports}
        handleBackFromReports={handleBackFromReports}
      />
    </div>
  );
}