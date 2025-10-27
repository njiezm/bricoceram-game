import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Configuration par défaut
const API_BASE = import.meta.env.VITE_API_BASE;
const API_KEY = import.meta.env.VITE_API_KEY;

const defaultConfig = {
    branding: {
        headerImage: "../images/header.png",
        headerImage971: "../images/headergpe.png",
        headerImage972: "../images/header.png",
        headerImage973: "../images/headerguy.png",
        accrocheImage: "../images/accroche.png",
        accrocheImage971: "../images/accrochejeuGPE.png",
        accrocheImage972: "../images/accroche.png",
        accrocheImage973: "../images/accroche_jeu_guy.png",
        dotationImage: "https://placehold.co/400x150/fbbf24/1e40af?text=15+000%E2%82%AC+%C3%A0+gagner",
        formTextImage: "../images/form.png",
        footerImage: "https://placehold.co/480x100/fbbf24/1e40af?text=Footer+Brico+Ceram",
        btnValidImage: "../images/BtnValider.png",
        backgroundImage: "https://placehold.co/480x800/f0f9ff/1e40af?text=Background+Brico",
        optinText: "J'accepte de recevoir les offres commerciales de la part de BRICOCERAM",
    },
    api: {
        endpoint: `${API_BASE}/api/save/participant`,
        key_api: API_KEY
    },
    legal: {
        regulationLinkText: "règlement du jeu",
        regulationUrl: "/pdf/reglement.pdf"
    },
    theme: {
        primaryColor: '#1e40af',
        accentColor: '#dc2626',
        accentColorDark: '#b91c1c',
        goldColor: '#fbbf24',
        labelBgColor: '#1e40af',
        fontFamily: 'Arial, sans-serif',
    },
    navigation: {
        successRoute: '/bricoceram/anniversaire70ans/game'
    }
};

// Modal simple
const SimpleModal = ({ message, onClose }) => {
    if (!message) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <p className="modal-message">{message}</p>
                <button onClick={onClose} className="submit-button">Fermer</button>
            </div>
        </div>
    );
};

export default function GlobalForm({ config: userConfig = {} }) {
    const navigate = useNavigate();
    const { dept, slug, source } = useParams();

    const config = useMemo(() => ({
        ...defaultConfig,
        ...userConfig,
        theme: { ...defaultConfig.theme, ...userConfig.theme }
    }), [userConfig]);

    const getHeaderImage = useMemo(() => {
        if (dept === '971') return config.branding.headerImage971;
        if (dept === '972') return config.branding.headerImage972;
        if (dept === '973') return config.branding.headerImage973;
        return config.branding.headerImage;
    }, [config.branding, dept]);

    const getAccrocheImage = useMemo(() => {
        if (dept === '971') return config.branding.accrocheImage971;
        if (dept === '972') return config.branding.accrocheImage972;
        if (dept === '973') return config.branding.accrocheImage973;
        return config.branding.accrocheImage;
    }, [config.branding, dept]);

    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        zipcode: "",
        toyoubuild: "", // Le champ pour la question ajoutée
        optin: "",
        bycanal: "",
        reglement: false
    });

    const [showCanal, setShowCanal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        if (name === "optin") setShowCanal(value === "1");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        // Validation
        if (!form.lastname || !form.firstname || !form.email || !form.phone || !form.zipcode || !form.toyoubuild) {
            setModalMessage("Veuillez remplir tous les champs obligatoires.");
            return;
        }
        if (!form.reglement) {
            setModalMessage("Veuillez accepter le règlement du jeu et confirmer avoir plus de 18 ans.");
            return;
        }
        if (form.optin === "1" && !form.bycanal) {
            setModalMessage("Veuillez choisir un canal de communication.");
            return;
        }

        setLoading(true);
        try {
            const formdata = new FormData();
            formdata.append("key_api", config.api.key_api);
            formdata.append("firstname", form.firstname);
            formdata.append("lastname", form.lastname);
            formdata.append("email", form.email);
            formdata.append("zipcode", form.zipcode);
            formdata.append("phone", form.phone);
            formdata.append("toyoubuild", form.toyoubuild);
            formdata.append("source", source || "direct");
            formdata.append("dep_slug", dept);
            formdata.append("optin", form.optin);
            formdata.append("bycanal", form.bycanal);

            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
                redirect: "follow"
            };

            // --- DÉBUT DES LOGS DE DÉBOGAGE ---
            console.log("Envoi des données à l'API...");
            const response = await fetch(config.api.endpoint, requestOptions);
            console.log("Réponse brute de l'API reçue :", response);

            if (!response.ok) {
                console.error("La réponse de l'API n'est pas 'ok'. Statut :", response.status);
                throw new Error(`Erreur API: ${response.status}`);
            }

            const data = await response.json();
            console.log("Données JSON parsées depuis l'API :", data);
            // --- FIN DES LOGS DE DÉBOGAGE ---

            // On s'assure que `url_slug` est bien présent
            if (!data.url_slug) {
                console.error("ERREUR : La réponse de l'API ne contient pas de 'url_slug'.");
                throw new Error("Le serveur n'a pas renvoyé d'identifiant de jeu.");
            }

            const urlSlug = data.url_slug;
            console.log("URL Slug final qui sera utilisé :", urlSlug);

            localStorage.setItem("url_slug", urlSlug);
            console.log(`Slug sauvegardé dans localStorage. Navigation vers : ${config.navigation.successRoute}`);
            
            navigate(config.navigation.successRoute, { state: { urlSlug } });

        } catch (err) {
            console.error("Une erreur est survenue dans handleSubmit :", err);
            setModalMessage("Une erreur est survenue lors de l'inscription.");
        } finally {
            setLoading(false);
        }
    };

    const cssStyles = useMemo(() => `
        html, body { margin:0; padding:0; height:100%; }
        .punch-wrapper { display:flex; justify-content:center; align-items:flex-start; min-height:100vh; background:#fff; }
        .punch-container { display:flex; flex-direction:column; justify-content:flex-start; width:92vw; max-width:480px; min-height:100vh; position:relative; background-color: #FFD100; background-size:cover; background-position:center; }
        .punch-container::before { content:""; position:absolute; top:0; left:0; right:0; bottom:0; background-image:url(${config.branding.backgroundImage}); background-size:cover; background-position:center; z-index:-1; }
        .content { width:90%; max-width:400px; margin:auto; text-align:center; color:#fff; flex-grow:1; padding-bottom:20px; position:relative; z-index:1; }
        .label-title { display:inline-block; background:${config.theme.labelBgColor}; color:#fff; font-weight:bold; padding:6px 14px; margin-bottom:8px; transform:rotate(-3deg); box-shadow:2px 2px 4px rgba(0,0,0,0.25); }
        .form-input { 
            width:85%; 
            border:none; 
            border-radius:20px; 
            height:40px; 
            padding:8px 15px; 
            background-color: #FFF9C4;
            margin: 0 auto 15px;
            display: block;
            color: ${config.theme.primaryColor};
            text-align: center;
            font-weight: bold;
            font-family: ${config.theme.fontFamily};
        }
        .form-input::placeholder {
            color: ${config.theme.primaryColor};
            opacity: 0.7;
            text-align: center;
            font-weight: bold;
        }
        select.form-select { 
            width:85%; 
            height:40px; 
            border:none; 
            border-radius:20px; 
            padding:5px 15px; 
            background-color: #FFF9C4;
            margin: 0 auto 15px;
            display: block;
            color: ${config.theme.primaryColor};
            font-family: ${config.theme.fontFamily};
        }
        .form-check { margin-top:1rem; }
        .form-check-label { 
            font-size:0.9rem; 
            font-family: ${config.theme.fontFamily};
            font-weight: bold;
        }
        .text-warning { color:${config.theme.goldColor} !important; }
        .text-dark-blue { color: ${config.theme.primaryColor} !important; font-family: ${config.theme.fontFamily}; font-weight: bold; }
        .text-reglement { color: ${config.theme.primaryColor} !important; font-family: ${config.theme.fontFamily}; font-weight: bold; }
        .modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:1000; }
        .modal-card { background:white; padding:2rem; border-radius:0.5rem; max-width:90%; width:400px; box-shadow:0 10px 25px rgba(0,0,0,0.2); }
        .modal-message { margin-bottom:1.5rem; font-size:1rem; line-height:1.5; }
        .submit-button { display:block; width:100%; padding:0.75rem; background:${config.theme.accentColor}; color:white; border:none; border-radius:0.25rem; font-weight:700; cursor:pointer; }
        .submit-button:hover { background:${config.theme.accentColorDark}; }

        @media (max-width: 768px) {
            .punch-wrapper { justify-content: flex-start; }
            .punch-container { width: 100vw; max-width: none; }
        }
    `, [config]);

    const placeholders = {
        lastname: "Nom",
        firstname: "Prénom",
        email: "Email",
        phone: "Téléphone",
        zipcode: "Code postal"
    };

    return (
        <div className="punch-wrapper">
            <style>{cssStyles}</style>
            <SimpleModal message={modalMessage} onClose={() => setModalMessage(null)} />
            <div className="punch-container">
                <div style={{ width:"100%", flexShrink:0 }}>
                    <img src={getHeaderImage} alt="Header" style={{width:"100%", height:"auto", display:"block"}}/>
                </div>
                
                <div className="content">
                    <div style={{backgroundColor: "white", padding: "15px", borderRadius: "10px", marginBottom: "20px", overflow: "hidden"}}>
                        <img src={getAccrocheImage} alt="Accroche" style={{width:"calc(100% + 30px)", height:"auto", display:"block", margin: "0 -15px"}}/>
                        <img src={config.branding.formTextImage} alt="Formulaire" style={{width:"100%", padding:"20px 0"}}/>
                        
                        <form onSubmit={handleSubmit} className="text-start">
                            {["lastname","firstname","email","phone","zipcode"].map(f => (
                            <div key={f} style={{marginBottom:10}}>
                                <input
                                    type={f === "email" ? "email" : f === "phone" ? "tel" : "text"}
                                    name={f}
                                    required
                                    value={form[f]}
                                    onChange={handleChange}
                                    className="form-input"
                                    disabled={loading}
                                    placeholder={placeholders[f]}
                                />
                            </div>
                        ))}
                        
                        <SelectQuestion 
                            label="As-tu déjà acheté chez Bricoceram ?" 
                            name="toyoubuild" 
                            options={["Oui", "Non"]} 
                            values={["Oui", "Non"]} 
                            value={form.toyoubuild} 
                            onChange={handleChange} 
                            disabled={loading} 
                            labelClassName="text-dark-blue"
                        />
                        
                        <div className="form-check mt-4">
                            <input type="checkbox" name="reglement" className="form-check-input" checked={form.reglement} onChange={handleChange} disabled={loading}/>
                            <label className="form-check-label text-reglement" style={{fontSize:"0.9rem"}}>
                                J'accepte le <a href={config.legal.regulationUrl} target="_blank" rel="noopener noreferrer" className="text-reglement text-decoration-underline">{config.legal.regulationLinkText}</a> et confirme avoir plus de 18 ans
                            </label>
                        </div>
                        <br></br>
                        <SelectQuestion label={config.branding.optinText} name="optin" options={["Oui","Non"]} values={["1","0"]} value={form.optin} onChange={handleChange} disabled={loading} labelClassName="text-dark-blue"/>
                        {showCanal && <SelectQuestion label="Canal de communication" name="bycanal" options={["SMS","EMAIL","EMAIL & SMS"]} values={["1","2","3"]} value={form.bycanal} onChange={handleChange} disabled={loading} labelClassName="text-dark-blue"/>}

                        <div className="text-center mt-4">
                            <button type="submit" className="submit-button" disabled={loading} style={{padding:0, border:"none", background:"transparent"}}>
                                <img src={config.branding.btnValidImage} alt="Valider" style={{maxWidth:"160px", display:"block", margin:"0 auto", marginBottom:"30px"}} />
                            </button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SelectQuestion({ label, name, options, values, value, onChange, disabled, labelClassName = "text-white" }) {
    return (
        <div className="mt-3">
            <label className={labelClassName}>{label}</label>
            <select name={name} className="form-select mt-1" required value={value} onChange={onChange} disabled={disabled}>
                <option value="">-- Choisir --</option>
                {options.map((opt,i) => <option key={opt} value={values ? values[i] : opt}>{opt}</option>)}
            </select>
        </div>
    );
}