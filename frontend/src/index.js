import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AuthProvider from "./services/authContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch((err) => {
        console.error('Service worker cleanup failed:', err);
      });
  });
}
