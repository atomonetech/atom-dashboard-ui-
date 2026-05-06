import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, Edit, Check, X, Loader2, 
  Package, Factory, Target, CheckCircle 
} from 'lucide-react';

const BASE_URL = 'http://192.168.0.34:8000';

const DailyProdView = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal ke states
  const [editingRow, setEditingRow] = useState(null); // Kis row ko edit kar rahe hain
  const [editForm, setEditForm] = useState({ achievedQuantity: '', qtyRemark: '' });
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch Data (Subah bhara gaya plan table me lane ke liye)
  const fetchProductionData = async () => {
    setIsLoading(true);
    try {
      // NOTE: Yaha apne Django ka actual GET API endpoint daalein jo list return karta ho
      const response = await fetch(`${BASE_URL}/api/daily-production/list/`);
      const result = await response.json();
      
      if (response.ok) {
        // Maan lijiye API result array of objects return kar rahi hai
        setData(result.data || result); 
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Network Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductionData();
  }, []);

  // 2. Edit Button Click handle karna
  const handleEditClick = (item) => {
    setEditingRow(item);
    // Modal me pehle se blank ya purani value pre-fill karna
    setEditForm({
      achievedQuantity: item.achieved_quantity === 0 ? '' : item.achieved_quantity,
      qtyRemark: item.qty_remark || ''
    });
  };

  // 3. Modal close karna
  const closeModal = () => {
    setEditingRow(null);
    setEditForm({ achievedQuantity: '', qtyRemark: '' });
  };

  // 4. Modal form submit karna (API update)
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.achievedQuantity) {
      alert("Please enter Achieved Quantity");
      return;
    }

    setIsSaving(true);
    try {
      // NOTE: Yaha apne Django ka actual Update (PUT/PATCH) API endpoint daalein
      // Hum row ki ID (editingRow.id) bhej rahe hain update karne ke liye
      const response = await fetch(`${BASE_URL}/api/daily-production/update/${editingRow.id}/`, {
        method: 'PATCH', // ya PUT, backend requirement ke hisaab se
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          achieved_quantity: parseInt(editForm.achievedQuantity),
          qty_remark: editForm.qtyRemark
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Table ka data locally update kar dete hain taaki page refresh na karna pade
        setData(prevData => prevData.map(item => 
          item.id === editingRow.id 
            ? { ...item, achieved_quantity: parseInt(editForm.achievedQuantity), qty_remark: editForm.qtyRemark } 
            : item
        ));
        closeModal();
      } else {
        alert('Error updating data: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Failed to connect to the server.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-blue-600">Daily Production Data</h1>
              <p className="text-sm text-slate-500">View and update achieved quantities</p>
            </div>
            <button
              onClick={() => window.location.href = '/production-plan-create'}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              + Create New Plan
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 font-semibold">Plant / Machine</th>
                  <th className="p-4 font-semibold">Operator</th>
                  <th className="p-4 font-semibold">Part Info</th>
                  <th className="p-4 font-semibold text-center">Planned Qty</th>
                  <th className="p-4 font-semibold text-center">Achieved Qty</th>
                  <th className="p-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      <Loader2 className="animate-spin mx-auto mb-2 text-blue-500" size={24} />
                      Loading production plans...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      No production plans found for today.
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-slate-800">{item.plant}</div>
                        <div className="text-xs text-slate-500">{item.machine_no}</div>
                      </td>
                      <td className="p-4">{item.operator_name}</td>
                      <td className="p-4">
                        <div className="font-medium text-slate-800">{item.part_name}</div>
                        <div className="text-xs text-slate-500">OP: {item.operation_name}</div>
                      </td>
                      <td className="p-4 text-center font-semibold text-blue-600">
                        {item.planned_quantity}
                      </td>
                      <td className="p-4 text-center">
                        {item.achieved_quantity > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} /> {item.achieved_quantity}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition tooltip-trigger"
                          title="Update Quantity"
                        >
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL / POPUP LOGIC */}
      {editingRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-800">Update Actual Quantity</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-red-500 transition">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdate}>
              <div className="p-6 space-y-4">
                
                {/* Read-only Context Box */}
                <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100 text-sm space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Machine:</span>
                    <span className="font-medium text-slate-800">{editingRow.machine_no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Part:</span>
                    <span className="font-medium text-slate-800">{editingRow.part_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Qty:</span>
                    <span className="font-semibold text-blue-600">{editingRow.planned_quantity}</span>
                  </div>
                </div>

                {/* Edit Inputs */}
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-700 mb-1">
                      Achieved Quantity <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      autoFocus
                      required
                      value={editForm.achievedQuantity}
                      onChange={(e) => setEditForm({...editForm, achievedQuantity: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter total pieces made"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-700 mb-1">
                      Remarks (Optional)
                    </label>
                    <input 
                      type="text" 
                      value={editForm.qtyRemark}
                      onChange={(e) => setEditForm({...editForm, qtyRemark: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g. Machine breakdown for 1 hr"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-2 disabled:opacity-70"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {isSaving ? 'Updating...' : 'Save Update'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default DailyProdView;