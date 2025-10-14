import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Splash from './pages/Splash';
import FormPage from './pages/FormPage';
import GamePage from './pages/GamePage';
import WinPage from './pages/WinPage';
import LosePage from './pages/LosePage';
import OneParticipationPage from './pages/OneParticipationPage';

function App() {
  const FIXED_SLUG = 'bricoceram'; // à modifier

  const [player, setPlayer] = useState({
    id: localStorage.getItem('playerId') || null,
    dept: null,
    slug: FIXED_SLUG,
    played: JSON.parse(localStorage.getItem('played')) || false,
    name: '',
    email: '',
    tel: ''
  });

  const savePlayer = (data) => {
    const newPlayer = { ...player, ...data };
    setPlayer(newPlayer);
    // On conserve la logique de stockage local
    localStorage.setItem('playerId', newPlayer.id || 'p_' + Date.now());
    localStorage.setItem('played', JSON.stringify(newPlayer.played));
  };

  // Schéma d'URL souhaité: /departement/bricoceram/anniversiare/...
  // On va utiliser : /:dept/:slug/anniversaire/... (le slug doit être validé dans le composant si besoin)
  const ROUTE_PREFIX = '/:dept/:slug/anniversaire';

  return (
    <Routes>
      {/* Route de base pour la sélection du département (Splash) */}
      <Route
        path="/"
        element={<Splash player={player} savePlayer={savePlayer} slug={FIXED_SLUG} />}
      />

      {/* Routes de l'application (Formulaire, Jeu, etc.) */}

      {/* FORM: /:dept/bricoceram/anniversaire/form/slug */}
      {/* On va simplifier le dernier /slug qui n'est pas un paramètre variable ici */}
      <Route
        path={`${ROUTE_PREFIX}/form`}
        element={<FormPage player={player} savePlayer={savePlayer} />}
      />

      {/* JEU: /:dept/bricoceram/anniversaire/game/:participantId_slug */}
      {/* Note : Le paramètre est un ID et un slug concaténé. Il sera extrait dans GamePage */}
      <Route
        path={`${ROUTE_PREFIX}/game/:participantIdSlug`}
        element={<GamePage player={player} savePlayer={savePlayer} />}
      />

      {/* Page 'Déjà Joué' (Elle n'a pas besoin de l'ID du participant) */}
      <Route
        path={`${ROUTE_PREFIX}/one-participation`}
        element={<OneParticipationPage />}
      />

      {/* WIN/LOSE (Elles peuvent être plus simples) */}
      <Route path={`${ROUTE_PREFIX}/win`} element={<WinPage />} />
      <Route path={`${ROUTE_PREFIX}/lose`} element={<LosePage />} />

      {/* Redirection si l'URL ne correspond à rien */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;