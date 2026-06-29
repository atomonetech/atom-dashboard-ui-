
import { useEffect, useState } from "react";
import { ArrowLeft, Search, Eye, AlertCircle, CheckCircle, Filter, X, FileText, Table } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://192.168.0.34:8000";

export default function ReportDetails({ department, headEmail, onBack, initialSearch = "" }) {

  const [operatorRows, setOperatorRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal & API State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormData, setSelectedFormData] = useState(null);
  const [selectedFormRows, setSelectedFormRows] = useState(null);
  const [selectedFormCommon, setSelectedFormCommon] = useState(null);
  const [selectedFormName, setSelectedFormName] = useState("");
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  useEffect(() => {
    if (!headEmail) return;

    const fetchDepartmentStats = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const targetUrl = `${API_BASE_URL}/api/department-stats/?username=${headEmail}`;
        const res = await fetch(targetUrl);
        const data = await res.json();

        if (res.ok) {
          setOperatorRows(data || []);
        } else {
          setErrorMessage(data.error || "Failed to download data matrix.");
        }
      } catch (err) {
        setErrorMessage("Network interface unreachable. Verify your host status configuration.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentStats();
  }, [headEmail]);

  // ==========================================
  // GROUND TRUTH ROUTING DICTIONARY ENGINE
  // ==========================================
  const getRoutingInfo = (message) => {
    const msg = String(message || "").toLowerCase();
    console.log("FORM NAME RECEIVED:", msg); 
    let formRoute = 'deviation';
    let hub = 'qa-hub';

    // PRODUCTION HUB FORMS
    if (msg.includes('daily prod')) { formRoute = 'daily-prod-plan'; hub = 'production-hub'; }
    else if (msg.includes('4m change insp') || (msg.includes('4m') && msg.includes('insp'))) { formRoute = 'four-m-inspection'; hub = 'production-hub'; }
    else if (msg.includes('4m track') || msg.includes('4m record') || msg.includes('4m tracking summary')) { formRoute = 'four-m-record'; hub = 'production-hub'; }
    else if (msg.includes('4m display')) { formRoute = 'four-m-display'; hub = 'production-hub'; }
    else if (msg.includes('4m summary')) { formRoute = 'four-m-summary'; hub = 'production-hub'; }
    else if (msg.includes('information sheet')) { formRoute = 'four-m-information'; hub = 'production-hub'; }
    else if (msg.includes('tip chage') || msg.includes('tip change')) { formRoute = 'tip-change'; hub = 'production-hub'; }
    else if (msg.includes('bin trolley') || msg.includes('trolley')) { formRoute = 'bin-trolley'; hub = 'production-hub'; }
    else if (msg.includes('5s') || msg.includes('five s')) { formRoute = 'five-s'; hub = 'production-hub'; }
    else if (msg.includes('monthly prod')) { formRoute = 'monthly-prod-plan'; hub = 'production-hub'; }
    else if (msg.includes('observance check')) { formRoute = 'operator-observance-checklist'; hub = 'production-hub'; }
    else if (msg.includes('observance plan')) { formRoute = 'operator-observance-plan'; hub = 'production-hub'; }
    else if (msg.includes('pm checklist') || msg.includes('pm mhe') || msg.includes('preventive')) { formRoute = 'pm-checklist-mhe'; hub = 'production-hub'; }
    else if (msg.includes('projection welder')) { formRoute = 'projection-welder'; hub = 'production-hub'; }
    else if (msg.includes('spot welder')) { formRoute = 'spot-welder'; hub = 'production-hub'; }
    else if (msg.includes('tig') || msg.includes('mig')) { formRoute = 'tig-mig-welder'; hub = 'production-hub'; }
    else if (msg.includes('process validation')) { formRoute = 'process-validation'; hub = 'production-hub'; }

    // QA HUB FORMS
    else if (msg.includes('incoming ')) { formRoute = 'incoming-inspection-view'; hub = 'qa-hub'; }
    else if (msg.includes('deviation approval form')) { formRoute = 'deviation-view'; hub = 'qa-hub'; }
    else if (msg.includes('redbin attendance') || msg.includes('red bin attendance')) { formRoute = 'redbin-attendance-view'; hub = 'qa-hub'; }
    else if (msg.includes('redbin approval form') || msg.includes('red bin') || msg.includes('red bin analy')) { formRoute = 'redbin-view'; hub = 'qa-hub'; }
    else if (msg.includes('scrap note')) { formRoute = 'scrap-note-view'; hub = 'qa-hub'; }
    else if (msg.includes('poka')) { formRoute = 'poka-yoke'; hub = 'qa-hub'; }
    else if (msg.includes('inspection report')) { formRoute = 'inspection-view'; hub = 'qa-hub'; }
    else if (msg.includes('pdi')) { formRoute = 'pdi'; hub = 'qa-hub'; }
    else if (msg.includes('rework')) { formRoute = 'rework-view'; hub = 'qa-hub'; }
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

    // MAINTENANCE HUB FORMS
    else if (msg.includes('maintenance')) { formRoute = 'maintenance-report'; hub = 'maintenance-hub'; }

    return { formRoute, hub };
  };

  // ==========================================
  // FORMS WITH TABLE ROWS (detail rows)
  // ==========================================
  const MULTI_ROW_FORMS = [
    'four-m-inspection', 'four-m-record', 'bin-trolley', 'five-s',
    'operator-observance-checklist', 'operator-observance-plan',
    'pm-checklist-mhe', 'projection-welder', 'spot-welder',
    'tig-mig-welder', 'process-validation',
    'inspection-view',  'incoming-inspection-view'
  ];

  // ==========================================
  // Inspection header fields jo common strip mein jaayenge
  // ==========================================
  const INSPECTION_HEADER_KEYS = [
    'Customer', 'Part Name', 'Operation', 'Part Number',
    'Plant', 'Insp. Date', 'Operator', 'Machine No',
    'Prepared By', 'Approved By',
  ];


  const INCOMING_HEADER_KEYS = [
    'Date', 'Supplier', 'Customer', 'Part Name', 'Part No',
    'Grade', 'MTC', 'GA/NGA', 'Coil No', 'Invoice No',
    'QTY', 'Checked By', 'Prepared By', 'Approved By',
  ];

  // ==========================================
  // handleViewForm — record_id se direct fetch
  // ==========================================
  const handleViewForm = async (reportName, recordId) => {
    if (!recordId || recordId === "N/A") {
      alert("Unable to open report: Missing record identifier.");
      return;
    }

    try {
      setSelectedFormName(reportName);
      setSelectedRecordId(recordId);
      setIsLoadingForm(true);
      setIsModalOpen(true);
      setSelectedFormData(null);
      setSelectedFormRows(null);
      setSelectedFormCommon(null);

      const cleanId = String(recordId).replace('#', '');
      const { formRoute, hub } = getRoutingInfo(reportName);

      let targetUrl = "";
      // 🔥 Yahan par aapka QA / Production split properly set hai
      if (hub === 'qa-hub') {
        targetUrl = `${API_BASE_URL}/api/get-record/qa/${formRoute}/${cleanId}/`;
      } else {
        targetUrl = `${API_BASE_URL}/api/get-record/production/${formRoute}/${cleanId}/`;
      }

      const response = await fetch(targetUrl);
      const jsonResponse = await response.json();

      if (!response.ok || jsonResponse.error) {
        setSelectedFormData({ error: jsonResponse.error || "Failed to fetch form details." });
        return;
      }

      const isMultiRow = MULTI_ROW_FORMS.includes(formRoute);

      if (isMultiRow) {
        const rows = Array.isArray(jsonResponse.data) ? jsonResponse.data : [];

        // INSPECTION-VIEW: Manually extract common header from first row
        if (formRoute === 'inspection-view' && rows.length > 0) {
          const commonObj = {};
          INSPECTION_HEADER_KEYS.forEach((key) => {
            if (rows[0][key] !== undefined) {
              commonObj[key] = rows[0][key];
            }
          });
          setSelectedFormCommon(commonObj);
          setSelectedFormRows(rows);
        } 
        else if (formRoute === 'incoming-inspection-view' && rows.length > 0) {
          const commonObj = {};
          INCOMING_HEADER_KEYS.forEach((key) => {
           if (rows[0][key] !== undefined) {
              commonObj[key] = rows[0][key];
              }
          });
          setSelectedFormCommon(commonObj);
          setSelectedFormRows(rows);
        }
        else {
          // Other multi-row forms — use backend common or first row
          setSelectedFormRows(rows);
          setSelectedFormCommon(jsonResponse.common || (rows.length > 0 ? rows[0] : null));
        }
      } else {
        // Flat forms — grid mein dikhayenge
        const record = Array.isArray(jsonResponse.data) ? jsonResponse.data[0] : jsonResponse.data;
        if (record) {
          setSelectedFormData(record);
        } else {
          setSelectedFormData({ error: `Record #${cleanId} not found.` });
        }
      }
      
    } catch (error) {
      setSelectedFormData({ error: "Server connection failed. Please check backend." });
    } finally {
      setIsLoadingForm(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFormData(null);
    setSelectedFormRows(null);
    setSelectedFormCommon(null);
    setSelectedRecordId(null);
  };

  // ==========================================
  // FILTER LOGIC
  // ==========================================
  const filteredOperators = operatorRows.filter((op) => {
    const operatorName = String(op.username || "").toLowerCase();
    if (initialSearch && initialSearch.trim() !== "") {
      return operatorName === initialSearch.toLowerCase();
    }
    const matchesSearch =
      !searchTerm ||
      operatorName.includes(searchTerm.toLowerCase()) ||
      String(op.head || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Back Button + Title */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mb-4">
          <ArrowLeft size={16} /> Back to Team
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Production Department Control Desk</h1>
        <p className="text-sm text-gray-500 mt-1">
          Supervising Officer Access Token: <span className="font-semibold text-gray-700">{headEmail}</span>
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search operator matrix rows safely..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm shadow-sm">
          <Filter size={13} className="text-gray-400" />
          <span className="text-gray-500 font-medium">STATE:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-none outline-none text-sm text-gray-700 bg-transparent"
          >
            <option value="All">All States</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Operator Rows */}
      <div className="max-w-7xl mx-auto px-6 space-y-4">
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">Loading operator data...</div>
        ) : errorMessage ? (
          <div className="text-center py-20 text-red-500 text-sm">{errorMessage}</div>
        ) : (
          filteredOperators.map((operator, oi) => {
            const allLogs = operator.reportsList || [];
            const targetLogsList = statusFilter === "All"
              ? allLogs
              : allLogs.filter(r => (r.status || "Pending") === statusFilter);

            return (
              <div key={oi} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Operator Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <span className="text-gray-400">👤</span>
                      Operator: {operator.name || operator.username}
                      <span className="text-xs font-normal text-gray-400">({operator.username})</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Reporting Authority Line: <span className="font-medium text-gray-700">{operator.head}</span>
                    </p>
                  </div>
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                    {statusFilter === "All" ? "Total Logs" : `${statusFilter} Logs`}: {targetLogsList.length}
                  </span>
                </div>

                {/* Logs Table */}
                <div className="overflow-x-auto">
                  {targetLogsList.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-xs italic">
                      No logs match the "{statusFilter}" tracking parameter.
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
                          const recordId = report.record_id || report.id;
                          const currentStatus = report.status || "Pending";

                          return (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-3.5 font-semibold text-blue-600">
                                #{recordId || report.id}
                              </td>
                              <td className="px-6 py-3.5 font-medium text-gray-800">
                                {report.name || report.form_name}
                              </td>
                              <td className="px-6 py-3.5 text-xs text-gray-500">
                                {report.date || report.timestamp}
                              </td>
                              <td className="px-6 py-3.5">
                                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                                  currentStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                                  currentStatus === 'Rejected' ? 'bg-rose-50 text-rose-700' :
                                  'bg-amber-50 text-amber-700'
                                }`}>
                                  {currentStatus === 'Approved'
                                    ? <CheckCircle size={12} />
                                    : <AlertCircle size={12} />}
                                  {currentStatus}
                                </span>
                              </td>
                              <td className="px-6 py-3.5 text-center">
                                <button
                                  onClick={() => handleViewForm(
                                    report.name || report.form_name,
                                    recordId
                                  )}
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
          })
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL — Flat Grid OR Detail Table          */}
      {/* ========================================== */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-xl max-w-5xl w-full p-0 max-h-[88vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedFormName}
                  </h3>
                  <p className="text-xs text-gray-500">Database Entry Detail View</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">

              {/* Loading State */}
              {isLoadingForm && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 font-medium text-sm">Fetching record details...</p>
                </div>
              )}

              {/* Error State */}
              {!isLoadingForm && selectedFormData?.error && (
                <div className="text-center py-12 px-6 bg-white rounded-lg border border-red-100">
                  <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                  <p className="text-red-600 font-semibold">{selectedFormData.error}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    Record #{selectedRecordId} · Form: {selectedFormName}
                  </p>
                </div>
              )}

              {/* ── FLAT GRID (single record, no rows) ── */}
              {!isLoadingForm && selectedFormData && !selectedFormData.error && (() => {
                const headerKeysConfig = ['date', 'part name', 'part no'];

                const headerData = {};
                const gridData = {};

                Object.entries(selectedFormData).forEach(([key, value]) => {
                  if (['id', '_source', 'created_at', 'updated_at'].includes(key.toLowerCase())) return;

                  if (headerKeysConfig.includes(key.toLowerCase())) {
                    headerData[key] = value;
                  } else {
                    gridData[key] = value;
                  }
                });

                return (
                  <div className="space-y-4">
                    {/* Header fields block */}
                    {Object.keys(headerData).length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex flex-wrap gap-x-8 gap-y-3">
                          {Object.entries(headerData).map(([key, value]) => (
                            <div key={key} className="flex flex-col min-w-[120px]">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                {key.replace(/_/g, ' ')}
                              </span>
                              <span className="text-sm font-semibold mt-0.5 text-gray-800">
                                {(value !== null && value !== '' && value !== undefined) ? String(value) : '—'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Main fields block */}
                    {Object.keys(gridData).length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-7 gap-x-6">
                          {Object.entries(gridData).map(([key, value]) => {
                            const displayValue = (value !== null && value !== '' && value !== undefined) ? String(value) : '—';
                            const isApproval = key.toLowerCase().includes('approved') || key.toLowerCase().includes('prepared');
                            
                            return (
                              <div key={key} className="flex flex-col">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                                  {key.replace(/_/g, ' ')}
                                </span>
                                <span className={`text-sm font-semibold ${
                                  isApproval && displayValue !== '—'
                                    ? 'text-blue-700 bg-blue-50 px-2 py-1 rounded-md inline-block w-fit'
                                    : 'text-gray-900'
                                }`}>
                                  {displayValue}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ── TABLE VIEW (multi-row detail forms) ── */}
              {!isLoadingForm && selectedFormRows && selectedFormRows.length > 0 && (
                <div className="space-y-4">

                  {/* Common Header Info Strip */}
                  {selectedFormCommon && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex flex-wrap gap-x-8 gap-y-3">
                        {Object.entries(selectedFormCommon)
                          .filter(([k]) => !['id', '_source', 'created_at', 'updated_at'].includes(k))
                          .map(([key, value]) => (
                            <div key={key} className="flex flex-col min-w-[120px]">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                {key.replace(/_/g, ' ')}
                              </span>
                              <span className={`text-sm font-semibold mt-0.5 ${
                                (key.toLowerCase().includes('approved') || key.toLowerCase().includes('prepared')) && value && value !== '—'
                                  ? 'text-blue-700'
                                  : 'text-gray-800'
                              }`}>
                                {(value !== null && value !== undefined && value !== '') ? String(value) : '—'}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Detail Rows Table */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                      <Table size={14} className="text-blue-600" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Detail Entries — {selectedFormRows.length} rows
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-2.5 font-semibold text-gray-500 uppercase tracking-wider text-[10px]">SR</th>
                            {Object.keys(selectedFormRows[0])
                              .filter(k => !['id', '_source', 'created_at', 'updated_at'].includes(k))
                              .filter(k => {
                                const commonKeys = selectedFormCommon ? Object.keys(selectedFormCommon) : [];
                                return !commonKeys.includes(k);
                              })
                              .map(col => (
                                <th key={col} className="px-4 py-2.5 font-semibold text-gray-500 uppercase tracking-wider text-[10px] whitespace-nowrap">
                                  {col.replace(/_/g, ' ')}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedFormRows.map((row, i) => {
                            const commonKeys = selectedFormCommon ? Object.keys(selectedFormCommon) : [];
                            const detailCols = Object.keys(row).filter(
                              k => !['id', '_source', 'created_at', 'updated_at'].includes(k) && !commonKeys.includes(k)
                            );
                            return (
                              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-2.5 text-gray-400 font-medium align-top">{i + 1}</td>
                                {detailCols.map(col => {
                                  const val = row[col];
                                  const display = (val !== null && val !== undefined && val !== '') ? String(val) : '—';

                                  // Color coding for out-of-spec values
                                  const isOutOfSpec = display !== '—' &&
                                    (col.toLowerCase().includes('val') || col.toLowerCase().includes('setup')) &&
                                    isNaN(Number(display)) === false;

                                  return (
                                    <td
                                      key={col}
                                      className={`px-4 py-2.5 align-top break-words min-w-[100px] ${
                                        display === '—'
                                          ? 'text-gray-300'
                                          : isOutOfSpec
                                            ? 'text-orange-600 font-semibold'
                                            : 'text-gray-700'
                                      }`}
                                      title={display}
                                    >
                                      {display === '—' ? <span className="text-gray-300">—</span> : display}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty rows state */}
              {!isLoadingForm && selectedFormRows && selectedFormRows.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No detail rows found for this record.
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}