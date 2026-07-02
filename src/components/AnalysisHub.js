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
  initialSearchFilter, // 🔥 NEW: Destructured parameter link
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
          onViewReports={handleViewReports} // 🔥 Passes updated handler
        />
      )}
      
      {currentView === 'reports' && (
        <ReportDetails
          department={selectedDepartment}
          headEmail={selectedHeadEmail}
          initialSearch={initialSearchFilter} // 🔥 NEW: Seed the control desk search bar
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
  const [initialSearchFilter, setInitialSearchFilter] = useState(""); // 🔥 NEW: Tracking operator state context
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

  // 🔥 UPDATED: Accepts second optional parameter to isolate a worker
  const handleViewReports = (headEmail, operatorName = "") => {
    setSelectedHeadEmail(headEmail);
    setInitialSearchFilter(operatorName); // Set name (or empty string if viewing entire team)
    setCurrentView("reports");
    
    const displayLabel = operatorName ? `${operatorName}'s Logs` : 'Reports';
    setBreadcrumb(['Analysis Hub', selectedAnalysis, selectedDepartment, displayLabel]); 
  };

  const handleBackFromReports = () => {
    setInitialSearchFilter(""); // Reset search string context cleanly on back navigation
    setCurrentView('teamHierarchy');
    setBreadcrumb(['Analysis Hub', selectedAnalysis, selectedDepartment]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 transition-colors duration-300">
      <Suspense fallback={<div className="h-16" />}>
       
      </Suspense>
      
      <AnalysisHubContent
        currentView={currentView}
        selectedAnalysis={selectedAnalysis}
        selectedDepartment={selectedDepartment}
        selectedHeadEmail={selectedHeadEmail}
        initialSearchFilter={initialSearchFilter} // 🔥 Pass down state
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