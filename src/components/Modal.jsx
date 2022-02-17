import { React, useState, useEffect } from "react";
import "./Modal.css";

const Modal = ({ handleClose, show, children, onSubmit }) => {
  const [showHideClassName, setShowHideClassName] =
    useState("modal display-none");

  useEffect(() => {
    if (show) {
      setShowHideClassName("modal display-block");
    } else {
      setShowHideClassName("modal display-none");
    }
  }, [show]);

  const onSubmitHandler = () => {
    onSubmit();
    handleClose();
  };

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button type="button" onClick={onSubmitHandler}>
          Submit
        </button>
        <button type="button" onClick={handleClose}>
          Close
        </button>
      </section>
    </div>
  );
};

export default Modal;
