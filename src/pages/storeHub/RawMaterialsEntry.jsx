import React, { useEffect, useRef, useState } from "react";
import {
  Boxes, UploadCloud, ScanBarcode, FileText, CalendarDays, Hash,
  Package, Send, RotateCcw, Download, CheckCircle2,
  AlertCircle, X, Layers3
} from "lucide-react";
import "./RawMaterialsEntry.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
const initial = () => ({ date: today(), invoiceNumber: "", barcode: "", inventory: "", quantity: "", unit: "kg", identificationNumber: "", coilNumber: "", heatNumber: "", others: "" });

const Field = ({ label, required, children, className = "" }) => (
  <label className={`rm-field ${className}`}>
    <span className="rm-label">{label} {required && <b aria-label="required">*</b>}</span>
    {children}
  </label>
);

export default function RawMaterialsEntry() {
  const [form, setForm] = useState(initial);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute("data-theme") || localStorage.getItem("atomone-theme") || "dark");
  const fileRef = useRef(null);
  const barcodeRef = useRef(null);

  useEffect(() => {
    const updateTheme = () => setTheme(document.documentElement.getAttribute("data-theme") || localStorage.getItem("atomone-theme") || "dark");
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const set = (key) => (event) => setForm((old) => ({ ...old, [key]: event.target.value }));
  const chooseFile = (file) => {
    if (!file) return;
    if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) {
      setMessage({ kind: "error", text: "Please upload a PDF, JPG or PNG invoice." }); return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ kind: "error", text: "Invoice file must be 10 MB or smaller." }); return;
    }
    setInvoiceFile(file);
    setMessage(null);
  };
  const reset = () => {
    setForm(initial()); setInvoiceFile(null); setMessage(null);
    if (fileRef.current) fileRef.current.value = "";
  };
  const exportJson = () => {
    const data = { ...form, invoiceFileName: invoiceFile?.name || null };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `raw-material-${form.invoiceNumber || "entry"}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!invoiceFile) { setMessage({ kind: "error", text: "Bill/Invoice attachment is required." }); return; }
    if (!form.barcode.trim() || !form.inventory.trim() || !form.invoiceNumber.trim() || !form.date || !(Number(form.quantity) > 0)) {
      setMessage({ kind: "error", text: "Fill all required fields and enter a positive quantity." }); return;
    }
    const token = localStorage.getItem("access_token");
    if (!token) { setMessage({ kind: "error", text: "Please log in before submitting." }); return; }
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    payload.append("invoiceFile", invoiceFile);
    setBusy(true); setMessage(null);
    try {
      // Backend endpoint must be implemented in Django; see ROUTING_AND_BACKEND.md.
      const response = await fetch(`${API_BASE}/api/store/raw-materials/`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: payload,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.detail || result.error || `Request failed (${response.status})`);
      reset(); setMessage({ kind: "success", text: "Raw material entry submitted successfully." });
    } catch (error) {
      setMessage({ kind: "error", text: `${error.message}. Check that the Django API is configured and running.` });
    } finally { setBusy(false); }
  };

  return (
    <main className={`rm-page ${theme === "light" ? "rm-light" : "rm-dark"}`}>
      <div className="rm-shell">
        <header className="rm-header">
          <div className="rm-heading"><span className="rm-title-icon"><Boxes size={25} /></span><div><h1>Raw Materials <em>Entry</em></h1><p>Inventory intake and material registration</p></div></div>
          <div className="rm-actions">
            <button type="button" className="rm-btn rm-outline" onClick={exportJson}><Download size={16} /> Export</button>
          </div>
        </header>
        <div className="rm-meta"><span className="rm-live"><i /> Entry Form</span><span><CalendarDays size={15} /> {form.date || today()}</span><span><Package size={15} /> Store Hub / Raw Materials</span></div>
        {message && <div role="alert" className={`rm-alert ${message.kind}`}>
          {message.kind === "success" ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}<span>{message.text}</span>
          <button type="button" aria-label="Dismiss message" onClick={() => setMessage(null)}><X size={16}/></button>
        </div>}
        <form id="rm-entry-form" onSubmit={submit}>
          <section className="rm-card rm-intake"><h2><Layers3 size={19} /> Material Intake</h2>
            <div className="rm-two">
              <div className="rm-inner"><div className="rm-label">Bill/Invoice for Entry <b>*</b></div>
                <div tabIndex={0} role="button" aria-label="Upload bill or invoice" onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileRef.current?.click(); } }}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); chooseFile(e.dataTransfer.files[0]); }}
                  className={`rm-dropzone ${dragging ? "dragging" : ""}`}>
                  <UploadCloud size={31}/><strong>{invoiceFile ? invoiceFile.name : "Drag & drop invoice (PDF, JPG, PNG)"}</strong><small>{invoiceFile ? "Click to replace attachment" : "or click to browse"}</small>
                </div>
                <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="rm-hidden" onChange={(e) => chooseFile(e.target.files[0])}/>
                <p className="rm-hint">Max file size: 10 MB · Supported: PDF, JPG, PNG</p>
              </div>
              <div className="rm-inner rm-barcode-panel"><div className="rm-label">Physical Goods with Barcode <b>*</b></div>
                <div className="rm-barcode-line"><span className="rm-scan-icon"><ScanBarcode size={26}/></span><div className="rm-barcode-input"><ScanBarcode size={20}/><input ref={barcodeRef} value={form.barcode} onChange={set("barcode")} placeholder="Scan or enter barcode" required aria-label="Physical goods barcode" /><button type="button" title="Focus barcode input for USB/Bluetooth scanner" onClick={() => barcodeRef.current?.focus()}><ScanBarcode size={21}/></button></div></div>
                <p className="rm-hint">Use a keyboard-compatible barcode scanner or enter the code manually. Camera scanning requires separate integration.</p>
              </div>
            </div>
          </section>
          <div className="rm-detail-grid">
            <section className="rm-card"><h2><FileText size={19} /> Invoice Details</h2>
              <div className="rm-field-stack"><Field label="Date" required><input type="date" required value={form.date} onChange={set("date")}/></Field>
              <Field label="Invoice Number" required><input type="text" required maxLength={100} value={form.invoiceNumber} onChange={set("invoiceNumber")} placeholder="Enter invoice number"/></Field></div>
          <section className="rm-card rm-additional"><h2><FileText size={17}/> Additional Information</h2><Field label="Others (Remarks)"><textarea rows={2} maxLength={500} value={form.others} onChange={set("others")} placeholder="Enter remarks, specifications or any other relevant information..."/></Field><div className="rm-counter">{form.others.length} / 500</div></section>
            </section>
            <section className="rm-card"><h2><Boxes size={19} /> Material Details</h2>
              <div className="rm-fields-grid"><Field className="rm-full" label="Data Entry / Inventory" required><input value={form.inventory} required onChange={set("inventory")} placeholder="Enter inventory or material name / code"/></Field>
              <Field label="Quantity" required><input type="number" min="0.001" step="any" required value={form.quantity} onChange={set("quantity")} placeholder="Enter quantity"/></Field>
              <Field label="Quantity Unit" required><select value={form.unit} onChange={set("unit")} required><option value="kg">kg</option><option value="strips">Strips</option><option value="pieces">Pieces</option></select></Field>
              <Field label="Identification Number (Internal)"><input value={form.identificationNumber} onChange={set("identificationNumber")} placeholder="Enter internal identification number"/></Field>
              <Field label="Coil Number"><input value={form.coilNumber} onChange={set("coilNumber")} placeholder="Enter coil number"/></Field>
              <Field label="Heat Number"><input value={form.heatNumber} onChange={set("heatNumber")} placeholder="Enter heat number"/></Field></div>
            </section>
          </div>
          <div className="rm-footer-actions">
            <button type="button" className="rm-btn rm-outline" onClick={reset} disabled={busy}><RotateCcw size={16} /> Reset</button>
            <button type="submit" className="rm-btn rm-primary" disabled={busy}><Send size={16} /> {busy ? "Submitting..." : "Submit Entry"}</button>
          </div>
        </form>
      </div>
    </main>
  );
}
