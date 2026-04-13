import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { StudentsProvider } from './context/StudentsContext.jsx';
//  Disable console logs in production


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <StudentsProvider>
        <App />  
    </StudentsProvider>
    </AuthProvider>
  </BrowserRouter>
);
