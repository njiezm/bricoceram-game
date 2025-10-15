import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// --- CONSTANTES GLOBALES AMÉLIORÉES ---
const SUCCESS_THRESHOLD = 0.85;
const START_TIME = 30;
const USER_LINE_RADIUS = 15;

// Couleurs thématiques Brico Ceram
const GUIDE_BLUR_COLOR = 'rgba(59, 130, 246, 0.3)';
const GUIDE_GRADIENT_START = '#1e40af';
const GUIDE_GRADIENT_END = '#dc2626';
const USER_STROKE_COLOR = '#3b82f6';
const BG_COLOR = '#f0f9ff';
const ACCENT_COLOR = '#dc2626';
const GOLD_COLOR = '#fbbf24';
const GOLD_LIGHT = '#fef3c7';

export default function GameCanvas({ player, savePlayer, dept, slug }) {
  const guideRef = useRef();
  const drawRef = useRef();
  const offRef = useRef(document.createElement('canvas'));
  const navigate = useNavigate();

  // --- ÉTATS DU JEU ---
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(START_TIME);
  const [coverage, setCoverage] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  // --- RÉFÉRENCES (VARIABLES SYNCHRONES POUR LE CANVAS) ---
  const canvasStateRef = useRef({
    width: 0,
    height: 0,
    strokeMask: new Uint8Array(0),
    strokeTotal: 0,
    hitMask: new Uint8Array(0),
    overlapTotal: 0,
    scale: 1,
    drawing: false,
    lastX: 0,
    lastY: 0,
  });

  const tickIdRef = useRef(null);
  const t0Ref = useRef(null);
  const isGameEndingRef = useRef(false);

  // --- LOGIQUE DE JEU STABLE ---
  const getCoverage = useCallback(() => {
    const state = canvasStateRef.current;
    return state.strokeTotal ? (state.overlapTotal / state.strokeTotal) : 0;
  }, []);

  const finalRedirection = useCallback((finalRecall) => {
    if (isGameEndingRef.current) return;
    isGameEndingRef.current = true;

    if (tickIdRef.current) {
      cancelAnimationFrame(tickIdRef.current);
      tickIdRef.current = null;
    }

    const score = Math.round(finalRecall * 100);
    setCoverage(score);
    setRunning(false);

    savePlayer({ played: true });

    const urlPrefix = `/${dept}/anniversaire/${slug}`;

    if (finalRecall >= SUCCESS_THRESHOLD) {
      navigate(`${urlPrefix}/win`, { state: { score } });
    } else {
      navigate(`${urlPrefix}/lose`, { state: { score } });
    }
  }, [navigate, savePlayer, dept, slug]);

  const startGame = useCallback(() => {
    if (running || isGameEndingRef.current) return;
    setShowInstructions(false);
    setTimeLeft(START_TIME);
    setCoverage(0);
    isGameEndingRef.current = false;
    setRunning(true);

    t0Ref.current = performance.now();

    const state = canvasStateRef.current;
    const dctx = drawRef.current.getContext('2d');
    if (dctx) {
      dctx.clearRect(0, 0, state.width, state.height);
      dctx.lineCap = 'round';
      dctx.lineJoin = 'round';
      dctx.strokeStyle = USER_STROKE_COLOR;
      dctx.lineWidth = Math.max(USER_LINE_RADIUS * state.scale * 0.8, 8);
    }

    state.hitMask = new Uint8Array(state.width * state.height);
    state.overlapTotal = 0;
    state.userTotal = 0;
    state.drawing = false;
  }, [running]);

  // --- MINUTEUR (useEffect) ---
  useEffect(() => {
    if (!running || isGameEndingRef.current) {
      if (tickIdRef.current) {
        cancelAnimationFrame(tickIdRef.current);
        tickIdRef.current = null;
      }
      return;
    }

    const total = START_TIME;
    function tick(now) {
      if (!t0Ref.current) { t0Ref.current = performance.now(); }
      const elapsed = Math.floor((now - t0Ref.current) / 1000);
      const remain = Math.max(0, total - elapsed);
      if (remain !== timeLeft) setTimeLeft(remain);
      if (remain > 0) {
        tickIdRef.current = requestAnimationFrame(tick);
      } else {
        finalRedirection(getCoverage());
      }
    }

    tickIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (tickIdRef.current) {
        cancelAnimationFrame(tickIdRef.current);
        tickIdRef.current = null;
      }
    };
  }, [running, finalRedirection, getCoverage, timeLeft]);

  // --- LOGIQUE DU CANVAS ET ÉVÉNEMENTS (useEffect) ---
  useEffect(() => {
    const guide = guideRef.current;
    const draw = drawRef.current;
    const off = offRef.current;
    const finalRedirect = finalRedirection;
    const state = canvasStateRef.current;

    const devicePixelRatio = window.devicePixelRatio || 1;
    let gctx = guide.getContext('2d');
    let dctx = draw.getContext('2d', { willReadFrequently: true });
    let offctx = off.getContext('2d', { willReadFrequently: true });
    const drawState = { tolerance: 5, lineWidth: 10, shape: '' };

    if (player.dept === 'Guadeloupe') drawState.shape = 'candle';
    else drawState.shape = 'circle';

    // --- MISE À JOUR : REDIMENSIONNEMENT POUR PLEIN ÉCRAN ---
    function resize() {
      // Le canvas est maintenant dans un conteneur qui prend l'espace restant
      const canvasWrapper = draw.parentElement;
      const { width: wrapperWidth, height: wrapperHeight } = canvasWrapper.getBoundingClientRect();
      
      const rect = {
          width: Math.min(wrapperWidth, 500), // Max 500px pour la jouabilité
          height: Math.min(wrapperHeight, 500) // Max 500px pour garder un ratio carré
      };

      state.width = Math.floor(rect.width * devicePixelRatio);
      state.height = Math.floor(rect.height * devicePixelRatio);
      state.scale = devicePixelRatio;

      [guide, draw, off].forEach(cv => {
        cv.width = state.width;
        cv.height = state.height;
        cv.style.width = rect.width + 'px';
        cv.style.height = rect.height + 'px';
      });

      renderGuide();
      dctx = draw.getContext('2d', { willReadFrequently: true });
      dctx.lineCap = 'round';
      dctx.lineJoin = 'round';
      dctx.strokeStyle = USER_STROKE_COLOR;
      dctx.lineWidth = Math.max(USER_LINE_RADIUS * state.scale * 0.8, 8);
      
      state.hitMask = new Uint8Array(state.width * state.height);
      state.overlapTotal = 0;
      state.userTotal = 0;
      dctx.clearRect(0, 0, state.width, state.height);
      setCoverage(0);
    }

    function buildPath(shape) {
      const p = new Path2D();
      const cx = state.width / 2, cy = state.height / 2;
      const r = Math.min(state.width, state.height) * 0.45;
      if (shape === 'circle') { p.arc(cx, cy, r, 0, Math.PI * 2); return p; }
      if (shape === 'candle') {
        const r2 = r;
        const w = r2 * 0.6, h = r2 * 1.6;
        const x0 = cx - w / 2, y0 = cy - h / 2;
        p.moveTo(x0, y0);
        p.lineTo(x0 + w, y0);
        p.lineTo(x0 + w, y0 + h);
        p.lineTo(x0, y0 + h);
        p.closePath();
        p.moveTo(cx, y0 - r2 * 0.15);
        p.quadraticCurveTo(cx + r2 * 0.18, y0 - r2 * 0.45, cx, y0 - r2 * 0.75);
        p.quadraticCurveTo(cx - r2 * 0.18, y0 - r2 * 0.45, cx, y0 - r2 * 0.15);
        return p;
      }
      return p;
    }

    function renderGuide() {
      state.strokeMask = new Uint8Array(state.width * state.height);
      state.strokeTotal = 0;
      drawState.lineWidth = Math.max(5, Math.round(drawState.tolerance * 2.5 * state.scale));
      const path = buildPath(drawState.shape);

      gctx.clearRect(0, 0, state.width, state.height); gctx.save();
      gctx.strokeStyle = GUIDE_BLUR_COLOR;
      gctx.lineWidth = drawState.lineWidth * 3.5;
      gctx.lineCap = 'round'; gctx.lineJoin = 'round';
      gctx.filter = 'blur(' + Math.round(12 * state.scale) + 'px)';
      gctx.stroke(path); gctx.restore();

      gctx.save();
      const grad = gctx.createLinearGradient(0, 0, state.width, 0);
      grad.addColorStop(0, GUIDE_GRADIENT_START);
      grad.addColorStop(1, GUIDE_GRADIENT_END);
      gctx.strokeStyle = grad;
      gctx.lineWidth = drawState.lineWidth * 1.2;
      gctx.lineCap = 'round'; gctx.lineJoin = 'round';
      gctx.stroke(path); gctx.restore();

      offctx.clearRect(0, 0, state.width, state.height);
      offctx.strokeStyle = '#ff0077';
      offctx.lineWidth = drawState.lineWidth * 1.2;
      offctx.lineCap = 'round'; offctx.lineJoin = 'round';
      offctx.stroke(path);

      const img = offctx.getImageData(0, 0, state.width, state.height).data;
      for (let i = 0; i < img.length; i += 4) {
        const r = img[i];
        if (r > 200) {
          state.strokeMask[i / 4] = 1;
          state.strokeTotal++;
        }
      }
    }

    function markHit(x, y) {
      const r = Math.max(USER_LINE_RADIUS * state.scale, USER_LINE_RADIUS);
      dctx.beginPath(); dctx.moveTo(x, y); dctx.lineTo(x + 0.01, y + 0.01); dctx.stroke();
      dctx.beginPath();
      dctx.arc(x, y, r, 0, Math.PI * 2);
      dctx.fillStyle = 'rgba(255,255,255,0.001)';
      dctx.fill();

      const xmin = Math.max(0, Math.floor(x - r)); const xmax = Math.min(state.width - 1, Math.ceil(x + r));
      const ymin = Math.max(0, Math.floor(y - r)); const ymax = Math.min(state.height - 1, Math.ceil(y + r));

      for (let yy = ymin; yy <= ymax; yy++) {
        for (let xx = xmin; xx <= xmax; xx++) {
          const dx = xx - x, dy = yy - y;
          if (dx * dx + dy * dy <= r * r) {
            const idx = yy * state.width + xx;
            if (!state.hitMask[idx]) {
              state.hitMask[idx] = 1;
              state.userTotal++;
              if (state.strokeMask[idx]) state.overlapTotal++;
            }
          }
        }
      }
    }

    function updateCoverage() {
      const recall = getCoverage();
      const pct = Math.round(recall * 100);
      setCoverage(pct);
    }

    function posFromEvent(e) {
      const rect = draw.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: (clientX - rect.left) * state.scale, y: (clientY - rect.top) * state.scale };
    }

    function onDown(e) {
      if (!running || isGameEndingRef.current) return;
      state.drawing = true;
      const { x, y } = posFromEvent(e);
      state.lastX = x; state.lastY = y;
      markHit(x, y);
      e.preventDefault();
    }

    function onMove(e) {
      if (!state.drawing || !running || isGameEndingRef.current) return;
      const { x, y } = posFromEvent(e);
      const dx = x - state.lastX, dy = y - state.lastY;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.floor(dist / (0.8 * state.scale)));

      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const sx = state.lastX + dx * t;
        const sy = state.lastY + dy * t;
        dctx.beginPath(); dctx.moveTo(state.lastX, state.lastY); dctx.lineTo(sx, sy); dctx.stroke();
        markHit(sx, sy);
      }

      state.lastX = x; state.lastY = y;
      updateCoverage();
      e.preventDefault();
    }

    function onUp(e) {
      if (!state.drawing || isGameEndingRef.current) return;
      state.drawing = false;
      const finalRecall = getCoverage();
      finalRedirect(finalRecall);
    }

    draw.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    draw.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    draw.addEventListener('mouseleave', onUp);
    window.addEventListener('touchcancel', onUp);

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      draw.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      draw.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      draw.removeEventListener('mouseleave', onUp);
      window.removeEventListener('touchcancel', onUp);
    };
  }, [player.dept, finalRedirection, getCoverage, running]);

  // --- RENDU JSX PLEIN ÉCRAN ---
  return (
    <div className="game-container">
      <style>{`
        /* Reset CSS pour un affichage plein écran parfait */
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; }

        .game-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, ${BG_COLOR} 0%, #e0f2fe 50%, ${GOLD_LIGHT} 100%);
          position: relative;
    
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
        .floating-element-1 { top: 10%; left: 5%; width: 60px; height: 60px; background: ${GUIDE_GRADIENT_START}; animation: float 6s ease-in-out infinite; }
        .floating-element-2 { top: 20%; right: 8%; width: 50px; height: 50px; background: ${ACCENT_COLOR}; animation: float 8s ease-in-out infinite reverse; }
        .floating-element-3 { bottom: 15%; left: 10%; width: 55px; height: 55px; background: ${GOLD_COLOR}; animation: float 7s ease-in-out infinite; }

        .anniversary-banner {
          position: relative;
          background: linear-gradient(90deg, ${GOLD_COLOR}, ${ACCENT_COLOR});
          color: white;
          padding: 0.75rem;
          text-align: center;
          font-weight: bold;
          font-size: 1rem;
          letter-spacing: 0.05em;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          z-index: 10;
        }

        .game-content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          padding: 1rem;
          padding-top: 0;
        }

        .game-header {
          text-align: center;
          padding: 1rem 0.5rem;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-radius: 0 0 20px 20px;
          margin-bottom: 1rem;
        }
        .game-header h1 { margin: 0; color: ${GUIDE_GRADIENT_START}; font-size: 1.8rem; font-weight: bold; }

        .stats-container {
          display: flex;
          justify-content: space-around;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }
        .stat-item { text-align: center; }
        .stat-label { font-size: 0.9rem; color: #6b7280; margin-bottom: 0.3rem; }
        .stat-value { font-weight: bold; font-size: 1.5rem; }

        .instructions {
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 15px;
          font-size: 1rem;
          text-align: center;
          color: #374151;
          margin-bottom: 1rem;
        }

        .canvas-container {
          flex-grow: 1; /* Prend tout l'espace restant */
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .canvas-wrapper {
          position: relative;
          width: 100%;
          max-width: 500px;
          aspect-ratio: 1 / 1;
          border: 3px solid ${GUIDE_GRADIENT_START};
          border-radius: 20px;
          overflow: hidden;
          touch-action: none;
          background: #ffffff;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .canvas-wrapper canvas { position: absolute; inset: 0; touch-action: none; }

        .button-container {
          padding: 1rem;
          display: flex;
          justify-content: center;
        }
        .start-button {
          padding: 16px 32px;
          font-size: 1.3rem;
          font-weight: bold;
          cursor: pointer;
          border-radius: 15px;
          border: none;
          color: white;
          background: linear-gradient(90deg, ${GUIDE_GRADIENT_START}, ${GUIDE_GRADIENT_END});
          box-shadow: 0 4px 14px 0 rgba(220, 38, 38, 0.3);
          transition: all 0.3s ease;
          width: 90%;
          max-width: 400px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .start-button:disabled { background: #9ca3af; cursor: not-allowed; box-shadow: none; }

        @media (min-width: 768px) {
          .game-container { padding: 2rem; justify-content: center; align-items: center; }
          .game-content {
            width: 100%;
            max-width: 700px;
            height: auto;
            max-height: 90vh;
            border-radius: 1.5rem;
            box-shadow: 0 25px 50px -12px rgba(30, 64, 175, 0.25);
            background: white;
            overflow-y: auto;
          }
          .canvas-wrapper { max-width: 550px; }
        }
      `}</style>

      {/* Éléments décoratifs flottants */}
      <div className="floating-element floating-element-1"></div>
      <div className="floating-element floating-element-2"></div>
      <div className="floating-element floating-element-3"></div>
      
      {/* Bandeau d'anniversaire */}
      <div className="anniversary-banner">
        🎉 70 ans d'excellence Brico Ceram 🎉
      </div>

      <div className="game-content">
        {/* En-tête avec logo */}
        <header className="game-header">
          <h1>Brico Ceram</h1>
        </header>

        {/* Section stats */}
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-label">⏰ Temps</div>
            <div className="stat-value" style={{ color: timeLeft <= 10 && running ? ACCENT_COLOR : GUIDE_GRADIENT_START }}>
              {timeLeft}s
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">🎯 Couverture</div>
            <div className="stat-value" style={{ color: coverage >= SUCCESS_THRESHOLD * 100 ? GUIDE_GRADIENT_START : ACCENT_COLOR }}>
              {coverage}%
            </div>
          </div>
        </div>
        
        {/* Instructions */}
        {showInstructions && (
          <div className="instructions">
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>📱 Comment jouer ?</p>
            <p style={{ margin: 0 }}>Tracez avec votre doigt sur la forme colorée pour la couvrir au maximum avant la fin du temps !</p>
          </div>
        )}
        
        {/* Conteneur du canvas - zone de jeu principale */}
        <div className="canvas-container">
          <div className="canvas-wrapper">
            <canvas ref={guideRef} />
            <canvas ref={drawRef} />
          </div>
        </div>

        {/* Bouton de démarrage */}
        <div className="button-container">
          <button className="start-button" onClick={startGame} disabled={running}>
            {running ? `Tracé en cours (${timeLeft}s)` : '🚀 Démarrer un nouveau tracé'}
          </button>
        </div>
      </div>
    </div>
  );
}