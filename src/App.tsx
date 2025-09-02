import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import './App.css';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState('main');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const glitchTimer = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 8000);
    return () => clearInterval(glitchTimer);
  }, []);

  // Create eerie background noise
  const createBackgroundNoise = () => {
    if (!audioContext) return null;

    // Create multiple oscillators for layered eerie sounds
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const oscillator3 = audioContext.createOscillator();
    
    const gainNode1 = audioContext.createGain();
    const gainNode2 = audioContext.createGain();
    const gainNode3 = audioContext.createGain();
    const masterGain = audioContext.createGain();
    
    // Low frequency rumble
    oscillator1.frequency.setValueAtTime(40, audioContext.currentTime);
    oscillator1.type = 'sawtooth';
    gainNode1.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    // Mid frequency drone
    oscillator2.frequency.setValueAtTime(120, audioContext.currentTime);
    oscillator2.type = 'square';
    gainNode2.gain.setValueAtTime(0.05, audioContext.currentTime);
    
    // High frequency whisper
    oscillator3.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator3.type = 'sine';
    gainNode3.gain.setValueAtTime(0.02, audioContext.currentTime);
    
    // Master volume
    masterGain.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    // Connect the audio graph
    oscillator1.connect(gainNode1);
    oscillator2.connect(gainNode2);
    oscillator3.connect(gainNode3);
    
    gainNode1.connect(masterGain);
    gainNode2.connect(masterGain);
    gainNode3.connect(masterGain);
    masterGain.connect(audioContext.destination);
    
    // Add subtle frequency modulation for eeriness
    const lfo = audioContext.createOscillator();
    const lfoGain = audioContext.createGain();
    lfo.frequency.setValueAtTime(0.1, audioContext.currentTime);
    lfoGain.gain.setValueAtTime(10, audioContext.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator1.frequency);
    
    return { oscillator1, oscillator2, oscillator3, lfo, masterGain };
  };

  const toggleAudio = async () => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
      
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      
      const noise = createBackgroundNoise();
      if (noise) {
        noise.oscillator1.start();
        noise.oscillator2.start();
        noise.oscillator3.start();
        noise.lfo.start();
        setIsAudioPlaying(true);
      }
    } else {
      if (isAudioPlaying) {
        audioContext.close();
        setAudioContext(null);
        setIsAudioPlaying(false);
      } else {
        const noise = createBackgroundNoise();
        if (noise) {
          noise.oscillator1.start();
          noise.oscillator2.start();
          noise.oscillator3.start();
          noise.lfo.start();
          setIsAudioPlaying(true);
        }
      }
    }
  };

  const handleButtonClick = (buttonType: string) => {
    // Trigger intense glitch effect
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 500);
    
    // Change section based on button
    setTimeout(() => {
      setCurrentSection(buttonType);
    }, 250);
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'enter':
        return (
          <div className="section-content">
            <h1 className="section-title">Y O U   H A V E   E N T E R E D</h1>
            <p className="section-text">The digital void welcomes you...</p>
            <p className="section-subtext">There is no escape from the Bear Backrooms</p>
            <button 
              className="cryptic-button"
              onClick={() => setCurrentSection('main')}
            >
              R E T U R N
            </button>
          </div>
        );
      case 'exit':
        return (
          <div className="section-content">
            <h1 className="section-title">E X I T   D E N I E D</h1>
            <p className="section-text">The Bear Backrooms do not release their visitors</p>
            <p className="section-subtext">You are part of the system now</p>
            <button 
              className="cryptic-button"
              onClick={() => setCurrentSection('main')}
            >
              A C C E P T
            </button>
          </div>
        );
      case 'noise':
        return (
          <div className="section-content">
            <h1 className="section-title">F O L L O W I N G   T H E   N O I S E</h1>
            <p className="section-text">Listen carefully... do you hear it?</p>
            <p className="section-subtext">The Bear whispers in frequencies beyond human perception</p>
            <div className="noise-visualizer">
              <div className="noise-bar"></div>
              <div className="noise-bar"></div>
              <div className="noise-bar"></div>
              <div className="noise-bar"></div>
              <div className="noise-bar"></div>
            </div>
            <button 
              className="cryptic-button"
              onClick={() => setCurrentSection('main')}
            >
              S I L E N C E
            </button>
          </div>
        );
      default:
        return (
          <>
            {/* Central Title */}
            <div className={`text-center mb-16 transition-all duration-2000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="bear-title text-4xl md:text-6xl lg:text-7xl font-mono tracking-[0.5em] mb-4">
                B E A R
              </h1>
              <h2 className="bear-subtitle text-2xl md:text-4xl lg:text-5xl font-mono tracking-[0.3em] opacity-80">
                B A C K R O O M S
              </h2>
              <div className="title-glitch"></div>
            </div>

            {/* Cryptic Buttons */}
            <div className="flex flex-col space-y-6 items-center">
              {buttons.map((button, index) => (
                <button
                  key={index}
                  className={`cryptic-button transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: button.delay }}
                  onClick={() => handleButtonClick(button.type)}
                >
                  <span className="button-text">{button.text}</span>
                  <div className="button-glitch"></div>
                </button>
              ))}
            </div>
          </>
        );
    }
  };
  const buttons = [
    { text: 'E N T E R', delay: '0.8s', type: 'enter' },
    { text: 'E X I T', delay: '1.2s', type: 'exit' },
    { text: 'F O L L O W   T H E   N O I S E', delay: '1.6s', type: 'noise' },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Grid Background */}
      <div className="grid-background">
        <div className="grid-lines"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Glitch Overlay */}
      <div className={`glitch-overlay ${glitchActive ? 'active' : ''}`}></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {renderContent()}

        {/* Audio Control */}
        <button
          className="audio-control"
          onClick={toggleAudio}
          title={isAudioPlaying ? "Disable ambient noise" : "Enable ambient noise"}
        >
          {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Subtle Status Indicator */}
        <div className={`absolute bottom-8 left-8 text-xs font-mono opacity-40 transition-all duration-2000 ${isLoaded ? 'opacity-40' : 'opacity-0'}`}>
          <div className="status-indicator">
            <span className="blinking-dot"></span>
            {currentSection === 'main' ? 'SYSTEM ACTIVE' : 'SIGNAL DETECTED'}
          </div>
        </div>

        {/* Corner Markers */}
        <div className="corner-markers">
          <div className="corner-marker top-left"></div>
          <div className="corner-marker top-right"></div>
          <div className="corner-marker bottom-left"></div>
          <div className="corner-marker bottom-right"></div>
        </div>
      </div>

      {/* Scanning Line Effect */}
      <div className="scanning-line"></div>
    </div>
  );
}

export default App;