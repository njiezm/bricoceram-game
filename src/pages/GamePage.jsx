import GameCanvas from '../components/GameCanvas';
import { useParams } from 'react-router-dom';

export default function GamePage({ player, savePlayer }) {
  // Récupère les paramètres de l'URL pour la redirection finale
  const { dept, slug } = useParams();

  // On passe les informations de routing nécessaires à GameCanvas
  // Les paramètres dept et slug sont essentiels pour la redirection vers /win ou /lose
  return <GameCanvas player={player} savePlayer={savePlayer} dept={dept} slug={slug} />;
}