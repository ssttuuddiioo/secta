'use client'

import { useState, useRef, useEffect } from "react";
import { VideoBackground } from "@/components/VideoBackground";
import { DotGridOverlay } from "@/components/DotGridOverlay";
import { CRTOverlay } from "@/components/CRTOverlay";
import { Volume2, VolumeX, Plus, Settings, Copy, Check, Save, Instagram, Linkedin, Youtube, Clapperboard } from "lucide-react";
import { gsap } from "gsap";
import { PillButton } from "@/components/PillButton";
import { SphereEye } from "@/components/SphereEye";
import { InteractiveSphere } from "@/components/InteractiveSphere";
import { VideoWithShader } from "@/components/VideoWithShader";
import Image from "next/image";

// Default sphere parameters (matching sphere page)
const defaultSphereParams = {
  radius: 1.5,
  widthSegments: 17,
  heightSegments: 11,
  fillColor: '#e1d093',
  lineColor: '#000000',
  innerSphereOffset: 0.07,
  cameraZoom: 21,
  lookAtDepth: 19,
  horizontalStrokeWidth: 4,
  verticalStrokeWidth: 4,
  strokeOpacity: 1,
  mouseDelay: 0.1,
  showBackgroundOvals: true,
  backgroundOvalCount: 2,
  backgroundOvalWidth: 2.3,
  backgroundOvalHeight: 1.3,
  backgroundOvalSpacing: 0.2,
  backgroundOvalStrokeWidth: 6.3,
  backgroundOvalColor: '#000000',
  showEquatorLine: true,
  showMeridianLine: false,
}

// Load saved sphere parameters from localStorage
const loadSavedSphereParams = () => {
  if (typeof window === 'undefined') return defaultSphereParams
  const saved = localStorage.getItem('sphereParams')
  if (saved) {
    try {
      return { ...defaultSphereParams, ...JSON.parse(saved) }
    } catch {
      return defaultSphereParams
    }
  }
  return defaultSphereParams
}

export function LandingPage() {
  const [isMuted, setIsMuted] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [interactionStep, setInteractionStep] = useState(0);   // 0: Init, 1: CRT, 2: New Video
  // Always force Solarize effect (1) as default
  const [shaderEffect] = useState(1);
  // Load saved sphere parameters - make it reactive
  const [sphereParams, setSphereParams] = useState(() => loadSavedSphereParams());
  const [showSphereControls, setShowSphereControls] = useState(false);
  const [hasSavedSphereParams, setHasSavedSphereParams] = useState(false);

  // Load saved parameters on mount and listen for changes
  useEffect(() => {
    const saved = loadSavedSphereParams();
    if (saved !== defaultSphereParams) {
      setSphereParams(saved);
      setHasSavedSphereParams(true);
    }
  }, []);

  // Update sphere parameter with auto-save
  const updateSphereParam = (key: keyof typeof defaultSphereParams, value: number | string | boolean) => {
    setSphereParams((prev: typeof defaultSphereParams) => {
      const updated = { ...prev, [key]: value };
      // Auto-save to localStorage for real-time sync
      try {
        localStorage.setItem('sphereParams', JSON.stringify(updated));
        // Trigger custom event for same-tab sync
        window.dispatchEvent(new CustomEvent('sphereParamsUpdated', { detail: updated }));
      } catch (error) {
        console.warn('Failed to auto-save:', error);
      }
      return updated;
    });
  };

  // Listen for updates from sphere page or other components
  useEffect(() => {
    const handleUpdate = (e: CustomEvent) => {
      setSphereParams(e.detail);
      setHasSavedSphereParams(true);
    };
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sphereParams' && e.newValue) {
        try {
          const newParams = { ...defaultSphereParams, ...JSON.parse(e.newValue) };
          setSphereParams(newParams);
          setHasSavedSphereParams(true);
        } catch {
          // Ignore parse errors
        }
      }
    };
    window.addEventListener('sphereParamsUpdated', handleUpdate as EventListener);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('sphereParamsUpdated', handleUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save sphere parameters
  const saveSphereParams = () => {
    try {
      localStorage.setItem('sphereParams', JSON.stringify(sphereParams));
      setHasSavedSphereParams(true);
      // Trigger storage event for other tabs/windows
      window.dispatchEvent(new Event('storage'));
      // Show notification
      const notification = document.createElement('div');
      notification.textContent = '✓ Saved';
      notification.className = 'fixed top-20 right-4 bg-green-500/90 text-white px-4 py-2 rounded text-sm z-50';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    } catch (error) {
      alert('Failed to save parameters');
    }
  };

  // Reset sphere parameters
  const resetSphereParams = () => {
    if (confirm('Reset all sphere parameters to defaults?')) {
      setSphereParams(defaultSphereParams);
      localStorage.removeItem('sphereParams');
      setHasSavedSphereParams(false);
      window.dispatchEvent(new Event('storage'));
    }
  };

  // Fetch video URL from Sanity on mount - MUST run before localStorage
  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        console.log('📡 Fetching video from Sanity API...')
        const response = await fetch('/api/hero-video')
        if (response.ok) {
          const data = await response.json()
          console.log('📡 Sanity API response:', data)
          if (data.videoUrl) {
            console.log('✅ Using Sanity video:', data.videoUrl)
            setParams(prev => ({ ...prev, videoUrl: data.videoUrl }))
          }
        } else {
          console.warn('⚠️ Sanity API returned error:', response.status)
        }
      } catch (error) {
        console.warn('⚠️ Failed to fetch video from Sanity:', error)
        console.log('ℹ️ Using fallback video')
      }
    }
    fetchVideoUrl()
  }, [])

  useEffect(() => {
    // Initial Load Animations
    const ctx = gsap.context(() => {
      // Logo Animation
      if (logoRef.current) {
        gsap.fromTo(logoRef.current,
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    if (isMenuOpen) {
      // Show menu
      gsap.to(menu, {
        autoAlpha: 1,
        duration: 0.1,
        ease: "power2.out"
      });
      
      gsap.fromTo(menu.querySelectorAll('button'), 
        { x: 20, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.4, 
          stagger: 0.1,
          ease: "power3.out"
        }
      );
    } else {
      // Hide menu
      gsap.to(menu.querySelectorAll('button'), {
        x: 20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power3.in",
        onComplete: () => {
          gsap.to(menu, {
            autoAlpha: 0,
            duration: 0.1
          });
        }
      });
    }
  }, [isMenuOpen]);

  // Configurable parameters
  const [params, setParams] = useState({
    dotSize: 1.5,
    spacing: 6,
    opacity: 0.15,
    colorR: 255,
    colorG: 255,
    colorB: 255,
    colorA: 0.63,
    videoUrl: "/secta-compressed-2x.mp4" // Fallback to local video if Sanity fails
  });

  // Load saved params from localStorage on mount (but don't override videoUrl if Sanity provides one)
  useEffect(() => {
    const savedParams = localStorage.getItem('secta-landing-params');
    if (savedParams) {
      try {
        const parsed = JSON.parse(savedParams);
        // Don't load videoUrl from localStorage - let Sanity override it
        delete parsed.videoUrl;
        setParams(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse saved params", e);
      }
    }
  }, []);

  const dotColor = `rgba(${params.colorR}, ${params.colorG}, ${params.colorB}, ${params.colorA})`;

  const saveConfig = () => {
    localStorage.setItem('secta-landing-params', JSON.stringify(params));
    window.location.reload();
  };

  const copyConfig = () => {
    const config = `
// Current Configuration
<DotGridOverlay 
  dotSize={${params.dotSize}}
  spacing={${params.spacing}}
  opacity={${params.opacity}}
  dotColor="${dotColor}"
/>

// Video URL
videoUrl="${params.videoUrl}"
    `.trim();
    
    navigator.clipboard.writeText(config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogoClick = () => {
    if (interactionStep === 0) {
      // Click: Enable CRT
      setInteractionStep(1);
    } else {
      // Click: Disable CRT
      setInteractionStep(0);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] font-sofia bg-secta-black text-secta-white" style={{ overflow: 'visible' }}>
      {/* Video Background - Shader approach */}
      <VideoWithShader 
        videoUrl={params.videoUrl}
        effect={shaderEffect}
        isMuted={isMuted}
      />

      {/* Dot Grid Overlay */}
      <DotGridOverlay 
        dotSize={params.dotSize}
        spacing={params.spacing}
        opacity={params.opacity}
        dotColor={dotColor}
      />

      {/* CRT Overlay (Conditional) */}
      {interactionStep >= 1 && <CRTOverlay />}

      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 z-10 opacity-[0.15] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content Layer */}
      <div className="relative z-20 w-full h-full flex flex-col justify-center p-6 md:p-12 lg:p-16" style={{ overflow: 'visible' }}>
        
        {/* Interactive Sphere Logo (Top Left) */}
        <div 
          ref={logoRef} 
          className="absolute top-6 left-6 md:top-8 md:left-8 z-30 cursor-pointer"
          style={{ 
            overflow: 'visible', 
            width: '600px', 
            height: '600px',
            marginLeft: '-250px',
            marginTop: '-270px'
          }}
          onClick={handleLogoClick}
        >
          <div style={{ 
            overflow: 'visible', 
            width: '100%', 
            height: '100%',
            position: 'relative'
          }}>
            <InteractiveSphere
              radius={sphereParams.radius}
              widthSegments={sphereParams.widthSegments}
              heightSegments={sphereParams.heightSegments}
              fillColor={sphereParams.fillColor}
              lineColor={sphereParams.lineColor}
              innerSphereOffset={sphereParams.innerSphereOffset}
              cameraZoom={sphereParams.cameraZoom}
              lookAtDepth={sphereParams.lookAtDepth}
              horizontalStrokeWidth={sphereParams.horizontalStrokeWidth}
              verticalStrokeWidth={sphereParams.verticalStrokeWidth}
              strokeOpacity={sphereParams.strokeOpacity}
              mouseDelay={sphereParams.mouseDelay}
              showBackgroundOvals={sphereParams.showBackgroundOvals}
              backgroundOvalCount={sphereParams.backgroundOvalCount}
              backgroundOvalWidth={sphereParams.backgroundOvalWidth}
              backgroundOvalHeight={sphereParams.backgroundOvalHeight}
              backgroundOvalSpacing={sphereParams.backgroundOvalSpacing}
              backgroundOvalStrokeWidth={sphereParams.backgroundOvalStrokeWidth}
              backgroundOvalColor={sphereParams.backgroundOvalColor}
              showEquatorLine={sphereParams.showEquatorLine}
              showMeridianLine={sphereParams.showMeridianLine}
            />
          </div>
        </div>

        {/* Menu Overlay */}
        <div 
          ref={menuRef}
          className="absolute top-20 right-6 md:top-8 md:right-24 z-40 opacity-0 invisible flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4"
        >
          <PillButton 
            variant={activeSection === 'Motion' ? 'filled' : 'outline'} 
            onClick={() => setActiveSection('Motion')}
            className="w-full md:w-auto text-right md:text-center px-6 py-2 md:px-8 md:py-3 text-base md:text-xl"
          >
            Motion
          </PillButton>
          <PillButton 
            variant={activeSection === 'Stills' ? 'filled' : 'outline'} 
            onClick={() => setActiveSection('Stills')}
            className="w-full md:w-auto text-right md:text-center px-6 py-2 md:px-8 md:py-3 text-base md:text-xl"
          >
            Stills
          </PillButton>
          <PillButton 
            variant={activeSection === 'Experiential' ? 'filled' : 'outline'} 
            onClick={() => setActiveSection('Experiential')}
            className="w-full md:w-auto text-right md:text-center px-6 py-2 md:px-8 md:py-3 text-base md:text-xl"
          >
            Experiential
          </PillButton>
          <PillButton 
            variant={activeSection === 'About' ? 'filled' : 'outline'} 
            onClick={() => setActiveSection('About')}
            className="w-full md:w-auto text-right md:text-center px-6 py-2 md:px-8 md:py-3 text-base md:text-xl"
          >
            About
          </PillButton>
        </div>

        {/* Section Banner Header - behind sphere and menu button */}
        <div 
          className="absolute top-0 left-0 right-0 z-25 h-[120px]"
          style={{ backgroundColor: '#E4D9B0' }}
        >
        </div>

        {/* Menu Icon (Top Right) */}
        <button 
          ref={menuButtonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute top-[40px] right-6 md:top-[36px] md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-secta-orange flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer z-50"
          style={{ backgroundColor: '#FF6B35' }}
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {/* Custom black plus sign with hard block lines - no rounded corners */}
          <div className={`relative w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : 'rotate-0'}`}>
            {/* Horizontal bar - hard block line */}
            <div className="absolute top-1/2 left-0 w-full h-[4.5px] md:h-[6px] bg-black -translate-y-1/2" style={{ borderRadius: 0 }}></div>
            {/* Vertical bar - hard block line */}
            <div className="absolute left-1/2 top-0 w-[4.5px] md:w-[6px] h-full bg-black -translate-x-1/2" style={{ borderRadius: 0 }}></div>
          </div>
        </button>

        {/* Social Icons (Bottom Right) */}
        <div className="absolute bottom-8 right-6 md:bottom-8 md:right-8 z-30 flex items-center gap-4 md:gap-6">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-secta-orange transition-colors duration-300"
            aria-label="Instagram"
          >
            <Instagram size={20} strokeWidth={2} className="md:w-6 md:h-6" />
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-secta-orange transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} strokeWidth={2} className="md:w-6 md:h-6" />
          </a>
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-secta-orange transition-colors duration-300"
            aria-label="YouTube"
          >
            <Youtube size={20} strokeWidth={2} className="md:w-6 md:h-6" />
          </a>
          <a 
            href="https://imdb.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-secta-orange transition-colors duration-300"
            aria-label="IMDb"
          >
            <Clapperboard size={20} strokeWidth={2} className="md:w-6 md:h-6" />
          </a>
        </div>

        {/* Sphere Controls Toggle Button */}
        <button 
          onClick={() => setShowSphereControls(!showSphereControls)}
          className="absolute top-6 right-20 md:top-8 md:right-24 w-10 h-10 md:w-12 md:h-12 rounded-full bg-secta-orange/80 hover:bg-secta-orange flex items-center justify-center transition-all duration-300 cursor-pointer z-50"
          style={{ backgroundColor: showSphereControls ? '#FF6B35' : '#FF6B35CC' }}
          aria-label={showSphereControls ? "Hide Sphere Controls" : "Show Sphere Controls"}
        >
          <Settings size={20} className="text-black" />
        </button>

        {/* Debug Toggle (Bottom Right) */}
        <button 
          onClick={() => setShowDebug(!showDebug)}
          className="absolute bottom-0 right-0 p-0 w-[30px] h-[30px] bg-white/10 hover:bg-white/20 text-white/0 hover:text-white/100 z-50 transition-all overflow-hidden flex items-center justify-center"
          aria-label="Debug Settings"
        >
          <Settings size={20} />
        </button>

        {/* Sphere Controls Panel */}
        {showSphereControls && (
          <div className="absolute top-20 right-6 md:top-20 md:right-8 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white text-sm w-64 max-h-[80vh] overflow-y-auto z-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Sphere Controls</h2>
              <button
                onClick={() => setShowSphereControls(false)}
                className="text-white/60 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Geometry */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Geometry</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs mb-1">
                      Radius: {sphereParams.radius.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.1"
                      value={sphereParams.radius}
                      onChange={(e) => updateSphereParam('radius', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">
                      Width Segments (Vertical Lines): {sphereParams.widthSegments}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={sphereParams.widthSegments}
                      onChange={(e) => updateSphereParam('widthSegments', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-white/40 mt-1">
                      {sphereParams.widthSegments === 0 ? 'Hidden' : `${sphereParams.widthSegments} vertical lines`}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs mb-1">
                      Height Segments (Horizontal Rings): {sphereParams.heightSegments}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={sphereParams.heightSegments}
                      onChange={(e) => updateSphereParam('heightSegments', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-white/40 mt-1">
                      {sphereParams.heightSegments === 0 ? 'Hidden' : `${sphereParams.heightSegments} horizontal rings`}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs mb-1">
                      Inner Sphere Offset: {sphereParams.innerSphereOffset.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="0.5"
                      step="0.01"
                      value={sphereParams.innerSphereOffset}
                      onChange={(e) => updateSphereParam('innerSphereOffset', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Colors</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs mb-1">Fill Color</label>
                    <input
                      type="color"
                      value={sphereParams.fillColor}
                      onChange={(e) => updateSphereParam('fillColor', e.target.value)}
                      className="w-full h-8 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Line Color</label>
                    <input
                      type="color"
                      value={sphereParams.lineColor}
                      onChange={(e) => updateSphereParam('lineColor', e.target.value)}
                      className="w-full h-8 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Stroke */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Stroke</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs mb-1">
                      Horizontal Stroke Width: {sphereParams.horizontalStrokeWidth.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.1"
                      value={sphereParams.horizontalStrokeWidth}
                      onChange={(e) => updateSphereParam('horizontalStrokeWidth', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-white/40 mt-1">
                      {sphereParams.horizontalStrokeWidth <= 0.01 ? 'Thin lines' : 'Thick tubes'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs mb-1">
                      Vertical Stroke Width: {sphereParams.verticalStrokeWidth.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.1"
                      value={sphereParams.verticalStrokeWidth}
                      onChange={(e) => updateSphereParam('verticalStrokeWidth', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-white/40 mt-1">
                      {sphereParams.verticalStrokeWidth <= 0.01 ? 'Thin lines' : 'Thick tubes'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs mb-1">
                      Stroke Opacity: {sphereParams.strokeOpacity.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={sphereParams.strokeOpacity}
                      onChange={(e) => updateSphereParam('strokeOpacity', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Background Ovals */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Background Ovals</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showBackgroundOvals"
                      checked={sphereParams.showBackgroundOvals}
                      onChange={(e) => updateSphereParam('showBackgroundOvals', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="showBackgroundOvals" className="text-xs">
                      Show Background Ovals
                    </label>
                  </div>
                  {sphereParams.showBackgroundOvals && (
                    <>
                      <div>
                        <label className="block text-xs mb-1">
                          Oval Count: {sphereParams.backgroundOvalCount}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={sphereParams.backgroundOvalCount}
                          onChange={(e) => updateSphereParam('backgroundOvalCount', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">
                          Oval Width: {sphereParams.backgroundOvalWidth.toFixed(2)}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          step="0.1"
                          value={sphereParams.backgroundOvalWidth}
                          onChange={(e) => updateSphereParam('backgroundOvalWidth', parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">
                          Oval Height: {sphereParams.backgroundOvalHeight.toFixed(2)}
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="5"
                          step="0.1"
                          value={sphereParams.backgroundOvalHeight}
                          onChange={(e) => updateSphereParam('backgroundOvalHeight', parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">
                          Oval Spacing: {sphereParams.backgroundOvalSpacing.toFixed(2)}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={sphereParams.backgroundOvalSpacing}
                          onChange={(e) => updateSphereParam('backgroundOvalSpacing', parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">
                          Oval Stroke Width: {sphereParams.backgroundOvalStrokeWidth.toFixed(2)}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="0.1"
                          value={sphereParams.backgroundOvalStrokeWidth}
                          onChange={(e) => updateSphereParam('backgroundOvalStrokeWidth', parseFloat(e.target.value))}
                          className="w-full"
                        />
                        <p className="text-xs text-white/40 mt-1">
                          {sphereParams.backgroundOvalStrokeWidth <= 0.01 ? 'Thin lines' : 'Thick tubes'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Oval Stroke Color</label>
                        <input
                          type="color"
                          value={sphereParams.backgroundOvalColor}
                          onChange={(e) => updateSphereParam('backgroundOvalColor', e.target.value)}
                          className="w-full h-8 rounded"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
                        <input
                          type="checkbox"
                          id="showEquatorLine"
                          checked={sphereParams.showEquatorLine}
                          onChange={(e) => updateSphereParam('showEquatorLine', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <label htmlFor="showEquatorLine" className="text-xs">
                          Show Equator Line (Horizontal)
                        </label>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          id="showMeridianLine"
                          checked={sphereParams.showMeridianLine}
                          onChange={(e) => updateSphereParam('showMeridianLine', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <label htmlFor="showMeridianLine" className="text-xs">
                          Show Meridian Line (Vertical)
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Camera & Interaction */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Camera & Interaction</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs mb-1">
                      Camera Zoom: {sphereParams.cameraZoom.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="0.5"
                      value={sphereParams.cameraZoom}
                      onChange={(e) => updateSphereParam('cameraZoom', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">
                      Look Sensitivity: {sphereParams.lookAtDepth.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="1"
                      value={sphereParams.lookAtDepth}
                      onChange={(e) => updateSphereParam('lookAtDepth', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">
                      Mouse Delay: {sphereParams.mouseDelay.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={sphereParams.mouseDelay}
                      onChange={(e) => updateSphereParam('mouseDelay', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-white/40 mt-1">
                      {sphereParams.mouseDelay === 0 ? 'Instant' : sphereParams.mouseDelay < 0.5 ? 'Smooth' : 'Very slow'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Save & Reset */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Settings</h3>
                {hasSavedSphereParams && (
                  <p className="text-xs text-green-400 mb-2">✓ Parameters saved</p>
                )}
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={saveSphereParams}
                    className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded px-3 py-2 text-xs transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={resetSphereParams}
                    className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded px-3 py-2 text-xs transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debug Controls */}
        {showDebug && (
          <div className="absolute bottom-8 right-8 w-64 bg-black/80 backdrop-blur-md p-4 rounded-xl z-40 border border-white/10 text-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold uppercase tracking-wider">Overlay Config</h3>
              <div className="flex gap-2">
                <button onClick={saveConfig} className="text-secta-orange hover:text-white transition-colors" title="Save & Reload">
                  <Save size={16} />
                </button>
                <button onClick={copyConfig} className="text-secta-orange hover:text-white transition-colors" title="Copy Config">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1 opacity-70">Dot Size: {params.dotSize}px</label>
                <input 
                  type="range" min="0.5" max="5" step="0.1" 
                  value={params.dotSize}
                  onChange={(e) => setParams({...params, dotSize: parseFloat(e.target.value)})}
                  className="w-full accent-secta-orange"
                />
              </div>
              
              <div>
                <label className="block mb-1 opacity-70">Spacing: {params.spacing}px</label>
                <input 
                  type="range" min="4" max="100" step="1" 
                  value={params.spacing}
                  onChange={(e) => setParams({...params, spacing: parseInt(e.target.value)})}
                  className="w-full accent-secta-orange"
                />
              </div>

              <div>
                <label className="block mb-1 opacity-70">Opacity: {params.opacity}</label>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={params.opacity}
                  onChange={(e) => setParams({...params, opacity: parseFloat(e.target.value)})}
                  className="w-full accent-secta-orange"
                />
              </div>

              <div>
                <label className="block mb-1 opacity-70">Color Alpha: {params.colorA}</label>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={params.colorA}
                  onChange={(e) => setParams({...params, colorA: parseFloat(e.target.value)})}
                  className="w-full accent-secta-orange"
                />
              </div>

              <div>
                <label className="block mb-1 opacity-70">Video URL</label>
                <input 
                  type="text" 
                  value={params.videoUrl}
                  onChange={(e) => setParams({...params, videoUrl: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-xs focus:outline-none focus:border-secta-orange"
                  placeholder="Vimeo URL"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 font-mono text-[10px] opacity-50">
              {`dotSize={${params.dotSize}} spacing={${params.spacing}} opacity={${params.opacity}}`}
            </div>
          </div>
        )}

        {/* Title */}
        <div className="max-w-[90%] md:max-w-[95%] mt-[380px] md:mt-auto mb-auto">
          <h1 className="text-[11vw] md:text-[7.5vw] font-bold leading-[0.9] tracking-tight">
            We tell stories through <br className="hidden md:block" /> motion, stills, and experiences
          </h1>
        </div>

        {/* Unmute Icon (Bottom Left) */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-8 left-6 md:bottom-8 md:left-8 p-0 hover:opacity-70 transition-opacity duration-300 cursor-pointer z-30 mix-blend-difference flex items-center justify-center"
          style={{ height: '24px', width: '24px' }} // Match height of social icons (size=20 + implicit padding or just align center)
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-secta-white" />
          ) : (
            <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-secta-white" />
          )}
        </button>
      </div>
    </div>
  );
}
