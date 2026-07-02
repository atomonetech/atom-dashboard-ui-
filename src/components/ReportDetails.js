import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Search,
  Eye,
  AlertCircle,
  CheckCircle,
  Filter,
  X,
  FileText,
  LayoutGrid,
  ChevronDown,
  Bell,
  User as UserIcon,
  ExternalLink,
  MessageSquare,
  Clock,
  Loader2,
  BarChart3,
} from "lucide-react";

const APPROVAL_KEYS = new Set([
  "id", "approval_status", "Approved By", "Rejected By", "Approver_remarks",
  "approved_or_rejected_at", "created_at", "updated_at"
]);
const QUANTITY_KEYS = new Set(["planned_quantity", "achieved_quantity", "qty_remark"]);

const PILL_KEY_PATTERN = /prepared|submitted/i;

const FORM_FIELD_OVERRIDES = {
  "daily-prod-plan": {
    title: "Daily Production Plan",
    order: [
      "plant", "shift", "machine_no", "operator_name", "operation_name",
      "part_name", "part_no", "production_start_time", "production_end_time",
      "total_working_time", "tool_setup_time", "machine_bd_time", "tool_bd_time",
      "rm_coil_no", "plan_date"
    ],
    highlight: ["plan_date", "part_name", "part_no"],
    labels: {
      rm_coil_no: "RM Coil No.",
      machine_bd_time: "Machine Breakdown (min)",
      tool_bd_time: "Tool Breakdown (min)",
      tool_setup_time: "Tool Setup Time (min)"
    },
    hide: []
  },
  "incoming": {
    title: "Incoming Material Inspection",
    order: ["date", "part_name", "part_no"],
    highlight: ["date", "part_name", "part_no"]
  }
};

const getFormOverrides = (formRoute) => FORM_FIELD_OVERRIDES[formRoute] || {};

const applyOverrides = (entries, overrides) => {
  const order = overrides.order || [];
  const hideSet = new Set(overrides.hide || []);
  const orderIndex = new Map(order.map((k, i) => [k, i]));

  return entries
    .filter(([k]) => !hideSet.has(k))
    .map(([k, v], originalIndex) => ({ k, v, originalIndex }))
    .sort((a, b) => {
      const ai = orderIndex.has(a.k) ? orderIndex.get(a.k) : order.length + a.originalIndex;
      const bi = orderIndex.has(b.k) ? orderIndex.get(b.k) : order.length + b.originalIndex;
      return ai - bi;
    })
    .map(({ k, v }) => [k, v]);
};

const prettifyKey = (key, overrides = {}) => {
  if (overrides.labels && overrides.labels[key]) return overrides.labels[key];
  const spaced = String(key).replace(/[_-]/g, " ").trim();
  const titled = spaced.replace(/\b\w/g, (c) => c.toUpperCase());
  return titled
    .replace(/\bNo\b/g, "No.")
    .replace(/\bRm\b/g, "RM")
    .replace(/\bPm\b/g, "PM")
    .replace(/\bBd\b/g, "Breakdown")
    .replace(/\bQty\b/g, "Qty");
};

const isPlainObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);

const isEmptyValue = (value) =>
  value === null ||
  value === undefined ||
  value === "" ||
  (typeof value === "string" && value.toLowerCase() === "null");

const formatFieldValue = (value) => {
  if (isEmptyValue(value)) return "—";
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? `${value.length} item${value.length === 1 ? "" : "s"}` : "—";
  if (isPlainObject(value)) {
    const count = Object.keys(value).length;
    return count ? `${count} field${count === 1 ? "" : "s"}` : "—";
  }
  return value;
};

const isSrColumn = (key) => /^sr(_no)?$/i.test(key) || /^sr\s*no\.?$/i.test(key);
const isBadgeColumn = (key) => /type|category/i.test(key);
const isToleranceColumn = (key) => /tol/i.test(key);
const isEmphasisColumn = (key) => /param|item\b|name\b/i.test(key);
const isWideTextColumn = (key) => /spec|desc|remark|note|instruction/i.test(key);

const getColumnMinWidth = (key) => {
  if (isSrColumn(key)) return 56;
  if (isToleranceColumn(key)) return 100;
  if (isBadgeColumn(key)) return 110;
  if (isWideTextColumn(key)) return 240;
  if (isEmphasisColumn(key)) return 160;
  if (/reading/i.test(key)) return 140;
  return 130;
};

const isNumberedValueKey = (key) => /^(val|reading|read|v|r)[\s_-]?\d+$/i.test(String(key).trim());

// --- Generic "readings live in a sibling logs array" merge -----------------
// On several forms the API returns parameter definitions (SR/spec/tolerance)
// and the actual measured values as two SIBLING arrays — e.g.
// { parameters: [...], logs: [ { readings: { "1": {...}, "2": {...} }, ... } ] }
// — at ANY depth in the response (not necessarily top-level). This walks the
// whole object tree, and wherever it finds that pairing, folds each log's
// readings into the matching parameter row (matched by SR number) as a new
// trailing column, then drops the now-redundant logs array. If no such
// pairing exists anywhere, the data is returned unchanged — so this is a
// no-op (and therefore safe) for every other form.
const PARAM_ARRAY_KEY_PATTERN = /param/i;
const LOG_ARRAY_KEY_PATTERN = /log/i;
const STAGE_LABEL_KEY_PATTERN = /basestage|base_stage|stage|label|phase|entryformat/i;

const getParamSr = (param) => {
  if (!isPlainObject(param)) return null;
  const raw = param.sr_no ?? param.SR ?? param.sr ?? param.Sr ?? param["Sr No"] ?? param["sr no"];
  if (raw === undefined || raw === null || raw === "") return null;
  return String(raw).trim();
};

// Finds the nested object inside one log entry that actually holds the
// per-parameter readings (keyed by SR number as a string).
const findReadingsContainer = (logEntry, paramSrSet) => {
  if (!isPlainObject(logEntry)) return null;
  const directKey = Object.keys(logEntry).find((k) => /reading/i.test(k) && isPlainObject(logEntry[k]));
  if (directKey) return logEntry[directKey];

  let best = null;
  let bestScore = 0;
  Object.values(logEntry).forEach((v) => {
    if (isPlainObject(v)) {
      const score = Object.keys(v).filter((k) => paramSrSet.has(k)).length;
      if (score > bestScore) {
        bestScore = score;
        best = v;
      }
    }
  });
  return bestScore > 0 ? best : null;
};

const getLogLabel = (logEntry, index) => {
  if (isPlainObject(logEntry)) {
    const key = Object.keys(logEntry).find(
      (k) => STAGE_LABEL_KEY_PATTERN.test(k) && typeof logEntry[k] === "string" && logEntry[k].trim() !== ""
    );
    if (key) return String(logEntry[key]).trim();
  }
  return `Log ${index + 1}`;
};

const mergeParametersWithLogs = (parametersArr, logsArr) => {
  if (!Array.isArray(parametersArr) || !Array.isArray(logsArr) || logsArr.length === 0) return null;
  if (!parametersArr.every(isPlainObject)) return null;

  const paramSrSet = new Set(parametersArr.map(getParamSr).filter(Boolean));
  if (paramSrSet.size === 0) return null;

  const containers = logsArr.map((log) => findReadingsContainer(log, paramSrSet));
  if (!containers.some((c) => c !== null)) return null;

  const rawLabels = logsArr.map((log, idx) => getLogLabel(log, idx));
  const labelCounts = {};
  rawLabels.forEach((l) => { labelCounts[l] = (labelCounts[l] || 0) + 1; });
  const seenSoFar = {};
  const columnLabels = rawLabels.map((l) => {
    if (labelCounts[l] > 1) {
      seenSoFar[l] = (seenSoFar[l] || 0) + 1;
      return `${l} ${seenSoFar[l]}`;
    }
    return l;
  });

  return parametersArr.map((param) => {
    const sr = getParamSr(param);
    const enriched = { ...param };
    logsArr.forEach((log, idx) => {
      const container = containers[idx];
      const readingValue = sr && container && container[sr] !== undefined ? container[sr] : "—";
      enriched[columnLabels[idx]] = readingValue;
    });
    return enriched;
  });
};

// Recursively walks the full response and applies the merge wherever a
// parameters/logs sibling pair is found, at any depth.
const mergeReadingsIntoParameters = (node) => {
  if (Array.isArray(node)) return node.map(mergeReadingsIntoParameters);
  if (!isPlainObject(node)) return node;

  const keys = Object.keys(node);
  const paramKey = keys.find(
    (k) => PARAM_ARRAY_KEY_PATTERN.test(k) && Array.isArray(node[k]) && node[k].length > 0 && node[k].every(isPlainObject)
  );
  const logKey = keys.find(
    (k) => LOG_ARRAY_KEY_PATTERN.test(k) && Array.isArray(node[k]) && node[k].length > 0 && node[k].every(isPlainObject)
  );

  let mergedParams = null;
  if (paramKey && logKey) {
    mergedParams = mergeParametersWithLogs(node[paramKey], node[logKey]);
  }

  const result = {};
  keys.forEach((k) => {
    if (mergedParams && k === logKey) return; // folded into parameters, drop the now-redundant logs array
    if (mergedParams && k === paramKey) {
      result[k] = mergedParams;
      return;
    }
    result[k] = mergeReadingsIntoParameters(node[k]);
  });
  return result;
};

const CompactCellValue = ({ value }) => {
  if (isEmptyValue(value)) return <span className="text-gray-400">—</span>;
  if (typeof value === "boolean") return <span>{value ? "Yes" : "No"}</span>;
  if (typeof value === "number") return <span>{value.toLocaleString()}</span>;

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-gray-400">—</span>;
    const allPrimitive = value.every((item) => item === null || typeof item !== "object");
    if (allPrimitive) {
      return (
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {value.map((item, i) => (
            <span key={i} className="whitespace-nowrap">
              {isEmptyValue(item) ? "—" : typeof item === "number" ? item.toLocaleString() : String(item)}
            </span>
          ))}
        </div>
      );
    }
    return <span className="text-xs italic text-gray-500">{value.length} entries</span>;
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) return <span className="text-gray-400">—</span>;

    const numbered = entries.filter(([k]) => isNumberedValueKey(k));
    const named = entries.filter(([k]) => !isNumberedValueKey(k));
    const numberedFilled = numbered.filter(([, v]) => !isEmptyValue(v));
    const namedFilled = named.filter(([, v]) => !isEmptyValue(v));

    if (numbered.length > 0) {
      if (numberedFilled.length === 0 && namedFilled.length === 0) {
        return <span className="text-gray-400">—</span>;
      }
      return (
        <div className="flex flex-col gap-0.5">
          {numberedFilled.length > 0 && (
            <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 font-bold text-gray-800">
              {numberedFilled.map(([k, v]) => (
                <span key={k} className="whitespace-nowrap">{formatFieldValue(v)}</span>
              ))}
            </div>
          )}
          {namedFilled.map(([k, v]) => (
            <span key={k} className="text-xs">
              <span className="text-gray-400">{prettifyKey(k)}: </span>
              <span className="font-semibold text-gray-700">{formatFieldValue(v)}</span>
            </span>
          ))}
        </div>
      );
    }

    const visible = namedFilled.length > 0 ? namedFilled : named;
    if (visible.length === 0) return <span className="text-gray-400">—</span>;
    return (
      <div className="flex flex-col gap-0.5">
        {visible.slice(0, 6).map(([nk, nv]) => (
          <span key={nk} className="text-xs">
            <span className="text-gray-400">{prettifyKey(nk)}: </span>
            <span className="font-semibold text-gray-700">{formatFieldValue(nv)}</span>
          </span>
        ))}
        {visible.length > 6 && (
          <span className="text-[10px] italic text-gray-400">+{visible.length - 6} more</span>
        )}
      </div>
    );
  }

  if (typeof value === "string" && value.includes("\n")) {
    return (
      <div className="flex flex-col font-bold text-gray-900 leading-tight">
        {value.split("\n").map((line, idx) => (
          <span key={idx} className="block">{line}</span>
        ))}
      </div>
    );
  }

  return <span>{String(value)}</span>;
};

const getColumnMeta = (columns, items) => {
  return columns.map((col) => {
    const values = items
      .map((item) => (isPlainObject(item) ? item[col] : undefined))
      .filter((v) => !isEmptyValue(v));

    if (values.length > 0 && values.every((v) => isPlainObject(v))) {
      const subKeys = [];
      values.forEach((v) => {
        Object.keys(v).forEach((k) => {
          if (!subKeys.includes(k)) subKeys.push(k);
        });
      });
      if (subKeys.length > 0 && subKeys.length <= 20) {
        return { key: col, type: "object", subKeys };
      }
    }

    return { key: col, type: "simple" };
  });
};

const ArrayOfObjectsTable = ({ items, overrides }) => {
  const columns = [];
  items.forEach((item) => {
    if (isPlainObject(item)) {
      Object.keys(item).forEach((k) => {
        if (!columns.includes(k)) columns.push(k);
      });
    }
  });

  if (columns.length === 0) return <span className="text-gray-400">—</span>;

  const columnMeta = getColumnMeta(columns, items);
  const hasFlattenedColumns = columnMeta.some((c) => c.type === "object");

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {columnMeta.map((meta) => {
              if (meta.type === "object") {
                return (
                  <th
                    key={meta.key}
                    colSpan={meta.subKeys.length}
                    className="px-4 py-2.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase text-center border-b border-gray-200 border-l border-gray-100"
                  >
                    {prettifyKey(meta.key, overrides)}
                  </th>
                );
              }
              return (
                <th
                  key={meta.key}
                  rowSpan={hasFlattenedColumns ? 2 : 1}
                  style={{ minWidth: `${getColumnMinWidth(meta.key)}px` }}
                  className={`px-4 py-3 text-[10px] font-bold tracking-wider text-gray-400 uppercase whitespace-nowrap border-b border-gray-200 align-bottom ${isSrColumn(meta.key) ? "text-center" : ""}`}
                >
                  {prettifyKey(meta.key, overrides)}
                </th>
              );
            })}
          </tr>
          {hasFlattenedColumns && (
            <tr className="bg-gray-50 border-b border-gray-200">
              {columnMeta.map((meta) => {
                if (meta.type !== "object") return null;
                return meta.subKeys.map((sk) => (
                  <th
                    key={`${meta.key}__${sk}`}
                    style={{ minWidth: "88px" }}
                    className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-400 uppercase whitespace-nowrap text-center border-l border-gray-100"
                  >
                    {prettifyKey(sk, overrides)}
                  </th>
                ));
              })}
            </tr>
          )}
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50/60 align-top">
              {columnMeta.map((meta) => {
                const cellValue = isPlainObject(item) ? item[meta.key] : undefined;

                if (meta.type === "object") {
                  return meta.subKeys.map((sk) => (
                    <td
                      key={`${meta.key}__${sk}`}
                      className="px-3 py-3 text-sm font-semibold text-gray-700 text-center border-l border-gray-50"
                    >
                      <CompactCellValue value={isPlainObject(cellValue) ? cellValue[sk] : undefined} />
                    </td>
                  ));
                }

                let cellClass = "px-4 py-3 text-sm font-semibold text-gray-700";
                if (isSrColumn(meta.key)) cellClass += " text-center text-gray-500 font-bold";
                else if (isEmphasisColumn(meta.key)) cellClass += " font-bold text-gray-900";
                else if (isToleranceColumn(meta.key)) cellClass += " text-rose-500 font-bold whitespace-nowrap";

                if (isBadgeColumn(meta.key) && typeof cellValue === "string" && cellValue.trim() !== "") {
                  return (
                    <td key={meta.key} style={{ minWidth: `${getColumnMinWidth(meta.key)}px` }} className="px-4 py-3">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md bg-indigo-50 text-indigo-600">
                        {cellValue}
                      </span>
                    </td>
                  );
                }

                return (
                  <td key={meta.key} style={{ minWidth: `${getColumnMinWidth(meta.key)}px` }} className={cellClass}>
                    <CompactCellValue value={cellValue} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DetailTableSection = ({ label, value, overrides }) => {
  const rowCount = Array.isArray(value) ? value.length : null;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 w-full min-w-0">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-50 flex-shrink-0">
          <LayoutGrid size={13} className="text-indigo-500" />
        </span>
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
          {label}
          {rowCount !== null && (
            <span className="text-gray-400 font-semibold normal-case tracking-normal"> — {rowCount} row{rowCount === 1 ? "" : "s"}</span>
          )}
        </p>
      </div>
      <ValueRenderer value={value} overrides={overrides} />
    </div>
  );
};

const ValueRenderer = ({ value, overrides }) => {
  if (isEmptyValue(value)) {
    return <span className="text-gray-400 font-medium">—</span>;
  }
  if (typeof value === "boolean") {
    return <span className="font-bold text-gray-900">{value ? "Yes" : "No"}</span>;
  }
  if (typeof value === "number") {
    return <span className="font-bold text-gray-900">{value.toLocaleString()}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-gray-400 font-medium">—</span>;
    const allPrimitive = value.every((item) => item === null || typeof item !== "object");
    if (allPrimitive) {
      return (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {value.map((item, i) => (
            <span key={i} className="text-xs font-bold px-2 py-1 rounded-md bg-gray-100 text-gray-700">
              {isEmptyValue(item) ? "—" : String(item)}
            </span>
          ))}
        </div>
      );
    }
    return <ArrayOfObjectsTable items={value} overrides={overrides} />;
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) return <span className="text-gray-400 font-medium">—</span>;

    const isWideValue = (v) =>
      (Array.isArray(v) && v.some((item) => isPlainObject(item))) ||
      (isPlainObject(v) && Object.keys(v).length > 0);

    const simpleEntries = entries.filter(([, v]) => !isWideValue(v));
    const wideEntries = entries.filter(([, v]) => isWideValue(v));

    return (
      <div className="flex flex-col gap-4 mt-1.5 w-full">
        {simpleEntries.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {simpleEntries.map(([nk, nv]) => (
              <div key={nk} className="min-w-0">
                <p className="text-[9px] font-bold tracking-wider text-gray-400 uppercase mb-1">{prettifyKey(nk, overrides)}</p>
                <div className="text-sm font-bold text-gray-900 break-words">
                  <ValueRenderer value={nv} overrides={overrides} />
                </div>
              </div>
            ))}
          </div>
        )}
        {wideEntries.map(([nk, nv]) => (
          <DetailTableSection key={nk} label={prettifyKey(nk, overrides)} value={nv} overrides={overrides} />
        ))}
      </div>
    );
  }

  return <span className="font-bold text-gray-900">{String(value)}</span>;
};

const FieldCell = ({ label, value, isPill }) => {
  const empty = isEmptyValue(value);
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1.5">{label}</p>
      {isPill && !empty ? (
        <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
          {formatFieldValue(value)}
        </span>
      ) : (
        <p className={`text-sm font-bold break-words ${empty ? "text-gray-400" : "text-gray-900"}`}>
          {formatFieldValue(value)}
        </p>
      )}
    </div>
  );
};

// Small colored pill used for workflow-people fields (Prepared / Submitted /
// Approved / Rejected By) so approval outcome has an obvious color cue.
const WorkflowPersonPill = ({ label, value, tone }) => {
  const toneClasses = {
    indigo: "text-indigo-600 bg-indigo-50",
    slate: "text-slate-600 bg-slate-100",
    emerald: "text-emerald-600 bg-emerald-50",
    rose: "text-rose-600 bg-rose-50"
  };
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1.5">{label}</p>
      <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md ${toneClasses[tone] || toneClasses.slate}`}>
        {value}
      </span>
    </div>
  );
};

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://192.168.0.34:8000";

export default function ReportDetails({ department, headEmail, onBack, initialSearch = "", plantTitle = "Plant 1" }) {

  const [operatorRows, setOperatorRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeReport, setActiveReport] = useState(null);

  const activeOverrides = activeReport ? getFormOverrides(activeReport.meta.formRoute) : {};

  const deptLabel = department && department.toLowerCase().includes("department")
    ? department
    : `${department} Department`;

  useEffect(() => {
    if (!headEmail) return;

    const fetchDepartmentStats = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const targetUrl = `${API_BASE_URL}/api/department-stats/?username=${headEmail}`;
        const res = await fetch(targetUrl);
        const data = await res.json();

        if (res.ok) {
          setOperatorRows(data || []);
        } else {
          setErrorMessage(data.error || "Failed to download data matrix.");
        }
      } catch (err) {
        console.error("Transmission Error:", err);
        setErrorMessage("Network interface unreachable.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentStats();
  }, [headEmail]);

  const getRoutingInfo = (message) => {
    const msg = String(message || "").toLowerCase();
    let formRoute = 'deviation';
    let hub = 'qa-hub';

    if (msg.includes('daily prod')) { formRoute = 'daily-prod-plan'; hub = 'production-hub'; }
    else if (msg.includes('4m change insp') || (msg.includes('4m') && msg.includes('insp'))) { formRoute = 'four-m-inspection'; hub = 'production-hub'; }
    else if (msg.includes('4m track') || msg.includes('4m record') || msg.includes('4m tracking summary')) { formRoute = 'four-m-record'; hub = 'production-hub'; }
    else if (msg.includes('4m display')) { formRoute = 'four-m-display'; hub = 'production-hub'; }
    else if (msg.includes('4m summary')) { formRoute = 'four-m-summary'; hub = 'production-hub'; }
    else if (msg.includes('tip chage') || msg.includes('tip change')) { formRoute = 'tip-change'; hub = 'production-hub'; }
    else if (msg.includes('bin trolley') || msg.includes('bintrolley') || msg.includes('trolley')) { formRoute = 'bin-trolley'; hub = 'production-hub'; }
    else if (msg.includes('5s') || msg.includes('five s')) { formRoute = 'five-s'; hub = 'production-hub'; }
    else if (msg.includes('monthly prod')) { formRoute = 'monthly-prod-plan'; hub = 'production-hub'; }
    else if (msg.includes('observance check')) { formRoute = 'operator-observance-checklist'; hub = 'production-hub'; }
    else if (msg.includes('observance plan')) { formRoute = 'operator-observance-plan'; hub = 'production-hub'; }
    else if (msg.includes('pm checklist') || msg.includes('pm mhe') || msg.includes('preventive')) { formRoute = 'pm-checklist-mhe'; hub = 'production-hub'; }
    else if (msg.includes('projection welder')) { formRoute = 'projection-welder'; hub = 'production-hub'; }
    else if (msg.includes('spot welder')) { formRoute = 'spot-welder'; hub = 'production-hub'; }
    else if (msg.includes('tig') || msg.includes('mig')) { formRoute = 'tig-mig-welder'; hub = 'production-hub'; }
    else if (msg.includes('process validation')) { formRoute = 'process-validation'; hub = 'production-hub'; }
    else if (msg.includes('deviation')) { formRoute = 'deviation'; hub = 'qa-hub'; }
    else if (msg.includes('redbin attendance') || msg.includes('red bin attendance')) { formRoute = 'redbin-attendance'; hub = 'qa-hub'; }
    else if (msg.includes('redbin') || msg.includes('red bin') || msg.includes('red bin analy')) { formRoute = 'redbin'; hub = 'qa-hub'; }
    else if (msg.includes('incoming')) { formRoute = 'incoming'; hub = 'qa-hub'; }
    else if (msg.includes('scrap')) { formRoute = 'scrap'; hub = 'qa-hub'; }
    else if (msg.includes('poka')) { formRoute = 'poka-yoke'; hub = 'qa-hub'; }
    else if (msg.includes('inspection')) { formRoute = 'inspection'; hub = 'qa-hub'; }
    else if (msg.includes('pdi')) { formRoute = 'pdi'; hub = 'qa-hub'; }
    else if (msg.includes('rework')) { formRoute = 'rework'; hub = 'qa-hub'; }
    else if (msg.includes('sample')) { formRoute = 'sample-inspection'; hub = 'qa-hub'; }
    else if (msg.includes('good receipt') || msg.includes('requisition')) { formRoute = 'good-receipt'; hub = 'qa-hub'; }
    else if (msg.includes('rm quality') || msg.includes('raw material')) { formRoute = 'rm-quality-plan'; hub = 'qa-hub'; }
    else if (msg.includes('process audit')) { formRoute = 'process-audit'; hub = 'qa-hub'; }
    else if (msg.includes('coherence')) { formRoute = 'coherence'; hub = 'qa-hub'; }
    else if (msg.includes('layout')) { formRoute = 'layout-inspection'; hub = 'qa-hub'; }
    else if (msg.includes('product audit')) { formRoute = 'product-audit-plan'; hub = 'qa-hub'; }
    else if (msg.includes('customer complaint')) { formRoute = 'customer-complaint'; hub = 'qa-hub'; }
    else if (msg.includes('satisfaction')) { formRoute = 'customer-satisfaction'; hub = 'qa-hub'; }
    else if (msg.includes('warranty')) { formRoute = 'warranty-claim'; hub = 'qa-hub'; }
    else if (msg.includes('mom') || msg.includes('meeting')) { formRoute = 'mom'; hub = 'qa-hub'; }
    else if (msg.includes('maintenance')) { formRoute = 'maintenance-report'; hub = 'maintenance-hub'; }

    return { formRoute, hub };
  };

  const getDetailEndpoint = (hub, formRoute, targetId) => {
    const byHub = {
      "production-hub": `${API_BASE_URL}/api/get-single-production-report/${formRoute}/${targetId}/`,
      "qa-hub": `${API_BASE_URL}/api/get-single-report/${formRoute}/${targetId}/`,
      "maintenance-hub": `${API_BASE_URL}/api/get-single-maintenance-report/${formRoute}/${targetId}/`,
    };
    return byHub[hub] || `${API_BASE_URL}/api/approve-report/?record_id=${targetId}`;
  };

  const handleInspectReportRow = async (reportSummaryObject) => {
    const targetId = reportSummaryObject.activity_log_id || reportSummaryObject.id || reportSummaryObject.record_id;
    const reportName = reportSummaryObject.name || reportSummaryObject.form_name;

    if (!targetId || targetId === "N/A") {
      alert("Unable to open report: Missing log identifiers.");
      return;
    }

    const { formRoute, hub } = getRoutingInfo(reportName);
    const frontendAppUrl = window.location.origin.replace(":3000", ":3001");
    const externalUrl = `${frontendAppUrl}/${hub}/view-report/${formRoute}/${targetId}?readonly=true`;
    const meta = { reportName, targetId, hub, formRoute, externalUrl };

    setActiveReport({ meta, data: null, approvalSummary: null, loading: true, error: null });
    setErrorMessage(null);

    try {
      const targetUrl = getDetailEndpoint(hub, formRoute, targetId);
      const res = await fetch(targetUrl);
      const apiResponse = await res.json();

      if (res.ok && apiResponse.success && apiResponse.data) {
        let itemDetails = apiResponse.data;

        let finalStatus = `Status: ${itemDetails.approval_status || "Pending"}`;

        if (itemDetails["Approved By"] && itemDetails["Approved By"] !== "—") {
          finalStatus = `Approved by ${itemDetails["Approved By"]}`;
        } else if (itemDetails["Rejected By"] && itemDetails["Rejected By"] !== "—") {
          finalStatus = `Rejected by ${itemDetails["Rejected By"]}`;
        }

        let finalRemarks = "No evaluation remarks recorded.";
        if (itemDetails.Approver_remarks && String(itemDetails.Approver_remarks).toLowerCase() !== "null" && itemDetails.Approver_remarks !== "") {
          finalRemarks = itemDetails.Approver_remarks;
        } else if (itemDetails.approval_status === "Pending") {
          finalRemarks = "Awaiting review modifications or signature logs.";
        }

        const finalTimestamp = itemDetails.approved_or_rejected_at || itemDetails.updated_at || itemDetails.created_at || "Recent Action";

        const preparedBy = itemDetails["Prepared By"] && itemDetails["Prepared By"] !== "—" ? itemDetails["Prepared By"] : null;
        // const submittedBy = itemDetails["submitted_by"] && itemDetails["submitted_by"] !== "—" ? itemDetails["submitted_by"] : null;
        const approvedBy = itemDetails["Approved By"] && itemDetails["Approved By"] !== "—" ? itemDetails["Approved By"] : null;
        const rejectedBy = itemDetails["Rejected By"] && itemDetails["Rejected By"] !== "—" ? itemDetails["Rejected By"] : null;

        setActiveReport({
          meta,
          data: itemDetails,
          approvalSummary: {
            rawStatus: itemDetails.approval_status || "Pending",
            status: finalStatus,
            timestamp: finalTimestamp,
            remarks: finalRemarks,
            preparedBy,
            // submittedBy,
            approvedBy,
            rejectedBy
          },
          loading: false,
          error: null
        });

      } else {
        setActiveReport({ meta, data: null, approvalSummary: null, loading: false, error: apiResponse.error || "Unable to load report details." });
      }
    } catch (err) {
      console.error("Workflow Mapping Error:", err);
      setActiveReport({ meta, data: null, approvalSummary: null, loading: false, error: "Network interface unreachable." });
    }
  };

  const filteredOperators = operatorRows.filter((op) => {
    const operatorName = String(op.username || "").toLowerCase();
    if (initialSearch && initialSearch.trim() !== "") {
      return operatorName === initialSearch.toLowerCase();
    }
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    try {
      return JSON.stringify(op).toLowerCase().includes(search);
    } catch (e) {
      return operatorName.includes(search);
    }
  });

  const singleOperator = initialSearch && filteredOperators.length === 1 ? filteredOperators[0] : null;
  const displayName = singleOperator ? (singleOperator.username || "Operator") : null;

  let highlightEntries = [];
  let restEntries = [];
  if (activeReport?.data) {
    // Fold any parameters/logs sibling pair (at any nesting depth) into a
    // single enriched parameters array with the reading values attached —
    // this is a no-op for forms that don't have this shape.
    const processedData = mergeReadingsIntoParameters(activeReport.data);

    const orderedEntries = applyOverrides(
      Object.entries(processedData).filter(([k]) => !APPROVAL_KEYS.has(k) && !QUANTITY_KEYS.has(k)),
      activeOverrides
    );

    const highlightKeys = activeOverrides.highlight && activeOverrides.highlight.length
      ? activeOverrides.highlight
      : orderedEntries
          .filter(([, v]) => v === null || v === undefined || typeof v !== "object")
          .slice(0, 3)
          .map(([k]) => k);
    const highlightSet = new Set(highlightKeys);

    highlightEntries = highlightKeys
      .map((hk) => orderedEntries.find(([k]) => k === hk))
      .filter(Boolean);
    restEntries = orderedEntries.filter(([k]) => !highlightSet.has(k));
  }

  return (
    <div className="min-h-screen relative" style={{ background: '#F5F3EF' }}>

      {/* Report detail overlay */}
      {activeReport && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-6">
          <div className="bg-white w-[95vw] max-w-[1400px] max-h-[94vh] shadow-2xl rounded-2xl flex flex-col border border-gray-200 overflow-hidden">

            {/* Header */}
            <div className="px-7 py-5 flex items-start justify-between gap-4 border-b border-gray-100 flex-shrink-0 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 flex-shrink-0">
                  <FileText size={16} className="text-indigo-500" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-gray-900 leading-tight truncate">
                    {activeOverrides.title || prettifyKey(activeReport.meta.formRoute)}
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">Database Entry Detail View</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={activeReport.meta.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 px-3.5 py-2 rounded-lg transition-colors"
                  title="Open the original form in a new tab"
                >
                  <ExternalLink size={13} /> Full Form
                </a>
                <button
                  onClick={() => setActiveReport(null)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-7" style={{ background: '#F8F8F7' }}>

              {activeReport.loading && (
                <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
                  <Loader2 className="animate-spin text-indigo-400" size={24} />
                  <p className="text-xs font-semibold">Fetching report details...</p>
                </div>
              )}

              {!activeReport.loading && activeReport.error && (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                  <AlertCircle className="text-red-400" size={24} />
                  <p className="text-sm font-semibold text-gray-600">{activeReport.error}</p>
                </div>
              )}

              {!activeReport.loading && !activeReport.error && activeReport.data && (
                <>
                  {/* Record id + status row */}
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Record #{activeReport.meta.targetId}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                      style={
                        activeReport.approvalSummary?.rawStatus === "Approved"
                          ? { background: '#E6F5EE', color: '#0F9D6C' }
                          : activeReport.approvalSummary?.rawStatus === "Rejected"
                          ? { background: '#FDECEC', color: '#E5484D' }
                          : { background: '#FBEEDF', color: '#D9822B' }
                      }
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background:
                            activeReport.approvalSummary?.rawStatus === "Approved"
                              ? '#0F9D6C'
                              : activeReport.approvalSummary?.rawStatus === "Rejected"
                              ? '#E5484D'
                              : '#D9822B'
                        }}
                      />
                      {activeReport.approvalSummary?.rawStatus || "Pending"}
                    </span>
                  </div>

                  {/* Highlight strip */}
                  {highlightEntries.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                        {highlightEntries.map(([k, v]) => {
                          const isComplex = typeof v === "object" && v !== null;
                          if (isComplex) {
                            return (
                              <div key={k} className="col-span-2 sm:col-span-3">
                                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1.5">
                                  {prettifyKey(k, activeOverrides)}
                                </p>
                                <ValueRenderer value={v} overrides={activeOverrides} />
                              </div>
                            );
                          }
                          return (
                            <FieldCell
                              key={k}
                              label={prettifyKey(k, activeOverrides)}
                              value={v}
                              isPill={PILL_KEY_PATTERN.test(k)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Workflow people strip — Prepared / Submitted / Approved / Rejected By.
                      Only renders the pills that actually have a value, and the whole
                      card is skipped entirely if none of them do. */}
                  {(() => {
                    const s = activeReport.approvalSummary || {};
                    const pills = [];
                    if (s.preparedBy) pills.push({ label: "Prepared By", value: s.preparedBy, tone: "indigo" });
                    if (s.submittedBy) pills.push({ label: "Submitted By", value: s.submittedBy, tone: "slate" });
                    if (s.approvedBy) pills.push({ label: "Approved By", value: s.approvedBy, tone: "emerald" });
                    if (s.rejectedBy) pills.push({ label: "Rejected By", value: s.rejectedBy, tone: "rose" });
                    if (pills.length === 0) return null;
                    return (
                      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
                        <div className="flex flex-wrap gap-5">
                          {pills.map((p) => (
                            <WorkflowPersonPill key={p.label} label={p.label} value={p.value} tone={p.tone} />
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Achievement card */}
                  {activeReport.data.planned_quantity != null && activeReport.data.achieved_quantity != null && (() => {
                    const planned = Number(activeReport.data.planned_quantity) || 0;
                    const achieved = Number(activeReport.data.achieved_quantity) || 0;
                    const pct = planned > 0 ? Math.min(100, Math.round((achieved / planned) * 100)) : 0;
                    const barColor = pct >= 90 ? '#0F9D6C' : pct >= 60 ? '#6D5AE6' : '#D9822B';
                    return (
                      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EEEBFC' }}>
                              <BarChart3 size={15} style={{ color: '#6D5AE6' }} />
                            </span>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Production Achievement</p>
                          </div>
                          <p className="text-sm font-bold text-gray-800">
                            {achieved.toLocaleString()} <span className="text-gray-400 font-medium">/ {planned.toLocaleString()}</span>
                          </p>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: barColor }} />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs font-semibold" style={{ color: barColor }}>{pct}% completed</p>
                          {activeReport.data.qty_remark && (
                            <p className="text-xs font-semibold text-gray-500">Remark: {formatFieldValue(activeReport.data.qty_remark)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Main field grid */}
                  {(() => {
                    const simpleRest = restEntries.filter(([, v]) => v === null || v === undefined || typeof v !== "object");
                    const complexRest = restEntries.filter(([, v]) => v !== null && typeof v === "object");
                    return (
                      <div className="flex flex-col gap-4">
                        {simpleRest.length > 0 && (
                          <div className="bg-white rounded-2xl border border-gray-200 p-5">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-5">
                              {simpleRest.map(([k, v]) => (
                                <FieldCell
                                  key={k}
                                  label={prettifyKey(k, activeOverrides)}
                                  value={v}
                                  isPill={PILL_KEY_PATTERN.test(k)}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {complexRest.map(([k, v]) => (
                          <DetailTableSection key={k} label={prettifyKey(k, activeOverrides)} value={v} overrides={activeOverrides} />
                        ))}
                      </div>
                    );
                  })()}

                  {/* Workflow status footer */}
                  <div className="mt-4 bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg mt-0.5 ${activeReport.approvalSummary?.status?.includes('Approved') ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        <CheckCircle size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Workflow Engine Status</p>
                        <h4 className="text-sm font-bold text-slate-800">{activeReport.approvalSummary?.status}</h4>
                        <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                          <Clock size={12} />
                          <span>{activeReport.approvalSummary?.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100 flex items-start gap-2.5 w-full sm:max-w-md">
                      <MessageSquare size={14} className="text-slate-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Head Review Remarks</p>
                        <p className="text-xs text-slate-700 italic font-medium">
                          &ldquo;{activeReport.approvalSummary?.remarks || "No evaluation remarks recorded."}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className=" w-full mx-auto px-6 md:px-10 pt-10 pb-20">

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold mb-8 transition-colors text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to {deptLabel}
        </button>

        <div className="mb-8">
          <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mb-3">
            {plantTitle} &middot; {deptLabel} &middot; Control Desk
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-none mb-4">
            {displayName ? (
              <>{displayName}&apos;s <span className="italic font-serif text-gray-400">Reports</span></>
            ) : (
              <>{department} <span className="italic font-serif text-gray-400">Control Desk</span></>
            )}
          </h1>
          <p className="text-sm text-gray-500">
            Supervising Officer Access Token: <span className="font-semibold text-gray-700">{headEmail}</span>
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMessage}
          </div>
        )}

        <div className="space-y-10">
          {filteredOperators.map((operator, opIdx) => {
            const baseLogsList = operator.reportsList || operator.reports || [];
            const targetLogsList = baseLogsList.filter((report) => {
              if (statusFilter === "All") return true;
              return (report.status || "Pending").toLowerCase() === statusFilter.toLowerCase();
            });

            const initials = (operator.username || "OP").substring(0, 2).toUpperCase();

            return (
              <div key={operator.user_id || opIdx}>

                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                      style={{ background: '#6D5AE6' }}
                    >
                      {initials}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">Operator</p>
                      <h3 className="text-xl font-bold text-gray-900 capitalize">{operator.username || "Unknown Operator"}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {operator.user_id} &middot; Reporting Authority: <span className="font-semibold text-gray-700">{operator.head}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-center bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 min-w-[90px]">
                      <p className="text-xl font-bold text-gray-900">{operator.filled || 0}</p>
                      <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mt-0.5">Total Logs</p>
                    </div>
                    <div className="text-center rounded-xl px-5 py-3 min-w-[90px]" style={{ background: '#E6F5EE' }}>
                      <p className="text-xl font-bold" style={{ color: '#0F9D6C' }}>{operator.approved || 0}</p>
                      <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mt-0.5">Passed</p>
                    </div>
                    <div className="text-center rounded-xl px-5 py-3 min-w-[90px]" style={{ background: '#FBEEDF' }}>
                      <p className="text-xl font-bold" style={{ color: '#D9822B' }}>{operator.pending || 0}</p>
                      <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mt-0.5">Review</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
                  <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 w-full sm:flex-1">
                    <Search size={16} className="text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search operator matrix rows safely..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full text-sm outline-none bg-transparent placeholder:text-gray-400"
                    />
                  </div>

                  <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2 w-full sm:w-auto">
                    <Filter size={15} className="text-gray-400 flex-shrink-0" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">State:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer appearance-none pr-1"
                    >
                      <option value="All">All States</option>
                      <option value="Pending">Not Approved</option>
                      <option value="Approved">Approved</option>
                    </select>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    {targetLogsList.length === 0 ? (
                      <div className="text-center py-10 text-gray-400 text-xs italic">
                        No logs match the current criteria.
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                            <th className="px-7 py-4">Record ID</th>
                            <th className="px-7 py-4">Form Context Name</th>
                            <th className="px-7 py-4">Timestamp</th>
                            <th className="px-7 py-4">Workflow State</th>
                            <th className="px-7 py-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                          {targetLogsList.map((report, idx) => {
                            const currentStatus = report.status || "Pending";
                            const isApproved = currentStatus === "Approved";
                            return (
                              <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-7 py-4 font-semibold" style={{ color: '#6D5AE6' }}>
                                  #{report.record_id || report.id || report.activity_log_id}
                                </td>
                                <td className="px-7 py-4 font-medium text-gray-800">{report.name || report.form_name}</td>
                                <td className="px-7 py-4 text-xs text-gray-500">{report.date || report.timestamp}</td>
                                <td className="px-7 py-4">
                                  <span
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                                    style={isApproved
                                      ? { background: '#E6F5EE', color: '#0F9D6C' }
                                      : { background: '#FBEEDF', color: '#D9822B' }}
                                  >
                                    <span
                                      className="w-1.5 h-1.5 rounded-full"
                                      style={{ background: isApproved ? '#0F9D6C' : '#D9822B' }}
                                    />
                                    {currentStatus}
                                  </span>
                                </td>
                                <td className="px-7 py-4 text-center">
                                  <button
                                    onClick={() => handleInspectReportRow(report)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50 rounded-full text-xs font-semibold text-gray-700 transition-all active:scale-95"
                                  >
                                    <Eye size={12} /> View
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-black/5 px-6 md:px-10 py-5 flex items-center justify-between text-xs text-gray-400">
        <span>&copy; 2026 AtomOne Industrial Intelligence</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live &middot; Synced from infrastructure
        </span>
      </div>
    </div>
  );
}