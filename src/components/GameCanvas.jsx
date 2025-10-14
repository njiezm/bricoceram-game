import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GameCanvas({ player, savePlayer, dept, slug }) {
  const guideRef = useRef();
  const drawRef = useRef();
  const offRef = useRef(document.createElement('canvas'));
  const navigate = useNavigate();

  // --- ÉTATS DU JEU ---
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [coverage, setCoverage] = useState(0); 

  const SUCCESS_THRESHOLD = 0.7;
  const START_TIME = 30;
  const USER_LINE_RADIUS = 6;

  // --- RÉFÉRENCES (VARIABLES SYNCHRONES POUR LE CANVAS) ---
  const canvasStateRef = useRef({
    width: 0,
    height: 0,
    strokeMask: new Uint8Array(0),
    strokeTotal: 0,
    hitMask: new Uint8Array(0),
    overlapTotal: 0,
    scale: 1,
    // Références de tracé ajoutées pour gérer le mouvement
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
  
  // Fonction FINISH (similaire à votre fonction 'finish()')
  const finalRedirection = useCallback((finalRecall) => {
    if (isGameEndingRef.current) return;
    isGameEndingRef.current = true; // Empêche d'autres appels

    if (tickIdRef.current) {
      cancelAnimationFrame(tickIdRef.current);
      tickIdRef.current = null;
    }
    
    // Assure que l'état React est à jour
    const score = Math.round(finalRecall * 100);
    setCoverage(score);
    setRunning(false); // Met fin au jeu (débloque le bouton)

    savePlayer({ played: true });
    
    const urlPrefix = `/${dept}/${slug}/anniversaire`;
    
    // Le jeu se termine, on redirige en fonction du score final
    if (finalRecall >= SUCCESS_THRESHOLD) {
      navigate(`${urlPrefix}/win`, { state: { score } });
    } else {
      navigate(`${urlPrefix}/lose`, { state: { score } });
    }
  }, [navigate, savePlayer, dept, slug, SUCCESS_THRESHOLD]);

  // Fonction START GAME (appelée uniquement par le bouton)
  const startGame = useCallback(() => {
    // Si déjà en cours ou en train de finir, on ne fait rien
    if (running || isGameEndingRef.current) return; 

    // Réinitialisation de l'état
    setTimeLeft(START_TIME);
    setCoverage(0);
    isGameEndingRef.current = false; // Réinitialise le drapeau de fin
    setRunning(true);
    
    // Démarrage immédiat du temps (pour le useEffect timer)
    t0Ref.current = performance.now();
    
    // Nettoyage visuel et logique du canvas
    const state = canvasStateRef.current;
    const dctx = drawRef.current.getContext('2d');
    if (dctx) {
      dctx.clearRect(0, 0, state.width, state.height);
      dctx.lineCap = 'round'; // Réapplique le style
      dctx.lineJoin = 'round';
      dctx.strokeStyle = 'white';
      // Ajustement de la ligne utilisateur pour coller à l'exemple HTML (même si markHit l'écrasera)
      dctx.lineWidth = Math.max(4 * state.scale, 4); 
    }
    
    state.hitMask = new Uint8Array(state.width * state.height);
    state.overlapTotal = 0;
    state.userTotal = 0;
    state.drawing = false; // S'assurer qu'on ne dessine pas
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
      
      // Met à jour le temps restant UNIQUEMENT s'il a changé
      if (remain !== timeLeft) setTimeLeft(remain);
      
      if (remain > 0) {
        tickIdRef.current = requestAnimationFrame(tick);
      } else {
        // Fin du jeu par le temps
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

    if(player.dept === 'Guadeloupe') drawState.shape = 'candle';
    else drawState.shape = 'circle';

    // Les fonctions buildPath, renderGuide, resize et updateCoverage sont identiques

    function resize(){
      const rect = guide.parentElement.getBoundingClientRect();
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
      // On s'assure que le contexte est prêt pour le dessin
      dctx = draw.getContext('2d', { willReadFrequently: true }); 
      dctx.lineCap = 'round';
      dctx.lineJoin = 'round';
      dctx.strokeStyle = 'white';
      
      // Réinitialisation des masques après le redimensionnement (logique similaire à votre clearDraw)
      state.hitMask = new Uint8Array(state.width * state.height);
      state.overlapTotal = 0;
      state.userTotal = 0;
      dctx.clearRect(0, 0, state.width, state.height);
      setCoverage(0);
    }
    
    function buildPath(shape){
      const p = new Path2D();
      const cx = state.width/2, cy = state.height/2;
      const r = Math.min(state.width,state.height)*0.32;
      
      if(shape==='circle'){ p.arc(cx, cy, r, 0, Math.PI*2); return p; }
      if(shape==='candle'){
        const r2 = r;
        const w = r2*0.6, h = r2*1.6;
        const x0 = cx - w/2, y0 = cy - h/2;
        p.moveTo(x0, y0);
        p.lineTo(x0 + w, y0);
        p.lineTo(x0 + w, y0 + h);
        p.lineTo(x0, y0 + h);
        p.closePath();
        p.moveTo(cx, y0 - r2*0.15);
        p.quadraticCurveTo(cx + r2*0.18, y0 - r2*0.45, cx, y0 - r2*0.7);
        p.quadraticCurveTo(cx - r2*0.18, y0 - r2*0.45, cx, y0 - r2*0.15);
        return p;
      }
      return p;
    }

    function renderGuide(){
      state.strokeMask = new Uint8Array(state.width * state.height);
      state.strokeTotal = 0;
      
      // Utilise la tolérance de la prop pour le calcul de la ligne
      drawState.lineWidth = Math.max(2, Math.round(drawState.tolerance*2*state.scale)); 
      const path = buildPath(drawState.shape);
      
      // Dessin du guide (l'effet de flou et le dégradé)
      gctx.clearRect(0,0,state.width,state.height); gctx.save();
      gctx.strokeStyle = 'rgba(139,92,246,0.35)';
      gctx.lineWidth = drawState.lineWidth * 2.4;
      gctx.lineCap = 'round'; gctx.lineJoin = 'round'; 
      gctx.filter = 'blur(' + Math.round(8*state.scale) + 'px)'; // Ajout du filtre
      gctx.stroke(path); gctx.restore();
      
      gctx.save();
      const grad = gctx.createLinearGradient(0,0,state.width,0); // Ajout du dégradé
      grad.addColorStop(0,'#8b5cf6');
      grad.addColorStop(1,'#22c55e');
      gctx.strokeStyle = grad;
      gctx.lineWidth = drawState.lineWidth*0.75;
      gctx.lineCap = 'round'; gctx.lineJoin = 'round'; 
      gctx.stroke(path); gctx.restore();

      // Dessin du masque de frappe (sur le canvas off-screen)
      offctx.clearRect(0,0,state.width,state.height); 
      offctx.strokeStyle = '#ff0077';
      offctx.lineWidth = drawState.lineWidth; 
      offctx.lineCap = 'round'; offctx.lineJoin = 'round'; 
      offctx.stroke(path);
      
      // Lecture des pixels pour le masque de tracé
      const img = offctx.getImageData(0,0,state.width,state.height).data;
      for(let i=0;i<img.length;i+=4){
        const r = img[i];
        if(r>200){ 
          state.strokeMask[i/4] = 1; 
          state.strokeTotal++; 
        }
      }
    }
    
    function markHit(x,y){
      // Le rayon de détection est maintenant basé sur une valeur fixe (USER_LINE_RADIUS)
      const r = Math.max(USER_LINE_RADIUS * state.scale, USER_LINE_RADIUS); 
      
      // Simule la ligne par de multiples cercles pour un tracé continu
      dctx.beginPath(); dctx.moveTo(x,y); dctx.lineTo(x+0.01,y+0.01); dctx.stroke();

      // Utilisation d'un cercle transparent pour la zone de détection
      dctx.beginPath();
      dctx.arc(x,y,r,0,Math.PI*2);
      dctx.fillStyle='rgba(255,255,255,0.001)';
      dctx.fill();

      // Calcul des limites pour la boucle d'itération
      const xmin = Math.max(0, Math.floor(x - r)); const xmax = Math.min(state.width-1, Math.ceil(x + r));
      const ymin = Math.max(0, Math.floor(y - r)); const ymax = Math.min(state.height-1, Math.ceil(y + r));

      for(let yy=ymin;yy<=ymax;yy++){
        for(let xx=xmin;xx<=xmax;xx++){
          const dx = xx - x, dy = yy - y;
          if(dx*dx + dy*dy <= r*r){
            const idx = yy*state.width + xx;
            if(!state.hitMask[idx]){
              state.hitMask[idx]=1; 
              state.userTotal++;
              if(state.strokeMask[idx]) state.overlapTotal++;
            }
          }
        }
      }
    }
    
    function updateCoverage(){
      const recall = getCoverage(); 
      const pct = Math.round(recall*100);
      setCoverage(pct);
    }

    function posFromEvent(e){
      const rect = draw.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      // Conversion des coordonnées de la fenêtre aux coordonnées du canvas
      return { x:(clientX - rect.left)*state.scale, y:(clientY - rect.top)*state.scale };
    }

    // GESTIONNAIRES D'ÉVÉNEMENTS
    function onDown(e){
      // Ne démarre le tracé QUE si le jeu est en cours et pas en train de finir
      if (!running || isGameEndingRef.current) return; 
      
      state.drawing=true; // Utilise la référence pour un état synchrone
      const {x,y} = posFromEvent(e);
      state.lastX=x; state.lastY=y; 
      markHit(x,y);
      e.preventDefault();
    }

    function onMove(e){
      // Vérifie l'état 'drawing' synchrone dans la référence
      if(!state.drawing || !running || isGameEndingRef.current) return;
      
      const {x,y} = posFromEvent(e);
      
      // Interpolation des points comme dans votre exemple HTML pour un tracé lisse
      const dx = x - state.lastX, dy = y - state.lastY; 
      const dist = Math.hypot(dx,dy);
      const steps = Math.max(1, Math.floor(dist / (2*state.scale))); // 2*scale est une heuristique de distance min
      
      for(let i=1;i<=steps;i++){ 
        const t=i/steps; 
        const sx = state.lastX + dx*t; 
        const sy = state.lastY + dy*t; 
        // Dessine la ligne entre les deux points (pour le feedback visuel)
        dctx.beginPath(); dctx.moveTo(state.lastX,state.lastY); dctx.lineTo(sx,sy); dctx.stroke(); 
        markHit(sx,sy); 
      }
      
      state.lastX=x; state.lastY=y; 
      updateCoverage();
      e.preventDefault();
    }

    function onUp(e){
      // Si on n'était pas en train de dessiner, ou le jeu est déjà en train de finir, on ne fait rien
      if(!state.drawing || isGameEndingRef.current) return; 

      state.drawing = false; // Arrêt du tracé
      
      // Fin du jeu immédiate au relâchement
      const finalRecall = getCoverage();
      finalRedirect(finalRecall);
    }

    // ATTENTION: window.addEventListener est critique pour capter l'événement mouseup/touchend
    // même si l'utilisateur quitte le canvas.
    draw.addEventListener('mousedown',onDown);
    window.addEventListener('mousemove',onMove);
    window.addEventListener('mouseup',onUp);
    draw.addEventListener('touchstart',onDown,{passive:false});
    window.addEventListener('touchmove',onMove,{passive:false});
    window.addEventListener('touchend',onUp);
    
    // Ajout des événements de sortie de la zone pour coller à la mécanique
    draw.addEventListener('mouseleave', onUp); 
    window.addEventListener('touchcancel', onUp);

    resize();
    window.addEventListener('resize',resize);
    
    return () => {
      window.removeEventListener('resize',resize);
      draw.removeEventListener('mousedown',onDown);
      window.removeEventListener('mousemove',onMove);
      window.removeEventListener('mouseup',onUp);
      draw.removeEventListener('touchstart',onDown);
      window.removeEventListener('touchmove',onMove);
      window.removeEventListener('touchend',onUp);
      draw.removeEventListener('mouseleave', onUp);
      window.removeEventListener('touchcancel', onUp);
    };
  }, [player.dept, finalRedirection, getCoverage, running]); 
  
  // Le JSX reste le même, mais le bouton a maintenant la responsabilité de DÉMARRER
  return (
    <div style={{
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      gap:'1rem',
      padding:'1rem',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display:'flex',
        justifyContent: 'space-around',
        width: '100%',
        maxWidth: '400px',
        padding: '0.75rem 1rem', 
        borderRadius: '8px',
        backgroundColor: 'var(--bricoceram-light-gray)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        fontSize: '1.1rem', 
      }}>
        <div>Temps: <span style={{fontWeight:'bold', color: timeLeft <= 10 && running ? 'var(--bricoceram-red)' : 'var(--bricoceram-blue)'}}>{timeLeft}s</span></div>
        <div>Couverture: <span style={{fontWeight:'bold', color: coverage >= SUCCESS_THRESHOLD*100 ? 'green' : 'var(--bricoceram-blue)'}}>{coverage}%</span></div>
      </div>
      <div style={{position:'relative',width:'90vw',maxWidth:'600px',aspectRatio:'16/9',border:'2px solid var(--bricoceram-blue)',borderRadius:'16px', overflow: 'hidden'}}>
        <canvas ref={guideRef} style={{position:'absolute',inset:0, touchAction: 'none'}} />
        <canvas ref={drawRef} style={{position:'absolute',inset:0, touchAction: 'none'}} />
      </div>
      <button
        onClick={startGame}
        disabled={running}
        style={{padding:'12px 24px', fontSize:'1.1rem', fontWeight:'bold', cursor: running ? 'not-allowed' : 'pointer'}}
      >
        {running ? `Tracé en cours (${timeLeft}s)` : 'Démarrer un nouveau tracé'}
      </button>
    </div>
  );
}