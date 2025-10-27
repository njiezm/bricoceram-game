import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormPage from './FormPage';
import ExpressFormPage from './ExpressFormPage';
import { usePlayer } from '../App'; 

// Configuration par défaut pour la page de choix
const defaultConfig = {
    branding: {
        headerImage: "../images/header.png",
        headerImage971: "../images/headergpe.png",
        headerImage972: "../images/header.png",
        headerImage973: "../images/headerguy.png",
        accrocheImage: "./images/TEXTECHOIX.png",
        accrocheImage971: "../images/accrochejeuGPE.png",
        accrocheImage972: "../images/accroche.png",
        accrocheImage973: "../images/accroche_jeu_guy.png",
        footerImage: "../images/Footer_brico.png",
        backgroundImage: "https://placehold.co/480x800/f0f9ff/1e40af?text=Background+Brico",
        btnNewImage: "../images/btn_premiere_inscription.png",
        btnExpressImage: "../images/btn_deja_joue.png",
    },
    theme: {
        primaryColor: '#1e40af',
        accentColor: '#dc2626',
        accentColorDark: '#b91c1c',
        goldColor: '#fbbf24',
        white: '#ffffff',
    }
};

export default function ChoixPage({ config: userConfig = {} }) {
  const { player } = usePlayer();
  const { source, dept } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [checkDay, setCheckDay] = useState(false);
  const [choice, setChoice] = useState(null);
  
  // Fusionner la configuration par défaut avec celle de l'utilisateur
  const config = useMemo(() => ({
      ...defaultConfig,
      ...userConfig,
      theme: { ...defaultConfig.theme, ...userConfig.theme }
  }), [userConfig]);
  
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

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE;
        const API_KEY = import.meta.env.VITE_API_KEY;

        // --- Étape 1: Vérification de l'état opérationnel ---
        const stateFormData = new FormData();
        stateFormData.append("key_api", API_KEY);
        stateFormData.append("dep_slug", player.dept);

        const stateResponse = await fetch(`${API_BASE}/api/checkstateope`, {
          method: "POST",
          body: stateFormData
        });

        const stateResult = await stateResponse.json();

        if (stateResult.code === 100) {
          navigate('/bricoceram/anniversaire70ans/patience');
          return;
        }
        if (stateResult.code === 300) {
          navigate('/bricoceram/anniversaire70ans/terminer');
          return;
        }
        console.log(dept);
        // --- Étape 2: Vérification de la journée (checkDay) ---
        const checkDayFormData = new FormData();
        checkDayFormData.append("key_api", API_KEY);
        checkDayFormData.append("dep_slug", player.dept);

        const dayResponse = await fetch(`${API_BASE}/api/checkDay`, {
          method: "POST",
          body: checkDayFormData
        });

        if (!dayResponse.ok) {
          throw new Error(`Erreur HTTP ! statut : ${dayResponse.status}`);
        }

        const dataDay = await dayResponse.json();
        setCheckDay(dataDay.checkDay);

      } catch (err) {
        console.error("Erreur lors de l'appel API :", err);
        setCheckDay(false);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, [dept, navigate]);

  const handlePremiereInscription = () => setChoice('new');
  const handleDejaInscrit = () => setChoice('express');

  // Styles CSS identiques aux autres pages pour la cohérence
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
      background-color: #fff;
      min-height: 100vh;
    }
    
    .punch-container {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      background-color: #FFD100;
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
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      z-index: -1;
    }
    
    .content {
      width: 90%;
      max-width: 400px;
      margin: 0 auto;
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
    
    .choice-card {
      background-color: 'white';
      border-radius: '20px';
      padding: '30px 20px';
      width: '100%';
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)';
      border: '2px solid ${config.theme.primaryColor}';
    }
    
    .choice-title {
      font-size: '2rem';
      margin: '0 0 10px 0';
      color: ${config.theme.primaryColor};
    }
    
    .choice-message {
      font-size: '1.1rem';
      color: ${config.theme.primaryColor};
      lineHeight: '1.5';
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
    
    .button-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      margin-top: 30px;
    }
    
    .choice-button {
      cursor: pointer;
      transition: transform 0.2s;
      max-width: 80%;
    }
    
    .choice-button:hover {
      transform: scale(1.05);
    }
    
    .choice-button:active {
      transform: scale(0.95);
    }
  `, [config, dept]);

  // 1. Affichage du chargement
  if (loading) {
    return (
      <div className="punch-wrapper">
        <style>{cssStyles}</style>
        <div className="punch-container">
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
          <div className="content">
            <div style={{backgroundColor: "white", padding: "15px", borderRadius: "10px", marginBottom: "20px", overflow: "hidden"}}>
              <div className="accroche-container">
                <img
                  src={getAccrocheImage}
                  alt="Chargement"
                  className="accroche-image"
                />
              </div>
              <div className="choice-card">
                <h1 className="choice-title">Chargement...</h1>
                <p className="choice-message">Veuillez patienter pendant que nous vérifions les informations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. LOGIQUE PRINCIPALE : Si le formulaire du jour est disponible (checkDay est true)
  // On affiche directement la page du formulaire principal.
  console.log("checkDay:", checkDay);
  if (checkDay) {
    return <FormPage source={source} dept={dept} />;
  }

  // 3. SINON (checkDay est false), on laisse l'utilisateur choisir son type d'inscription.
  // Si aucun choix n'a encore été fait, on affiche les boutons.
  if (choice === null) {
    return (
      <div className="punch-wrapper">
        <style>{cssStyles}</style>
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
                <div className="content">
                <div style={{backgroundColor: "white", padding: "0", borderRadius: "10px", marginBottom: "20px", overflow: "hidden"}}>
                  <div className="accroche-container">
                  <img
                    src={getAccrocheImage}
                    alt="Choix d'inscription"
                    className="accroche-image"
                  />
                  </div>

                  <div className="choice-card">
                  <div className="button-container">
                    <div style={{ padding: "0 20px" }}>  {/* Added padding container */}
                    <img 
                      src="../images/form.png" 
                      alt="Formulaire" 
                      style={{width:"100%", padding:"20px 0"}}
                    />
                    </div>

                    <img
                    src={config.branding.btnNewImage}
                    alt="Première inscription"
                    className="choice-button"
                    onClick={handlePremiereInscription}
                    />
                    <img
                    src={config.branding.btnExpressImage}
                    alt="Déjà inscrit"
                    className="choice-button"
                    onClick={handleDejaInscrit}
                    />
                    <br></br>
                  </div>
                  </div>
                </div>
                </div>

                {/* FOOTER */}
          <div style={{ width: "100%", flexShrink: 0 }}>
            <img
              src={config.branding.footerImage}
              alt="Footer"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 4. Une fois le choix fait, on affiche le composant correspondant.
  // Cette partie n'est atteinte que si checkDay est false ET qu'un choix a été fait.
  return choice === 'new'
    ? <FormPage source={source} dept={dept} />
    : <ExpressFormPage dept={dept} />;
}