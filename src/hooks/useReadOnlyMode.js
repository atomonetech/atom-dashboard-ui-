import { useSearchParams } from "react-router-dom";

/**
 * useReadOnlyMode
 *
 * Drop this into ANY review/view form. Returns `true` when the page was
 * opened with `?readonly=true` or `?mode=view` in the URL — which is what
 * the Analysis Hub iframe should append when linking to a report.
 *
 * Usage (top of each form component, right after useParams/useNavigate):
 *
 *   import { useReadOnlyMode } from "../../hooks/useReadOnlyMode"; // adjust path
 *   const isReadOnly = useReadOnlyMode();
 *
 * Then wrap any Approve/Reject button block with: {!isReadOnly && ( ... )}
 */
export function useReadOnlyMode() {
  const [searchParams] = useSearchParams();
  return searchParams.get("readonly") === "true" || searchParams.get("mode") === "view";
}