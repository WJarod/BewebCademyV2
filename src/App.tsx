import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './assets/auth/auth_keycloak.js';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './helpers/PrivateRoute';

//PAGE
import Page from './components/Page';
import Exercice from './pages/Exercice';
import Login from './pages/auth/Login';
import Accueil from './pages/Accueil';
import AccueilAdmin from './pages/AccueilAdmin';
import CreateExercice from './pages/CreateExe';
import User from './pages/User';

function App() {
  return (
    <div className="App">
      <ReactKeycloakProvider authClient={keycloak} initOptions={{ checkLoginIframe: false, onLoad: 'check-sso', }}>
        <React.StrictMode>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<PrivateRoute><Page><Accueil/></Page></PrivateRoute>} />
          <Route path='/admin' element={<PrivateRoute roles="formateur"><Page><AccueilAdmin/></Page></PrivateRoute>} />
          <Route path="/exercices/:badgeID" element={<PrivateRoute roles="formateur"><Exercice /></PrivateRoute>} />
          <Route path="/create-exercice/:badgeID" element={<PrivateRoute roles="formateur"><CreateExercice/></PrivateRoute>} />
          <Route path="/user/:userID" element={<PrivateRoute roles="formateur"><Page><User/></Page></PrivateRoute>} />
        </Routes>
        </React.StrictMode>
      </ReactKeycloakProvider>
    </div>
  );
}

export default App;
