import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../App'; // Import du contexte du joueur

// On réutilise la même configuration par défaut pour la cohérence visuelle
const defaultConfig = {
    branding: {
        headerImage: "./images/header.png",
        headerImage971: "./images/headergpe.png",
        headerImage972: "./images/header.png",
        headerImage973: "./images/headerguy.png",
        footerImage: "./images/Footer_brico.png",
        backgroundImage: "./images/Background_brico.png",
    },
    theme: {
        primaryColor: '#1e40af',
        accentColor: '#dc2626',
        accentColorDark: '#b91c1c',
        goldColor: '#fbbf24',
        white: '#ffffff',
        labelBgColor: '#1e40af',
        fontFamily: 'Arial, sans-serif',
    }
};

export default function DejaGagnePage({ config: userConfig = {} }) {
    const navigate = useNavigate();
    const { player } = usePlayer(); // Récupération du joueur pour le retour

    // Fusionner la configuration par défaut avec celle de l'utilisateur
    const config = useMemo(() => ({
        ...defaultConfig,
        ...userConfig,
        theme: { ...defaultConfig.theme, ...userConfig.theme }
    }), [userConfig]);
    
    // Sélectionner le header en fonction du département
    const getHeaderImage = useMemo(() => {
        if (player.dept === '971') return config.branding.headerImage971;
        if (player.dept === '972') return config.branding.headerImage972;
        if (player.dept === '973') return config.branding.headerImage973;
        return config.branding.headerImage; // Header par défaut
    }, [config.branding, player.dept]);

    const handleReturn = () => {
        // On redirige l'utilisateur vers la page de choix de son département
        navigate(`/bricoceram/anniversaire70ans/bricoceram/${player.dept}`);
    };

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
        
        .info-card {
            background-color: white;
            border-radius: 20px;
            padding: 40px 20px;
            width: 100%;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            border: 2px solid ${config.theme.primaryColor};
            margin-bottom: 20px;
            text-align: center;
        }
        
        .info-title {
            font-size: 2rem;
            margin: 0 0 15px 0;
            color: ${config.theme.primaryColor};
        }
        
        .info-subtitle {
            font-size: 1.1rem;
            color: ${config.theme.primaryColor};
            line-height: 1.5;
            margin-bottom: 25px;
        }

        .return-button {
            display: inline-block;
            padding: 12px 30px;
            background-color: ${config.theme.accentColor};
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            border: none;
            transition: background-color 0.2s;
        }

        .return-button:hover {
            background-color: ${config.theme.accentColorDark};
        }
    `, [config, player.dept]);

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

                {/* CONTENU CENTRAL */}
              <div style={{backgroundColor: "white", padding: "0", borderRadius: "10px", margin: "20px", overflow: "hidden"}}>
                    <div className="accroche-container">
                        <h1 className="info-title">Vous avez déjà gagné ! 🎉</h1>
                        <p className="info-subtitle">
                            Félicitations ! Vous avez déjà remporté un lot lors d'une précédente participation. Chaque participant ne peut gagner qu'une seule fois.
                        </p>
                        <button onClick={handleReturn} className="return-button">
                            Retour à l'accueil
                        </button>
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