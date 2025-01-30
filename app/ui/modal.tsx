'use client';

import React, { useEffect, useState } from 'react';

type ModalProps = {
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  buttons?: React.ReactNode;
  timeout?: number;
  showModal: boolean;
  dark?: boolean;
};

const Modal: React.FC<ModalProps> = ({ header, footer, body, buttons, showModal, timeout, dark }) => {

  const [_showModal, setShowModal] = useState(showModal);

  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    setShowModal(showModal);
    //console.log('the time is up after ', timeout, 'ms');
    if (timeout) {
      setTimeout(() => {
        setShowModal(false);
      }, timeout);
    }
  }, [showModal, timeout]);
  return (
    <>
      {_showModal && (
        <div
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleClose();
            }
          }}
          className={`modal-overlay fixed inset-0 z-10 ${dark ? 'bg-slate-600 bg-opacity-50' : 'bg-white bg-opacity-50'}`}
        >
          <div className={`modal  text-white relative mx-auto my-20 max-w-lg ${dark ? 'bg-slate-600' : 'bg-white'} p-6 rounded-lg`}>
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