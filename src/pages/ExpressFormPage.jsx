import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlayer } from '../App';

const defaultConfig = {
    branding: {
        headerImage: "https://placehold.co/480x150/1e40af/ffffff?text=Header+Brico+Ceram",
        headerImage971: "../images/headergpe.png",
        headerImage972: "../images/header.png",
        headerImage973: "../images/headerguy.png",
        accrocheImage: "../images/textdejainscrit.png",
        accrocheImage971: "../images/textdejainscrit.png",
        accrocheImage972: "../images/textdejainscrit.png",
        accrocheImage973: "../images/textdejainscrit.png",
        footerImage: "../images/Footer_brico.png",
        backgroundImage: "https://placehold.co/480x800/f0f9ff/1e40af?text=Background+Brico",
        btnValidImage: "../images/BtnValider.png",
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

export default function ExpressFormPage({ config: userConfig = {} }) {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { player } = usePlayer();

    const [phone, setPhone] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);

    const config = useMemo(() => ({
        ...defaultConfig,
        ...userConfig,
        theme: { ...defaultConfig.theme, ...userConfig.theme }
    }), [userConfig]);
    
    const getAccrocheImage = useMemo(() => {
        if (player.dept === '971') return config.branding.accrocheImage971;
        if (player.dept === '972') return config.branding.accrocheImage972;
        if (player.dept === '973') return config.branding.accrocheImage973;
        return config.branding.accrocheImage;
    }, [config.branding, player.dept]);
    
    const getHeaderImage = useMemo(() => {
        if (player.dept === '971') return config.branding.headerImage971;
        if (player.dept === '972') return config.branding.headerImage972;
        if (player.dept === '973') return config.branding.headerImage973;
        return config.branding.headerImage;
    }, [config.branding, player.dept]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        setModalMessage(null);

        try {
            const API_BASE = import.meta.env.VITE_API_BASE;
            const API_KEY = import.meta.env.VITE_API_KEY;

            const replayFormData = new FormData();
            replayFormData.append("key_api", API_KEY);
            replayFormData.append("dep_slug", player.dept);
            replayFormData.append("phone", phone);

            const replayResponse = await fetch(`${API_BASE}/api/replay`, {
                method: "POST",
                body: replayFormData
            });

            const replayData = await replayResponse.json();

            switch (replayData.code) {
                case 600:
                    navigate(`/bricoceram/anniversaire70ans/bricoceram/${player.dept}?choice=new`);
                    break;
                case 400:
                    navigate('/bricoceram/anniversaire70ans/une-participation');
                    break;
                case 500:
                    navigate('/bricoceram/anniversaire70ans/deja-gagne');
                    break;
                // --- MODIFIÉ : Gestion correcte du cas où le joueur peut jouer ---
                case 200:
                    // Tout est bon, la personne peut jouer.
                    // On récupère le url_slug depuis la réponse de l'API.
                    const urlSlug = replayData.url_slug;

                    if (urlSlug) {
                        // On le sauvegarde dans le localStorage.
                        localStorage.setItem("url_slug", urlSlug);
                        // On navigue vers la page du jeu en transmettant le url_slug dans l'état.
                        navigate('/bricoceram/anniversaire70ans/game', { state: { urlSlug } });
                    } else {
                        // Cas d'erreur si l'API ne renvoie pas le slug.
                        setModalMessage("Erreur : impossible de retrouver votre participation. Le slug est manquant.");
                    }
                    break;
                default:
                    setModalMessage(replayData.message || "Une erreur inattendue est survenue. Veuillez réessayer.");
            }

        } catch (err) {
            console.error(err);
            setModalMessage("Erreur réseau, réessayez plus tard.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReturn = () => {
        navigate(`/bricoceram/anniversaire70ans/bricoceram/${player.dept}`);
    };

    const cssStyles = useMemo(() => `
        html, body { margin:0; padding:0; height:100%; font-family: ${config.theme.fontFamily}; }
        .punch-wrapper { display:flex; justify-content:center; align-items:flex-start; min-height:100vh; background:#fff; }
        .punch-container { display:flex; flex-direction:column; justify-content:flex-start; width:92vw; max-width:480px; min-height:100vh; position:relative; background-color: #FFD100; background-size:cover; background-position:center; }
        .punch-container::before { content:""; position:absolute; top:0; left:0; right:0; bottom:0; background-image:url(${config.branding.backgroundImage}); background-size:cover; background-position:center; z-index:-1; }
        .content { width:90%; max-width:400px; margin:auto; text-align:center; color:#fff; flex-grow:1; padding-bottom:20px; position:relative; z-index:1; }
        .accroche-container { margin-bottom: 1.5rem; }
        .accroche-image { width: 100%; height: auto; display: block; }
        .express-card { background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); color: ${config.theme.primaryColor}; }
        .express-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; }
        .express-subtitle { font-size: 1rem; margin-bottom: 1.5rem; color: #555; }
        .form-input { 
            width:100%; 
            border:2px solid ${config.theme.primaryColor}; 
            border-radius:25px; 
            height:50px; 
            padding:10px 20px; 
            background-color: #f8f9fa;
            margin-bottom: 1.5rem;
            display: block;
            color: ${config.theme.primaryColor};
            text-align: center;
            font-weight: bold;
            font-family: ${config.theme.fontFamily};
            box-sizing: border-box;
        }
        .form-input::placeholder {
            color: ${config.theme.primaryColor};
            opacity: 0.6;
            font-weight: bold;
        }
        .modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:1000; }
        .modal-card { background:white; padding:2rem; border-radius:0.5rem; max-width:90%; width:400px; box-shadow:0 10px 25px rgba(0,0,0,0.2); text-align: center; }
        .modal-message { margin-bottom:1.5rem; font-size:1rem; line-height:1.5; color: #333; }
        .modal-button { display:block; width:100%; padding:0.75rem; background:${config.theme.accentColor}; color:white; border:none; border-radius:0.25rem; font-weight:700; cursor:pointer; }
        .modal-button:hover { background:${config.theme.accentColorDark}; }

        @media (max-width: 768px) {
            .punch-wrapper { justify-content: flex-start; }
            .punch-container { width: 100vw; max-width: none; }
        }
    `, [config, player.dept]);

    const SimpleModal = ({ message, onClose }) => {
        if (!message) return null;
        return (
            <div className="modal-overlay">
                <div className="modal-card">
                    <p className="modal-message">{message}</p>
                    <button onClick={onClose} className="modal-button">Fermer</button>
                </div>
            </div>
        );
    };

    return (
        <div className="punch-wrapper">
            <style>{cssStyles}</style>
            <SimpleModal message={modalMessage} onClose={() => setModalMessage(null)} />
            
            <div className="punch-container">
                <div style={{ width: "100%", flexShrink: 0 }}>
                    <img src={getHeaderImage} alt="Header" style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }} />
                </div>

                <div className="content">
                    <div style={{backgroundColor: "white", padding: "15px", borderRadius: "10px", marginBottom: "20px", overflow: "hidden"}}>
                        <div className="accroche-container">
                            <img src={getAccrocheImage} alt="Inscription Express" className="accroche-image" />
                        </div>
                        
                       
                           
                            <form onSubmit={handleSubmit}>
                                <input style={{ backgroundColor: "#FFF9C4" }}
                                    type="tel"
                                    placeholder="Téléphone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    className="form-input"
                                />
                                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                    <button type="submit" disabled={submitting} style={{padding:0, border:"none", background:"transparent"}}>
                                        <img src={config.branding.btnValidImage} alt="Valider" style={{maxWidth:"160px", display:"block", margin:"0 auto"}} />
                                    </button>
                                </div>
                            </form>
                     
                    </div>
                </div>

                <div style={{ width: "100%", flexShrink: 0 }}>
                    <img src={config.branding.footerImage} alt="Footer" style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }} />
                </div>
            </div>
        </div>
    );
}