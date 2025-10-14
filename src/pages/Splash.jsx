import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Trophy } from 'lucide-react'; // Utilisation d'icônes pour un look plus pro

// La classe principale App est définie pour être le composant exporté par défaut.
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
            --primary-blue: #1e40af; /* Bleu foncé */
            --accent-red: #dc2626; /* Rouge principal */
            --accent-red-dark: #b91c1c; /* Rouge foncé */
            --red-light: #fee2e2; /* Rouge très clair */
            --gray-bg: #f9fafb; /* Gris très clair pour le fond */
            --text-blue: #1d4ed8; /* Bleu moyen */
        }

        /* 1. Conteneur global */
        .app-container {
            min-height: 100vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 1.5rem 1rem;
            background-color: var(--gray-bg);
            font-family: 'Inter', sans-serif;
            box-sizing: border-box; 
        }

        /* 2. Cadre de l'application (La "carte" mobile) */
        .mobile-card {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 360px; /* Taille maximale pour simuler un téléphone */
            background-color: white;
            padding: 2rem 1.5rem;
            border: 4px solid var(--primary-blue);
            border-radius: 1.5rem;
            /* Ombre élégante teintée de bleu */
            box-shadow: 0 25px 50px -12px rgba(30, 64, 175, 0.25);
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            transition: all 0.5s;
        }

        /* 3. Header et Logo */
        .app-header {
            text-align: center;
            margin-bottom: 0.75rem;
        }

        .logo {
            max-width: 260px;
            width: 100%;
            height: auto;
            margin: 0 auto;
            filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.07));
        }

        .subtitle {
            font-size: 0.875rem;
            font-weight: 600;
            color: #4b5563;
            margin-top: 0.75rem;
        }

        /* 4. Section du Titre */
        .title-section {
            border-bottom: 2px solid var(--red-light);
            padding-bottom: 1rem;
        }

        .title-section h1 {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--primary-blue);
            text-align: center;
            margin: 0;
        }

        /* 5. Conteneur des Boutons */
        .buttons-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        /* Configuration de la grille pour les deux premiers boutons */
        .button-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr)); /* Deux colonnes égales */
            gap: 1rem;
        }

        /* Conteneur pour centrer la Guadeloupe */
        .guadeloupe-container {
            display: flex;
            justify-content: center;
        }

        .guadeloupe-button-wrapper {
            width: 100%;
        }

        /* 6. Style des boutons de département */
        .dept-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1rem 0; /* Taille adaptée au mobile */
            font-size: 1rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: white;
            
            background: linear-gradient(to bottom right, var(--accent-red), var(--accent-red-dark));
            border: none;
            border-radius: 0.75rem;
            cursor: pointer;
            
            box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.1);
            transition: all 0.3s ease-in-out;
        }

        .dept-button:hover {
            transform: scale(1.03);
            box-shadow: 0 20px 25px -5px rgba(220, 38, 38, 0.2);
        }

        .dept-button:active {
            transform: scale(0.95);
        }

        .dept-button:focus {
            outline: none;
            box-shadow: 0 0 0 4px rgba(252, 165, 165, 0.5);
        }

        .icon-container {
            margin-bottom: 0.5rem;
        }

        .dept-icon {
            width: 2rem; /* w-8 */
            height: 2rem; /* h-8 */
            color: white;
        }

        /* 7. Texte de pied de page */
        .footer-text {
            padding-top: 1rem;
            border-top: 1px solid #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-blue);
            text-align: center;
            line-height: 1.5;
        }

        .footer-text-icon {
            width: 1.25rem;
            height: 1.25rem;
            margin-right: 0.5rem;
            color: var(--accent-red);
        }

        .app-branding {
            margin-top: 1rem;
            font-size: 0.75rem;
            color: #9ca3af;
        }

        /* --- Media Query pour écrans plus grands (sm: 640px) --- */
        @media (min-width: 640px) {
            .mobile-card {
                padding: 2.5rem 2rem;
                gap: 2rem;
            }
            
            .title-section h1 {
                font-size: 2rem;
            }

            .dept-button {
                padding: 1.25rem 0;
            }
            
            .guadeloupe-button-wrapper {
                width: 50%; /* L'île de Guadeloupe prend la moitié de la largeur pour être bien centrée */
            }
            
            .dept-icon {
                width: 2.5rem;
                height: 2.5rem;
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
            
            {/* Conteneur principal (La "carte" imitant le mobile) */}
            <div className="mobile-card">
                
                {/* Logo et Sous-titre */}
                <header className="app-header">
                    <img
                        src="https://placehold.co/300x90/ffffff/0047ab?text=BRICO+CERAM"
                        alt="Logo Brico Céram"
                        className="logo"
                    />
                    <p className="subtitle">Jeu Anniversaire</p>
                </header>

                {/* Section du Titre */}
                <div className="title-section">
                    <h1>Choisissez votre île</h1>
                </div>

                {/* Conteneur des Boutons */}
                <div className="buttons-container">
                    
                    {/* Rangée 1 : Martinique & Guyane (utilisant la grille CSS) */}
                    <div className="button-grid">
                        <DepartmentButton dept="Martinique" icon={MapPin} />
                        <DepartmentButton dept="Guyane" icon={MapPin} />
                    </div>

                    {/* Rangée 2 : Guadeloupe (centré) */}
                    <div className="guadeloupe-container">
                        <div className="guadeloupe-button-wrapper">
                            <DepartmentButton dept="Guadeloupe" icon={MapPin} />
                        </div>
                    </div>

                </div>

                {/* Texte final */}
                <footer className="footer-text">
                    <Trophy className="footer-text-icon" />
                    Sélectionnez votre région pour commencer et tenter de gagner !
                </footer>
            </div>
            {/* Petit rappel esthétique en bas d'écran */}
            <div className="app-branding">
                <span className="font-bold">Brico Ceram</span> | Anniversaire
            </div>
        </div>
    );
};

export default App;
