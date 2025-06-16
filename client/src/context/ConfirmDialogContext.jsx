// src/context/ConfirmDialogContext.jsx
import React, { createContext, useContext, useState } from 'react';
import ConfirmDialog from '../components/common/ConfirmDialog';

const ConfirmDialogContext = createContext();

export const useConfirm = () => useContext(ConfirmDialogContext);

export const ConfirmDialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState({
    message: '',
    onConfirm: null,
    onCancel: null,
    visible: false,
  });

  const confirm = (message) =>
    new Promise((resolve) => {
      setDialog({
        message,
        visible: true,
        onConfirm: () => {
          setDialog((d) => ({ ...d, visible: false }));
          resolve(true);
        },
        onCancel: () => {
          setDialog((d) => ({ ...d, visible: false }));
          resolve(false);
        },
      });
    });

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        isOpen={dialog.visible}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel}
      />
    </ConfirmDialogContext.Provider>
  );
};
