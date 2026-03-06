import React, { useState, useRef, useMemo } from 'react';
import { ArrowLeft, Edit, Save, Printer, X, Database, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- 1. HARDCODED DATABASE ---
const MASTER_DATA = [
  { customer: "FIG", model: "K12M", partName: "OUTLET PIPE", opName: "BLANKING", partNo: "68P00-S310060" },
  { customer: "Tenneco", model: "YTA", partName: "LOWER SPRING SEAT", opName: "OUTER BENDING", partNo: "M02040815" },
  { customer: "Tenneco", model: "YTA", partName: "LOWER SPRING SEAT", opName: "EMBOSSING", partNo: "M02040815" },
  { customer: "Tenneco", model: "YTA", partName: "FOOT BRACKET", opName: "O- BENDING", partNo: "M02200643" },
  { customer: "FIG", model: "YED", partName: "INLET PIPE (YED)", opName: "PUNCHING", partNo: "66R00-S310060" },
  { customer: "FIG", model: "YED", partName: "STAY MTG 3", opName: "V BENDING", partNo: "55R00-X300110" },
  { customer: "FIG", model: "K12M", partName: "INLET PIPE", opName: "BLANKING", partNo: "68P00-S310050" },
  { customer: "FIG", model: "K12M", partName: "INLET PIPE", opName: "PUNCHING", partNo: "68P00-S310050" },
  { customer: "Tenneco", model: "YTA", partName: "SUPPORT BRACKET", opName: "BENDING ", partNo: "M02071328" }
];

// --- 2. INSPECTION TEMPLATES ---
const INSPECTION_TEMPLATES = {
  "INLET PIPE_BLANKING": {
    product: [
      { inspItem: "APPEARANCE", specialChar: "", spec: "NO BURR/DENT", tolerance: "", inst: "VISUAL" },
      { inspItem: "WIDTH", specialChar: "◇", spec: "115.40 mm", tolerance: "± 0.08", inst: "VERNIER" },
      { inspItem: "LENGTH", specialChar: "◇", spec: "485.00 mm", tolerance: "± 0.5", inst: "VERNIER" },
      { inspItem: "THICKNESS", specialChar: "", spec: "2.0 mm", tolerance: "± 0.1", inst: "MICROMETER" },
      { inspItem: "DIMENSIONS A", specialChar: "", spec: "25.5 mm", tolerance: "± 0.2", inst: "VERNIER" },
      { inspItem: "DIMENSIONS B", specialChar: "", spec: "5.5 mm", tolerance: "± 0.2", inst: "VERNIER" },
      { inspItem: "RADIUS", specialChar: "", spec: "R 2.5", tolerance: "", inst: "RADIUS GAUGE" },
      { inspItem: "BLANK PROFILE", specialChar: "", spec: "AS PER TOOL", tolerance: "", inst: "TEMPLATE" }
    ],
    process: [
      { inspItem: "SHUT HEIGHT", spec: "400", tolerance: "± 0.5", inst: "DIGITAL" },
      { inspItem: "BALANCER PRESSURE", spec: "3.5-4.5 KG", tolerance: "", inst: "GAUGE" },
      { inspItem: "CLUTCH PRESSURE", spec: "5.5 KG", tolerance: "MIN", inst: "GAUGE" },
      { inspItem: "CUSHION PRESSURE", spec: "2.0 KG", tolerance: "MAX", inst: "GAUGE" }
    ]
  }
};

// --- 3. INPUT COMPONENT ---
const CellInput = ({ value, onChange, isEditing, align = 'left', type = 'text' }) => {
  if (!isEditing) {
    return (
      <div style={{ 
        width: '100%', height: '100%', minHeight: '20px', 
        display: 'flex', alignItems: 'center', justifyContent: align === 'center' ? 'center' : 'flex-start',
        padding: '2px 4px', wordBreak: 'break-word', fontSize: 'inherit' 
      }}>
        {value}
      </div>
    );
  }
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      style={{
        width: '100%', height: '100%', border: 'none',
        outline: '2px solid #3b82f6', padding: '2px 4px',
        backgroundColor: '#f0f9ff', fontSize: 'inherit',
        fontWeight: 'inherit', color: 'inherit', textAlign: align,
      }}
    />
  );
};

// --- 4. PRINT SETTINGS (ZERO MARGINS) ---
const printStyles = `
  @media print {
    @page { 
      size: A4 landscape; 
      margin: 5mm; /* Very small margin for printer safety */
    }
    body { 
      margin: 0; 
      padding: 0; 
      background-color: white;
      -webkit-print-color-adjust: exact; 
      print-color-adjust: exact;
    }
    .no-print { 
      display: none !important; 
    }
    .print-container {
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important; /* REMOVED PADDING */
      box-shadow: none !important;
      border: none !important;
    }
  }
`;

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const modalContentStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', borderTop: '6px solid #2563eb' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' };
const selectStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '15px', fontSize: '14px', backgroundColor: 'white', color: 'black' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '15px', fontSize: '14px' };

const PatrolInspectionFinal = () => {
  const printRef = useRef();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false); 
  const [showDBModal, setShowDBModal] = useState(false);
  const [showInspModal, setShowInspModal] = useState(false);

  // DB Modal States
  const [tempCust, setTempCust] = useState('');
  const [tempPart, setTempPart] = useState('');
  const [tempOp, setTempOp] = useState('');
  const [tempPartNo, setTempPartNo] = useState('');

  // Inspection Modal States
  const [inspForm, setInspForm] = useState({
    stage: 'SETUP',   
    date: '',
    operator: '',
    machine: '',
    readings: Array(14).fill('')
  });

  const [formData, setFormData] = useState({
    docNo: 'AOT-F-QA-15', revisionNo: '00', date: '14-10-2024',
    partName: '', partNumber: '', operationName: '', customerName: '',
    productItems: Array(14).fill(null).map((_, i) => ({ srNo: i + 1, inspItem: '', specialChar: '', spec: '', tolerance: '', inst: '' })),
    processItems: Array(14).fill(null).map((_, i) => ({ srNo: i + 1, inspItem: '', spec: '', tolerance: '', inst: '' })),
    inspectionData: Array(3).fill(null).map((_, i) => ({
      srNo: '1', 
      date: '', operatorName: '', machineNo: '', 
      time: i === 0 ? 'SETUP' : i === 1 ? '4HRS' : 'LAST', 
      checks: Array(14).fill('')
    }))
  });

  // --- LOGIC ---
  const uniqueCustomers = useMemo(() => [...new Set(MASTER_DATA.map(d => d.customer))].sort(), []);
  const filteredParts = useMemo(() => {
    if (!tempCust) return [];
    return [...new Set(MASTER_DATA.filter(d => d.customer === tempCust).map(d => d.partName))].sort();
  }, [tempCust]);
  const filteredOps = useMemo(() => {
    if (!tempCust || !tempPart) return [];
    return [...new Set(MASTER_DATA.filter(d => d.customer === tempCust && d.partName === tempPart).map(d => d.opName))].sort();
  }, [tempCust, tempPart]);

  const onCustSelect = (e) => { setTempCust(e.target.value); setTempPart(''); setTempOp(''); setTempPartNo(''); };
  const onPartSelect = (e) => {
    const val = e.target.value;
    setTempPart(val); setTempOp('');
    const found = MASTER_DATA.find(d => d.customer === tempCust && d.partName === val);
    setTempPartNo(found ? found.partNo : '');
  };
  
  const handleApplyInfo = () => {
    const key = `${tempPart}_${tempOp}`;
    const template = INSPECTION_TEMPLATES[key];
    let newProductItems = [...formData.productItems];
    let newProcessItems = [...formData.processItems];

    if (template) {
        template.product.forEach((item, i) => { if(i < 14) newProductItems[i] = { ...newProductItems[i], ...item }; });
        template.process.forEach((item, i) => { if(i < 14) newProcessItems[i] = { ...newProcessItems[i], ...item }; });
    }
    setFormData(prev => ({ ...prev, customerName: tempCust, partName: tempPart, partNumber: tempPartNo, operationName: tempOp, productItems: newProductItems, processItems: newProcessItems }));
    setShowDBModal(false);
  };

  const handleInspChange = (field, value) => setInspForm(prev => ({ ...prev, [field]: value }));
  const handleReadingChange = (index, value) => {
    const newReadings = [...inspForm.readings];
    newReadings[index] = value;
    setInspForm(prev => ({ ...prev, readings: newReadings }));
  };

  const openInspModal = () => {
    setInspForm({ stage: 'SETUP', date: '', operator: '', machine: '', readings: Array(14).fill('') });
    setShowInspModal(true);
  };

  const handleApplyInspection = () => {
    const targetRowIndex = inspForm.stage === 'SETUP' ? 0 : inspForm.stage === '4HRS' ? 1 : 2;
    setFormData(prev => {
        const newData = [...prev.inspectionData];
        for (let i = 0; i < 3; i++) {
            newData[i] = { ...newData[i], date: inspForm.date || newData[i].date, operatorName: inspForm.operator || newData[i].operatorName, machineNo: inspForm.machine || newData[i].machineNo };
        }
        newData[targetRowIndex] = { ...newData[targetRowIndex], checks: inspForm.readings };
        return { ...prev, inspectionData: newData };
    });
    setShowInspModal(false);
  };

  const handleFieldChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleArrayChange = (arr, idx, field, val) => setFormData(prev => ({ ...prev, [arr]: prev[arr].map((item, i) => i === idx ? { ...item, [field]: val } : item) }));
  const handleMergedChange = (field, value) => setFormData(prev => ({ ...prev, inspectionData: prev.inspectionData.map((row) => ({ ...row, [field]: value })) }));
  const handleCheckChange = (rIdx, cIdx, val) => setFormData(prev => ({ ...prev, inspectionData: prev.inspectionData.map((row, i) => i === rIdx ? { ...row, checks: [...row.checks.slice(0, cIdx), val, ...row.checks.slice(cIdx + 1)] } : row) }));
  
  const handleSave = () => { setIsEditing(false); alert("✅ Data Saved!"); };
  const handlePrint = () => window.print();

  // --- STYLE VARS ---
  const tableStyle = { width: '100%', borderCollapse: 'collapse', border: '1px solid black', marginBottom: '8px', tableLayout: 'fixed' };
  const thStyle = { border: '1px solid black', padding: '6px', backgroundColor: '#e0e0e0', color: '#000', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' };
  const tdBorder = { border: '1px solid black', color: '#000', fontSize: '11px', padding: '0', height: '24px' };
  const thickBottomBorder = { borderBottom: '2px solid black' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Inject Print Styles */}
      <style>{printStyles}</style>

      {/* --- TOP BAR (Hidden on Print) --- */}
      <div className="no-print" style={{ width: '297mm', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: 'white', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#374151', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><ArrowLeft /></button>
           AtomOne Report System
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {!isEditing ? (
            <>
              <button onClick={() => setShowDBModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                <Database size={16} /> Header Info
              </button>
              <button onClick={openInspModal} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', backgroundColor: '#9333ea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                <ClipboardList size={16} /> Inspection
              </button>
              <button onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                <Edit size={16} /> Edit
              </button>
              <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                <Printer size={16} /> Print
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}><X size={18} /> Cancel</button>
              <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}><Save size={18} /> Save</button>
            </>
          )}
        </div>
      </div>

      {/* --- MODALS (Hidden on Print) --- */}
      {showDBModal && (
        <div style={modalOverlayStyle} className="no-print">
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1e40af' }}>Select Header Info</h3>
              <button onClick={() => setShowDBModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}><X /></button>
            </div>
            <label style={labelStyle}>Customer</label>
            <select value={tempCust} onChange={onCustSelect} style={selectStyle}><option value="">-- Select --</option>{uniqueCustomers.map(c => <option key={c} value={c}>{c}</option>)}</select>
            <label style={labelStyle}>Part Name</label>
            <select value={tempPart} onChange={onPartSelect} style={selectStyle} disabled={!tempCust}><option value="">-- Select --</option>{filteredParts.map(p => <option key={p} value={p}>{p}</option>)}</select>
            <label style={labelStyle}>Operation</label>
            <select value={tempOp} onChange={(e) => setTempOp(e.target.value)} style={selectStyle} disabled={!tempPart}><option value="">-- Select --</option>{filteredOps.map(op => <option key={op} value={op}>{op}</option>)}</select>
            <button onClick={handleApplyInfo} disabled={!tempCust || !tempPart} style={{ width: '100%', padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Apply Header Data</button>
          </div>
        </div>
      )}

      {showInspModal && (
        <div style={modalOverlayStyle} className="no-print">
          <div style={{ ...modalContentStyle, width: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#9333ea' }}>Add Inspection Result</h3>
              <button onClick={() => setShowInspModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}><X /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                <div><label style={labelStyle}>Select Stage</label><select style={selectStyle} value={inspForm.stage} onChange={(e) => handleInspChange('stage', e.target.value)}><option value="SETUP">SETUP (Yellow)</option><option value="4HRS">4HRS (Blue)</option><option value="LAST">LAST (Red)</option></select></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div><label style={labelStyle}>Date</label><input type="date" style={inputStyle} value={inspForm.date} onChange={(e) => handleInspChange('date', e.target.value)} /></div>
                <div><label style={labelStyle}>Operator Name</label><input type="text" style={inputStyle} placeholder="Name" value={inspForm.operator} onChange={(e) => handleInspChange('operator', e.target.value)} /></div>
                <div><label style={labelStyle}>Machine No.</label><input type="text" style={inputStyle} placeholder="M/C No" value={inspForm.machine} onChange={(e) => handleInspChange('machine', e.target.value)} /></div>
            </div>
            <div style={{ borderTop: '1px solid #ddd', paddingTop: '15px', marginTop: '10px' }}>
                <label style={{...labelStyle, fontSize: '14px', marginBottom: '10px'}}>Enter Readings (1 to 14):</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                    {inspForm.readings.map((val, idx) => (
                        <input key={idx} type="text" placeholder={`${idx+1}`} value={val} onChange={(e) => handleReadingChange(idx, e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }} />
                    ))}
                </div>
            </div>
            <button onClick={handleApplyInspection} style={{ width: '100%', padding: '12px', backgroundColor: '#9333ea', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' }}>Save Inspection Data</button>
          </div>
        </div>
      )}

      {/* --- REPORT CONTAINER (Width 297mm for Screen, 100% for Print, NO PADDING) --- */}
      <div className="print-container" style={{ width: '297mm', minHeight: '210mm', backgroundColor: 'white', padding: '5mm', boxShadow: '0 0 20px rgba(0,0,0,0.15)', border: '1px solid #ddd', boxSizing: 'border-box' }} ref={printRef}>
        
        {/* HEADER & PART INFO */}
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td rowSpan={3} style={{ ...tdBorder, width: '15%', textAlign: 'center', padding: '10px' }}><img src="/logo1.jpg" alt="ATOM ONE" style={{ maxWidth: '90%', maxHeight: '60px', objectFit: 'contain' }} /></td>
              <td rowSpan={3} style={{ ...tdBorder, padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '22px', width: '55%' }}>SETUP & PATROL INSPECTION REPORT</td>
              <td style={{ ...tdBorder, padding: '5px', fontWeight: 'bold', width: '12%', backgroundColor: 'white' }}>DOC.NO.</td>
              <td style={{ ...tdBorder, width: '18%' }}><CellInput isEditing={isEditing} value={formData.docNo} onChange={(e) => handleFieldChange('docNo', e.target.value)} /></td>
            </tr>
            <tr>
              <td style={{ ...tdBorder, padding: '5px', fontWeight: 'bold', backgroundColor: 'white' }}>REVISION NO.</td>
              <td style={tdBorder}><CellInput isEditing={isEditing} value={formData.revisionNo} onChange={(e) => handleFieldChange('revisionNo', e.target.value)} /></td>
            </tr>
            <tr>
              <td style={{ ...tdBorder, padding: '5px', fontWeight: 'bold', backgroundColor: 'white' }}>DATE</td>
              <td style={tdBorder}><CellInput isEditing={isEditing} type="text" value={formData.date} onChange={(e) => handleFieldChange('date', e.target.value)} /></td>
            </tr>
          </tbody>
        </table>

        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={{ ...tdBorder, padding: '5px', fontWeight: 'bold', backgroundColor: '#e0e0e0', width: '15%' }}>PART NAME</td>
              <td style={{ ...tdBorder, width: '35%' }}><CellInput isEditing={isEditing} value={formData.partName} onChange={(e) => handleFieldChange('partName', e.target.value)} /></td>
              <td style={{ ...tdBorder, padding: '5px', fontWeight: 'bold', backgroundColor: '#e0e0e0', width: '18%' }}>OPERATION NAME</td>
              <td style={{ ...tdBorder, width: '32%' }}><CellInput isEditing={isEditing} value={formData.operationName} onChange={(e) => handleFieldChange('operationName', e.target.value)} /></td>
            </tr>
            <tr>
              <td style={{ ...tdBorder, padding: '5px', fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>PART NUMBER</td>
              <td style={tdBorder}><CellInput isEditing={isEditing} value={formData.partNumber} onChange={(e) => handleFieldChange('partNumber', e.target.value)} /></td>
              <td style={{ ...tdBorder, padding: '5px', fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>CUSTOMER NAME</td>
              <td style={tdBorder}><CellInput isEditing={isEditing} value={formData.customerName} onChange={(e) => handleFieldChange('customerName', e.target.value)} /></td>
            </tr>
          </tbody>
        </table>

        {/* SPECIFICATIONS */}
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0', fontWeight: 'bold' }}>
              <th style={{...thStyle, width: '3%'}}>SR</th>
              <th style={{...thStyle, width: '14%'}}>INSP. ITEM (PRODUCT)</th>
              <th style={{...thStyle, width: '6%'}}>SPECIAL CHAR.</th>
              <th style={{...thStyle, width: '7%'}}>SPEC.</th>
              <th style={{...thStyle, width: '10%'}}>TOLERANCE</th>
              <th style={{...thStyle, width: '10%'}}>INSTRUMENT</th>
              <th style={{...thStyle, width: '3%', borderLeft: '2px solid black'}}>SR</th>
              <th style={{...thStyle, width: '14%'}}>INSP. ITEM (PROCESS)</th>
              <th style={{...thStyle, width: '7%'}}>SPEC.</th>
              <th style={{...thStyle, width: '10%'}}>TOLERANCE</th>
              <th style={{...thStyle, width: '10%'}}>INSTRUMENT</th>
            </tr>
          </thead>
          <tbody>
            {formData.productItems.map((item, i) => (
              <tr key={i} style={{ height: '24px' }}>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={item.srNo} align="center" onChange={(e) => handleArrayChange('productItems', i, 'srNo', e.target.value)} /></td>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={item.inspItem} onChange={(e) => handleArrayChange('productItems', i, 'inspItem', e.target.value)} /></td>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={item.specialChar} onChange={(e) => handleArrayChange('productItems', i, 'specialChar', e.target.value)} /></td>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={item.spec} align="center" onChange={(e) => handleArrayChange('productItems', i, 'spec', e.target.value)} /></td>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={item.tolerance} align="center" onChange={(e) => handleArrayChange('productItems', i, 'tolerance', e.target.value)} /></td>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={item.inst} align="center" onChange={(e) => handleArrayChange('productItems', i, 'inst', e.target.value)} /></td>
                <td style={{ ...tdBorder, borderLeft: '2px solid black' }}><CellInput isEditing={isEditing} value={formData.processItems[i].srNo} align="center" onChange={(e) => handleArrayChange('processItems', i, 'srNo', e.target.value)} /></td>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={formData.processItems[i].inspItem} onChange={(e) => handleArrayChange('processItems', i, 'inspItem', e.target.value)} /></td>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={formData.processItems[i].spec} align="center" onChange={(e) => handleArrayChange('processItems', i, 'spec', e.target.value)} /></td>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={formData.processItems[i].tolerance} align="center" onChange={(e) => handleArrayChange('processItems', i, 'tolerance', e.target.value)} /></td>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={formData.processItems[i].inst} align="center" onChange={(e) => handleArrayChange('processItems', i, 'inst', e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* INSPECTION GRID */}
        <table style={{ ...tableStyle, fontSize: '9px' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0', fontWeight: 'bold' }}>
              <th style={{...thStyle, width: '2.5%'}}>SR</th>
              <th style={{...thStyle, width: '5%'}}>DATE</th>
              <th style={{...thStyle, width: '8%'}}>OPERATOR</th>
              <th style={{...thStyle, width: '5%'}}>M/C NO</th>
              <th style={{...thStyle, width: '4%'}}>TIME</th>
              {[...Array(14)].map((_, n) => <th key={n} style={{...thStyle, width: '2.5%'}}>{n + 1}</th>)}
              <th style={{...thStyle, width: '6%'}}>JDG</th>
              <th style={{...thStyle, width: '6%'}}>SIGN</th>
            </tr>
          </thead>
          <tbody>
            {[0].map((startIndex) => {
              const setupRow = formData.inspectionData[startIndex];
              const fourHrsRow = formData.inspectionData[startIndex + 1];
              const lastRow = formData.inspectionData[startIndex + 2];
              const mergedCellStyle = { ...tdBorder, verticalAlign: 'middle', backgroundColor: 'white', ...thickBottomBorder };
              const lastRowStyle = { ...tdBorder, ...thickBottomBorder };

              return (
                <React.Fragment key={startIndex}>
                  <tr style={{ height: '30px' }}>
                    <td rowSpan={3} style={{ ...mergedCellStyle, textAlign: 'center' }}><CellInput isEditing={isEditing} value={setupRow.srNo} align="center" onChange={(e) => handleMergedChange('srNo', e.target.value)} /></td>
                    <td rowSpan={3} style={mergedCellStyle}><CellInput isEditing={isEditing} value={setupRow.date} onChange={(e) => handleMergedChange('date', e.target.value)} /></td>
                    <td rowSpan={3} style={mergedCellStyle}><CellInput isEditing={isEditing} value={setupRow.operatorName} onChange={(e) => handleMergedChange('operatorName', e.target.value)} /></td>
                    <td rowSpan={3} style={mergedCellStyle}><CellInput isEditing={isEditing} value={setupRow.machineNo} align="center" onChange={(e) => handleMergedChange('machineNo', e.target.value)} /></td>
                    <td style={{ ...tdBorder, textAlign: 'center', fontWeight: 'bold', backgroundColor: '#fffbeb' }}>SETUP</td>
                    {setupRow.checks.map((check, i) => <td key={i} style={tdBorder}><CellInput isEditing={isEditing} value={check} align="center" onChange={(e) => handleCheckChange(startIndex, i, e.target.value)} /></td>)}
                    <td style={tdBorder}></td><td style={tdBorder}></td>
                  </tr>
                  <tr style={{ height: '30px' }}>
                     <td style={{ ...tdBorder, textAlign: 'center', fontWeight: 'bold', backgroundColor: '#eff6ff' }}>4HRS</td>
                     {fourHrsRow.checks.map((check, i) => <td key={i} style={tdBorder}><CellInput isEditing={isEditing} value={check} align="center" onChange={(e) => handleCheckChange(startIndex + 1, i, e.target.value)} /></td>)}
                     <td style={tdBorder}></td><td style={tdBorder}></td>
                  </tr>
                  <tr style={{ height: '30px' }}>
                     <td style={{ ...lastRowStyle, textAlign: 'center', fontWeight: 'bold', backgroundColor: '#fee2e2' }}>LAST</td>
                     {lastRow.checks.map((check, i) => <td key={i} style={lastRowStyle}><CellInput isEditing={isEditing} value={check} align="center" onChange={(e) => handleCheckChange(startIndex + 2, i, e.target.value)} /></td>)}
                     <td style={lastRowStyle}></td><td style={lastRowStyle}></td>
                  </tr>
                </React.Fragment>
              )
            })}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '12px', fontWeight: 'bold', color: '#000' }}>
          <div>PREPARED BY: _________________________________</div>
          <div>APPROVED BY: _________________________________</div>
        </div>
      </div>
    </div>
  );
};

export default PatrolInspectionFinal;