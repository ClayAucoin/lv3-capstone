/* eslint-disable react-refresh/only-export-components */
// src/context/ModalContext.jsx

import { createContext, useContext, useState, useCallback } from "react";
import NoticeModal from "../components/NoticeModal";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    variant: "danger",
    confirmText: "OK",
    cancelText: "Cancel",
    onResolve: null,
  });

  const showModal = useCallback((opts) => {
    // console.log("[Modal] showModal called with:", opts);
    return new Promise((resolve) => {
      setModal({
        show: true,
        title: opts.title ?? "",
        message: opts.message ?? "",
        variant: opts.variant ?? "danger",
        confirmText: opts.confirmText ?? "OK",
        cancelText: opts.cancelText ?? "Cancel",
        onResolve: resolve,
      });
    });
  }, []);

  function handleClose() {
    // console.log("[Modal] close");
    setModal((m) => ({ ...m, show: false }));
    modal.onResolve?.(false);
  }
  function handleConfirm() {
    // console.log("[Modal] confirm");
    setModal((m) => ({ ...m, show: false }));
    modal.onResolve?.(true);
  }

  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}
      <NoticeModal
        show={modal.show}
        title={modal.title}
        variant={modal.variant}
        onClose={handleClose}
        onConfirm={handleConfirm}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
      >
        {modal.message}
      </NoticeModal>
    </ModalContext.Provider>
  );
}
export function useModal() {
  return useContext(ModalContext);
}
