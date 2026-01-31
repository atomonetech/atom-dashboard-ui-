// import React, { useState, useRef } from 'react';
// import { ArrowLeft, Edit, Save, X, Printer } from 'lucide-react';

// const PatrolInspectionExact = () => {
//   const printRef = useRef();
//   const [isEditing, setIsEditing] = useState(false);

//   const [formData, setFormData] = useState({
//     docNo: 'AOT-F-QA-15',
//     revisionNo: '00',
//     date: '14-10-2024',
//     partName: '',
//     partNumber: '',
//     operationName: '',
//     customerName: '',
    
//     productItems: Array(14).fill(null).map(() => ({
//       srNo: '',
//       inspItem: '',
//       specialChar: '',
//       spec: '',
//       tolerance: '',
//       inst: ''
//     })),
    
//     processItems: Array(14).fill(null).map(() => ({
//       srNo: '',
//       inspItem: '',
//       spec: '',
//       tolerance: '',
//       inst: ''
//     })),
    
//     inspectionData: [
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'SETUP', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: '4HRS', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'LAST', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'SETUP', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: '4HRS', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'LAST', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'SETUP', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: '4HRS', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'LAST', checks: Array(14).fill('') }
//     ]
//   });

//   const handleFieldChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleArrayChange = (arrayName, index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [arrayName]: prev[arrayName].map((item, i) => 
//         i === index ? { ...item, [field]: value } : item
//       )
//     }));
//   };

//   const handleCheckChange = (rowIndex, checkIndex, value) => {
//     setFormData(prev => ({
//       ...prev,
//       inspectionData: prev.inspectionData.map((row, i) => {
//         if (i === rowIndex) {
//           const newChecks = [...row.checks];
//           newChecks[checkIndex] = value;
//           return { ...row, checks: newChecks };
//         }
//         return row;
//       })
//     }));
//   };

//   const handleSave = () => {
//     console.log('Saving data:', formData);
//     alert('✅ Patrol Inspection Report Saved!');
//     setIsEditing(false);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const CellInput = ({ value, onChange, style = {} }) => (
//     <input
//       type="text"
//       value={value}
//       onChange={onChange}
//       style={{
//         width: '100%',
//         border: 'none',
//         outline: 'none',
//         padding: '4px',
//         backgroundColor: 'transparent',
//         fontSize: 'inherit',
//         ...style
//       }}
//     />
//   );

//   return (
//     <div style={{ minHeight: '100vh', backgroundColor: '#e5e7eb', padding: '20px' }}>
      
//       {/* Action Bar */}
//       <div className="no-print" style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '20px',
//         position: 'sticky',
//         top: '20px',
//         backgroundColor: '#e5e7eb',
//         padding: '10px 0',
//         zIndex: 1000
//       }}>
//         <button
//           onClick={() => window.history.back()}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             padding: '12px 24px',
//             backgroundColor: '#64748b',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             fontWeight: '600',
//             fontSize: '15px',
//             boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//           }}
//         >
//           <ArrowLeft size={20} />
//           Back to QMS
//         </button>

//         <div style={{ display: 'flex', gap: '12px' }}>
//           {!isEditing ? (
//             <>
//               <button
//                 onClick={() => setIsEditing(true)}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   padding: '12px 24px',
//                   backgroundColor: '#3b82f6',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontWeight: '600',
//                   fontSize: '15px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               >
//                 <Edit size={20} />
//                 Edit
//               </button>
//               <button
//                 onClick={handlePrint}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   padding: '12px 24px',
//                   backgroundColor: '#10b981',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontWeight: '600',
//                   fontSize: '15px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               >
//                 <Printer size={20} />
//                 Print
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   padding: '12px 24px',
//                   backgroundColor: '#ef4444',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontWeight: '600',
//                   fontSize: '15px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               >
//                 <X size={20} />
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   padding: '12px 24px',
//                   backgroundColor: '#10b981',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontWeight: '600',
//                   fontSize: '15px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               >
//                 <Save size={20} />
//                 Save
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* A3 Page Container */}
//       <div style={{
//         width: '420mm',
//         minHeight: '297mm',
//         margin: '0 auto',
//         backgroundColor: 'white',
//         padding: '20mm',
//         boxShadow: '0 0 20px rgba(0,0,0,0.15)',
//         border: '1px solid #ddd'
//       }} ref={printRef}>
        
//         {/* Header Table */}
//         <table style={{ 
//           width: '100%', 
//           borderCollapse: 'collapse', 
//           marginBottom: '12px', 
//           border: '2px solid black',
//           tableLayout: 'fixed'
//         }}>
//           <tbody>
//             <tr>
//               <td rowSpan={3} style={{ 
//                 border: '2px solid black', 
//                 padding: '15px', 
//                 width: '15%',
//                 textAlign: 'center',
//                 verticalAlign: 'middle',
//                 backgroundColor: 'white'
//               }}>
//                 <img 
//                   src="/logo1.jpg" 
//                   alt="ATOM ONE" 
//                   style={{
//                     maxWidth: '90%',
//                     height: 'auto',
//                     maxHeight: '70px',
//                     objectFit: 'contain'
//                   }}
//                 />
//               </td>
//               <td rowSpan={3} style={{ 
//                 border: '2px solid black', 
//                 padding: '20px',
//                 textAlign: 'center',
//                 fontWeight: 'bold',
//                 fontSize: '18px',
//                 width: '55%',
//                 verticalAlign: 'middle'
//               }}>
//                 SETUP & PATROL INSPECTION REPORT
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontWeight: 'bold', 
//                 fontSize: '11px', 
//                 width: '12%',
//                 backgroundColor: 'white'
//               }}>
//                 DOC.NO.
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontSize: '11px', 
//                 width: '18%' 
//               }}>
//                 {formData.docNo}
//               </td>
//             </tr>
//             <tr>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontWeight: 'bold', 
//                 fontSize: '11px',
//                 backgroundColor: 'white'
//               }}>
//                 REVISION NO.
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontSize: '11px' 
//               }}>
//                 {formData.revisionNo}
//               </td>
//             </tr>
//             <tr>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontWeight: 'bold', 
//                 fontSize: '11px',
//                 backgroundColor: 'white'
//               }}>
//                 DATE
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontSize: '11px' 
//               }}>
//                 {formData.date}
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {/* Part Info Table */}
//         <table style={{ 
//           width: '100%', 
//           borderCollapse: 'collapse', 
//           marginBottom: '12px', 
//           border: '2px solid black',
//           tableLayout: 'fixed'
//         }}>
//           <tbody>
//             <tr>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontWeight: 'bold', 
//                 width: '15%', 
//                 fontSize: '12px', 
//                 backgroundColor: '#e0e0e0'
//               }}>
//                 PART NAME
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 width: '35%', 
//                 fontSize: '12px',
//                 backgroundColor: 'white'
//               }}>
//                 {isEditing ? (
//                   <CellInput value={formData.partName} onChange={(e) => handleFieldChange('partName', e.target.value)} />
//                 ) : formData.partName}
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontWeight: 'bold', 
//                 width: '18%', 
//                 fontSize: '12px', 
//                 backgroundColor: '#e0e0e0'
//               }}>
//                 OPERATION NAME
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 width: '32%', 
//                 fontSize: '12px',
//                 backgroundColor: 'white'
//               }}>
//                 {isEditing ? (
//                   <CellInput value={formData.operationName} onChange={(e) => handleFieldChange('operationName', e.target.value)} />
//                 ) : formData.operationName}
//               </td>
//             </tr>
//             <tr>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontWeight: 'bold', 
//                 fontSize: '12px', 
//                 backgroundColor: '#e0e0e0'
//               }}>
//                 PART NUMBER
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontSize: '12px',
//                 backgroundColor: 'white'
//               }}>
//                 {isEditing ? (
//                   <CellInput value={formData.partNumber} onChange={(e) => handleFieldChange('partNumber', e.target.value)} />
//                 ) : formData.partNumber}
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontWeight: 'bold', 
//                 fontSize: '12px', 
//                 backgroundColor: '#e0e0e0'
//               }}>
//                 CUSTOMER NAME
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontSize: '12px',
//                 backgroundColor: 'white'
//               }}>
//                 {isEditing ? (
//                   <CellInput value={formData.customerName} onChange={(e) => handleFieldChange('customerName', e.target.value)} />
//                 ) : formData.customerName}
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {/* Specifications Table */}
//         <table style={{ 
//           width: '100%', 
//           borderCollapse: 'collapse', 
//           border: '2px solid black', 
//           fontSize: '10px', 
//           marginBottom: '12px',
//           tableLayout: 'fixed'
//         }}>
//           <thead>
//             <tr style={{ backgroundColor: '#c8c8c8', fontWeight: 'bold' }}>
//               <th style={{ border: '2px solid black', padding: '8px', width: '3%', backgroundColor: '#c8c8c8' }}>SR.<br/>NO</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '12%', backgroundColor: '#c8c8c8' }}>INSP. ITEM<br/>(PRODUCT)</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '8%', backgroundColor: '#c8c8c8' }}>SPECIAL<br/>CHARACTERST<br/>IC</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '7%', backgroundColor: '#c8c8c8' }}>SPEC.</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '7%', backgroundColor: '#c8c8c8' }}>TOLERANCE</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '5%', backgroundColor: '#c8c8c8' }}>INST.</th>
              
//               <th style={{ border: '2px solid black', padding: '8px', width: '3%', backgroundColor: '#c8c8c8' }}>SR.<br/>NO</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '12%', backgroundColor: '#c8c8c8' }}>INSP. ITEM<br/>(PROCESS)</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '7%', backgroundColor: '#c8c8c8' }}>SPEC.</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '7%', backgroundColor: '#c8c8c8' }}>TOLERANCE</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '5%', backgroundColor: '#c8c8c8' }}>INST.</th>
//             </tr>
//           </thead>
//           <tbody>
//             {[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(idx => (
//               <tr key={idx} style={{ height: '35px' }}>
//                 <td style={{ border: '2px solid black', padding: '6px', textAlign: 'center' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].srNo}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'srNo', e.target.value)}
//                       style={{ textAlign: 'center' }}
//                     />
//                   ) : formData.productItems[idx].srNo}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].inspItem}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'inspItem', e.target.value)}
//                     />
//                   ) : formData.productItems[idx].inspItem}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].specialChar}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'specialChar', e.target.value)}
//                     />
//                   ) : formData.productItems[idx].specialChar}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].spec}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'spec', e.target.value)}
//                     />
//                   ) : formData.productItems[idx].spec}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].tolerance}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'tolerance', e.target.value)}
//                     />
//                   ) : formData.productItems[idx].tolerance}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].inst}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'inst', e.target.value)}
//                     />
//                   ) : formData.productItems[idx].inst}
//                 </td>
                
//                 <td style={{ border: '2px solid black', padding: '6px', textAlign: 'center' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.processItems[idx].srNo}
//                       onChange={(e) => handleArrayChange('processItems', idx, 'srNo', e.target.value)}
//                       style={{ textAlign: 'center' }}
//                     />
//                   ) : formData.processItems[idx].srNo}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.processItems[idx].inspItem}
//                       onChange={(e) => handleArrayChange('processItems', idx, 'inspItem', e.target.value)}
//                     />
//                   ) : formData.processItems[idx].inspItem}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.processItems[idx].spec}
//                       onChange={(e) => handleArrayChange('processItems', idx, 'spec', e.target.value)}
//                     />
//                   ) : formData.processItems[idx].spec}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.processItems[idx].tolerance}
//                       onChange={(e) => handleArrayChange('processItems', idx, 'tolerance', e.target.value)}
//                     />
//                   ) : formData.processItems[idx].tolerance}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.processItems[idx].inst}
//                       onChange={(e) => handleArrayChange('processItems', idx, 'inst', e.target.value)}
//                     />
//                   ) : formData.processItems[idx].inst}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Inspection Records Table */}
//         <table style={{ 
//           width: '100%', 
//           borderCollapse: 'collapse', 
//           border: '2px solid black', 
//           fontSize: '9px',
//           tableLayout: 'fixed'
//         }}>
//           <thead>
//             <tr style={{ backgroundColor: '#c8c8c8', fontWeight: 'bold' }}>
//               <th style={{ border: '2px solid black', padding: '6px', width: '2.5%', backgroundColor: '#c8c8c8' }}>SR.<br/>NO</th>
//               <th style={{ border: '2px solid black', padding: '6px', width: '5%', backgroundColor: '#c8c8c8' }}>DATE</th>
//               <th style={{ border: '2px solid black', padding: '6px', width: '8%', backgroundColor: '#c8c8c8' }}>OPERATOR<br/>NAME</th>
//               <th style={{ border: '2px solid black', padding: '6px', width: '5%', backgroundColor: '#c8c8c8' }}>MACHINE<br/>NO.</th>
//               <th style={{ border: '2px solid black', padding: '6px', width: '4%', backgroundColor: '#c8c8c8' }}>TIME</th>
//               {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(n => (
//                 <th key={n} style={{ border: '2px solid black', padding: '6px', width: '2.5%', backgroundColor: '#c8c8c8' }}>{n}</th>
//               ))}
//               <th style={{ border: '2px solid black', padding: '6px', width: '6%', backgroundColor: '#c8c8c8' }}>JUDGEMENT</th>
//               <th style={{ border: '2px solid black', padding: '6px', width: '6%', backgroundColor: '#c8c8c8' }}>SIGN.</th>
//             </tr>
//           </thead>
//           <tbody>
//             {formData.inspectionData.map((row, rowIdx) => (
//               <tr key={rowIdx} style={{ height: '30px' }}>
//                 <td style={{ border: '2px solid black', padding: '4px', textAlign: 'center' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={row.srNo}
//                       onChange={(e) => handleArrayChange('inspectionData', rowIdx, 'srNo', e.target.value)}
//                       style={{ textAlign: 'center' }}
//                     />
//                   ) : row.srNo}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '4px' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={row.date}
//                       onChange={(e) => handleArrayChange('inspectionData', rowIdx, 'date', e.target.value)}
//                     />
//                   ) : row.date}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '4px' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={row.operatorName}
//                       onChange={(e) => handleArrayChange('inspectionData', rowIdx, 'operatorName', e.target.value)}
//                     />
//                   ) : row.operatorName}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '4px' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={row.machineNo}
//                       onChange={(e) => handleArrayChange('inspectionData', rowIdx, 'machineNo', e.target.value)}
//                     />
//                   ) : row.machineNo}
//                 </td>
//                 <td style={{ 
//                   border: '2px solid black', 
//                   padding: '4px', 
//                   textAlign: 'center',
//                   fontWeight: 'bold',
//                   backgroundColor: row.time === 'SETUP' ? '#fffbeb' : row.time === '4HRS' ? '#eff6ff' : '#fee2e2'
//                 }}>
//                   {row.time}
//                 </td>
//                 {row.checks.map((check, checkIdx) => (
//                   <td key={checkIdx} style={{ border: '2px solid black', padding: '4px', textAlign: 'center' }}>
//                     {isEditing ? (
//                       <CellInput 
//                         value={check}
//                         onChange={(e) => handleCheckChange(rowIdx, checkIdx, e.target.value)}
//                         style={{ textAlign: 'center' }}
//                       />
//                     ) : check}
//                   </td>
//                 ))}
//                 <td style={{ border: '2px solid black', padding: '4px' }}></td>
//                 <td style={{ border: '2px solid black', padding: '4px' }}></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Footer */}
//         <div style={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           marginTop: '25px',
//           fontSize: '12px',
//           fontWeight: 'bold'
//         }}>
//           <div>PREPARED BY: _________________________________</div>
//           <div>APPROVED BY: _________________________________</div>
//         </div>

//       </div>

//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//           body { 
//             margin: 0; 
//             padding: 0; 
//           }
//           @page { 
//             size: A3 landscape; 
//             margin: 10mm; 
//           }
//         }
//         input:focus { 
//           outline: 2px solid #3b82f6; 
//           outline-offset: -2px; 
//           border-radius: 2px;
//         }
//       `}</style>

//     </div>
//   );
// };

// export default PatrolInspectionExact;



// import React, { useState, useRef } from 'react';
// import { ArrowLeft, Edit, Save, X, Printer } from 'lucide-react';

// const PatrolInspectionExact = () => {
//   const printRef = useRef();
//   const [isEditing, setIsEditing] = useState(false);

//   const [formData, setFormData] = useState({
//     docNo: 'AOT-F-QA-15',
//     revisionNo: '00',
//     date: '14-10-2024',
//     partName: '',
//     partNumber: '',
//     operationName: '',
//     customerName: '',
    
//     productItems: Array(14).fill(null).map(() => ({
//       srNo: '',
//       inspItem: '',
//       specialChar: '',
//       spec: '',
//       tolerance: '',
//       inst: ''
//     })),
    
//     processItems: Array(14).fill(null).map(() => ({
//       srNo: '',
//       inspItem: '',
//       spec: '',
//       tolerance: '',
//       inst: ''
//     })),
    
//     inspectionData: [
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'SETUP', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: '4HRS', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'LAST', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'SETUP', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: '4HRS', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'LAST', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'SETUP', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: '4HRS', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'LAST', checks: Array(14).fill('') }
//     ]
//   });

//   const handleFieldChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleArrayChange = (arrayName, index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [arrayName]: prev[arrayName].map((item, i) => 
//         i === index ? { ...item, [field]: value } : item
//       )
//     }));
//   };

//   const handleCheckChange = (rowIndex, checkIndex, value) => {
//     setFormData(prev => ({
//       ...prev,
//       inspectionData: prev.inspectionData.map((row, i) => {
//         if (i === rowIndex) {
//           const newChecks = [...row.checks];
//           newChecks[checkIndex] = value;
//           return { ...row, checks: newChecks };
//         }
//         return row;
//       })
//     }));
//   };

//   const handleSave = () => {
//     console.log('Saving data:', formData);
//     alert('✅ Patrol Inspection Report Saved!');
//     setIsEditing(false);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const CellInput = ({ value, onChange, style = {} }) => (
//     <input
//       type="text"
//       value={value}
//       onChange={onChange}
//       style={{
//         width: '100%',
//         border: 'none',
//         outline: 'none',
//         padding: '4px',
//         backgroundColor: 'transparent',
//         fontSize: 'inherit',
//         color: '#000',
//         ...style
//       }}
//     />
//   );

//   return (
//     <div style={{ minHeight: '100vh', backgroundColor: '#e5e7eb', padding: '20px' }}>
      
//       {/* Action Bar */}
//       <div className="no-print" style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '20px',
//         position: 'sticky',
//         top: '20px',
//         backgroundColor: '#e5e7eb',
//         padding: '10px 0',
//         zIndex: 1000
//       }}>
//         <button
//           onClick={() => window.history.back()}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             padding: '12px 24px',
//             backgroundColor: '#64748b',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             fontWeight: '600',
//             fontSize: '15px',
//             boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//           }}
//         >
//           <ArrowLeft size={20} />
//           Back to QMS
//         </button>

//         <div style={{ display: 'flex', gap: '12px' }}>
//           {!isEditing ? (
//             <>
//               <button
//                 onClick={() => setIsEditing(true)}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   padding: '12px 24px',
//                   backgroundColor: '#3b82f6',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontWeight: '600',
//                   fontSize: '15px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               >
//                 <Edit size={20} />
//                 Edit
//               </button>
//               <button
//                 onClick={handlePrint}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   padding: '12px 24px',
//                   backgroundColor: '#10b981',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontWeight: '600',
//                   fontSize: '15px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               >
//                 <Printer size={20} />
//                 Print
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   padding: '12px 24px',
//                   backgroundColor: '#ef4444',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontWeight: '600',
//                   fontSize: '15px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               >
//                 <X size={20} />
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   padding: '12px 24px',
//                   backgroundColor: '#10b981',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontWeight: '600',
//                   fontSize: '15px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               >
//                 <Save size={20} />
//                 Save
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* A3 Page Container */}
//       <div style={{
//         width: '420mm',
//         minHeight: '297mm',
//         margin: '0 auto',
//         backgroundColor: 'white',
//         padding: '20mm',
//         boxShadow: '0 0 20px rgba(0,0,0,0.15)',
//         border: '1px solid #ddd'
//       }} ref={printRef}>
        
//         {/* Header Table */}
//         <table style={{ 
//           width: '100%', 
//           borderCollapse: 'collapse', 
//           marginBottom: '12px', 
//           border: '2px solid black',
//           tableLayout: 'fixed'
//         }}>
//           <tbody>
//             <tr>
//               <td rowSpan={3} style={{ 
//                 border: '2px solid black', 
//                 padding: '15px', 
//                 width: '15%',
//                 textAlign: 'center',
//                 verticalAlign: 'middle',
//                 backgroundColor: 'white'
//               }}>
//                 <img 
//                   src="/logo1.jpg" 
//                   alt="ATOM ONE" 
//                   style={{
//                     maxWidth: '90%',
//                     height: 'auto',
//                     maxHeight: '70px',
//                     objectFit: 'contain'
//                   }}
//                 />
//               </td>
//               <td rowSpan={3} style={{ 
//                 border: '2px solid black', 
//                 padding: '20px',
//                 textAlign: 'center',
//                 fontWeight: 'bold',
//                 fontSize: '18px',
//                 width: '55%',
//                 verticalAlign: 'middle',
//                 color: '#000'
//               }}>
//                 SETUP & PATROL INSPECTION REPORT
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontWeight: 'bold', 
//                 fontSize: '11px', 
//                 width: '12%',
//                 backgroundColor: 'white',
//                 color: '#000'
//               }}>
//                 DOC.NO.
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontSize: '11px', 
//                 width: '18%',
//                 color: '#000'
//               }}>
//                 {formData.docNo}
//               </td>
//             </tr>
//             <tr>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontWeight: 'bold', 
//                 fontSize: '11px',
//                 backgroundColor: 'white',
//                 color: '#000'
//               }}>
//                 REVISION NO.
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontSize: '11px',
//                 color: '#000'
//               }}>
//                 {formData.revisionNo}
//               </td>
//             </tr>
//             <tr>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontWeight: 'bold', 
//                 fontSize: '11px',
//                 backgroundColor: 'white',
//                 color: '#000'
//               }}>
//                 DATE
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontSize: '11px',
//                 color: '#000'
//               }}>
//                 {formData.date}
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {/* Part Info Table */}
//         <table style={{ 
//           width: '100%', 
//           borderCollapse: 'collapse', 
//           marginBottom: '12px', 
//           border: '2px solid black',
//           tableLayout: 'fixed'
//         }}>
//           <tbody>
//             <tr>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontWeight: 'bold', 
//                 width: '15%', 
//                 fontSize: '12px', 
//                 backgroundColor: '#e0e0e0',
//                 color: '#000'
//               }}>
//                 PART NAME
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 width: '35%', 
//                 fontSize: '12px',
//                 backgroundColor: 'white',
//                 color: '#000'
//               }}>
//                 {isEditing ? (
//                   <CellInput value={formData.partName} onChange={(e) => handleFieldChange('partName', e.target.value)} />
//                 ) : formData.partName}
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontWeight: 'bold', 
//                 width: '18%', 
//                 fontSize: '12px', 
//                 backgroundColor: '#e0e0e0',
//                 color: '#000'
//               }}>
//                 OPERATION NAME
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 width: '32%', 
//                 fontSize: '12px',
//                 backgroundColor: 'white',
//                 color: '#000'
//               }}>
//                 {isEditing ? (
//                   <CellInput value={formData.operationName} onChange={(e) => handleFieldChange('operationName', e.target.value)} />
//                 ) : formData.operationName}
//               </td>
//             </tr>
//             <tr>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontWeight: 'bold', 
//                 fontSize: '12px', 
//                 backgroundColor: '#e0e0e0',
//                 color: '#000'
//               }}>
//                 PART NUMBER
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontSize: '12px',
//                 backgroundColor: 'white',
//                 color: '#000'
//               }}>
//                 {isEditing ? (
//                   <CellInput value={formData.partNumber} onChange={(e) => handleFieldChange('partNumber', e.target.value)} />
//                 ) : formData.partNumber}
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontWeight: 'bold', 
//                 fontSize: '12px', 
//                 backgroundColor: '#e0e0e0',
//                 color: '#000'
//               }}>
//                 CUSTOMER NAME
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontSize: '12px',
//                 backgroundColor: 'white',
//                 color: '#000'
//               }}>
//                 {isEditing ? (
//                   <CellInput value={formData.customerName} onChange={(e) => handleFieldChange('customerName', e.target.value)} />
//                 ) : formData.customerName}
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {/* Specifications Table */}
//         <table style={{ 
//           width: '100%', 
//           borderCollapse: 'collapse', 
//           border: '2px solid black', 
//           fontSize: '10px', 
//           marginBottom: '12px',
//           tableLayout: 'fixed'
//         }}>
//           <thead>
//             <tr style={{ backgroundColor: '#c8c8c8', fontWeight: 'bold' }}>
//               <th style={{ border: '2px solid black', padding: '8px', width: '3%', backgroundColor: '#c8c8c8', color: '#000' }}>SR.<br/>NO</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '12%', backgroundColor: '#c8c8c8', color: '#000' }}>INSP. ITEM<br/>(PRODUCT)</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '8%', backgroundColor: '#c8c8c8', color: '#000' }}>SPECIAL<br/>CHARACTERST<br/>IC</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '7%', backgroundColor: '#c8c8c8', color: '#000' }}>SPEC.</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '7%', backgroundColor: '#c8c8c8', color: '#000' }}>TOLERANCE</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '5%', backgroundColor: '#c8c8c8', color: '#000' }}>INST.</th>
              
//               <th style={{ border: '2px solid black', padding: '8px', width: '3%', backgroundColor: '#c8c8c8', color: '#000' }}>SR.<br/>NO</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '12%', backgroundColor: '#c8c8c8', color: '#000' }}>INSP. ITEM<br/>(PROCESS)</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '7%', backgroundColor: '#c8c8c8', color: '#000' }}>SPEC.</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '7%', backgroundColor: '#c8c8c8', color: '#000' }}>TOLERANCE</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '5%', backgroundColor: '#c8c8c8', color: '#000' }}>INST.</th>
//             </tr>
//           </thead>
//           <tbody>
//             {[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(idx => (
//               <tr key={idx} style={{ height: '35px' }}>
//                 <td style={{ border: '2px solid black', padding: '6px', textAlign: 'center', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].srNo}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'srNo', e.target.value)}
//                       style={{ textAlign: 'center' }}
//                     />
//                   ) : formData.productItems[idx].srNo}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].inspItem}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'inspItem', e.target.value)}
//                     />
//                   ) : formData.productItems[idx].inspItem}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].specialChar}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'specialChar', e.target.value)}
//                     />
//                   ) : formData.productItems[idx].specialChar}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].spec}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'spec', e.target.value)}
//                     />
//                   ) : formData.productItems[idx].spec}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].tolerance}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'tolerance', e.target.value)}
//                     />
//                   ) : formData.productItems[idx].tolerance}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].inst}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'inst', e.target.value)}
//                     />
//                   ) : formData.productItems[idx].inst}
//                 </td>
                
//                 <td style={{ border: '2px solid black', padding: '6px', textAlign: 'center', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.processItems[idx].srNo}
//                       onChange={(e) => handleArrayChange('processItems', idx, 'srNo', e.target.value)}
//                       style={{ textAlign: 'center' }}
//                     />
//                   ) : formData.processItems[idx].srNo}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.processItems[idx].inspItem}
//                       onChange={(e) => handleArrayChange('processItems', idx, 'inspItem', e.target.value)}
//                     />
//                   ) : formData.processItems[idx].inspItem}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.processItems[idx].spec}
//                       onChange={(e) => handleArrayChange('processItems', idx, 'spec', e.target.value)}
//                     />
//                   ) : formData.processItems[idx].spec}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.processItems[idx].tolerance}
//                       onChange={(e) => handleArrayChange('processItems', idx, 'tolerance', e.target.value)}
//                     />
//                   ) : formData.processItems[idx].tolerance}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.processItems[idx].inst}
//                       onChange={(e) => handleArrayChange('processItems', idx, 'inst', e.target.value)}
//                     />
//                   ) : formData.processItems[idx].inst}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Inspection Records Table */}
//         <table style={{ 
//           width: '100%', 
//           borderCollapse: 'collapse', 
//           border: '2px solid black', 
//           fontSize: '9px',
//           tableLayout: 'fixed'
//         }}>
//           <thead>
//             <tr style={{ backgroundColor: '#c8c8c8', fontWeight: 'bold' }}>
//               <th style={{ border: '2px solid black', padding: '6px', width: '2.5%', backgroundColor: '#c8c8c8', color: '#000' }}>SR.<br/>NO</th>
//               <th style={{ border: '2px solid black', padding: '6px', width: '5%', backgroundColor: '#c8c8c8', color: '#000' }}>DATE</th>
//               <th style={{ border: '2px solid black', padding: '6px', width: '8%', backgroundColor: '#c8c8c8', color: '#000' }}>OPERATOR<br/>NAME</th>
//               <th style={{ border: '2px solid black', padding: '6px', width: '5%', backgroundColor: '#c8c8c8', color: '#000' }}>MACHINE<br/>NO.</th>
//               <th style={{ border: '2px solid black', padding: '6px', width: '4%', backgroundColor: '#c8c8c8', color: '#000' }}>TIME</th>
//               {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(n => (
//                 <th key={n} style={{ border: '2px solid black', padding: '6px', width: '2.5%', backgroundColor: '#c8c8c8', color: '#000' }}>{n}</th>
//               ))}
//               <th style={{ border: '2px solid black', padding: '6px', width: '6%', backgroundColor: '#c8c8c8', color: '#000' }}>JUDGEMENT</th>
//               <th style={{ border: '2px solid black', padding: '6px', width: '6%', backgroundColor: '#c8c8c8', color: '#000' }}>SIGN.</th>
//             </tr>
//           </thead>
//           <tbody>
//             {formData.inspectionData.map((row, rowIdx) => (
//               <tr key={rowIdx} style={{ height: '30px' }}>
//                 <td style={{ border: '2px solid black', padding: '4px', textAlign: 'center', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={row.srNo}
//                       onChange={(e) => handleArrayChange('inspectionData', rowIdx, 'srNo', e.target.value)}
//                       style={{ textAlign: 'center' }}
//                     />
//                   ) : row.srNo}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '4px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={row.date}
//                       onChange={(e) => handleArrayChange('inspectionData', rowIdx, 'date', e.target.value)}
//                     />
//                   ) : row.date}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '4px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={row.operatorName}
//                       onChange={(e) => handleArrayChange('inspectionData', rowIdx, 'operatorName', e.target.value)}
//                     />
//                   ) : row.operatorName}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '4px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={row.machineNo}
//                       onChange={(e) => handleArrayChange('inspectionData', rowIdx, 'machineNo', e.target.value)}
//                     />
//                   ) : row.machineNo}
//                 </td>
//                 <td style={{ 
//                   border: '2px solid black', 
//                   padding: '4px', 
//                   textAlign: 'center',
//                   fontWeight: 'bold',
//                   backgroundColor: row.time === 'SETUP' ? '#fffbeb' : row.time === '4HRS' ? '#eff6ff' : '#fee2e2',
//                   color: '#000'
//                 }}>
//                   {row.time}
//                 </td>
//                 {row.checks.map((check, checkIdx) => (
//                   <td key={checkIdx} style={{ border: '2px solid black', padding: '4px', textAlign: 'center', color: '#000' }}>
//                     {isEditing ? (
//                       <CellInput 
//                         value={check}
//                         onChange={(e) => handleCheckChange(rowIdx, checkIdx, e.target.value)}
//                         style={{ textAlign: 'center' }}
//                       />
//                     ) : check}
//                   </td>
//                 ))}
//                 <td style={{ border: '2px solid black', padding: '4px', color: '#000' }}></td>
//                 <td style={{ border: '2px solid black', padding: '4px', color: '#000' }}></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Footer */}
//         <div style={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           marginTop: '25px',
//           fontSize: '12px',
//           fontWeight: 'bold',
//           color: '#000'
//         }}>
//           <div>PREPARED BY: _________________________________</div>
//           <div>APPROVED BY: _________________________________</div>
//         </div>

//       </div>

//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//           body { 
//             margin: 0; 
//             padding: 0; 
//           }
//           @page { 
//             size: A3 landscape; 
//             margin: 10mm; 
//           }
//         }
//         input:focus { 
//           outline: 2px solid #3b82f6; 
//           outline-offset: -2px; 
//           border-radius: 2px;
//         }
//       `}</style>

//     </div>
//   );
// };

// export default PatrolInspectionExact;




// import React, { useState, useRef } from 'react';
// import { ArrowLeft, Edit, Save, X, Printer } from 'lucide-react';

// const PatrolInspectionExact = () => {
//   const printRef = useRef();
//   const [isEditing, setIsEditing] = useState(false);

//   const [formData, setFormData] = useState({
//     docNo: 'AOT-F-QA-15',
//     revisionNo: '00',
//     date: '14-10-2024',
//     partName: '',
//     partNumber: '',
//     operationName: '',
//     customerName: '',
    
//     productItems: Array(14).fill(null).map(() => ({
//       srNo: '',
//       inspItem: '',
//       specialChar: '',
//       spec: '',
//       tolerance: '',
//       inst: ''
//     })),
    
//     processItems: Array(14).fill(null).map(() => ({
//       srNo: '',
//       inspItem: '',
//       spec: '',
//       tolerance: '',
//       inst: ''
//     })),
    
//     inspectionData: [
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'SETUP', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: '4HRS', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'LAST', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'SETUP', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: '4HRS', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'LAST', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'SETUP', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: '4HRS', checks: Array(14).fill('') },
//       { srNo: '', date: '', operatorName: '', machineNo: '', time: 'LAST', checks: Array(14).fill('') }
//     ]
//   });

//   const handleFieldChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleArrayChange = (arrayName, index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [arrayName]: prev[arrayName].map((item, i) => 
//         i === index ? { ...item, [field]: value } : item
//       )
//     }));
//   };

//   const handleCheckChange = (rowIndex, checkIndex, value) => {
//     setFormData(prev => ({
//       ...prev,
//       inspectionData: prev.inspectionData.map((row, i) => {
//         if (i === rowIndex) {
//           const newChecks = [...row.checks];
//           newChecks[checkIndex] = value;
//           return { ...row, checks: newChecks };
//         }
//         return row;
//       })
//     }));
//   };

//   const handleSave = () => {
//     console.log('Saving data:', formData);
//     alert('✅ Patrol Inspection Report Saved!');
//     setIsEditing(false);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const CellInput = ({ value, onChange, style = {} }) => (
//     <input
//       type="text"
//       value={value}
//       onChange={onChange}
//       style={{
//         width: '100%',
//         border: 'none',
//         outline: 'none',
//         padding: '4px',
//         backgroundColor: 'transparent',
//         fontSize: 'inherit',
//         color: '#000',
//         ...style
//       }}
//     />
//   );

//   return (
//     <div style={{ minHeight: '100vh', backgroundColor: '#e5e7eb', padding: '20px' }}>
      
//       {/* Action Bar */}
//       <div className="no-print" style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '20px',
//         position: 'sticky',
//         top: '20px',
//         backgroundColor: '#e5e7eb',
//         padding: '10px 0',
//         zIndex: 1000
//       }}>
//         <button
//           onClick={() => window.history.back()}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             padding: '12px 24px',
//             backgroundColor: '#64748b',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             fontWeight: '600',
//             fontSize: '15px',
//             boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//           }}
//         >
//           <ArrowLeft size={20} />
//           Back to QMS
//         </button>

//         <div style={{ display: 'flex', gap: '12px' }}>
//           {!isEditing ? (
//             <>
//               <button
//                 onClick={() => setIsEditing(true)}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   padding: '12px 24px',
//                   backgroundColor: '#3b82f6',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontWeight: '600',
//                   fontSize: '15px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               >
//                 <Edit size={20} />
//                 Edit
//               </button>
//               <button
//                 onClick={handlePrint}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   padding: '12px 24px',
//                   backgroundColor: '#10b981',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontWeight: '600',
//                   fontSize: '15px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               >
//                 <Printer size={20} />
//                 Print
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   padding: '12px 24px',
//                   backgroundColor: '#ef4444',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontWeight: '600',
//                   fontSize: '15px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               >
//                 <X size={20} />
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   padding: '12px 24px',
//                   backgroundColor: '#10b981',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontWeight: '600',
//                   fontSize: '15px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               >
//                 <Save size={20} />
//                 Save
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* A3 Page Container */}
//       <div style={{
//         width: '420mm',
//         minHeight: '297mm',
//         margin: '0 auto',
//         backgroundColor: 'white',
//         padding: '20mm',
//         boxShadow: '0 0 20px rgba(0,0,0,0.15)',
//         border: '1px solid #ddd'
//       }} ref={printRef}>
        
//         {/* Header Table */}
//         <table style={{ 
//           width: '100%', 
//           borderCollapse: 'collapse', 
//           marginBottom: '12px', 
//           border: '2px solid black',
//           tableLayout: 'fixed'
//         }}>
//           <tbody>
//             <tr>
//               <td rowSpan={3} style={{ 
//                 border: '2px solid black', 
//                 padding: '15px', 
//                 width: '15%',
//                 textAlign: 'center',
//                 verticalAlign: 'middle',
//                 backgroundColor: 'white'
//               }}>
//                 <img 
//                   src="/logo1.jpg" 
//                   alt="ATOM ONE" 
//                   style={{
//                     maxWidth: '90%',
//                     height: 'auto',
//                     maxHeight: '70px',
//                     objectFit: 'contain'
//                   }}
//                 />
//               </td>
//               <td rowSpan={3} style={{ 
//                 border: '2px solid black', 
//                 padding: '20px',
//                 textAlign: 'center',
//                 fontWeight: 'bold',
//                 fontSize: '18px',
//                 width: '55%',
//                 verticalAlign: 'middle',
//                 color: '#000'
//               }}>
//                 SETUP & PATROL INSPECTION REPORT
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontWeight: 'bold', 
//                 fontSize: '11px', 
//                 width: '12%',
//                 backgroundColor: 'white',
//                 color: '#000'
//               }}>
//                 DOC.NO.
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontSize: '11px', 
//                 width: '18%',
//                 color: '#000'
//               }}>
//                 {formData.docNo}
//               </td>
//             </tr>
//             <tr>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontWeight: 'bold', 
//                 fontSize: '11px',
//                 backgroundColor: 'white',
//                 color: '#000'
//               }}>
//                 REVISION NO.
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontSize: '11px',
//                 color: '#000'
//               }}>
//                 {formData.revisionNo}
//               </td>
//             </tr>
//             <tr>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontWeight: 'bold', 
//                 fontSize: '11px',
//                 backgroundColor: 'white',
//                 color: '#000'
//               }}>
//                 DATE
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '8px', 
//                 fontSize: '11px',
//                 color: '#000'
//               }}>
//                 {isEditing ? (
//                   <input
//                     type="date"
//                     value={formData.date.split('-').reverse().join('-')}
//                     onChange={(e) => {
//                       const [year, month, day] = e.target.value.split('-');
//                       handleFieldChange('date', `${day}-${month}-${year}`);
//                     }}
//                     style={{
//                       width: '100%',
//                       border: 'none',
//                       outline: 'none',
//                       padding: '4px',
//                       backgroundColor: 'transparent',
//                       fontSize: 'inherit',
//                       color: '#000'
//                     }}
//                   />
//                 ) : formData.date}
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {/* Part Info Table */}
//         <table style={{ 
//           width: '100%', 
//           borderCollapse: 'collapse', 
//           marginBottom: '12px', 
//           border: '2px solid black',
//           tableLayout: 'fixed'
//         }}>
//           <tbody>
//             <tr>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontWeight: 'bold', 
//                 width: '15%', 
//                 fontSize: '12px', 
//                 backgroundColor: '#e0e0e0',
//                 color: '#000'
//               }}>
//                 PART NAME
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 width: '35%', 
//                 fontSize: '12px',
//                 backgroundColor: 'white',
//                 color: '#000'
//               }}>
//                 {isEditing ? (
//                   <CellInput value={formData.partName} onChange={(e) => handleFieldChange('partName', e.target.value)} />
//                 ) : formData.partName}
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontWeight: 'bold', 
//                 width: '18%', 
//                 fontSize: '12px', 
//                 backgroundColor: '#e0e0e0',
//                 color: '#000'
//               }}>
//                 OPERATION NAME
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 width: '32%', 
//                 fontSize: '12px',
//                 backgroundColor: 'white',
//                 color: '#000'
//               }}>
//                 {isEditing ? (
//                   <CellInput value={formData.operationName} onChange={(e) => handleFieldChange('operationName', e.target.value)} />
//                 ) : formData.operationName}
//               </td>
//             </tr>
//             <tr>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontWeight: 'bold', 
//                 fontSize: '12px', 
//                 backgroundColor: '#e0e0e0',
//                 color: '#000'
//               }}>
//                 PART NUMBER
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontSize: '12px',
//                 backgroundColor: 'white',
//                 color: '#000'
//               }}>
//                 {isEditing ? (
//                   <CellInput value={formData.partNumber} onChange={(e) => handleFieldChange('partNumber', e.target.value)} />
//                 ) : formData.partNumber}
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontWeight: 'bold', 
//                 fontSize: '12px', 
//                 backgroundColor: '#e0e0e0',
//                 color: '#000'
//               }}>
//                 CUSTOMER NAME
//               </td>
//               <td style={{ 
//                 border: '2px solid black', 
//                 padding: '10px', 
//                 fontSize: '12px',
//                 backgroundColor: 'white',
//                 color: '#000'
//               }}>
//                 {isEditing ? (
//                   <CellInput value={formData.customerName} onChange={(e) => handleFieldChange('customerName', e.target.value)} />
//                 ) : formData.customerName}
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {/* Specifications Table */}
//         <table style={{ 
//           width: '100%', 
//           borderCollapse: 'collapse', 
//           border: '2px solid black', 
//           fontSize: '10px', 
//           marginBottom: '12px',
//           tableLayout: 'fixed'
//         }}>
//           <thead>
//             <tr style={{ backgroundColor: '#c8c8c8', fontWeight: 'bold' }}>
//               <th style={{ border: '2px solid black', padding: '8px', width: '3%', backgroundColor: '#c8c8c8', color: '#000' }}>SR.<br/>NO</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '12%', backgroundColor: '#c8c8c8', color: '#000' }}>INSP. ITEM<br/>(PRODUCT)</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '8%', backgroundColor: '#c8c8c8', color: '#000' }}>SPECIAL<br/>CHARACTERST<br/>IC</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '7%', backgroundColor: '#c8c8c8', color: '#000' }}>SPEC.</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '7%', backgroundColor: '#c8c8c8', color: '#000' }}>TOLERANCE</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '5%', backgroundColor: '#c8c8c8', color: '#000' }}>INST.</th>
              
//               <th style={{ border: '2px solid black', padding: '8px', width: '3%', backgroundColor: '#c8c8c8', color: '#000' }}>SR.<br/>NO</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '12%', backgroundColor: '#c8c8c8', color: '#000' }}>INSP. ITEM<br/>(PROCESS)</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '7%', backgroundColor: '#c8c8c8', color: '#000' }}>SPEC.</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '7%', backgroundColor: '#c8c8c8', color: '#000' }}>TOLERANCE</th>
//               <th style={{ border: '2px solid black', padding: '8px', width: '5%', backgroundColor: '#c8c8c8', color: '#000' }}>INST.</th>
//             </tr>
//           </thead>
//           <tbody>
//             {[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(idx => (
//               <tr key={idx} style={{ height: '35px' }}>
//                 <td style={{ border: '2px solid black', padding: '6px', textAlign: 'center', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].srNo}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'srNo', e.target.value)}
//                       style={{ textAlign: 'center' }}
//                     />
//                   ) : formData.productItems[idx].srNo}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].inspItem}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'inspItem', e.target.value)}
//                     />
//                   ) : formData.productItems[idx].inspItem}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].specialChar}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'specialChar', e.target.value)}
//                     />
//                   ) : formData.productItems[idx].specialChar}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].spec}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'spec', e.target.value)}
//                     />
//                   ) : formData.productItems[idx].spec}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].tolerance}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'tolerance', e.target.value)}
//                     />
//                   ) : formData.productItems[idx].tolerance}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.productItems[idx].inst}
//                       onChange={(e) => handleArrayChange('productItems', idx, 'inst', e.target.value)}
//                     />
//                   ) : formData.productItems[idx].inst}
//                 </td>
                
//                 <td style={{ border: '2px solid black', padding: '6px', textAlign: 'center', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.processItems[idx].srNo}
//                       onChange={(e) => handleArrayChange('processItems', idx, 'srNo', e.target.value)}
//                       style={{ textAlign: 'center' }}
//                     />
//                   ) : formData.processItems[idx].srNo}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.processItems[idx].inspItem}
//                       onChange={(e) => handleArrayChange('processItems', idx, 'inspItem', e.target.value)}
//                     />
//                   ) : formData.processItems[idx].inspItem}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.processItems[idx].spec}
//                       onChange={(e) => handleArrayChange('processItems', idx, 'spec', e.target.value)}
//                     />
//                   ) : formData.processItems[idx].spec}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.processItems[idx].tolerance}
//                       onChange={(e) => handleArrayChange('processItems', idx, 'tolerance', e.target.value)}
//                     />
//                   ) : formData.processItems[idx].tolerance}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '6px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={formData.processItems[idx].inst}
//                       onChange={(e) => handleArrayChange('processItems', idx, 'inst', e.target.value)}
//                     />
//                   ) : formData.processItems[idx].inst}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Inspection Records Table */}
//         <table style={{ 
//           width: '100%', 
//           borderCollapse: 'collapse', 
//           border: '2px solid black', 
//           fontSize: '9px',
//           tableLayout: 'fixed'
//         }}>
//           <thead>
//             <tr style={{ backgroundColor: '#c8c8c8', fontWeight: 'bold' }}>
//               <th style={{ border: '2px solid black', padding: '6px', width: '2.5%', backgroundColor: '#c8c8c8', color: '#000' }}>SR.<br/>NO</th>
//               <th style={{ border: '2px solid black', padding: '6px', width: '5%', backgroundColor: '#c8c8c8', color: '#000' }}>DATE</th>
//               <th style={{ border: '2px solid black', padding: '6px', width: '8%', backgroundColor: '#c8c8c8', color: '#000' }}>OPERATOR<br/>NAME</th>
//               <th style={{ border: '2px solid black', padding: '6px', width: '5%', backgroundColor: '#c8c8c8', color: '#000' }}>MACHINE<br/>NO.</th>
//               <th style={{ border: '2px solid black', padding: '6px', width: '4%', backgroundColor: '#c8c8c8', color: '#000' }}>TIME</th>
//               {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(n => (
//                 <th key={n} style={{ border: '2px solid black', padding: '6px', width: '2.5%', backgroundColor: '#c8c8c8', color: '#000' }}>{n}</th>
//               ))}
//               <th style={{ border: '2px solid black', padding: '6px', width: '6%', backgroundColor: '#c8c8c8', color: '#000' }}>JUDGEMENT</th>
//               <th style={{ border: '2px solid black', padding: '6px', width: '6%', backgroundColor: '#c8c8c8', color: '#000' }}>SIGN.</th>
//             </tr>
//           </thead>
//           <tbody>
//             {formData.inspectionData.map((row, rowIdx) => (
//               <tr key={rowIdx} style={{ height: '30px' }}>
//                 <td style={{ border: '2px solid black', padding: '4px', textAlign: 'center', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={row.srNo}
//                       onChange={(e) => handleArrayChange('inspectionData', rowIdx, 'srNo', e.target.value)}
//                       style={{ textAlign: 'center' }}
//                     />
//                   ) : row.srNo}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '4px', color: '#000' }}>
//                   {isEditing ? (
//                     <input
//                       type="date"
//                       value={row.date ? row.date.split('-').reverse().join('-') : ''}
//                       onChange={(e) => {
//                         const value = e.target.value;
//                         if (value) {
//                           const [year, month, day] = value.split('-');
//                           handleArrayChange('inspectionData', rowIdx, 'date', `${day}-${month}-${year}`);
//                         } else {
//                           handleArrayChange('inspectionData', rowIdx, 'date', '');
//                         }
//                       }}
//                       style={{
//                         width: '100%',
//                         border: 'none',
//                         outline: 'none',
//                         padding: '4px',
//                         backgroundColor: 'transparent',
//                         fontSize: 'inherit',
//                         color: '#000'
//                       }}
//                     />
//                   ) : row.date}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '4px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={row.operatorName}
//                       onChange={(e) => handleArrayChange('inspectionData', rowIdx, 'operatorName', e.target.value)}
//                     />
//                   ) : row.operatorName}
//                 </td>
//                 <td style={{ border: '2px solid black', padding: '4px', color: '#000' }}>
//                   {isEditing ? (
//                     <CellInput 
//                       value={row.machineNo}
//                       onChange={(e) => handleArrayChange('inspectionData', rowIdx, 'machineNo', e.target.value)}
//                     />
//                   ) : row.machineNo}
//                 </td>
//                 <td style={{ 
//                   border: '2px solid black', 
//                   padding: '4px', 
//                   textAlign: 'center',
//                   fontWeight: 'bold',
//                   backgroundColor: row.time === 'SETUP' ? '#fffbeb' : row.time === '4HRS' ? '#eff6ff' : '#fee2e2',
//                   color: '#000'
//                 }}>
//                   {row.time}
//                 </td>
//                 {row.checks.map((check, checkIdx) => (
//                   <td key={checkIdx} style={{ border: '2px solid black', padding: '4px', textAlign: 'center', color: '#000' }}>
//                     {isEditing ? (
//                       <CellInput 
//                         value={check}
//                         onChange={(e) => handleCheckChange(rowIdx, checkIdx, e.target.value)}
//                         style={{ textAlign: 'center' }}
//                       />
//                     ) : check}
//                   </td>
//                 ))}
//                 <td style={{ border: '2px solid black', padding: '4px', color: '#000' }}></td>
//                 <td style={{ border: '2px solid black', padding: '4px', color: '#000' }}></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Footer */}
//         <div style={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           marginTop: '25px',
//           fontSize: '12px',
//           fontWeight: 'bold',
//           color: '#000'
//         }}>
//           <div>PREPARED BY: _________________________________</div>
//           <div>APPROVED BY: _________________________________</div>
//         </div>

//       </div>

//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//           body { 
//             margin: 0; 
//             padding: 0; 
//           }
//           @page { 
//             size: A3 landscape; 
//             margin: 10mm; 
//           }
//         }
//         input:focus { 
//           outline: 2px solid #3b82f6; 
//           outline-offset: -2px; 
//           border-radius: 2px;
//         }
//       `}</style>

//     </div>
//   );
// };

// export default PatrolInspectionExact;


// import React, { useState, useEffect, useRef } from 'react';
// import { ArrowLeft, Printer, Trash2, Save } from 'lucide-react';

// // Input Component (Jo table ke cell jaisa dikhega)
// const CellInput = ({ value, onChange, align = 'left', placeholder = '' }) => (
//   <input
//     type="text"
//     value={value}
//     onChange={onChange}
//     placeholder={placeholder}
//     style={{
//       width: '100%',
//       height: '100%',
//       border: 'none',
//       outline: 'none',
//       padding: '2px 4px',
//       backgroundColor: 'transparent', 
//       fontSize: 'inherit',
//       fontWeight: 'inherit',
//       color: 'inherit',
//       textAlign: align,
//       cursor: 'text'
//     }}
//     onFocus={(e) => e.target.style.backgroundColor = '#f0f9ff'} // Click karne pe light blue color
//     onBlur={(e) => e.target.style.backgroundColor = 'transparent'}
//   />
// );

// const PatrolInspectionAutoSave = () => {
//   const printRef = useRef();

//   // --- 1. INITIAL STATE (With Local Storage Check) ---
//   const [formData, setFormData] = useState(() => {
//     // Check agar purana data save hai browser mein
//     const savedData = localStorage.getItem('atomOneReportData');
//     return savedData ? JSON.parse(savedData) : {
//       docNo: 'AOT-F-QA-15',
//       revisionNo: '00',
//       date: '14-10-2024',
//       partName: '',
//       partNumber: '',
//       operationName: '',
//       customerName: '',
      
//       productItems: Array(14).fill(null).map((_, i) => ({
//         srNo: i + 1, inspItem: '', specialChar: '', spec: '', tolerance: '', inst: ''
//       })),
      
//       processItems: Array(14).fill(null).map((_, i) => ({
//         srNo: i + 1, inspItem: '', spec: '', tolerance: '', inst: ''
//       })),
      
//       inspectionData: [
//         { srNo: '1', date: '', operatorName: '', machineNo: '', time: 'SETUP', checks: Array(14).fill('') },
//         { srNo: '2', date: '', operatorName: '', machineNo: '', time: '4HRS', checks: Array(14).fill('') },
//         { srNo: '3', date: '', operatorName: '', machineNo: '', time: 'LAST', checks: Array(14).fill('') },
//         { srNo: '4', date: '', operatorName: '', machineNo: '', time: 'SETUP', checks: Array(14).fill('') },
//         { srNo: '5', date: '', operatorName: '', machineNo: '', time: '4HRS', checks: Array(14).fill('') },
//         { srNo: '6', date: '', operatorName: '', machineNo: '', time: 'LAST', checks: Array(14).fill('') },
//         { srNo: '7', date: '', operatorName: '', machineNo: '', time: 'SETUP', checks: Array(14).fill('') },
//         { srNo: '8', date: '', operatorName: '', machineNo: '', time: '4HRS', checks: Array(14).fill('') },
//         { srNo: '9', date: '', operatorName: '', machineNo: '', time: 'LAST', checks: Array(14).fill('') }
//       ]
//     };
//   });

//   // --- 2. AUTO SAVE EFFECT ---
//   // Jab bhi kuch type karoge, turant browser mein save ho jayega
//   useEffect(() => {
//     localStorage.setItem('atomOneReportData', JSON.stringify(formData));
//   }, [formData]);

//   // --- HANDLERS ---
//   const handleFieldChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleArrayChange = (arrayName, index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [arrayName]: prev[arrayName].map((item, i) => 
//         i === index ? { ...item, [field]: value } : item
//       )
//     }));
//   };

//   const handleCheckChange = (rowIndex, checkIndex, value) => {
//     setFormData(prev => ({
//       ...prev,
//       inspectionData: prev.inspectionData.map((row, i) => {
//         if (i === rowIndex) {
//           const newChecks = [...row.checks];
//           newChecks[checkIndex] = value;
//           return { ...row, checks: newChecks };
//         }
//         return row;
//       })
//     }));
//   };

//   const handleInspectionFieldChange = (index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       inspectionData: prev.inspectionData.map((row, i) => 
//         i === index ? { ...row, [field]: value } : row
//       )
//     }));
//   };

//   const handleClearData = () => {
//     if(window.confirm("Are you sure you want to clear all data?")) {
//       localStorage.removeItem('atomOneReportData');
//       window.location.reload(); // Refresh to clear
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   // --- STYLES ---
//   const tableStyle = { width: '100%', borderCollapse: 'collapse', border: '2px solid black', marginBottom: '12px', tableLayout: 'fixed' };
//   const thStyle = { border: '2px solid black', padding: '8px', backgroundColor: '#c8c8c8', color: '#000', fontSize: '10px' };
//   const tdBorder = { border: '2px solid black', color: '#000', fontSize: '11px', padding: '0', height: '28px' };

//   return (
//     <div style={{ minHeight: '100vh', backgroundColor: '#e5e7eb', padding: '20px' }}>
      
//       {/* --- TOP BAR (Fixed) --- */}
//       <div className="no-print" style={{
//         display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px',
//         position: 'sticky', top: '0', backgroundColor: '#374151', padding: '15px 20px', zIndex: 1000,
//         boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '0 0 8px 8px'
//       }}>
//         <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
//           📝 AtomOne Editor (Auto-Save Active)
//         </div>

//         <div style={{ display: 'flex', gap: '12px' }}>
//            <button onClick={handleClearData} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
//             <Trash2 size={18} /> Clear Form
//           </button>
//           <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
//             <Printer size={18} /> Print Report
//           </button>
//         </div>
//       </div>

//       {/* --- A3 REPORT PAGE --- */}
//       <div style={{
//         width: '420mm', minHeight: '297mm', margin: '0 auto', backgroundColor: 'white',
//         padding: '20mm', boxShadow: '0 0 20px rgba(0,0,0,0.15)', border: '1px solid #ddd'
//       }} ref={printRef}>
        
//         {/* HEADER */}
//         <table style={tableStyle}>
//           <tbody>
//             <tr>
//               <td rowSpan={3} style={{ ...tdBorder, width: '15%', textAlign: 'center', padding: '10px' }}>
//                 <img src="/logo1.jpg" alt="ATOM ONE" style={{ maxWidth: '90%', maxHeight: '70px', objectFit: 'contain' }} />
//               </td>
//               <td rowSpan={3} style={{ ...tdBorder, padding: '20px', textAlign: 'center', fontWeight: 'bold', fontSize: '24px', width: '55%' }}>
//                 SETUP & PATROL INSPECTION REPORT
//               </td>
//               <td style={{ ...tdBorder, padding: '8px', fontWeight: 'bold', width: '12%', backgroundColor: 'white' }}>DOC.NO.</td>
//               <td style={{ ...tdBorder, width: '18%' }}>
//                 <CellInput value={formData.docNo} onChange={(e) => handleFieldChange('docNo', e.target.value)} />
//               </td>
//             </tr>
//             <tr>
//               <td style={{ ...tdBorder, padding: '8px', fontWeight: 'bold', backgroundColor: 'white' }}>REVISION NO.</td>
//               <td style={tdBorder}>
//                 <CellInput value={formData.revisionNo} onChange={(e) => handleFieldChange('revisionNo', e.target.value)} />
//               </td>
//             </tr>
//             <tr>
//               <td style={{ ...tdBorder, padding: '8px', fontWeight: 'bold', backgroundColor: 'white' }}>DATE</td>
//               <td style={tdBorder}>
//                  <input type="date" value={formData.date.split('-').reverse().join('-')} 
//                    onChange={(e) => {
//                      const val = e.target.value;
//                      if(val) {
//                        const [y, m, d] = val.split('-');
//                        handleFieldChange('date', `${d}-${m}-${y}`);
//                      }
//                    }} 
//                    style={{ width: '100%', border: 'none', outline: 'none', padding: '2px 4px', fontSize: 'inherit' }} 
//                  />
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {/* PART INFO */}
//         <table style={tableStyle}>
//           <tbody>
//             <tr>
//               <td style={{ ...tdBorder, padding: '10px', fontWeight: 'bold', backgroundColor: '#e0e0e0', width: '15%' }}>PART NAME</td>
//               <td style={{ ...tdBorder, width: '35%', backgroundColor: 'white' }}>
//                 <CellInput value={formData.partName} onChange={(e) => handleFieldChange('partName', e.target.value)} placeholder="Type Part Name..." />
//               </td>
//               <td style={{ ...tdBorder, padding: '10px', fontWeight: 'bold', backgroundColor: '#e0e0e0', width: '18%' }}>OPERATION NAME</td>
//               <td style={{ ...tdBorder, width: '32%', backgroundColor: 'white' }}>
//                 <CellInput value={formData.operationName} onChange={(e) => handleFieldChange('operationName', e.target.value)} />
//               </td>
//             </tr>
//             <tr>
//               <td style={{ ...tdBorder, padding: '10px', fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>PART NUMBER</td>
//               <td style={{ ...tdBorder, backgroundColor: 'white' }}>
//                 <CellInput value={formData.partNumber} onChange={(e) => handleFieldChange('partNumber', e.target.value)} />
//               </td>
//               <td style={{ ...tdBorder, padding: '10px', fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>CUSTOMER NAME</td>
//               <td style={{ ...tdBorder, backgroundColor: 'white' }}>
//                 <CellInput value={formData.customerName} onChange={(e) => handleFieldChange('customerName', e.target.value)} />
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {/* SPECIFICATIONS */}
//         <table style={tableStyle}>
//           <thead>
//             <tr style={{ backgroundColor: '#c8c8c8', fontWeight: 'bold' }}>
//               <th style={{ ...thStyle, width: '3%' }}>SR. NO</th>
//               <th style={{ ...thStyle, width: '12%' }}>INSP. ITEM (PRODUCT)</th>
//               <th style={{ ...thStyle, width: '8%' }}>SPECIAL CHAR.</th>
//               <th style={{ ...thStyle, width: '7%' }}>SPEC.</th>
//               <th style={{ ...thStyle, width: '7%' }}>TOLERANCE</th>
//               <th style={{ ...thStyle, width: '5%' }}>INST.</th>
              
//               <th style={{ ...thStyle, width: '3%', borderLeft: '3px solid black' }}>SR. NO</th>
//               <th style={{ ...thStyle, width: '12%' }}>INSP. ITEM (PROCESS)</th>
//               <th style={{ ...thStyle, width: '7%' }}>SPEC.</th>
//               <th style={{ ...thStyle, width: '7%' }}>TOLERANCE</th>
//               <th style={{ ...thStyle, width: '5%' }}>INST.</th>
//             </tr>
//           </thead>
//           <tbody>
//             {formData.productItems.map((item, i) => (
//               <tr key={i} style={{ height: '35px' }}>
//                 {/* Product Side */}
//                 <td style={{ ...tdBorder, textAlign: 'center' }}>
//                    <CellInput value={item.srNo} align="center" onChange={(e) => handleArrayChange('productItems', i, 'srNo', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput value={item.inspItem} onChange={(e) => handleArrayChange('productItems', i, 'inspItem', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput value={item.specialChar} onChange={(e) => handleArrayChange('productItems', i, 'specialChar', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput value={item.spec} align="center" onChange={(e) => handleArrayChange('productItems', i, 'spec', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput value={item.tolerance} align="center" onChange={(e) => handleArrayChange('productItems', i, 'tolerance', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput value={item.inst} align="center" onChange={(e) => handleArrayChange('productItems', i, 'inst', e.target.value)} />
//                 </td>

//                 {/* Process Side */}
//                 <td style={{ ...tdBorder, textAlign: 'center', borderLeft: '3px solid black' }}>
//                    <CellInput value={formData.processItems[i].srNo} align="center" onChange={(e) => handleArrayChange('processItems', i, 'srNo', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput value={formData.processItems[i].inspItem} onChange={(e) => handleArrayChange('processItems', i, 'inspItem', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput value={formData.processItems[i].spec} align="center" onChange={(e) => handleArrayChange('processItems', i, 'spec', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput value={formData.processItems[i].tolerance} align="center" onChange={(e) => handleArrayChange('processItems', i, 'tolerance', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput value={formData.processItems[i].inst} align="center" onChange={(e) => handleArrayChange('processItems', i, 'inst', e.target.value)} />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* INSPECTION LOGS */}
//         <table style={{ ...tableStyle, fontSize: '9px' }}>
//           <thead>
//             <tr style={{ backgroundColor: '#c8c8c8', fontWeight: 'bold' }}>
//               <th style={{ ...thStyle, width: '2.5%' }}>SR</th>
//               <th style={{ ...thStyle, width: '5%' }}>DATE</th>
//               <th style={{ ...thStyle, width: '8%' }}>OPERATOR</th>
//               <th style={{ ...thStyle, width: '5%' }}>M/C NO</th>
//               <th style={{ ...thStyle, width: '4%' }}>TIME</th>
//               {[...Array(14)].map((_, n) => (
//                 <th key={n} style={{ ...thStyle, width: '2.5%' }}>{n + 1}</th>
//               ))}
//               <th style={{ ...thStyle, width: '6%' }}>JDG</th>
//               <th style={{ ...thStyle, width: '6%' }}>SIGN</th>
//             </tr>
//           </thead>
//           <tbody>
//             {formData.inspectionData.map((row, rowIdx) => (
//               <tr key={rowIdx} style={{ height: '30px' }}>
//                 <td style={{ ...tdBorder, textAlign: 'center' }}>
//                    <CellInput value={row.srNo} align="center" onChange={(e) => handleInspectionFieldChange(rowIdx, 'srNo', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                   <input type="date" style={{ width: '100%', border: 'none', outline: 'none', fontSize: '9px', background: 'transparent' }} 
//                     value={row.date ? row.date.split('-').reverse().join('-') : ''}
//                     onChange={(e) => {
//                       const val = e.target.value;
//                       if(val) { const [y,m,d] = val.split('-'); handleInspectionFieldChange(rowIdx, 'date', `${d}-${m}-${y}`); }
//                       else handleInspectionFieldChange(rowIdx, 'date', '');
//                     }} 
//                   />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput value={row.operatorName} onChange={(e) => handleInspectionFieldChange(rowIdx, 'operatorName', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput value={row.machineNo} align="center" onChange={(e) => handleInspectionFieldChange(rowIdx, 'machineNo', e.target.value)} />
//                 </td>
//                 <td style={{ ...tdBorder, textAlign: 'center', fontWeight: 'bold', backgroundColor: row.time === 'SETUP' ? '#fffbeb' : row.time === '4HRS' ? '#eff6ff' : '#fee2e2' }}>
//                    {row.time}
//                 </td>
//                 {row.checks.map((check, checkIdx) => (
//                   <td key={checkIdx} style={tdBorder}>
//                      <CellInput value={check} align="center" onChange={(e) => handleCheckChange(rowIdx, checkIdx, e.target.value)} />
//                   </td>
//                 ))}
//                 <td style={tdBorder}></td>
//                 <td style={tdBorder}></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Footer */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', fontSize: '12px', fontWeight: 'bold', color: '#000' }}>
//           <div>PREPARED BY: _________________________________</div>
//           <div>APPROVED BY: _________________________________</div>
//         </div>

//       </div>

//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//           body { margin: 0; padding: 0; background: white; }
//           @page { size: A3 landscape; margin: 10mm; }
//           input { 
//              /* Print mein inputs text jaise dikhenge */
//              border: none !important; 
//              background: transparent !important; 
//              padding: 0 !important;
//           }
//           /* Hide placeholders in print */
//           input::placeholder { color: transparent; }
//         }
//       `}</style>

//     </div>
//   );
// };

// export default PatrolInspectionAutoSave;



// import React, { useState, useRef } from 'react';
// import { ArrowLeft, Edit, Save, Printer, X } from 'lucide-react';

// // ✅ 1. Input Component ko bahar nikal diya taaki typing smooth rahe (Most Important Fix)
// const CellInput = ({ value, onChange, isEditing, align = 'left', type = 'text' }) => {
//   if (!isEditing) {
//     return (
//       <div style={{ 
//         width: '100%', 
//         height: '100%', 
//         minHeight: '20px', 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: align === 'center' ? 'center' : 'flex-start',
//         padding: '2px 4px',
//         wordBreak: 'break-word' 
//       }}>
//         {value}
//       </div>
//     );
//   }

//   return (
//     <input
//       type={type}
//       value={value}
//       onChange={onChange}
//       style={{
//         width: '100%',
//         height: '100%',
//         border: 'none',
//         outline: '2px solid #3b82f6', // Edit karte waqt blue border dikhega
//         padding: '2px 4px',
//         backgroundColor: '#f0f9ff', // Edit karte waqt halka blue background
//         fontSize: 'inherit',
//         fontWeight: 'inherit',
//         color: 'inherit',
//         textAlign: align,
//       }}
//     />
//   );
// };

// const PatrolInspectionFinal = () => {
//   const printRef = useRef();
  
//   // ✅ 2. Edit Mode State (Default OFF)
//   const [isEditing, setIsEditing] = useState(false); 

//   const [formData, setFormData] = useState({
//     docNo: 'AOT-F-QA-15',
//     revisionNo: '00',
//     date: '14-10-2024',
//     partName: '',
//     partNumber: '',
//     operationName: '',
//     customerName: '',
    
//     // 14 Rows Specifications
//     productItems: Array(14).fill(null).map((_, i) => ({
//       srNo: i + 1, inspItem: '', specialChar: '', spec: '', tolerance: '', inst: ''
//     })),
    
//     processItems: Array(14).fill(null).map((_, i) => ({
//       srNo: i + 1, inspItem: '', spec: '', tolerance: '', inst: ''
//     })),
    
//     // Inspection Grid
//     inspectionData: [
//       { srNo: '1', date: '', operatorName: '', machineNo: '', time: 'SETUP', checks: Array(14).fill('') },
//       { srNo: '2', date: '', operatorName: '', machineNo: '', time: '4HRS', checks: Array(14).fill('') },
//       { srNo: '3', date: '', operatorName: '', machineNo: '', time: 'LAST', checks: Array(14).fill('') },
//       { srNo: '4', date: '', operatorName: '', machineNo: '', time: 'SETUP', checks: Array(14).fill('') },
//       { srNo: '5', date: '', operatorName: '', machineNo: '', time: '4HRS', checks: Array(14).fill('') },
//       { srNo: '6', date: '', operatorName: '', machineNo: '', time: 'LAST', checks: Array(14).fill('') },
//       { srNo: '7', date: '', operatorName: '', machineNo: '', time: 'SETUP', checks: Array(14).fill('') },
//       { srNo: '8', date: '', operatorName: '', machineNo: '', time: '4HRS', checks: Array(14).fill('') },
//       { srNo: '9', date: '', operatorName: '', machineNo: '', time: 'LAST', checks: Array(14).fill('') }
//     ]
//   });

//   // --- HANDLERS ---
//   const handleFieldChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleArrayChange = (arrayName, index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [arrayName]: prev[arrayName].map((item, i) => 
//         i === index ? { ...item, [field]: value } : item
//       )
//     }));
//   };

//   const handleCheckChange = (rowIndex, checkIndex, value) => {
//     setFormData(prev => ({
//       ...prev,
//       inspectionData: prev.inspectionData.map((row, i) => {
//         if (i === rowIndex) {
//           const newChecks = [...row.checks];
//           newChecks[checkIndex] = value;
//           return { ...row, checks: newChecks };
//         }
//         return row;
//       })
//     }));
//   };

//   const handleInspectionChange = (index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       inspectionData: prev.inspectionData.map((row, i) => 
//         i === index ? { ...row, [field]: value } : row
//       )
//     }));
//   };

//   const handleSave = () => {
//     setIsEditing(false); // Edit mode band
//     alert("✅ Data Saved Successfully!");
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   // --- STYLES ---
//   const tableStyle = { width: '100%', borderCollapse: 'collapse', border: '2px solid black', marginBottom: '12px', tableLayout: 'fixed' };
//   const thStyle = { border: '2px solid black', padding: '5px', backgroundColor: '#c8c8c8', color: '#000', fontSize: '10px', textAlign: 'center' };
//   const tdBorder = { border: '2px solid black', color: '#000', fontSize: '11px', padding: '0', height: '28px' };

//   return (
//     <div style={{ minHeight: '100vh', backgroundColor: '#e5e7eb', padding: '20px' }}>
      
//       {/* --- ACTION BAR (Buttons) --- */}
//       <div className="no-print" style={{
//         display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px',
//         position: 'sticky', top: '20px', backgroundColor: '#e5e7eb', padding: '10px 0', zIndex: 1000
//       }}>
//         <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#374151' }}>
//            AtomOne Report System
//         </div>

//         <div style={{ display: 'flex', gap: '12px' }}>
//           {!isEditing ? (
//             // Jab Editing Band ho
//             <>
//               <button onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
//                 <Edit size={18} /> Edit Data
//               </button>
//               <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
//                 <Printer size={18} /> Print
//               </button>
//             </>
//           ) : (
//             // Jab Editing Chalu ho
//             <>
//               <button onClick={() => setIsEditing(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
//                 <X size={18} /> Cancel
//               </button>
//               <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
//                 <Save size={18} /> Save Data
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* --- REPORT SHEET (A3) --- */}
//       <div style={{
//         width: '420mm', minHeight: '297mm', margin: '0 auto', backgroundColor: 'white',
//         padding: '20mm', boxShadow: '0 0 20px rgba(0,0,0,0.15)', border: '1px solid #ddd'
//       }} ref={printRef}>
        
//         {/* Header Table */}
//         <table style={tableStyle}>
//           <tbody>
//             <tr>
//               <td rowSpan={3} style={{ ...tdBorder, width: '15%', textAlign: 'center', padding: '10px' }}>
//                 <img src="/logo1.jpg" alt="ATOM ONE" style={{ maxWidth: '90%', maxHeight: '70px', objectFit: 'contain' }} />
//               </td>
//               <td rowSpan={3} style={{ ...tdBorder, padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '24px', width: '55%' }}>
//                 SETUP & PATROL INSPECTION REPORT
//               </td>
//               <td style={{ ...tdBorder, padding: '5px', fontWeight: 'bold', width: '12%', backgroundColor: 'white' }}>DOC.NO.</td>
//               <td style={{ ...tdBorder, width: '18%' }}>
//                 <CellInput isEditing={isEditing} value={formData.docNo} onChange={(e) => handleFieldChange('docNo', e.target.value)} />
//               </td>
//             </tr>
//             <tr>
//               <td style={{ ...tdBorder, padding: '5px', fontWeight: 'bold', backgroundColor: 'white' }}>REVISION NO.</td>
//               <td style={tdBorder}>
//                 <CellInput isEditing={isEditing} value={formData.revisionNo} onChange={(e) => handleFieldChange('revisionNo', e.target.value)} />
//               </td>
//             </tr>
//             <tr>
//               <td style={{ ...tdBorder, padding: '5px', fontWeight: 'bold', backgroundColor: 'white' }}>DATE</td>
//               <td style={tdBorder}>
//                 <CellInput isEditing={isEditing} type="text" value={formData.date} onChange={(e) => handleFieldChange('date', e.target.value)} />
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {/* Part Info Table */}
//         <table style={tableStyle}>
//           <tbody>
//             <tr>
//               <td style={{ ...tdBorder, padding: '8px', fontWeight: 'bold', backgroundColor: '#e0e0e0', width: '15%' }}>PART NAME</td>
//               <td style={{ ...tdBorder, width: '35%' }}>
//                 <CellInput isEditing={isEditing} value={formData.partName} onChange={(e) => handleFieldChange('partName', e.target.value)} />
//               </td>
//               <td style={{ ...tdBorder, padding: '8px', fontWeight: 'bold', backgroundColor: '#e0e0e0', width: '18%' }}>OPERATION NAME</td>
//               <td style={{ ...tdBorder, width: '32%' }}>
//                 <CellInput isEditing={isEditing} value={formData.operationName} onChange={(e) => handleFieldChange('operationName', e.target.value)} />
//               </td>
//             </tr>
//             <tr>
//               <td style={{ ...tdBorder, padding: '8px', fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>PART NUMBER</td>
//               <td style={tdBorder}>
//                 <CellInput isEditing={isEditing} value={formData.partNumber} onChange={(e) => handleFieldChange('partNumber', e.target.value)} />
//               </td>
//               <td style={{ ...tdBorder, padding: '8px', fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>CUSTOMER NAME</td>
//               <td style={tdBorder}>
//                 <CellInput isEditing={isEditing} value={formData.customerName} onChange={(e) => handleFieldChange('customerName', e.target.value)} />
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {/* Specifications Table */}
//         <table style={tableStyle}>
//           <thead>
//             <tr style={{ backgroundColor: '#c8c8c8', fontWeight: 'bold' }}>
//               <th style={{ ...thStyle, width: '3%' }}>SR. NO</th>
//               <th style={{ ...thStyle, width: '12%' }}>INSP. ITEM (PRODUCT)</th>
//               <th style={{ ...thStyle, width: '8%' }}>SPECIAL CHAR.</th>
//               <th style={{ ...thStyle, width: '7%' }}>SPEC.</th>
//               <th style={{ ...thStyle, width: '7%' }}>TOLERANCE</th>
//               <th style={{ ...thStyle, width: '5%' }}>INST.</th>
              
//               <th style={{ ...thStyle, width: '3%', borderLeft: '3px solid black' }}>SR. NO</th>
//               <th style={{ ...thStyle, width: '12%' }}>INSP. ITEM (PROCESS)</th>
//               <th style={{ ...thStyle, width: '7%' }}>SPEC.</th>
//               <th style={{ ...thStyle, width: '7%' }}>TOLERANCE</th>
//               <th style={{ ...thStyle, width: '5%' }}>INST.</th>
//             </tr>
//           </thead>
//           <tbody>
//             {formData.productItems.map((item, i) => (
//               <tr key={i} style={{ height: '35px' }}>
//                 <td style={{ ...tdBorder, textAlign: 'center' }}>
//                    <CellInput isEditing={isEditing} value={item.srNo} align="center" onChange={(e) => handleArrayChange('productItems', i, 'srNo', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput isEditing={isEditing} value={item.inspItem} onChange={(e) => handleArrayChange('productItems', i, 'inspItem', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput isEditing={isEditing} value={item.specialChar} onChange={(e) => handleArrayChange('productItems', i, 'specialChar', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput isEditing={isEditing} value={item.spec} align="center" onChange={(e) => handleArrayChange('productItems', i, 'spec', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput isEditing={isEditing} value={item.tolerance} align="center" onChange={(e) => handleArrayChange('productItems', i, 'tolerance', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput isEditing={isEditing} value={item.inst} align="center" onChange={(e) => handleArrayChange('productItems', i, 'inst', e.target.value)} />
//                 </td>

//                 {/* Process Side */}
//                 <td style={{ ...tdBorder, textAlign: 'center', borderLeft: '3px solid black' }}>
//                    <CellInput isEditing={isEditing} value={formData.processItems[i].srNo} align="center" onChange={(e) => handleArrayChange('processItems', i, 'srNo', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput isEditing={isEditing} value={formData.processItems[i].inspItem} onChange={(e) => handleArrayChange('processItems', i, 'inspItem', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput isEditing={isEditing} value={formData.processItems[i].spec} align="center" onChange={(e) => handleArrayChange('processItems', i, 'spec', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput isEditing={isEditing} value={formData.processItems[i].tolerance} align="center" onChange={(e) => handleArrayChange('processItems', i, 'tolerance', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput isEditing={isEditing} value={formData.processItems[i].inst} align="center" onChange={(e) => handleArrayChange('processItems', i, 'inst', e.target.value)} />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Inspection Grid */}
//         <table style={{ ...tableStyle, fontSize: '9px' }}>
//           <thead>
//             <tr style={{ backgroundColor: '#c8c8c8', fontWeight: 'bold' }}>
//               <th style={{ ...thStyle, width: '2.5%' }}>SR</th>
//               <th style={{ ...thStyle, width: '5%' }}>DATE</th>
//               <th style={{ ...thStyle, width: '8%' }}>OPERATOR</th>
//               <th style={{ ...thStyle, width: '5%' }}>M/C NO</th>
//               <th style={{ ...thStyle, width: '4%' }}>TIME</th>
//               {[...Array(14)].map((_, n) => (
//                 <th key={n} style={{ ...thStyle, width: '2.5%' }}>{n + 1}</th>
//               ))}
//               <th style={{ ...thStyle, width: '6%' }}>JDG</th>
//               <th style={{ ...thStyle, width: '6%' }}>SIGN</th>
//             </tr>
//           </thead>
//           <tbody>
//             {formData.inspectionData.map((row, rowIdx) => (
//               <tr key={rowIdx} style={{ height: '30px' }}>
//                 <td style={{ ...tdBorder, textAlign: 'center' }}>
//                    <CellInput isEditing={isEditing} value={row.srNo} align="center" onChange={(e) => handleInspectionChange(rowIdx, 'srNo', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput isEditing={isEditing} value={row.date} onChange={(e) => handleInspectionChange(rowIdx, 'date', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput isEditing={isEditing} value={row.operatorName} onChange={(e) => handleInspectionChange(rowIdx, 'operatorName', e.target.value)} />
//                 </td>
//                 <td style={tdBorder}>
//                    <CellInput isEditing={isEditing} value={row.machineNo} align="center" onChange={(e) => handleInspectionChange(rowIdx, 'machineNo', e.target.value)} />
//                 </td>
//                 <td style={{ ...tdBorder, textAlign: 'center', fontWeight: 'bold', backgroundColor: row.time === 'SETUP' ? '#fffbeb' : row.time === '4HRS' ? '#eff6ff' : '#fee2e2' }}>
//                    {row.time}
//                 </td>
//                 {row.checks.map((check, checkIdx) => (
//                   <td key={checkIdx} style={tdBorder}>
//                      <CellInput isEditing={isEditing} value={check} align="center" onChange={(e) => handleCheckChange(rowIdx, checkIdx, e.target.value)} />
//                   </td>
//                 ))}
//                 <td style={tdBorder}></td>
//                 <td style={tdBorder}></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Footer */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', fontSize: '12px', fontWeight: 'bold', color: '#000' }}>
//           <div>PREPARED BY: _________________________________</div>
//           <div>APPROVED BY: _________________________________</div>
//         </div>

//       </div>

//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//           body { margin: 0; padding: 0; background: white; }
//           @page { size: A3 landscape; margin: 10mm; }
//           /* Print mein input ki border hatani hai agar edit mode on reh gaya toh */
//           input { border: none !important; outline: none !important; background: transparent !important; }
//         }
//       `}</style>

//     </div>
//   );
// };

// export default PatrolInspectionFinal;



// import React, { useState, useRef, useMemo } from 'react';
// import { ArrowLeft, Edit, Save, Printer, X, Database, CheckCircle } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// // --- 1. MASTER DATA (Part List) ---
// const MASTER_DATA = [
//   { customer: "FIG", model: "K12M", partName: "OUTLET PIPE", opName: "BLANKING", partNo: "68P00-S310060" },
//   { customer: "FIG", model: "K12M", partName: "INLET PIPE", opName: "BLANKING", partNo: "68P00-S310050" },
//   { customer: "FIG", model: "K12M", partName: "INLET PIPE", opName: "PUNCHING", partNo: "68P00-S310050" },
//   { customer: "FIG", model: "YED", partName: "INLET PIPE (YED)", opName: "PUNCHING", partNo: "66R00-S310060" },
//   { customer: "FIG", model: "YED", partName: "STAY MTG 3", opName: "V BENDING", partNo: "55R00-X300110" },
//   { customer: "Tenneco", model: "YTA", partName: "LOWER SPRING SEAT", opName: "OUTER BENDING", partNo: "M02040815" },
//   // ... (Baki sare parts jo pehle the wo yahan rahenge)
// ];

// // --- 2. TEMPLATES (Ye Data Image se uthaya hai) ---
// const INSPECTION_TEMPLATES = {
//   "INLET PIPE_BLANKING": {
//     product: [
//       { inspItem: "APPEARANCE", specialChar: "", spec: "NO BURR/DENT", tolerance: "", inst: "VISUAL" },
//       { inspItem: "WIDTH", specialChar: "◇", spec: "115.40 mm", tolerance: "± 0.08", inst: "VERNIER" },
//       { inspItem: "LENGTH", specialChar: "◇", spec: "485.00 mm", tolerance: "± 0.5", inst: "VERNIER" },
//       { inspItem: "THICKNESS", specialChar: "", spec: "2.0 mm", tolerance: "± 0.1", inst: "MICROMETER" },
//       { inspItem: "DIMENSIONS A", specialChar: "", spec: "25.5 mm", tolerance: "± 0.2", inst: "VERNIER" },
//       { inspItem: "DIMENSIONS B", specialChar: "", spec: "5.5 mm", tolerance: "± 0.2", inst: "VERNIER" },
//       { inspItem: "RADIUS", specialChar: "", spec: "R 2.5", tolerance: "", inst: "RADIUS GAUGE" },
//       { inspItem: "BLANK PROFILE", specialChar: "", spec: "AS PER TOOL", tolerance: "", inst: "TEMPLATE" }
//     ],
//     process: [
//       { inspItem: "SHUT HEIGHT", spec: "400", tolerance: "± 0.5", inst: "DIGITAL" },
//       { inspItem: "BALANCER PRESSURE", spec: "3.5-4.5 KG", tolerance: "", inst: "GAUGE" },
//       { inspItem: "CLUTCH PRESSURE", spec: "5.5 KG", tolerance: "MIN", inst: "GAUGE" },
//       { inspItem: "CUSHION PRESSURE", spec: "2.0 KG", tolerance: "MAX", inst: "GAUGE" }
//     ]
//   },
//   "OUTLET PIPE_BLANKING": {
//     product: [
//       { inspItem: "APPEARANCE", specialChar: "", spec: "NO BURR/DENT", tolerance: "", inst: "VISUAL" },
//       { inspItem: "WIDTH", specialChar: "◇", spec: "115.40 mm", tolerance: "± 0.08", inst: "VERNIER" },
//       { inspItem: "LENGTH", specialChar: "◇", spec: "350.00 mm", tolerance: "± 0.5", inst: "VERNIER" }, // Image 2 Data
//       { inspItem: "THICKNESS", specialChar: "", spec: "2.0 mm", tolerance: "± 0.1", inst: "MICROMETER" },
//       { inspItem: "DIMENSIONS", specialChar: "", spec: "25.0 mm", tolerance: "± 0.2", inst: "VERNIER" },
//       { inspItem: "RADIUS", specialChar: "", spec: "R 2.5", tolerance: "", inst: "RADIUS GAUGE" }
//     ],
//     process: [
//       { inspItem: "SHUT HEIGHT", spec: "330", tolerance: "± 0.5", inst: "DIGITAL" },
//       { inspItem: "BALANCER PRESSURE", spec: "3.5 KG", tolerance: "", inst: "GAUGE" }
//     ]
//   }
// };

// // --- 3. INPUT COMPONENT ---
// const CellInput = ({ value, onChange, isEditing, align = 'left', type = 'text' }) => {
//   if (!isEditing) {
//     return (
//       <div style={{ 
//         width: '100%', height: '100%', minHeight: '20px', 
//         display: 'flex', alignItems: 'center', justifyContent: align === 'center' ? 'center' : 'flex-start',
//         padding: '2px 4px', wordBreak: 'break-word', fontSize: 'inherit' 
//       }}>
//         {value}
//       </div>
//     );
//   }
//   return (
//     <input
//       type={type}
//       value={value}
//       onChange={onChange}
//       style={{
//         width: '100%', height: '100%', border: 'none',
//         outline: '2px solid #3b82f6', padding: '2px 4px',
//         backgroundColor: '#f0f9ff', fontSize: 'inherit',
//         fontWeight: 'inherit', color: 'inherit', textAlign: align,
//       }}
//     />
//   );
// };

// // --- 4. POPUP MODAL STYLES ---
// const modalOverlayStyle = {
//   position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
//   backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
// };
// const modalContentStyle = {
//   backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '450px',
//   boxShadow: '0 10px 25px rgba(0,0,0,0.2)', borderTop: '6px solid #2563eb'
// };
// const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#374151' };
// const selectStyle = { 
//   width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', 
//   marginBottom: '15px', fontSize: '14px', color: '#000000', backgroundColor: '#ffffff' 
// };

// const PatrolInspectionFinal = () => {
//   const printRef = useRef();
//   const navigate = useNavigate();
  
//   // States
//   const [isEditing, setIsEditing] = useState(false); 
//   const [showModal, setShowModal] = useState(false);

//   // Modal Selection States
//   const [tempCust, setTempCust] = useState('');
//   const [tempPart, setTempPart] = useState('');
//   const [tempOp, setTempOp] = useState('');
//   const [tempPartNo, setTempPartNo] = useState('');

//   const [formData, setFormData] = useState({
//     docNo: 'AOT-F-QA-15', revisionNo: '00', date: '14-10-2024',
//     partName: '', partNumber: '', operationName: '', customerName: '',
    
//     productItems: Array(14).fill(null).map((_, i) => ({ srNo: i + 1, inspItem: '', specialChar: '', spec: '', tolerance: '', inst: '' })),
//     processItems: Array(14).fill(null).map((_, i) => ({ srNo: i + 1, inspItem: '', spec: '', tolerance: '', inst: '' })),
    
//     // Inspection Grid
//     inspectionData: Array(9).fill(null).map((_, i) => ({
//       srNo: i < 3 ? '1' : i < 6 ? '2' : '3', 
//       date: '', operatorName: '', machineNo: '', 
//       time: i % 3 === 0 ? 'SETUP' : i % 3 === 1 ? '4HRS' : 'LAST', 
//       checks: Array(14).fill('')
//     }))
//   });

//   // --- FILTER LOGIC ---
//   const uniqueCustomers = useMemo(() => [...new Set(MASTER_DATA.map(d => d.customer))].sort(), []);

//   const filteredParts = useMemo(() => {
//     if (!tempCust) return [];
//     return [...new Set(MASTER_DATA.filter(d => d.customer === tempCust).map(d => d.partName))].sort();
//   }, [tempCust]);

//   const filteredOps = useMemo(() => {
//     if (!tempCust || !tempPart) return [];
//     return [...new Set(MASTER_DATA.filter(d => d.customer === tempCust && d.partName === tempPart).map(d => d.opName))].sort();
//   }, [tempCust, tempPart]);

//   // --- HANDLERS ---
//   const onCustSelect = (e) => {
//     setTempCust(e.target.value);
//     setTempPart(''); setTempOp(''); setTempPartNo('');
//   };

//   const onPartSelect = (e) => {
//     const val = e.target.value;
//     setTempPart(val);
//     setTempOp('');
//     const found = MASTER_DATA.find(d => d.customer === tempCust && d.partName === val);
//     setTempPartNo(found ? found.partNo : '');
//   };

//   // 🔥 THIS IS THE MAGIC FUNCTION (AUTO FILL FROM TEMPLATE) 🔥
//   const handleApplyData = () => {
//     // 1. Key banao (Part + Op)
//     const key = `${tempPart}_${tempOp}`;
    
//     // 2. Template dhoondo
//     const template = INSPECTION_TEMPLATES[key];

//     // 3. Naya Data taiyaar karo
//     let newProductItems = Array(14).fill(null).map((_, i) => ({ srNo: i + 1, inspItem: '', specialChar: '', spec: '', tolerance: '', inst: '' }));
//     let newProcessItems = Array(14).fill(null).map((_, i) => ({ srNo: i + 1, inspItem: '', spec: '', tolerance: '', inst: '' }));

//     if (template) {
//         // Agar Template mila, toh spec bhar do
//         template.product.forEach((item, i) => {
//             if(i < 14) newProductItems[i] = { ...newProductItems[i], ...item };
//         });
//         template.process.forEach((item, i) => {
//             if(i < 14) newProcessItems[i] = { ...newProcessItems[i], ...item };
//         });
//     }

//     // 4. Form update karo
//     setFormData(prev => ({
//       ...prev,
//       customerName: tempCust,
//       partName: tempPart,
//       partNumber: tempPartNo,
//       operationName: tempOp,
//       productItems: newProductItems, // Table Bhar jayega
//       processItems: newProcessItems  // Table Bhar jayega
//     }));

//     setShowModal(false);
//   };

//   const handleFieldChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
//   const handleArrayChange = (arr, idx, field, val) => setFormData(prev => ({ ...prev, [arr]: prev[arr].map((item, i) => i === idx ? { ...item, [field]: val } : item) }));
  
//   const handleMergedChange = (startIndex, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       inspectionData: prev.inspectionData.map((row, i) => {
//         if (i >= startIndex && i < startIndex + 3) return { ...row, [field]: value };
//         return row;
//       })
//     }));
//   };

//   const handleCheckChange = (rIdx, cIdx, val) => setFormData(prev => ({ ...prev, inspectionData: prev.inspectionData.map((row, i) => i === rIdx ? { ...row, checks: [...row.checks.slice(0, cIdx), val, ...row.checks.slice(cIdx + 1)] } : row) }));
  
//   const handleSave = () => { setIsEditing(false); alert("✅ Data Saved!"); };
//   const handlePrint = () => window.print();

//   // --- STYLES ---
//   const tableStyle = { width: '100%', borderCollapse: 'collapse', border: '2px solid black', marginBottom: '12px', tableLayout: 'fixed' };
//   const thStyle = { border: '2px solid black', padding: '5px', backgroundColor: '#c8c8c8', color: '#000', fontSize: '10px', textAlign: 'center' };
//   const tdBorder = { border: '2px solid black', color: '#000', fontSize: '11px', padding: '0', height: '28px' };
//   const thickBottomBorder = { borderBottom: '2px solid black' }; // Bold Divider

//   return (
//     <div style={{ minHeight: '100vh', backgroundColor: '#e5e7eb', padding: '20px' }}>
      
//       {/* --- ACTION BAR --- */}
//       <div className="no-print" style={{
//         display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px',
//         position: 'sticky', top: '20px', backgroundColor: '#e5e7eb', padding: '10px 0', zIndex: 1000
//       }}>
//         <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#374151', display: 'flex', alignItems: 'center', gap: '10px' }}>
//            <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><ArrowLeft /></button>
//            AtomOne Report System
//         </div>

//         <div style={{ display: 'flex', gap: '12px' }}>
//           {!isEditing ? (
//             <>
//               <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
//                 <Database size={18} /> Fill Info
//               </button>
//               <button onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
//                 <Edit size={18} /> Edit Data
//               </button>
//               <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
//                 <Printer size={18} /> Print
//               </button>
//             </>
//           ) : (
//             <>
//               <button onClick={() => setIsEditing(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
//                 <X size={18} /> Cancel
//               </button>
//               <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
//                 <Save size={18} /> Save Data
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* --- POPUP FORM --- */}
//       {showModal && (
//         <div style={modalOverlayStyle}>
//           <div style={modalContentStyle}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//               <h3 style={{ margin: 0, color: '#1e40af' }}>Select Info from DB</h3>
//               <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><X size={24} /></button>
//             </div>

//             <label style={labelStyle}>1. Select Customer</label>
//             <select value={tempCust} onChange={onCustSelect} style={selectStyle}>
//               <option value="">-- Choose Customer --</option>
//               {uniqueCustomers.map(c => <option key={c} value={c}>{c}</option>)}
//             </select>

//             <label style={labelStyle}>2. Select Part Name</label>
//             <select value={tempPart} onChange={onPartSelect} style={selectStyle} disabled={!tempCust}>
//               <option value="">-- Choose Part --</option>
//               {filteredParts.map(p => <option key={p} value={p}>{p}</option>)}
//             </select>

//             <label style={labelStyle}>3. Select Operation</label>
//             <select value={tempOp} onChange={(e) => setTempOp(e.target.value)} style={selectStyle} disabled={!tempPart}>
//               <option value="">-- Choose Operation --</option>
//               {filteredOps.map(op => <option key={op} value={op}>{op}</option>)}
//             </select>

//             {tempPartNo && (
//                <div style={{ marginBottom: '15px', padding: '10px', background: '#f3f4f6', borderRadius: '4px', border: '1px dashed #999', color: '#333' }}>
//                  <strong>Part No:</strong> {tempPartNo}
//                </div>
//             )}

//             <button onClick={handleApplyData} disabled={!tempCust || !tempPart} style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '8px' }}>
//               <CheckCircle size={20} /> Apply to Report
//             </button>
//           </div>
//         </div>
//       )}

//       {/* --- A3 REPORT SHEET --- */}
//       <div style={{
//         width: '420mm', minHeight: '297mm', margin: '0 auto', backgroundColor: 'white',
//         padding: '20mm', boxShadow: '0 0 20px rgba(0,0,0,0.15)', border: '1px solid #ddd'
//       }} ref={printRef}>
        
//         {/* Header Table */}
//         <table style={tableStyle}>
//           <tbody>
//             <tr>
//               <td rowSpan={3} style={{ ...tdBorder, width: '15%', textAlign: 'center', padding: '10px' }}>
//                 <img src="/logo1.jpg" alt="ATOM ONE" style={{ maxWidth: '90%', maxHeight: '70px', objectFit: 'contain' }} />
//               </td>
//               <td rowSpan={3} style={{ ...tdBorder, padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '24px', width: '55%' }}>
//                 SETUP & PATROL INSPECTION REPORT
//               </td>
//               <td style={{ ...tdBorder, padding: '5px', fontWeight: 'bold', width: '12%', backgroundColor: 'white' }}>DOC.NO.</td>
//               <td style={{ ...tdBorder, width: '18%' }}>
//                 <CellInput isEditing={isEditing} value={formData.docNo} onChange={(e) => handleFieldChange('docNo', e.target.value)} />
//               </td>
//             </tr>
//             <tr>
//               <td style={{ ...tdBorder, padding: '5px', fontWeight: 'bold', backgroundColor: 'white' }}>REVISION NO.</td>
//               <td style={tdBorder}>
//                 <CellInput isEditing={isEditing} value={formData.revisionNo} onChange={(e) => handleFieldChange('revisionNo', e.target.value)} />
//               </td>
//             </tr>
//             <tr>
//               <td style={{ ...tdBorder, padding: '5px', fontWeight: 'bold', backgroundColor: 'white' }}>DATE</td>
//               <td style={tdBorder}>
//                 <CellInput isEditing={isEditing} type="text" value={formData.date} onChange={(e) => handleFieldChange('date', e.target.value)} />
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {/* Part Info Table */}
//         <table style={tableStyle}>
//           <tbody>
//             <tr>
//               <td style={{ ...tdBorder, padding: '8px', fontWeight: 'bold', backgroundColor: '#e0e0e0', width: '15%' }}>PART NAME</td>
//               <td style={{ ...tdBorder, width: '35%' }}>
//                 <CellInput isEditing={isEditing} value={formData.partName} onChange={(e) => handleFieldChange('partName', e.target.value)} />
//               </td>
//               <td style={{ ...tdBorder, padding: '8px', fontWeight: 'bold', backgroundColor: '#e0e0e0', width: '18%' }}>OPERATION NAME</td>
//               <td style={{ ...tdBorder, width: '32%' }}>
//                 <CellInput isEditing={isEditing} value={formData.operationName} onChange={(e) => handleFieldChange('operationName', e.target.value)} />
//               </td>
//             </tr>
//             <tr>
//               <td style={{ ...tdBorder, padding: '8px', fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>PART NUMBER</td>
//               <td style={tdBorder}>
//                 <CellInput isEditing={isEditing} value={formData.partNumber} onChange={(e) => handleFieldChange('partNumber', e.target.value)} />
//               </td>
//               <td style={{ ...tdBorder, padding: '8px', fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>CUSTOMER NAME</td>
//               <td style={tdBorder}>
//                 <CellInput isEditing={isEditing} value={formData.customerName} onChange={(e) => handleFieldChange('customerName', e.target.value)} />
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {/* Specifications Table (AUTO FILLS NOW) */}
//         <table style={tableStyle}>
//           <thead>
//             <tr style={{ backgroundColor: '#c8c8c8', fontWeight: 'bold' }}>
//               <th style={{ ...thStyle, width: '3%' }}>SR. NO</th>
//               <th style={{ ...thStyle, width: '12%' }}>INSP. ITEM (PRODUCT)</th>
//               <th style={{ ...thStyle, width: '8%' }}>SPECIAL CHAR.</th>
//               <th style={{ ...thStyle, width: '7%' }}>SPEC.</th>
//               <th style={{ ...thStyle, width: '7%' }}>TOLERANCE</th>
//               <th style={{ ...thStyle, width: '5%' }}>INST.</th>
//               <th style={{ ...thStyle, width: '3%', borderLeft: '3px solid black' }}>SR. NO</th>
//               <th style={{ ...thStyle, width: '12%' }}>INSP. ITEM (PROCESS)</th>
//               <th style={{ ...thStyle, width: '7%' }}>SPEC.</th>
//               <th style={{ ...thStyle, width: '7%' }}>TOLERANCE</th>
//               <th style={{ ...thStyle, width: '5%' }}>INST.</th>
//             </tr>
//           </thead>
//           <tbody>
//             {formData.productItems.map((item, i) => (
//               <tr key={i} style={{ height: '35px' }}>
//                 <td style={{ ...tdBorder, textAlign: 'center' }}><CellInput isEditing={isEditing} value={item.srNo} align="center" onChange={(e) => handleArrayChange('productItems', i, 'srNo', e.target.value)} /></td>
//                 <td style={tdBorder}><CellInput isEditing={isEditing} value={item.inspItem} onChange={(e) => handleArrayChange('productItems', i, 'inspItem', e.target.value)} /></td>
//                 <td style={tdBorder}><CellInput isEditing={isEditing} value={item.specialChar} onChange={(e) => handleArrayChange('productItems', i, 'specialChar', e.target.value)} /></td>
//                 <td style={tdBorder}><CellInput isEditing={isEditing} value={item.spec} align="center" onChange={(e) => handleArrayChange('productItems', i, 'spec', e.target.value)} /></td>
//                 <td style={tdBorder}><CellInput isEditing={isEditing} value={item.tolerance} align="center" onChange={(e) => handleArrayChange('productItems', i, 'tolerance', e.target.value)} /></td>
//                 <td style={tdBorder}><CellInput isEditing={isEditing} value={item.inst} align="center" onChange={(e) => handleArrayChange('productItems', i, 'inst', e.target.value)} /></td>
//                 <td style={{ ...tdBorder, textAlign: 'center', borderLeft: '3px solid black' }}><CellInput isEditing={isEditing} value={formData.processItems[i].srNo} align="center" onChange={(e) => handleArrayChange('processItems', i, 'srNo', e.target.value)} /></td>
//                 <td style={tdBorder}><CellInput isEditing={isEditing} value={formData.processItems[i].inspItem} onChange={(e) => handleArrayChange('processItems', i, 'inspItem', e.target.value)} /></td>
//                 <td style={tdBorder}><CellInput isEditing={isEditing} value={formData.processItems[i].spec} align="center" onChange={(e) => handleArrayChange('processItems', i, 'spec', e.target.value)} /></td>
//                 <td style={tdBorder}><CellInput isEditing={isEditing} value={formData.processItems[i].tolerance} align="center" onChange={(e) => handleArrayChange('processItems', i, 'tolerance', e.target.value)} /></td>
//                 <td style={tdBorder}><CellInput isEditing={isEditing} value={formData.processItems[i].inst} align="center" onChange={(e) => handleArrayChange('processItems', i, 'inst', e.target.value)} /></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Inspection Grid (With Separator Line) */}
//         <table style={{ ...tableStyle, fontSize: '9px' }}>
//           <thead>
//             <tr style={{ backgroundColor: '#c8c8c8', fontWeight: 'bold' }}>
//               <th style={{ ...thStyle, width: '2.5%' }}>SR</th>
//               <th style={{ ...thStyle, width: '5%' }}>DATE</th>
//               <th style={{ ...thStyle, width: '8%' }}>OPERATOR</th>
//               <th style={{ ...thStyle, width: '5%' }}>M/C NO</th>
//               <th style={{ ...thStyle, width: '4%' }}>TIME</th>
//               {[...Array(14)].map((_, n) => <th key={n} style={{ ...thStyle, width: '2.5%' }}>{n + 1}</th>)}
//               <th style={{ ...thStyle, width: '6%' }}>JDG</th>
//               <th style={{ ...thStyle, width: '6%' }}>SIGN</th>
//             </tr>
//           </thead>
//           <tbody>
//             {[0, 3, 6].map((startIndex) => {
//               const setupRow = formData.inspectionData[startIndex];
//               const fourHrsRow = formData.inspectionData[startIndex + 1];
//               const lastRow = formData.inspectionData[startIndex + 2];
              
//               const mergedCellStyle = { ...tdBorder, verticalAlign: 'middle', backgroundColor: 'white', ...thickBottomBorder };
//               const lastRowStyle = { ...tdBorder, ...thickBottomBorder };

//               return (
//                 <React.Fragment key={startIndex}>
//                   <tr style={{ height: '30px' }}>
//                     <td rowSpan={3} style={{ ...mergedCellStyle, textAlign: 'center' }}><CellInput isEditing={isEditing} value={setupRow.srNo} align="center" onChange={(e) => handleMergedChange(startIndex, 'srNo', e.target.value)} /></td>
//                     <td rowSpan={3} style={mergedCellStyle}><CellInput isEditing={isEditing} value={setupRow.date} onChange={(e) => handleMergedChange(startIndex, 'date', e.target.value)} /></td>
//                     <td rowSpan={3} style={mergedCellStyle}><CellInput isEditing={isEditing} value={setupRow.operatorName} onChange={(e) => handleMergedChange(startIndex, 'operatorName', e.target.value)} /></td>
//                     <td rowSpan={3} style={mergedCellStyle}><CellInput isEditing={isEditing} value={setupRow.machineNo} align="center" onChange={(e) => handleMergedChange(startIndex, 'machineNo', e.target.value)} /></td>
//                     <td style={{ ...tdBorder, textAlign: 'center', fontWeight: 'bold', backgroundColor: '#fffbeb' }}>SETUP</td>
//                     {setupRow.checks.map((check, i) => <td key={i} style={tdBorder}><CellInput isEditing={isEditing} value={check} align="center" onChange={(e) => handleCheckChange(startIndex, i, e.target.value)} /></td>)}
//                     <td style={tdBorder}></td><td style={tdBorder}></td>
//                   </tr>
//                   <tr style={{ height: '30px' }}>
//                      <td style={{ ...tdBorder, textAlign: 'center', fontWeight: 'bold', backgroundColor: '#eff6ff' }}>4HRS</td>
//                      {fourHrsRow.checks.map((check, i) => <td key={i} style={tdBorder}><CellInput isEditing={isEditing} value={check} align="center" onChange={(e) => handleCheckChange(startIndex + 1, i, e.target.value)} /></td>)}
//                      <td style={tdBorder}></td><td style={tdBorder}></td>
//                   </tr>
//                   <tr style={{ height: '30px' }}>
//                      <td style={{ ...lastRowStyle, textAlign: 'center', fontWeight: 'bold', backgroundColor: '#fee2e2' }}>LAST</td>
//                      {lastRow.checks.map((check, i) => <td key={i} style={lastRowStyle}><CellInput isEditing={isEditing} value={check} align="center" onChange={(e) => handleCheckChange(startIndex + 2, i, e.target.value)} /></td>)}
//                      <td style={lastRowStyle}></td><td style={lastRowStyle}></td>
//                   </tr>
//                 </React.Fragment>
//               )
//             })}
//           </tbody>
//         </table>

//         {/* Footer */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', fontSize: '12px', fontWeight: 'bold', color: '#000' }}>
//           <div>PREPARED BY: _________________________________</div>
//           <div>APPROVED BY: _________________________________</div>
//         </div>

//       </div>

//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//           body { margin: 0; padding: 0; background: white; }
//           @page { size: A3 landscape; margin: 10mm; }
//           input { border: none !important; outline: none !important; background: transparent !important; }
//         }
//       `}</style>

//     </div>
//   );
// };

// export default PatrolInspectionFinal;



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

// --- 2. INSPECTION TEMPLATES (Specs Auto-Fill) ---
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

// --- 4. STYLES ---
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const modalContentStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', borderTop: '6px solid #2563eb' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' };
const selectStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '15px', fontSize: '14px', backgroundColor: 'white', color: 'black' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '15px', fontSize: '14px' };

const PatrolInspectionFinal = () => {
  const printRef = useRef();
  const navigate = useNavigate();
  
  // --- STATES ---
  const [isEditing, setIsEditing] = useState(false); 
  const [showDBModal, setShowDBModal] = useState(false); // Info Modal
  const [showInspModal, setShowInspModal] = useState(false); // Inspection Modal

  // DB Modal States
  const [tempCust, setTempCust] = useState('');
  const [tempPart, setTempPart] = useState('');
  const [tempOp, setTempOp] = useState('');
  const [tempPartNo, setTempPartNo] = useState('');

  // Inspection Modal States
  const [inspForm, setInspForm] = useState({
    groupSr: '1',     // 1, 2, 3
    stage: 'SETUP',   // SETUP, 4HRS, LAST
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
    inspectionData: Array(9).fill(null).map((_, i) => ({
      srNo: i < 3 ? '1' : i < 6 ? '2' : '3', 
      date: '', operatorName: '', machineNo: '', 
      time: i % 3 === 0 ? 'SETUP' : i % 3 === 1 ? '4HRS' : 'LAST', 
      checks: Array(14).fill('')
    }))
  });

  // --- FILTER LOGIC ---
  const uniqueCustomers = useMemo(() => [...new Set(MASTER_DATA.map(d => d.customer))].sort(), []);
  const filteredParts = useMemo(() => {
    if (!tempCust) return [];
    return [...new Set(MASTER_DATA.filter(d => d.customer === tempCust).map(d => d.partName))].sort();
  }, [tempCust]);
  const filteredOps = useMemo(() => {
    if (!tempCust || !tempPart) return [];
    return [...new Set(MASTER_DATA.filter(d => d.customer === tempCust && d.partName === tempPart).map(d => d.opName))].sort();
  }, [tempCust, tempPart]);

  // --- DB MODAL HANDLERS ---
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

    setFormData(prev => ({
      ...prev, customerName: tempCust, partName: tempPart, partNumber: tempPartNo, operationName: tempOp,
      productItems: newProductItems, processItems: newProcessItems
    }));
    setShowDBModal(false);
  };

  // --- INSPECTION MODAL HANDLERS (New Logic) ---
  const handleInspChange = (field, value) => {
    setInspForm(prev => ({ ...prev, [field]: value }));
  };

  const handleReadingChange = (index, value) => {
    const newReadings = [...inspForm.readings];
    newReadings[index] = value;
    setInspForm(prev => ({ ...prev, readings: newReadings }));
  };

  // Jab Modal Open ho, purana data load karo agar hai
  const openInspModal = () => {
    // Default load from Group 1, Setup
    setInspForm({ groupSr: '1', stage: 'SETUP', date: '', operator: '', machine: '', readings: Array(14).fill('') });
    setShowInspModal(true);
  };

  const handleApplyInspection = () => {
    // Calculate Rows based on Group (1,2,3)
    const groupIndex = parseInt(inspForm.groupSr) - 1; // 0, 1, 2
    const startRowIndex = groupIndex * 3; // 0, 3, 6

    // Calculate specific row for Stage (Setup/4Hrs/Last)
    const stageOffset = inspForm.stage === 'SETUP' ? 0 : inspForm.stage === '4HRS' ? 1 : 2;
    const targetRowIndex = startRowIndex + stageOffset;

    // Update FormData
    setFormData(prev => {
        const newData = [...prev.inspectionData];
        
        // 1. Update Common Data (Date, Operator, Machine) for ALL 3 rows in this group
        // Kyunki ye merged cells hain
        for (let i = startRowIndex; i < startRowIndex + 3; i++) {
            newData[i] = {
                ...newData[i],
                date: inspForm.date || newData[i].date, // Only update if filled
                operatorName: inspForm.operator || newData[i].operatorName,
                machineNo: inspForm.machine || newData[i].machineNo
            };
        }

        // 2. Update Readings for the SPECIFIC row only
        newData[targetRowIndex] = {
            ...newData[targetRowIndex],
            checks: inspForm.readings
        };

        return { ...prev, inspectionData: newData };
    });

    setShowInspModal(false);
  };

  // --- GENERAL HANDLERS ---
  const handleFieldChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleArrayChange = (arr, idx, field, val) => setFormData(prev => ({ ...prev, [arr]: prev[arr].map((item, i) => i === idx ? { ...item, [field]: val } : item) }));
  const handleMergedChange = (startIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      inspectionData: prev.inspectionData.map((row, i) => {
        if (i >= startIndex && i < startIndex + 3) return { ...row, [field]: value };
        return row;
      })
    }));
  };
  const handleCheckChange = (rIdx, cIdx, val) => setFormData(prev => ({ ...prev, inspectionData: prev.inspectionData.map((row, i) => i === rIdx ? { ...row, checks: [...row.checks.slice(0, cIdx), val, ...row.checks.slice(cIdx + 1)] } : row) }));
  const handleSave = () => { setIsEditing(false); alert("✅ Data Saved!"); };
  const handlePrint = () => window.print();

  // --- CSS VARS ---
  const tableStyle = { width: '100%', borderCollapse: 'collapse', border: '2px solid black', marginBottom: '12px', tableLayout: 'fixed' };
  const thStyle = { border: '2px solid black', padding: '5px', backgroundColor: '#c8c8c8', color: '#000', fontSize: '10px', textAlign: 'center' };
  const tdBorder = { border: '2px solid black', color: '#000', fontSize: '11px', padding: '0', height: '28px' };
  const thickBottomBorder = { borderBottom: '2px solid black' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e5e7eb', padding: '20px' }}>
      
      {/* --- TOP BAR --- */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: 'white', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#374151', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><ArrowLeft /></button>
           AtomOne Report System
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {!isEditing ? (
            <>
              {/* Button 1: Fill Header Info */}
              <button onClick={() => setShowDBModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                <Database size={16} /> Fill Header Info
              </button>
              
              {/* Button 2: Fill Inspection Data (NEW) */}
              <button onClick={openInspModal} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', backgroundColor: '#9333ea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                <ClipboardList size={16} /> Add Inspection Record
              </button>

              <button onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                <Edit size={16} /> Manual Edit
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

      {/* --- MODAL 1: DB INFO SELECTOR --- */}
      {showDBModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1e40af' }}>Select Header Info</h3>
              <button onClick={() => setShowDBModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}><X /></button>
            </div>
            <label style={labelStyle}>Customer</label>
            <select value={tempCust} onChange={onCustSelect} style={selectStyle}>
              <option value="">-- Select --</option>
              {uniqueCustomers.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label style={labelStyle}>Part Name</label>
            <select value={tempPart} onChange={onPartSelect} style={selectStyle} disabled={!tempCust}>
              <option value="">-- Select --</option>
              {filteredParts.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <label style={labelStyle}>Operation</label>
            <select value={tempOp} onChange={(e) => setTempOp(e.target.value)} style={selectStyle} disabled={!tempPart}>
              <option value="">-- Select --</option>
              {filteredOps.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
            <button onClick={handleApplyInfo} disabled={!tempCust || !tempPart} style={{ width: '100%', padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Apply Header Data</button>
          </div>
        </div>
      )}

      {/* --- MODAL 2: INSPECTION DATA ENTRY (NEW) --- */}
      {showInspModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, width: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#9333ea' }}>Add Inspection Result</h3>
              <button onClick={() => setShowInspModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}><X /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                    <label style={labelStyle}>Select Serial Group</label>
                    <select style={selectStyle} value={inspForm.groupSr} onChange={(e) => handleInspChange('groupSr', e.target.value)}>
                        <option value="1">Serial No. 1</option>
                        <option value="2">Serial No. 2</option>
                        <option value="3">Serial No. 3</option>
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>Select Stage</label>
                    <select style={selectStyle} value={inspForm.stage} onChange={(e) => handleInspChange('stage', e.target.value)}>
                        <option value="SETUP">SETUP (Yellow)</option>
                        <option value="4HRS">4HRS (Blue)</option>
                        <option value="LAST">LAST (Red)</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                    <label style={labelStyle}>Date</label>
                    <input type="date" style={inputStyle} value={inspForm.date} onChange={(e) => handleInspChange('date', e.target.value)} />
                </div>
                <div>
                    <label style={labelStyle}>Operator Name</label>
                    <input type="text" style={inputStyle} placeholder="Name" value={inspForm.operator} onChange={(e) => handleInspChange('operator', e.target.value)} />
                </div>
                <div>
                    <label style={labelStyle}>Machine No.</label>
                    <input type="text" style={inputStyle} placeholder="M/C No" value={inspForm.machine} onChange={(e) => handleInspChange('machine', e.target.value)} />
                </div>
            </div>

            <div style={{ borderTop: '1px solid #ddd', paddingTop: '15px', marginTop: '10px' }}>
                <label style={{...labelStyle, fontSize: '14px', marginBottom: '10px'}}>Enter Readings (1 to 14):</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                    {inspForm.readings.map((val, idx) => (
                        <input 
                            key={idx} 
                            type="text" 
                            placeholder={`${idx+1}`} 
                            value={val} 
                            onChange={(e) => handleReadingChange(idx, e.target.value)}
                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }} 
                        />
                    ))}
                </div>
            </div>

            <button onClick={handleApplyInspection} style={{ width: '100%', padding: '12px', backgroundColor: '#9333ea', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' }}>
                Save Inspection Data
            </button>
          </div>
        </div>
      )}

      {/* --- A3 REPORT --- */}
      <div style={{ width: '420mm', minHeight: '297mm', margin: '0 auto', backgroundColor: 'white', padding: '20mm', boxShadow: '0 0 20px rgba(0,0,0,0.15)', border: '1px solid #ddd' }} ref={printRef}>
        
        {/* HEADER & PART INFO (Same as before) */}
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td rowSpan={3} style={{ ...tdBorder, width: '15%', textAlign: 'center', padding: '10px' }}><img src="/logo1.jpg" alt="ATOM ONE" style={{ maxWidth: '90%', maxHeight: '70px', objectFit: 'contain' }} /></td>
              <td rowSpan={3} style={{ ...tdBorder, padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '24px', width: '55%' }}>SETUP & PATROL INSPECTION REPORT</td>
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
              <td style={{ ...tdBorder, padding: '8px', fontWeight: 'bold', backgroundColor: '#e0e0e0', width: '15%' }}>PART NAME</td>
              <td style={{ ...tdBorder, width: '35%' }}><CellInput isEditing={isEditing} value={formData.partName} onChange={(e) => handleFieldChange('partName', e.target.value)} /></td>
              <td style={{ ...tdBorder, padding: '8px', fontWeight: 'bold', backgroundColor: '#e0e0e0', width: '18%' }}>OPERATION NAME</td>
              <td style={{ ...tdBorder, width: '32%' }}><CellInput isEditing={isEditing} value={formData.operationName} onChange={(e) => handleFieldChange('operationName', e.target.value)} /></td>
            </tr>
            <tr>
              <td style={{ ...tdBorder, padding: '8px', fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>PART NUMBER</td>
              <td style={tdBorder}><CellInput isEditing={isEditing} value={formData.partNumber} onChange={(e) => handleFieldChange('partNumber', e.target.value)} /></td>
              <td style={{ ...tdBorder, padding: '8px', fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>CUSTOMER NAME</td>
              <td style={tdBorder}><CellInput isEditing={isEditing} value={formData.customerName} onChange={(e) => handleFieldChange('customerName', e.target.value)} /></td>
            </tr>
          </tbody>
        </table>

        {/* SPECIFICATIONS */}
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: '#c8c8c8', fontWeight: 'bold' }}>
              <th style={{...thStyle, width: '3%'}}>SR. NO</th>
              <th style={{...thStyle, width: '12%'}}>INSP. ITEM (PRODUCT)</th>
              <th style={{...thStyle, width: '8%'}}>SPECIAL CHAR.</th>
              <th style={{...thStyle, width: '7%'}}>SPEC.</th>
              <th style={{...thStyle, width: '7%'}}>TOLERANCE</th>
              <th style={{...thStyle, width: '5%'}}>INST.</th>
              <th style={{...thStyle, width: '3%', borderLeft: '3px solid black'}}>SR. NO</th>
              <th style={{...thStyle, width: '12%'}}>INSP. ITEM (PROCESS)</th>
              <th style={{...thStyle, width: '7%'}}>SPEC.</th>
              <th style={{...thStyle, width: '7%'}}>TOLERANCE</th>
              <th style={{...thStyle, width: '5%'}}>INST.</th>
            </tr>
          </thead>
          <tbody>
            {formData.productItems.map((item, i) => (
              <tr key={i} style={{ height: '35px' }}>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={item.srNo} align="center" onChange={(e) => handleArrayChange('productItems', i, 'srNo', e.target.value)} /></td>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={item.inspItem} onChange={(e) => handleArrayChange('productItems', i, 'inspItem', e.target.value)} /></td>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={item.specialChar} onChange={(e) => handleArrayChange('productItems', i, 'specialChar', e.target.value)} /></td>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={item.spec} align="center" onChange={(e) => handleArrayChange('productItems', i, 'spec', e.target.value)} /></td>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={item.tolerance} align="center" onChange={(e) => handleArrayChange('productItems', i, 'tolerance', e.target.value)} /></td>
                <td style={tdBorder}><CellInput isEditing={isEditing} value={item.inst} align="center" onChange={(e) => handleArrayChange('productItems', i, 'inst', e.target.value)} /></td>
                <td style={{ ...tdBorder, borderLeft: '3px solid black' }}><CellInput isEditing={isEditing} value={formData.processItems[i].srNo} align="center" onChange={(e) => handleArrayChange('processItems', i, 'srNo', e.target.value)} /></td>
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
            <tr style={{ backgroundColor: '#c8c8c8', fontWeight: 'bold' }}>
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
            {[0, 3, 6].map((startIndex) => {
              const setupRow = formData.inspectionData[startIndex];
              const fourHrsRow = formData.inspectionData[startIndex + 1];
              const lastRow = formData.inspectionData[startIndex + 2];
              const mergedCellStyle = { ...tdBorder, verticalAlign: 'middle', backgroundColor: 'white', ...thickBottomBorder };
              const lastRowStyle = { ...tdBorder, ...thickBottomBorder };

              return (
                <React.Fragment key={startIndex}>
                  <tr style={{ height: '30px' }}>
                    <td rowSpan={3} style={{ ...mergedCellStyle, textAlign: 'center' }}><CellInput isEditing={isEditing} value={setupRow.srNo} align="center" onChange={(e) => handleMergedChange(startIndex, 'srNo', e.target.value)} /></td>
                    <td rowSpan={3} style={mergedCellStyle}><CellInput isEditing={isEditing} value={setupRow.date} onChange={(e) => handleMergedChange(startIndex, 'date', e.target.value)} /></td>
                    <td rowSpan={3} style={mergedCellStyle}><CellInput isEditing={isEditing} value={setupRow.operatorName} onChange={(e) => handleMergedChange(startIndex, 'operatorName', e.target.value)} /></td>
                    <td rowSpan={3} style={mergedCellStyle}><CellInput isEditing={isEditing} value={setupRow.machineNo} align="center" onChange={(e) => handleMergedChange(startIndex, 'machineNo', e.target.value)} /></td>
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

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', fontSize: '12px', fontWeight: 'bold', color: '#000' }}>
          <div>PREPARED BY: _________________________________</div>
          <div>APPROVED BY: _________________________________</div>
        </div>
      </div>
    </div>
  );
};

export default PatrolInspectionFinal;

//changes 