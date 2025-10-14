import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// --- CONSTANTES GLOBALES AMÉLIORÉES ---
const SUCCESS_THRESHOLD = 0.85; // Légèrement réduit pour une meilleure expérience mobile
const START_TIME = 30;

// Épaisseur du trait de l'utilisateur (AUGMENTÉ pour Mobile First)
const USER_LINE_RADIUS = 15; // Augmenté pour faciliter le tracé sur mobile

// Couleurs thématiques Brico Ceram
const GUIDE_BLUR_COLOR = 'rgba(59, 130, 246, 0.3)'; // Bleu Brico Ceram avec transparence
const GUIDE_GRADIENT_START = '#1e40af'; // Bleu foncé Brico Ceram
const GUIDE_GRADIENT_END = '#dc2626'; // Rouge Brico Ceram
const USER_STROKE_COLOR = '#3b82f6'; // Bleu Brico Ceram
const BG_COLOR = '#f0f9ff'; // Fond bleu très clair
const ACCENT_COLOR = '#dc2626'; // Rouge Brico Ceram pour les accents

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

    const urlPrefix = `/${dept}/${slug}/anniversaire`;

    if (finalRecall >= SUCCESS_THRESHOLD) {
      navigate(`${urlPrefix}/win`, { state: { score } });
    } else {
      navigate(`${urlPrefix}/lose`, { state: { score } });
    }
  }, [navigate, savePlayer, dept, slug]);

  const startGame = useCallback(() => {
    if (running || isGameEndingRef.current) return;
    
    // Masquer les instructions au démarrage
    setShowInstructions(false);

    // Réinitialisation de l'état
    setTimeLeft(START_TIME);
    setCoverage(0);
    isGameEndingRef.current = false;
    setRunning(true);

    t0Ref.current = performance.now();

    // Nettoyage visuel et logique du canvas
    const state = canvasStateRef.current;
    const dctx = drawRef.current.getContext('2d');
    if (dctx) {
      dctx.clearRect(0, 0, state.width, state.height);
      dctx.lineCap = 'round';
      dctx.lineJoin = 'round';
      // COULEUR DU TRACÉ UTILISATEUR AMÉLIORÉE
      dctx.strokeStyle = USER_STROKE_COLOR;
      // ÉPAISSEUR DU TRACÉ UTILISATEUR AMÉLIORÉE
      dctx.lineWidth = Math.max(USER_LINE_RADIUS * state.scale * 0.8, 8); // Augmenté pour mobile
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

    // --- MISE À JOUR : MOBILE FIRST ET TAILLE D'IMAGE PLUS GROSSE ---
    function resize() {
      // Utilisation du conteneur parent (le div flex)
      const parentRect = draw.parentElement.parentElement.getBoundingClientRect();
      // On s'assure que le canvas occupe presque toute la largeur sur mobile
      const width = parentRect.width * 0.98; 
      // Ratio plus carré pour mobile (meilleur pour le tracé)
      const height = Math.min(width * 0.9, window.innerHeight * 0.5); 
      
      const rect = {
          width: Math.min(width, 800), // Max 800px pour les grands écrans
          height: Math.min(height, 720) // Hauteur maximale
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
      dctx.strokeStyle = USER_STROKE_COLOR; // Réapplique la couleur utilisateur
      dctx.lineWidth = Math.max(USER_LINE_RADIUS * state.scale * 0.8, 8); // Réapplique l'épaisseur
      
      state.hitMask = new Uint8Array(state.width * state.height);
      state.overlapTotal = 0;
      state.userTotal = 0;
      dctx.clearRect(0, 0, state.width, state.height);
      setCoverage(0);
    }

    function buildPath(shape) {
      const p = new Path2D();
      const cx = state.width / 2, cy = state.height / 2;
      // Rendre l'image plus grosse: on utilise plus de surface (0.45 vs 0.4)
      const r = Math.min(state.width, state.height) * 0.45;

      if (shape === 'circle') { 
        p.arc(cx, cy, r, 0, Math.PI * 2); 
        return p; 
      }
      if (shape === 'candle') {
        const r2 = r;
        const w = r2 * 0.6, h = r2 * 1.6;
        const x0 = cx - w / 2, y0 = cy - h / 2;
        p.moveTo(x0, y0);
        p.lineTo(x0 + w, y0);
        p.lineTo(x0 + w, y0 + h);
        p.lineTo(x0, y0 + h);
        p.closePath();
        // Flamme plus prononcée
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

      // MISE À JOUR : Épaisseur du tracé cible ajustée
      drawState.lineWidth = Math.max(5, Math.round(drawState.tolerance * 2.5 * state.scale));
      const path = buildPath(drawState.shape);

      // Dessin du guide 1: Flou (Épaisseur augmentée)
      gctx.clearRect(0, 0, state.width, state.height); gctx.save();
      gctx.strokeStyle = GUIDE_BLUR_COLOR;
      gctx.lineWidth = drawState.lineWidth * 3.5; // Épaisseur de flou plus importante
      gctx.lineCap = 'round'; gctx.lineJoin = 'round';
      gctx.filter = 'blur(' + Math.round(12 * state.scale) + 'px)'; // Flou plus marqué
      gctx.stroke(path); gctx.restore();

      // Dessin du guide 2: Tracé Principal (Dégradé Thématique Brico Ceram)
      gctx.save();
      const grad = gctx.createLinearGradient(0, 0, state.width, 0);
      grad.addColorStop(0, GUIDE_GRADIENT_START); // Bleu Brico Ceram
      grad.addColorStop(1, GUIDE_GRADIENT_END); // Rouge Brico Ceram
      gctx.strokeStyle = grad;
      gctx.lineWidth = drawState.lineWidth * 1.2; // Épaisseur augmentée
      gctx.lineCap = 'round'; gctx.lineJoin = 'round';
      gctx.stroke(path); gctx.restore();

      // Dessin du masque de frappe (Off-screen)
      offctx.clearRect(0, 0, state.width, state.height);
      offctx.strokeStyle = '#ff0077'; // Couleur quelconque
      offctx.lineWidth = drawState.lineWidth * 1.2; // Correspond à l'épaisseur du tracé principal
      offctx.lineCap = 'round'; offctx.lineJoin = 'round';
      offctx.stroke(path);

      // Lecture des pixels pour le masque de tracé
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
      // MISE À JOUR : Utilisation du nouveau USER_LINE_RADIUS
      const r = Math.max(USER_LINE_RADIUS * state.scale, USER_LINE_RADIUS);

      // Simule la ligne pour un tracé continu
      dctx.beginPath(); dctx.moveTo(x, y); dctx.lineTo(x + 0.01, y + 0.01); dctx.stroke();

      // Cercle de détection (invisible)
      dctx.beginPath();
      dctx.arc(x, y, r, 0, Math.PI * 2);
      dctx.fillStyle = 'rgba(255,255,255,0.001)';
      dctx.fill();

      // Calcul des limites pour la boucle d'itération
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

    // --- GESTIONNAIRES D'ÉVÉNEMENTS (Optimisés pour mobile) ---
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
      // Ajustement de la distance minimale pour les étapes (plus petit pour tracé plus lisse)
      const steps = Math.max(1, Math.floor(dist / (0.8 * state.scale)));

      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const sx = state.lastX + dx * t;
        const sy = state.lastY + dy * t;
        // Dessine la ligne pour le feedback visuel
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

    // Ajout et suppression des écouteurs d'événements
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

  // --- RENDU JSX AMÉLIORÉ POUR MOBILE FIRST AVEC THÈME BRICO CERAM ---
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.2rem',
      padding: '0.8rem',
      width: '100%',
      boxSizing: 'border-box',
      backgroundColor: BG_COLOR,
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* EN-TÊTE AVEC LOGO ET 70 ANS */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: '1rem 0',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '0 0 20px 20px',
        marginBottom: '0.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: GUIDE_GRADIENT_START,
            borderRadius: '50%',
            marginRight: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>
            BC
          </div>
          <h1 style={{
            margin: 0,
            color: GUIDE_GRADIENT_START,
            fontSize: '1.8rem',
            fontWeight: 'bold'
          }}>
            Brico Ceram
          </h1>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: ACCENT_COLOR,
          color: 'white',
          padding: '0.3rem 1rem',
          borderRadius: '20px',
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}>
          🎉 70 ans d'expertise 🎉
        </div>
      </div>

      {/* SECTION STATS */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        maxWidth: '450px',
        padding: '1rem',
        borderRadius: '15px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        fontSize: '1.2rem',
        fontWeight: '500'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.3rem' }}>⏰ Temps</div>
          <div style={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: timeLeft <= 10 && running ? ACCENT_COLOR : GUIDE_GRADIENT_START
          }}>{timeLeft}s</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.3rem' }}>🎯 Couverture</div>
          <div style={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: coverage >= SUCCESS_THRESHOLD * 100 ? GUIDE_GRADIENT_START : ACCENT_COLOR
          }}>{coverage}%</div>
        </div>
      </div>
      
      {/* INSTRUCTIONS POUR MOBILE */}
      {showInstructions && (
        <div style={{
          width: '100%',
          maxWidth: '450px',
          padding: '1rem',
          borderRadius: '15px',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          fontSize: '1rem',
          textAlign: 'center',
          color: '#374151'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
            📱 Comment jouer ?
          </p>
          <p style={{ margin: 0 }}>
            Tracez avec votre doigt sur la forme colorée pour la couvrir au maximum avant la fin du temps !
          </p>
        </div>
      )}
      
      {/* CONTENEUR DU CANVAS */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '800px',
        aspectRatio: '1/1', // Ratio carré pour mobile
        border: `3px solid ${GUIDE_GRADIENT_START}`,
        borderRadius: '20px',
        overflow: 'hidden',
        touchAction: 'none',
        backgroundColor: '#ffffff',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <canvas ref={guideRef} style={{ position: 'absolute', inset: 0, touchAction: 'none' }} />
        <canvas ref={drawRef} style={{ position: 'absolute', inset: 0, touchAction: 'none' }} />
      </div>

      {/* BOUTON DÉMARRER */}
      <button
        onClick={startGame}
        disabled={running}
        style={{
          padding: '18px 36px',
          fontSize: '1.4rem',
          fontWeight: 'bold',
          cursor: running ? 'not-allowed' : 'pointer',
          borderRadius: '15px',
          border: 'none',
          color: 'white',
          background: running ? '#9ca3af' : `linear-gradient(90deg, ${GUIDE_GRADIENT_START}, ${GUIDE_GRADIENT_END})`,
          boxShadow: running ? 'none' : '0 4px 14px 0 rgba(220, 38, 38, 0.3)',
          transition: 'all 0.3s ease',
          width: '90%',
          maxWidth: '400px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {running ? `Tracé en cours (${timeLeft}s)` : '🚀 Démarrer un nouveau tracé'}
      </button>

      {/* PIED DE PAGE */}
      <div style={{
        width: '100%',
        textAlign: 'center',
        padding: '1rem',
        color: '#6b7280',
        fontSize: '0.9rem',
        marginTop: 'auto'
      }}>
        © 2023 Brico Ceram - 70 ans d'expertise
      </div>
    </div>
  );
}