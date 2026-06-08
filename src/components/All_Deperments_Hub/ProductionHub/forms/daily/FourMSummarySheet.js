import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  Plus,
  Trash2,
  RotateCcw,
  Send,
  Loader2,
  FileText,
  UserCheck,
  PenTool,
  Hash
} from "lucide-react";

const BASE_URL = "http://192.168.0.34:8000";

const EMPTY_ROW = {
  date: "",
  customer: "", // Customer field added
  partNameNo: "",
  typeOfChange: "",
  changeDetail: "",
  retroTotalQty: "",
  retroOkQty: "",
  retroRejQty: "",
  statusAfterFinal: "",
  actionForNG: "",
  supSignature: "",
  signProdHead: "",
  signQAHead: "",
  remarks: "",
};

const FourMSummarySheet = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState([{ id: 1, ...EMPTY_ROW }]);
  const [preparedBy, setPreparedBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // State for Cascading Dropdowns
  const [customersData, setCustomersData] = useState([]);
  const [partsCache, setPartsCache] = useState({}); 

  // 1. Fetch Customers on component mount
  useEffect(() => {
    fetch(`${BASE_URL}/api/master-dropdown/?filter=customer`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("RAW CUSTOMER API RESPONSE:", data);

        let formattedCustomers = [];
        if (Array.isArray(data)) {
          formattedCustomers = data.map(item => {
            if (typeof item === 'string') return item; 
            if (item.customer_name) return item.customer_name; 
            if (Array.isArray(item)) return item[0]; 
            return item.customer || String(item);
          });
        } 
        else if (data && typeof data === 'object') {
          const arrayData = data.data || data.customers || data.results || [];
          if (Array.isArray(arrayData)) {
            formattedCustomers = arrayData.map(item => 
              typeof item === 'object' ? (item.customer_name || item.customer || item[0]) : item
            );
          }
        }

        const uniqueCustomers = [...new Set(formattedCustomers)].filter(Boolean);
        setCustomersData(uniqueCustomers);
      })
      .catch(err => {
        console.error('Error fetching customers:', err);
        setCustomersData(['MARUTI', 'TATA', 'FIG']); // Fallback
      });
  }, []);

  const handleAddRow = () => {
    const nextId = rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
    setRows((prev) => [...prev, { id: nextId, ...EMPTY_ROW }]);
  };

  const handleDeleteRow = (id) => {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

 // 2. Handle Customer Selection & Fetch Dependent Parts
  const handleCustomerChange = async (id, customerName) => {
    handleChange(id, "customer", customerName);
    handleChange(id, "partNameNo", ""); 

    if (!customerName) return;

    if (!partsCache[customerName]) {
      try {
        const res = await fetch(`${BASE_URL}/api/master-dropdown/?filter=part&cust=${encodeURIComponent(customerName)}`);
        if (!res.ok) throw new Error("Failed to fetch parts");
        const data = await res.json();
        
        // 🔥 DEBUG LOG 🔥 - F12 (Console) mein check karein ki data ka format kya hai
        console.log("DEBUG - Backend se aaya hua data:", data);
        
        let formattedParts = [];
        
        if (Array.isArray(data)) {
            formattedParts = data.map(item => {
                // Agar data object hai (jaise {part_name: "Pipe", part_no: "123"})
                if (typeof item === 'object' && item !== null) {
                    // Yahan hum try karenge ki kisi bhi tarah se name aur no nikal sakein
                    const name = item.part_name || item.name || item.part || item[0] || 'Unknown';
                    const no = item.part_number || item.part_no || item.number || item[1] || '';
                    return { part_name: name, part_no: no };
                }
                // Agar data sirf string hai (Sirf naam)
                return { part_name: item, part_no: '' };
            });
        } 

        setPartsCache(prev => ({ ...prev, [customerName]: formattedParts }));
      } catch (err) {
        console.error(`Error fetching parts for ${customerName}:`, err);
      }
    }
  };

  const handleReset = () => {
    setRows([{ id: 1, ...EMPTY_ROW }]);
    setPreparedBy("");
    setApprovedBy("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filledRows = rows.filter((r) => r.partNameNo || r.date || r.changeDetail);
    if (filledRows.length === 0) {
      alert("Please fill at least one entry before submitting.");
      return;
    }

    const payload = {
      prepared_by: preparedBy,
      approved_by: approvedBy,
      entries: filledRows.map((row, idx) => ({
        s_no: idx + 1,
        date: row.date,
        customer: row.customer,
        part_name_no: row.partNameNo,
        type_of_change: row.typeOfChange,
        change_detail: row.changeDetail,
        retro_total_qty: row.retroTotalQty,
        retro_ok_qty: row.retroOkQty,
        retro_rej_qty: row.retroRejQty,
        status_after_final: row.statusAfterFinal,
        action_for_ng: row.actionForNG,
        sup_signature: row.supSignature,
        sign_prod_head: row.signProdHead,
        sign_qa_head: row.signQAHead,
        remarks: row.remarks,
      }))
    };

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/save-4m-summary/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert(result.message || "4M Summary Sheet saved successfully!");
        handleReset();
      } else {
        alert("Error: " + (result.error || "Please check console."));
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Failed to connect to the server. Make sure Django is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">

        {/* Back Button */}
        <div className="mb-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/production-hub")}
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-sm font-bold bg-white px-4 py-2 border border-red-200 shadow-sm rounded-none tracking-wide"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK TO PRODUCTION HUB
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-none shadow-md border border-gray-200 overflow-hidden">

            {/* Header section */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 border-b border-red-300 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase flex items-center gap-2">
                    <ClipboardList className="h-6 w-6 text-white/90" />
                    4M SUMMARY SHEET
                  </h1>
                </div>
              </div>

              {/* Document details */}
              <div className="bg-red-700/40 text-xs border border-white/30 grid grid-cols-2 w-full md:w-64">
                <div className="border-b border-r border-white/30 p-1 font-bold text-white/90">DOC.NO.</div>
                <div className="border-b border-white/30 p-1 font-semibold text-white">AOT-F-4M-05A</div>
                
                <div className="border-b border-r border-white/30 p-1 font-bold text-white/90">REVISION NO.</div>
                <div className="border-b border-white/30 p-1 font-semibold text-white">00</div>
                
                <div className="border-r border-white/30 p-1 font-bold text-white/90">DATE</div>
                <div className="p-1 font-semibold text-white">01.01.2019</div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-8">
              {rows.map((row, idx) => {
                
                // Get parts from cache for this row's selected customer
                const rowPartsOptions = partsCache[row.customer] || [];

                return (
                <div
                  key={row.id}
                  className="border border-slate-200 rounded-none bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between bg-slate-100 border-b border-slate-200 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                        Row Entry {idx + 1}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(row.id)}
                      disabled={rows.length === 1}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 border border-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-none font-bold uppercase tracking-wide bg-white"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  </div>

                  <div className="p-4 space-y-6">
                    
                    {/* Section 1: Basic Information */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-200 pb-1">1. Basic Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="flex flex-col">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                          <input
                            type="date"
                            value={row.date}
                            onChange={(e) => handleChange(row.id, "date", e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Customer</label>
                          <select
                            value={row.customer}
                            onChange={(e) => handleCustomerChange(row.id, e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          >
                            <option value="">Select Customer</option>
                            {customersData.map((cust, index) => (
                              <option key={index} value={cust}>{cust}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Part Name & No</label>
                          <select
                            value={row.partNameNo}
                            onChange={(e) => handleChange(row.id, "partNameNo", e.target.value)}
                            disabled={!row.customer} 
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                          >
                            <option value="">{row.customer ? "Select Part" : "Select Customer First"}</option>
                            {rowPartsOptions.map((part, index) => {
                              // Yahan name ke saath number jod diya gaya hai
                              const displayName = part.part_no ? `${part.part_name} (${part.part_no})` : part.part_name;
                              return (
                                <option key={index} value={displayName}>
                                  {displayName}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div className="flex flex-col">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Type of Change</label>
                          <input
                            type="text"
                            value={row.typeOfChange}
                            onChange={(e) => handleChange(row.id, "typeOfChange", e.target.value)}
                            placeholder="Man/Machine/Material/Method"
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Change Detail</label>
                          <input
                            type="text"
                            value={row.changeDetail}
                            onChange={(e) => handleChange(row.id, "changeDetail", e.target.value)}
                            placeholder="Describe change"
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Inspections & Actions */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-200 pb-1">2. Inspection & Action Status</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="col-span-1 md:col-span-3 grid grid-cols-3 gap-2 p-3 border border-slate-200 bg-white">
                          <div className="col-span-3 text-[10px] font-bold text-slate-500 uppercase mb-1 text-center border-b border-slate-100 pb-1">
                            Retroactive Inspection Status
                          </div>
                          <div className="flex flex-col">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Total Qty</label>
                            <input
                              type="number"
                              value={row.retroTotalQty}
                              onChange={(e) => handleChange(row.id, "retroTotalQty", e.target.value)}
                              className="w-full px-2 py-1.5 text-sm bg-slate-50 border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Ok</label>
                            <input
                              type="number"
                              value={row.retroOkQty}
                              onChange={(e) => handleChange(row.id, "retroOkQty", e.target.value)}
                              className="w-full px-2 py-1.5 text-sm bg-slate-50 border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Rej. Qty</label>
                            <input
                              type="number"
                              value={row.retroRejQty}
                              onChange={(e) => handleChange(row.id, "retroRejQty", e.target.value)}
                              className="w-full px-2 py-1.5 text-sm bg-slate-50 border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Status after Final Insp.</label>
                          <input
                            type="text"
                            value={row.statusAfterFinal}
                            onChange={(e) => handleChange(row.id, "statusAfterFinal", e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 h-[calc(100%-1.25rem)]"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Action for NG Material</label>
                          <input
                            type="text"
                            value={row.actionForNG}
                            onChange={(e) => handleChange(row.id, "actionForNG", e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 h-[calc(100%-1.25rem)]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Signatures & Remarks */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-200 pb-1">3. Approvals & Remarks</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col">
                          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"><PenTool className="h-3 w-3" /> Sup. Signature</label>
                          <input
                            type="text"
                            value={row.supSignature}
                            onChange={(e) => handleChange(row.id, "supSignature", e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"><UserCheck className="h-3 w-3" /> Sign Production Head</label>
                          <input
                            type="text"
                            value={row.signProdHead}
                            onChange={(e) => handleChange(row.id, "signProdHead", e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"><UserCheck className="h-3 w-3" /> Sign QA Head</label>
                          <input
                            type="text"
                            value={row.signQAHead}
                            onChange={(e) => handleChange(row.id, "signQAHead", e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"><FileText className="h-3 w-3" /> Remarks</label>
                          <input
                            type="text"
                            value={row.remarks}
                            onChange={(e) => handleChange(row.id, "remarks", e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )})}

              {/* Add Entry Button */}
              <div>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-sm font-bold bg-white px-5 py-2.5 border border-red-200 shadow-sm rounded-none tracking-wide uppercase"
                >
                  <Plus className="h-4 w-4" />
                  Add Another Row
                </button>
                <span className="ml-3 text-xs font-semibold text-slate-500">
                  {rows.length} row{rows.length !== 1 ? "s" : ""} added
                </span>
              </div>

              {/* Footer Section: Prepared By & Approved By */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-300">
                <div className="flex flex-col">
                  <label className="block text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">
                    Prepared By:
                  </label>
                  <input
                    type="text"
                    value={preparedBy}
                    onChange={(e) => setPreparedBy(e.target.value)}
                    placeholder="Name / Signature"
                    className="w-full max-w-sm px-4 py-2.5 text-sm bg-white border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div className="flex flex-col md:items-end">
                  <div className="w-full max-w-sm">
                    <label className="block text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">
                      Approved By:
                    </label>
                    <input
                      type="text"
                      value={approvedBy}
                      onChange={(e) => setApprovedBy(e.target.value)}
                      placeholder="Name / Signature"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 mt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white text-slate-700 px-6 py-3 hover:bg-slate-50 transition-all font-bold tracking-widest border-2 border-slate-300 text-sm disabled:opacity-50 rounded-none uppercase"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#e03131] text-white px-8 py-3 hover:bg-[#c92a2a] transition-all shadow-sm font-bold tracking-widest text-sm disabled:opacity-70 disabled:cursor-not-allowed rounded-none uppercase"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {isLoading ? "Submitting..." : "Submit Sheet"}
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FourMSummarySheet;