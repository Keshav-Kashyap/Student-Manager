import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// ✅ Disable console logs in production
if (import.meta.env.MODE === 'production') {
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  // Optional: disable errors too
  // console.error = () => {};
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
