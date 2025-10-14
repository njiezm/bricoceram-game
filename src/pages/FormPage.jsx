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
        firstName: '', lastName: '', email: '', tel: '', postalCode: '',
        termsAccepted: false, brandOptin: 'no', contactChannel: null
    });
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        if (name === 'brandOptin') {
            const newValue = checked ? 'yes' : 'no';
            setForm(prev => ({ 
                ...prev, 
                brandOptin: newValue, 
                contactChannel: newValue === 'no' ? null : prev.contactChannel 
            }));
        } else {
            setForm(prev => ({ 
                ...prev, 
                [name]: type === 'checkbox' ? checked : value 
            }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (loading) return;
        
        // Validation des champs obligatoires
        if (!form.firstName || !form.lastName || !form.email || !form.tel || !form.postalCode) {
            setModalMessage("Veuillez remplir tous les champs obligatoires.");
            return;
        }
        
        // Validation des conditions
        if (!form.termsAccepted) {
            setModalMessage("Veuillez accepter le règlement du jeu et confirmer avoir plus de 18 ans.");
            return;
        }
        
        if (form.brandOptin === 'yes' && !form.contactChannel) {
            setModalMessage("Veuillez choisir un canal de communication.");
            return;
        }

        setLoading(true);
        try {
            const { id: participantId } = await registerParticipant({ 
                ...form, 
                dept, 
                slug, 
                contactChannel: form.brandOptin === 'yes' ? form.contactChannel : null 
            });
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
                /* Reset CSS pour un affichage plein écran parfait */
                * { box-sizing: border-box; }
                html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; font-family: 'Inter', sans-serif; }

                .form-container {
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #fef3c7 100%);
                    position: relative;
                    overflow-y: auto;
                    overflow-x: hidden;
                }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }

                .floating-element {
                    position: absolute;
                    border-radius: 50%;
                    opacity: 0.1;
                    z-index: 1;
                }
                .floating-element-1 { top: 10%; left: 5%; width: 80px; height: 80px; background: #1e40af; animation: float 6s ease-in-out infinite; }
                .floating-element-2 { top: 20%; right: 8%; width: 60px; height: 60px; background: #dc2626; animation: float 8s ease-in-out infinite reverse; }
                .floating-element-3 { bottom: 15%; left: 10%; width: 70px; height: 70px; background: #fbbf24; animation: float 7s ease-in-out infinite; }

                .anniversary-banner {
                    position: relative;
                    background: linear-gradient(90deg, #fbbf24, #dc2626);
                    color: white;
                    padding: 0.75rem;
                    text-align: center;
                    font-weight: bold;
                    font-size: 1rem;
                    letter-spacing: 0.05em;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    z-index: 10;
                }

                .form-content {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem;
                    padding-top: 0;
                }

                .form-header {
                    text-align: center;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 15px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .header-icon {
                    width: 3rem;
                    height: 3rem;
                    color: #dc2626;
                    margin-bottom: 0.5rem;
                }

                .form-header h2 {
                    margin: 0.5rem 0;
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: #1e40af;
                }

                .instruction {
                    text-align: center;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 15px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1e40af;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .form-card {
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 15px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                }

                .input-group {
                    margin-bottom: 1.5rem;
                }

                .input-label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: #1e40af;
                    font-size: 1rem;
                }

                input[type="text"], input[type="email"], input[type="tel"] {
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    box-sizing: border-box;
                    transition: border-color 0.3s;
                }

                input[type="text"]:focus, input[type="email"]:focus, input[type="tel"]:focus {
                    outline: none;
                    border-color: #1e40af;
                }

                .checkbox-group {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: rgba(240, 249, 255, 0.5);
                    border-radius: 0.5rem;
                }

                .checkbox-group input[type="checkbox"] {
                    margin-right: 0.75rem;
                    margin-top: 0.25rem;
                    min-width: 20px;
                    height: 20px;
                }

                .checkbox-group label {
                    flex-grow: 1;
                    font-size: 0.95rem;
                    line-height: 1.4;
                }

                .checkbox-group label a {
                    color: #1e40af;
                    text-decoration: underline;
                }

                .optin-container {
                    margin-bottom: 1.5rem;
                }

                .optin-title {
                    font-weight: 600;
                    color: #1e40af;
                    margin-bottom: 0.75rem;
                    font-size: 1rem;
                }

                .optin-options {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .optin-option {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem;
                    background: rgba(255, 255, 255, 0.7);
                    border-radius: 0.5rem;
                    border: 2px solid #e5e7eb;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .optin-option:hover {
                    border-color: #1e40af;
                }

                .optin-option.selected {
                    background: rgba(30, 64, 175, 0.1);
                    border-color: #1e40af;
                }

                .optin-option input[type="radio"] {
                    margin-right: 0.75rem;
                }

                .optin-option label {
                    cursor: pointer;
                    flex-grow: 1;
                }

                .channel-options {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                    margin-top: 0.75rem;
                }

                .channel-option {
                    flex: 1;
                    min-width: 100px;
                    padding: 0.5rem;
                    background: rgba(255, 255, 255, 0.7);
                    border: 2px solid #e5e7eb;
                    border-radius: 0.5rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .channel-option:hover {
                    border-color: #1e40af;
                }

                .channel-option.selected {
                    background: rgba(30, 64, 175, 0.1);
                    border-color: #1e40af;
                }

                .submit-button {
                    display: block;
                    width: 100%;
                    padding: 1rem;
                    margin-top: auto;
                    background: linear-gradient(to bottom right, #dc2626, #b91c1c);
                    color: white;
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

                .error-screen {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    padding: 1rem;
                    text-align: center;
                    font-size: 1.1rem;
                    color: #dc2626;
                }

                @media (min-width: 768px) {
                    .form-container {
                        padding: 2rem;
                        justify-content: center;
                        align-items: center;
                    }

                    .form-content {
                        width: 100%;
                        max-width: 600px;
                        height: auto;
                        max-height: 90vh;
                        border-radius: 1.5rem;
                        box-shadow: 0 25px 50px -12px rgba(30, 64, 175, 0.25);
                        background: white;
                        overflow-y: auto;
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
                
                {/* Bandeau d'anniversaire pour les 70 ans */}
                <div className="anniversary-banner">
                    🎉 70 ans d'excellence Brico Ceram 🎉
                </div>

                <div className="form-content">
                    {/* Header stylisé pour donner un contexte */}
                    <div className="form-header">
                        <TrophyIcon className="header-icon" />
                        <h2>Inscrivez-vous pour jouer</h2>
                        <p className="dept-info">Département: {dept} ({slug})</p>
                    </div>

                    {/* CONSIGNE */}
                    <div className="instruction">
                        Remplis le formulaire suivant pour valider ta participation
                    </div>

                    <form onSubmit={handleSubmit} className="form-card">
                        {/* CHAMPS DU FORMULAIRE */}
                        <div className="input-group">
                            <label className="input-label">Prénom :</label>
                            <input 
                                name="firstName" 
                                type="text" 
                                value={form.firstName} 
                                onChange={handleChange} 
                                required 
                                disabled={loading} 
                                placeholder="Entrez votre prénom" 
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Nom :</label>
                            <input 
                                name="lastName" 
                                type="text" 
                                value={form.lastName} 
                                onChange={handleChange} 
                                required 
                                disabled={loading} 
                                placeholder="Entrez votre nom" 
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Mail :</label>
                            <input 
                                name="email" 
                                type="email" 
                                value={form.email} 
                                onChange={handleChange} 
                                required 
                                disabled={loading} 
                                placeholder="email@exemple.com" 
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Tél. :</label>
                            <input 
                                name="tel" 
                                type="tel" 
                                value={form.tel} 
                                onChange={handleChange} 
                                required 
                                disabled={loading} 
                                placeholder="06 90 XX XX XX" 
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Code Postal :</label>
                            <input 
                                name="postalCode" 
                                type="text" 
                                value={form.postalCode} 
                                onChange={handleChange} 
                                required 
                                disabled={loading} 
                                placeholder="Entrez votre code postal" 
                            />
                        </div>

                        {/* Conditions d'utilisation */}
                        <div className="checkbox-group">
                            <input 
                                type="checkbox" 
                                name="termsAccepted" 
                                id="termsAccepted" 
                                checked={form.termsAccepted} 
                                onChange={handleChange} 
                                disabled={loading} 
                            />
                            <label htmlFor="termsAccepted">
                                J'accepte le <a href="#" onClick={(e) => { e.preventDefault(); setModalMessage("Le règlement du jeu sera bientôt disponible."); }}>règlement du jeu</a> et confirme avoir plus de 18 ans
                            </label>
                        </div>

                        {/* Optin pour les offres commerciales */}
                        <div className="optin-container">
                            <div className="optin-title">J'accepte de recevoir les offres commerciales de la part de BRICOCERAM</div>
                            
                            <div className="optin-options">
                                <div 
                                    className={`optin-option ${form.brandOptin === 'no' ? 'selected' : ''}`}
                                    onClick={() => setForm(prev => ({ ...prev, brandOptin: 'no', contactChannel: null }))}
                                >
                                    <input 
                                        type="radio" 
                                        name="brandOptin" 
                                        id="optinNo" 
                                        value="no" 
                                        checked={form.brandOptin === 'no'} 
                                        onChange={handleChange} 
                                        disabled={loading} 
                                    />
                                    <label htmlFor="optinNo">Non</label>
                                </div>
                                
                                <div 
                                    className={`optin-option ${form.brandOptin === 'yes' ? 'selected' : ''}`}
                                    onClick={() => setForm(prev => ({ ...prev, brandOptin: 'yes' }))}
                                >
                                    <input 
                                        type="radio" 
                                        name="brandOptin" 
                                        id="optinYes" 
                                        value="yes" 
                                        checked={form.brandOptin === 'yes'} 
                                        onChange={handleChange} 
                                        disabled={loading} 
                                    />
                                    <label htmlFor="optinYes">Oui</label>
                                </div>
                            </div>

                            {formCanalContacte && (
                                <div className="channel-options">
                                    <div 
                                        className={`channel-option ${form.contactChannel === 'email' ? 'selected' : ''}`}
                                        onClick={() => setForm(prev => ({ ...prev, contactChannel: 'email' }))}
                                    >
                                        <input 
                                            type="radio" 
                                            name="contactChannel" 
                                            id="email" 
                                            value="email" 
                                            checked={form.contactChannel === 'email'} 
                                            onChange={handleChange} 
                                            disabled={loading} 
                                        />
                                        <label htmlFor="email">Email</label>
                                    </div>

                                    <div 
                                        className={`channel-option ${form.contactChannel === 'sms' ? 'selected' : ''}`}
                                        onClick={() => setForm(prev => ({ ...prev, contactChannel: 'sms' }))}
                                    >
                                        <input 
                                            type="radio" 
                                            name="contactChannel" 
                                            id="sms" 
                                            value="sms" 
                                            checked={form.contactChannel === 'sms'} 
                                            onChange={handleChange} 
                                            disabled={loading} 
                                        />
                                        <label htmlFor="sms">SMS</label>
                                    </div>

                                    <div 
                                        className={`channel-option ${form.contactChannel === 'both' ? 'selected' : ''}`}
                                        onClick={() => setForm(prev => ({ ...prev, contactChannel: 'both' }))}
                                    >
                                        <input 
                                            type="radio" 
                                            name="contactChannel" 
                                            id="both" 
                                            value="both" 
                                            checked={form.contactChannel === 'both'} 
                                            onChange={handleChange} 
                                            disabled={loading} 
                                        />
                                        <label htmlFor="both">Email & SMS</label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* BOUTON VALIDER */}
                        <button type="submit" disabled={loading} className="submit-button">
                            {loading ? 'Enregistrement...' : 'Valider'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}