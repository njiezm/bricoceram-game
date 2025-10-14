import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Composant SVG pour une épingle de carte (remplace MapPin)
const MapPinIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
    </svg>
);

// Composant SVG pour un trophée (remplace Trophy)
const TrophyIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2"/>
        <path d="M18 9h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V15c0 1.1.9 2 2 2s2-.9 2-2v-.34c.81-.46 1.4-1.24 1.4-2.16 0-1.38-1.12-2.5-2.5-2.5S10.5 11.12 10.5 12.5c0 .92.59 1.7 1.4 2.16Z"/>
        <path d="M12 21a5 5 0 0 0 5-5V8H7v8a5 5 0 0 0 5 5Z"/>
    </svg>
);

// Composant SVG pour une icône d'anniversaire
const BirthdayIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <path d="M12 3v18"/>
        <path d="M6 12h12"/>
        <path d="M12 3a3 3 0 0 1 3 3c0 1.11-.6 2.08-1.5 2.6"/>
        <path d="M9 3a3 3 0 0 0-3 3c0 1.11.6 2.08 1.5 2.6"/>
    </svg>
);

const App = ({ player, savePlayer, slug }) => {
    const navigate = useNavigate();

    // Vider localStorage (assurez-vous que c'est le comportement voulu dans un environnement de production)
    if (typeof localStorage !== 'undefined') {
        localStorage.clear();
    }

    // Logique de navigation
    const chooseDept = (dept) => {
        savePlayer({ dept });
        const urlPrefix = `/${dept}/${slug}/anniversaire`;
        if (player && player.played) {
            // Si le joueur a déjà joué
            navigate(`${urlPrefix}/one-participation`);
        } else {
            // Première participation
            navigate(`${urlPrefix}/form`);
        }
    };

    // Définition des classes CSS critiques en tant que style pour l'intégration
    const customStyles = useMemo(() => `
        /* Reset CSS pour s'assurer qu'il n'y a pas de marge par défaut */
        * {
            box-sizing: border-box;
        }
        
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden; /* Empêche le scroll horizontal */
        }

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
        }

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        @keyframes sparkle {
            0% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
        }

        /* 1. Conteneur global - Prend TOUTE la page */
        .app-container {
            width: 100vw; /* 100% de la largeur de la vue */
            height: 100vh; /* 100% de la hauteur de la vue */
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch; /* Étire les enfants pour remplir la largeur */
            padding: 0;
            background: linear-gradient(135deg, var(--gray-bg) 0%, #e0f2fe 50%, var(--gold-light) 100%);
            font-family: 'Inter', sans-serif;
            position: relative;
            overflow: hidden;
        }

        /* Éléments décoratifs flottants */
        .floating-element {
            position: absolute;
            border-radius: 50%;
            opacity: 0.1;
            z-index: 1;
        }

        .floating-element-1 {
            top: 10%;
            left: 5%;
            width: 80px;
            height: 80px;
            background: var(--primary-blue);
            animation: float 6s ease-in-out infinite;
        }

        .floating-element-2 {
            top: 20%;
            right: 8%;
            width: 60px;
            height: 60px;
            background: var(--accent-red);
            animation: float 8s ease-in-out infinite reverse;
        }

        .floating-element-3 {
            bottom: 15%;
            left: 10%;
            width: 70px;
            height: 70px;
            background: var(--gold);
            animation: float 7s ease-in-out infinite;
        }

        .sparkle {
            position: absolute;
            width: 10px;
            height: 10px;
            background: var(--gold);
            border-radius: 50%;
            animation: sparkle 2s ease-in-out infinite;
        }

        .sparkle-1 { top: 30%; right: 20%; animation-delay: 0.5s; }
        .sparkle-2 { top: 60%; left: 15%; animation-delay: 1s; }
        .sparkle-3 { bottom: 25%; right: 25%; animation-delay: 1.5s; }

        /* 2. Cadre de l'application (Plein écran sans bordure) */
        .mobile-card {
            position: relative;
            z-index: 10;
            width: 100%;
            height: 100%; /* Prend toute la hauteur du parent (.app-container) */
            background-color: var(--white);
            padding: 1.5rem; /* Padding interne pour le contenu */
            border-radius: 0;
            border: none;
            box-shadow: none;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            overflow-y: auto; /* Permet le scroll vertical si le contenu dépasse */
        }

        /* Bandeau supérieur pour les 70 ans */
        .anniversary-banner {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(90deg, var(--gold), var(--accent-red));
            color: var(--white);
            padding: 0.75rem;
            text-align: center;
            font-weight: bold;
            font-size: 1rem;
            letter-spacing: 0.05em;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            z-index: 20;
        }

        /* 3. Header et Logo */
        .app-header {
            text-align: center;
            margin-top: 3.5rem; /* Espace pour le bandeau */
            margin-bottom: 1rem;
        }

        .logo-container {
            position: relative;
            margin-bottom: 1.5rem;
        }

        .logo {
            max-width: 280px;
            width: 100%;
            height: auto;
            margin: 0 auto;
            filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
        }

        .logo-badge {
            position: absolute;
            top: -15px;
            right: 15%;
            background: var(--accent-red);
            color: var(--white);
            width: 70px;
            height: 70px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            border: 3px solid var(--white);
            animation: pulse 2s infinite;
        }

        .subtitle {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--text-blue);
            margin-top: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        /* 4. Section du Titre */
        .title-section {
            border-bottom: 2px solid var(--red-light);
            padding-bottom: 1.5rem;
            margin-bottom: 0.5rem;
        }

        .title-section h1 {
            font-size: 1.8rem;
            font-weight: 800;
            color: var(--primary-blue);
            text-align: center;
            margin: 0;
        }

        /* 5. Conteneur des Boutons */
        .buttons-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            flex-grow: 1;
            justify-content: center;
        }

        .button-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1.5rem;
        }

        .guadeloupe-container {
            display: flex;
            justify-content: center;
        }

        .guadeloupe-button-wrapper {
            width: 100%;
            max-width: 300px;
        }

        /* 6. Style des boutons de département */
        .dept-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1.5rem 0;
            font-size: 1.1rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--white);
            background: linear-gradient(to bottom right, var(--accent-red), var(--accent-red-dark));
            border: none;
            border-radius: 1rem;
            cursor: pointer;
            box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.2);
            transition: all 0.3s ease-in-out;
            position: relative;
            overflow: hidden;
        }

        .dept-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .dept-button:hover::before {
            left: 100%;
        }

        .dept-button:hover {
            transform: scale(1.03);
            box-shadow: 0 20px 25px -5px rgba(220, 38, 38, 0.3);
        }

        .dept-button:active {
            transform: scale(0.95);
        }

        .dept-button:focus {
            outline: none;
            box-shadow: 0 0 0 4px rgba(252, 165, 165, 0.5);
        }

        .icon-container {
            margin-bottom: 0.75rem;
        }

        .dept-icon {
            width: 2.5rem;
            height: 2.5rem;
            color: var(--white);
        }

        /* 7. Texte de pied de page */
        .footer-text {
            padding-top: 1.5rem;
            border-top: 1px solid #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            font-weight: 500;
            color: var(--text-blue);
            text-align: center;
            line-height: 1.5;
            margin-top: auto;
        }

        .footer-text-icon {
            width: 1.5rem;
            height: 1.5rem;
            margin-right: 0.5rem;
            color: var(--accent-red);
        }

        .app-branding {
            display: none;
        }

        /* --- Media Query pour écrans plus grands (sm: 640px) --- */
        @media (min-width: 640px) {
            /* On recentre la carte sur desktop pour une meilleure lisibilité */
            .app-container {
                padding: 2rem 0;
                justify-content: center;
                align-items: center;
            }

            .mobile-card {
                width: 100%;
                max-width: 600px;
                height: auto;
                min-height: auto;
                max-height: 90vh;
                padding: 2rem;
                border-radius: 1.5rem;
                box-shadow: 0 25px 50px -12px rgba(30, 64, 175, 0.25);
            }
            
            .title-section h1 {
                font-size: 2.2rem;
            }

            .dept-button {
                padding: 1.75rem 0;
            }
            
            .guadeloupe-button-wrapper {
                max-width: 280px;
            }
            
            .dept-icon {
                width: 3rem;
                height: 3rem;
            }

            .floating-element-1 { width: 100px; height: 100px; }
            .floating-element-2 { width: 80px; height: 80px; }
            .floating-element-3 { width: 90px; height: 90px; }
        }

        @media (min-width: 1024px) {
            .mobile-card {
                max-width: 700px;
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
            
            <div className="floating-element floating-element-1"></div>
            <div className="floating-element floating-element-2"></div>
            <div className="floating-element floating-element-3"></div>
            <div className="sparkle sparkle-1"></div>
            <div className="sparkle sparkle-2"></div>
            <div className="sparkle sparkle-3"></div>
            
            <div className="mobile-card">
                <div className="anniversary-banner">
                    🎉 70 ans d'excellence Brico Ceram 🎉
                </div>
                
                <header className="app-header">
                    <div className="logo-container">
                        <img
                            src="https://z-cdn-media.chatglm.cn/files/2c048304-2dcd-42fc-a3ac-da3e85c62f62_bicro.png?auth_key=1791995891-e05e86f9635546718d3e1a0cfff0e3d4-0-6e20b6e8f7a9ef3ca7cbfc6e93f2bdd3"
                            alt="Logo Brico Céram"
                            className="logo"
                        />
                        <div className="logo-badge">70 ans</div>
                    </div>
                    <p className="subtitle">
                        <BirthdayIcon />
                        Jeu Anniversaire
                    </p>
                </header>

                <div className="title-section">
                    <h1>Choisissez votre île</h1>
                </div>

                <div className="buttons-container">
                    <div className="button-grid">
                        <DepartmentButton dept="Martinique" icon={MapPinIcon} />
                        <DepartmentButton dept="Guyane" icon={MapPinIcon} />
                    </div>
                    <div className="guadeloupe-container">
                        <div className="guadeloupe-button-wrapper">
                            <DepartmentButton dept="Guadeloupe" icon={MapPinIcon} />
                        </div>
                    </div>
                </div>

                <footer className="footer-text">
                    <TrophyIcon className="footer-text-icon" />
                    Sélectionnez votre région pour commencer et tenter de gagner !
                </footer>
            </div>
        </div>
    );
};

export default App;