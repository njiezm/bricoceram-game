import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';

// Configuration par défaut pour Brico Ceram avec les images
const defaultConfig = {
    branding: {
        // URLs des images pour la structure visuelle
        headerImage: "../images/header.png",
        headerImage971: "../images/headergpe.png", // Ajout du header pour la 971
        headerImage972: "../images/header.png",    // Ajout du header pour la 972
        headerImage973: "../images/headerguy.png", // Ajout du header pour la 973
        accrocheImage: "../images/text_dommage_mq.png",
        accrocheImage971: "../images/text_dommage_mq.png",
        accrocheImage972: "../images/text_dommage_972.png",
        accrocheImage973: "../images/text_dommage_973.png",
        footerImage: "../images/text_footer.png",
        backgroundImage: "https://placehold.co/480x800/f0f9ff/1e40af?text=Background+Brico",
    },
    theme: {
        primaryColor: '#1e40af',
        accentColor: '#dc2626',
        accentColorDark: '#b91c1c',
        goldColor: '#fbbf24',
        failColor: '#B22222',
        white: '#ffffff',
    }
};

export default function LosePage({ config: userConfig = {} }) {
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
    const score = location.state?.score || 55; // Score par défaut si non trouvé
    
    // Sélectionner l'image d'accroche en fonction du département
    const getAccrocheImage = useMemo(() => {
        if (dept === '971') return config.branding.accrocheImage971;
        if (dept === '972') return config.branding.accrocheImage972;
        if (dept === '973') return config.branding.accrocheImage973;
        return config.branding.accrocheImage; // Image par défaut
    }, [config.branding, dept]);

    // Sélectionner l'image du header en fonction du département
    const getHeaderImage = useMemo(() => {
        if (dept === '971') return config.branding.headerImage971;
        if (dept === '972') return config.branding.headerImage972;
        if (dept === '973') return config.branding.headerImage973;
        return config.branding.headerImage; // Image par défaut
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
            background-color: #fff;
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
            margin: auto;
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
        
        .lose-card {
            background-color: white;
            border-radius: 20px;
            padding: 30px 20px;
            width: 100%;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            border: 2px solid ${config.theme.failColor};
            margin-bottom: 20px;
        }
        
        .lose-title {
            font-size: 2.5rem;
            margin: 0 0 10px 0;
            color: ${config.theme.failColor};
        }
        
        .lose-subtitle {
            font-size: 1.2rem;
            color: ${config.theme.primaryColor};
            font-weight: bold;
            margin-bottom: 20px;
        }
        
        .score-container {
            margin: 20px 0;
            padding: 15px;
            background-color: ${config.theme.failColor};
            border-radius: 12px;
            color: white;
            font-weight: bold;
        }
        
        .score-label {
            font-size: 1.5rem;
            display: block;
        }
        
        .score-value {
            font-size: 3rem;
            display: block;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        
        .lose-message {
            font-size: 1rem;
            color: ${config.theme.primaryColor};
            margin-top: 25px;
        }
        
        .return-button {
            margin-top: 30px;
            padding: 15px 30px;
            font-size: 1.2rem;
            font-weight: bold;
            background-color: ${config.theme.primaryColor};
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0, 0, 139, 0.3);
            transition: background-color 0.2s;
        }
        
        .return-button:hover {
            background-color: ${config.theme.accentColor};
        }
        
        .accroche-container {
            width: calc(100% + 30px);
            margin: 0 -15px;
            overflow: hidden;
        }
        
        .accroche-image {
            width: 100%;
            height: auto;
            display: block;
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
                        src={getHeaderImage()} // Utilisation de la fonction pour le header dynamique
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
                <div className="content">
                    <div style={{backgroundColor: "white", padding: "15px", borderRadius: "10px", marginBottom: "20px", overflow: "hidden"}}>
                        <div className="accroche-container">
                            <img
                                src={getAccrocheImage()} // Utilisation de la fonction pour l'accroche dynamique
                                alt="Accroche"
                                className="accroche-image"
                            />
                        </div>
                        
                        <div className="lose-card">
                            <h1 className="lose-title">Dommage !</h1>
                            <p className="lose-subtitle">Ce n'est pas gagné cette fois.</p>
                            
                            <div className="score-container">
                                <span className="score-label">Votre score</span>
                                <span className="score-value">{score}</span>
                            </div>
                            
                            <p className="lose-message">
                                Retentez votre chance demain pour une nouvelle opportunité de gagner !
                            </p>
                            
                            <button onClick={handleReturn} className="return-button">
                                Rejouer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}