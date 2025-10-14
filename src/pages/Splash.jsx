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
        :root {
            --primary-blue: #1e40af; /* Bleu foncé Brico Ceram */
            --light-blue: #3b82f6; /* Bleu clair Brico Ceram */
            --accent-red: #dc2626; /* Rouge principal Brico Ceram */
            --accent-red-dark: #b91c1c; /* Rouge foncé Brico Ceram */
            --red-light: #fee2e2; /* Rouge très clair */
            --gold: #fbbf24; /* Or pour les 70 ans */
            --gold-light: #fef3c7; /* Or très clair */
            --gray-bg: #f0f9ff; /* Bleu très clair pour le fond */
            --text-blue: #1d4ed8; /* Bleu moyen */
            --white: #ffffff;
        }

        /* Animations CSS */
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

        /* 1. Conteneur global */
        .app-container {
            min-height: 100vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start; /* Changé de center à flex-start */
            align-items: center;
            padding: 0; /* Suppression du padding */
            background: linear-gradient(135deg, var(--gray-bg) 0%, #e0f2fe 50%, var(--gold-light) 100%);
            font-family: 'Inter', sans-serif;
            box-sizing: border-box; 
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

        .sparkle-1 {
            top: 30%;
            right: 20%;
            animation-delay: 0.5s;
        }

        .sparkle-2 {
            top: 60%;
            left: 15%;
            animation-delay: 1s;
        }

        .sparkle-3 {
            bottom: 25%;
            right: 25%;
            animation-delay: 1.5s;
        }

        /* 2. Cadre de l'application (Plein écran sans bordure) */
        .mobile-card {
            position: relative;
            z-index: 10;
            width: 100%; /* Prend toute la largeur */
            max-width: 100%; /* Pas de limite de largeur */
            min-height: 100vh; /* Prend toute la hauteur de l'écran */
            background-color: var(--white);
            padding: 1.5rem; /* Padding réduit pour plus d'espace */
            /* Suppression de la bordure bleue */
            border-radius: 0; /* Suppression des coins arrondis */
            /* Ombre élégante conservée mais plus subtile */
            box-shadow: none; /* Suppression de l'ombre pour un look plus intégré */
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            transition: all 0.5s;
            overflow: hidden;
        }

        /* Bandeau supérieur pour les 70 ans */
        .anniversary-banner {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(90deg, var(--gold), var(--accent-red));
            color: var(--white);
            padding: 0.75rem; /* Padding augmenté */
            text-align: center;
            font-weight: bold;
            font-size: 1rem; /* Taille de police augmentée */
            letter-spacing: 0.05em;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* Ombre plus prononcée */
        }

        /* 3. Header et Logo */
        .app-header {
            text-align: center;
            margin-top: 3.5rem; /* Espace augmenté pour le bandeau */
            margin-bottom: 1rem; /* Marge inférieure augmentée */
        }

        .logo-container {
            position: relative;
            margin-bottom: 1.5rem; /* Marge augmentée */
        }

        .logo {
            max-width: 280px; /* Taille du logo augmentée */
            width: 100%;
            height: auto;
            margin: 0 auto;
            filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1)); /* Ombre plus prononcée */
        }

        .logo-badge {
            position: absolute;
            top: -15px; /* Position ajustée */
            right: 15%; /* Position ajustée */
            background: var(--accent-red);
            color: var(--white);
            width: 70px; /* Taille augmentée */
            height: 70px; /* Taille augmentée */
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1rem; /* Taille de police augmentée */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* Ombre plus prononcée */
            border: 3px solid var(--white);
            animation: pulse 2s infinite;
        }

        .subtitle {
            font-size: 1.2rem; /* Taille de police augmentée */
            font-weight: 600;
            color: var(--text-blue);
            margin-top: 1rem; /* Marge augmentée */
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        /* 4. Section du Titre */
        .title-section {
            border-bottom: 2px solid var(--red-light);
            padding-bottom: 1.5rem; /* Padding augmenté */
            margin-bottom: 0.5rem; /* Marge ajoutée */
        }

        .title-section h1 {
            font-size: 1.8rem; /* Taille de police augmentée */
            font-weight: 800;
            color: var(--primary-blue);
            text-align: center;
            margin: 0;
        }

        /* 5. Conteneur des Boutons */
        .buttons-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem; /* Espacement augmenté */
            flex-grow: 1; /* Permet au conteneur de grandir */
            justify-content: center; /* Centre les boutons verticalement */
        }

        /* Configuration de la grille pour les deux premiers boutons */
        .button-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr)); /* Deux colonnes égales */
            gap: 1.5rem; /* Espacement augmenté */
        }

        /* Conteneur pour centrer la Guadeloupe */
        .guadeloupe-container {
            display: flex;
            justify-content: center;
        }

        .guadeloupe-button-wrapper {
            width: 100%;
            max-width: 300px; /* Largeur maximale pour le bouton Guadeloupe */
        }

        /* 6. Style des boutons de département */
        .dept-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1.5rem 0; /* Padding augmenté */
            font-size: 1.1rem; /* Taille de police augmentée */
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--white);
            
            background: linear-gradient(to bottom right, var(--accent-red), var(--accent-red-dark));
            border: none;
            border-radius: 1rem; /* Coins plus arrondis */
            cursor: pointer;
            
            box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.2); /* Ombre plus prononcée */
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
            box-shadow: 0 20px 25px -5px rgba(220, 38, 38, 0.3); /* Ombre plus prononcée au survol */
        }

        .dept-button:active {
            transform: scale(0.95);
        }

        .dept-button:focus {
            outline: none;
            box-shadow: 0 0 0 4px rgba(252, 165, 165, 0.5);
        }

        .icon-container {
            margin-bottom: 0.75rem; /* Marge augmentée */
        }

        .dept-icon {
            width: 2.5rem; /* Taille d'icône augmentée */
            height: 2.5rem; /* Taille d'icône augmentée */
            color: var(--white);
        }

        /* 7. Texte de pied de page */
        .footer-text {
            padding-top: 1.5rem; /* Padding augmenté */
            border-top: 1px solid #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem; /* Taille de police augmentée */
            font-weight: 500;
            color: var(--text-blue);
            text-align: center;
            line-height: 1.5;
            margin-top: auto; /* Pousse le pied de page vers le bas */
        }

        .footer-text-icon {
            width: 1.5rem; /* Taille d'icône augmentée */
            height: 1.5rem; /* Taille d'icône augmentée */
            margin-right: 0.5rem;
            color: var(--accent-red);
        }

        .app-branding {
            display: none; /* Masqué car nous utilisons tout l'espace */
        }

        /* --- Media Query pour écrans plus grands (sm: 640px) --- */
        @media (min-width: 640px) {
            .mobile-card {
                padding: 2rem; /* Padding augmenté pour les grands écrans */
                max-width: 600px; /* Largeur maximale pour les grands écrans */
                margin: 2rem auto; /* Centrage horizontal */
                min-height: calc(100vh - 4rem); /* Ajustement de la hauteur */
                border-radius: 1.5rem; /* Coins arrondis pour les grands écrans */
                box-shadow: 0 25px 50px -12px rgba(30, 64, 175, 0.25); /* Ombre ajoutée pour les grands écrans */
            }
            
            .title-section h1 {
                font-size: 2.2rem; /* Taille de police augmentée */
            }

            .dept-button {
                padding: 1.75rem 0; /* Padding augmenté */
            }
            
            .guadeloupe-button-wrapper {
                max-width: 280px; /* Largeur ajustée */
            }
            
            .dept-icon {
                width: 3rem; /* Taille d'icône augmentée */
                height: 3rem; /* Taille d'icône augmentée */
            }

            .floating-element-1 {
                width: 100px;
                height: 100px;
            }

            .floating-element-2 {
                width: 80px;
                height: 80px;
            }

            .floating-element-3 {
                width: 90px;
                height: 90px;
            }
        }

        /* --- Media Query pour très grands écrans (lg: 1024px) --- */
        @media (min-width: 1024px) {
            .mobile-card {
                max-width: 700px; /* Largeur maximale augmentée */
            }
        }
    `, []);

    // Composant de bouton utilisant les classes CSS
    const DepartmentButton = ({ dept, icon: IconComponent }) => (
        <button className="dept-button" onClick={() => chooseDept(dept)}>
            {/* Conteneur de l'icône */}
            <div className="icon-container">
                <IconComponent className="dept-icon" />
            </div>
            {/* Nom du département */}
            <span className="dept-name">{dept}</span>
        </button>
    );

    return (
        <div className="app-container">
            {/* Injection des styles CSS */}
            <style dangerouslySetInnerHTML={{ __html: customStyles }} />
            
            {/* Éléments décoratifs flottants */}
            <div className="floating-element floating-element-1"></div>
            <div className="floating-element floating-element-2"></div>
            <div className="floating-element floating-element-3"></div>
            <div className="sparkle sparkle-1"></div>
            <div className="sparkle sparkle-2"></div>
            <div className="sparkle sparkle-3"></div>
            
            {/* Conteneur principal (Plein écran sans bordure) */}
            <div className="mobile-card">
                
                {/* Bandeau d'anniversaire pour les 70 ans */}
                <div className="anniversary-banner">
                    🎉 70 ans d'excellence Brico Ceram 🎉
                </div>
                
                {/* Logo et Sous-titre */}
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

                {/* Section du Titre */}
                <div className="title-section">
                    <h1>Choisissez votre île</h1>
                </div>

                {/* Conteneur des Boutons */}
                <div className="buttons-container">
                    
                    {/* Rangée 1 : Martinique & Guyane (utilisant la grille CSS) */}
                    <div className="button-grid">
                        <DepartmentButton dept="Martinique" icon={MapPinIcon} />
                        <DepartmentButton dept="Guyane" icon={MapPinIcon} />
                    </div>

                    {/* Rangée 2 : Guadeloupe (centré) */}
                    <div className="guadeloupe-container">
                        <div className="guadeloupe-button-wrapper">
                            <DepartmentButton dept="Guadeloupe" icon={MapPinIcon} />
                        </div>
                    </div>

                </div>

                {/* Texte final */}
                <footer className="footer-text">
                    <TrophyIcon className="footer-text-icon" />
                    Sélectionnez votre région pour commencer et tenter de gagner !
                </footer>
            </div>
        </div>
    );
};

export default App;