import { useNavigate, useParams } from 'react-router-dom';

// Définition des couleurs pour une utilisation facile
const BricoCeram_BLUE = '#00008B';
const BricoCeram_RED = '#FF0000';
const BricoCeram_LIGHT_GRAY = '#F0F0F0';
const BricoCeram_WARNING_ORANGE = '#FFA500'; // Orange ou Jaune pour l'avertissement

export default function OneParticipationPage() {
  const navigate = useNavigate();
  const { dept, slug } = useParams(); // Pour construire l'URL de retour

  const handleReturn = () => {
    // Redirige vers la page d'accueil du site ou de l'application
    navigate(`/`);
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
      
      {/* SECTION DU HAUT : TITRE ET CADRE D'INFO */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '30px 20px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        border: `2px solid ${BricoCeram_WARNING_ORANGE}`, // Bordure d'avertissement
      }}>
        
        <h1 style={{
          fontSize: '2rem',
          margin: '0 0 10px 0',
          color: BricoCeram_WARNING_ORANGE,
        }}>
          Participation unique ✅
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: BricoCeram_BLUE,
          fontWeight: 'bold',
          marginBottom: '20px',
        }}>
          Vous avez déjà participé à ce jeu.
        </p>

        {/* MESSAGE D'INFORMATION */}
        <div style={{
          margin: '20px 0',
          padding: '15px',
          backgroundColor: '#FFFACD', // Jaune clair pour le fond
          borderRadius: '12px',
          color: BricoCeram_BLUE,
          border: `1px solid ${BricoCeram_WARNING_ORANGE}`
        }}>
          <span style={{ fontSize: '1rem', display: 'block' }}>
            Pour garantir l'équité, chaque participant n'est autorisé à jouer qu'une seule fois.
          </span>
        </div>

        {/* REMERCIEMENT */}
        <p style={{
          fontSize: '1rem',
          color: BricoCeram_BLUE,
          marginTop: '25px',
        }}>
          Merci de votre compréhension et de votre participation !
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
          backgroundColor: BricoCeram_BLUE, // Bouton en bleu Bricoceram
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0, 0, 139, 0.3)',
          transition: 'background-color 0.2s',
        }}
      >
        Retour à l'accueil
      </button>

    </div>
  );
}