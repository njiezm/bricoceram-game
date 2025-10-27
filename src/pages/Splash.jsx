import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlayer } from '../App'; // Contexte global

// Configuration par défaut Brico Ceram
const defaultConfig = {
  branding: {
    headerImage: "./images/header.png",
    accrocheImage: "./images/Textspalshpage.png",
    footerImage: "./images/Footer_brico.png",
    backgroundImage: "",
    logoUrl: "https://z-cdn-media.chatglm.cn/files/2c048304-2dcd-42fc-a3ac-da3e85c62f62_bicro.png",
    mainTitle: "GRAND JEU ANNIVERSAIRE BRICOCERAM",
    subTitle: "70 Ans La fet toulong !",
    footerText: "Sélectionnez votre région pour commencer et tenter de gagner !",
    logoBadgeText: "70 ans",
  },
  game: {
    slug: "bricoceram",
    departments: [
      { name: "MARTINIQUE", code: "972", icon: "Mq.svg" },
      { name: "GUADELOUPE", code: "971", icon: "GP.svg" },
      { name: "GUYANE", code: "973", icon: "Guyane.svg" },
    ],
  },
  theme: {
    primaryColor: '#1e40af',
    accentColor: '#dc2626',
    accentColorDark: '#b91c1c',
    goldColor: '#fbbf24',
    white: '#ffffff',
    shadowRed: 'rgba(220, 38, 38, 0.4)',
  },
};

export default function Splash({ config: userConfig = {} }) {
  const navigate = useNavigate();
  const { source } = useParams(); // 🔹 Extrait la source depuis l'URL (/ig, /fb, etc.)
  const { player, savePlayer } = usePlayer();
  const [selectedDept, setSelectedDept] = useState(null);

  // Fusion config par défaut et config utilisateur
  const config = useMemo(() => ({
    ...defaultConfig,
    ...userConfig,
    theme: { ...defaultConfig.theme, ...userConfig.theme },
    game: { ...defaultConfig.game, ...userConfig.game },
  }), [userConfig]);

  // 🔹 Enregistre la source dès que la page est chargée
  useEffect(() => {
    if (source) savePlayer({ source });
  }, [source, savePlayer]);

  // 🔹 Sélectionne un département sans rediriger
  const selectDept = (deptCode) => {
    setSelectedDept(deptCode);
  };

  // 🔹 Valide le choix de département et redirige
  const validateChoice = () => {
    if (selectedDept) {
      if (savePlayer) savePlayer({ dept: selectedDept });

      if (source == null) {
          navigate(`/bricoceram/anniversaire70ans/direct/${selectedDept}`);
      } else {
      // Redirige vers /ig/972 (exemple)
      navigate(`/bricoceram/anniversaire70ans/${source}/${selectedDept}`);
    }
    }
  };

  // --- STYLES mis à jour pour la responsivité ---
  const customStyles = useMemo(() => `
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; font-family: 'Inter', sans-serif;  }

    .punch-wrapper {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      background-color: #fff;
      min-height: 100vh;
    }

    .punch-container {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background-color: #FFD100;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      width: 92vw;
      max-width: 480px;
      min-height: 100vh;
      position: relative;
    }

    .punch-header img, .punch-footer img {
      width: 100%;
      height: auto;
      display: block;
    }

    .punch-content {
      text-align: center;
      color: ${config.theme.white};
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1.5rem 0;
      flex-grow: 1;
    }

    .logo { max-width: 200px; width: 100%; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); }
    .logo-badge {
      position: absolute; top: -10px; right: 10%;
      background: ${config.theme.accentColor}; color: ${config.theme.white};
      width: 60px; height: 60px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 0.9rem; border: 3px solid ${config.theme.white};
      box-shadow: 0 4px 10px ${config.theme.shadowRed};
      animation: pulse 2s infinite;
    }

    .main-title { font-size: 1.5rem; font-weight: 800; color: ${config.theme.white}; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
    .main-subtitle-red { font-size: 1.1rem; font-weight: 700; color: ${config.theme.goldColor}; }

    .department-selection { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      gap: 1rem; 
      background-color: #fff;
      padding: 1.5rem 0.5rem; /* Réduction du padding */
      border-radius: 10px;
      width: 90%;
      margin: 1rem auto;
    }
    
    .select-island-title { 
      font-size: 1.5rem; /* Police plus petite */
      font-weight: 900; 
      color: ${config.theme.primaryColor}; 
      margin-bottom: 1rem; /* Marge plus petite */
    }
    
    .button-grid-container { 
      display: grid; /* Utilisation de Grid pour un meilleur contrôle */
      grid-template-columns: repeat(3, 1fr); /* 3 colonnes de taille égale */
      gap: 0.5rem; /* Espacement réduit */
      width: 100%;
    }

    .dept-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 0.5rem; /* Padding réduit */
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 0.75rem;
      background-color: #f5f5f5;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .dept-button:hover { 
      transform: scale(1.05); 
      box-shadow: 0 8px 16px rgba(0,0,0,0.2); 
    }
    
    .dept-button.selected {
      background-color: ${config.theme.primaryColor};
      transform: scale(1.05);
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }
    
    .dept-button.selected .dept-name {
      color: ${config.theme.white};
    }
    
    .dept-button img {
      width: 100%;
      height: auto;
      max-width: 80px; /* Taille d'icône réduite pour tenir sur la ligne */
      margin-bottom: 0.5rem;
    }
    
    .dept-name {
      font-weight: 700;
      color: ${config.theme.primaryColor};
      font-size: 0.8rem; /* Police plus petite */
    }
    
    .validate-button {
      margin-top: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      max-width: 180px; /* Bouton un peu plus petit */
    }
    
    .validate-button:hover {
      transform: scale(1.05);
    }
    
    .validate-button img {
      width: 100%;
      height: auto;
    }
    
    .footer-text { 
      padding: 1rem; 
      text-align: center; 
      color: ${config.theme.white}; 
      background: rgba(0,0,0,0.4); 
    }

    @keyframes pulse { 0%{transform:scale(1);}50%{transform:scale(1.05);}100%{transform:scale(1);} }
    
    /* --- Media Query pour le responsive mobile --- */
    @media (max-width: 768px) {
      .punch-wrapper {
        justify-content: flex-start; /* Aligne le conteneur à gauche pour qu'il prenne toute la largeur */
      }
      .punch-container {
        width: 100vw; /* Prend 100% de la largeur de la vue (viewport) */
        max-width: none; /* Annule la largeur maximale fixe */
      }
    }
  `, [config]);

  const DepartmentButton = ({ dept, code, icon }) => (
    <div 
      className={`dept-button ${selectedDept === code ? 'selected' : ''}`} 
      onClick={() => selectDept(code)}
    >
      <img src={`./images/${icon}`} alt={dept} />
    </div>
  );

  return (
    <div className="punch-wrapper">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="punch-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* HEADER */}
        <img src={config.branding.headerImage} alt="Header" />

        {/* CONTENU PRINCIPAL */}
        <div className="punch-content" style={{ flexGrow: 1 }}>
          
          {/* DÉPARTEMENTS */}
          <div className="department-selection">
            <img src={config.branding.accrocheImage} alt="Accroche" style={{ width: '100%', height: 'auto' }} />

            <div className="button-grid-container">
              {config.game.departments.map((dept) => (
                <DepartmentButton key={dept.code} dept={dept.name} code={dept.code} icon={dept.icon} />
              ))}
            </div>
            
            {/* BOUTON VALIDER */}
            <div className="validate-button" onClick={validateChoice}>
              <img src="./images/BtnValider.png" alt="Valider" style={{ width: '100%', height: 'auto', marginBottom: '20px' }} />
            </div>
          </div>
        </div>

        {/* FOOTER fixé tout en bas */}
        <div style={{ width: "100%", flexShrink: 0 }}>
          <img src={config.branding.footerImage} alt="Footer" style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }} />
        </div>
      </div>
    </div>
  );
}