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


