// src/handlers/studentHandlers.js
import toast from 'react-hot-toast';
import { API_BASE } from '../config/api';

// Custom Confirm Dialog Helper Function - Production Safe Version
const showConfirmDialog = (message, onConfirm, onCancel = () => {}) => {
  // Check if we're in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // Fallback for SSR or non-browser environments
    const confirmed = confirm(message);
    if (confirmed) onConfirm();
    else onCancel();
    return;
  }

  // Create modal backdrop
  const backdrop = document.createElement('div');
  backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  // Create dialog box
  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 24px;
    min-width: 400px;
    max-width: 90vw;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    animation: slideIn 0.2s ease-out;
  `;

  // Add animation keyframes - Check if style already exists
  let existingStyle = document.getElementById('confirm-dialog-styles');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'confirm-dialog-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: scale(0.95) translateY(-10px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Dialog content
  dialog.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 18px; font-weight: 600;">
        Confirm Action
      </h3>
      <p style="margin: 0; color: #6B7280; font-size: 14px; line-height: 1.5;">
        ${message}
      </p>
    </div>
    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button id="cancelBtn" style="
        padding: 8px 16px;
        border: 1px solid #D1D5DB;
        background: white;
        color: #374151;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
      ">
        Cancel
      </button>
      <button id="confirmBtn" style="
        padding: 8px 16px;
        border: none;
        background: #DC2626;
        color: white;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
      ">
        Delete
      </button>
    </div>
  `;

  backdrop.appendChild(dialog);
  
  // Safely append to body
  try {
    document.body.appendChild(backdrop);
  } catch (error) {
    console.error('Error creating dialog:', error);
    // Fallback to native confirm
    const confirmed = confirm(message);
    if (confirmed) onConfirm();
    else onCancel();
    return;
  }

  // Button hover effects
  const cancelBtn = dialog.querySelector('#cancelBtn');
  const confirmBtn = dialog.querySelector('#confirmBtn');

  if (cancelBtn && confirmBtn) {
    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.backgroundColor = '#F3F4F6';
      cancelBtn.style.borderColor = '#9CA3AF';
    });
    
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.backgroundColor = 'white';
      cancelBtn.style.borderColor = '#D1D5DB';
    });

    confirmBtn.addEventListener('mouseenter', () => {
      confirmBtn.style.backgroundColor = '#B91C1C';
    });
    
    confirmBtn.addEventListener('mouseleave', () => {
      confirmBtn.style.backgroundColor = '#DC2626';
    });
  }

  // Close dialog function
  const closeDialog = () => {
    try {
      if (backdrop && backdrop.parentNode) {
        document.body.removeChild(backdrop);
      }
    } catch (error) {
      console.error('Error removing dialog:', error);
    }
  };

  // Event listeners
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      closeDialog();
      onCancel();
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      closeDialog();
      onConfirm();
    });
  }

  // Close on backdrop click
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeDialog();
      onCancel();
    }
  });

  // Close on Escape key
  const handleEscKey = (e) => {
    if (e.key === 'Escape') {
      closeDialog();
      onCancel();
      document.removeEventListener('keydown', handleEscKey);
    }
  };
  document.addEventListener('keydown', handleEscKey);
};

export const handleViewStudent = (navigate, studentId) => {
  if (!studentId) {
    console.error('Student ID is required');
    toast.error('Invalid student ID');
    return;
  }
  
  console.log('Navigating to view student:', studentId);
  navigate(`/app/student/view/${studentId}`);
};

export const handleEditStudent = (navigate, studentId) => {
  if (!studentId) {
    console.error('Student ID is required');
    toast.error('Invalid student ID');
    return;
  }
  
  console.log('Navigating to edit student:', studentId);
  // Use consistent route pattern
  navigate(`/app/students/edit/${studentId}`);
};

export const handleDeleteStudent = async (studentId, deleteStudentFunc, setSelectedStudents) => {
  if (!studentId) {
    toast.error('Invalid student ID');
    return;
  }

  showConfirmDialog(
    'Are you sure you want to delete this student? This action cannot be undone.',
    async () => {
      try {
        const result = await deleteStudentFunc(studentId);
        if (result.success) {
          setSelectedStudents(prev => prev.filter(id => id !== studentId));
          toast.success('Student deleted successfully');
        } else {
          toast.error('Error deleting student: ' + (result.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Delete student error:', error);
        toast.error('Failed to delete student');
      }
    }
  );
};

export const handleDeleteSelected = async (selectedStudents, deleteMultipleStudentsFunc, setSelectedStudents) => {
  if (!selectedStudents || selectedStudents.length === 0) {
    toast.error('No students selected');
    return;
  }

  const count = selectedStudents.length;
  showConfirmDialog(
    `Are you sure you want to delete ${count} student${count > 1 ? 's' : ''}? This action cannot be undone.`,
    async () => {
      try {
        const result = await deleteMultipleStudentsFunc(selectedStudents);
        if (result.success) {
          setSelectedStudents([]);
          toast.success('Students deleted successfully');
        } else {
          toast.error('Error deleting students: ' + (result.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Delete multiple students error:', error);
        toast.error('Failed to delete students');
      }
    }
  );
};

// Export the dialog function in case needed elsewhere
export { showConfirmDialog };