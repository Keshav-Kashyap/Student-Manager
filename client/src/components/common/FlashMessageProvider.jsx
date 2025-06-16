import React from "react";
import { Toaster } from "react-hot-toast";

const FlashMessageProvider = () => {
  // Add custom CSS for animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100%) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
      
      @keyframes slideOutRight {
        from {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        to {
          opacity: 0;
          transform: translateX(100%) scale(0.95);
        }
      }
      
      /* Progress Line Animation */
      .toast-container > div {
        position: relative !important;
        overflow: hidden !important;
      }
      
      .toast-container > div::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        width: 0%;
        background: linear-gradient(90deg, rgba(14, 165, 233, 0.8), rgba(14, 165, 233, 1));
        animation: progressLine var(--toast-duration, 4000ms) linear forwards;
        border-radius: 0 0 12px 12px;
        z-index: 10;
      }
      
      /* Success toast progress line */
      .toast-container > div[data-type="success"]::before {
        background: linear-gradient(90deg, rgba(14, 165, 233, 0.6), rgba(14, 165, 233, 1));
        box-shadow: 0 0 8px rgba(14, 165, 233, 0.4);
      }
      
      /* Error toast progress line */
      .toast-container > div[data-type="error"]::before {
        background: linear-gradient(90deg, rgba(239, 68, 68, 0.6), rgba(239, 68, 68, 1));
        box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
      }
      
      /* Loading toast progress line */
      .toast-container > div[data-type="loading"]::before {
        background: linear-gradient(90deg, rgba(100, 116, 139, 0.6), rgba(100, 116, 139, 1));
        animation: progressLineLoading 2s linear infinite;
      }
      
      /* Warning toast progress line */
      .toast-container > div[data-type="custom"]::before {
        background: linear-gradient(90deg, rgba(245, 158, 11, 0.6), rgba(245, 158, 11, 1));
        box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
      }
      
      @keyframes progressLine {
        from {
          width: 0%;
          opacity: 1;
        }
        95% {
          width: 100%;
          opacity: 1;
        }
        100% {
          width: 100%;
          opacity: 0;
        }
      }
      
      @keyframes progressLineLoading {
        0% {
          width: 0%;
          left: 0%;
        }
        50% {
          width: 100%;
          left: 0%;
        }
        100% {
          width: 0%;
          left: 100%;
        }
      }
      
      /* Hover effect on toast messages */
      .toast-container > div:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15), 0 8px 15px rgba(0, 0, 0, 0.1) !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      /* Pause progress line on hover */
      .toast-container > div:hover::before {
        animation-play-state: paused !important;
      }
      
      /* Success toast pulse effect */
      .toast-container > div[data-type="success"] {
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1), successPulse 0.6s ease-in-out 0.4s;
      }
      
      @keyframes successPulse {
        0%, 100% { 
          box-shadow: 0 10px 25px rgba(14, 165, 233, 0.15), 0 4px 6px rgba(14, 165, 233, 0.1);
        }
        50% { 
          box-shadow: 0 10px 25px rgba(14, 165, 233, 0.25), 0 4px 6px rgba(14, 165, 233, 0.2);
        }
      }
      
      /* Error toast shake effect */
      .toast-container > div[data-type="error"] {
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1), errorShake 0.5s ease-in-out 0.4s;
      }
      
      @keyframes errorShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
      }
      
      /* Loading toast rotation */
      .toast-container > div[data-type="loading"] .toast-icon {
        animation: rotate 1s linear infinite;
      }
      
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      /* Responsive design */
      @media (max-width: 640px) {
        .toast-container {
          left: 16px !important;
          right: 16px !important;
          top: 16px !important;
        }
        
        .toast-container > div {
          min-width: unset !important;
          max-width: unset !important;
          width: 100% !important;
          margin: 0 !important;
        }
      }
    `;

    // Add styles to document head
    if (!document.getElementById('toast-custom-styles')) {
      style.id = 'toast-custom-styles';
      document.head.appendChild(style);
    }
    
    return () => {
      const existingStyle = document.getElementById('toast-custom-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return (
    <Toaster 
      position="top-right" 
      reverseOrder={false}
      gutter={12}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        // Default styles for all toasts
        style: {
          background: "#ffffff",
          color: "#1f2937",
          padding: "16px 20px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
          fontSize: "14px",
          fontWeight: "500",
          minWidth: "320px",
          maxWidth: "450px",
          backdropFilter: "blur(8px)",
        },
        
        // Duration settings
        duration: 4000,
        
        // Success toast styling
        success: {
          style: {
            background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
            border: "1px solid #0ea5e9",
            boxShadow: "0 10px 25px rgba(14, 165, 233, 0.15), 0 4px 6px rgba(14, 165, 233, 0.1)",
          },
          iconTheme: {
            primary: "#0ea5e9",
            secondary: "#ffffff",
          },
        },
        
        // Error toast styling
        error: {
          style: {
            background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)",
            border: "1px solid #ef4444",
            boxShadow: "0 10px 25px rgba(239, 68, 68, 0.15), 0 4px 6px rgba(239, 68, 68, 0.1)",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
        
        // Loading toast styling
        loading: {
          style: {
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            border: "1px solid #64748b",
            boxShadow: "0 10px 25px rgba(100, 116, 139, 0.1), 0 4px 6px rgba(100, 116, 139, 0.05)",
          },
          iconTheme: {
            primary: "#64748b",
            secondary: "#ffffff",
          },
        },
        
        // Custom toast styling (can be used for warning)
        custom: {
          style: {
            background: "linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)",
            border: "1px solid #f59e0b",
            boxShadow: "0 10px 25px rgba(245, 158, 11, 0.15), 0 4px 6px rgba(245, 158, 11, 0.1)",
          },
        },
      }}
    />
  );
};

export default FlashMessageProvider;