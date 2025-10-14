
import './FormApp.css';

import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Composant SVG pour un trophée (remplace TrophyIcon)
const TrophyIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2"/>
        <path d="M18 9h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V15c0 1.1.9 2 2 2s2-.9 2-2v-.34c.81-.46 1.4-1.24 1.4-2.16 0-1.38-1.12-2.5-2.5-2.5S10.5 11.12 10.5 12.5c0 .92.59 1.7 1.4 2.16Z"/>
        <path d="M12 21a5 5 0 0 0 5-5V8H7v8a5 5 0 0 0 5 5Z"/>
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
            {/* Le style CSS est maintenant importé du fichier FormApp.css */}
            <style>{`@import url('./FormApp.css');`}</style>
            
            <SimpleModal message={modalMessage} onClose={() => setModalMessage(null)} />

            <div className="form-container">
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
