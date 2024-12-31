'use client';

import React, { useEffect } from 'react';

type ModalProps = {
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  buttons?: React.ReactNode;
  isOpen: boolean;
  timeout?: number;
  setIsOpen: (isOpen: boolean) => void; // Add this prop
};

const Modal: React.FC<ModalProps> = ({ header, footer, body, buttons, isOpen, setIsOpen, timeout }) => {

  const handleClose = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    if (isOpen && timeout) {
      setTimeout(() => {
        setIsOpen(false);
        //console.log('the time is up after ', timeout, 'ms');
      }, timeout);
    }
  });
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