import React from 'react';
import { createRoot } from 'react-dom/client';
import MakeLightApp from './make-light-app.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MakeLightApp />
  </React.StrictMode>
);
