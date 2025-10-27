import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { usePlayer } from '../App'; // Import du contexte du joueur

// Configuration par défaut pour Brico Ceram avec les images
const defaultConfig = {
    branding: {
        // URLs des images pour la structure visuelle
        headerImage: "./images/header.png",
        headerImage971: "./images/headergpe.png",
        headerImage972: "./images/header.png",
        headerImage973: "./images/headerguy.png",
        accrocheImage: "https://placehold.co/400x200/dc2626/ffffff?text=PARTICIPATION+UNIQUE",
        accrocheImage971: "https://placehold.co/400x200/dc2626/ffffff?text=PARTICIPATION+UNIQUE+971",
        accrocheImage972: "https://placehold.co/400x200/dc2626/ffffff?text=PARTICIPATION+UNIQUE+972",
        accrocheImage973: "https://placehold.co/400x200/dc2626/ffffff?text=PARTICIPATION+UNIQUE+973",
        footerImage: "./images/Footer_brico.png",
        backgroundImage: "https://placehold.co/480x800/f0f9ff/1e40af?text=Background+Brico",
    },
    theme: {
        primaryColor: '#1e40af',
        accentColor: '#dc2626',
        accentColorDark: '#b91c1c',
        goldColor: '#fbbf24',
        warningColor: '#FFA500',
        lightWarningBg: '#FFFACD',
        white: '#ffffff',
    }
};

export default function OneParticipationPage({ config: userConfig = {} }) {
    const navigate = useNavigate();
    const { slug } = useParams(); // Pour construire l'URL de retour
    const { player } = usePlayer(); // Récupération du joueur depuis le contexte
    
    // Fusionner la configuration par défaut avec celle de l'utilisateur
    const config = useMemo(() => ({
        ...defaultConfig,
        ...userConfig,
        theme: { ...defaultConfig.theme, ...userConfig.theme }
    }), [userConfig]);
    
    // Sélectionner l'image d'accroche en fonction du département
    const getAccrocheImage = useMemo(() => {
        if (player.dept === '971') return config.branding.accrocheImage971;
        if (player.dept === '972') return config.branding.accrocheImage972;
        if (player.dept === '973') return config.branding.accrocheImage973;
        return config.branding.accrocheImage; // Image par défaut
    }, [config.branding, player.dept]);
    
    // Sélectionner le header en fonction du département
    const getHeaderImage = useMemo(() => {
        if (player.dept === '971') return config.branding.headerImage971;
        if (player.dept === '972') return config.branding.headerImage972;
        if (player.dept === '973') return config.branding.headerImage973;
        return config.branding.headerImage; // Header par défaut
    }, [config.branding, player.dept]);

    const handleReturn = () => {
        // Redirige vers la page d'accueil du site ou de l'application
        navigate(`/`);
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
        
        .warning-card {
            background-color: 'white';
            border-radius: '20px';
            padding: '30px 20px';
            width: '100%';
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)';
            border: '2px solid ${config.theme.warningColor}';
            margin-bottom: '20px';
        }
        
        .warning-title {
            font-size: '2rem';
            margin: '0 0 10px 0';
            color: ${config.theme.warningColor};
        }
        
        .warning-subtitle {
            font-size: '1.2rem';
            color: ${config.theme.primaryColor};
            fontWeight: 'bold';
            marginBottom: '20px';
        }
        
        .info-container {
            margin: '20px 0';
            padding: '15px';
            backgroundColor: ${config.theme.lightWarningBg};
            borderRadius: '12px';
            color: ${config.theme.primaryColor};
            border: '1px solid ${config.theme.warningColor}';
        }
        
        .info-text {
            font-size: '1rem';
            display: 'block';
        }
        
        .thanks-message {
            font-size: '1rem';
            color: ${config.theme.primaryColor};
            marginTop: '25px';
        }
        
        .return-button {
            marginTop: '30px';
            padding: '15px 30px';
            fontSize: '1.2rem';
            fontWeight: 'bold';
            backgroundColor: ${config.theme.primaryColor};
            color: 'white';
            border: 'none';
            borderRadius: '8px';
            cursor: 'pointer';
            boxShadow: '0 4px 10px rgba(0, 0, 139, 0.3)';
            transition: 'background-color 0.2s';
        }
        
        .return-button:hover {
            background-color: ${config.theme.accentColor};
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
    `, [config, player.dept]);

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
<div className="accroche-container">
                        <img
                            src={getAccrocheImage}
                            alt="Accroche"
                            className="accroche-image"
                        />
                    </div>
                {/* CONTENU CENTRAL - poussé vers le bas grâce à marginTop: 'auto' */}
                <div style={{ backgroundColor: "white", padding: "0", borderRadius: "10px", marginBottom: "20px", overflow: "hidden", marginTop: "auto" }}>
                  
                </div>

                {/* FOOTER fixé tout en bas */}
                <div style={{ width: "100%", flexShrink: 0 }}>
                    <img src={config.branding.footerImage} alt="Footer" style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }} />
                </div>
                
            </div>
        
        </div>
        
    );
}