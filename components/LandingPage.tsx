'use client'

import { useState, useRef, useEffect } from "react";
import { VideoBackground } from "@/components/VideoBackground";
import { DotGridOverlay } from "@/components/DotGridOverlay";
import { CRTOverlay } from "@/components/CRTOverlay";
import { Volume2, VolumeX, Plus, Settings, Copy, Check, Save, Instagram, Linkedin, Youtube, Clapperboard } from "lucide-react";
import { gsap } from "gsap";
import { PillButton } from "@/components/PillButton";
import Image from "next/image";

export function LandingPage() {
  const [isMuted, setIsMuted] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [interactionStep, setInteractionStep] = useState(0); // 0: Init, 1: CRT, 2: New Video

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
    videoUrl: "https://vimeo.com/846121038"
  });

  // Load saved params from localStorage on mount
  useEffect(() => {
    const savedParams = localStorage.getItem('secta-landing-params');
    if (savedParams) {
      try {
        setParams(JSON.parse(savedParams));
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
    <div className="relative w-full h-[100dvh] overflow-hidden font-sofia bg-secta-black text-secta-white">
      {/* Video Background */}
      <VideoBackground 
        videoUrl={params.videoUrl}
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
      <div className="relative z-20 w-full h-full flex flex-col justify-center p-6 md:p-12 lg:p-16">
        
        {/* Logo (Top Left) */}
        <div 
          ref={logoRef} 
          className="absolute top-6 left-6 md:top-8 md:left-8 z-30 w-[120px] md:w-[400px] opacity-0 cursor-pointer"
          onClick={handleLogoClick}
        >
           <Image 
             src="/logo-orange.png"  
             alt="SECTA" 
             width={320} 
             height={120} 
             className="w-full h-auto object-contain"
             priority
           />
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

        {/* Menu Icon (Top Right) */}
        <button 
          ref={menuButtonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-secta-orange flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer z-50 shadow-lg"
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        >
          <Plus 
            className={`w-5 h-5 md:w-6 md:h-6 text-secta-white transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : 'rotate-0'}`} 
            strokeWidth={3} 
          />
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

        {/* Debug Toggle (Bottom Right) */}
        <button 
          onClick={() => setShowDebug(!showDebug)}
          className="absolute bottom-0 right-0 p-0 w-[30px] h-[30px] bg-white/10 hover:bg-white/20 text-white/0 hover:text-white/100 z-50 transition-all overflow-hidden flex items-center justify-center"
          aria-label="Debug Settings"
        >
          <Settings size={20} />
        </button>

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
        <div className="max-w-[90%] md:max-w-[95%] mt-100 md:mt-auto mb-auto">
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
