// src/components/NoticeModal.jsx

// import react-bootstrap hooks and components
import { Modal, Button, Alert } from "react-bootstrap";

// import css
import "bootstrap/dist/css/bootstrap.min.css";

export default function NoticeModal(props) {
  const {
    show,
    title,
    message,
    variant = "danger",
    onClose,
    onExited,
    onConfirm,
    confirmText = "Delete",
    cancelText = "Cancel",
    children,
  } = props;

  return (
    <Modal
      show={show}
      onHide={onClose}
      onExited={onExited}
      centered
      aria-labelledby="notice-modal-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="notice-modal-title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="default" className="mb-0">
          {children ?? message}
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        {onConfirm ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            <Button variant={variant} onClick={onConfirm}>
              {confirmText}
            </Button>
          </>
        ) : (
          <Button variant={variant} onClick={onClose}>
            Close
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
