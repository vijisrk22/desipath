import React, { useState, useEffect, useRef } from "react";

export default function MobileSplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);

  // Check if mobile device
  const isMobile = () => {
    if (typeof window === "undefined") return false;
    return (
      window.innerWidth <= 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent || ""
      )
    );
  };

  const [shouldRender, setShouldRender] = useState(() => isMobile());

  const handleDismiss = () => {
    setFadeOut(true);
    setTimeout(() => {
      setVisible(false);
      setShouldRender(false);
      document.body.style.overflow = "";
      if (onComplete) onComplete();
    }, 600);
  };

  useEffect(() => {
    if (!shouldRender) return;

    // Lock body scroll while splash screen is active
    document.body.style.overflow = "hidden";

    // 6-second total display: start fade out at 5.3s, complete at 6.0s
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 5300);

    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setShouldRender(false);
      document.body.style.overflow = "";
      if (onComplete) onComplete();
    }, 6000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(dismissTimer);
      document.body.style.overflow = "";
    };
  }, [shouldRender]);

  // Fireworks Animation Engine
  useEffect(() => {
    if (!shouldRender || !visible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles = [];
    const fireworks = [];

    // Festive Indian / Desipath color palette (Saffron, Gold, Emerald, Azure, Crimson, Purple)
    const colors = [
      { r: 255, g: 130, b: 0 },   // Saffron Orange
      { r: 255, g: 200, b: 0 },   // Royal Gold
      { r: 20, g: 195, b: 142 },  // Festive Emerald
      { r: 56, g: 189, b: 248 },  // Sky / Azure Blue
      { r: 244, g: 63, b: 94 },   // Crimson Rose
      { r: 192, g: 132, b: 252 }, // Bright Violet
      { r: 255, g: 255, b: 255 }, // Sparkling White
    ];

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1.2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.friction = 0.96;
        this.gravity = 0.07;
        this.alpha = 1;
        this.decay = Math.random() * 0.016 + 0.012;
        this.size = Math.random() * 2.6 + 1.2;
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Firework {
      constructor(targetX, targetY) {
        this.x = targetX || Math.random() * (width - 60) + 30;
        this.y = height + 10;
        this.targetY = targetY || Math.random() * (height * 0.45) + height * 0.12;
        this.speed = Math.random() * 3.5 + 7.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.exploded = false;
        this.trail = [];
      }

      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 5) this.trail.shift();

        this.y -= this.speed;
        if (this.y <= this.targetY) {
          this.exploded = true;
          this.explode();
        }
      }

      explode() {
        const count = Math.floor(Math.random() * 20) + 35;
        for (let i = 0; i < count; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }
      }

      draw() {
        ctx.save();
        ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Rocket Trail
        ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.4)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < this.trail.length; i++) {
          const pt = this.trail[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
        ctx.restore();
      }
    }

    // Trigger initial bursts around the logo on launch
    const triggerInitialBursts = () => {
      const centerX = width / 2;
      const centerY = height * 0.38;
      for (let i = 0; i < 45; i++) {
        particles.push(new Particle(centerX - 40, centerY - 20, colors[0]));
        particles.push(new Particle(centerX + 40, centerY - 20, colors[1]));
        particles.push(new Particle(centerX, centerY + 25, colors[2]));
      }
    };

    triggerInitialBursts();

    // Launch recurring fireworks
    const interval = setInterval(() => {
      fireworks.push(new Firework());
      if (Math.random() > 0.45) {
        setTimeout(() => fireworks.push(new Firework()), 160);
      }
    }, 420);

    const render = () => {
      ctx.fillStyle = "rgba(7, 11, 20, 0.22)";
      ctx.fillRect(0, 0, width, height);

      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        if (fireworks[i].exploded) {
          fireworks.splice(i, 1);
        } else {
          fireworks[i].draw();
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
        } else {
          particles[i].draw();
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [shouldRender, visible]);

  if (!shouldRender || !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col justify-between items-center select-none overflow-hidden transition-all duration-700 ease-out ${
        fadeOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: "radial-gradient(ellipse at center, #111827 0%, #060911 100%)",
      }}
    >
      {/* Background Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Top Header Row with Skip Button */}
      <div className="relative z-10 w-full flex items-center justify-between px-6 pt-7">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] font-bold tracking-widest uppercase text-white/70">
            Desipath
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-xs font-medium text-white/70 hover:text-white px-3.5 py-1.5 rounded-full border border-white/15 bg-white/10 backdrop-blur-md transition-all active:scale-95 shadow-lg shadow-black/20"
        >
          Skip ✕
        </button>
      </div>

      {/* Center Branding Content with Flash Logo & Fireworks Aura */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        {/* Pulsing Colorful Glow Behind Logo */}
        <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-orange-500/35 via-amber-400/25 to-blue-500/30 blur-3xl pointer-events-none animate-pulse" />

        {/* Logo Container with App Launch Sheen */}
        <div className="relative">
          {/* Animated decorative ring */}
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 opacity-60 blur-sm animate-pulse" />
          
          <div className="relative px-8 py-5 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden">
            {/* Shimmer sweeping light */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            
            <img
              src="/desipath-logo-white.png"
              alt="Desipath Logo"
              className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-[0_8px_20px_rgba(255,164,28,0.5)] transform animate-[float_3s_ease-in-out_infinite]"
            />
          </div>
        </div>

        {/* Brand Tagline */}
        <div className="mt-7 flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-200 tracking-tight">
            Built by desis, for desis
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1.5 tracking-wide">
            Your Trusted Indian Community Network
          </p>
        </div>

        {/* Festive Celebration Badge */}
        <div className="mt-5 flex items-center gap-2 text-xs text-amber-300 font-semibold px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-400/30 backdrop-blur-md shadow-lg shadow-amber-500/10">
          <span>🎆</span>
          <span>Connecting Desis Across North America</span>
          <span>✨</span>
        </div>
      </div>

      {/* Bottom Loading Progress Section */}
      <div className="relative z-10 w-full px-8 pb-12 flex flex-col items-center">
        <div className="w-full max-w-[240px]">
          {/* 6-second progress bar */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(251,146,60,0.8)]"
              style={{
                animation: "splashProgress 5.3s cubic-bezier(0.1, 0.4, 0.2, 1) forwards",
              }}
            />
          </div>
        </div>

        {/* Loading status text */}
        <p className="mt-3.5 text-[11px] font-bold text-gray-400 tracking-widest uppercase flex items-center gap-2">
          <span>Loading Desipath</span>
          <span className="flex gap-1 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
          </span>
        </p>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes splashProgress {
          0% { width: 0%; }
          20% { width: 35%; }
          50% { width: 68%; }
          80% { width: 88%; }
          100% { width: 100%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
