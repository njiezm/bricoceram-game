import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const App = ({ player, savePlayer, slug }) => {
    const navigate = useNavigate();

    if (typeof localStorage !== 'undefined') {
        localStorage.clear();
    }

    const chooseDept = (dept) => {
        savePlayer({ dept });
        const urlPrefix = `/${dept}/${slug}/anniversaire`;
        if (player && player.played) {
            navigate(`${urlPrefix}/one-participation`);
        } else {
            navigate(`${urlPrefix}/form`);
        }
    };

    const Button = ({ dept, emoji }) => (
        <button className="dept-button" onClick={() => chooseDept(dept)}>
            <span className="emoji">{emoji}</span>
            {dept}
        </button>
    );

    return (
        <div className="app-container">
            <div className="pattern-dots"></div>

            <div className="card">
                <div className="logo-container">
                    <img
                        src="https://placehold.co/300x90/ffffff/0047ab?text=BRICO+CERAM"
                        alt="Logo Brico Céram"
                        className="logo"
                    />
                    <p className="subtitle">Jeu Anniversaire</p>
                </div>

                <div className="title-section">
                    <h1>Choisissez votre île</h1>
                </div>

                <div className="buttons-container">
                    <div className="button-row">
                        <Button dept="Martinique" emoji="🌴" />
                        <Button dept="Guyane" emoji="🐆" />
                    </div>
                    <div className="button-row">
                        <Button dept="Guadeloupe" emoji="🍍" />
                    </div>
                </div>

                <p className="footer-text">
                    Sélectionnez votre région pour commencer et tenter de gagner !
                </p>
            </div>
        </div>
    );
};

export default App;
