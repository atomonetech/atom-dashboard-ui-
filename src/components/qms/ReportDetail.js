// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useReactToPrint } from 'react-to-print';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import './ReportDetail.css';

// const ReportDetail = () => {
//   const navigate = useNavigate();
//   const [isEditing, setIsEditing] = useState(false);
//   const componentRef = useRef();

//   const [reportData, setReportData] = useState({
//     reportName: 'Management Review Report',
//     qspNo: 'AO/MR/PR/03',
//     revNo: '0',
//     revDate: '14.10.2024',
//     issueNo: '1',
//     issueDate: '14.10.2024',
//     totalPages: 1,
//     processName: 'Management Review (IATF Clause No. : 9.3)',
    
//     pages: [
//       {
//         pageNumber: 1,
//         sections: [
//           {
//             id: '1',
//             title: 'Purpose',
//             content: '<p>To ensure that the top management at appropriate intervals reviews the Quality Management System in order to ensure the effectiveness and suitability as to improve product quality, and environment.</p>'
//           },
//           {
//             id: '2',
//             title: 'Scope',
//             content: '<p>All Departments.</p>'
//           },
//           {
//             id: '3',
//             title: 'Responsibility',
//             content: '<p>Managing Director, Plant Incharge, Functional Heads.</p>'
//           },
//           {
//             id: '4',
//             title: 'Resource',
//             content: '<p>Human resource, Computer, Presentation aids, communication system.</p>'
//           },
//           {
//             id: '5',
//             title: 'References',
//             content: '<p>Document No.: QM / 13 or Quality Manual.</p>'
//           },
//           {
//             id: '6',
//             title: 'Procedure',
//             content: '<p>Plant Head arrange for Management Review Meeting with a frequency of once in a twelve, month and record relevant agenda for Management Review. All Functional Incharges are the members of Management concerned incharges shall retrieve required data and action plans and submit it plant head prior to M.R.M</p>'
//           }
//         ]
//       }
//     ]
//   });

//   // 🔥 React-Quill Configuration
//   const quillModules = {
//     toolbar: [
//       [{ 'header': [1, 2, 3, false] }],
//       ['bold', 'italic', 'underline', 'strike'],
//       [{ 'color': [] }, { 'background': [] }],
//       [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//       [{ 'indent': '-1'}, { 'indent': '+1' }],
//       [{ 'align': [] }],
//       ['link', 'image'],
//       ['clean']
//     ]
//   };

//   const quillFormats = [
//     'header',
//     'bold', 'italic', 'underline', 'strike',
//     'color', 'background',
//     'list', 'bullet', 'indent',
//     'align',
//     'link', 'image'
//   ];

//   const updateField = (field, value) => {
//     setReportData(prev => ({ ...prev, [field]: value }));
//   };

//   const updateSection = (pageIndex, sectionIndex, field, value) => {
//     const newPages = [...reportData.pages];
//     newPages[pageIndex].sections[sectionIndex][field] = value;
//     setReportData(prev => ({ ...prev, pages: newPages }));
//   };

//   const addNewPage = () => {
//     const newPageNumber = reportData.pages.length + 1;
//     const newPage = {
//       pageNumber: newPageNumber,
//       sections: [
//         {
//           id: '1',
//           title: 'New Section',
//           content: '<p>Enter content here...</p>'
//         }
//       ]
//     };
    
//     setReportData(prev => ({
//       ...prev,
//       pages: [...prev.pages, newPage],
//       totalPages: newPageNumber
//     }));
//   };

//   const addSectionToPage = (pageIndex) => {
//     const newPages = [...reportData.pages];
//     const newSectionId = (newPages[pageIndex].sections.length + 1).toString();
    
//     newPages[pageIndex].sections.push({
//       id: newSectionId,
//       title: 'New Section',
//       content: '<p>Enter content here...</p>'
//     });
    
//     setReportData(prev => ({ ...prev, pages: newPages }));
//   };

//   const deletePage = (pageIndex) => {
//     if (reportData.pages.length === 1) {
//       alert('⚠️ Cannot delete the last page!');
//       return;
//     }
    
//     if (window.confirm('Are you sure you want to delete this page?')) {
//       const newPages = reportData.pages.filter((_, index) => index !== pageIndex);
//       newPages.forEach((page, index) => {
//         page.pageNumber = index + 1;
//       });
      
//       setReportData(prev => ({
//         ...prev,
//         pages: newPages,
//         totalPages: newPages.length
//       }));
//     }
//   };

//   const deleteSection = (pageIndex, sectionIndex) => {
//     if (reportData.pages[pageIndex].sections.length === 1) {
//       alert('⚠️ Cannot delete the last section!');
//       return;
//     }
    
//     if (window.confirm('Are you sure you want to delete this section?')) {
//       const newPages = [...reportData.pages];
//       newPages[pageIndex].sections.splice(sectionIndex, 1);
      
//       newPages[pageIndex].sections.forEach((section, index) => {
//         section.id = (index + 1).toString();
//       });
      
//       setReportData(prev => ({ ...prev, pages: newPages }));
//     }
//   };

//   const handleSave = () => {
//     setIsEditing(false);
//     console.log('Saved Data:', reportData);
//     alert('✅ Document saved successfully!');
//   };

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//     documentTitle: `${reportData.qspNo}_${reportData.reportName}`,
//     pageStyle: `
//       @page {
//         size: A4 portrait;
//         margin: 15mm;
//       }
//       @media print {
//         * {
//           -webkit-print-color-adjust: exact !important;
//           print-color-adjust: exact !important;
//         }
//         .header-label,
//         .process-label-cell,
//         .page-label-cell {
//           background-color: #e5e7eb !important;
//         }
//       }
//     `,
//     onBeforePrint: () => {
//       console.log('Starting print...');
//     },
//     onAfterPrint: () => {
//       console.log('Print completed!');
//     }
//   });

//   const handleExport = () => {
//     const htmlContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>${reportData.reportName}</title>
//   <style>
//     * { margin: 0; padding: 0; box-sizing: border-box; }
//     body { 
//       font-family: Arial, sans-serif; 
//       margin: 20px;
//       background: #f5f5f5;
//     }
//     .page {
//       background: white;
//       padding: 30px;
//       margin-bottom: 20px;
//       box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//     }
//     h1 {
//       color: #0891b2;
//       font-size: 24px;
//       margin-bottom: 20px;
//       text-align: center;
//     }
//     .metadata {
//       display: grid;
//       grid-template-columns: 1fr 1fr;
//       gap: 10px;
//       margin-bottom: 30px;
//       padding: 15px;
//       background: #f8fafc;
//       border-radius: 8px;
//     }
//     .metadata-item {
//       display: flex;
//       gap: 10px;
//     }
//     .metadata-label {
//       font-weight: 900;
//       color: #334155;
//       font-size: 11px;
//     }
//     .metadata-value {
//       color: #64748b;
//       font-size: 11px;
//     }
//     .section { 
//       margin: 20px 0;
//       page-break-inside: avoid;
//     }
//     .section-title { 
//       font-weight: 900; 
//       font-size: 12px;
//       color: #0f172a;
//       margin-bottom: 8px;
//       display: flex;
//       gap: 8px;
//       align-items: baseline;
//     }
//     .section-number {
//       color: #0891b2;
//       font-size: 14px;
//     }
//     .section-content { 
//       margin-left: 30px; 
//       font-size: 11px; 
//       line-height: 1.7;
//       color: #475569;
//     }
//     .footer {
//       margin-top: 50px;
//       padding-top: 20px;
//       border-top: 2px solid #e2e8f0;
//       display: flex;
//       justify-content: space-between;
//     }
//     .signature {
//       text-align: center;
//     }
//     .signature-label {
//       font-weight: 900;
//       font-size: 10px;
//       color: #334155;
//       margin-bottom: 30px;
//     }
//     .signature-line {
//       width: 200px;
//       height: 2px;
//       background: #cbd5e1;
//     }
//     @media print {
//       body { background: white; margin: 0; }
//       .page { box-shadow: none; margin: 0; }
//     }
//   </style>
// </head>
// <body>
//   <div class="page">
//     <h1>${reportData.reportName}</h1>
    
//     <div class="metadata">
//       <div class="metadata-item">
//         <span class="metadata-label">QSP NO.:</span>
//         <span class="metadata-value">${reportData.qspNo}</span>
//       </div>
//       <div class="metadata-item">
//         <span class="metadata-label">REV. NO.:</span>
//         <span class="metadata-value">${reportData.revNo}</span>
//       </div>
//       <div class="metadata-item">
//         <span class="metadata-label">REV. DATE:</span>
//         <span class="metadata-value">${reportData.revDate}</span>
//       </div>
//       <div class="metadata-item">
//         <span class="metadata-label">ISSUE NO.:</span>
//         <span class="metadata-value">${reportData.issueNo}</span>
//       </div>
//       <div class="metadata-item">
//         <span class="metadata-label">ISSUE DATE:</span>
//         <span class="metadata-value">${reportData.issueDate}</span>
//       </div>
//       <div class="metadata-item">
//         <span class="metadata-label">PROCESS:</span>
//         <span class="metadata-value">${reportData.processName}</span>
//       </div>
//     </div>

//     ${reportData.pages.map((page) => `
//       ${page.sections.map(section => `
//         <div class="section">
//           <div class="section-title">
//             <span class="section-number">${section.id}.</span>
//             <span>${section.title}</span>
//           </div>
//           <div class="section-content">${section.content}</div>
//         </div>
//       `).join('')}
//     `).join('')}

//     <div class="footer">
//       <div class="signature">
//         <div class="signature-label">PREPARED BY</div>
//         <div class="signature-line"></div>
//       </div>
//       <div class="signature">
//         <div class="signature-label">APPROVED BY</div>
//         <div class="signature-line"></div>
//       </div>
//     </div>
//   </div>
// </body>
// </html>
//     `;
    
//     const blob = new Blob([htmlContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${reportData.qspNo}_${reportData.reportName.replace(/\s+/g, '_')}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
    
//     alert('✅ Document exported successfully!');
//   };

//   return (
//     <div className="report-container-main">
//       {/* Action Bar */}
//       <div className="action-bar-top no-print">
//         <button className="btn-back" onClick={() => navigate('/qms')}>
//           <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//           Back
//         </button>
        
//         <div className="action-btns-group">
//           {/* EDIT/SAVE Button */}
//           <button 
//             className={`btn-action ${isEditing ? 'btn-save' : 'btn-edit'}`}
//             onClick={() => isEditing ? handleSave() : setIsEditing(true)}
//           >
//             {isEditing ? (
//               <>
//                 <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
//                 </svg>
//                 SAVE
//               </>
//             ) : (
//               <>
//                 <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                 </svg>
//                 EDIT
//               </>
//             )}
//           </button>

//           {/* Add Page Button */}
//           <button className="btn-action btn-add-page" onClick={addNewPage}>
//             <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//             ADD PAGE
//           </button>
          
//           {/* Print Button */}
//           <button className="btn-action btn-print" onClick={handlePrint}>
//             <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//             </svg>
//             PRINT
//           </button>

//           {/* Export Button */}
//           <button className="btn-action btn-export" onClick={handleExport}>
//             <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//             EXPORT
//           </button>
//         </div>
//       </div>

//       {/* Document Content */}
//       <div ref={componentRef} className="multi-page-container">
//         {reportData.pages.map((page, pageIndex) => (
//           <div key={pageIndex} className={`document-wrapper ${pageIndex > 0 ? 'page-break' : ''}`}>
            
//             {/* Header Table */}
//             <table className="header-table">
//               <tbody>
//                 <tr>
//                   <td rowSpan="5" className="logo-cell">
//                     <img src="/logo1.jpg" alt="ATOM ONE" className="company-logo" />
//                   </td>
//                   <td rowSpan="5" className="title-cell">
//                     <div className="doc-title">QUALITY SYSTEM PROCEDURE</div>
//                   </td>
//                   <td className="header-label">QSP NO. :-</td>
//                   <td className="header-value">
//                     {isEditing ? (
//                       <input 
//                         type="text" 
//                         value={reportData.qspNo}
//                         onChange={(e) => updateField('qspNo', e.target.value)}
//                         className="header-input"
//                       />
//                     ) : reportData.qspNo}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="header-label">REV. NO. :-</td>
//                   <td className="header-value">
//                     {isEditing ? (
//                       <input 
//                         type="text" 
//                         value={reportData.revNo}
//                         onChange={(e) => updateField('revNo', e.target.value)}
//                         className="header-input"
//                       />
//                     ) : reportData.revNo}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="header-label">REV. DATE :-</td>
//                   <td className="header-value">
//                     {isEditing ? (
//                       <input 
//                         type="text" 
//                         value={reportData.revDate}
//                         onChange={(e) => updateField('revDate', e.target.value)}
//                         className="header-input"
//                       />
//                     ) : reportData.revDate}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="header-label">ISSUE NO. :-</td>
//                   <td className="header-value">
//                     {isEditing ? (
//                       <input 
//                         type="text" 
//                         value={reportData.issueNo}
//                         onChange={(e) => updateField('issueNo', e.target.value)}
//                         className="header-input"
//                       />
//                     ) : reportData.issueNo}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="header-label">ISSUE DATE :-</td>
//                   <td className="header-value">
//                     {isEditing ? (
//                       <input 
//                         type="text" 
//                         value={reportData.issueDate}
//                         onChange={(e) => updateField('issueDate', e.target.value)}
//                         className="header-input"
//                       />
//                     ) : reportData.issueDate}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>

//             {/* Process Name + Page No */}
//             <table className="combined-process-page-table">
//               <tbody>
//                 <tr>
//                   <td className="process-label-cell">
//                     <strong>PROCESS NAME (IATF 16949 CLAUSE NO.)</strong>
//                   </td>
//                   <td className="process-value-cell">
//                     {isEditing ? (
//                       <input 
//                         type="text" 
//                         value={reportData.processName}
//                         onChange={(e) => updateField('processName', e.target.value)}
//                         className="process-input"
//                       />
//                     ) : reportData.processName}
//                   </td>
//                   <td className="page-label-cell">
//                     <strong>PAGE NO. :-</strong>
//                   </td>
//                   <td className="page-value-cell">
//                     {page.pageNumber} OF {reportData.totalPages}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>

//             {/* Content Sections */}
//             <div className="document-content">
//               {/* Page Controls (Edit Mode Only) */}
//               {isEditing && (
//                 <div className="page-controls no-print">
//                   <button className="btn-add-section" onClick={() => addSectionToPage(pageIndex)}>
//                     <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                     Add Section
//                   </button>
//                   {reportData.pages.length > 1 && (
//                     <button className="btn-delete-page" onClick={() => deletePage(pageIndex)}>
//                       <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                       Delete Page
//                     </button>
//                   )}
//                 </div>
//               )}

//               {/* Sections */}
//               {page.sections.map((section, sectionIndex) => (
//                 <div key={`${pageIndex}-${sectionIndex}`} className="content-section">
//                   <div className="section-header-wrapper">
//                     <div className="section-header">
//                       <span className="section-number">{section.id}</span>
//                       {isEditing ? (
//                         <input 
//                           type="text" 
//                           value={section.title}
//                           onChange={(e) => updateSection(pageIndex, sectionIndex, 'title', e.target.value)}
//                           className="section-title-input"
//                         />
//                       ) : (
//                         <span className="section-title">{section.title} :-</span>
//                       )}
//                     </div>

//                     {/* Delete Section Button */}
//                     {isEditing && page.sections.length > 1 && (
//                       <div className="section-controls no-print">
//                         <button 
//                           className="btn-section-delete"
//                           onClick={() => deleteSection(pageIndex, sectionIndex)}
//                           title="Delete Section"
//                         >
//                           <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {/* Rich Text Editor / Content Display */}
//                   {isEditing ? (
//                     <div className="rich-editor-wrapper">
//                       <ReactQuill 
//                         theme="snow"
//                         value={section.content}
//                         onChange={(content) => updateSection(pageIndex, sectionIndex, 'content', content)}
//                         modules={quillModules}
//                         formats={quillFormats}
//                         placeholder="Enter content here..."
//                       />
//                     </div>
//                   ) : (
//                     <div 
//                       className="section-content" 
//                       dangerouslySetInnerHTML={{ __html: section.content }}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Footer Signature - Only on Last Page */}
//             {pageIndex === reportData.pages.length - 1 && (
//               <div className="footer-signature-container">
//                 <div className="signature-item">
//                   <span className="signature-text">PREPARED BY</span>
//                   <span className="signature-line-inline"></span>
//                 </div>
//                 <div className="signature-item">
//                   <span className="signature-text">APPROVED BY</span>
//                   <span className="signature-line-inline"></span>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ReportDetail;


// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useReactToPrint } from 'react-to-print';
// import './ReportDetail.css';

// const ReportDetail = () => {
//   const navigate = useNavigate();
//   const componentRef = useRef();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [editingSection, setEditingSection] = useState(null);
//   const [editingPage, setEditingPage] = useState(0);

//   const [reportData, setReportData] = useState({
//     reportName: 'Management Review Report',
//     qspNo: 'AO/MR/PR/03',
//     revNo: '0',
//     revDate: '14.10.2024',
//     issueNo: '1',
//     issueDate: '14.10.2024',
//     totalPages: 1,
//     processName: 'Management Review (IATF Clause No. : 9.3)',
    
//     pages: [
//       {
//         pageNumber: 1,
//         sections: [
//           {
//             id: '1',
//             title: 'Purpose',
//             content: 'To ensure that the top management at appropriate intervals reviews the Quality Management System in order to ensure the effectiveness and suitability as to improve product quality, and environment.'
//           },
//           {
//             id: '2',
//             title: 'Scope',
//             content: 'All Departments.'
//           },
//           {
//             id: '3',
//             title: 'Responsibility',
//             content: 'Managing Director, Plant Incharge, Functional Heads.'
//           },
//           {
//             id: '4',
//             title: 'Resource',
//             content: 'Human resource, Computer, Presentation aids, communication system.'
//           },
//           {
//             id: '5',
//             title: 'References',
//             content: 'Document No.: QM / 13 or Quality Manual.'
//           },
//           {
//             id: '6',
//             title: 'Procedure',
//             content: 'Plant Head arrange for Management Review Meeting with a frequency of once in a twelve, month and record relevant agenda for Management Review. All Functional Incharges are the members of Management concerned incharges shall retrieve required data and action plans and submit it plant head prior to M.R.M'
//           }
//         ]
//       }
//     ]
//   });

//   const updateField = (field, value) => {
//     setReportData(prev => ({ ...prev, [field]: value }));
//   };

//   const updateSection = (pageIndex, sectionIndex, field, value) => {
//     const newPages = [...reportData.pages];
//     newPages[pageIndex].sections[sectionIndex][field] = value;
//     setReportData(prev => ({ ...prev, pages: newPages }));
//   };

//   const addSectionToPage = (pageIndex) => {
//     const newPages = [...reportData.pages];
//     const newSectionId = (newPages[pageIndex].sections.length + 1).toString();
    
//     newPages[pageIndex].sections.push({
//       id: newSectionId,
//       title: 'New Section',
//       content: 'Enter content here...'
//     });
    
//     setReportData(prev => ({ ...prev, pages: newPages }));
//     setEditingSection(newPages[pageIndex].sections.length - 1);
//   };

//   const deleteSection = (pageIndex, sectionIndex) => {
//     if (reportData.pages[pageIndex].sections.length === 1) {
//       alert('⚠️ Cannot delete the last section!');
//       return;
//     }
    
//     if (window.confirm('Are you sure you want to delete this section?')) {
//       const newPages = [...reportData.pages];
//       newPages[pageIndex].sections.splice(sectionIndex, 1);
      
//       newPages[pageIndex].sections.forEach((section, index) => {
//         section.id = (index + 1).toString();
//       });
      
//       setReportData(prev => ({ ...prev, pages: newPages }));
//       setEditingSection(null);
//     }
//   };

//   const addNewPage = () => {
//     const newPageNumber = reportData.pages.length + 1;
//     const newPage = {
//       pageNumber: newPageNumber,
//       sections: [
//         {
//           id: '1',
//           title: 'New Section',
//           content: 'Enter content here...'
//         }
//       ]
//     };
    
//     setReportData(prev => ({
//       ...prev,
//       pages: [...prev.pages, newPage],
//       totalPages: newPageNumber
//     }));
//   };

//   const deletePage = (pageIndex) => {
//     if (reportData.pages.length === 1) {
//       alert('⚠️ Cannot delete the last page!');
//       return;
//     }
    
//     if (window.confirm('Are you sure you want to delete this page?')) {
//       const newPages = reportData.pages.filter((_, index) => index !== pageIndex);
//       newPages.forEach((page, index) => {
//         page.pageNumber = index + 1;
//       });
      
//       setReportData(prev => ({
//         ...prev,
//         pages: newPages,
//         totalPages: newPages.length
//       }));
//       setEditingPage(0);
//       setEditingSection(null);
//     }
//   };

//   const handleSave = () => {
//     setIsSidebarOpen(false);
//     console.log('Saved Data:', reportData);
//     alert('✅ Document saved successfully!');
//   };

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//     documentTitle: `${reportData.qspNo}_${reportData.reportName}`,
//     pageStyle: `
//       @page {
//         size: A4 portrait;
//         margin: 15mm;
//       }
//       @media print {
//         * {
//           -webkit-print-color-adjust: exact !important;
//           print-color-adjust: exact !important;
//         }
//         .header-label,
//         .process-label-cell,
//         .page-label-cell {
//           background-color: #e5e7eb !important;
//         }
//       }
//     `,
//   });

//   const handleExport = () => {
//     const htmlContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <title>${reportData.reportName}</title>
// </head>
// <body>
//   <h1>${reportData.reportName}</h1>
//   ${reportData.pages.map((page) => page.sections.map(section => `
//     <div>
//       <h3>${section.id}. ${section.title}</h3>
//       <p>${section.content}</p>
//     </div>
//   `).join('')).join('')}
// </body>
// </html>`;
    
//     const blob = new Blob([htmlContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${reportData.qspNo}_${reportData.reportName.replace(/\s+/g, '_')}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     alert('✅ Document exported successfully!');
//   };

//   const openEditor = () => {
//     setIsSidebarOpen(true);
//     setEditingPage(0);
//     setEditingSection(null);
//   };

//   const closeSidebar = () => {
//     setIsSidebarOpen(false);
//     setEditingSection(null);
//   };

//   return (
//     <div className="report-container-main">
//       {/* Action Bar */}
//       <div className="action-bar-top no-print">
//         <button className="btn-back" onClick={() => navigate('/qms')}>
//           <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//           Back
//         </button>
        
//         <div className="action-btns-group">
//           <button className="btn-action btn-edit" onClick={openEditor}>
//             <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//             </svg>
//             EDIT
//           </button>

//           <button className="btn-action btn-add-page" onClick={addNewPage}>
//             <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//             ADD PAGE
//           </button>
          
//           <button className="btn-action btn-print" onClick={handlePrint}>
//             <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//             </svg>
//             PRINT
//           </button>

//           <button className="btn-action btn-export" onClick={handleExport}>
//             <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//             EXPORT
//           </button>
//         </div>
//       </div>

//       {/* Document Content */}
//       <div ref={componentRef} className="multi-page-container">
//         {reportData.pages.map((page, pageIndex) => (
//           <div key={pageIndex} className={`document-wrapper ${pageIndex > 0 ? 'page-break' : ''}`}>
            
//             {/* Header Table */}
//             <table className="header-table">
//               <tbody>
//                 <tr>
//                   <td rowSpan="5" className="logo-cell">
//                     <img src="/logo1.jpg" alt="ATOM ONE" className="company-logo" />
//                   </td>
//                   <td rowSpan="5" className="title-cell">
//                     <div className="doc-title">QUALITY SYSTEM PROCEDURE</div>
//                   </td>
//                   <td className="header-label">QSP NO. :-</td>
//                   <td className="header-value">{reportData.qspNo}</td>
//                 </tr>
//                 <tr>
//                   <td className="header-label">REV. NO. :-</td>
//                   <td className="header-value">{reportData.revNo}</td>
//                 </tr>
//                 <tr>
//                   <td className="header-label">REV. DATE :-</td>
//                   <td className="header-value">{reportData.revDate}</td>
//                 </tr>
//                 <tr>
//                   <td className="header-label">ISSUE NO. :-</td>
//                   <td className="header-value">{reportData.issueNo}</td>
//                 </tr>
//                 <tr>
//                   <td className="header-label">ISSUE DATE :-</td>
//                   <td className="header-value">{reportData.issueDate}</td>
//                 </tr>
//               </tbody>
//             </table>

//             {/* Process Name + Page No */}
//             <table className="combined-process-page-table">
//               <tbody>
//                 <tr>
//                   <td className="process-label-cell">
//                     <strong>PROCESS NAME (IATF 16949 CLAUSE NO.)</strong>
//                   </td>
//                   <td className="process-value-cell">{reportData.processName}</td>
//                   <td className="page-label-cell">
//                     <strong>PAGE NO. :-</strong>
//                   </td>
//                   <td className="page-value-cell">
//                     {page.pageNumber} OF {reportData.totalPages}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>

//             {/* Content Sections */}
//             <div className="document-content">
//               {page.sections.map((section, sectionIndex) => (
//                 <div 
//                   key={`${pageIndex}-${sectionIndex}`} 
//                   className={`content-section ${
//                     isSidebarOpen && editingPage === pageIndex && editingSection === sectionIndex 
//                       ? 'section-active' 
//                       : ''
//                   }`}
//                   onClick={() => {
//                     if (isSidebarOpen) {
//                       setEditingPage(pageIndex);
//                       setEditingSection(sectionIndex);
//                     }
//                   }}
//                   style={{ cursor: isSidebarOpen ? 'pointer' : 'default' }}
//                 >
//                   <div className="section-header">
//                     <span className="section-number">{section.id}</span>
//                     <span className="section-title">{section.title} :-</span>
//                   </div>
//                   <div className="section-content">{section.content}</div>
//                 </div>
//               ))}
//             </div>

//             {/* Footer Signature - Only on Last Page */}
//             {pageIndex === reportData.pages.length - 1 && (
//               <div className="footer-signature-container">
//                 <div className="signature-item">
//                   <span className="signature-text">PREPARED BY</span>
//                   <span className="signature-line-inline"></span>
//                 </div>
//                 <div className="signature-item">
//                   <span className="signature-text">APPROVED BY</span>
//                   <span className="signature-line-inline"></span>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Sidebar Editor */}
//       <div className={`sidebar-editor ${isSidebarOpen ? 'sidebar-open' : ''}`}>
//         {/* Sidebar Header */}
//         <div className="sidebar-header">
//           <h3>✏️ Edit Document</h3>
//           <button className="btn-close-sidebar" onClick={closeSidebar}>
//             <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* Sidebar Content */}
//         <div className="sidebar-content">
//           {/* Document Metadata */}
//           <div className="sidebar-section">
//             <h4 className="sidebar-section-title">📋 Document Information</h4>
            
//             <div className="form-group">
//               <label>QSP NO.</label>
//               <input 
//                 type="text" 
//                 value={reportData.qspNo}
//                 onChange={(e) => updateField('qspNo', e.target.value)}
//                 className="sidebar-input"
//               />
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>REV. NO.</label>
//                 <input 
//                   type="text" 
//                   value={reportData.revNo}
//                   onChange={(e) => updateField('revNo', e.target.value)}
//                   className="sidebar-input"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>REV. DATE</label>
//                 <input 
//                   type="text" 
//                   value={reportData.revDate}
//                   onChange={(e) => updateField('revDate', e.target.value)}
//                   className="sidebar-input"
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>ISSUE NO.</label>
//                 <input 
//                   type="text" 
//                   value={reportData.issueNo}
//                   onChange={(e) => updateField('issueNo', e.target.value)}
//                   className="sidebar-input"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>ISSUE DATE</label>
//                 <input 
//                   type="text" 
//                   value={reportData.issueDate}
//                   onChange={(e) => updateField('issueDate', e.target.value)}
//                   className="sidebar-input"
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label>PROCESS NAME</label>
//               <input 
//                 type="text" 
//                 value={reportData.processName}
//                 onChange={(e) => updateField('processName', e.target.value)}
//                 className="sidebar-input"
//               />
//             </div>
//           </div>

//           {/* Page Selection */}
//           <div className="sidebar-section">
//             <h4 className="sidebar-section-title">📄 Select Page</h4>
//             <div className="page-buttons">
//               {reportData.pages.map((page, index) => (
//                 <button
//                   key={index}
//                   onClick={() => {
//                     setEditingPage(index);
//                     setEditingSection(null);
//                   }}
//                   className={`btn-page ${editingPage === index ? 'active' : ''}`}
//                 >
//                   Page {page.pageNumber}
//                 </button>
//               ))}
//               {reportData.pages.length > 1 && (
//                 <button
//                   onClick={() => deletePage(editingPage)}
//                   className="btn-page btn-delete-page-sidebar"
//                 >
//                   Delete
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Sections List */}
//           <div className="sidebar-section">
//             <div className="section-header-row">
//               <h4 className="sidebar-section-title">
//                 📝 Sections (Page {reportData.pages[editingPage]?.pageNumber})
//               </h4>
//               <button
//                 onClick={() => addSectionToPage(editingPage)}
//                 className="btn-add-section-sidebar"
//               >
//                 <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                 </svg>
//                 Add Section
//               </button>
//             </div>

//             <div className="sections-list">
//               {reportData.pages[editingPage]?.sections.map((section, index) => (
//                 <div
//                   key={index}
//                   onClick={() => setEditingSection(index)}
//                   className={`section-item ${editingSection === index ? 'active' : ''}`}
//                 >
//                   <div className="section-item-header">
//                     <span className="section-item-number">{section.id}.</span>
//                     <span className="section-item-title">{section.title}</span>
//                   </div>
//                   {reportData.pages[editingPage].sections.length > 1 && (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         deleteSection(editingPage, index);
//                       }}
//                       className="btn-delete-section-sidebar"
//                     >
//                       <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Section Editor */}
//           {editingSection !== null && reportData.pages[editingPage]?.sections[editingSection] && (
//             <div className="sidebar-section sidebar-editor-section">
//               <h4 className="sidebar-section-title">
//                 ✍️ Edit Section {reportData.pages[editingPage].sections[editingSection].id}
//               </h4>
              
//               <div className="form-group">
//                 <label>Section Title</label>
//                 <input 
//                   type="text" 
//                   value={reportData.pages[editingPage].sections[editingSection].title}
//                   onChange={(e) => updateSection(editingPage, editingSection, 'title', e.target.value)}
//                   className="sidebar-input"
//                   placeholder="Enter section title..."
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Section Content</label>
//                 <textarea 
//                   value={reportData.pages[editingPage].sections[editingSection].content}
//                   onChange={(e) => updateSection(editingPage, editingSection, 'content', e.target.value)}
//                   className="sidebar-textarea"
//                   placeholder="Enter section content..."
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Sidebar Footer */}
//         <div className="sidebar-footer">
//           <button onClick={closeSidebar} className="btn-sidebar-cancel">
//             Cancel
//           </button>
//           <button onClick={handleSave} className="btn-sidebar-save">
//             <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
//             </svg>
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportDetail;


import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import './ReportDetail.css';

const ReportDetail = () => {
  const navigate = useNavigate();
  const componentRef = useRef();
  const contentEditableRef = useRef();
  const [isEditing, setIsEditing] = useState(false);

  const [reportData, setReportData] = useState({
    qspNo: 'AO/MR/PR/03',
    revNo: '0',
    revDate: '14.10.2024',
    issueNo: '1',
    issueDate: '14.10.2024',
    processName: 'Management Review (IATF Clause No. : 9.3)',
    pageNumber: 1,
    totalPages: 1,
    content: `<div style="margin-bottom: 12px;">
      <div style="display: flex; gap: 8px; margin-bottom: 6px;">
        <span style="font-size: 11px; font-weight: 900; color: #0f172a; min-width: 20px;">1</span>
        <span style="font-size: 11px; font-weight: 900; color: #0f172a;">Purpose :-</span>
      </div>
      <div style="margin-left: 28px; line-height: 1.5; color: #334155; font-size: 10px; font-weight: 500;">
        To ensure that the top management at appropriate intervals reviews the Quality Management System in order to ensure the effectiveness and suitability as to improve product quality, and environment.
      </div>
    </div>
    <div style="margin-bottom: 12px;">
      <div style="display: flex; gap: 8px; margin-bottom: 6px;">
        <span style="font-size: 11px; font-weight: 900; color: #0f172a; min-width: 20px;">2</span>
        <span style="font-size: 11px; font-weight: 900; color: #0f172a;">Scope :-</span>
      </div>
      <div style="margin-left: 28px; line-height: 1.5; color: #334155; font-size: 10px; font-weight: 500;">
        All Departments.
      </div>
    </div>
    <div style="margin-bottom: 12px;">
      <div style="display: flex; gap: 8px; margin-bottom: 6px;">
        <span style="font-size: 11px; font-weight: 900; color: #0f172a; min-width: 20px;">3</span>
        <span style="font-size: 11px; font-weight: 900; color: #0f172a;">Responsibility :-</span>
      </div>
      <div style="margin-left: 28px; line-height: 1.5; color: #334155; font-size: 10px; font-weight: 500;">
        Managing Director, Plant Incharge, Functional Heads.
      </div>
    </div>
    <div style="margin-bottom: 12px;">
      <div style="display: flex; gap: 8px; margin-bottom: 6px;">
        <span style="font-size: 11px; font-weight: 900; color: #0f172a; min-width: 20px;">4</span>
        <span style="font-size: 11px; font-weight: 900; color: #0f172a;">Resource :-</span>
      </div>
      <div style="margin-left: 28px; line-height: 1.5; color: #334155; font-size: 10px; font-weight: 500;">
        Human resource, Computer, Presentation aids, communication system.
      </div>
    </div>
    <div style="margin-bottom: 12px;">
      <div style="display: flex; gap: 8px; margin-bottom: 6px;">
        <span style="font-size: 11px; font-weight: 900; color: #0f172a; min-width: 20px;">5</span>
        <span style="font-size: 11px; font-weight: 900; color: #0f172a;">References :-</span>
      </div>
      <div style="margin-left: 28px; line-height: 1.5; color: #334155; font-size: 10px; font-weight: 500;">
        Document No.: QM / 13 or Quality Manual.
      </div>
    </div>
    <div style="margin-bottom: 12px;">
      <div style="display: flex; gap: 8px; margin-bottom: 6px;">
        <span style="font-size: 11px; font-weight: 900; color: #0f172a; min-width: 20px;">6</span>
        <span style="font-size: 11px; font-weight: 900; color: #0f172a;">Procedure :-</span>
      </div>
      <div style="margin-left: 28px; line-height: 1.5; color: #334155; font-size: 10px; font-weight: 500;">
        Plant Head arrange for Management Review Meeting with a frequency of once in a twelve, month and record relevant agenda for Management Review.
      </div>
    </div>`
  });

  // 🔥 Rich Text Formatting Functions
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    saveContent();
  };

  const insertTable = (rows, cols) => {
    let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;"><tbody>';
    for (let i = 0; i < rows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHTML += '<td style="border: 1px solid #000; padding: 8px; min-width: 50px;">Cell</td>';
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table><p><br></p>';
    
    document.execCommand('insertHTML', false, tableHTML);
    saveContent();
  };

  const saveContent = () => {
    if (contentEditableRef.current) {
      const content = contentEditableRef.current.innerHTML;
      setReportData(prev => ({ ...prev, content }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    saveContent();
    console.log('Saved Data:', reportData);
    alert('✅ Document saved successfully!');
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${reportData.qspNo}_Management_Review_Report`,
  });

  const handleExport = () => {
    alert('✅ Export functionality!');
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    // Reset content if needed
  };

  return (
    <div className="report-container-main">
      {/* Top Action Bar */}
      <div className="action-bar-top no-print">
        <button className="btn-back" onClick={() => navigate('/qms')}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <div className="action-btns-group">
          {!isEditing ? (
            <>
              <button className="btn-action btn-edit" onClick={startEditing}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                EDIT
              </button>
              <button className="btn-action btn-print" onClick={handlePrint}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                PRINT
              </button>
              <button className="btn-action btn-export" onClick={handleExport}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                EXPORT
              </button>
            </>
          ) : (
            <>
              <button className="btn-action btn-cancel" onClick={cancelEditing}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                CANCEL
              </button>
              <button className="btn-action btn-save" onClick={handleSave}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                SAVE
              </button>
            </>
          )}
        </div>
      </div>

      {/* Formatting Toolbar - Only in Edit Mode */}
      {isEditing && (
        <div className="formatting-toolbar-top no-print">
          <div className="toolbar-group">
            <button onClick={() => formatText('bold')} className="toolbar-btn" title="Bold">
              <strong>B</strong>
            </button>
            <button onClick={() => formatText('italic')} className="toolbar-btn" title="Italic">
              <em>I</em>
            </button>
            <button onClick={() => formatText('underline')} className="toolbar-btn" title="Underline">
              <u>U</u>
            </button>
            <button onClick={() => formatText('strikeThrough')} className="toolbar-btn" title="Strikethrough">
              <s>S</s>
            </button>
          </div>

          <div className="toolbar-divider"></div>

          <div className="toolbar-group">
            <button onClick={() => formatText('justifyLeft')} className="toolbar-btn" title="Align Left">
              ☰
            </button>
            <button onClick={() => formatText('justifyCenter')} className="toolbar-btn" title="Align Center">
              ☷
            </button>
            <button onClick={() => formatText('justifyRight')} className="toolbar-btn" title="Align Right">
              ☶
            </button>
          </div>

          <div className="toolbar-divider"></div>

          <div className="toolbar-group">
            <button onClick={() => formatText('insertOrderedList')} className="toolbar-btn" title="Numbered List">
              1. 2. 3.
            </button>
            <button onClick={() => formatText('insertUnorderedList')} className="toolbar-btn" title="Bullet List">
              • • •
            </button>
          </div>

          <div className="toolbar-divider"></div>

          <div className="toolbar-group">
            <label className="color-picker-label" title="Text Color">
              <span>A</span>
              <input 
                type="color" 
                onChange={(e) => formatText('foreColor', e.target.value)}
                className="color-input"
              />
            </label>
            <label className="color-picker-label" title="Background Color">
              <span>◼</span>
              <input 
                type="color" 
                onChange={(e) => formatText('backColor', e.target.value)}
                className="color-input"
              />
            </label>
          </div>

          <div className="toolbar-divider"></div>

          <div className="toolbar-group">
            <div className="dropdown">
              <button className="toolbar-btn dropdown-toggle">
                Table ▼
              </button>
              <div className="dropdown-menu">
                <button onClick={() => insertTable(3, 3)}>3×3</button>
                <button onClick={() => insertTable(3, 4)}>3×4</button>
                <button onClick={() => insertTable(3, 5)}>3×5</button>
                <button onClick={() => insertTable(3, 6)}>3×6</button>
                <button onClick={() => insertTable(4, 4)}>4×4</button>
                <button onClick={() => insertTable(4, 5)}>4×5</button>
                <button onClick={() => insertTable(4, 6)}>4×6</button>
                <button onClick={() => insertTable(5, 5)}>5×5</button>
                <button onClick={() => insertTable(5, 6)}>5×6</button>
                <button onClick={() => insertTable(6, 6)}>6×6</button>
              </div>
            </div>
          </div>

          <div className="toolbar-divider"></div>

          <div className="toolbar-group">
            <select 
              onChange={(e) => formatText('fontSize', e.target.value)} 
              className="toolbar-select"
              defaultValue="3"
            >
              <option value="1">8pt</option>
              <option value="2">10pt</option>
              <option value="3">12pt</option>
              <option value="4">14pt</option>
              <option value="5">18pt</option>
              <option value="6">24pt</option>
              <option value="7">36pt</option>
            </select>
          </div>
        </div>
      )}

      {/* Document Content */}
      <div ref={componentRef} className="multi-page-container">
        <div className="document-wrapper">
          
          {/* Header Table */}
          <table className="header-table">
            <tbody>
              <tr>
                <td rowSpan="5" className="logo-cell">
                  <img src="/logo1.jpg" alt="ATOM ONE" className="company-logo" />
                </td>
                <td rowSpan="5" className="title-cell">
                  <div className="doc-title">QUALITY SYSTEM PROCEDURE</div>
                </td>
                <td className="header-label">QSP NO. :-</td>
                <td className="header-value">{reportData.qspNo}</td>
              </tr>
              <tr>
                <td className="header-label">REV. NO. :-</td>
                <td className="header-value">{reportData.revNo}</td>
              </tr>
              <tr>
                <td className="header-label">REV. DATE :-</td>
                <td className="header-value">{reportData.revDate}</td>
              </tr>
              <tr>
                <td className="header-label">ISSUE NO. :-</td>
                <td className="header-value">{reportData.issueNo}</td>
              </tr>
              <tr>
                <td className="header-label">ISSUE DATE :-</td>
                <td className="header-value">{reportData.issueDate}</td>
              </tr>
            </tbody>
          </table>

          {/* Process Name + Page No */}
          <table className="combined-process-page-table">
            <tbody>
              <tr>
                <td className="process-label-cell">
                  <strong>PROCESS NAME (IATF 16949 CLAUSE NO.)</strong>
                </td>
                <td className="process-value-cell">{reportData.processName}</td>
                <td className="page-label-cell">
                  <strong>PAGE NO. :-</strong>
                </td>
                <td className="page-value-cell">
                  {reportData.pageNumber} OF {reportData.totalPages}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Editable Content Area */}
          <div 
            ref={contentEditableRef}
            contentEditable={isEditing}
            className={`document-content ${isEditing ? 'editing-mode' : ''}`}
            dangerouslySetInnerHTML={{ __html: reportData.content }}
            onInput={saveContent}
            onBlur={saveContent}
            suppressContentEditableWarning={true}
          />

          {/* Footer Signature */}
          <div className="footer-signature-container">
            <div className="signature-item">
              <span className="signature-text">PREPARED BY</span>
              <span className="signature-line-inline"></span>
            </div>
            <div className="signature-item">
              <span className="signature-text">APPROVED BY</span>
              <span className="signature-line-inline"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;