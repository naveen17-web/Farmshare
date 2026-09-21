import React, { useEffect, useState, useRef } from 'react';

export const AgriculturalHeroBackground: React.FC = () => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Accessibility check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    // Smooth, dampened mouse parallax on desktop (5px to 14px maximum)
    const handleMouseMove = (e: MouseEvent) => {
      if (mediaQuery.matches) return;
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const xRel = (e.clientX - rect.left) / rect.width - 0.5;
      const yRel = (e.clientY - rect.top) / rect.height - 0.5;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        setMouseOffset({
          x: Math.max(-1, Math.min(1, xRel)),
          y: Math.max(-1, Math.min(1, yRel)),
        });
      });
    };

    const container = containerRef.current;
    if (container && window.innerWidth > 768) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      if (container) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Multi-tier parallax offsets
  const skyShift = isReducedMotion ? 'translate3d(0, 0, 0)' : `translate3d(${mouseOffset.x * -3}px, ${mouseOffset.y * -2}px, 0)`;
  const hillsShift = isReducedMotion ? 'translate3d(0, 0, 0)' : `translate3d(${mouseOffset.x * -6}px, ${mouseOffset.y * -3}px, 0)`;
  const midFieldShift = isReducedMotion ? 'translate3d(0, 0, 0)' : `translate3d(${mouseOffset.x * -9}px, ${mouseOffset.y * -5}px, 0)`;
  const tractorShift = isReducedMotion ? 'translate3d(0, 0, 0)' : `translate3d(${mouseOffset.x * -11}px, ${mouseOffset.y * -6}px, 0)`;
  const foreCropsShift = isReducedMotion ? 'translate3d(0, 0, 0)' : `translate3d(${mouseOffset.x * -15}px, ${mouseOffset.y * -8}px, 0)`;
  const motesShift = isReducedMotion ? 'translate3d(0, 0, 0)' : `translate3d(${mouseOffset.x * -18}px, ${mouseOffset.y * -10}px, 0)`;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* =========================================================================
          LAYER 1: WARM SUNRISE/SUNSET SKY, GOLDEN SUN & CREPUSCULAR LIGHT RAYS
          Warm golden highlights, soft sky gradient, glowing morning/evening aura
          ========================================================================= */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{ transform: skyShift }}
      >
        {/* Cinematic Golden Hour Atmosphere Sky */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #1e3a5f 0%, #2b536e 24%, #e28743 62%, #fcd34d 85%, #fef3c7 100%)',
          }}
        />

        {/* Soft atmospheric gradient wash over horizon */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 72% 38%, rgba(253, 224, 71, 0.45) 0%, rgba(245, 158, 11, 0.25) 35%, transparent 70%)',
          }}
        />

        {/* Golden Sun Disc with Breathing Radial Corona */}
        <div className="absolute top-[14%] right-[22%] sm:right-[26%] w-24 h-24 sm:w-32 sm:h-32 rounded-full animate-agri-sun">
          {/* Intense core */}
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-200 via-amber-100 to-white shadow-[0_0_80px_rgba(251,191,36,0.9),0_0_140px_rgba(245,158,11,0.6)]" />
        </div>

        {/* Diagonal Crepuscular Golden Sunrays */}
        <svg
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full opacity-40 animate-agri-sunbeam pointer-events-none"
        >
          <defs>
            <linearGradient id="goldenRayGrad" x1="72%" y1="20%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.45" />
              <stop offset="40%" stopColor="#fde047" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points="1050,120 400,600 520,600 1080,120" fill="url(#goldenRayGrad)" />
          <polygon points="1060,120 120,600 220,600 1070,120" fill="url(#goldenRayGrad)" opacity="0.65" />
          <polygon points="1040,120 740,600 880,600 1070,120" fill="url(#goldenRayGrad)" opacity="0.75" />
        </svg>
      </div>

      {/* =========================================================================
          LAYER 2: DISTANT DRIFTING CLOUDS & GLIDING BIRDS
          Subtle horizontal cloud drift and slow distant birds
          ========================================================================= */}
      {/* 2A: Horizon Cumulus Clouds (Soft warm highlights) */}
      <div className="absolute top-[8%] left-0 w-[200%] h-40 pointer-events-none animate-agri-cloud-1 opacity-75">
        <svg viewBox="0 0 1200 120" className="w-1/2 h-full inline-block">
          <path
            d="M 100,80 Q 130,50 170,55 Q 210,35 260,50 Q 300,45 330,70 Q 350,85 380,85 L 100,85 Z"
            fill="#ffedd5"
            fillOpacity="0.55"
          />
          <path
            d="M 520,75 Q 560,40 610,48 Q 660,25 720,40 Q 770,35 810,65 Q 840,80 870,80 L 520,80 Z"
            fill="#fed7aa"
            fillOpacity="0.45"
          />
          <path
            d="M 940,82 Q 970,55 1010,60 Q 1045,40 1090,52 Q 1125,50 1150,75 L 940,80 Z"
            fill="#ffedd5"
            fillOpacity="0.4"
          />
        </svg>
      </div>

      <div className="absolute top-[16%] left-0 w-[200%] h-32 pointer-events-none animate-agri-cloud-2 opacity-60">
        <svg viewBox="0 0 1200 100" className="w-1/2 h-full inline-block">
          <path
            d="M 220,65 Q 250,45 285,48 Q 320,30 360,42 Q 395,38 420,60 L 220,65 Z"
            fill="#fed7aa"
            fillOpacity="0.45"
          />
          <path
            d="M 740,68 Q 775,40 820,45 Q 860,25 910,38 Q 950,35 980,58 L 740,65 Z"
            fill="#ffedd5"
            fillOpacity="0.5"
          />
        </svg>
      </div>

      {/* 2B: Small Birds Slowly Gliding in Distant Sky */}
      <div className="absolute top-[18%] left-0 pointer-events-none animate-agri-birds">
        <svg width="180" height="60" viewBox="0 0 180 60" fill="none" className="opacity-75">
          {/* Bird 1 */}
          <path
            d="M 12,24 Q 22,14 32,22 Q 42,14 52,24 Q 42,18 32,25 Q 22,18 12,24 Z"
            fill="#7c2d12"
            fillOpacity="0.75"
          />
          {/* Bird 2 (Offset Leader) */}
          <path
            d="M 62,14 Q 70,6 78,12 Q 86,6 94,14 Q 86,9 78,15 Q 70,9 62,14 Z"
            fill="#7c2d12"
            fillOpacity="0.8"
          />
          {/* Bird 3 (Follower) */}
          <path
            d="M 98,28 Q 105,21 112,26 Q 119,21 126,28 Q 119,24 112,29 Q 105,24 98,28 Z"
            fill="#7c2d12"
            fillOpacity="0.7"
          />
          {/* Bird 4 (Distant) */}
          <path
            d="M 140,20 Q 145,15 150,19 Q 155,15 160,20 Q 155,17 150,21 Q 145,17 140,20 Z"
            fill="#7c2d12"
            fillOpacity="0.6"
          />
        </svg>
      </div>

      {/* =========================================================================
          LAYER 3: DISTANT MOUNTAINS & ROLLING PASTORAL HILLS
          Soft atmospheric mountain ridge lines with warm golden haze and tree silhouettes
          ========================================================================= */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out pointer-events-none"
        style={{ transform: hillsShift }}
      >
        <svg
          viewBox="0 0 1440 460"
          preserveAspectRatio="none"
          className="absolute bottom-28 sm:bottom-36 lg:bottom-44 w-full h-44 sm:h-56 lg:h-64"
        >
          <defs>
            <linearGradient id="distantMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" stopOpacity="0.65" />
              <stop offset="60%" stopColor="#334155" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="rollingHillsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.6" />
              <stop offset="25%" stopColor="#4d7c0f" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#166534" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Far Mountain Ridge */}
          <path
            d="M 0,220 L 160,180 L 320,210 L 480,165 L 680,215 L 860,150 L 1080,210 L 1260,160 L 1440,195 L 1440,460 L 0,460 Z"
            fill="url(#distantMountainGrad)"
            opacity="0.85"
          />

          {/* Rolling Mid-Hills with Golden Sunlight Highlights */}
          <path
            d="M 0,260 C 240,210 460,290 740,230 C 1020,170 1260,260 1440,215 L 1440,460 L 0,460 Z"
            fill="url(#rollingHillsGrad)"
          />

          {/* Golden Sun Crest Rim on Hills */}
          <path
            d="M 0,260 C 240,210 460,290 740,230 C 1020,170 1260,260 1440,215"
            fill="none"
            stroke="#fde047"
            strokeWidth="2.4"
            strokeOpacity="0.85"
          />

          {/* Distant Windbreak Tree Silhouettes on Hilltop */}
          <g opacity="0.6" fill="#14532d">
            <path d="M 440,265 Q 448,245 456,265 Z" />
            <path d="M 454,267 Q 462,243 470,267 Z" />
            <path d="M 468,266 Q 476,248 484,266 Z" />
            <path d="M 980,195 Q 988,175 996,195 Z" />
            <path d="M 994,196 Q 1002,172 1010,196 Z" />
            <path d="M 1008,195 Q 1016,177 1024,195 Z" />
          </g>
        </svg>
      </div>

      {/* =========================================================================
          LAYER 4: AGRICULTURAL FARMLAND & CURVED PERSPECTIVE CROP ROWS
          Lush green crop fields, golden wheat terraces, perspective furrow lines,
          and subtle smart ag-data connection routes
          ========================================================================= */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out pointer-events-none"
        style={{ transform: midFieldShift }}
      >
        <svg
          viewBox="0 0 1440 500"
          preserveAspectRatio="none"
          className="absolute bottom-16 sm:bottom-20 lg:bottom-24 w-full h-56 sm:h-72 lg:h-88"
        >
          <defs>
            <linearGradient id="fieldTerraceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#15803d" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#166534" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#052e16" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="warmFarmLaneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350f" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#92400e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="agTechPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="50%" stopColor="#6ee7b7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Far Green Crop Terrace */}
          <path
            d="M 0,170 C 340,115 680,215 1020,145 C 1240,100 1380,165 1440,145 L 1440,500 L 0,500 Z"
            fill="url(#fieldTerraceGrad)"
          />

          {/* Golden Sunlit Terrace Contour Ridge */}
          <path
            d="M 0,170 C 340,115 680,215 1020,145 C 1240,100 1380,165 1440,145"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2.6"
            strokeOpacity="0.9"
          />

          {/* Midground Cultivated Dirt Farm Lane (Tractor travel path) */}
          <path
            d="M 0,225 C 360,175 720,265 1060,205 C 1260,170 1390,215 1440,205 L 1440,250 C 1390,260 1260,215 1060,250 C 720,310 360,220 0,270 Z"
            fill="url(#warmFarmLaneGrad)"
            opacity="0.85"
          />

          {/* Perspective Crop-Row Fan Lines creating 3D depth */}
          <g stroke="#34d399" strokeOpacity="0.35" fill="none">
            <path d="M 120,500 C 240,380 340,300 420,240" strokeWidth="1.2" strokeDasharray="10 8" />
            <path d="M 320,500 C 440,375 520,305 580,250" strokeWidth="1.4" strokeDasharray="12 8" />
            <path d="M 540,500 C 640,380 710,315 760,265" strokeWidth="1.6" strokeDasharray="14 10" />
            <path d="M 780,500 C 840,385 890,320 940,270" strokeWidth="1.6" strokeDasharray="14 10" />
            <path d="M 1040,500 C 1070,390 1110,315 1160,255" strokeWidth="1.4" strokeDasharray="12 8" />
            <path d="M 1280,500 C 1290,395 1320,315 1360,245" strokeWidth="1.2" strokeDasharray="10 8" />
          </g>

          {/* Curved Crop Rows across field */}
          <path
            d="M 0,285 C 380,225 740,325 1080,260 C 1280,220 1390,275 1440,260"
            fill="none"
            stroke="#a3e635"
            strokeWidth="2.2"
            strokeDasharray="16 10"
            strokeOpacity="0.75"
          />
          <path
            d="M 0,335 C 400,270 760,375 1100,310 C 1300,270 1400,325 1440,310"
            fill="none"
            stroke="#4ade80"
            strokeWidth="2"
            strokeDasharray="20 12"
            strokeOpacity="0.65"
          />

          {/* =========================================================================
              VERY SUBTLE AGRICULTURAL TECHNOLOGY / DATA CONNECTION ELEMENTS
              Subtle glowing route connecting smart agriculture field telemetry
              ========================================================================= */}
          <path
            d="M 80,310 C 380,250 720,340 1060,270 C 1240,230 1360,280 1440,270"
            fill="none"
            stroke="url(#agTechPulseGrad)"
            strokeWidth="2.2"
            strokeDasharray="20 12"
            className="animate-agri-data-flow"
          />

          {/* IoT Telemetry Field Beacons */}
          <g transform="translate(420, 275)">
            <circle cx="0" cy="0" r="3.5" fill="#34d399" />
            <circle cx="0" cy="0" r="10" fill="none" stroke="#6ee7b7" strokeWidth="1.2" className="animate-agri-beacon" />
          </g>
          <g transform="translate(860, 310)">
            <circle cx="0" cy="0" r="4" fill="#a3e635" />
            <circle cx="0" cy="0" r="12" fill="none" stroke="#fef08a" strokeWidth="1.2" className="animate-agri-beacon" style={{ animationDelay: '1.2s' }} />
          </g>
        </svg>
      </div>

      {/* =========================================================================
          LAYER 5: WORKING MODERN TRACTOR MOVING SMOOTHLY ACROSS THE FIELD
          Realistic modern agricultural tractor with rotating wheels, trailing
          warm dust puffs, rotavator implement, and GPS receiver dome
          ========================================================================= */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out pointer-events-none"
        style={{ transform: tractorShift }}
      >
        {/* Tractor traverses smoothly along the midground farm path */}
        <div className="absolute bottom-28 sm:bottom-36 lg:bottom-44 left-0 w-full pointer-events-none animate-agri-tractor-travel">
          <div className="relative w-40 sm:w-48 lg:w-56 h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]">
            <svg viewBox="0 0 240 140" fill="none" className="w-full h-full">
              <defs>
                {/* Tractor Green Body Paint */}
                <linearGradient id="tractorBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="45%" stopColor="#15803d" />
                  <stop offset="100%" stopColor="#14532d" />
                </linearGradient>

                {/* Golden Sunlit Cab Glass */}
                <linearGradient id="tractorCabGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
                  <stop offset="60%" stopColor="#6ee7b7" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#064e3b" stopOpacity="0.8" />
                </linearGradient>

                {/* Tire Rubber Tread */}
                <radialGradient id="tractorTireGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="70%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>

                {/* Yellow Wheel Rim */}
                <linearGradient id="tractorRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
              </defs>

              {/* Rear Hitch Rotavator/Harrow Implement */}
              <g id="tractor-implement">
                <path d="M 22,95 L 42,92 L 58,82" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
                <rect x="8" y="90" width="22" height="14" rx="2" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
                {/* Implement tines cultivating soil */}
                <line x1="12" y1="104" x2="10" y2="114" stroke="#e2e8f0" strokeWidth="2.5" />
                <line x1="18" y1="104" x2="16" y2="114" stroke="#e2e8f0" strokeWidth="2.5" />
                <line x1="24" y1="104" x2="22" y2="114" stroke="#e2e8f0" strokeWidth="2.5" />
              </g>

              {/* Tractor Main Chassis & Engine Hood */}
              <path
                d="M 85,62 L 175,62 Q 192,62 198,74 L 206,100 L 85,100 Z"
                fill="url(#tractorBodyGrad)"
                stroke="#166534"
                strokeWidth="2"
              />
              {/* Hood Yellow Accent Stripe */}
              <path d="M 95,74 L 182,74 Q 190,74 195,84" stroke="#facc15" strokeWidth="2.8" strokeLinecap="round" />

              {/* Front Radiator Grille & Headlight */}
              <path d="M 200,76 L 206,100" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
              <polygon points="198,72 206,75 204,82 197,79" fill="#fef08a" />
              {/* Golden Headlight Glow Beam Cone */}
              <polygon points="206,76 240,68 240,94 206,84" fill="#fef08a" opacity="0.35" />

              {/* Vertical Exhaust Stack with slight warm heat */}
              <line x1="165" y1="62" x2="165" y2="30" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="165" y1="30" x2="170" y2="28" stroke="#334155" strokeWidth="3" strokeLinecap="round" />

              {/* Driver Ergonomic Glass Cabin */}
              <path
                d="M 62,62 L 74,28 Q 78,22 86,22 L 138,22 Q 146,22 150,28 L 158,62 Z"
                fill="url(#tractorCabGrad)"
                stroke="#15803d"
                strokeWidth="2.2"
              />
              {/* Cab Pillars */}
              <line x1="86" y1="24" x2="82" y2="62" stroke="#14532d" strokeWidth="2" />
              <line x1="138" y1="24" x2="142" y2="62" stroke="#14532d" strokeWidth="2" />
              {/* Farmer Silhouette in Cab */}
              <circle cx="106" cy="38" r="6.5" fill="#1e293b" opacity="0.8" />
              <path d="M 96,58 C 96,48 116,48 116,58 Z" fill="#1e293b" opacity="0.8" />

              {/* Cab Roof Smart RTK / GPS Antenna Receiver Dome */}
              <ellipse cx="112" cy="21" rx="10" ry="4" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
              <circle cx="112" cy="18" r="2.5" fill="#10b981" />
              {/* Subtle GPS Signal Wave */}
              <circle cx="112" cy="18" r="7" fill="none" stroke="#34d399" strokeWidth="1.2" className="animate-agri-beacon" />

              {/* Rear Wheel Fender */}
              <path
                d="M 40,94 A 42,42 0 0,1 114,94"
                stroke="#15803d"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />

              {/* REAR WHEEL (Large Heavy Lug Drive Tire) with Turn Animation */}
              <g transform="translate(77, 98)">
                <circle cx="0" cy="0" r="36" fill="url(#tractorTireGrad)" stroke="#0f172a" strokeWidth="2" />
                <g className="animate-agri-wheel">
                  {/* Wheel Rim */}
                  <circle cx="0" cy="0" r="22" fill="url(#tractorRimGrad)" stroke="#a16207" strokeWidth="1.5" />
                  {/* Wheel Lug Spokes */}
                  <line x1="0" y1="-22" x2="0" y2="22" stroke="#854d0e" strokeWidth="2.5" />
                  <line x1="-22" y1="0" x2="22" y2="0" stroke="#854d0e" strokeWidth="2.5" />
                  <line x1="-15" y1="-15" x2="15" y2="15" stroke="#854d0e" strokeWidth="2.5" />
                  <line x1="-15" y1="15" x2="15" y2="-15" stroke="#854d0e" strokeWidth="2.5" />
                  {/* Center Axle Hub */}
                  <circle cx="0" cy="0" r="8" fill="#1e293b" stroke="#facc15" strokeWidth="1.5" />
                </g>
              </g>

              {/* FRONT WHEEL (Steer Tire) with Turn Animation */}
              <g transform="translate(185, 105)">
                <circle cx="0" cy="0" r="24" fill="url(#tractorTireGrad)" stroke="#0f172a" strokeWidth="2" />
                <g className="animate-agri-wheel">
                  <circle cx="0" cy="0" r="14" fill="url(#tractorRimGrad)" stroke="#a16207" strokeWidth="1.5" />
                  <line x1="0" y1="-14" x2="0" y2="14" stroke="#854d0e" strokeWidth="2" />
                  <line x1="-14" y1="0" x2="14" y2="0" stroke="#854d0e" strokeWidth="2" />
                  <circle cx="0" cy="0" r="5" fill="#1e293b" stroke="#facc15" strokeWidth="1.2" />
                </g>
              </g>
            </svg>

            {/* Natural Warm Golden Dust Puffs behind tractor wheels */}
            <div className="absolute bottom-2 -left-6 w-8 h-8 rounded-full bg-amber-600/35 blur-sm animate-agri-dust-1" />
            <div className="absolute bottom-1 -left-10 w-9 h-9 rounded-full bg-amber-500/30 blur-md animate-agri-dust-2" />
            <div className="absolute bottom-3 -left-14 w-10 h-10 rounded-full bg-amber-700/25 blur-lg animate-agri-dust-3" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          LAYER 6: FOREGROUND SWAYING WHEAT STALKS & FRESH GREEN CROP ROWS
          Gentle, natural breeze motion across multiple phases of wheat & grass
          ========================================================================= */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out pointer-events-none"
        style={{ transform: foreCropsShift }}
      >
        <svg
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
          className="absolute -bottom-4 w-full h-44 sm:h-56 lg:h-64"
        >
          <defs>
            <linearGradient id="foreRidgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0.85" />
              <stop offset="30%" stopColor="#15803d" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#052e16" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="goldenWheatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#65a30d" />
            </linearGradient>

            <linearGradient id="emeraldGrassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="60%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>
          </defs>

          {/* Near Rolling Field Earth Mound */}
          <path
            d="M 0,90 C 380,30 720,150 1060,75 C 1280,25 1390,95 1440,70 L 1440,300 L 0,300 Z"
            fill="url(#foreRidgeGrad)"
          />
          {/* Golden Sunlit Grass Edge */}
          <path
            d="M 0,90 C 380,30 720,150 1060,75 C 1280,25 1390,95 1440,70"
            fill="none"
            stroke="#fde047"
            strokeWidth="3"
            strokeOpacity="0.95"
          />

          {/* Foreground Swaying Crops Phase 1 (Wheat & Grain Ears) */}
          <g className="animate-agri-sway-1">
            {/* Repeated stalks along the foreground edge */}
            {[
              40, 85, 130, 180, 230, 280, 340, 400, 470, 530, 600, 670, 740, 810, 880, 950, 1020, 1090, 1160, 1230, 1300, 1370, 1420,
            ].map((x, i) => (
              <g key={`wheat-stalk-${i}`} transform={`translate(${x}, ${75 + (i % 5) * 10})`}>
                {/* Slender stalk stem */}
                <path d="M 0,90 Q 2,40 -4,0" stroke="url(#emeraldGrassGrad)" strokeWidth="2.2" fill="none" />
                {/* Wheat Ear Head */}
                <ellipse cx="-5" cy="-8" rx="4.5" ry="12" fill="url(#goldenWheatGrad)" stroke="#ca8a04" strokeWidth="0.8" />
                <line x1="-5" y1="-20" x2="-8" y2="-28" stroke="#facc15" strokeWidth="1.2" />
                <line x1="-3" y1="-20" x2="-3" y2="-30" stroke="#facc15" strokeWidth="1.2" />
                <line x1="-7" y1="-20" x2="-11" y2="-26" stroke="#facc15" strokeWidth="1.2" />
              </g>
            ))}
          </g>

          {/* Foreground Swaying Grass Blades Phase 2 */}
          <g className="animate-agri-sway-2">
            {[
              15, 60, 105, 155, 205, 255, 310, 370, 435, 500, 565, 635, 705, 775, 845, 915, 985, 1055, 1125, 1195, 1265, 1335, 1395,
            ].map((x, i) => (
              <g key={`grass-blade-${i}`} transform={`translate(${x}, ${95 + (i % 4) * 8})`}>
                <path d="M 0,80 Q -6,35 6,0" stroke="#4ade80" strokeWidth="2.4" fill="none" />
                <path d="M 4,80 Q 8,40 16,5" stroke="#a3e635" strokeWidth="1.8" fill="none" />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* =========================================================================
          LAYER 7: SUBTLE FLOATING GOLDEN DUST & SUNLIT POLLEN PARTICLES
          Very subtle ambient motes floating naturally in the golden hour sunlight
          ========================================================================= */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: motesShift }}
      >
        <div className="absolute top-[28%] left-[24%] w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_8px_#fef08a] animate-agri-mote-1" />
        <div className="absolute top-[40%] left-[36%] w-2 h-2 rounded-full bg-yellow-100 shadow-[0_0_10px_#fde047] animate-agri-mote-2 delay-500" />
        <div className="absolute top-[52%] left-[48%] w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#fbbf24] animate-agri-mote-1 delay-1000" />
        <div className="absolute top-[34%] right-[32%] w-2 h-2 rounded-full bg-yellow-200 shadow-[0_0_10px_#fde047] animate-agri-mote-2 delay-700" />
        <div className="absolute top-[48%] right-[22%] w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_8px_#fef08a] animate-agri-mote-1 delay-1500" />
        <div className="absolute top-[62%] right-[14%] w-2 h-2 rounded-full bg-yellow-100 shadow-[0_0_8px_#fef08a] animate-agri-mote-2 delay-300 hidden sm:block" />
        <div className="absolute top-[22%] right-[44%] w-1.5 h-1.5 rounded-full bg-amber-100 shadow-[0_0_6px_#fef08a] animate-agri-mote-1 delay-1200 hidden md:block" />
      </div>

      {/* =========================================================================
          LAYER 8: SUBTLE READABILITY GRADIENT STRICTLY BEHIND THE LEFT TEXT AREA
          Ensures 100% WCAG text contrast on the left, while keeping the center
          and right side visually open, bright, and completely visible!
          ========================================================================= */}
      <div
        className="absolute inset-0 pointer-events-none z-[8]"
        style={{
          background:
            'linear-gradient(90deg, rgba(6, 28, 18, 0.76) 0%, rgba(6, 28, 18, 0.48) 42%, rgba(6, 28, 18, 0.12) 68%, rgba(6, 28, 18, 0) 90%)',
        }}
      />
    </div>
  );
};
