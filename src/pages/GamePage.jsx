import GameCanvas from '../components/GameCanvas';
import { usePlayer } from '../App'; // Import du contexte

export default function GamePage() {
  const { player, savePlayer } = usePlayer(); // Utilisation du contexte

  // Récupération du dept et slug depuis le contexte player ou localStorage
  const dept = player.dept || localStorage.getItem("dept");
  const slug = player.slug || localStorage.getItem("slug") || "bricoceram"; // valeur par défaut si besoin

  return <GameCanvas player={player} savePlayer={savePlayer} dept={dept} slug={slug} />;
}
