'use client';

import React from 'react';

type ModalProps = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  body?: React.ReactNode;
  buttons?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void; // Add this prop
};

const Modal: React.FC<ModalProps> = ({ header, footer, body, buttons, isOpen, setIsOpen }) => {

  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      {isOpen && (
        <div
          className="modal-overlay fixed inset-0 z-10 bg-gray-500 bg-opacity-50"
        >
          <div className="modal relative mx-auto my-20 max-w-lg bg-white p-6 rounded-lg">
            <div
              className="modal-close absolute top-2 right-2 cursor-pointer"
              onClick={handleClose}
            >
              X
            </div>
            <div className="modal-content">
              <div className="modal-header">{header}</div>
              <div className="modal-body">{body}</div>
              <div className="modal-footer">{footer}</div>
              <div className="modal-buttons">{buttons}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;