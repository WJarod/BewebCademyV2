import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './assets/auth/auth_keycloak.js';
import './App.css';
import { Route, Routes } from 'react-router-dom';

//PAGE
import Page from './components/Page';
import Exercice from './pages/Exercice';
import Login from './pages/auth/Login';
import Accueil from './pages/Accueil';
import AccueilAdmin from './pages/AccueilAdmin';
import CreateExercice from './pages/CreateExe';

function App() {
  return (
    <div className="App">
      <ReactKeycloakProvider authClient={keycloak} initOptions={{ checkLoginIframe: false, onLoad: 'check-sso', }}>
        <React.StrictMode>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Page><Accueil/></Page>} />
          <Route path='/admin' element={<Page><AccueilAdmin/></Page>} />
          <Route path="/exercices/:badgeID" element={<Exercice />} />
          <Route path="/create-exercice/:badgeID" element={<CreateExercice/>} />
        </Routes>
        </React.StrictMode>
      </ReactKeycloakProvider>
    </div>
  );
}

export default App;
