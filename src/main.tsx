/** Mounts the SPA with strict lifecycle checks and server-verified auth state. @author oEnzoRibas */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from './auth-provider';
import App from './app';
import { MotionConfig } from 'motion/react';
import { FeedbackCenter } from './components/feedback/feedback-center';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user"><AuthProvider>
      <App />
      <FeedbackCenter />
    </AuthProvider></MotionConfig>
  </React.StrictMode>
);
