import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// URL du logo fournie dans l'entrée utilisateur
const LOGO_URL = "https://z-cdn-media.chatglm.cn/files/2c048304-2dcd-42fc-a3ac-da3e85c62f62_bicro.png?auth_key=1791995891-e05e86f9635546718d3e1a0cfff0e3d4-0-6e20b6e8f7a9ef3ca7cbfc6e93f2bdd3";

// Composant SVG pour une épingle de carte (Map Pin Icon)
const MapPinIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
    </svg>
);

// Composant SVG pour un trophée (Trophy Icon)
const TrophyIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2"/>
        <path d="M18 9h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V15c0 1.1.9 2 2 2s2-.9 2-2v-.34c.81-.46 1.4-1.24 1.4-2.16 0-1.38-1.12-2.5-2.5-2.5S10.5 11.12 10.5 12.5c0 .92.59 1.7 1.4 2.16Z"/>
        <path d="M12 21a5 5 0 0 0 5-5V8H7v8a5 5 0 0 0 5 5Z"/>
    </svg>
);

// Composant SVG pour une icône d'anniversaire (Birthday Icon)
const BirthdayIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <path d="M12 3v18"/>
        <path d="M6 12h12"/>
        <path d="M12 3a3 3 0 0 1 3 3c0 1.11-.6 2.08-1.5 2.6"/>
        <path d="M9 3a3 3 0 0 0-3 3c0 1.11.6 2.08 1.5 2.6"/>
    </svg>
);

// Composant SVG pour une icône de cadeau (Gift Icon)
const GiftIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 12 20 22 4 22 4 12"></polyline>
        <rect x="2" y="7" width="20" height="5"></rect>
        <line x1="12" y1="22" x2="12" y2="7"></line>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
);

// Composant SVG pour une icône d'avion (Plane Icon)
const PlaneIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17.8 19.2 16 11l3.5-7A1 1 0 0 0 18 2H6a1 1 0 0 0-.5 1.8L9 11l-1.8 8.2a1 1 0 0 0 1.5 1.1l3.3-3.3 3.3 3.3a1 1 0 0 0 1.5-1.1z"></path>
    </svg>
);

// Composant SVG pour une icône de plage (Beach Icon)
const BeachIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"></path>
        <path d="M17 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h10"></path>
        <path d="M12 12v9"></path>
    </svg>
);

// Composant pour une carte de prix individuelle dans la grille
const PrizeCard = ({ icon: IconComponent, text, isFirst = false }) => (
    <div className={`prize-card ${isFirst ? 'prize-card-first' : ''}`}>
        {isFirst && <div className="prize-badge">1</div>}
        <IconComponent className="prize-card-icon" />
        <p className="prize-card-text">{text}</p>
    </div>
);

const App = ({ player, savePlayer, slug }) => {
    const navigate = useNavigate();

    // Logique de navigation
    const chooseDept = (dept) => {
        // Enregistrement du département, en supposant que savePlayer est disponible et asynchrone/synchrone
        if (savePlayer) {
            savePlayer({ dept });
        }
        
        // La navigation doit être sécurisée
        const deptSlug = dept.toLowerCase();
        const urlPrefix = `/${deptSlug}/${slug || 'default-slug'}/anniversaire`;

        if (player && player.played) {
            navigate(`${urlPrefix}/one-participation`);
        } else {
            navigate(`${urlPrefix}/form`);
        }
    };

    // Définition des classes CSS pour l'esthétique et la réactivité (Tailwind-like custom styles)
    const customStyles = useMemo(() => `
        /* Reset CSS */
        * { box-sizing: border-box; }
        html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; overflow-x: hidden; font-family: 'Inter', sans-serif; }
        :root {
            --primary-blue: #1e40af;
            --light-blue: #3b82f6;
            --accent-red: #dc2626;
            --accent-red-dark: #b91c1c;
            --red-light: #fee2e2;
            --gold: #fbbf24;
            --gold-light: #fef3c7;
            --gray-bg: #f0f9ff;
            --text-blue: #1d4ed8;
            --white: #ffffff;
            --shadow-gold: rgba(251, 191, 36, 0.4);
            --shadow-red: rgba(220, 38, 38, 0.4);
            --app-bg-start: #e0f2fe; /* Light Blue */
            --app-bg-end: #fff7e6; /* Very Light Orange/Gold */
        }

        /* Animations */
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes slideIn { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }

        /* 1. Conteneur global */
        .app-container {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding: 0;
            /* Nouveau fond dégradé plus vif + confettis */
            background: linear-gradient(135deg, var(--app-bg-start) 0%, var(--app-bg-end) 100%);
            position: relative;
            overflow: hidden;
            z-index: 1;
            
            /* Effet Confettis/Paillettes - Simple CSS */
            background-image: radial-gradient(var(--gold-light) 1px, transparent 0),
                              radial-gradient(var(--red-light) 1px, transparent 0);
            background-size: 15px 15px;
            background-position: 0 0, 7px 7px;
        }

        /* Éléments décoratifs flottants (pour le fond) */
        .floating-element { position: absolute; border-radius: 50%; opacity: 0.2; z-index: 1; filter: blur(4px); }
        .floating-element-1 { top: 10%; left: 5%; width: 90px; height: 90px; background: var(--primary-blue); animation: float 6s ease-in-out infinite; }
        .floating-element-2 { top: 20%; right: 8%; width: 70px; height: 70px; background: var(--accent-red); animation: float 8s ease-in-out infinite reverse; }
        .floating-element-3 { bottom: 15%; left: 10%; width: 80px; height: 80px; background: var(--gold); animation: float 7s ease-in-out infinite; }

        /* 2. Cadre de l'application (La carte principale) */
        .mobile-card {
            position: relative;
            z-index: 10;
            width: 100%;
            height: 100%;
            background-color: var(--white);
            padding: 0;
            border-radius: 0;
            box-shadow: none;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            overflow-y: auto;
            margin-top: 0;
            
            /* Ajout d'une ombre légère pour l'effet "carte" */
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }

        /* 2.1 Bandeau supérieur - Plus d'emphase sur l'anniversaire */
        .anniversary-banner {
            background: linear-gradient(90deg, var(--gold), var(--accent-red), var(--gold));
            color: var(--white);
            padding: 1rem 1.5rem; /* Plus grand */
            text-align: center;
            font-weight: 900;
            font-size: 1.1rem; /* Plus grand */
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            z-index: 20;
            letter-spacing: 0.05em;
        }

        /* 3. Section Principale du Jeu (Contient Logo et Prix) */
        .game-main-section {
            padding: 0 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            animation: slideIn 0.5s ease-out;
            margin-bottom: 1rem;
        }

        /* 3.1 Header et Logo */
        .app-header {
            text-align: center;
            margin-top: 1rem;
        }
        .logo-container { position: relative; margin-bottom: 0.5rem; }
        .logo { max-width: 250px; width: 100%; height: auto; filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1)); }
        .logo-badge {
            position: absolute; top: -15px; right: 15%; background: var(--accent-red); color: var(--white);
            width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center;
            justify-content: center; font-weight: 800; font-size: 1.1rem; border: 4px solid var(--white);
            box-shadow: 0 4px 10px var(--shadow-red); animation: pulse 2s infinite;
        }
        .subtitle { font-size: 1.1rem; font-weight: 600; color: var(--text-blue); margin-top: 0; }
        
        /* Titres de la section Prix */
        .main-title { font-size: 1.5rem; font-weight: 800; color: var(--primary-blue); text-align: center; margin: 0; }
        .main-subtitle-red { font-size: 1.1rem; font-weight: 700; color: var(--accent-red); text-align: center; margin: 0; }

        /* 3.2 Total Prix */
        .total-prize-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            font-weight: 800; /* Plus gras */
            color: var(--gold);
            text-shadow: 1px 1px 3px rgba(0,0,0,0.2); /* Ombre plus marquée */
            margin: 1rem 0 1.5rem 0;
            padding-bottom: 0.5rem;
            border-bottom: 3px dashed var(--accent-red); /* Bordure dashed pour l'effet fête */
            width: 100%;
        }
        .total-prize-icon { width: 1.75rem; height: 1.75rem; color: var(--gold); margin-right: 0.5rem; }

        /* 3.3 Grille des 3 Prix (L'élément clé du design) */
        .prize-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.75rem;
            width: 100%;
            margin-bottom: 1.5rem;
        }
        .prize-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 0.5rem;
            background: var(--gray-bg);
            border-radius: 0.75rem;
            border: 2px solid var(--red-light);
            box-shadow: 0 4px 8px -2px rgba(0,0,0,0.1);
            position: relative;
            min-height: 100px;
        }
        .prize-badge {
            position: absolute; top: -10px; left: -10px; background: var(--gold); color: var(--white);
            width: 28px; height: 28px; border-radius: 50%; font-size: 0.9rem; font-weight: bold;
            display: flex; align-items: center; justify-content: center; border: 3px solid var(--white);
            box-shadow: 0 2px 5px var(--shadow-gold);
        }
        .prize-card-icon { width: 2.2rem; height: 2.2rem; color: var(--accent-red); margin-bottom: 0.25rem; } /* Icônes plus grandes */
        .prize-card-text { font-size: 0.75rem; font-weight: 600; color: #333; margin: 0; line-height: 1.2; }


        /* 4. Section de Sélection de Département */
        .department-selection {
            padding: 0 1.5rem;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }
        .select-island-title {
            font-size: 1.8rem;
            font-weight: 900; /* Plus gras */
            color: var(--primary-blue);
            text-align: center;
            margin: 0 0 1.5rem 0;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.05);
        }
        .button-grid-container {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }
        .guayane-container {
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
        }
        .dept-button-wrapper {
            width: 100%;
        }

        /* 5. Style des boutons de département - Mise en évidence */
        .dept-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1.75rem 0; /* Plus de padding */
            font-size: 1.2rem; /* Plus grand */
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em; /* Plus d'espacement */
            color: var(--white);
            background: linear-gradient(135deg, var(--accent-red), var(--accent-red-dark)); /* Dégradé sur le bouton */
            border: none;
            border-radius: 1rem;
            cursor: pointer;
            box-shadow: 0 8px 20px -5px var(--shadow-red);
            transition: all 0.3s ease-in-out;
            min-width: 150px;
        }
        .guayane-container .dept-button {
            width: 100%;
            max-width: 300px;
        }
        .dept-button:hover { 
            transform: scale(1.05); /* Augmentation légère au survol */
            box-shadow: 0 15px 30px -5px var(--shadow-red); 
        }
        .dept-button:active { transform: scale(0.97); }
        .icon-container { margin-bottom: 0.75rem; }
        .dept-icon { width: 3rem; height: 3rem; color: var(--white); } /* Icônes plus grandes */

        /* 6. Texte de pied de page */
        .footer-text {
            padding: 1.5rem;
            border-top: 1px solid #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--primary-blue); /* Changement de couleur pour contraster légèrement */
            text-align: center;
            line-height: 1.3;
            margin-top: auto;
            background-color: var(--gray-bg); /* Couleur de fond légère */
            width: 100%;
            flex-shrink: 0;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }
        .footer-text-icon { width: 1.25rem; height: 1.25rem; margin-right: 0.5rem; color: var(--accent-red); }

        /* --- Media Query pour écrans plus grands (sm: 640px) --- */
        @media (min-width: 640px) {
            .app-container {
                padding: 4rem 0;
                justify-content: center;
            }
            .mobile-card {
                width: 100%;
                max-width: 600px;
                height: auto;
                min-height: auto;
                max-height: 90vh;
                padding: 0;
                border-radius: 1.5rem;
                box-shadow: 0 25px 50px -12px rgba(30, 64, 175, 0.25);
            }
            .game-main-section {
                padding: 2rem 2.5rem 1rem 2.5rem;
                gap: 2rem;
            }
            .logo { max-width: 300px; }
            .main-title { font-size: 2.5rem; }
            .total-prize-wrapper { font-size: 1.6rem; margin: 1.5rem 0 2rem 0; }
            .prize-card { min-height: 130px; padding: 0.75rem; }
            .prize-card-text { font-size: 0.9rem; }
            
            .department-selection {
                padding: 0 2.5rem;
                margin-top: 1rem;
            }
            .select-island-title { font-size: 2.5rem; margin-bottom: 2rem; }
            .dept-button { padding: 2.5rem 0; }
            .footer-text {
                font-size: 1rem;
                padding: 2rem;
                border-bottom-left-radius: 1.5rem;
                border-bottom-right-radius: 1.5rem;
            }
        }
    `, []);

    // Composant de bouton utilisant les classes CSS
    const DepartmentButton = ({ dept, icon: IconComponent }) => (
        <button className="dept-button" onClick={() => chooseDept(dept)}>
            <div className="icon-container">
                <IconComponent className="dept-icon" />
            </div>
            <span className="dept-name">{dept}</span>
        </button>
    );

    return (
        <div className="app-container">
            <style dangerouslySetInnerHTML={{ __html: customStyles }} />
            
            {/* Éléments de fond décoratifs */}
            <div className="floating-element floating-element-1"></div>
            <div className="floating-element floating-element-2"></div>
            <div className="floating-element floating-element-3"></div>
            
            <div className="mobile-card">
                {/* 1. Bandeau supérieur */}
                <div className="anniversary-banner">
                    🎉 70 Ans "La fet toulong" ! 🎉
                </div>
                
                {/* 2. Section principale (Logo + Prix) */}
                <div className="game-main-section">
                    
                    {/* Header et Logo */}
                    <header className="app-header">
                        <div className="logo-container">
                            <img
                                src={LOGO_URL}
                                alt="Logo Brico Céram"
                                className="logo"
                                // Utiliser un placeholder si l'image distante échoue
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/280x100/1e40af/ffffff?text=BricoCeram+Logo" }}
                            />
                            <div className="logo-badge">70 ans</div>
                        </div>
                        <p className="subtitle">
                            <BirthdayIcon className="inline w-5 h-5 mr-1" />
                            Jeu Anniversaire
                        </p>
                    </header>

                    {/* Titres et Total Prix */}
                    <h2 className="main-title">GRAND JEU ANNIVERSAIRE BRICOCERAM</h2>
                    <p className="main-subtitle-red">70 Ans La fet toulong !</p>
                    
                    <div className="total-prize-wrapper">
                        <GiftIcon className="total-prize-icon" />
                        <span className="total-prize-text">+15 000€ à gagner dont</span>
                    </div>
                    
                    {/* Grille des 3 Prix */}
                    <div className="prize-grid">
                        <PrizeCard icon={PlaneIcon} text="1 Croisière au départ de Miami pour 2 pers." isFirst={true} />
                        <PrizeCard icon={BeachIcon} text="1 Séjour d'une semaine à Punta Cana" />
                        <PrizeCard icon={GiftIcon} text="et dizaines de bons d'achat de 70€" />
                    </div>
                </div>

                {/* 3. Section de Sélection de l'île */}
                <div className="department-selection">
                    <h1 className="select-island-title">Choisissez votre île</h1>
                    
                    {/* Martinique et Guyane côte à côte sur desktop */}
                    <div className="button-grid-container">
                        <DepartmentButton dept="MARTINIQUE" icon={MapPinIcon} />
                        <DepartmentButton dept="GUYANE" icon={MapPinIcon} />
                    </div>
                    
                    {/* Guadeloupe centré et prend toute la largeur disponible */}
                    <div className="guayane-container">
                        <div className="dept-button-wrapper">
                            <DepartmentButton dept="GUADELOUPE" icon={MapPinIcon} />
                        </div>
                    </div>
                </div>

                {/* 4. Pied de page */}
                <footer className="footer-text">
                    <TrophyIcon className="footer-text-icon" />
                    Sélectionnez votre région pour commencer et tenter de gagner !
                </footer>
            </div>
        </div>
    );
};

export default App;
