import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Configuration par défaut pour Brico Ceram avec les images
const defaultConfig = {
    branding: {
        // URLs des images pour la structure visuelle
        headerImage: "https://placehold.co/480x150/1e40af/ffffff?text=Header+Brico+Ceram",
        accrocheImage: "https://placehold.co/400x200/dc2626/ffffff?text=GRAND+JEU+ANNIVERSAIRE",
        dotationImage: "https://placehold.co/400x150/fbbf24/1e40af?text=15+000%E2%82%AC+%C3%A0+gagner",
        formTextImage: "https://placehold.co/400x100/1e40af/ffffff?text=Remplissez+le+formulaire",
        footerImage: "https://placehold.co/480x100/fbbf24/1e40af?text=Footer+Brico+Ceram",
        btnValidImage: "https://placehold.co/160x50/dc2626/ffffff?text=VALIDER",
        backgroundImage: "https://placehold.co/480x800/f0f9ff/1e40af?text=Background+Brico",
        
        // Textes utilisés dans les modales et labels
        optinText: "J'accepte de recevoir les offres commerciales de la part de BRICOCERAM",
    },
    api: {
        endpoint: 'https://api.bricoceram.com/participants/register', 
    },
    legal: {
        regulationLinkText: "règlement du jeu",
        regulationUrl: "/pdf/reglement.pdf", // URL vers le PDF du règlement
        regulationModalMessage: "Le règlement du jeu sera bientôt disponible.",
    },
    theme: {
        primaryColor: '#1e40af',
        accentColor: '#dc2626',
        accentColorDark: '#b91c1c',
        goldColor: '#fbbf24',
        // Couleur spécifique pour les labels de la structure PunchForm
        labelBgColor: '#1e40af',
    },
    navigation: {
        successRoute: '/anniversaire/game', // Route vers laquelle rediriger après soumission
    }
};

// Modal simple pour les messages d'erreur ou d'information
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
    const { dept, slug } = useParams();

    // Fusionner la configuration par défaut avec celle de l'utilisateur
    const config = useMemo(() => ({
        ...defaultConfig,
        ...userConfig,
        theme: { ...defaultConfig.theme, ...userConfig.theme }
    }), [userConfig]);

    const [form, setForm] = useState({ 
        lastname: "", 
        firstname: "", 
        email: "", 
        phone: "",
        zipcode: "",
        optin: "", 
        bycanal: "",
        reglement: false,
        dept: dept || "",
        slug: slug || ""
    });

    const [showCanal, setShowCanal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ 
            ...prev, 
            [name]: type === "checkbox" ? checked : value 
        }));

        if (name === "optin") {
            setShowCanal(value === "1");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        
        if (!form.lastname || !form.firstname || !form.email || !form.phone || !form.zipcode) {
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
            // Préparation des données à envoyer à l'API
            const apiData = {
                ...form,
                // S'assurer que dept et slug sont bien inclus
                dept: dept,
                slug: slug
            };
            
            // Appel API réel avec fetch
            const response = await fetch(config.api.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData)
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi des données');
            }
            
            const data = await response.json();
            
            // Utilisation de l'ID retourné par l'API ou génération d'un ID si non fourni
            const participantId = data.participantId || 'P_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Redirection vers la page de jeu avec l'ID généré
            navigate(`/${dept}/${slug}${config.navigation.successRoute}/${participantId}_${slug}`);
        } catch (error) {
            console.error('Erreur API:', error);
            setModalMessage("Une erreur est survenue lors de l'inscription.");
        } finally {
            setLoading(false);
        }
    };

    // Styles CSS adaptés pour la structure PunchForm
    const cssStyles = useMemo(() => `
        .punch-wrapper {
            display: flex;
            justify-content: center;
            align-items: stretch;
            background-color: #fff;
            min-height: 100vh;
            overflow: hidden;
        }
        
        .punch-container {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            background-image: url(${config.branding.backgroundImage});
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center;
            width: 92vw;
            max-width: 480px;
            min-height: 100vh;
            padding: 0 10px;
            box-shadow: 0 0 8px rgba(0,0,0,0.4);
        }
        
        .content {
            width: 90%;
            max-width: 400px;
            text-align: center;
            color: #fff;
            flex-grow: 1;
        }
        
        .label-title {
            display: inline-block;
            background: ${config.theme.labelBgColor};
            color: #fff;
            font-weight: bold;
            padding: 6px 14px;
            margin-bottom: 8px;
            transform: rotate(-3deg);
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
        }
        
        .form-input {
            width: 100%;
            background: #fff;
            border: none;
            border-radius: 3px;
            height: 44px;
            padding: 8px 12px;
            color: #333;
        }
        
        select.form-select {
            width: 100%;
            height: 44px;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
        }
        
        .form-check {
            margin-top: 1rem;
        }
        
        .form-check-label {
            font-size: 0.9rem;
        }
        
        .text-warning {
            color: ${config.theme.goldColor} !important;
        }
        
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .modal-card {
            background-color: white;
            padding: 2rem;
            border-radius: 0.5rem;
            max-width: 90%;
            width: 400px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .modal-message {
            margin-bottom: 1.5rem;
            font-size: 1rem;
            line-height: 1.5;
        }
        
        .submit-button {
            display: block;
            width: 100%;
            padding: 0.75rem;
            background: ${config.theme.accentColor};
            color: white;
            border: none;
            border-radius: 0.25rem;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .submit-button:hover {
            background: ${config.theme.accentColorDark};
        }
    `, [config]);

    return (
        <div className="punch-wrapper">
            <style>{cssStyles}</style>
            
            <SimpleModal message={modalMessage} onClose={() => setModalMessage(null)} />

            {/* Conteneur principal (fond + contenu) */}
            <div className="punch-container">
                {/* HEADER */}
                <div style={{ width: "100%", flexShrink: 0 }}>
                    <img
                        src={config.branding.headerImage}
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
                    <img
                        src={config.branding.accrocheImage}
                        alt="Accroche"
                        className="img-fluid mb-3"
                        style={{ width: "100%" ,
                         height: "auto",
                            display: "block",
                            objectFit: "contain",
                    }}
                    />
                    <img
                        src={config.branding.dotationImage}
                        alt="Dotation"
                        className="img-fluid mb-3"
                        style={{ width: "100%" }}
                    />
                    <img
                        src={config.branding.formTextImage}
                        alt="Texte Formulaire"
                        className="img-fluid mb-4"
                        style={{ width: "100%" }}
                    />

                    <form onSubmit={handleSubmit} className="text-start">
                        {["lastname", "firstname", "email", "phone", "zipcode"].map((field) => (
                            <div key={field} style={{ marginBottom: 20 }}>
                                <span className="label-title">
                                    {field === "lastname"
                                        ? "NOM"
                                        : field === "firstname"
                                        ? "PRÉNOM"
                                        : field === "email"
                                        ? "E-MAIL"
                                        : field === "phone"
                                        ? "TEL"
                                        : "CODE POSTAL"}
                                </span>
                                <input
                                    type={
                                        field === "email"
                                        ? "email"
                                        : field === "phone"
                                        ? "tel"
                                        : "text"
                                    }
                                    name={field}
                                    required
                                    value={form[field]}
                                    onChange={handleChange}
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>
                        ))}

                        {/* Checkbox âge et règlement */}
                        <div className="form-check mt-4">
                            <input
                                type="checkbox"
                                name="reglement"
                                className="form-check-input"
                                required
                                checked={form.reglement}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <label className="form-check-label" style={{ fontSize: "0.9rem" }}>
                                J'accepte le{" "}
                                <a
                                    href={config.legal.regulationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-warning text-decoration-underline"
                                >
                                    {config.legal.regulationLinkText}
                                </a>{" "}
                                et confirme avoir plus de 18 ans
                            </label>
                        </div>

                        {/* Opt-in */}
                        <SelectQuestion
                            label={config.branding.optinText}
                            name="optin"
                            options={["Oui", "Non"]}
                            values={["1", "0"]}
                            value={form.optin}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        {showCanal && (
                            <SelectQuestion
                                label="Je souhaite recevoir les communications et offres commerciales par :"
                                name="bycanal"
                                options={["SMS", "EMAIL", "EMAIL & SMS"]}
                                values={["1", "2", "3"]}
                                value={form.bycanal}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        )}

                        <div className="text-center mt-4">
                            <input
                                type="image"
                                src={config.branding.btnValidImage}
                                alt="Valider"
                                className="img-fluid"
                                style={{ maxWidth: "160px", marginTop: "20px" }}
                                disabled={loading}
                            />
                        </div>
                    </form>
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

// Composant réutilisable pour les questions à choix multiples
function SelectQuestion({ label, name, options, values, value, onChange, disabled }) {
    return (
        <div className="mt-3">
            <label className="text-white">{label}</label>
            <select
                name={name}
                className="form-select mt-1"
                required
                value={value}
                onChange={onChange}
                disabled={disabled}
            >
                <option value="">-- Choisir --</option>
                {options.map((opt, i) => (
                    <option key={opt} value={values ? values[i] : opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
}