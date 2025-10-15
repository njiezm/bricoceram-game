import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Configuration par défaut pour Brico Ceram avec les nouvelles images
const defaultConfig = {
    branding: {
        // URLs des images pour la structure visuelle
        headerImage: "https://placehold.co/480x150/1e40af/ffffff?text=Header+Brico+Ceram",
        footerImage: "https://placehold.co/480x100/fbbf24/1e40af?text=Footer+Brico+Ceram",
        backgroundImage: "https://placehold.co/480x960/f0f9ff/1e40af?text=Background+Brico",
        
        // Contenu textuel et logo
        logoUrl: "https://z-cdn-media.chatglm.cn/files/2c048304-2dcd-42fc-a3ac-da3e85c62f62_bicro.png?auth_key=1791995891-e05e86f9635546718d3e1a0cfff0e3d4-0-6e20b6e8f7a9ef3ca7cbfc6e93f2bdd3",
        mainTitle: "GRAND JEU ANNIVERSAIRE BRICOCERAM",
        subTitle: "70 Ans La fet toulong !",
        footerText: "Sélectionnez votre région pour commencer et tenter de gagner !",
        logoBadgeText: "70 ans",
    },
    game: {
        slug: "jeu-bricoceram-70ans",
        departments: [
            { name: "MARTINIQUE", icon: "📍" },
            { name: "GUYANE", icon: "📍" },
            { name: "GUADELOUPE", icon: "📍" }
        ],
    },
    theme: {
        primaryColor: '#1e40af',
        accentColor: '#dc2626',
        accentColorDark: '#b91c1c',
        goldColor: '#fbbf24',
        white: '#ffffff',
        shadowRed: 'rgba(220, 38, 38, 0.4)',
    }
};

export default function GlobalSelectionPage({ player, savePlayer, config: userConfig = {} }) {
    const navigate = useNavigate();

    // 2. Fusionner la configuration par défaut avec celle de l'utilisateur
    const config = useMemo(() => ({
        ...defaultConfig,
        ...userConfig,
        theme: { ...defaultConfig.theme, ...userConfig.theme },
        game: { ...defaultConfig.game, ...userConfig.game }
    }), [userConfig]);

    const chooseDept = (dept) => {
        if (savePlayer) savePlayer({ dept });
        const deptSlug = dept.toLowerCase();
        
        const urlPrefix = `/${deptSlug}/${config.game.slug}/anniversaire`;
        
        if (player && player.played) {
            navigate(`${urlPrefix}/one-participation`);
        } else {
            navigate(`${urlPrefix}/form`);
        }
    };

    // 3. Le CSS est adapté pour la nouvelle structure "rectangle"
    const customStyles = useMemo(() => `
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; font-family: 'Inter', sans-serif; }

        .punch-wrapper {
            display: flex;
            justify-content: center;
            align-items: stretch;
            background-color: #fff;
            min-height: 100vh;
 
        }
        
        .punch-container {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            background-image: url(${config.branding.backgroundImage});
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            width: 92vw;
            max-width: 480px;
            min-height: 100vh;
            box-shadow: 0 0 8px rgba(0,0,0,0.4);
        }

        .punch-header, .punch-footer {
            width: 100%;
            flex-shrink: 0;
        }
        .punch-header img, .punch-footer img {
            width: 100%;
            height: auto;
            display: block;
        }

        .punch-content {
            width: 90%;
            max-width: 400px;
            text-align: center;
            color: ${config.theme.white};
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 1.5rem 0;
        }

        .app-header { text-align: center; margin-bottom: 1rem; }
        .logo-container { position: relative; margin-bottom: 0.5rem; }
        .logo { max-width: 200px; width: 100%; height: auto; filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3)); }
        .logo-badge {
            position: absolute; top: -10px; right: 10%; background: ${config.theme.accentColor}; color: ${config.theme.white};
            width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center;
            justify-content: center; font-weight: 800; font-size: 0.9rem; border: 3px solid ${config.theme.white};
            box-shadow: 0 4px 10px ${config.theme.shadowRed}; animation: pulse 2s infinite;
        }
        .main-title { font-size: 1.5rem; font-weight: 800; color: ${config.theme.white}; text-align: center; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
        .main-subtitle-red { font-size: 1.1rem; font-weight: 700; color: ${config.theme.goldColor}; text-align: center; margin: 0.5rem 0 2rem 0; text-shadow: 1px 1px 3px rgba(0,0,0,0.5); }

        .department-selection {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        .select-island-title {
            font-size: 1.8rem; font-weight: 900; color: ${config.theme.white}; text-align: center;
            margin: 0 0 1.5rem 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .button-grid-container {
            display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; width: 100%;
        }
        .guayane-container { display: flex; justify-content: center; width: 100%; }
        .dept-button-wrapper { width: 100%; max-width: 300px; }

        .dept-button {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            padding: 1.25rem 0.5rem; font-size: 1rem; font-weight: 800; text-transform: uppercase;
            letter-spacing: 0.05em; color: ${config.theme.white}; background: linear-gradient(135deg, ${config.theme.accentColor}, ${config.theme.accentColorDark});
            border: none; border-radius: 0.75rem; cursor: pointer; box-shadow: 0 8px 20px -5px ${config.theme.shadowRed};
            transition: all 0.3s ease-in-out; min-width: 120px;
        }
        .dept-button:hover { transform: scale(1.05); box-shadow: 0 15px 30px -5px ${config.theme.shadowRed}; }
        .dept-button:active { transform: scale(0.97); }
        .icon-container { margin-bottom: 0.5rem; }
        .dept-icon { font-size: 2.5rem; }
        .dept-name { font-size: 0.8rem; }

        .footer-text {
            width: 100%;
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
            font-weight: 600;
            color: ${config.theme.white};
            text-align: center;
            line-height: 1.3;
            background: rgba(0,0,0,0.4);
            text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
        }
        .footer-text-icon { font-size: 1.25rem; margin-right: 0.5rem; }

        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }

        @media (min-width: 640px) {
            .punch-container {
                width: 100%;
                max-width: 480px; /* Garde une taille raisonnable sur desktop */
                height: 90vh;
                margin: auto;
            }
            .main-title { font-size: 1.8rem; }
            .select-island-title { font-size: 2rem; }
        }
    `, [config]);

    const DepartmentButton = ({ dept, icon }) => (
        <button className="dept-button" onClick={() => chooseDept(dept)}>
            <div className="icon-container">
                <span className="dept-icon">{icon}</span>
            </div>
            <span className="dept-name">{dept}</span>
        </button>
    );

    return (
        <div className="punch-wrapper">
            <style dangerouslySetInnerHTML={{ __html: customStyles }} />
            
            <div className="punch-container">
                {/* HEADER */}
                <div className="punch-header">
                    <img src={config.branding.headerImage} alt="Header" />
                </div>

                {/* CONTENU CENTRAL */}
                <div className="punch-content">
                    <header className="app-header">
                        <div className="logo-container">
                            <img
                                src={config.branding.logoUrl}
                                alt="Logo"
                                className="logo"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/280x100/1e40af/ffffff?text=Logo" }}
                            />
                            <div className="logo-badge">{config.branding.logoBadgeText}</div>
                        </div>
                    </header>

                    <h2 className="main-title">{config.branding.mainTitle}</h2>
                    <p className="main-subtitle-red">{config.branding.subTitle}</p>

                    <div className="department-selection">
                        <h1 className="select-island-title">Choisissez votre île</h1>
                        
                        <div className="button-grid-container">
                            {config.game.departments.slice(0, 2).map(dept => (
                                <DepartmentButton key={dept.name} dept={dept.name} icon={dept.icon} />
                            ))}
                        </div>
                        
                        <div className="guayane-container">
                            <div className="dept-button-wrapper">
                                <DepartmentButton dept={config.game.departments[2].name} icon={config.game.departments[2].icon} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="punch-footer">
                    <img src={config.branding.footerImage} alt="Footer" />
                    <div className="footer-text">
                        <span className="footer-text-icon">🏆</span>
                        {config.branding.footerText}
                    </div>
                </div>
            </div>
        </div>
    );
}