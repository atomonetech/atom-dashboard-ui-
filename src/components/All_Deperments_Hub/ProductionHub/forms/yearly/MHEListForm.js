import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MHEListForm = () => {
  const today = new Date().toISOString().split("T")[0];

  const checklistPoints = [
    "Painting",
    "Name Plate",
    "Locking System",
    "Castor Wheel",
    "Fork Guide",
    "Plastic Pipe (PP) Strip",
    "Transparent Pipe",
    "Cup",
    "Lock Pin",
    "Cushioning",
    "Cantilevers",
  ];

  const createRow = (point) => ({
    point,

    pm1Date: "",
    pm1Status: "",
    pm1Remarks: "",

    pm2Date: "",
    pm2Status: "",
    pm2Remarks: "",

    pm3Date: "",
    pm3Status: "",
    pm3Remarks: "",
  });

  const [date, setDate] = useState(today);
  const navigate = useNavigate();
  const [partName, setPartName] = useState("");
  const [trolleyNo, setTrolleyNo] = useState("");
  const [frequency, setFrequency] = useState("4 Months");
  const [selectedPM, setSelectedPM] = useState("pm1");
  const [remarks, setRemarks] = useState("");
  const [checkedBy, setCheckedBy] = useState("");
  const [verifiedBy, setVerifiedBy] = useState("");

  const [rows, setRows] = useState(
    checklistPoints.map((item) => createRow(item)),
  );

  const updateCell = (index, key, value) => {
    const updated = [...rows];
    updated[index][key] = value;
    setRows(updated);
  };

  const handleReset = () => {
    setPartName("");
    setTrolleyNo("");
    setFrequency("4 Months");
    setRemarks("");
    setCheckedBy("");
    setVerifiedBy("");
    setDate(today);
    setRows(checklistPoints.map((item) => createRow(item)));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("✅ Preventive Maintenance Checklist Saved Successfully!");
  };

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        body{
          background:white;
        }

        .pm-root{
          min-height:100vh;
          background:#f0fafb;
          padding:20px;
          font-family:Inter,sans-serif;
        }

        .pm-container{
          max-width:1500px;
          margin:auto;
          background:white;
          border-radius:16px;
          border:1px solid #cceef3;
          padding:20px;
          box-shadow:0 4px 15px rgba(0,0,0,0.08);
        }

        .header{
          border:2px solid #0891b2;
          border-radius:12px;
          overflow:hidden;
          margin-bottom:20px;
        }

        .header-top{
          display:grid;
          grid-template-columns:180px 1fr 220px;
        }

        .logo-section{
          display:flex;
          justify-content:center;
          align-items:center;
          background:#e0f7fa;
          border-right:1px solid #cceef3;
          min-height:90px;
        }

        .logo-box{
          width:120px;
          height:50px;
          border:2px dashed #0891b2;
          display:flex;
          justify-content:center;
          align-items:center;
          border-radius:8px;
          color:#0891b2;
          font-weight:600;
          font-size:12px;
        }

        .title-section{
          display:flex;
          justify-content:center;
          align-items:center;
          padding:20px;
          text-align:center;
          background:white;
          border-right:1px solid #cceef3;
        }

        .title-section h2{
          font-size:20px;
          color:#0e4a55;
          font-weight:700;
        }

        .meta-section{
          background:#f0fafb;
          padding:15px;
        }

        .meta-section label{
          display:block;
          margin-bottom:5px;
          font-size:12px;
          font-weight:600;
          color:#0e4a55;
        }

        .meta-section input{
          width:100%;
          padding:8px;
          border:1px solid #cceef3;
          border-radius:8px;
        }

        .info-grid{
          display:grid;
          grid-template-columns:1fr 1fr 1fr;
          gap:15px;
          margin-bottom:20px;
        }

        .field{
          display:flex;
          flex-direction:column;
        }

        .field label{
          margin-bottom:5px;
          font-size:12px;
          font-weight:600;
          color:#0e4a55;
        }

        .field input,
        .field select,
        .field textarea{
          padding:10px;
          text:gray-700;
          border:1px solid #cceef3;
          border-radius:8px;
          background:transparent;
        }

        .table-wrapper{
          overflow-x:auto;
        }

        table{
          width:100%;
          border-collapse:collapse;
          min-width:1300px;
        }

        th{
          background:linear-gradient(135deg,#0891b2,#06b6d4);
          color:white;
          border:1px solid #0e7490;
          padding:10px;
          font-size:12px;
        }

        td{
          border:1px solid #cceef3;
          padding:4px;
        }

        td input{
          width:100%;
          border:none;
          padding:7px;
          outline:none;
          background:transparent;
        }

        tr:nth-child(even){
          background:#f8fdfe;
        }

        .footer{
          margin-top:20px;
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:15px;
        }

        .remarks{
          margin-top:20px;
        }

        .legend{
          margin-top:20px;
          display:flex;
          gap:10px;
          flex-wrap:wrap;
        }

        .badge{
          padding:8px 14px;
          border-radius:20px;
          font-size:12px;
          font-weight:600;
        }

        .ok{
          background:#dcfce7;
          color:#15803d;
        }

        .notok{
          background:#fee2e2;
          color:#dc2626;
        }

        .na{
          background:#fef3c7;
          color:#d97706;
        }

        .action-bar{
          margin-top:25px;
          display:flex;
          justify-content:flex-end;
          gap:10px;
        }

        .btn{
          border:none;
          padding:12px 24px;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
        }

        .reset-btn{
          background:#e2e8f0;
        }

        .save-btn{
          background:linear-gradient(135deg,#0891b2,#06b6d4);
          color:white;
        }

        @media(max-width:900px){
          .header-top{
            grid-template-columns:1fr;
          }

          .title-section{
            border-right:none;
          }

          .info-grid{
            grid-template-columns:1fr;
          }

          .footer{
            grid-template-columns:1fr;
          }
        }
          .company-logo{
  width:140px;
  height:80px;
  object-fit:contain;
}

.checkpoint-cell{
  min-width:300px;
  font-weight:600;
  color:#0e4a55;
}

.status-group{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}

.status-group label{
  display:flex;
  align-items:center;
  gap:4px;
  font-size:13px;
}

.status-group input{
  width:auto;
}

td{
  padding:12px;
  font-size:14px;
}

tbody tr{
  height:65px;
}
      `}</style>

      <div className="pm-root">
        <form className="pm-container" onSubmit={handleSave}>
          {/* HEADER */}
          <div className="header">
              <button
              type="button"
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              ‹
            </button>
            <div className="header-top">
                
              <div className="logo-section">
                <img
                  src="/logo1.jpg"
                  alt="Company Logo"
                  className="company-logo"
                />
              </div>

              <div className="title-section">
                <h2>
                  PREVENTIVE MAINTENANCE OF MATERIAL HANDLING EQUIPMENT
                  CHECKLIST
                </h2>
              </div>

              <div className="meta-section">
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="info-grid">
            <div className="field">
              <label>Part Name / No.</label>
              <input
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder="Enter Part Name"
              />
            </div>

            <div className="field">
              <label>Trolley / Pallet / Bin / Tray No.</label>
              <input
                value={trolleyNo}
                onChange={(e) => setTrolleyNo(e.target.value)}
                placeholder="Enter Number"
              />
            </div>

            <div className="field">
              <label>PM Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option>1 Month</option>
                <option>2 Months</option>
                <option>3 Months</option>
                <option>4 Months</option>
                <option>6 Months</option>
                <option>Yearly</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          {/* <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th rowSpan="2">Sr. No.</th>
                  <th rowSpan="2">Check Points</th>
                  <th colSpan="2">PM Status - 1</th>
                  <th colSpan="2">PM Status - 2</th>
                  <th colSpan="2">PM Status - 3</th>
                </tr>
                <tr>
                  <th>Done On</th>
                  <th>Remarks</th>
                  <th>Done On</th>
                  <th>Remarks</th>
                  <th>Done On</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "center" }}>{index + 1}</td>

                    <td>{row.point}</td>

                    <td>
                      <input
                        type="date"
                        value={row.pm1Date}
                        onChange={(e) =>
                          updateCell(index, "pm1Date", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={row.pm1Remarks}
                        onChange={(e) =>
                          updateCell(index, "pm1Remarks", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="date"
                        value={row.pm2Date}
                        onChange={(e) =>
                          updateCell(index, "pm2Date", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={row.pm2Remarks}
                        onChange={(e) =>
                          updateCell(index, "pm2Remarks", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="date"
                        value={row.pm3Date}
                        onChange={(e) =>
                          updateCell(index, "pm3Date", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={row.pm3Remarks}
                        onChange={(e) =>
                          updateCell(index, "pm3Remarks", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
          <div className="field" style={{ marginBottom: "20px" }}>
            <label>PM Cycle</label>

            <select
              value={selectedPM}
              onChange={(e) => setSelectedPM(e.target.value)}
            >
              <option value="pm1">PM Status 1</option>
              <option value="pm2">PM Status 2</option>
              <option value="pm3">PM Status 3</option>
            </select>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Check Point</th>
                  <th>Status</th>
                  <th>Done On</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td className="checkpoint-cell">{row.point}</td>

                    <td>
                      <div className="status-group">
                        <label>
                          <input
                            type="radio"
                            name={`${selectedPM}-${index}`}
                            checked={row[`${selectedPM}Status`] === "OK"}
                            onChange={() =>
                              updateCell(index, `${selectedPM}Status`, "OK")
                            }
                          />
                          OK
                        </label>

                        <label>
                          <input
                            type="radio"
                            name={`${selectedPM}-${index}`}
                            checked={row[`${selectedPM}Status`] === "NOT_OK"}
                            onChange={() =>
                              updateCell(index, `${selectedPM}Status`, "NOT_OK")
                            }
                          />
                          Not OK
                        </label>

                        <label>
                          <input
                            type="radio"
                            name={`${selectedPM}-${index}`}
                            checked={row[`${selectedPM}Status`] === "NA"}
                            onChange={() =>
                              updateCell(index, `${selectedPM}Status`, "NA")
                            }
                          />
                          N/A
                        </label>
                      </div>
                    </td>

                    <td>
                      <input
                        type="date"
                        value={row[`${selectedPM}Date`]}
                        onChange={(e) =>
                          updateCell(index, `${selectedPM}Date`, e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        placeholder="Enter remarks"
                        value={row[`${selectedPM}Remarks`]}
                        onChange={(e) =>
                          updateCell(
                            index,
                            `${selectedPM}Remarks`,
                            e.target.value,
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* REMARKS */}
          <div className="remarks">
            <div className="field">
              <label>Remarks</label>
              <textarea
                rows="3"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="footer">
            <div className="field">
              <label>Checked By</label>
              <input
                value={checkedBy}
                onChange={(e) => setCheckedBy(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Verified By</label>
              <input
                value={verifiedBy}
                onChange={(e) => setVerifiedBy(e.target.value)}
              />
            </div>
          </div>

          {/* LEGEND */}
          <div className="legend">
            <div className="badge ok checkbox">✓ OK</div>
            <div className="badge notok">✕ NOT OK</div>
            <div className="badge na">NA NOT REQUIRED</div>
          </div>

          {/* BUTTONS */}
          <div className="action-bar">
            <button
              type="button"
              className="btn reset-btn"
              onClick={handleReset}
            >
              Reset
            </button>

            <button type="submit" className="btn save-btn">
              Save Checklist
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default MHEListForm;
