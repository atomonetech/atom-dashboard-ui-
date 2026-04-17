import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PreDispatchInsForm = () => {
  const navigate = useNavigate();
  
  // Get current date
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Part options
  const partOptions = [
    { value: '8277.78', label: '547663208277/78 - CRASH REINFORCEMENT, A-PILLAR, TOP - LH/RH' },
    { value: '8253.54', label: '547663208253/54 - REINFORCEMENT, A-PILLAR, BOTTOM HINGE - LH/RH' },
    { value: '8257.58', label: '547663208257/58 - REINFORCEMENT, A-PILLAR, TOP HINGE - LH/RH' },
    { value: '8281.82', label: '547663208281/82 - REINFORCEMENT, A-PILLAR, MIDDLE - LH/RH' },
    { value: '8261.62', label: '547663208261/62 - BRACKET LOWER LH/RH' }
  ];

  // Get inspection items based on selected part (from Excel data)
  const getInspectionItems = (partValue) => {
    const items = {
      '8277.78': [
        { srNo: 1, item: 'Appearance', spec: 'Part free from burr, sharp edge, dent, scratch, damage, crack, excessive cutting edge etc.', tolerance: 'Not Allowed', method: 'Visual' },
        { srNo: 2, item: 'Diameter', spec: '8', tolerance: '+0.2', method: 'DVC' },
        { srNo: 3, item: 'Diameter', spec: '8', tolerance: '+0.2', method: 'DVC' },
        { srNo: 4, item: 'Diameter', spec: '8×12', tolerance: '+0.2', method: 'DVC' },
        { srNo: 5, item: 'Diameter', spec: '8×12', tolerance: '+0.2', method: 'DVC' },
        { srNo: 6, item: 'Diameter', spec: '13×13', tolerance: '+0.2', method: 'DVC' },
        { srNo: 7, item: 'Material', spec: 'HSLA340', tolerance: '-', method: 'Mill TC' },
        { srNo: 8, item: 'Sheet thickness', spec: 't=1.00', tolerance: '-', method: 'Digital Micrometer' }
      ],
      '8253.54': [
        { srNo: 1, item: 'Appearance', spec: 'Part free from burr, sharp edge, dent, scratch, damage, crack, excessive cutting edge etc.', tolerance: 'Not Allowed', method: 'Visual' },
        { srNo: 2, item: 'Diameter', spec: '8', tolerance: '+0.2', method: 'DVC' },
        { srNo: 3, item: 'Diameter', spec: '12', tolerance: '+0.2', method: 'DVC' },
        { srNo: 4, item: 'Diameter', spec: '12', tolerance: '+0.2', method: 'DVC' },
        { srNo: 5, item: 'Slot width', spec: '8×12', tolerance: '+0.2', method: 'DVC' },
        { srNo: 6, item: 'Slot width', spec: '20×24', tolerance: '+0.2', method: 'DVC' },
        { srNo: 7, item: 'Mig Welding Length', spec: '45.5', tolerance: '±0.5', method: 'DVC' },
        { srNo: 8, item: 'Mig Welding Length', spec: '7.65', tolerance: '±0.5', method: 'DVC' },
        { srNo: 9, item: 'Material', spec: 'DP590', tolerance: '-', method: 'Mill TC' },
        { srNo: 10, item: 'Sheet thickness', spec: 't=2.00', tolerance: '-', method: 'Digital Micrometer' }
      ],
      '8257.58': [
        { srNo: 1, item: 'Appearance', spec: 'Part free from burr, sharp edge, dent, scratch, damage, crack, excessive cutting edge etc.', tolerance: 'Not Allowed', method: 'Visual' },
        { srNo: 2, item: 'Diameter', spec: '16.3', tolerance: '+0.2', method: 'DVC' },
        { srNo: 3, item: 'Diameter', spec: '12.5', tolerance: '+0.2', method: 'DVC' },
        { srNo: 4, item: 'Diameter', spec: '12.5', tolerance: '+0.2', method: 'DVC' },
        { srNo: 5, item: 'Diameter', spec: '8', tolerance: '+0.2', method: 'DVC' },
        { srNo: 6, item: 'Slot Width', spec: '8×12', tolerance: '+0.2', method: 'DVC' },
        { srNo: 7, item: 'Slot Width', spec: '8×13', tolerance: '+0.3', method: 'DVC' },
        { srNo: 8, item: 'Mig Welding Length', spec: '45.5', tolerance: '±0.5', method: 'DVC' },
        { srNo: 9, item: 'Mig Welding Length', spec: '7.65', tolerance: '±0.5', method: 'DVC' },
        { srNo: 10, item: 'Spot Welding nugget Dia', spec: 'Min 5.4', tolerance: '-', method: 'DVC' },
        { srNo: 11, item: 'Material', spec: 'DP590', tolerance: '-', method: 'Mill TC' },
        { srNo: 12, item: 'Sheet thickness', spec: 't=1.50', tolerance: '-', method: 'Digital Micrometer' }
      ],
      '8281.82': [
        { srNo: 1, item: 'Appearance', spec: 'Part free from burr, sharp edge, dent, scratch, damage, crack, excessive cutting edge etc.', tolerance: 'Not Allowed', method: 'Visual' },
        { srNo: 2, item: 'Diameter', spec: '8', tolerance: '0.2', method: 'DVC' },
        { srNo: 3, item: 'Diameter', spec: '36', tolerance: '0.2', method: 'DVC' },
        { srNo: 4, item: 'Diameter', spec: '24', tolerance: '0.2', method: 'DVC' },
        { srNo: 5, item: 'Diameter', spec: '24', tolerance: '0.2', method: 'DVC' },
        { srNo: 6, item: 'Diameter', spec: '8×12', tolerance: '0.2', method: 'DVC' },
        { srNo: 7, item: 'Material', spec: 'DP780', tolerance: '-', method: 'Mill TC' },
        { srNo: 8, item: 'Sheet thickness', spec: 'T=1.50 MM', tolerance: '-', method: 'Digital Micrometer' }
      ],
      '8261.62': [
        { srNo: 1, item: 'Appearance', spec: 'Part free from burr, sharp edge, dent, scratch, damage, crack, excessive cutting edge etc.', tolerance: 'Not Allowed', method: 'Visual' },
        { srNo: 2, item: 'Diameter', spec: '8', tolerance: '+0.2', method: 'DVC' },
        { srNo: 3, item: 'Diameter', spec: '8', tolerance: '+0.2', method: 'DVC' },
        { srNo: 4, item: 'Diameter', spec: '14', tolerance: '+0.2', method: 'DVC' },
        { srNo: 5, item: 'Diameter', spec: '14', tolerance: '+0.2', method: 'DVC' },
        { srNo: 6, item: 'Spot Welding nugget Dia', spec: 'Min 5.5', tolerance: '-', method: 'DVC' },
        { srNo: 7, item: 'Material', spec: 'D513', tolerance: '-', method: 'Mill TC' },
        { srNo: 8, item: 'Sheet thickness', spec: 't=2.00', tolerance: '-', method: 'Digital Micrometer' }
      ]
    };
    return items[partValue] || [];
  };

  const [selectedPart, setSelectedPart] = useState('');
  const [inspectionItems, setInspectionItems] = useState([]);
  const [formData, setFormData] = useState({
    supplierName: 'ATOMONE TECHNOLOGIES PVT. LTD.',
    partNo: '',
    partName: '',
    inspectionDate: getCurrentDate(),
    invoiceNo: '',
    lotQty: '',
    customerName: 'GESTAMP',
    pageNo: '01 0F 01',
    supplierRemarks: '',
    // Store vendor observations for each row with multiple values
    vendorObs: {}
  });

  const handlePartChange = (e) => {
    const partValue = e.target.value;
    setSelectedPart(partValue);
    
    // Find selected part label
    const selectedPartOption = partOptions.find(opt => opt.value === partValue);
    const partLabel = selectedPartOption ? selectedPartOption.label : '';
    const partNo = partLabel.split(' - ')[0];
    const partName = partLabel.split(' - ')[1] || '';
    
    setFormData(prev => ({
      ...prev,
      partNo: partNo,
      partName: partName
    }));
    
    // Set inspection items based on selected part
    const items = getInspectionItems(partValue);
    setInspectionItems(items);
    
    // Initialize vendor observations for each row with array for multiple values
    const vendorObs = {};
    items.forEach(item => {
      vendorObs[item.srNo] = {
        observations: ['', ''], // Start with 2 observation fields
        judgement: ''
      };
    });
    setFormData(prev => ({ ...prev, vendorObs }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleObservationChange = (srNo, index, value) => {
    setFormData(prev => ({
      ...prev,
      vendorObs: {
        ...prev.vendorObs,
        [srNo]: {
          ...prev.vendorObs[srNo],
          observations: prev.vendorObs[srNo].observations.map((obs, i) => i === index ? value : obs)
        }
      }
    }));
  };

  const addObservationField = (srNo) => {
    setFormData(prev => ({
      ...prev,
      vendorObs: {
        ...prev.vendorObs,
        [srNo]: {
          ...prev.vendorObs[srNo],
          observations: [...prev.vendorObs[srNo].observations, '']
        }
      }
    }));
  };

  const removeObservationField = (srNo, index) => {
    if (formData.vendorObs[srNo].observations.length <= 2) {
      alert('Minimum 2 observation fields required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      vendorObs: {
        ...prev.vendorObs,
        [srNo]: {
          ...prev.vendorObs[srNo],
          observations: prev.vendorObs[srNo].observations.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handleJudgementChange = (srNo, value) => {
    setFormData(prev => ({
      ...prev,
      vendorObs: {
        ...prev.vendorObs,
        [srNo]: {
          ...prev.vendorObs[srNo],
          judgement: value
        }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const finalData = {
      ...formData,
      inspectionItems: inspectionItems
    };
    
    console.log('PDI Report Submitted:', finalData);
    alert('PDI Report submitted successfully!');
    
    // Reset form
    setSelectedPart('');
    setInspectionItems([]);
    setFormData({
      supplierName: 'ATOMONE TECHNOLOGIES PVT. LTD.',
      partNo: '',
      partName: '',
      inspectionDate: getCurrentDate(),
      invoiceNo: '',
      lotQty: '',
      customerName: 'GESTAMP',
      pageNo: '01 0F 01',
      supplierRemarks: '',
      vendorObs: {}
    });
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form?')) {
      setSelectedPart('');
      setInspectionItems([]);
      setFormData({
        supplierName: 'ATOMONE TECHNOLOGIES PVT. LTD.',
        partNo: '',
        partName: '',
        inspectionDate: getCurrentDate(),
        invoiceNo: '',
        lotQty: '',
        customerName: 'GESTAMP',
        pageNo: '01 0F 01',
        supplierRemarks: '',
        vendorObs: {}
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/qa-hub')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm text-slate-700 hover:text-gray-900 font-medium border border-gray-200 mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to QA Hub
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Colored Header - Original Design */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 sm:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">PRE DISPATCH INSPECTION REPORT</h1>
                  <p className="text-emerald-100 text-sm mt-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Form No: AOT-F-QA-40 | Page: 01 0F 01
                  </p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-medium text-sm">{currentDate}</span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {/* Supplier Information */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Supplier Name</label>
                    <input
                      type="text"
                      name="supplierName"
                      value={formData.supplierName}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-sm text-slate-700"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Customer Name</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-sm text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Part Selection */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                <label className="block text-xs font-medium text-slate-600">
                  Select Part <span className="text-emerald-600">*</span>
                </label>
              </div>
              <select
                value={selectedPart}
                onChange={handlePartChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all duration-200 bg-gray-50 hover:bg-white text-sm text-slate-700"
                required
              >
                <option value="" className="text-sm text-slate-700">-- Select a part --</option>
                {partOptions.map((part, i) => (
                  <option key={i} value={part.value} className="text-sm text-slate-700">{part.label}</option>
                ))}
              </select>
            </div>

            {/* Part Details */}
            {selectedPart && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase">Part No</label>
                    <div className="font-medium text-sm text-slate-700">{formData.partNo}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase">Part Name</label>
                    <div className="font-medium text-sm text-slate-700">{formData.partName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase">Inspection Date</label>
                    <div className="font-medium text-sm text-slate-700">{currentDate}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Invoice and Lot Info */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                  </svg>
                  <label className="block text-xs font-medium text-slate-600">
                    Invoice No. <span className="text-emerald-600">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  name="invoiceNo"
                  value={formData.invoiceNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all duration-200 bg-gray-50 hover:bg-white text-sm text-slate-700"
                  placeholder="Enter invoice number"
                  required
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 2 2 0 00-2 2v4.333z" />
                  </svg>
                  <label className="block text-xs font-medium text-slate-600">
                    Lot Quantity <span className="text-emerald-600">*</span>
                  </label>
                </div>
                <input
                  type="number"
                  name="lotQty"
                  value={formData.lotQty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all duration-200 bg-gray-50 hover:bg-white text-sm text-slate-700"
                  placeholder="Enter lot quantity"
                  required
                />
              </div>
            </div>

            {/* Inspection Items Table */}
            {inspectionItems.length > 0 && (
              <div className="mb-8 overflow-x-auto">
                <h2 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-emerald-200 flex items-center gap-2">
                  <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                  </svg>
                  Inspection Details
                </h2>
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <table className="min-w-full border border-gray-200 text-sm divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-slate-600 sticky left-0 bg-gray-100 z-10">SR.</th>
                          <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-slate-600 sticky left-12 bg-gray-100 z-10">Inspection Items</th>
                          <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-slate-600 w-48">Dimensions/Spec</th>
                          <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-slate-600">Tolerance</th>
                          <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-slate-600">Insp. Method</th>
                          <th className="border border-gray-200 px-3 py-2 text-center text-xs font-medium text-slate-600" colSpan={formData.vendorObs[inspectionItems[0]?.srNo]?.observations?.length || 2}>
                            Vendor Observations
                          </th>
                          <th className="border border-gray-200 px-3 py-2 text-center text-xs font-medium text-slate-600">+</th>
                          <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-slate-600">Judgement</th>
                        </tr>
                        <tr className="bg-gray-50">
                          <th colSpan="5" className="border border-gray-200"></th>
                          {inspectionItems.length > 0 && formData.vendorObs[inspectionItems[0]?.srNo]?.observations.map((_, idx) => (
                            <th key={idx} className="border border-gray-200 px-2 py-1 text-xs text-slate-500 text-center min-w-[80px]">
                              {idx + 1}
                            </th>
                          ))}
                          <th className="border border-gray-200 px-2 py-1 text-xs text-slate-500 text-center min-w-[40px]"></th>
                          <th className="border border-gray-200"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {inspectionItems.map((item) => (
                          <tr key={item.srNo} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-3 py-2 text-sm text-slate-700 font-medium sticky left-0 bg-white z-10">{item.srNo}</td>
                            <td className="border border-gray-200 px-3 py-2 text-sm text-slate-700 sticky left-12 bg-white z-10">{item.item}</td>
                            <td className="border border-gray-200 px-3 py-2 text-sm text-slate-700 max-w-[200px] break-words">{item.spec}</td>
                            <td className="border border-gray-200 px-3 py-2 text-sm text-slate-700">{item.tolerance}</td>
                            <td className="border border-gray-200 px-3 py-2 text-sm text-slate-700">{item.method}</td>
                            
                            {/* Dynamic Observation Columns */}
                            {formData.vendorObs[item.srNo]?.observations.map((obs, idx) => (
                              <td key={idx} className="border border-gray-200 px-2 py-2 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <input
                                    type="text"
                                    className="w-full min-w-[60px] max-w-[80px] px-1 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-200 text-sm text-slate-700"
                                    value={obs}
                                    onChange={(e) => handleObservationChange(item.srNo, idx, e.target.value)}
                                    placeholder="Val"
                                  />
                                  {idx >= 2 && (
                                    <button
                                      type="button"
                                      onClick={() => removeObservationField(item.srNo, idx)}
                                      className="text-red-500 hover:text-red-700 flex-shrink-0"
                                      title="Remove observation"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              </td>
                            ))}
                            
                            {/* Plus Column - Add Button */}
                            <td className="border border-gray-200 px-2 py-2 text-center align-middle">
                              <button
                                type="button"
                                onClick={() => addObservationField(item.srNo)}
                                className="text-emerald-600 hover:text-emerald-800"
                                title="Add observation column"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </td>
                            
                            {/* Judgement - Fillable by user */}
                            <td className="border border-gray-200 px-2 py-2">
                              <select
                                className="w-full min-w-[80px] px-1 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-200 text-sm text-slate-700"
                                value={formData.vendorObs[item.srNo]?.judgement || ''}
                                onChange={(e) => handleJudgementChange(item.srNo, e.target.value)}
                              >
                                <option value="" className="text-sm text-slate-700">Select</option>
                                <option value="OK" className="text-sm text-slate-700">OK</option>
                                <option value="NG" className="text-sm text-slate-700">NG</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Click the <span className="text-emerald-600 font-medium">+</span> button to add more observation columns. Scroll horizontally to see all columns.</span>
                </p>
              </div>
            )}

            {/* Supplier Remarks */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                <label className="block text-xs font-medium text-slate-600">Supplier Remarks</label>
              </div>
              <textarea
                name="supplierRemarks"
                value={formData.supplierRemarks}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all duration-200 bg-gray-50 hover:bg-white text-sm text-slate-700"
                placeholder="Enter supplier remarks"
              ></textarea>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-sm text-slate-700 hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Reset Form
              </button>
              <button
                type="button"
                onClick={() => navigate('/qa-hub')}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-sm text-slate-700 hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg hover:from-emerald-700 hover:to-teal-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Submit PDI Report
              </button>
            </div>

            {/* Form Number */}
            <div className="mt-4 text-xs text-slate-400 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
              <span>AOT-F-QA-40</span>
            </div>
          </div>
        </form>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
};

export default PreDispatchInsForm;