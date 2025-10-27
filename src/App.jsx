import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext, useCallback } from 'react';
import Splash from './pages/Splash';
import FormPage from './pages/FormPage';
import GamePage from './pages/GamePage';
import WinPage from './pages/WinPage';
import LosePage from './pages/LosePage';
import OneParticipationPage from './pages/OneParticipationPage';
import WaitPage from './pages/Wait';
import TerminePage from './pages/Termine';
import ChoixPage from './pages/ChoixPage';
import DejaGagnePage from './pages/DejaGagnePage';

const PlayerContext = createContext();
export const usePlayer = () => useContext(PlayerContext);

function App() {
  const FIXED_SLUG = 'bricoceram';

  const [player, setPlayer] = useState({
    id: null,
    source: null,
    dept: null,
    slug: FIXED_SLUG,
    played: false,
    name: '',
    email: '',
    tel: '',
  });

  // --- MODIFICATION CLÉ ---
  // La fonction savePlayer est maintenant complètement stable.
  // Elle ne dépend d'aucune variable externe et ne sera recréée qu'une seule fois.
  const savePlayer = useCallback((data) => {
    // On utilise la forme fonctionnelle de setPlayer pour éviter les dépendances
    setPlayer(prevPlayer => {
      const newPlayer = { ...prevPlayer, ...data };
      
      // On sauvegarde aussi dans sessionStorage
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          sessionStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
        }
      });
      
      return newPlayer;
    });
  }, []); // <-- Le tableau de dépendances est vide !

  return (
    <PlayerContext.Provider value={{ player, savePlayer }}>
      <Routes>
        <Route path="/bricoceram/anniversaire70ans" element={<Splash />} />
        <Route path="/bricoceram/anniversaire70ans/:source" element={<Splash />} />
        <Route path="/bricoceram/anniversaire70ans/:source/:dept" element={<ChoixPage />} />
        <Route path="/bricoceram/anniversaire70ans/game" element={<GamePage />} />
        <Route path="/bricoceram/anniversaire70ans/game/win" element={<WinPage />} />
        <Route path="/bricoceram/anniversaire70ans/game/lose" element={<LosePage />} />
        <Route path="/bricoceram/anniversaire70ans/une-participation" element={<OneParticipationPage />} />
        <Route path="/bricoceram/anniversaire70ans/patience" element={<WaitPage />} />
        <Route path="/bricoceram/anniversaire70ans/terminer" element={<TerminePage />} />
        <Route path="/bricoceram/anniversaire70ans/deja-gagne" element={<DejaGagnePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </PlayerContext.Provider>
  );
}

export default App;