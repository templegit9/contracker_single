import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import { UIProvider } from './contexts/UIContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <UIProvider>
        <AuthProvider>
          <ContentProvider>
            <App />
          </ContentProvider>
        </AuthProvider>
      </UIProvider>
    </Router>
  </React.StrictMode>
); 