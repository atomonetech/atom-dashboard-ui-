import React from "react";
import { ArrowLeft, CheckCircle2, ShieldAlert, Activity, Stamp } from "lucide-react";

/**
 * DynamicReportReview
 *
 * Props (unchanged from before, plus one addition):
 * - reportData: { id, formName, preparedBy, date, status, sections: [{ sectionTitle, fields: [{ label, value, type }] }] }
 * - onBack: () => void
 * - onApprove: () => void
 * - hideActions: boolean   (NEW, optional, default false)
 *      Pass `true` when this component is rendered from the Analysis Hub's
 *      "view report" flow so the Approve/Reject controls are not shown.
 *      Pass `false` / omit it everywhere else and behavior is identical to before.
 */
export default function DynamicReportReview({ reportData, onBack, onApprove, hideActions = false }) {
  if (!reportData) return null;

  const { id, formName, preparedBy, date, status, sections = [] } = reportData;
  const isApproved = status?.toLowerCase() === "approved";

  return (
    <div className="min-h-screen bg-[#F7F8FA] py-10 px-4 md:px-8 font-sans antialiased">
      <div className="max-w-5xl mx-auto">

        {/* --- TOP NAV --- */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm group-hover:border-slate-300 transition-colors">
              <ArrowLeft size={13} />
            </span>
            Back to Desk
          </button>

          <span className="text-[11px] font-mono text-slate-400 tracking-wide">
            REPORT&nbsp;#{id}
          </span>
        </div>

        {/* --- DOCUMENT CARD --- */}
        <div className="relative bg-white rounded-[20px] border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.08)] overflow-hidden">

          {/* ledger spine accent */}
          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-blue-500 via-blue-400 to-indigo-400" />

          {/* --- HERO HEADER --- */}
          <div className="pl-7 pr-6 md:pl-9 md:pr-8 pt-8 pb-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.14em] mb-2 flex items-center gap-1.5">
                <Activity size={12} strokeWidth={2.5} />
                AtomOne Operations Matrix
              </div>
              <h1 className="text-[26px] leading-tight font-bold text-slate-900 tracking-tight truncate">
                {formName}
              </h1>
              <p className="text-[13px] text-slate-500 mt-1.5">
                Logged by <span className="font-semibold text-slate-700">{preparedBy}</span>
                <span className="text-slate-300 mx-1.5">·</span>
                {date}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <StatusBadge status={status} />

              {!hideActions && !isApproved && (
                <button
                  onClick={onApprove}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-[13px] rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.97]"
                >
                  <CheckCircle2 size={16} />
                  Approve Report
                </button>
              )}

              {isApproved && (
                <div className="hidden md:flex items-center gap-1.5 text-emerald-600/80 text-[11px] font-semibold uppercase tracking-wide">
                  <Stamp size={14} />
                  Sealed
                </div>
              )}
            </div>
          </div>

          {/* --- SECTIONS --- */}
          <div className="pl-7 pr-6 md:pl-9 md:pr-8 py-8 space-y-9">
            {sections.map((section, sIdx) => (
              <div key={sIdx}>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-[11px] font-mono text-slate-300 font-semibold tabular-nums">
                    {String(sIdx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    {section.sectionTitle}
                  </h3>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                  {section.fields.map((field, fIdx) => (
                    <FieldCard key={fIdx} field={field} />
                  ))}
                </div>
              </div>
            ))}

            {sections.length === 0 && (
              <div className="flex flex-col items-center justify-center py-14 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-2xl">
                <ShieldAlert className="mb-2 text-slate-300" size={24} />
                No structured data keys discovered for this form type layout.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const isApproved = status?.toLowerCase() === "approved";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border ${
        isApproved
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-amber-50 text-amber-700 border-amber-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isApproved ? "bg-emerald-500" : "bg-amber-500"}`}
      />
      {status || "Under Review"}
    </span>
  );
}

function FieldCard({ field }) {
  const hasValue = field.value !== null && field.value !== undefined && field.value !== "";
  const displayValue = hasValue ? String(field.value) : "—";

  if (field.type === "numeric") {
    return (
      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors">
        <div className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wide">
          {field.label}
        </div>
        <div className="text-[26px] font-extrabold text-slate-800 mt-1 tabular-nums leading-none">
          {displayValue}
        </div>
      </div>
    );
  }

  if (field.type === "highlight") {
    return (
      <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-colors">
        <div className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wide">
          {field.label}
        </div>
        <div className="text-sm font-bold text-blue-700 mt-1.5 flex items-center gap-1.5 break-all">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
          {displayValue}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors">
      <div className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wide">
        {field.label}
      </div>
      <div className="text-sm font-semibold text-slate-800 mt-1.5 break-all">
        {displayValue}
      </div>
    </div>
  );
}