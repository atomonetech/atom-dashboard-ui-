import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ReportDetail.css';

const ReportEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [reportData, setReportData] = useState({
    reportName: 'Management Review Report',
    qspNo: 'AO/MR/PR/03',
    revNo: '0',
    revDate: '14.10.2024',
    issueNo: '1',
    issueDate: '14.10.2024',
    totalPages: 1,
    processName: 'Management Review (IATF Clause No. : 9.3)',
    
    pages: [
      {
        pageNumber: 1,
        sections: [
          {
            id: '1',
            title: 'Purpose',
            content: '<p>To ensure that the top management at appropriate intervals reviews the Quality Management System in order to ensure the effectiveness and suitability as to improve product quality, and environment.</p>'
          },
          {
            id: '2',
            title: 'Scope',
            content: '<p>All Departments.</p>'
          },
          {
            id: '3',
            title: 'Responsibility',
            content: '<p>Managing Director, Plant Incharge, Functional Heads.</p>'
          },
          {
            id: '4',
            title: 'Resource',
            content: '<p>Human resource, Computer, Presentation aids, communication system.</p>'
          },
          {
            id: '5',
            title: 'References',
            content: '<p>Document No.: QM / 13 or Quality Manual.</p>'
          },
          {
            id: '6',
            title: 'Procedure',
            content: '<p>Plant Head arrange for Management Review Meeting with a frequency of once in a twelve, month and record relevant agenda for Management Review. All Functional Incharges are the members of Management concerned incharges shall retrieve required data and action plans and submit it plant head prior to M.R.M</p>'
          }
        ]
      }
    ]
  });

  // 🔥 React-Quill Configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'align',
    'link', 'image'
  ];

  const updateField = (field, value) => {
    setReportData(prev => ({ ...prev, [field]: value }));
  };

  const updateSection = (pageIndex, sectionIndex, field, value) => {
    const newPages = [...reportData.pages];
    newPages[pageIndex].sections[sectionIndex][field] = value;
    setReportData(prev => ({ ...prev, pages: newPages }));
  };

  const addSectionToPage = (pageIndex) => {
    const newPages = [...reportData.pages];
    const newSectionId = (newPages[pageIndex].sections.length + 1).toString();
    
    newPages[pageIndex].sections.push({
      id: newSectionId,
      title: 'New Section',
      content: '<p>Enter content here...</p>'
    });
    
    setReportData(prev => ({ ...prev, pages: newPages }));
  };

  const deleteSection = (pageIndex, sectionIndex) => {
    if (reportData.pages[pageIndex].sections.length === 1) {
      alert('⚠️ Cannot delete the last section!');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this section?')) {
      const newPages = [...reportData.pages];
      newPages[pageIndex].sections.splice(sectionIndex, 1);
      
      // Re-number sections
      newPages[pageIndex].sections.forEach((section, index) => {
        section.id = (index + 1).toString();
      });
      
      setReportData(prev => ({ ...prev, pages: newPages }));
    }
  };

  const addNewPage = () => {
    const newPageNumber = reportData.pages.length + 1;
    const newPage = {
      pageNumber: newPageNumber,
      sections: [
        {
          id: '1',
          title: 'New Section',
          content: '<p>Enter content here...</p>'
        }
      ]
    };
    
    setReportData(prev => ({
      ...prev,
      pages: [...prev.pages, newPage],
      totalPages: newPageNumber
    }));
  };

  const deletePage = (pageIndex) => {
    if (reportData.pages.length === 1) {
      alert('⚠️ Cannot delete the last page!');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this page?')) {
      const newPages = reportData.pages.filter((_, index) => index !== pageIndex);
      
      // Re-number pages
      newPages.forEach((page, index) => {
        page.pageNumber = index + 1;
      });
      
      setReportData(prev => ({
        ...prev,
        pages: newPages,
        totalPages: newPages.length
      }));
    }
  };

  const handleSave = () => {
    console.log('Saved Data:', reportData);
    // TODO: API call to save data
    alert('✅ Document saved successfully!');
    navigate(`/qms/report/${id}`);
  };

  const handleCancel = () => {
    if (window.confirm('⚠️ Discard all changes?')) {
      navigate(`/qms/report/${id}`);
    }
  };

  return (
    <div className="report-container-main">
      {/* Action Bar */}
      <div className="action-bar-top no-print">
        <button className="btn-back" onClick={handleCancel}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
        
        <div className="action-btns-group">
          <button className="btn-action btn-add-page" onClick={addNewPage}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            ADD PAGE
          </button>

          <button className="btn-action btn-save" onClick={handleSave}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            SAVE & EXIT
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="multi-page-container">
        {reportData.pages.map((page, pageIndex) => (
          <div key={pageIndex} className={`document-wrapper ${pageIndex > 0 ? 'page-break' : ''}`}>
            
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
                  <td className="header-value">
                    <input 
                      type="text" 
                      value={reportData.qspNo}
                      onChange={(e) => updateField('qspNo', e.target.value)}
                      className="header-input"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="header-label">REV. NO. :-</td>
                  <td className="header-value">
                    <input 
                      type="text" 
                      value={reportData.revNo}
                      onChange={(e) => updateField('revNo', e.target.value)}
                      className="header-input"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="header-label">REV. DATE :-</td>
                  <td className="header-value">
                    <input 
                      type="text" 
                      value={reportData.revDate}
                      onChange={(e) => updateField('revDate', e.target.value)}
                      className="header-input"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="header-label">ISSUE NO. :-</td>
                  <td className="header-value">
                    <input 
                      type="text" 
                      value={reportData.issueNo}
                      onChange={(e) => updateField('issueNo', e.target.value)}
                      className="header-input"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="header-label">ISSUE DATE :-</td>
                  <td className="header-value">
                    <input 
                      type="text" 
                      value={reportData.issueDate}
                      onChange={(e) => updateField('issueDate', e.target.value)}
                      className="header-input"
                    />
                  </td>
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
                  <td className="process-value-cell">
                    <input 
                      type="text" 
                      value={reportData.processName}
                      onChange={(e) => updateField('processName', e.target.value)}
                      className="process-input"
                    />
                  </td>
                  <td className="page-label-cell">
                    <strong>PAGE NO. :-</strong>
                  </td>
                  <td className="page-value-cell">
                    {page.pageNumber} OF {reportData.totalPages}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Content Sections */}
            <div className="document-content">
              {/* Page Controls */}
              <div className="page-controls">
                <button className="btn-add-section" onClick={() => addSectionToPage(pageIndex)}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Section
                </button>
                {reportData.pages.length > 1 && (
                  <button className="btn-delete-page" onClick={() => deletePage(pageIndex)}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Page {page.pageNumber}
                  </button>
                )}
              </div>

              {/* Sections with Editors */}
              {page.sections.map((section, sectionIndex) => (
                <div key={`${pageIndex}-${sectionIndex}`} className="content-section">
                  <div className="section-header-wrapper">
                    <div className="section-header">
                      <span className="section-number">{section.id}</span>
                      <input 
                        type="text" 
                        value={section.title}
                        onChange={(e) => updateSection(pageIndex, sectionIndex, 'title', e.target.value)}
                        className="section-title-input"
                        placeholder="Section Title"
                      />
                    </div>

                    {/* Delete Section Button */}
                    {page.sections.length > 1 && (
                      <div className="section-controls">
                        <button 
                          className="btn-section-delete"
                          onClick={() => deleteSection(pageIndex, sectionIndex)}
                          title="Delete Section"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Rich Text Editor */}
                  <div className="rich-editor-wrapper">
                    <ReactQuill 
                      theme="snow"
                      value={section.content}
                      onChange={(content) => updateSection(pageIndex, sectionIndex, 'content', content)}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Enter section content here..."
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Signature - Only on Last Page */}
            {pageIndex === reportData.pages.length - 1 && (
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
            )}
          </div>
        ))}
      </div>

      {/* Bottom Save Button */}
      <div style={{ 
        maxWidth: '210mm', 
        margin: '30px auto', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        <button 
          onClick={handleCancel}
          style={{
            padding: '12px 24px',
            background: 'white',
            color: '#64748b',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          style={{
            padding: '12px 30px',
            background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Save All Changes
        </button>
      </div>
    </div>
  );
};

export default ReportEditor;
