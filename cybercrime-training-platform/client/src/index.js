import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import NetworkStatusProvider from './contexts/NetworkStatusContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <NetworkStatusProvider>
        <App />
      </NetworkStatusProvider>
    </BrowserRouter>
  </Provider>
);

// Register service worker for offline capabilities
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // Show a notification to the user that a new version is available
    const updateAvailable = window.confirm(
      'A new version of the application is available. Would you like to update now?'
    );
    
    if (updateAvailable) {
      // Send a message to the service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page to activate the new service worker
      window.location.reload();
    }
  },
  onSuccess: (registration) => {
    console.log('Service Worker registered successfully');
  }
});