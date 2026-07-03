import Swal from "sweetalert2";
import "../styles/alert.css";

const swal = Swal.mixin({
  width: "480px",
  confirmButtonColor: "#2563EB",
  buttonsStyling: true,
  reverseButtons: true,
  allowOutsideClick: false,
  allowEscapeKey: true,
  focusConfirm: true,

  customClass: {
    popup: "inspection-popup",
    title: "inspection-title",
    htmlContainer: "inspection-message",
    confirmButton: "inspection-confirm-btn",
    cancelButton: "inspection-cancel-btn",
  },
});

// Success
export const successAlert = (title, message) =>
  swal.fire({
    icon: "success",
    title,
    html: message,
  });

// Error
export const errorAlert = (title, message) =>
  swal.fire({
    icon: "error",
    title,
    html: message,
  });

// Warning
export const warningAlert = (title, message) =>
  swal.fire({
    icon: "warning",
    title,
    html: message,
  });

// Information
export const infoAlert = (title, message) =>
  swal.fire({
    icon: "info",
    title,
    html: message,
  });

// Confirmation
export const confirmAlert = (
  title,
  message,
  confirmText = "Yes",
  cancelText = "Cancel"
) =>
  swal.fire({
    icon: "question",
    title,
    html: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });