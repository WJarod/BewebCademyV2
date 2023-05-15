import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './assets/auth/auth_keycloak.js';
import './App.css';
import { Route, Routes } from 'react-router-dom';

//PAGE
import Exercice from './pages/Exercice';
import Login from './pages/auth/Login';

function App() {
  return (
    <div className="App">
      <ReactKeycloakProvider authClient={keycloak} initOptions={{ checkLoginIframe: false, onLoad: 'check-sso', }}>
        <React.StrictMode>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/exercices/:badgeID" element={<Exercice />} />
        </Routes>
        </React.StrictMode>
      </ReactKeycloakProvider>
    </div>
  );
}

export default App;
