import { useEffect, useState } from "react";
import { ArrowLeft, Search, Eye, AlertCircle, CheckCircle, Filter } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://192.168.0.34:8000";

export default function ReportDetails({ department, headEmail, onBack , initialSearch = ""}) {
  
  const [operatorRows, setOperatorRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // 🔥 NEW: Status filter state

  useEffect(() => {
    if (!headEmail) return;

    const fetchDepartmentStats = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const targetUrl = `${API_BASE_URL}/api/department-stats/?username=${headEmail}`;
        console.log(`🚀 Contacting Live API Endpoint: ${targetUrl}`);
        
        const res = await fetch(targetUrl);
        const data = await res.json();

        if (res.ok) {
          setOperatorRows(data || []);
        } else {
          setErrorMessage(data.error || "Failed to download data matrix.");
        }
      } catch (err) {
        console.error("Transmission Error:", err);
        setErrorMessage("Network interface unreachable. Verify your host status configuration.");
      } finally {
        loading && setLoading(false);
      }
    };

    fetchDepartmentStats();
  }, [headEmail]);

  // ==========================================
  // GROUND TRUTH ROUTING DICTIONARY ENGINE
  // ==========================================
  const getRoutingInfo = (message) => {
    const msg = String(message || "").toLowerCase();
    let formRoute = 'deviation'; 
    let hub = 'qa-hub'; 
    let title = "QA Report Approval Required";

    // ─── 🏭 PRODUCTION HUB FORMS ───
    if (msg.includes('daily prod')) { formRoute = 'daily-prod-plan'; hub = 'production-hub'; }
    else if (msg.includes('4m change insp') || (msg.includes('4m') && msg.includes('insp'))) { formRoute = 'four-m-inspection'; hub = 'production-hub'; }
    else if (msg.includes('4m track') || msg.includes('4m record') || msg.includes('4m tracking summary')) { formRoute = 'four-m-record'; hub = 'production-hub'; }
    else if (msg.includes('4m display')) { formRoute = 'four-m-display'; hub = 'production-hub'; }
    else if (msg.includes('4m summary')) { formRoute = 'four-m-summary'; hub = 'production-hub'; }
    else if (msg.includes('tip chage') || msg.includes('tip change')) { formRoute = 'tip-change'; hub = 'production-hub'; }
    else if (msg.includes('bin trolley') || msg.includes('bin') || msg.includes('trolley')) { formRoute = 'bin-trolley'; hub = 'production-hub'; }
    else if (msg.includes('5s') || msg.includes('five s')) { formRoute = 'five-s'; hub = 'production-hub'; } 
    else if (msg.includes('monthly prod')) { formRoute = 'monthly-prod-plan'; hub = 'production-hub'; }
    else if (msg.includes('observance check')) { formRoute = 'operator-observance-checklist'; hub = 'production-hub'; }
    else if (msg.includes('observance plan')) { formRoute = 'operator-observance-plan'; hub = 'production-hub'; }
    else if (msg.includes('pm checklist') || msg.includes('pm mhe') || msg.includes('preventive')) { formRoute = 'pm-checklist-mhe'; hub = 'production-hub'; }
    else if (msg.includes('projection welder')) { formRoute = 'projection-welder'; hub = 'production-hub'; }
    else if (msg.includes('spot welder')) { formRoute = 'spot-welder'; hub = 'production-hub'; }
    else if (msg.includes('tig') || msg.includes('mig')) { formRoute = 'tig-mig-welder'; hub = 'production-hub'; }
    else if (msg.includes('process validation')) { formRoute = 'process-validation'; hub = 'production-hub'; }

    // ─── 🛡️ QA HUB FORMS ───
    else if (msg.includes('deviation')) { formRoute = 'deviation'; hub = 'qa-hub'; }
    else if (msg.includes('redbin attendance') || msg.includes('red bin attendance')) { formRoute = 'redbin-attendance'; hub = 'qa-hub'; }
    else if (msg.includes('redbin') || msg.includes('red bin') || msg.includes('red bin analy')) { formRoute = 'redbin'; hub = 'qa-hub'; }
    else if (msg.includes('incoming')) { formRoute = 'incoming'; hub = 'qa-hub'; }
    else if (msg.includes('scrap')) { formRoute = 'scrap'; hub = 'qa-hub'; }
    else if (msg.includes('poka')) { formRoute = 'poka-yoke'; hub = 'qa-hub'; }
    else if (msg.includes('inspection')) { formRoute = 'inspection'; hub = 'qa-hub'; }
    else if (msg.includes('pdi')) { formRoute = 'pdi'; hub = 'qa-hub'; }
    else if (msg.includes('rework')) { formRoute = 'rework'; hub = 'qa-hub'; }
    else if (msg.includes('sample')) { formRoute = 'sample-inspection'; hub = 'qa-hub'; }
    else if (msg.includes('good receipt') || msg.includes('requisition')) { formRoute = 'good-receipt'; hub = 'qa-hub'; }
    else if (msg.includes('rm quality') || msg.includes('raw material')) { formRoute = 'rm-quality-plan'; hub = 'qa-hub'; }
    else if (msg.includes('process audit')) { formRoute = 'process-audit'; hub = 'qa-hub'; }
    else if (msg.includes('coherence')) { formRoute = 'coherence'; hub = 'qa-hub'; }
    else if (msg.includes('layout')) { formRoute = 'layout-inspection'; hub = 'qa-hub'; }
    else if (msg.includes('product audit')) { formRoute = 'product-audit-plan'; hub = 'qa-hub'; }
    else if (msg.includes('complaint')) { formRoute = 'customer-complaint'; hub = 'qa-hub'; }
    else if (msg.includes('satisfaction')) { formRoute = 'customer-satisfaction'; hub = 'qa-hub'; }
    else if (msg.includes('warranty')) { formRoute = 'warranty-claim'; hub = 'qa-hub'; }
    else if (msg.includes('mom') || msg.includes('meeting')) { formRoute = 'mom'; hub = 'qa-hub'; }

    // ─── 🔧 MAINTENANCE HUB FORMS ───
    else if (msg.includes('maintenance')) { formRoute = 'maintenance-report'; hub = 'maintenance-hub'; }

    if (hub === 'production-hub') title = "Production Report Approval Required";
    else if (hub === 'maintenance-hub') title = "Maintenance Action Required";

    return { formRoute, hub, title };
  };

  const handleInspectReportRow = (reportName, targetId) => {
    if (!targetId || targetId === "N/A") {
      alert("Unable to open report: Missing log identifiers.");
      return;
    }

    const cleanId = parseInt(targetId, 10);
    const { formRoute, hub } = getRoutingInfo(reportName);

    const frontendAppUrl = window.location.origin.replace(":3000", ":3001");
    const targetInspectionUrl = `${frontendAppUrl}/${hub}/view-report/${formRoute}/${cleanId}`;

    console.log(`🚀 Redirecting to Frontend Application Route: "${targetInspectionUrl}"`);

    const newTab = window.open(targetInspectionUrl, "_blank");
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
      alert("Pop-up Blocked! Please allow pop-ups for this application to open report sheets.");
    }
  };

  // ==========================================
  // 🔥 BUG-FREE DEEP SCAN SEARCH ENGINE
  // ==========================================
  // ==========================================
// 🔥 BUG-FREE DEEP SCAN & OPERATOR ISOLATION FILTER
// ==========================================
const filteredOperators = operatorRows.filter((op) => {
  const operatorName = String(op.username || "").toLowerCase();
  
  // 1. IF we arrived here by clicking a specific junior profile card:
  // Strictly enforce that ONLY this operator shows up.
  if (initialSearch && initialSearch.trim() !== "") {
    return operatorName === initialSearch.toLowerCase();
  }

  // 2. ELSE (View Entire Department Logs was clicked):
  // Fall back to your standard open text search bar query string engine
  if (!searchTerm.trim()) return true;
  const search = searchTerm.toLowerCase();

  try {
    return JSON.stringify(op).toLowerCase().includes(search);
  } catch (e) {
    return operatorName.includes(search);
  }
});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-gray-600">Querying Backend Database Matrix...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-6 rounded-xl border border-red-200 text-center shadow-sm">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-gray-900">System Integrity Error</h4>
          <p className="text-sm text-gray-600 mt-2">{errorMessage}</p>
          <button onClick={onBack} className="mt-5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold transition-colors">
            Return to Hierarchy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-semibold mb-4 text-sm hover:text-blue-700">
          <ArrowLeft size={16} /> Back to Team
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{department} Control Desk</h1>
          <p className="text-gray-500 text-sm mt-1">Supervising Officer Access Token: <span className="font-semibold text-gray-700">{headEmail}</span></p>
        </div>

        {/* 🔥 NEW & IMPROVED: Filter & Search Ribbon Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-3 w-full sm:flex-1">
            <Search size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search operator matrix rows safely..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm outline-none bg-transparent"
            />
          </div>

          <div className="bg-white p-3.5 rounded-xl shadow-sm border flex items-center gap-2 w-full sm:w-auto min-w-[200px]">
            <Filter size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:inline">State:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
            >
              <option value="All">All States</option>
              <option value="Pending">⌛ Pending</option>
              <option value="Approved">✅ Approved</option>
              <option value="Rejected">❌ Rejected</option>
            </select>
          </div>
        </div>

        {filteredOperators.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border text-gray-400 text-sm font-medium">
            No system logging records encountered matching current filters.
          </div>
        ) : (
          <div className="space-y-8">
            {filteredOperators.map((operator, opIdx) => {
              const baseLogsList = operator.reportsList || operator.reports || [];
              
              {/* 🔥 NEW: Filter logic inside the operator cards */}
              const targetLogsList = baseLogsList.filter((report) => {
                if (statusFilter === "All") return true;
                
                // Fallback normalization logic to handle variations in state strings
                const reportStatus = report.status || "Pending";
                return reportStatus.toLowerCase() === statusFilter.toLowerCase();
              });
              
              return (
                <div key={operator.user_id || opIdx} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        👤 Operator: {operator.username || "Unknown Operator"} 
                        <span className="text-xs font-normal text-gray-400">({operator.user_id})</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">Reporting Authority Line: <span className="font-medium text-gray-700">{operator.head}</span></p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                        {statusFilter === "All" ? "Total Logs" : `${statusFilter} Logs`}: {targetLogsList.length}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {targetLogsList.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-xs italic">
                        No logs match the "{statusFilter}" tracking parameter for this worker asset.
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white border-b text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                            <th className="px-6 py-3">Record ID</th>
                            <th className="px-6 py-3">Form Context Name</th>
                            <th className="px-6 py-3">Timestamp</th>
                            <th className="px-6 py-3">Workflow State</th>
                            <th className="px-6 py-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                          {targetLogsList.map((report, idx) => {
                        
                            const actionableId = report.activity_log_id || report.id;
                            const currentStatus = report.status || "Pending";

                            return (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-3.5 font-semibold text-blue-600">#{report.record_id || report.id}</td>
                                <td className="px-6 py-3.5 font-medium text-gray-800">{report.name || report.form_name}</td>
                                <td className="px-6 py-3.5 text-xs text-gray-500">{report.date || report.timestamp}</td>
                                <td className="px-6 py-3.5">
                                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                                    currentStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 
                                    currentStatus === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                                  }`}$>
                                    {currentStatus === 'Approved' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                    {currentStatus}
                                  </span>
                                </td>
                                <td className="px-6 py-3.5 text-center">
                                  <button
                                    onClick={() => handleInspectReportRow(report.name || report.form_name, actionableId)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 rounded-lg text-xs font-medium transition-all shadow-sm"
                                  >
                                    <Eye size={12} /> View Form
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}