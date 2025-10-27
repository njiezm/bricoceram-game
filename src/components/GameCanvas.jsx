import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// --- CONFIGURATION ---
const defaultConfig = {
    branding: {
        headerImage: "./images/header.png",
        headerImage971: "./images/headergpe.png",
        headerImage972: "./images/header.png",
        headerImage973: "./images/headerguy.png",
        accrocheImage: "./images/text_consigne_video.png",
        accrocheImage971: "./images/text_consigne_video.png",
        accrocheImage972: "./images/text_consigne_video.png",
        accrocheImage973: "./images/text_consigne_video.png",
        accrocheImage2: "./images/text_consigne.png",
        accrocheImage2_971: "./images/bloc_consigne_gpeguy.png",
        accrocheImage2_972: "./images/BlocConsigneMQ.png",
        accrocheImage2_973: "./images/bloc_consigne_gpeguy.png",
        footerImage: "./images/Footer_brico.png",
        backgroundImage: "",
        instructionVideo: "./videos/videotest.mp4",
        instructionVideo971: "./videos/videotest.mp4",
        instructionVideo972: "./videos/videotest.mp4",
        instructionVideo973: "./videos/videotest.mp4",
    },
    theme: {
        primaryColor: '#8B4513',
        accentColor: '#D2691E',
        accentColorDark: '#A0522D',
        goldColor: '#C0C0C0',
        white: '#F5F5DC',
        workshopGray: '#E0E0E0',
        darkWood: '#654321',
    },
    game: {
        startTime: 30,
        successThreshold: 0.80,
        userLineRadius: 8,
        guideTolerance: 15,
        jigsawAmplitude: 2.5,
        precisionTargetPoints: 400,
    }
};

// --- CONSTANTES DE COULEURS ---
const GUIDE_BLUR_COLOR = 'rgba(160, 82, 45, 0.3)';
const GUIDE_GRADIENT_START = '#A0522D';
const GUIDE_GRADIENT_END = '#D2691E';
const USER_STROKE_COLOR = '#F5DEB3';
const BG_COLOR = '#F5F5DC';
const ACCENT_COLOR = '#D2691E';
const GOLD_COLOR = '#C0C0C0';
const GOLD_LIGHT = '#F0F8FF';

// --- COULEURS POUR LES COPEAUX DE BOIS ---
const WOOD_CHIP_COLORS = [
  '#8B4513', '#A0522D', '#CD853F', '#DEB887', '#D2691E', '#BC8F8F', '#DAA520'
];

// --- DIMENSIONS ET CHEMINS SVG ---
const SVG_WIDTH = 1066;
const SVG_HEIGHT = 1604;

// --- GÂTEAU (pour 972) ---
const CAKE_CANDLE_PATH = "M501.801 282.002L563 282C563 282 562.75 284.426 563 286.717V360.42C562.688 362.978 561.593 364.755 556.659 365L503.03 364.991C499.37 364.779 497.388 363.416 497.001 361.353V285.595C497.125 283.938 497 282.002 497 282.002H501.801Z";
const CAKE_CANDLE_COLOR = "#D0187A";
const CAKE_FLAME_PATH = "M529.649 27C549.221 58.0981 568.699 91.0845 583.369 125.42C601.342 167.5 617.229 215.592 586.973 256.222C559.395 293.254 502.175 295.22 474.017 258.2C444.248 219.061 459.08 169.478 475.929 127.989C490.297 92.6259 510.031 58.9844 529.649 27Z";
const CAKE_FLAME_COLOR = "#FFD100";
const CAKE_FLAME_INNER_PATH = "M528.956 157C541.072 172.429 553.13 188.794 562.212 205.828C573.337 226.706 583.172 250.565 564.442 270.722C547.37 289.095 511.948 290.07 494.517 271.704C476.089 252.286 485.271 227.687 495.701 207.103C504.596 189.559 516.812 172.868 528.956 157Z";
const CAKE_FLAME_INNER_COLOR = "#F1A32C";
const CAKE_BODY_PATH = "M432.999 364.754L629.518 364.495C645.918 366.115 648.841 379.333 649.728 393.114V836.45C648.623 851.839 644.744 862.526 627.273 864L437.349 863.944C424.39 862.673 417.37 854.472 416 842.063V386.364C416.437 376.397 422.929 367.116 433.011 364.742L432.999 364.754Z";
const CAKE_BODY_COLOR = "#D0187A";
const CAKE_BOTTOM_PATH = "M121.28 863.875H945.225C987.088 871.241 1016.72 909.377 1019.84 950.802C1022.1 981.035 1018.22 1014.29 1019.49 1044.85L1016.59 1047.71C1007.59 1047.96 998.74 1049.69 990.087 1051.98C928.937 1068.17 910.189 1127.52 836.347 1120.83C761.737 1114.06 740.623 1037.58 644.341 1048.54C577.211 1056.17 553.309 1114.77 495.505 1120.85C403.415 1130.52 389.204 1038.52 286.173 1048.04C213.523 1054.75 185.468 1132.72 107.761 1120.62C85.4743 1117.16 64.168 1094.71 47.0922 1081.29L46.7461 947.052C51.9188 905.916 79.3978 871.318 121.26 863.875H121.28Z";
const CAKE_BOTTOM_COLOR = "#C11A73";
const CAKE_OUTLINE_PATH = "M46.4777 1081.29L46.5292 1081.33L46.4713 1078.82L46.1315 947.052C51.3043 905.916 78.7832 871.318 120.646 863.875H410H465.5L465.5 399.39C465.872 389.816 471.391 380.88 479.962 378.596L480.016 378.5L518.673 378.5V284C509.569 282.15 500.822 277.911 493.276 271.217C492.436 270.471 491.61 269.824 490.8 269.189C487.961 266.965 485.318 264.895 482.929 259.272C473 226.5 474 209.796 482.929 169C495.072 134.949 511.75 102.556 528.329 71.7585C544.87 101.703 561.331 133.465 573.729 166.526C588.532 206 588 224 578.391 257.367C576.502 261.818 574.109 263.999 571.608 266.279C570.945 266.883 570.273 267.496 569.602 268.159C561.634 276.027 552.128 281.191 542.186 283.566V378.5L577.189 379.151L580.969 379.221L583.969 379.242L584 379.246C597.921 380.829 600.413 392.637 601.157 405.882V863.875H655H655.785H944.61C986.473 871.241 1016.11 909.358 1019.22 950.802C1020.46 967.263 1019.87 984.623 1019.28 1001.95L1019.23 1003.43L1019.19 1004.55L1019.16 1005.62C1019.14 1006.13 1019.12 1006.64 1019.11 1007.15C1018.71 1019.27 1018.4 1031.33 1018.8 1043.01L1018.82 1044.9L1018.87 1044.85L1019.12 1094.16L1019.11 1094.16L1019.12 1096.73V1468.25C1019.12 1507.06 989.261 1545.47 951.841 1554.81C780.763 1558.95 609.158 1558.33 437.567 1557.71L427.424 1557.68L418.382 1557.64L418.03 1557.64L417.962 1557.64L417.524 1557.64L417.009 1557.64L407.332 1557.6L406.613 1557.6L406.244 1557.6L405.778 1557.6L405.013 1557.6L398.359 1557.57C306.871 1557.26 215.393 1557.05 124.011 1557.66C93.7245 1556.95 48.0353 1517.95 48.0353 1487.48V1146.6L47.22 1111.27L46.4777 1081.29Z";

// --- BOUGIE (pour 971 et 973) ---
const CANDLE_CANDLE_PATH_2 = "M231.192 539.61L277.628 539.607C277.628 539.607 277.438 542.967 277.628 546.139V648.213C277.392 651.756 276.561 654.217 272.817 654.556L232.124 654.543C229.347 654.251 227.843 652.363 227.55 649.506V544.585C227.643 542.291 227.549 539.61 227.549 539.61H231.192Z";
const CANDLE_CANDLE_COLOR_2 = "#D0187A";
const CANDLE_FLAME_PATH_2 = "M252.4 81.0339C287.404 136.601 322.242 195.541 348.48 256.892C380.624 332.083 409.037 418.015 354.925 490.612C305.6 556.783 203.261 560.294 152.9 494.147C99.6581 424.212 126.186 335.617 156.32 261.483C182.018 198.296 217.313 138.184 252.4 81.0339Z";
const CANDLE_FLAME_COLOR_2 = "#FFD100";
const CANDLE_FLAME_INNER_PATH_2 = "M251.696 314.034C273.366 341.611 294.932 370.863 311.174 401.31C331.073 438.627 348.662 481.274 315.164 517.303C284.63 550.142 221.277 551.885 190.101 519.057C157.142 484.349 173.564 440.381 192.218 403.588C208.127 372.23 229.976 342.397 251.696 314.034Z";
const CANDLE_FLAME_INNER_COLOR_2 = "#F1A32C";
const CANDLE_BODY_PATH_2 = "M79.7359 654.591L430.817 654.129C460.117 657.022 465.339 680.632 466.922 705.246V1497.1C464.948 1524.58 458.019 1543.67 426.808 1546.3L87.508 1546.2C64.3562 1543.93 51.814 1529.29 49.3672 1507.12V693.19C50.1485 675.387 61.745 658.81 79.7565 654.571L79.7359 654.591Z";
const CANDLE_BODY_COLOR_2 = "#D0187A";
const CANDLE_OUTLINE_PATH_2 = "M219.247 28.1858C245.208 -8.49673 257.139 -9.94416 283.45 27.1975C340.639 107.959 431.03 280.278 436.132 382.723C440.47 469.629 400.07 543.265 335.261 578.21V604.396H434.95C473.482 604.396 510.451 646.109 514.09 681.775C518.146 721.588 516.718 769.111 515.344 814.858C514.614 839.136 513.9 862.915 514.028 884.776C514.205 914.426 514.39 944.138 514.576 973.893C515.538 1128.05 516.508 1283.35 516.249 1437.18C516.24 1442.27 516.272 1447.39 516.304 1452.52C516.713 1518.72 517.128 1586.07 430.57 1596.74C379.199 1594.76 326.607 1596.07 274.008 1597.38C214.649 1598.86 155.28 1600.34 97.6455 1597.1C40.1155 1593.86 7.17585 1566.62 0 1509.67L0.103516 689.831C1.04954 651.474 40.7114 604.396 81.2783 604.396H174.929V581.915C109.694 549.417 66.5452 473.137 69.7959 389.615C73.8073 286.297 161.688 109.568 219.247 28.1858";


export default function GameCanvas({ player, savePlayer, dept, slug, config: userConfig = {} }) {
  const guideRef = useRef();
  const drawRef = useRef();
  const particleCanvasRef = useRef();
  
  const particlesRef = useRef([]);
  const animationIdRef = useRef(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const urlSlug = location.state?.urlSlug || localStorage.getItem("url_slug");

  const config = useMemo(() => ({
      ...defaultConfig,
      ...userConfig,
      theme: { ...defaultConfig.theme, ...userConfig.theme },
      game: { ...defaultConfig.game, ...userConfig.game } 
  }), [userConfig]);

  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.game.startTime); 
  const [coverage, setCoverage] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showVideoInstructions, setShowVideoInstructions] = useState(true);
  const [shapeError, setShapeError] = useState('');
  const [isSawing, setIsSawing] = useState(false);

  const canvasStateRef = useRef({
    width: 0, height: 0, scale: 1,
    drawing: false, lastX: 0, lastY: 0,
    scaleFactor: 1, translateX: 0, translateY: 0,
  });
  const userPathPointsRef = useRef([]);
  const guidePathRef = useRef(null);
  const guidePointsRef = useRef([]);
  const isDrawingPathRef = useRef(false);
  const totalPathLengthRef = useRef(0);
  const tracedLengthRef = useRef(0);
  const userPathRef = useRef(null);
  
  const coveredSegmentsRef = useRef(new Set());
  const guideSegmentLengthsRef = useRef([]);

  const tickIdRef = useRef(null);
  const t0Ref = useRef(null);
  const isGameEndingRef = useRef(false);

  const getHeaderImage = useCallback(() => {
    const deptCode = player.dept || '';
    if (deptCode === '971') return config.branding.headerImage971;
    if (deptCode === '972') return config.branding.headerImage972;
    if (deptCode === '973') return config.branding.headerImage973;
    return config.branding.headerImage;
  }, [config.branding, player.dept]);

  const getAccrocheImage = useCallback(() => {
    const deptCode = player.dept || '';
    if (deptCode === '971') return config.branding.accrocheImage971;
    if (deptCode === '972') return config.branding.accrocheImage972;
    if (deptCode === '973') return config.branding.accrocheImage973;
    return config.branding.accrocheImage;
  }, [config.branding, player.dept]);

  const getAccrocheImage2 = useCallback(() => {
    const deptCode = player.dept || '';
    if (deptCode === '971') return config.branding.accrocheImage2_971;
    if (deptCode === '972') return config.branding.accrocheImage2_972;
    if (deptCode === '973') return config.branding.accrocheImage2_973;
    return config.branding.accrocheImage2;
  }, [config.branding, player.dept]);

  const getInstructionVideo = useCallback(() => {
    const deptCode = player.dept || '';
    if (deptCode === '971') return config.branding.instructionVideo971;
    if (deptCode === '972') return config.branding.instructionVideo972;
    if (deptCode === '973') return config.branding.instructionVideo973;
    return config.branding.instructionVideo;
  }, [config.branding, player.dept]);

  useEffect(() => {
    audioRef.current = new Audio('/jigsaw2.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };
  }, []);

  class WoodChip {
    constructor(x, y) {
      this.x = x; this.y = y; this.size = Math.random() * 5 + 4; 
      this.speedX = (Math.random() - 0.5) * 5; this.speedY = Math.random() * -5 - 2;
      this.gravity = 0.15; this.opacity = 1;
      this.color = WOOD_CHIP_COLORS[Math.floor(Math.random() * WOOD_CHIP_COLORS.length)];
      this.rotation = Math.random() * Math.PI * 2; this.rotationSpeed = (Math.random() - 0.5) * 0.3;
    }
    update() { this.x += this.speedX; this.y += this.speedY; this.speedY += this.gravity; this.opacity -= 0.008; this.rotation += this.rotationSpeed; return this.opacity > 0; }
    draw(ctx) { ctx.save(); ctx.globalAlpha = this.opacity; ctx.translate(this.x, y); ctx.rotate(this.rotation); ctx.fillStyle = this.color; ctx.fillRect(-this.size, -this.size/2, this.size * 2, this.size); ctx.restore(); }
  }

  const animateParticles = useCallback(() => {
    const pCanvas = particleCanvasRef.current; if (!pCanvas) return;
    const pctx = pCanvas.getContext('2d'); pctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    particlesRef.current = particlesRef.current.filter(particle => { const alive = particle.update(); if (alive) particle.draw(pctx); return alive; });
    if (particlesRef.current.length > 0) { animationIdRef.current = requestAnimationFrame(animateParticles); } else { animationIdRef.current = null; }
  }, []);

  const createWoodChips = useCallback((x, y, count = 5) => {
    for (let i = 0; i < count; i++) particlesRef.current.push(new WoodChip(x, y));
    if (!animationIdRef.current) animationIdRef.current = requestAnimationFrame(animateParticles);
  }, [animateParticles]);

  const updateProgress = useCallback(() => {
    const userPoints = userPathPointsRef.current;
    const guidePoints = guidePointsRef.current;
    const segmentLengths = guideSegmentLengthsRef.current;
    
    if (!userPoints || userPoints.length === 0 || !guidePoints || guidePoints.length === 0 || segmentLengths.length === 0) {
      return;
    }
    
    const tolerance = config.game.guideTolerance * canvasStateRef.current.scale;
    
    const startIndex = Math.max(0, userPoints.length - 20);
    
    for (let i = startIndex; i < userPoints.length; i++) {
        const userPoint = userPoints[i];
        
        for (let j = 0; j < guidePoints.length; j++) {
            const guidePoint = guidePoints[j];
            const dx = userPoint.x - guidePoint.x;
            const dy = userPoint.y - guidePoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= tolerance) {
                if (j > 0) {
                    coveredSegmentsRef.current.add(j - 1);
                }
                break;
            }
        }
    }
    
    let coveredLength = 0;
    for (const segmentIndex of coveredSegmentsRef.current) {
        coveredLength += segmentLengths[segmentIndex] || 0;
    }
    
    const totalLength = segmentLengths.reduce((sum, length) => sum + length, 0);
    
    const precision = totalLength > 0 ? (coveredLength / totalLength) * 100 : 0;
    
    setCoverage(prev => {
        const newPrecision = Math.round(precision);
        return Math.min(100, Math.max(prev, newPrecision));
    });
  }, [config.game.guideTolerance]);

  const API_BASE = import.meta.env.VITE_API_BASE;
  const API_KEY = import.meta.env.VITE_API_KEY;
  
  const finalRedirection = useCallback(async () => {
    console.group('🏁 finalRedirection');
    if (isGameEndingRef.current) { console.log('Game is already ending. Aborting.'); console.groupEnd(); return; }
    isGameEndingRef.current = true;
    console.log(`Final score: ${coverage}%`);
    if (tickIdRef.current) { cancelAnimationFrame(tickIdRef.current); tickIdRef.current = null; }
    if (animationIdRef.current) { cancelAnimationFrame(animationIdRef.current); animationIdRef.current = null; }
    if (audioRef.current && !audioRef.current.paused) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    setIsSawing(false);
    
    const finalPrecision = coverage / 100;
    const score = coverage;
    const hasWon = finalPrecision >= config.game.successThreshold;
    console.log(`Player won: ${hasWon}`);
    
    setRunning(false);
    savePlayer({ played: true });

    if (!urlSlug) {
        console.error("Erreur critique : le url_slug du participant est manquant. Impossible d'envoyer le résultat.");
        navigate('/bricoceram/anniversaire70ans/erreur');
        console.groupEnd();
        return;
    }

    const payload = { url_slug: urlSlug, key_api: API_KEY, win: hasWon };
    try { await fetch(`${API_BASE}/api/save/result-skillgames`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); } catch (err) { console.error('Erreur API:', err); }
    if (hasWon) { navigate('/bricoceram/anniversaire70ans/game/win', { state: { score } }); } else { navigate('/bricoceram/anniversaire70ans/game/lose', { state: { score } }); }
    console.groupEnd();
  }, [navigate, savePlayer, config.game.successThreshold, urlSlug, coverage]); 

  const startGame = useCallback(() => {
    if (running || isGameEndingRef.current || shapeError) { return; }
    setShowInstructions(false); setTimeLeft(config.game.startTime); setCoverage(0); isGameEndingRef.current = false; setRunning(true);
    
    tracedLengthRef.current = 0; isDrawingPathRef.current = false;
    coveredSegmentsRef.current = new Set();
    
    particlesRef.current = []; if (animationIdRef.current) { cancelAnimationFrame(animationIdRef.current); animationIdRef.current = null; }
    const pCanvas = particleCanvasRef.current; if(pCanvas) { const pctx = pCanvas.getContext('2d'); pctx.clearRect(0, 0, pCanvas.width, pCanvas.height); }
    t0Ref.current = performance.now();
    const state = canvasStateRef.current;
    const dctx = drawRef.current.getContext('2d');
    if (dctx) { 
      dctx.lineCap = 'round'; dctx.lineJoin = 'round'; dctx.strokeStyle = USER_STROKE_COLOR; 
      dctx.lineWidth = Math.max(config.game.userLineRadius * state.scale * 0.8, 12);
      userPathRef.current = new Path2D();
    }
    userPathPointsRef.current = []; state.drawing = false;
  }, [running, config.game.startTime, config.game.userLineRadius, shapeError]); 

  const goToGame = useCallback(() => setShowVideoInstructions(false), []);

  useEffect(() => {
    if (!running || isGameEndingRef.current) { if (tickIdRef.current) { cancelAnimationFrame(tickIdRef.current); tickIdRef.current = null; } return; }
    const total = config.game.startTime; 
    function tick(now) { 
      if (!t0Ref.current) t0Ref.current = performance.now(); 
      const elapsed = Math.floor((now - t0Ref.current) / 1000); 
      const remain = Math.max(0, total - elapsed); 
      if (remain !== timeLeft) { setTimeLeft(remain); }
      if (remain > 0) { tickIdRef.current = requestAnimationFrame(tick); } else { finalRedirection(); } 
    }
    tickIdRef.current = requestAnimationFrame(tick);
    return () => { if (tickIdRef.current) { cancelAnimationFrame(tickIdRef.current); tickIdRef.current = null; } };
  }, [running, finalRedirection, timeLeft, config.game.startTime]);

  const extractOutlinePoints = useCallback((pathString, scaleFactor, translateX, translateY, numPoints = 400) => {
    const points = [];
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    svg.setAttribute('width', SVG_WIDTH);
    svg.setAttribute('height', SVG_HEIGHT);
    path.setAttribute('d', pathString);
    
    svg.appendChild(path);
    document.body.appendChild(svg);
    
    const pathLength = path.getTotalLength();
    if (pathLength === 0) {
        document.body.removeChild(svg);
        return [];
    }

    const segmentLengths = [];
    let lastPoint = null;

    for (let i = 0; i <= numPoints; i++) {
        const length = (i / numPoints) * pathLength;
        const point = path.getPointAtLength(length);
        
        const transformedPoint = {
            x: point.x * scaleFactor + translateX,
            y: point.y * scaleFactor + translateY
        };
        points.push(transformedPoint);

        if (lastPoint) {
            const dx = transformedPoint.x - lastPoint.x;
            const dy = transformedPoint.y - lastPoint.y;
            segmentLengths.push(Math.sqrt(dx * dx + dy * dy));
        }
        lastPoint = transformedPoint;
    }
    
    guideSegmentLengthsRef.current = segmentLengths;
    document.body.removeChild(svg);
    return points;
  }, []);

  const eventHandlersRef = useRef({ onDown: null, onMove: null, onUp: null });

  const redrawUserPath = useCallback(() => {
    const draw = drawRef.current; if (!draw) return;
    const dctx = draw.getContext('2d'); if (!dctx || !userPathRef.current) return;
    const state = canvasStateRef.current;
    dctx.clearRect(0, 0, state.width, state.height);
    dctx.save();
    dctx.lineCap = 'round'; dctx.lineJoin = 'round'; dctx.strokeStyle = USER_STROKE_COLOR; 
    dctx.lineWidth = Math.max(config.game.userLineRadius * state.scale * 0.8, 12);
    dctx.stroke(userPathRef.current);
    dctx.restore();
  }, [config.game.userLineRadius]);

  useEffect(() => {
    const guide = guideRef.current; const draw = drawRef.current; const pCanvas = particleCanvasRef.current;
    const state = canvasStateRef.current;
    if (!guide || !draw || !pCanvas) return;
    
    const devicePixelRatio = window.devicePixelRatio || 1;
    let gctx = guide.getContext('2d'); let dctx = draw.getContext('2d', { willReadFrequently: true }); let pctx = pCanvas.getContext('2d');
    
    const drawState = { tolerance: config.game.guideTolerance, lineWidth: 15, shape: '' };
    
    const deptCode = player.dept || '';
    if (['972', '971', '973'].includes(deptCode)) { 
      if (deptCode === '972') drawState.shape = 'cake'; else drawState.shape = 'candle'; 
      setShapeError(''); 
    } else { 
      drawState.shape = ''; const errorMsg = `Le département "${deptCode}" ne supporte pas un tracé personnalisé.`;
      setShapeError(errorMsg);
    }

    function buildPath(shape) {
      if (shape === 'candle') return new Path2D(CANDLE_OUTLINE_PATH_2);
      if (shape === 'cake') return new Path2D(CAKE_OUTLINE_PATH);
      return new Path2D();
    }

    function resize() {
      if (!drawState.shape) { return; }
      const canvasWrapper = draw.parentElement; 
      const { width: wrapperWidth, height: wrapperHeight } = canvasWrapper.getBoundingClientRect();
      const rect = { width: Math.min(wrapperWidth, 500), height: Math.min(wrapperHeight, 500) };
      state.width = Math.floor(rect.width * devicePixelRatio); state.height = Math.floor(rect.height * devicePixelRatio); state.scale = devicePixelRatio;
      
      [guide, draw, pCanvas].forEach(cv => { if (!cv) return; cv.width = state.width; cv.height = state.height; cv.style.width = rect.width + 'px'; cv.style.height = rect.height + 'px'; });
      
      renderGuide();
      dctx = draw.getContext('2d', { willReadFrequently: true }); dctx.lineCap = 'round'; dctx.lineJoin = 'round'; dctx.strokeStyle = USER_STROKE_COLOR; dctx.lineWidth = Math.max(config.game.userLineRadius * state.scale * 0.8, 12);
      if (userPathRef.current) { redrawUserPath(); } else { dctx.clearRect(0, 0, state.width, state.height); }
      if(pctx) pctx.clearRect(0, 0, state.width, state.height); 
    }

    function renderGuide() {
      if (!drawState.shape || !gctx) { return; }
      const path = buildPath(drawState.shape);

      const svgAspectRatio = SVG_WIDTH / SVG_HEIGHT;
      const canvasAspectRatio = state.width / state.height;
      let scaleFactor;
      if (svgAspectRatio > canvasAspectRatio) { scaleFactor = state.width / SVG_WIDTH; } else { scaleFactor = state.height / SVG_HEIGHT; }
      // --- MODIFICATION : Agrandissement de l'élément pour un meilleur centrage visuel ---
      scaleFactor *= 0.95; // Augmenté de 0.9 à 0.95
      const translateX = (state.width - SVG_WIDTH * scaleFactor) / 2;
      const translateY = (state.height - SVG_HEIGHT * scaleFactor) / 2;

      state.scaleFactor = scaleFactor; state.translateX = translateX; state.translateY = translateY;

      const bgImg = new Image();
      bgImg.src = './images/Fdplancheenbois.png';
      
      const drawBackground = function() {
        gctx.clearRect(0, 0, state.width, state.height);
        gctx.save();
        gctx.drawImage(bgImg, 0, 0, state.width, state.height);
        gctx.restore();
      };
      
      if (bgImg.complete) {
        drawBackground();
      } else {
        bgImg.onload = function() {
          drawBackground();
          gctx.save();
          gctx.translate(translateX, translateY);
          gctx.scale(scaleFactor, scaleFactor);
          
          if (drawState.shape === 'cake') {
            gctx.fillStyle = CAKE_BODY_COLOR; gctx.fill(new Path2D(CAKE_BODY_PATH));
            gctx.fillStyle = CAKE_BOTTOM_COLOR; gctx.fill(new Path2D(CAKE_BOTTOM_PATH));
            gctx.fillStyle = CAKE_FLAME_COLOR; gctx.fill(new Path2D(CAKE_FLAME_PATH));
            gctx.fillStyle = CAKE_FLAME_INNER_COLOR; gctx.fill(new Path2D(CAKE_FLAME_INNER_PATH));
            gctx.fillStyle = CAKE_CANDLE_COLOR; gctx.fill(new Path2D(CAKE_CANDLE_PATH));
          } else if (drawState.shape === 'candle') {
            gctx.fillStyle = CANDLE_BODY_COLOR_2; gctx.fill(new Path2D(CANDLE_BODY_PATH_2));
            gctx.fillStyle = CANDLE_CANDLE_COLOR_2; gctx.fill(new Path2D(CANDLE_CANDLE_PATH_2));
            gctx.fillStyle = CANDLE_FLAME_COLOR_2; gctx.fill(new Path2D(CANDLE_FLAME_PATH_2));
            gctx.fillStyle = CANDLE_FLAME_INNER_COLOR_2; gctx.fill(new Path2D(CANDLE_FLAME_INNER_PATH_2));
          }
          gctx.restore();
          
          gctx.save();
          gctx.translate(translateX, translateY);
          gctx.scale(scaleFactor, scaleFactor);
          const grad = gctx.createLinearGradient(0, 0, SVG_WIDTH, 0); grad.addColorStop(0, GUIDE_GRADIENT_START); grad.addColorStop(1, GUIDE_GRADIENT_END);
          gctx.strokeStyle = grad; gctx.lineWidth = drawState.lineWidth * 1.5 / scaleFactor;
          gctx.lineCap = 'round'; gctx.lineJoin = 'round'; gctx.stroke(path);
          gctx.restore();
        };
      }

      const pathString = drawState.shape === 'cake' ? CAKE_OUTLINE_PATH : CANDLE_OUTLINE_PATH_2;
      guidePointsRef.current = extractOutlinePoints(pathString, scaleFactor, translateX, translateY);
      totalPathLengthRef.current = guideSegmentLengthsRef.current.reduce((sum, len) => sum + len, 0) * scaleFactor;

      if (bgImg.complete) {
        drawBackground();
      }

      gctx.save();
      gctx.translate(translateX, translateY);
      gctx.scale(scaleFactor, scaleFactor);
      
      if (drawState.shape === 'cake') {
        gctx.fillStyle = CAKE_BODY_COLOR; gctx.fill(new Path2D(CAKE_BODY_PATH));
        gctx.fillStyle = CAKE_BOTTOM_COLOR; gctx.fill(new Path2D(CAKE_BOTTOM_PATH));
        gctx.fillStyle = CAKE_FLAME_COLOR; gctx.fill(new Path2D(CAKE_FLAME_PATH));
        gctx.fillStyle = CAKE_FLAME_INNER_COLOR; gctx.fill(new Path2D(CAKE_FLAME_INNER_PATH));
        gctx.fillStyle = CAKE_CANDLE_COLOR; gctx.fill(new Path2D(CAKE_CANDLE_PATH));
      } else if (drawState.shape === 'candle') {
        gctx.fillStyle = CANDLE_BODY_COLOR_2; gctx.fill(new Path2D(CANDLE_BODY_PATH_2));
        gctx.fillStyle = CANDLE_CANDLE_COLOR_2; gctx.fill(new Path2D(CANDLE_CANDLE_PATH_2));
        gctx.fillStyle = CANDLE_FLAME_COLOR_2; gctx.fill(new Path2D(CANDLE_FLAME_PATH_2));
        gctx.fillStyle = CANDLE_FLAME_INNER_COLOR_2; gctx.fill(new Path2D(CANDLE_FLAME_INNER_PATH_2));
      }
      gctx.restore();
      
      gctx.save();
      gctx.translate(translateX, translateY);
      gctx.scale(scaleFactor, scaleFactor);
      const grad = gctx.createLinearGradient(0, 0, SVG_WIDTH, 0); grad.addColorStop(0, GUIDE_GRADIENT_START); grad.addColorStop(1, GUIDE_GRADIENT_END);
      gctx.strokeStyle = grad; gctx.lineWidth = drawState.lineWidth * 1.5 / scaleFactor;
      gctx.lineCap = 'round'; gctx.lineJoin = 'round'; gctx.stroke(path);
      gctx.restore();
    }

    function posFromEvent(e) { 
      const rect = draw.getBoundingClientRect(); 
      const clientX = e.touches ? e.touches[0].clientX : e.clientX; 
      const clientY = e.touches ? e.touches[0].clientY : e.clientY; 
      return { x: (clientX - rect.left) * state.scale, y: (clientY - rect.top) * state.scale }; 
    }
    
    eventHandlersRef.current.onDown = function onDown(e) { 
      if (!running || isGameEndingRef.current || !drawState.shape) { return; }
      state.drawing = true; isDrawingPathRef.current = true;
      const { x, y } = posFromEvent(e); state.lastX = x; state.lastY = y;
      userPathPointsRef.current.push({ x, y });
      if (!userPathRef.current) { userPathRef.current = new Path2D(); }
      userPathRef.current.moveTo(x, y);
      const dctx = draw.getContext('2d', { willReadFrequently: true });
      if(dctx) { dctx.beginPath(); dctx.moveTo(x, y); }
      createWoodChips(x, y, 10); setIsSawing(true); 
      if (audioRef.current) { audioRef.current.play().catch(error => console.error("Audio playback failed:", error)); } 
      e.preventDefault();
    };
    
    eventHandlersRef.current.onMove = function onMove(e) {
      if (!state.drawing || !running || isGameEndingRef.current || !drawState.shape) { return; }
      const { x, y } = posFromEvent(e); const dx = x - state.lastX, dy = y - state.lastY; const dist = Math.hypot(dx, dy); 
      if (dist < 3) { return; }
      if (userPathRef.current) { userPathRef.current.lineTo(x, y); }
      const dctx = draw.getContext('2d', { willReadFrequently: true });
      if(dctx && isDrawingPathRef.current) { dctx.lineTo(x, y); dctx.stroke(); }
      const steps = Math.max(1, Math.floor(dist / 5));
      for (let i = 0; i <= steps; i++) { const t = i / steps; const px = state.lastX + dx * t; const py = state.lastY + dy * t; userPathPointsRef.current.push({ x: px, y: py }); }
      state.lastX = x; state.lastY = y;
      updateProgress();
      if (Math.random() > 0.7) { createWoodChips(x, y, 2); }
      e.preventDefault();
    };
    
    eventHandlersRef.current.onUp = function onUp(e) { 
      if (!state.drawing || isGameEndingRef.current || !drawState.shape) { return; }
      state.drawing = false; isDrawingPathRef.current = false; setIsSawing(false); 
      if (audioRef.current && !audioRef.current.paused) { audioRef.current.pause(); audioRef.current.currentTime = 0; } 
      finalRedirection(); 
    };

    resize();
    
    if (drawState.shape) { 
      draw.addEventListener('mousedown', eventHandlersRef.current.onDown); window.addEventListener('mousemove', eventHandlersRef.current.onMove); window.addEventListener('mouseup', eventHandlersRef.current.onUp); 
      draw.addEventListener('touchstart', eventHandlersRef.current.onDown, { passive: false }); window.addEventListener('touchmove', eventHandlersRef.current.onMove, { passive: false }); 
      window.addEventListener('touchend', eventHandlersRef.current.onUp); draw.addEventListener('mouseleave', eventHandlersRef.current.onUp); window.addEventListener('touchcancel', eventHandlersRef.current.onUp); 
      window.addEventListener('resize', resize); 
    }
    
    return () => { 
      window.removeEventListener('resize', resize); draw.removeEventListener('mousedown', eventHandlersRef.current.onDown); window.removeEventListener('mousemove', eventHandlersRef.current.onMove); window.removeEventListener('mouseup', eventHandlersRef.current.onUp); 
      draw.removeEventListener('touchstart', eventHandlersRef.current.onDown); window.removeEventListener('touchmove', eventHandlersRef.current.onMove); window.removeEventListener('touchend', eventHandlersRef.current.onUp); 
      draw.removeEventListener('mouseleave', eventHandlersRef.current.onUp); draw.removeEventListener('touchcancel', eventHandlersRef.current.onUp); 
      if (animationIdRef.current) { cancelAnimationFrame(animationIdRef.current); animationIdRef.current = null; }
    }; 
  }, [player.dept, config.game.userLineRadius, config.game.guideTolerance, extractOutlinePoints, createWoodChips, updateProgress, finalRedirection, running, redrawUserPath]);

  const cssStyles = useMemo(() => `
    html, body { margin: 0; padding: 0; height: 100%; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .punch-wrapper { display: flex; justify-content: center; align-items: flex-start; background-color: #3d2817; min-height: 100vh; }
    .punch-container { display: flex; flex-direction: column; justify-content: flex-start; background-size: 200px, cover; background-color: #FFD100; background-repeat: repeat, no-repeat; background-position: center, center; background-attachment: fixed, fixed; width: 92vw; max-width: 480px; min-height: 100vh; position: relative; box-shadow: 0 0 25px rgba(0,0,0,0.5); }
    .content { width: 90%; max-width: 400px; text-align: center; color: ${config.theme.darkWood}; flex-grow: 1; padding: 20px 0; position: relative; z-index: 1; display: flex; flex-direction: column; margin: 0 auto; }
    .game-header { text-align: center; padding: 1rem 0.5rem; background: rgba(245, 245, 220, 0.9); box-shadow: 0 4px 8px rgba(0,0,0,0.2); border-radius: 0 0 15px 15px; margin-bottom: 1rem; border-bottom: 3px solid ${config.theme.accentColorDark}; }
    .game-header h1 { margin: 0; color: ${config.theme.primaryColor}; font-size: 1.8rem; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.2); }
    .stats-container { display: flex; justify-content: space-around; padding: 0.75rem 1rem; background: ${config.theme.workshopGray}; border-radius: 15px; box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 1rem; border: 1px solid #ccc; }
    .stat-item { text-align: center; } .stat-label { font-size: 0.9rem; color: #555; margin-bottom: 0.3rem; } .stat-value { font-weight: bold; font-size: 1.5rem; color: ${config.theme.darkWood}; }
    .instructions { padding: 0.75rem 1rem; background: rgba(245, 245, 220, 0.9); border-radius: 15px; font-size: 1rem; text-align: center; color: ${config.theme.darkWood}; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .error-message { padding: 1rem; background: rgba(139, 69, 19, 0.9); border-radius: 15px; font-size: 1rem; text-align: center; color: ${config.theme.white}; margin-bottom: 1rem; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
    .video-container { width: 100%; max-width: 400px; margin: 0 auto 1rem; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.2); } .video-container video { width: 100%; height: auto; display: block; }
    /* --- MODIFICATION : Le style de .canvas-container est fusionné dans .canvas-wrapper --- */
    .canvas-wrapper { 
        position: relative; 
        width: 100%; 
        max-width: 500px; 
        aspect-ratio: 1 / 1; 
        border: 4px solid ${config.theme.primaryColor}; 
        border-radius: 15px; 
        overflow: hidden; 
        touch-action: none; 
        background: #fdf6e3; 
        box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0,0,0,0.1); 
        /* Styles de .canvas-container ajoutés ici */
        flex-grow: 1; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        margin: 1rem auto; /* Marge pour l'espacement */
        ${!shapeError ? '' : 'display: none;'} 
    }
    .canvas-wrapper.sawing { animation: pulse 0.5s infinite; } @keyframes pulse { 0% { box-shadow: 0 0 15px rgba(255, 165, 0, 0.7), 0 10px 20px -5px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0,0,0,0.1); } 50% { box-shadow: 0 0 25px rgba(255, 165, 0, 1), 0 10px 20px -5px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0,0,0,0.1); } 100% { box-shadow: 0 0 15px rgba(255, 165, 0, 0.7), 0 10px 20px -5px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0,0,0,0.1); } }
    .canvas-wrapper canvas { position: absolute; inset: 0; touch-action: none; }
    .button-container { padding: 1rem 0; display: flex; justify-content: center; }
    .start-button, .next-button { padding: 16px 32px; font-size: 1.3rem; font-weight: bold; cursor: pointer; border-radius: 15px; border: 2px solid ${config.theme.accentColorDark}; color: ${config.theme.white}; background: linear-gradient(145deg, ${config.theme.accentColor}, ${config.theme.primaryColor}); box-shadow: 0 6px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2); transition: all 0.2s ease; width: 90%; max-width: 400px; height: 60px; display: flex; align-items: center; justify-content: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.4); }
    .start-button:hover:not(:disabled), .next-button:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.3), 0 4px 6px rgba(0,0,0,0.2); }
    .start-button:active:not(:disabled), .next-button:active { transform: translateY(0); box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2); }
    .start-button:disabled { background: #9ca3af; cursor: not-allowed; box-shadow: none; color: #555; }
    
    @media (max-width: 768px) {
      .punch-wrapper { justify-content: flex-start; }
      .punch-container { width: 100vw; max-width: none; }
      .content { width: 95%; max-width: none; }
      .canvas-wrapper { max-width: 100%; }
    }
  `, [config, shapeError]);

  return (
    <div className="punch-wrapper"><style>{cssStyles}</style>
      <div className="punch-container">
        <div style={{ width: "100%", flexShrink: 0 }}><img src={getHeaderImage()} alt="Header" style={{ width: "100%", height: "auto", display: "block", objectFit: "contain", }}/></div>
        <div className="content">
          {showVideoInstructions ? (
          <div style={{backgroundImage: "url('./images/Fdplancheenbois.png')", padding: "15px", borderRadius: "10px"}}>
            <img src={getAccrocheImage()} alt="Accroche" style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }}/>
            <div className="video-container">
              <video autoPlay loop muted playsInline poster="https://placehold.co/400x300/D2691E/F5F5DC?text=Chargement+de+la+vidéo">
                <source src={getInstructionVideo()} type="video/mp4"/>
                <img src="https://placehold.co/400x300/D2691E/F5F5DC?text=Comment+jouer" alt="Instructions de jeu"/>
              </video>
            </div>
            <div className="button-container"><img src="./images/Btnsuivant.png" onClick={goToGame} style={{ cursor: 'pointer', width: '60%', display: 'block', margin: '0 auto' }} alt="Suivant" /></div>
          </div>
          ) : (
          <div style={{backgroundImage: "url('./images/Fdplancheenbois.png')", padding: "15px", borderRadius: "10px"}}>
            <img src={getAccrocheImage2()} alt="Accroche" style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }}/>
            <br></br>
            <div className="stats-container">
              <div className="stat-item"><div className="stat-label">⏱️ Temps</div><div className="stat-value" style={{ color: timeLeft <= 10 && running ? config.theme.accentColor : config.theme.darkWood }}>{timeLeft}s</div></div>
              <div className="stat-item"><div className="stat-label">🪚 Précision</div><div className="stat-value" style={{ color: coverage >= config.game.successThreshold * 100 ? config.theme.primaryColor : config.theme.accentColor }}>{coverage}%</div></div>
            </div>
            {/* --- MODIFICATION : Le div.canvas-container est retiré. Le canvas-wrapper est maintenant directement ici. --- */}
            <div className={`canvas-wrapper ${isSawing ? 'sawing' : ''}`}>
              <canvas ref={guideRef} />
              <canvas ref={drawRef} />
              <canvas ref={particleCanvasRef} style={{ pointerEvents: 'none' }} />
            </div>
            <div className="button-container"><button className="start-button" onClick={startGame} disabled={running || !!shapeError}>{running ? `Tracé en cours (${timeLeft}s)` : (shapeError ? 'Départ non supporté' : '🪚 Lancer le Défi !')}</button></div>
          </div>
          )}
        </div>
        <div style={{ width: "100%", flexShrink: 0 }}><img src={config.branding.footerImage} alt="Footer" style={{ width: "100%", height: "auto", display: "block", objectFit: "contain", }}/></div>
      </div>
    </div>
  );
}