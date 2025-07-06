import React, { createContext, useContext, useState } from 'react';
import ConfirmDialog from '../components/common/ConfirmDialog';

const ConfirmDialogContext = createContext();

export const useConfirm = () => useContext(ConfirmDialogContext);

// Now accepting `message` and optional `title`
export const ConfirmDialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState({
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    visible: false,
  });

  const confirm = (message, title = 'Confirm Action') =>
    new Promise((resolve) => {
      setDialog({
        title,
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
        open={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel}
      />
    </ConfirmDialogContext.Provider>
  );
};
