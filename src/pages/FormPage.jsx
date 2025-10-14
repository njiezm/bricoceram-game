import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Composant SVG pour un trophée
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

// Simulation API
async function registerParticipant(data) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: 'P_' + Date.now() };
}

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

export default function FormApp() {
    const navigate = useNavigate();
    const { dept, slug } = useParams();

    const [form, setForm] = useState({ 
        name: '', email: '', tel: '', birthdate: '', 
        brandOptin: 'no', contactChannel: null, partnerOptin: false 
    });
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        if (name === 'brandOptin') {
            const newValue = checked ? 'yes' : 'no';
            setForm(prev => ({ ...prev, brandOptin: newValue, contactChannel: newValue === 'no' ? null : prev.contactChannel }));
        } else {
            setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (loading) return;
        if (form.brandOptin === 'yes' && !form.contactChannel) {
            setModalMessage("Veuillez choisir un canal de communication.");
            return;
        }

        setLoading(true);
        try {
            const { id: participantId } = await registerParticipant({ ...form, dept, slug, contactChannel: form.brandOptin === 'yes' ? form.contactChannel : null });
            navigate(`/${dept}/${slug}/anniversaire/game/${participantId}_${slug}`);
        } catch {
            setModalMessage("Une erreur est survenue lors de l'inscription.");
        } finally {
            setLoading(false);
        }
    };

    if (!dept || !slug) {
        return (
            <div className="error-screen">
                <p>Erreur: Les informations de campagne sont manquantes dans l'URL.</p>
            </div>
        );
    }

    const formCanalContacte = form.brandOptin === 'yes';

    return (
        <>
            <style>{`
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

                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Inter', sans-serif;
                    background: linear-gradient(135deg, var(--gray-bg) 0%, #e0f2fe 50%, var(--gold-light) 100%);
                    min-height: 100vh;
                }

                .form-container {
                    position: relative;
                    width: 100%;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background-color: var(--white);
                    box-sizing: border-box;
                    overflow-x: hidden;
                }

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

                .anniversary-banner {
                    position: relative;
                    background: linear-gradient(90deg, var(--gold), var(--accent-red));
                    color: var(--white);
                    padding: 0.75rem;
                    text-align: center;
                    font-weight: bold;
                    font-size: 1rem;
                    letter-spacing: 0.05em;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    z-index: 10;
                }

                .form-card {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    padding: 1.5rem;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    box-sizing: border-box;
                }

                .form-header {
                    text-align: center;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid var(--red-light);
                }

                .header-icon {
                    width: 3rem;
                    height: 3rem;
                    color: var(--accent-red);
                    margin-bottom: 0.5rem;
                }

                .form-header h2 {
                    margin: 0.5rem 0;
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: var(--primary-blue);
                }

                .dept-info {
                    margin: 0;
                    font-size: 1rem;
                    color: var(--text-blue);
                    font-weight: 500;
                }

                .input-group {
                    margin-bottom: 1.5rem;
                }

                .postit-label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: var(--primary-blue);
                    font-size: 1rem;
                }

                input[type="text"], input[type="email"], input[type="tel"], input[type="date"] {
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    box-sizing: border-box;
                    transition: border-color 0.3s;
                }

                input[type="text"]:focus, input[type="email"]:focus, input[type="tel"]:focus, input[type="date"]:focus {
                    outline: none;
                    border-color: var(--primary-blue);
                }

                h3 {
                    margin: 1.5rem 0 1rem;
                    font-size: 1.2rem;
                    color: var(--primary-blue);
                    font-weight: 700;
                }

                .checkbox-group {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }

                .checkbox-group input[type="checkbox"] {
                    margin-right: 0.75rem;
                    margin-top: 0.25rem;
                }

                .checkbox-group label {
                    flex-grow: 1;
                    font-size: 0.95rem;
                    line-height: 1.4;
                }

                .contact-channel-container {
                    margin: 1rem 0 1.5rem;
                    padding: 1rem;
                    background-color: var(--gray-bg);
                    border-radius: 0.5rem;
                }

                .contact-channel-container > label {
                    display: block;
                    margin-bottom: 0.75rem;
                    font-weight: 600;
                    color: var(--primary-blue);
                }

                .channel-options {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .channel-options input[type="radio"] {
                    display: none;
                }

                .radio-label {
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    background-color: var(--white);
                    border: 2px solid #e5e7eb;
                    border-radius: 2rem;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .channel-options input[type="radio"]:checked + .radio-label {
                    background-color: var(--primary-blue);
                    color: var(--white);
                    border-color: var(--primary-blue);
                }

                .submit-button {
                    display: block;
                    width: 100%;
                    padding: 1rem;
                    margin-top: 1.5rem;
                    background: linear-gradient(to bottom right, var(--accent-red), var(--accent-red-dark));
                    color: var(--white);
                    border: none;
                    border-radius: 0.5rem;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .submit-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
                }

                .submit-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
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
                    background-color: var(--white);
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

                .error-screen {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    padding: 1rem;
                    text-align: center;
                    font-size: 1.1rem;
                    color: var(--accent-red);
                }

                @media (min-width: 640px) {
                    .form-container {
                        max-width: 600px;
                        margin: 2rem auto;
                        min-height: calc(100vh - 4rem);
                        border-radius: 1.5rem;
                        box-shadow: 0 25px 50px -12px rgba(30, 64, 175, 0.25);
                    }

                    .form-card {
                        padding: 2rem;
                    }

                    .form-header h2 {
                        font-size: 2rem;
                    }
                }
            `}</style>
            
            <SimpleModal message={modalMessage} onClose={() => setModalMessage(null)} />

            <div className="form-container">
                {/* Éléments décoratifs flottants */}
                <div className="floating-element floating-element-1"></div>
                <div className="floating-element floating-element-2"></div>
                <div className="floating-element floating-element-3"></div>
                <div className="sparkle sparkle-1"></div>
                <div className="sparkle sparkle-2"></div>
                <div className="sparkle sparkle-3"></div>
                
                {/* Bandeau d'anniversaire pour les 70 ans */}
                <div className="anniversary-banner">
                    🎉 70 ans d'excellence Brico Ceram 🎉
                </div>

                <form onSubmit={handleSubmit} className="form-card">
                    {/* Header stylisé pour donner un contexte */}
                    <div className="form-header">
                        <TrophyIcon className="header-icon" />
                        <h2>Inscrivez-vous pour jouer</h2>
                        <p className="dept-info">Département: {dept} ({slug})</p>
                    </div>

                    <div className="input-group">
                        <label className="postit-label">Nom & Prénom</label>
                        <input name="name" type="text" value={form.name} onChange={handleChange} required disabled={loading} placeholder="Entrez votre nom complet" />
                    </div>

                    <div className="input-group">
                        <label className="postit-label">Email</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} required disabled={loading} placeholder="email@exemple.com" />
                    </div>

                    <div className="input-group">
                        <label className="postit-label">Téléphone</label>
                        <input name="tel" type="tel" value={form.tel} onChange={handleChange} required disabled={loading} placeholder="06 90 XX XX XX" />
                    </div>

                    <div className="input-group">
                        <label className="postit-label">Date de Naissance</label>
                        <input name="birthdate" type="date" value={form.birthdate} onChange={handleChange} required disabled={loading} />
                    </div>

                    <h3>Vos préférences de contact</h3>

                    <div className="checkbox-group">
                        <input type="checkbox" name="brandOptin" id="brandOptin" checked={form.brandOptin === 'yes'} onChange={handleChange} disabled={loading} />
                        <label htmlFor="brandOptin">Oui, j'accepte de recevoir des offres de {slug}.</label>
                    </div>

                    {formCanalContacte && (
                        <div className="contact-channel-container">
                            <label>Choisissez un canal de contact</label>
                            <div className="channel-options">
                                <input type="radio" id="email" name="contactChannel" value="email" checked={form.contactChannel==='email'} onChange={handleChange} disabled={loading} />
                                <label htmlFor="email" className="radio-label">Email</label>

                                <input type="radio" id="sms" name="contactChannel" value="sms" checked={form.contactChannel==='sms'} onChange={handleChange} disabled={loading} />
                                <label htmlFor="sms" className="radio-label">SMS</label>

                                <input type="radio" id="both" name="contactChannel" value="both" checked={form.contactChannel==='both'} onChange={handleChange} disabled={loading} />
                                <label htmlFor="both" className="radio-label">Email & SMS</label>
                            </div>
                        </div>
                    )}

                    <div className="checkbox-group">
                        <input type="checkbox" name="partnerOptin" id="partnerOptin" checked={form.partnerOptin} onChange={handleChange} disabled={loading} />
                        <label htmlFor="partnerOptin">Oui, j'accepte de recevoir des offres des partenaires.</label>
                    </div>

                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? 'Enregistrement...' : 'Commencer le jeu'}
                    </button>
                </form>
            </div>
        </>
    );
}