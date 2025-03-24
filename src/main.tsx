import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {StorageProvider} from "./components/useStorage";

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
      <StorageProvider>
          <App />
      </StorageProvider>
  </React.StrictMode>
);