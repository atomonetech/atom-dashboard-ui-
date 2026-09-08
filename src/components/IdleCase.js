// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function IdleCase() {
//   const navigate = useNavigate();
//   const [machine, setMachine] = useState("");
//   const [operator, setOperator] = useState("Auto Operator");
//   const [tool, setTool] = useState("");
//   const [reason, setReason] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false); // ADDED: Success page state

//   // ADDED: Success page styles at the top
//   const successStyles = {
//     container: {
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       position: 'relative',
//       overflow: 'hidden'
//     },
//     content: {
//       textAlign: 'center',
//       color: 'white',
//       zIndex: 2,
//       animation: 'fadeInUp 0.8s ease-out'
//     },
//     checkContainer: {
//       marginBottom: '30px',
//       display: 'flex',
//       justifyContent: 'center'
//     },
//     checkMark: {
//       filter: 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.3))' // UPDATED: Red glow for idle report
//     },
//     messageContainer: {
//       marginBottom: '40px'
//     },
//     title: {
//       fontSize: '48px',
//       fontWeight: '800',
//       background: 'linear-gradient(135deg, #dc2626, #ef4444)', // UPDATED: Red gradient
//       WebkitBackgroundClip: 'text',
//       WebkitTextFillColor: 'transparent',
//       backgroundClip: 'text',
//       marginBottom: '15px',
//       animation: 'titleGlow 0.8s ease-out 0.5s both'
//     },
//     subtitle: {
//       fontSize: '24px',
//       fontWeight: '600',
//       color: '#e2e8f0',
//       marginBottom: '20px',
//       animation: 'fadeIn 0.8s ease-out 0.7s both'
//     },
//     description: {
//       fontSize: '18px',
//       color: '#94a3b8',
//       lineHeight: '1.6',
//       maxWidth: '600px',
//       margin: '0 auto',
//       animation: 'fadeIn 0.8s ease-out 0.9s both'
//     },
//     progressContainer: {
//       animation: 'fadeIn 0.8s ease-out 1.1s both'
//     },
//     progressBar: {
//       width: '350px', // UPDATED: Wider for 5 seconds
//       height: '4px',
//       backgroundColor: 'rgba(255,255,255,0.2)',
//       borderRadius: '2px',
//       margin: '0 auto 15px',
//       overflow: 'hidden'
//     },
//     progressFill: {
//       height: '100%',
//       background: 'linear-gradient(90deg, #dc2626, #ef4444)', // UPDATED: Red gradient
//       borderRadius: '2px',
//       animation: 'fillProgress 5s linear' // UPDATED: 5 seconds
//     },
//     progressText: {
//       fontSize: '16px',
//       color: '#94a3b8',
//       fontWeight: '500'
//     },
//     confetti: {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       width: '100%',
//       height: '100%',
//       pointerEvents: 'none',
//       zIndex: 1
//     },
//     confettiPiece: {
//       position: 'absolute',
//       top: '-10px',
//       width: '8px',
//       height: '8px',
//       borderRadius: '50%',
//       animation: 'confettiFall 5s linear infinite' // UPDATED: 5 seconds
//     }
//   };

//   // Auto-fill function when machine is selected
//   const handleMachineChange = async (selectedMachine) => {
//     setMachine(selectedMachine);

//     if (selectedMachine) {
//       try {
//         const response = await axios.get(`http://127.0.0.1:8000/api/machines/${selectedMachine}/auto-fill/`);

//         if (response.data.success) {
//           setOperator(response.data.operator_name);
//           setTool(response.data.tool_id);
//         } else {
//           setOperator("Auto Operator");
//           setTool("Unknown Tool");
//         }
//       } catch (error) {
//         console.error('Error fetching auto-fill data:', error);
//         setOperator("Auto Operator");
//         setTool("Unknown Tool");
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const data = {
//       machine_no: machine,
//       operator_name: operator,
//       tool_name: tool,
//       reason: reason,
//     };

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/api/idle-reports/", data);

//       if (response.data.success) {
//         setLoading(false);
//         setShowSuccess(true); // UPDATED: Show success page

//         // UPDATED: Redirect to dashboard after 5 seconds
//         setTimeout(() => {
//           navigate("/dashboard");
//         }, 5000);
//       } else {
//         setLoading(false);
//         document.getElementById('error-toast').style.display = 'block';
//         setTimeout(() => {
//           document.getElementById('error-toast').style.display = 'none';
//         }, 3000);
//       }
//     } catch (error) {
//       console.error('Idle Report Error:', error);
//       setLoading(false);
//       document.getElementById('error-toast').style.display = 'block';
//       setTimeout(() => {
//         document.getElementById('error-toast').style.display = 'none';
//       }, 3000);
//     }
//   };

//   const handleDashboard = () => {
//     navigate("/dashboard");
//   };

//   // UPDATED: Success Page Component
//   if (showSuccess) {
//     return (
//       <div style={successStyles.container}>
//         <div style={successStyles.content}>
//           {/* Animated Check Mark with Red Theme */}
//           <div style={successStyles.checkContainer}>
//             <div style={successStyles.checkMark}>
//               <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
//                 <circle
//                   cx="40"
//                   cy="40"
//                   r="38"
//                   stroke="#dc2626"
//                   strokeWidth="4"
//                   fill="rgba(220, 38, 38, 0.1)"
//                   style={{
//                     animation: 'scaleIn 0.6s ease-out'
//                   }}
//                 />
//                 <path
//                   d="M25 40L35 50L55 30"
//                   stroke="#dc2626"
//                   strokeWidth="4"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   style={{
//                     strokeDasharray: '50',
//                     strokeDashoffset: '50',
//                     animation: 'drawCheck 0.8s ease-out 0.3s forwards'
//                   }}
//                 />
//               </svg>
//             </div>
//           </div>

//           {/* Success Message */}
//           <div style={successStyles.messageContainer}>
//             <h1 style={successStyles.title}>Thank You So Much!</h1>
//             <h2 style={successStyles.subtitle}>Idle Report Submitted Successfully</h2>
//             {/* UPDATED: Enhanced success message for idle report */}
//             <p style={successStyles.description}>
//               <strong>Thank you so much!</strong> You have submitted the idle report information correctly.
//               <br />
//               <br />
//               <strong style={{color: '#dc2626'}}>Machine {machine}</strong> idle report has been successfully submitted with reason: <strong style={{color: '#ef4444'}}>{reason}</strong>.
//               <br />
//               <br />
//               Your idle report details have been saved and will be processed for analysis!
//             </p>
//           </div>

//           {/* Progress Bar for 5 seconds */}
//           <div style={successStyles.progressContainer}>
//             <div style={successStyles.progressBar}>
//               <div style={successStyles.progressFill}></div>
//             </div>
//             <p style={successStyles.progressText}>Redirecting to dashboard in 5 seconds...</p>
//           </div>

//           {/* Enhanced Confetti Animation with Red Theme */}
//           <div style={successStyles.confetti}>
//             {[...Array(70)].map((_, i) => ( // UPDATED: More confetti for 5 seconds
//               <div
//                 key={i}
//                 style={{
//                   ...successStyles.confettiPiece,
//                   left: `${Math.random() * 100}%`,
//                   animationDelay: `${Math.random() * 5}s`,
//                   backgroundColor: ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fed7d7', '#fecaca'][Math.floor(Math.random() * 6)] // UPDATED: Red themed colors
//                 }}
//               />
//             ))}
//           </div>
//         </div>

//         {/* ADDED: CSS Animations for 5 seconds */}
//         <style jsx>{`
//           @keyframes scaleIn {
//             0% { transform: scale(0); opacity: 0; }
//             100% { transform: scale(1); opacity: 1; }
//           }

//           @keyframes drawCheck {
//             to { stroke-dashoffset: 0; }
//           }

//           @keyframes fadeInUp {
//             0% { opacity: 0; transform: translateY(30px); }
//             100% { opacity: 1; transform: translateY(0); }
//           }

//           @keyframes fadeIn {
//             0% { opacity: 0; }
//             100% { opacity: 1; }
//           }

//           @keyframes titleGlow {
//             0% { opacity: 0; transform: scale(0.8); }
//             100% { opacity: 1; transform: scale(1); }
//           }

//           @keyframes fillProgress {
//             0% { width: 0%; }
//             100% { width: 100%; }
//           }

//           @keyframes confettiFall {
//             0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
//             100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
//           }
//         `}</style>
//       </div>
//     );
//   }

//   const styles = {
//     container: {
//       minHeight: '100vh',
//       backgroundColor: '#0f172a',
//       color: 'white',
//       padding: '0'
//     },
//     header: {
//       backgroundColor: '#1e293b',
//       borderBottom: '1px solid #334155',
//       padding: '20px 40px',
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center'
//     },
//     headerButtons: {
//       display: 'flex',
//       gap: '12px'
//     },
//     dashboardBtn: {
//       backgroundColor: '#7c3aed',
//       border: 'none',
//       color: 'white',
//       padding: '10px 20px',
//       borderRadius: '8px',
//       cursor: 'pointer',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px',
//       fontSize: '14px'
//     },
//     title: {
//       fontSize: '32px',
//       fontWeight: 'bold',
//       margin: 0,
//       color: 'white'
//     },
//     subtitle: {
//       color: '#94a3b8',
//       margin: '5px 0 0 0',
//       fontSize: '16px'
//     },
//     mainContent: {
//       padding: '40px',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'flex-start',
//       minHeight: 'calc(100vh - 100px)'
//     },
//     formContainer: {
//       backgroundColor: '#1e293b',
//       borderRadius: '16px',
//       border: '1px solid #334155',
//       padding: '40px',
//       width: '100%',
//       maxWidth: '800px',
//       boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
//     },
//     formHeader: {
//       textAlign: 'center',
//       marginBottom: '40px',
//       paddingBottom: '20px',
//       borderBottom: '1px solid #334155'
//     },
//     formTitle: {
//       fontSize: '28px',
//       fontWeight: '600',
//       color: 'white',
//       marginBottom: '8px'
//     },
//     formSubtitle: {
//       color: '#94a3b8',
//       fontSize: '16px'
//     },
//     progressBar: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginBottom: '40px',
//       gap: '20px'
//     },
//     progressStep: {
//       width: '40px',
//       height: '40px',
//       borderRadius: '50%',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       fontWeight: 'bold',
//       fontSize: '16px'
//     },
//     activeStep: {
//       backgroundColor: '#7c3aed',
//       color: 'white'
//     },
//     completedStep: {
//       backgroundColor: '#10b981',
//       color: 'white'
//     },
//     inactiveStep: {
//       backgroundColor: '#374151',
//       color: '#9ca3af'
//     },
//     progressLine: {
//       width: '60px',
//       height: '2px',
//       backgroundColor: '#10b981'
//     },
//     inactiveLine: {
//       width: '60px',
//       height: '2px',
//       backgroundColor: '#374151'
//     },
//     formGrid: {
//       display: 'grid',
//       gap: '30px'
//     },
//     fieldGroup: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '8px'
//     },
//     label: {
//       fontSize: '16px',
//       fontWeight: '600',
//       color: 'white',
//       marginBottom: '8px'
//     },
//     select: {
//       backgroundColor: '#374151',
//       border: '1px solid #4b5563',
//       borderRadius: '8px',
//       padding: '16px',
//       color: 'white',
//       fontSize: '16px',
//       outline: 'none',
//       transition: 'all 0.3s ease',
//       appearance: 'none',
//       cursor: 'pointer'
//     },
//     input: {
//       backgroundColor: '#374151',
//       border: '1px solid #4b5563',
//       borderRadius: '8px',
//       padding: '16px',
//       color: 'white',
//       fontSize: '16px',
//       outline: 'none'
//     },
//     inputReadonly: {
//       backgroundColor: '#4b5563',
//       color: '#d1d5db',
//       cursor: 'not-allowed'
//     },
//     submitBtn: {
//       backgroundColor: '#dc2626',
//       border: 'none',
//       borderRadius: '12px',
//       padding: '18px 40px',
//       color: 'white',
//       fontSize: '18px',
//       fontWeight: '600',
//       cursor: 'pointer',
//       width: '100%',
//       marginTop: '20px',
//       transition: 'all 0.3s ease'
//     },
//     submitBtnDisabled: {
//       backgroundColor: '#4b5563',
//       cursor: 'not-allowed'
//     },
//     infoBox: {
//       backgroundColor: '#374151',
//       border: '1px solid #4b5563',
//       borderRadius: '8px',
//       padding: '16px',
//       marginTop: '20px',
//       color: '#cbd5e1',
//       fontSize: '14px'
//     },
//     toast: {
//       position: 'fixed',
//       top: '20px',
//       right: '20px',
//       padding: '16px 24px',
//       borderRadius: '8px',
//       boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
//       zIndex: 1000,
//       display: 'none',
//       color: 'white',
//       fontWeight: '600'
//     },
//     errorToast: {
//       backgroundColor: '#ef4444'
//     }
//   };

//   return (
//     <div style={styles.container}>
//       {/* Header - REMOVED: Back to Step 1 button */}
//       <div style={styles.header}>
//         <div>
//           <h1 style={styles.title}>Idle Case Reporting</h1>
//           <p style={styles.subtitle}>Submit Machine Idle Status Report</p>
//         </div>
//         <div style={styles.headerButtons}>
//           <button
//             style={styles.dashboardBtn}
//             onClick={handleDashboard}
//             onMouseOver={(e) => e.target.style.backgroundColor = '#6d28d9'}
//             onMouseOut={(e) => e.target.style.backgroundColor = '#7c3aed'}
//           >
//             Dashboard
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div style={styles.mainContent}>
//         <div style={styles.formContainer}>
//           {/* Form Header */}
//           <div style={styles.formHeader}>
//             <h2 style={styles.formTitle}>Idle Case Report</h2>
//             <p style={styles.formSubtitle}>Report machine idle status and reason for downtime</p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit}>
//             <div style={styles.formGrid}>
//               {/* Machine Number */}
//               <div style={styles.fieldGroup}>
//                 <label style={styles.label}>Machine Number</label>
//                 <select
//                   style={styles.select}
//                   value={machine}
//                   onChange={(e) => handleMachineChange(e.target.value)}
//                   onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
//                   onBlur={(e) => e.target.style.borderColor = '#4b5563'}
//                   required
//                 >
//                   <option value="">Select Machine</option>
//                   <option value="19">Machine 19</option>
//                   <option value="11">Machine 11</option>
//                   <option value="18">Machine 18</option>
//                   <option value="2">Machine 2</option>
//                   <option value="25">Machine 25</option>
//                   <option value="13">Machine 13</option>
//                 </select>
//               </div>

//               {/* Operator */}
//               <div style={styles.fieldGroup}>
//                 <label style={styles.label}>Operator</label>
//                 <input
//                   style={{...styles.input, ...styles.inputReadonly}}
//                   value={operator}
//                   readOnly
//                 />
//               </div>

//               {/* Tool Name */}
//               <div style={styles.fieldGroup}>
//                 <label style={styles.label}>Tool Name</label>
//                 <input
//                   style={{...styles.input, ...styles.inputReadonly}}
//                   value={tool}
//                   readOnly
//                   placeholder="Auto-filled from database"
//                 />
//               </div>

//               {/* Idle Reason */}
//               <div style={styles.fieldGroup}>
//                 <label style={styles.label}>Idle Reason</label>
//                 <select
//                   style={styles.select}
//                   value={reason}
//                   onChange={(e) => setReason(e.target.value)}
//                   onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
//                   onBlur={(e) => e.target.style.borderColor = '#4b5563'}
//                   required
//                 >
//                   <option value="">Select Reason</option>
//                   <option value="TOOL_BD">Tool Breakdown</option>
//                   <option value="MC_BD">Machine Breakdown</option>
//                   <option value="MAINT">Scheduled Maintenance</option>
//                   <option value="CHANGEOVER">Changeover</option>
//                   <option value="NO_MATERIAL">Material Shortage</option>
//                   <option value="QUALITY_ISSUE">Quality Issue</option>
//                 </select>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               style={{
//                 ...styles.submitBtn,
//                 ...(loading ? styles.submitBtnDisabled : {})
//               }}
//               disabled={loading}
//               onMouseOver={(e) => {
//                 if (!loading) e.target.style.backgroundColor = '#dc2626ff';
//               }}
//               onMouseOut={(e) => {
//                 if (!loading) e.target.style.backgroundColor = '#dc2626ff';
//               }}
//             >
//               {loading ? "Submitting Report..." : "Submit Idle Report"}
//             </button>

//             {/* Info Box */}
//             <div style={styles.infoBox}>
//               Please provide accurate information about the idle machine for proper tracking and analysis.
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Error Toast */}
//       <div
//         id="error-toast"
//         style={{...styles.toast, ...styles.errorToast}}
//       >
//         Error Saving Idle Report!
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

// ✅ Simple icons
import { FaCog, FaExclamationTriangle, FaIndustry } from "react-icons/fa";

const API_BASE = "http://127.0.0.1:8000/api";

// ============================================================
// SAME IDLE REASONS AS PLANT 1 LIVE
// ============================================================

const IDLE_REASONS = {
  "Tool Breakdown": [
    "Overload / Wrong Parameters",
    "Material Hardness",
    "Coolant Issue",
    "Improper Clamping",
    "Wear and Tear",
    "Other",
  ],

  "Machine Breakdown": [
    "Electrical/Electronic Failure",
    "Motor / Drive Trip",
    "Mechanical Failure",
    "Hydraulic / Pneumatic Issue",
    "Software / CNC Error",
    "Other",
  ],

  "Machine Maintenance": [
    "Lubrication / Oiling",
    "Filter / Tank Cleaning",
    "Preventive Maintenance (PM)",
    "Adjustments & Tightening",
    "Other",
  ],

  "Tool Maintenance": [
    "Tool Sharpening / Grinding",
    "Insert Rotation",
    "Chip / Burr Clearing",
    "Offset Adjustment",
    "Other",
  ],

  "Tool Change": [
    "Tool Life Reached",
    "Operation Change",
    "Tool Breakage Replacement",
    "Other",
  ],

  "Material Shortage": [
    "Delay from Store",
    "Delay from Previous Process",
    "Trolley / Forklift Unavailable",
    "Material Hold by QC",
    "Other",
  ],

  "Operator Unavailable": [
    "Tea / Lunch Break",
    "Shift Handover",
    "Nature's Call",
    "Gone to Store / Supervisor",
    "Meeting / Training",
    "Other",
  ],

  Other: ["Other"],
};

const CATEGORY_ICONS = {
  "Tool Breakdown": "bi bi-hammer",
  "Machine Breakdown": "bi bi-lightning-charge-fill",
  "Machine Maintenance": "bi bi-gear-fill",
  "Tool Maintenance": "bi bi-tools",
  "Tool Change": "bi bi-arrow-repeat",
  "Material Shortage": "bi bi-boxes",
  "Operator Unavailable": "bi bi-person-x-fill",
  Other: "bi bi-question-circle-fill",
};

// ============================================================
// SAME PREMIUM DROPDOWN STYLE AS PLANT LIVE
// ============================================================

const CustomDropdown = ({ value, onChange, options, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "14px 18px",
          borderRadius: "12px",
          background: "#1e293b",
          color: value ? "#f8fafc" : "#94a3b8",

          border: `1px solid ${isOpen ? "#fcd34d" : "rgba(245, 158, 11, 0.4)"}`,

          boxShadow: isOpen
            ? "0 0 0 3px rgba(245, 158, 11, 0.15)"
            : "0 4px 15px rgba(0,0,0,0.2)",

          fontSize: "15px",
          fontWeight: "600",
          cursor: "pointer",

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          transition: "all 0.3s ease",
          userSelect: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {value && icon && CATEGORY_ICONS[value] && (
            <i
              className={CATEGORY_ICONS[value]}
              style={{
                color: "#fcd34d",
              }}
            />
          )}

          <span>{value || placeholder}</span>
        </div>

        <div
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",

            transition: "transform 0.3s ease",

            color: isOpen ? "#fcd34d" : "#94a3b8",
          }}
        >
          ▼
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,

            marginTop: "8px",

            background: "#0f172a",

            border: "1px solid rgba(255,255,255,0.1)",

            borderRadius: "12px",

            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",

            maxHeight: "250px",
            overflowY: "auto",

            zIndex: 9999,
          }}
        >
          {options.map((opt, idx) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              style={{
                padding: "14px 18px",

                cursor: "pointer",

                fontSize: "14px",
                fontWeight: "500",

                color: value === opt ? "#fbbf24" : "#f8fafc",

                background:
                  value === opt ? "rgba(245,158,11,0.08)" : "transparent",

                borderBottom:
                  idx !== options.length - 1
                    ? "1px solid rgba(255,255,255,0.05)"
                    : "none",

                transition: "all 0.2s ease",

                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {icon && CATEGORY_ICONS[opt] && (
                <i
                  className={CATEGORY_ICONS[opt]}
                  style={{
                    opacity: 0.7,
                  }}
                />
              )}

              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function IdleCase({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [machine, setMachine] = useState("");
  const [plant, setPlant] = useState("");
  const [operator, setOperator] = useState("Auto Operator");
  const [tool, setTool] = useState("");
  const [idleCategory, setIdleCategory] = useState("");
  const [idleSubReason, setIdleSubReason] = useState("");
  const [idleRemarks, setIdleRemarks] = useState("");
  // const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [eventsLoading, setEventsLoading] = useState(false);
  const [notificationContext, setNotificationContext] = useState(null);

  // Plant-wise machine mapping
  const plantMachines = {
    1: Array.from({ length: 57 }, (_, i) => i + 1),
    2: Array.from({ length: 46 }, (_, i) => i + 1),
  };

  // Success page styles
  const successStyles = {
    container: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    },
    content: {
      textAlign: "center",
      color: "white",
      zIndex: 2,
      animation: "fadeInUp 0.8s ease-out",
    },
    checkContainer: {
      marginBottom: "30px",
      display: "flex",
      justifyContent: "center",
    },
    checkMark: {
      filter: "drop-shadow(0 0 20px rgba(6, 182, 212, 0.5))",
    },
    messageContainer: {
      marginBottom: "40px",
    },
    title: {
      fontSize: "48px",
      fontWeight: "800",
      background: "linear-gradient(135deg, #06b6d4, #0891b2)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      marginBottom: "15px",
      animation: "titleGlow 0.8s ease-out 0.5s both",
    },
    subtitle: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#e2e8f0",
      marginBottom: "20px",
      animation: "fadeIn 0.8s ease-out 0.7s both",
    },
    description: {
      fontSize: "18px",
      color: "#94a3b8",
      lineHeight: "1.6",
      maxWidth: "600px",
      margin: "0 auto",
      animation: "fadeIn 0.8s ease-out 0.9s both",
    },
    progressContainer: {
      animation: "fadeIn 0.8s ease-out 1.1s both",
    },
    progressBar: {
      width: "350px",
      height: "4px",
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: "2px",
      margin: "0 auto 15px",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg, #06b6d4, #0891b2)",
      borderRadius: "2px",
      animation: "fillProgress 5s linear",
    },
    progressText: {
      fontSize: "16px",
      color: "#94a3b8",
      fontWeight: "500",
    },
  };

  // Auto-fill function
  const handleMachineChange = async (selectedMachine) => {
    setMachine(selectedMachine);

    setPendingEvents([]);
    setSelectedEventId("");

    if (!selectedMachine || !plant) {
      return;
    }

    setEventsLoading(true);

    try {
      // Get pending Ideal events for selected plant + machine
      const pendingResponse = await axios.get(
        `${API_BASE}/ideal-reports/pending/`,
        {
          params: {
            plant: plant,
            machine_no: selectedMachine,
          },
        },
      );

      if (pendingResponse.data.success) {
        const events = pendingResponse.data.pending_reports || [];

        const latestThreeEvents = [...events]
          .sort(
            (a, b) => new Date(b.ideal_start_at) - new Date(a.ideal_start_at),
          )
          .slice(0, 3);

        setPendingEvents(latestThreeEvents);

        if (latestThreeEvents.length === 1) {
          setSelectedEventId(String(latestThreeEvents[0].event_id));
        } else {
          setSelectedEventId("");
        }
      }
    } catch (error) {
      console.error("Error fetching pending Ideal events:", error);

      setPendingEvents([]);
      setSelectedEventId("");
    } finally {
      setEventsLoading(false);
    }

    // Existing operator/tool auto-fill
    try {
      const response = await axios.get(
        `${API_BASE}/api/machines/${machine}/auto-fill/?plant=${plant}`,
      );

      if (response.data.success) {
        setOperator(response.data.operator_name);
        setTool(response.data.tool_id);
      } else {
        setOperator("Auto Operator");
        setTool("Unknown Tool");
      }
    } catch (error) {
      console.error("Error fetching auto-fill data:", error);

      setOperator("Auto Operator");
      setTool("Unknown Tool");
    }
  };

  // ==========================================================
  // OPEN IDLE CASE DIRECTLY FROM MACHINE NOTIFICATION
  // ==========================================================

  useEffect(() => {
    const navState = location.state;

    if (!navState?.fromIdleNotification) {
      return;
    }

    const targetPlant = String(navState.plant || "");
    const targetMachine = String(navState.machineNo || "");
    const targetMode = String(navState.idealMode || "").toUpperCase();
    const targetEventId = String(
      navState.idealEventId || navState.notificationId || "",
    );

    if (!targetPlant || !targetMachine || !targetEventId) {
      return;
    }

    console.log("🔔 OPENING IDLE CASE FROM NOTIFICATION:", navState);

    setNotificationContext(navState);

    // Automatically select exact Plant + Machine
    setPlant(targetPlant);
    setMachine(targetMachine);

    // ==========================================================
    // EXACT NOTIFICATION EVENT
    //
    // Notification already knows the exact Ideal DB event.
    // Do NOT make the user search/select it again.
    // ==========================================================

    const startMs = navState.idleStartedAt
      ? new Date(navState.idleStartedAt).getTime()
      : null;

    const endMs = navState.idleEndedAt
      ? new Date(navState.idleEndedAt).getTime()
      : null;

    const durationSeconds =
      startMs && endMs && endMs >= startMs
        ? Math.floor((endMs - startMs) / 1000)
        : 0;

    const notificationEvent = {
      event_id: targetEventId,

      plant_location: targetPlant === "1" ? "Plant 1" : "Plant 2",

      machine_no: targetMachine,

      ideal_mode: targetMode,

      ideal_start_at: navState.idleStartedAt,

      ideal_end_at: navState.idleEndedAt,

      duration_seconds: durationSeconds,

      duration_minutes: Number((durationSeconds / 60).toFixed(2)),

      report_status: "PENDING",
    };

    // Put exact event in dropdown
    setPendingEvents([notificationEvent]);

    // Auto-select exact event
    setSelectedEventId(targetEventId);
    setOperator("Auto Operator");
    setTool("");
    setIdleCategory("");
    setIdleSubReason("");
    setIdleRemarks("");

    const loadNotificationEvent = async () => {
      setEventsLoading(true);

      try {
        // ======================================================
        // 1. GET CLOSED PENDING IDEAL EVENTS
        // ======================================================

        const pendingResponse = await axios.get(
          `${API_BASE}/ideal-reports/pending/`,
          {
            params: {
              plant: targetPlant,
              machine_no: targetMachine,
            },
          },
        );

        if (pendingResponse.data.success) {
          const allEvents = pendingResponse.data.pending_reports || [];

          // IMPORTANT:

          // ======================================================
          // FIRST PRIORITY = EXACT IDEAL EVENT ID
          // ======================================================

          const exactById = allEvents.find(
            (event) => String(event.event_id) === String(targetEventId),
          );

          if (exactById) {
            console.log(
              "✅ EXACT NOTIFICATION IDEAL EVENT FOUND BY ID:",
              exactById,
            );

            setPendingEvents([exactById]);

            setSelectedEventId(String(exactById.event_id));
          } else {
            // ====================================================
            // IMPORTANT:
            // Do NOT clear the notification event.
            //
            // Notification itself is already FK-linked to the
            // exact Ideal event.
            //
            // Generic pending API may temporarily not expose the
            // event because of grouping/filtering.
            // ====================================================

            console.warn(
              "⚠️ Exact event not returned by pending list API. " +
                "Keeping notification-linked Ideal event:",
              targetEventId,
            );
          }
          // Notification jis mode ki thi,
          // sirf wahi event Idle Case me dikhao.
          //
          // ONLINE notification -> ONLINE Ideal
          // OFFLINE notification -> OFFLINE Ideal

          const sameModeEvents = allEvents.filter(
            (event) =>
              String(event.ideal_mode || "").toUpperCase() === targetMode,
          );

          // ======================================================
          // MATCH EXACT NOTIFICATION TIME WITH IDEAL EVENT
          // ======================================================

          const targetStart = navState.idleStartedAt
            ? new Date(navState.idleStartedAt).getTime()
            : null;

          const targetEnd = navState.idleEndedAt
            ? new Date(navState.idleEndedAt).getTime()
            : null;

          let visibleEvents = [];
          let exactEvent = null;

          if (targetStart && targetEnd) {
            const scoredEvents = sameModeEvents
              .map((event) => {
                const eventStart = new Date(event.ideal_start_at).getTime();

                const eventEnd = new Date(event.ideal_end_at).getTime();

                const startDiff = Math.abs(eventStart - targetStart);

                const endDiff = Math.abs(eventEnd - targetEnd);

                return {
                  event,
                  startDiff,
                  endDiff,
                  totalDiff: startDiff + endDiff,
                };
              })
              .sort((a, b) => a.totalDiff - b.totalDiff);

            // Maximum 10 second tolerance
            // Notification and Ideal timestamps should normally match exactly.
            exactEvent = scoredEvents.find(
              (item) => item.startDiff <= 10000 && item.endDiff <= 10000,
            );

            if (exactEvent) {
              // Exact notification event only
              visibleEvents = [exactEvent.event];
            } else {
              // Safety fallback:
              // only 3 nearest events show karo
              visibleEvents = scoredEvents
                .slice(0, 3)
                .map((item) => item.event);
            }
          } else {
            // No notification timing available:
            // latest 3 pending events only
            visibleEvents = [...sameModeEvents]
              .sort(
                (a, b) =>
                  new Date(b.ideal_start_at) - new Date(a.ideal_start_at),
              )
              .slice(0, 3);
          }

          setPendingEvents(visibleEvents);

          // Exact event मिला -> auto select
          if (exactEvent) {
            // ONLY exact time matched notification event
            // automatically select hoga
            setSelectedEventId(String(exactEvent.event.event_id));

            console.log(
              "✅ EXACT NOTIFICATION / IDEAL EVENT MATCH:",
              exactEvent.event,
            );
          } else {
            // IMPORTANT:
            // Nearest event ko kabhi automatically select nahi karna.
            // Otherwise old event galti se submit ho sakta hai.
            setSelectedEventId("");

            if (visibleEvents.length === 0) {
              console.warn(
                `⚠️ No matching ${targetMode} Ideal event found for M${targetMachine}`,
              );
            } else {
              console.warn(
                `⚠️ Exact Ideal event not found. Showing ${visibleEvents.length} nearest events only for verification.`,
              );
            }
          }
        }

        // ======================================================
        // 2. OPERATOR + TOOL AUTO FILL
        // ======================================================

        try {
          const autoFillResponse = await axios.get(
            `${API_BASE}/api/machines/${machine}/auto-fill/?plant=${plant}`,
          );

          if (autoFillResponse.data.success) {
            setOperator(autoFillResponse.data.operator_name || "Auto Operator");

            setTool(autoFillResponse.data.tool_id || "Unknown Tool");
          } else {
            setOperator("Auto Operator");
            setTool("Unknown Tool");
          }
        } catch (autoFillError) {
          console.error("Notification auto-fill error:", autoFillError);

          setOperator("Auto Operator");
          setTool("Unknown Tool");
        }
      } catch (error) {
        console.error(
          "❌ Pending-list verification failed. " +
            "Keeping notification-linked Ideal event:",
          error,
        );

        // IMPORTANT:
        // DO NOT clear:
        //
        // setPendingEvents([])
        // setSelectedEventId("")
        //
        // Exact notification event is already selected.
      } finally {
        setEventsLoading(false);

        // Navigation state ek baar consume ho gaya.
        // Refresh/re-render me dobara trigger nahi hoga.
        navigate(location.pathname, {
          replace: true,
          state: {},
        });
      }
    };

    loadNotificationEvent();
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (!plant || !machine) {
      return;
    }

    // Local development only.
    // Production IP will be handled later.
    const wsPlant = plant === "1" ? "plant1" : "plant2";

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/${wsPlant}/live/`);

    socket.onopen = () => {
      console.log(`✅ Ideal Report WebSocket connected: ${wsPlant}`);
    };

    socket.onmessage = async (event) => {
      try {
        const payload = JSON.parse(event.data);

        // Existing consumer may wrap the message.
        const message = payload.message || payload.data || payload;

        // IMPORTANT:
        // Ignore normal COUNT/machine WebSocket updates.
        if (message.event_type !== "ideal_report_updated") {
          return;
        }

        console.log("📡 IDEAL REPORT UPDATE RECEIVED:", message);

        // If another machine was updated,
        // this page does not need to refetch.
        if (String(message.machine_no) !== String(machine)) {
          return;
        }

        // DB remains source of truth.
        const response = await axios.get(`${API_BASE}/ideal-reports/pending/`, {
          params: {
            plant: plant,
            machine_no: machine,
          },
        });

        if (response.data.success) {
          const allEvents = response.data.pending_reports || [];

          // Notification se page open hua hai to
          // same ONLINE/OFFLINE mode only
          const modeFilteredEvents = notificationContext?.idealMode
            ? allEvents.filter(
                (event) =>
                  String(event.ideal_mode || "").toUpperCase() ===
                  String(notificationContext.idealMode).toUpperCase(),
              )
            : allEvents;

          // UI me maximum 3 events only
          const events = [...modeFilteredEvents]
            .sort(
              (a, b) => new Date(b.ideal_start_at) - new Date(a.ideal_start_at),
            )
            .slice(0, 3);

          setPendingEvents(events);

          // If Browser 2 had selected the event
          // that Browser 1 just submitted,
          // clear that old selection.
          setSelectedEventId((currentEventId) => {
            const stillExists = events.some(
              (item) => String(item.event_id) === String(currentEventId),
            );

            if (stillExists) {
              return currentEventId;
            }

            // Auto-select if only one remains.
            if (events.length === 1) {
              return String(events[0].event_id);
            }

            return "";
          });
        }
      } catch (error) {
        console.error("Ideal Report WebSocket handling error:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("❌ Ideal Report WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log(`🔌 Ideal Report WebSocket disconnected: ${wsPlant}`);
    };

    return () => {
      socket.close();
    };
  }, [plant, machine, notificationContext]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      plant_no: plant,
      machine_no: machine,

      // Hidden auto-filled fields
      operator_name: operator,
      tool_name: tool,

      // NEW Plant Live style reason data
      reason_category: idleCategory,
      specific_reason: idleSubReason,

      // Remark only when "Other" is selected
      remark: idleSubReason === "Other" ? idleRemarks.trim() : "",

      // Exact notification/event identity
      notification_id:
        notificationContext?.idealEventId ||
        notificationContext?.notificationId ||
        null,

      event_key: notificationContext?.eventKey || null,

      ideal_mode: notificationContext?.idealMode || null,
    };

    try {
      if (!selectedEventId) {
        setLoading(false);
        alert("Please select a pending Ideal event.");
        return;
      }

      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${API_BASE}/ideal-reports/${selectedEventId}/submit/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        console.log("✅ IDLE CASE + NOTIFICATION SUBMITTED:", response.data);

        // Sidebar notification badge immediately refresh
        window.dispatchEvent(new Event("notificationCountRefresh"));
        setLoading(false);
        setShowSuccess(true);

        setTimeout(() => {
          navigate("/dashboard");
        }, 5000);
      } else {
        setLoading(false);
        document.getElementById("error-toast").style.display = "block";
        setTimeout(() => {
          document.getElementById("error-toast").style.display = "none";
        }, 3000);
      }
    } catch (error) {
      const backendError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unknown error";

      console.error(
        "❌ IDLE REPORT SUBMIT ERROR:",
        backendError,
        error.response?.data,
      );

      setLoading(false);

      alert(`Idle Report Error:\n${backendError}`);

      const toast = document.getElementById("error-toast");

      if (toast) {
        toast.style.display = "block";

        setTimeout(() => {
          toast.style.display = "none";
        }, 3000);
      }
    }
  };

  // Success Page
  if (showSuccess) {
    return (
      <div style={successStyles.container}>
        <div style={successStyles.content}>
          <div style={successStyles.checkContainer}>
            <div style={successStyles.checkMark}>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  stroke="#06b6d4"
                  strokeWidth="4"
                  fill="rgba(6, 182, 212, 0.1)"
                  style={{ animation: "scaleIn 0.6s ease-out" }}
                />
                <path
                  d="M30 50L45 65L70 35"
                  stroke="#06b6d4"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: "60",
                    strokeDashoffset: "60",
                    animation: "drawCheck 0.8s ease-out 0.3s forwards",
                  }}
                />
              </svg>
            </div>
          </div>

          <div style={successStyles.messageContainer}>
            <h1 style={successStyles.title}>Report Submitted Successfully!</h1>
            <h2 style={successStyles.subtitle}>Idle Case Recorded</h2>
            <p style={successStyles.description}>
              <strong style={{ color: "#06b6d4" }}>
                Plant {plant}, Machine {machine}
              </strong>{" "}
              idle report submitted.
              <br />
              <br />
              Reason:{" "}
              <strong
                style={{
                  color: "#fbbf24",
                }}
              >
                {idleCategory}
                {" → "}
                {idleSubReason}
              </strong>
              <br />
              <br />
              Your report has been saved for analysis.
            </p>
          </div>

          <div style={successStyles.progressContainer}>
            <div style={successStyles.progressBar}>
              <div style={successStyles.progressFill}></div>
            </div>
            <p style={successStyles.progressText}>
              Redirecting to dashboard in 5 seconds...
            </p>
          </div>
        </div>

        <style>{`
          @keyframes scaleIn {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes drawCheck {
            to { stroke-dashoffset: 0; }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes titleGlow {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes fillProgress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  const isIdleReasonValid =
    idleCategory &&
    idleSubReason &&
    (idleSubReason !== "Other" || idleRemarks.trim() !== "");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#1a202c",
      }}
    >
      <Sidebar onLogout={onLogout} />

      {/* ✅ BIGGER WIDTH - 700px */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "50px 40px",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: "700px" }}>
          {/* Header */}
          <div
            style={{
              marginBottom: "35px",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: "8px",
                letterSpacing: "-0.5px",
              }}
            >
              Idle Case Reporting
            </h1>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Report machine idle status and downtime reason
            </p>
          </div>

          {/* Form Container */}
          <div
            style={{
              backgroundColor: "#374151",
              borderRadius: "14px",
              padding: "36px",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.25)",
            }}
          >
            {notificationContext && (
              <div
                style={{
                  marginBottom: "24px",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  backgroundColor:
                    notificationContext.idealMode === "OFFLINE"
                      ? "rgba(239, 68, 68, 0.12)"
                      : "rgba(245, 158, 11, 0.12)",
                  border:
                    notificationContext.idealMode === "OFFLINE"
                      ? "1px solid rgba(239, 68, 68, 0.45)"
                      : "1px solid rgba(245, 158, 11, 0.45)",
                  color: "#e5e7eb",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    marginBottom: "6px",
                  }}
                >
                  🔔 Pending Idle Notification
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#cbd5e1",
                  }}
                >
                  Plant {notificationContext.plant}
                  {" • "}
                  Machine M-{notificationContext.machineNo}
                  {" • "}
                  <strong>
                    {notificationContext.idealMode === "OFFLINE"
                      ? "OFFLINE"
                      : "ONLINE IDLE"}
                  </strong>
                </div>

                {notificationContext.idleStartedAt && (
                  <div
                    style={{
                      marginTop: "5px",
                      fontSize: "12px",
                      color: "#94a3b8",
                    }}
                  >
                    Idle:{" "}
                    {new Date(
                      notificationContext.idleStartedAt,
                    ).toLocaleTimeString("en-IN")}
                    {notificationContext.idleEndedAt && (
                      <>
                        {" → "}
                        {new Date(
                          notificationContext.idleEndedAt,
                        ).toLocaleTimeString("en-IN")}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gap: "24px" }}>
                {/* Plant Selection */}
                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#d1d5db",
                      marginBottom: "10px",
                    }}
                  >
                    <FaIndustry size={15} color="#9ca3af" />
                    Select Plant
                  </label>
                  <select
                    value={plant}
                    onChange={(e) => {
                      setPlant(e.target.value);
                      setMachine("");
                      setOperator("Auto Operator");
                      setTool("");

                      setPendingEvents([]);
                      setSelectedEventId("");
                    }}
                    required
                    style={{
                      width: "100%",
                      backgroundColor: "#1f2937",
                      border: "1px solid #4b5563",
                      borderRadius: "10px",
                      padding: "13px 16px",
                      color: "#e5e7eb",
                      fontSize: "14px",
                      outline: "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#06b6d4")}
                    onBlur={(e) => (e.target.style.borderColor = "#4b5563")}
                  >
                    <option value="">Choose Plant</option>
                    <option value="1">Plant 1 (57 Machines)</option>
                    <option value="2">Plant 2 (46 Machines)</option>
                  </select>
                </div>

                {/* Machine Selection */}
                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#d1d5db",
                      marginBottom: "10px",
                    }}
                  >
                    <FaCog size={15} color="#9ca3af" />
                    Machine Number
                  </label>
                  <select
                    value={machine}
                    onChange={(e) => handleMachineChange(e.target.value)}
                    required
                    disabled={!plant}
                    style={{
                      width: "100%",
                      backgroundColor: plant ? "#1f2937" : "#4b5563",
                      border: "1px solid #4b5563",
                      borderRadius: "10px",
                      padding: "13px 16px",
                      color: plant ? "#e5e7eb" : "#9ca3af",
                      fontSize: "14px",
                      outline: "none",
                      cursor: plant ? "pointer" : "not-allowed",
                      transition: "all 0.2s ease",
                      appearance: "none",
                      backgroundImage: plant
                        ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`
                        : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                    }}
                    onFocus={(e) =>
                      plant && (e.target.style.borderColor = "#06b6d4")
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#4b5563")}
                  >
                    <option value="">Select Machine</option>
                    {plant &&
                      plantMachines[plant].map((num) => (
                        <option key={num} value={num}>
                          Machine {num}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Pending Ideal Event Selection */}
                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#d1d5db",
                      marginBottom: "10px",
                    }}
                  >
                    <FaExclamationTriangle size={15} color="#9ca3af" />
                    Pending Ideal Event
                  </label>

                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    required
                    disabled={
                      !machine || eventsLoading || pendingEvents.length === 0
                    }
                    style={{
                      width: "100%",
                      backgroundColor: "#1f2937",
                      border: "1px solid #4b5563",
                      borderRadius: "10px",
                      padding: "13px 16px",
                      color: "#e5e7eb",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  >
                    <option value="">
                      {eventsLoading
                        ? "Loading Ideal events..."
                        : pendingEvents.length === 0
                        ? "No pending Ideal event"
                        : "Select Ideal Event"}
                    </option>

                    {pendingEvents.map((event) => (
                      <option key={event.event_id} value={event.event_id}>
                        {event.ideal_mode}
                        {" | "}
                        {new Date(event.ideal_start_at).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          },
                        )}
                        {" → "}
                        {new Date(event.ideal_end_at).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          },
                        )}
                        {" | "}
                        {event.duration_minutes} min
                        {" | #"}
                        {event.event_id}
                      </option>
                    ))}
                  </select>

                  {selectedEventId && (
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: "rgba(16, 185, 129, 0.08)",
                        border: "1px solid rgba(16, 185, 129, 0.25)",
                        color: "#6ee7b7",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      ✓ Ideal event selected — verify the start/end time above
                    </div>
                  )}

                  {!selectedEventId && pendingEvents.length > 1 && (
                    <div
                      style={{
                        marginTop: "8px",
                        color: "#fbbf24",
                        fontSize: "12px",
                      }}
                    >
                      Exact automatic match was not found. Please choose one of
                      the nearest
                      {` ${pendingEvents.length} `}
                      events by time.
                    </div>
                  )}
                </div>

                {/* =====================================================
    SAME DOWNTIME REASON FORM AS PLANT LIVE
===================================================== */}

                <div
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(245,158,11,0.08), rgba(2,6,23,0.55))",

                    padding: "24px",

                    borderRadius: "18px",

                    border: "1px solid rgba(245,158,11,0.25)",

                    boxShadow: "inset 0 0 30px rgba(245,158,11,0.04)",
                  }}
                >
                  {/* HEADER */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "24px",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",

                        background: "rgba(245,158,11,0.18)",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        color: "#fbbf24",
                      }}
                    >
                      ⚠
                    </div>

                    <div>
                      <div
                        style={{
                          color: "#fbbf24",
                          fontSize: "17px",
                          fontWeight: "800",
                        }}
                      >
                        Log Downtime Reason
                      </div>

                      <div
                        style={{
                          color: "#94a3b8",
                          fontSize: "11px",
                          marginTop: "2px",
                        }}
                      >
                        Select the exact reason for this pending idle event
                      </div>
                    </div>

                    {notificationContext && (
                      <span
                        style={{
                          marginLeft: "auto",

                          padding: "4px 9px",

                          borderRadius: "6px",

                          fontSize: "11px",
                          fontWeight: "700",

                          color:
                            notificationContext.idealMode === "OFFLINE"
                              ? "#fca5a5"
                              : "#34d399",

                          background:
                            notificationContext.idealMode === "OFFLINE"
                              ? "rgba(239,68,68,0.15)"
                              : "rgba(16,185,129,0.15)",

                          border:
                            notificationContext.idealMode === "OFFLINE"
                              ? "1px solid rgba(239,68,68,0.35)"
                              : "1px solid rgba(16,185,129,0.35)",
                        }}
                      >
                        {notificationContext.idealMode === "OFFLINE"
                          ? "OFFLINE"
                          : "ONLINE (IDLE)"}
                      </span>
                    )}
                  </div>

                  {/* 1. CATEGORY */}

                  <div
                    style={{
                      marginBottom: "18px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "11px",

                        color: "#fcd34d",

                        fontWeight: "800",

                        textTransform: "uppercase",

                        marginBottom: "8px",

                        display: "block",

                        letterSpacing: "1.5px",
                      }}
                    >
                      1. Select Category
                    </label>

                    <CustomDropdown
                      value={idleCategory}
                      placeholder="-- Choose Category --"
                      icon={true}
                      options={Object.keys(IDLE_REASONS)}
                      onChange={(value) => {
                        setIdleCategory(value);

                        // Category change =
                        // old specific reason reset
                        if (value === "Other") {
                          setIdleSubReason("Other");
                        } else {
                          setIdleSubReason("");
                        }

                        setIdleRemarks("");
                      }}
                    />
                  </div>

                  {/* 2. SPECIFIC REASON */}

                  {idleCategory && (
                    <div
                      style={{
                        marginBottom: "18px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "11px",

                          color: "#fcd34d",

                          fontWeight: "800",

                          textTransform: "uppercase",

                          marginBottom: "8px",

                          display: "block",

                          letterSpacing: "1.5px",
                        }}
                      >
                        2. Specific Reason
                      </label>

                      <CustomDropdown
                        value={idleSubReason}
                        placeholder="-- Choose Reason --"
                        icon={false}
                        options={IDLE_REASONS[idleCategory] || []}
                        onChange={(value) => {
                          setIdleSubReason(value);

                          if (value !== "Other") {
                            setIdleRemarks("");
                          }
                        }}
                      />
                    </div>
                  )}

                  {/* 3. REMARK ONLY FOR OTHER */}

                  {idleSubReason === "Other" && (
                    <div
                      style={{
                        marginBottom: "4px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "11px",

                          color: "#10b981",

                          fontWeight: "800",

                          textTransform: "uppercase",

                          marginBottom: "8px",

                          display: "block",

                          letterSpacing: "1.5px",
                        }}
                      >
                        3. Remarks / Exact Issue
                      </label>

                      <textarea
                        rows="3"
                        placeholder="Please type the exact issue..."
                        value={idleRemarks}
                        onChange={(e) => setIdleRemarks(e.target.value)}
                        style={{
                          width: "100%",

                          padding: "14px 18px",

                          borderRadius: "12px",

                          background: "rgba(16,185,129,0.05)",

                          color: "#ffffff",

                          border: "1px solid rgba(16,185,129,0.4)",

                          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)",

                          fontSize: "14px",

                          outline: "none",

                          resize: "vertical",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  loading || !machine || !selectedEventId || !isIdleReasonValid
                }
                style={{
                  width: "100%",
                  background:
                    loading || !machine || !isIdleReasonValid
                      ? "#4b5563"
                      : "#06b6d4",
                  border: "none",
                  borderRadius: "10px",
                  padding: "15px",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor:
                    loading || !machine || !isIdleReasonValid
                      ? "not-allowed"
                      : "pointer",
                  marginTop: "28px",
                  transition: "all 0.2s ease",
                  boxShadow:
                    loading || !machine || !isIdleReasonValid
                      ? "none"
                      : "0 4px 14px rgba(6, 182, 212, 0.35)",
                  letterSpacing: "0.3px",
                }}
                onMouseEnter={(e) => {
                  if (!loading && machine && isIdleReasonValid) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 6px 20px rgba(6, 182, 212, 0.45)";
                    e.target.style.backgroundColor = "#0891b2";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 14px rgba(6, 182, 212, 0.35)";
                  e.target.style.backgroundColor = "#06b6d4";
                }}
              >
                {loading ? "⏳ Submitting Report..." : "✓ Submit Idle Report"}
              </button>

              {/* Info Box */}
              <div
                style={{
                  backgroundColor: "#78350f",
                  border: "1px solid #92400e",
                  borderRadius: "10px",
                  padding: "14px",
                  marginTop: "18px",
                  color: "#fbbf24",
                  fontSize: "13px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "start",
                  lineHeight: "1.5",
                }}
              >
                <FaExclamationTriangle
                  size={15}
                  style={{ flexShrink: 0, marginTop: "2px" }}
                />
                <span>
                  Please provide accurate information about the idle machine for
                  proper tracking and analysis.
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Error Toast */}
      <div
        id="error-toast"
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          backgroundColor: "#dc2626",
          color: "white",
          padding: "14px 22px",
          borderRadius: "10px",
          boxShadow: "0 8px 24px rgba(220, 38, 38, 0.4)",
          zIndex: 1000,
          display: "none",
          fontWeight: "600",
          fontSize: "14px",
          border: "1px solid #991b1b",
        }}
      >
        ❌ Error Saving Idle Report!
      </div>
    </div>
  );
}
