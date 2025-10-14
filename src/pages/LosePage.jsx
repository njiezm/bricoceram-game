import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Définition des couleurs pour une utilisation facile
const BricoCeram_BLUE = '#00008B';
const BricoCeram_RED = '#FF0000';
const BricoCeram_LIGHT_GRAY = '#F0F0F0';
const BricoCeram_FAIL_RED = '#B22222'; // Un rouge pompier pour l'échec

export default function LosePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dept, slug } = useParams(); // Pour construire l'URL de retour
  
  // Récupère le score depuis l'état de navigation
  const score = location.state?.score || 55; // Score par défaut si non trouvé

  const handleReturn = () => {
    // Redirige vers la page d'accueil du jeu
    navigate(`/${dept}/${slug}`);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100dvh', // Mobile-First (Viewport Height)
      padding: '20px',
      backgroundColor: BricoCeram_LIGHT_GRAY,
      color: BricoCeram_BLUE,
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* SECTION DU HAUT : TITRE ET ICONE */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '30px 20px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        border: `2px solid ${BricoCeram_FAIL_RED}`, // Bordure rouge de l'échec
      }}>
        
        <h1 style={{
          fontSize: '2.5rem',
          margin: '0 0 10px 0',
          color: BricoCeram_FAIL_RED,
        }}>
          Dommage... 😢
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: BricoCeram_BLUE,
          fontWeight: 'bold',
          marginBottom: '20px',
        }}>
          Votre tracé n'a pas atteint l'objectif de couverture.
        </p>

        {/* AFFICHAGE DU SCORE */}
        <div style={{
          margin: '20px 0',
          padding: '15px',
          backgroundColor: BricoCeram_FAIL_RED,
          borderRadius: '12px',
          color: 'white',
          fontWeight: 'bold',
        }}>
          <span style={{ fontSize: '1.5rem', display: 'block' }}>Votre Score de Couverture</span>
          <span style={{ fontSize: '3rem', display: 'block', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>{score}%</span>
        </div>

        {/* MESSAGE D'ENCOURAGEMENT / PROCHAINE ÉTAPE */}
        <p style={{
          fontSize: '1rem',
          color: BricoCeram_BLUE,
          marginTop: '25px',
        }}>
          N'abandonnez pas ! Un petit effort, et vous atteindrez l'objectif !
        </p>
      </div>

      {/* BOUTON DE RETOUR */}
      <button 
        onClick={handleReturn}
        style={{
          marginTop: '30px',
          padding: '15px 30px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          backgroundColor: BricoCeram_BLUE, // Bouton en bleu pour encourager à rejouer
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0, 0, 139, 0.3)',
          transition: 'background-color 0.2s',
        }}
      >
        Essayer à nouveau
      </button>

    </div>
  );
}