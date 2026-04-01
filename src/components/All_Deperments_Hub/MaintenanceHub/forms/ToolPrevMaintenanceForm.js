import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Calendar, Wrench, RotateCcw } from 'lucide-react';

const ToolPrevMaintenanceForm = () => {
  // Form State
  const [toolName, setToolName] = useState('');
  const [partName, setPartName] = useState('');
  const [partNo, setPartNo] = useState('');
  const [operationNo, setOperationNo] = useState('');
  const [maintenancePerson, setMaintenancePerson] = useState('');
  
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState('');
  const [formData, setFormData] = useState({});
  const [currentDate, setCurrentDate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Simplified data: List of items only
  const itemsList = [
    {
      item: 'Top and bottom face of die',
      checkpoints: ['Condition of top and bottom plate', 'Plate bend check', 'Cleaning of bolting surface'],
      specifications: ['Should be free from heavy scratch, dent, crack and chip off', '1.0 mm max bend allowed', 'Should be clean and free from oil and dust'],
      methods: ['Visual and tactile', 'Flat Scale', 'Clean cloth applied with diesel']
    },
    {
      item: 'Guide Pillers and bushes',
      checkpoints: ['Clearance between piller and bush', 'Cleaning of piller and bush', 'Condition of pillar , Bush and ball gauge', 'Lubrication'],
      specifications: ['For bending tool - 0.3 mm max\nFor cutting tool - 0.2 mm max', 'Should be clean and free from dust and metal particles', 'Should be free from heavy scratch, dent, crack and chip off', 'Should be properly lubricated'],
      methods: ['Vernier Caliper\nMicrometer', 'Clean cloth applied with diesel', 'Visual and tactile', 'Use lubricant']
    },
    {
      item: 'Dowels, Guiding pins, Ejector pins,Locating pins.',
      checkpoints: ['Condition of Pins', 'Bend check', 'Pin Diamter', 'Pin height'],
      specifications: ['Should be free from heavy scratch, dent, crack and chip off', '0.5 mm max bend allowed', '– 0.5 mm max as per spec', '± 0.5 mm max as per spec'],
      methods: ['Visual/Allen Key', 'Filler gauge', 'Vernier Caliper / Micrometer', 'Height gauge']
    },
    {
      item: 'Screws',
      checkpoints: ['Condition of Screw', 'Tightness of Screw', 'Replacement'],
      specifications: ['Should be free from thread slip, head damage, crack and chip off', 'Should be tight', 'If above check points are not met then replace bolts'],
      methods: ['Visual/Allen Key', 'Allen key', 'Judgement']
    },
    {
      item: 'Springs/Spring loaded pin /Pu Rods',
      checkpoints: ['Condition of Springs and PU rods', 'Check all spring height', 'Replacement'],
      specifications: ['Should be free from crack, chip off and breakage,Coil gap variation.', '± 1.0 mm max as per spring height', 'If above check points are not met then replace bolts'],
      methods: ['Visual', 'Vernier Caliper', 'Judgement']
    },
    {
      item: 'Cutting tool',
      checkpoints: ['Condition of Die, punch, punch plate, stripper plate.', 'condition of Cutting edges', 'Die land', 'Die resharpening limit', 'Blanking Punch resharpening limit', 'Clearance of Blanking punch and Stripper plate.', 'Re sharpening'],
      specifications: ['Should be free from heavy scratch, dent, crack and chip off', 'Check any cutting area Damage and wornout.', 'Min one sheet thickness', 'Min 2mm land', 'Min 65mm', '0.20 mm max ( Sliding function check )', 'After 30,000 parts manufactured'],
      methods: ['Visual and tactile', 'Visual', 'Vernier Caliper', 'Vernier Caliper', 'Vernier Caliper', 'Manual', 'Judgement']
    }
  ];

  const currentItemData = itemsList.find(i => i.item === selectedItem);

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('en-GB').replace(/\//g, '.'));
  }, []);

  const handleInputChange = (field, value) => {
    const key = `${selectedItem}-${selectedCheckpoint}`;
    setFormData(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const resetForm = () => {
    setToolName('');
    setPartName('');
    setPartNo('');
    setOperationNo('');
    setMaintenancePerson('');
    setSelectedItem('');
    setSelectedCheckpoint('');
    setFormData({});
  };

  const saveToDatabase = async (data) => {
    // This function simulates saving to a database
    // Replace this with your actual API endpoint
    try {
      // Example API call - uncomment and modify according to your backend
      // const response = await fetch('your-api-endpoint/maintenance-records', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to save data');
      // }
      
      // For now, save to localStorage as backup
      const savedRecords = JSON.parse(localStorage.getItem('maintenanceRecords') || '[]');
      savedRecords.push({ ...data, id: Date.now() });
      localStorage.setItem('maintenanceRecords', JSON.stringify(savedRecords));
      
      console.log('Data saved to database:', data);
      return { success: true };
    } catch (error) {
      console.error('Error saving to database:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!toolName || !maintenancePerson) {
      alert('Please fill in all required fields: Tool Name and Maintenance Person');
      return;
    }

    setIsSaving(true);
    
    // Prepare data for saving
    const maintenanceData = {
      toolName,
      partName,
      partNo,
      operationNo,
      maintenancePerson,
      selectedItem,
      selectedCheckpoint,
      formData,
      currentDate,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Save to database
      await saveToDatabase(maintenanceData);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset all form fields after successful save
      resetForm();
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      alert('Failed to save data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    // Navigate back to maintenance hub
    // If using react-router, use: navigate('/maintenance-hub');
    // For now, we'll use window.history
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-6 flex justify-center">
      <div className="w-full max-w-7xl">
        
        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-slate-700 shadow-sm"
            style={{ color: '#10b981' }}
          >
            <ChevronLeft size={18} />
            Back to Maintenance Hub
          </button>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Form Header with Date on Right */}
          <div className="p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3" style={{ backgroundColor: '#10b981', color: 'white' }}>
            <div className="flex items-center gap-2">
              <Wrench size={22} />
              <h1 className="text-lg md:text-xl font-bold uppercase">Tool Maintenance Form</h1>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
              <Calendar size={18} />
              <span className="font-medium text-sm">Date: {currentDate}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
            
            {/* Metadata Section - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tool Name *</label>
                <input 
                  type="text" 
                  value={toolName} 
                  onChange={(e) => setToolName(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700" 
                  placeholder="Enter Tool Name (e.g. BLANKING)" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Part Name</label>
                <input 
                  type="text" 
                  value={partName} 
                  onChange={(e) => setPartName(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-slate-700" 
                  placeholder="Part name" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Part No.</label>
                <input 
                  type="text" 
                  value={partNo} 
                  onChange={(e) => setPartNo(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-slate-700" 
                  placeholder="Part no." 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Operation No.</label>
                <input 
                  type="text" 
                  value={operationNo} 
                  onChange={(e) => setOperationNo(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-slate-700" 
                  placeholder="Op no." 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Maintenance Person *</label>
                <input 
                  type="text" 
                  value={maintenancePerson} 
                  onChange={(e) => setMaintenancePerson(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-slate-700" 
                  placeholder="Name" 
                  required 
                />
              </div>
            </div>

            {/* Item and Checkpoint Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">1. Select Item</label>
                <select 
                  value={selectedItem} 
                  onChange={(e) => {
                    setSelectedItem(e.target.value);
                    const item = itemsList.find(i => i.item === e.target.value);
                    setSelectedCheckpoint(item?.checkpoints[0] || '');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer text-slate-700"
                >
                  <option value="">-- Choose Item --</option>
                  {itemsList.map((obj, idx) => (
                    <option key={idx} value={obj.item}>{obj.item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">2. Select Checkpoint</label>
                <select 
                  value={selectedCheckpoint} 
                  onChange={(e) => setSelectedCheckpoint(e.target.value)} 
                  disabled={!selectedItem}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white disabled:bg-gray-100 cursor-pointer text-slate-700"
                >
                  <option value="">-- Choose Checkpoint --</option>
                  {currentItemData?.checkpoints.map((cp, idx) => (
                    <option key={idx} value={cp}>{cp}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Entry Table */}
            {selectedItem && selectedCheckpoint && (
              <div className="mt-4 border border-gray-200 rounded-lg overflow-x-auto">
                <table className="w-full border-collapse min-w-[700px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border-b p-3 text-left text-xs font-bold text-gray-600 uppercase">Specs / Method</th>
                      <th className="border-b p-3 text-left text-xs font-bold text-gray-600 uppercase w-40">Before Maint.</th>
                      <th className="border-b p-3 text-left text-xs font-bold text-gray-600 uppercase w-40">After Maint.</th>
                      <th className="border-b p-3 text-left text-xs font-bold text-gray-600 uppercase">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="p-3 border-r">
                        <div className="text-sm font-semibold text-emerald-700 mb-1">{selectedCheckpoint}</div>
                        <p className="text-[11px] text-gray-500"><strong>Spec:</strong> {currentItemData.specifications[currentItemData.checkpoints.indexOf(selectedCheckpoint)]}</p>
                        <p className="text-[11px] text-gray-500"><strong>Method:</strong> {currentItemData.methods[currentItemData.checkpoints.indexOf(selectedCheckpoint)]}</p>
                      </td>
                      <td className="p-3 border-r">
                        <input 
                          type="text" 
                          value={formData[`${selectedItem}-${selectedCheckpoint}`]?.beforeMaint || ''}
                          onChange={(e) => handleInputChange('beforeMaint', e.target.value)} 
                          className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-emerald-500 text-slate-700" 
                          placeholder="Value" 
                        />
                      </td>
                      <td className="p-3 border-r">
                        <input 
                          type="text" 
                          value={formData[`${selectedItem}-${selectedCheckpoint}`]?.afterMaint || ''}
                          onChange={(e) => handleInputChange('afterMaint', e.target.value)} 
                          className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-emerald-500 text-slate-700" 
                          placeholder="Value" 
                        />
                      </td>
                      <td className="p-3">
                        <input 
                          type="text" 
                          value={formData[`${selectedItem}-${selectedCheckpoint}`]?.remark || ''}
                          onChange={(e) => handleInputChange('remark', e.target.value)} 
                          className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-emerald-500 text-slate-700" 
                          placeholder="Remarks" 
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Buttons Section */}
            <div className="flex justify-end pt-4 border-t">
              <div className="flex gap-3">
                {/* Reset Button */}
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-bold text-sm transition-all shadow-md hover:bg-gray-200 flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  Reset
                </button>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-8 py-3 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
                  style={{ backgroundColor: '#10b981' }}
                >
                  <Save size={18} />
                  {isSaving ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Toast Notification */}
        {showSuccess && (
          <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce z-50">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            Record Saved Successfully! Form has been reset.
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolPrevMaintenanceForm;