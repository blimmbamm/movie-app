import classes from "./Modal.module.css";
import { createPortal } from "react-dom";

function Modal({ children, onBackdropClick }) {
  return createPortal(
    <>
      <div className={classes.content}>
        {children}
      </div>
      <div className={classes.backdrop} onClick={onBackdropClick} />
    </>,
    document.getElementById("modal")
  );
}

export default Modal;
