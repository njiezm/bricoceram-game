import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';

// Définition des couleurs pour une utilisation facile
const BricoCeram_BLUE = '#00008B';
const BricoCeram_RED = '#FF0000';
const BricoCeram_LIGHT_GRAY = '#F0F0F0';
const BricoCeram_SUCCESS_GREEN = '#228B22'; // Un vert de succès standard

// Configuration par défaut pour Brico Ceram avec les images
const defaultConfig = {
    branding: {
        // URLs des images pour la structure visuelle
        headerImage: "../images/header.png",
        headerImage971: "../images/header_971.png", // Header pour 971
        headerImage972: "../images/header_972.png", // Header pour 972
        headerImage973: "../images/header_973.png", // Header pour 973
        accrocheImage: "../images/text_felicitation_MQ.png", // Image par défaut
        accrocheImage971: "../images/text_felicitation_971.png", // Image pour 971
        accrocheImage972: "../images/text_felicitation_972.png", // Image pour 972
        accrocheImage973: "../images/text_felicitation_973.png", // Image pour 973
        dotationImage: "../images/text_votre_score.png",
        footerImage: "../images/text_footer.png",
        backgroundImage: "",
    },
    theme: {
        primaryColor: '#1e40af',
        accentColor: '#dc2626',
        accentColorDark: '#b91c1c',
        goldColor: '#fbbf24',
        successColor: '#228B22',
        labelBgColor: '#1e40af',
    }
};

export default function WinPage({ config: userConfig = {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { dept, slug } = useParams(); // Pour construire l'URL de retour
  
  // Fusionner la configuration par défaut avec celle de l'utilisateur
  const config = useMemo(() => ({
      ...defaultConfig,
      ...userConfig,
      theme: { ...defaultConfig.theme, ...userConfig.theme }
  }), [userConfig]);
  
  // Récupère le score depuis l'état de navigation
  const score = location.state?.score || 0; // Score par défaut si non trouvé
  
  // Sélectionner l'image d'accroche en fonction du département
  const getAccrocheImage = useMemo(() => {
    if (dept === '971') return config.branding.accrocheImage971;
    if (dept === '972') return config.branding.accrocheImage972;
    if (dept === '973') return config.branding.accrocheImage973;
    return config.branding.accrocheImage; // Image par défaut
  }, [config.branding, dept]);
  
  // Sélectionner le header en fonction du département
  const getHeaderImage = useMemo(() => {
    if (dept === '971') return config.branding.headerImage971;
    if (dept === '972') return config.branding.headerImage972;
    if (dept === '973') return config.branding.headerImage973;
    return config.branding.headerImage; // Header par défaut
  }, [config.branding, dept]);

  const handleReturn = () => {
    // Redirige vers la page d'accueil du jeu
    navigate(`/${dept}/${slug}`);
  };

  // Styles CSS adaptés pour la structure PunchForm
  const cssStyles = useMemo(() => `
    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
    }
    
    .punch-wrapper {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        background-color: #FFD100;
        min-height: 100vh;
    }
    
    .punch-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        background-image: url(${config.branding.backgroundImage});
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        width: 92vw;
        max-width: 480px;
        min-height: 100vh;
        position: relative;
    }
    
    /* Modification pour que le header et le contenu principal occupent toute la largeur sur mobile */
    @media (max-width: 768px) {
        .punch-container {
            width: 100vw;
            max-width: 100vw;
        }
    }
    
    .punch-container::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url(${config.branding.backgroundImage});
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        z-index: -1;
    }
    
    .content {
        width: 90%;
        max-width: 400px;
        text-align: center;
        color: #fff;
        flex-grow: 1;
        padding-bottom: 20px;
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    
    .win-card {
        background-color: 'white';
        border-radius: '20px';
        padding: '30px 20px';
        width: '100%';
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)';
        border: '2px solid ${config.theme.successColor}';
        margin-bottom: '20px';
    }
    
    .win-title {
        font-size: '2.5rem';
        margin: '0 0 10px 0';
        color: ${config.theme.successColor};
    }
    
    .win-subtitle {
        font-size: '1.2rem';
        color: ${config.theme.primaryColor};
        fontWeight: 'bold';
        marginBottom: '20px';
    }
    
    .score-container {
        margin: '20px 0';
        padding: '15px';
        backgroundColor: ${config.theme.successColor};
        borderRadius: '12px';
        color: 'white';
        fontWeight: 'bold';
    }
    
    .score-label {
        font-size: '1.5rem';
        display: 'block';
    }
    
    .score-value {
        font-size: '3rem';
        display: 'block';
        textShadow: '1px 1px 2px rgba(0,0,0,0.2)';
    }
    
    .win-message {
        font-size: '1rem';
        color: ${config.theme.primaryColor};
        marginTop: '25px';
    }
    
    .return-button {
        marginTop: '30px';
        padding: '15px 30px';
        fontSize: '1.2rem';
        fontWeight: 'bold';
        backgroundColor: ${config.theme.accentColor};
        color: 'white';
        border: 'none';
        borderRadius: '8px';
        cursor: 'pointer';
        boxShadow: '0 4px 10px rgba(255, 0, 0, 0.3)';
        transition: 'background-color 0.2s';
    }
    
    .return-button:hover {
        background-color: ${config.theme.accentColorDark};
    }
    
    /* Style pour l'image d'accroche collée au bord du bloc blanc */
    .accroche-container {
        width: 100%;
        padding: 0;
        margin: 0;
        overflow: hidden;
    }
    
    .accroche-image {
        width: 100%;
        height: auto;
        display: block;
        margin: 0;
        padding: 0;
    }
  `, [config, dept]);

  return (
    <div className="punch-wrapper">
      <style>{cssStyles}</style>
      
      {/* Conteneur principal (fond + contenu) */}
      <div className="punch-container">
        {/* HEADER */}
        <div style={{ width: "100%", flexShrink: 0 }}>
          <img
            src={getHeaderImage}
            alt="Header"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "contain",
            }}
          />
        </div>

        {/* CONTENU CENTRAL */}
        <div style={{backgroundColor: "white", padding: "0", borderRadius: "10px", marginBottom: "20px", overflow: "hidden"}}>
          <div className="accroche-container">
            <img
              src={getAccrocheImage}
              alt="Accroche"
              className="accroche-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}