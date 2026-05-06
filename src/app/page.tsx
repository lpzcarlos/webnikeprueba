"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ShoppingCart, ArrowRight, Zap, Wind, Hexagon } from "lucide-react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  // Use framer-motion to track scroll progress over the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth scroll progress for certain UI elements
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 15,
  });

  // Video time update based on scroll with optimizations
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let ticking = false;
    let scrollActive = false;

    // Optimized scroll handler using requestAnimationFrame
    const manejarScroll = () => {
      if (!ticking && duration > 0) {
        requestAnimationFrame(() => {
          // Use framer-motion's scroll progress (0 to 1) 
          // or manually calculate: const scrollTop = window.scrollY; const maxScroll = document.body.scrollHeight - window.innerHeight;
          const scrollFraction = scrollYProgress.get();
          
          let targetTime = scrollFraction * duration;
          targetTime = Math.max(0, Math.min(targetTime, duration - 0.1));
          
          // Apply easing for smoothness even with event-based updates
          const currentTime = video.currentTime;
          const nextTime = currentTime + (targetTime - currentTime) * 0.15;
          
          if (Math.abs(video.currentTime - nextTime) > 0.01) {
            video.currentTime = nextTime;
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleCanPlayThrough = () => {
      setDuration(video.duration);
      video.pause();
      if (!scrollActive) {
        window.addEventListener('scroll', manejarScroll, { passive: true });
        scrollActive = true;
        console.log('Vídeo listo, scroll activado');
      }
    };

    // Load duration early if metadata is ready
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      video.pause();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplaythrough", handleCanPlayThrough);
    
    // In case it's already fully loaded
    if (video.readyState >= 4) { // HAVE_ENOUGH_DATA
      handleCanPlayThrough();
    } else if (video.readyState >= 1) { // HAVE_METADATA
      handleLoadedMetadata();
    }

    // Attempt to preload full video
    fetch("/adnike.mp4")
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        video.src = url;
      })
      .catch((err) => console.error("Error preloading video", err));

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      if (scrollActive) {
        window.removeEventListener('scroll', manejarScroll);
      }
    };
  }, [scrollYProgress, duration]);

  // Opacity transforms for different sections based on scroll progress
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);
  
  const feature1Opacity = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
  const feature1Y = useTransform(scrollYProgress, [0.2, 0.3], [50, 0]);
  
  const feature2Opacity = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.8], [0, 1, 1, 0]);
  const feature2Y = useTransform(scrollYProgress, [0.5, 0.6], [50, 0]);
  
  const ctaOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const ctaScale = useTransform(scrollYProgress, [0.8, 0.9], [0.9, 1]);

  return (
    <div className="relative bg-black min-h-screen w-full overflow-hidden text-white">
      {/* Navbar (Fixed) */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-6 mix-blend-difference pointer-events-none">
        <div className="flex-1">
          <Image 
            src="/logonike.png" 
            alt="Nike Logo" 
            width={60} 
            height={30} 
            className="invert opacity-90"
          />
        </div>
        <div className="hidden md:flex flex-1 justify-center gap-8 font-display tracking-widest text-sm opacity-80">
          <span>THE ICON</span>
          <span>PERFORMANCE</span>
          <span>HERITAGE</span>
        </div>
        <div className="flex-1 flex justify-end">
          <motion.div 
            className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md pointer-events-auto cursor-pointer hover:bg-white hover:text-black transition-colors"
          >
            <ShoppingCart size={18} />
          </motion.div>
        </div>
      </nav>

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-[var(--neon-accent)] z-50 origin-left"
        style={{ scaleX: smoothProgress, width: "100%" }}
      />

      {/* Fixed Video Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
        >
          <source src="/adnike.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Scrollable Container spanning multiple viewports */}
      <div ref={containerRef} className="relative z-20 w-full" style={{ height: "400vh" }}>
        
        {/* SECTION 1: HERO */}
        <motion.div 
          className="sticky top-0 left-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <Image 
              src="/forcelogo.png" 
              alt="Force Logo" 
              width={200} 
              height={100} 
              className="invert mb-6 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            />
            <h1 className="font-display text-[12vw] leading-none m-0 hero-text-shadow tracking-tighter mix-blend-overlay">
              FORCE
            </h1>
            <h2 className="font-display text-4xl md:text-6xl text-[var(--neon-accent)] mt-[-1vw] tracking-wider uppercase">
              Beyond Limits
            </h2>
            <div className="mt-8 flex flex-col items-center gap-2 opacity-50 animate-bounce">
              <span className="text-xs uppercase tracking-widest font-body">Scroll to explore</span>
              <ArrowRight size={16} className="rotate-90" />
            </div>
          </motion.div>
        </motion.div>

        {/* SECTION 2: FEATURE 1 */}
        <motion.div 
          className="fixed top-0 left-0 w-full h-screen flex items-center justify-start p-8 md:p-24 pointer-events-none"
          style={{ opacity: feature1Opacity, y: feature1Y }}
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-4 text-[var(--neon-accent)]">
              <Zap size={24} />
              <h3 className="font-display tracking-widest text-xl">01 // RESPONSIVE KINETICS</h3>
            </div>
            <h2 className="font-display text-6xl md:text-8xl leading-[0.85] mb-6 uppercase">
              Absolute<br />Control
            </h2>
            <p className="font-body text-lg md:text-xl text-white/70 leading-relaxed font-light">
              Engineered with precision. The new Nike Force adapts to your movement instantly. 
              The sculpted sole provides unprecedented traction, turning raw energy into explosive forward momentum.
            </p>
          </div>
        </motion.div>

        {/* SECTION 3: FEATURE 2 */}
        <motion.div 
          className="fixed top-0 left-0 w-full h-screen flex items-center justify-end p-8 md:p-24 text-right pointer-events-none"
          style={{ opacity: feature2Opacity, y: feature2Y }}
        >
          <div className="max-w-xl flex flex-col items-end">
            <div className="flex items-center gap-4 mb-4 text-[var(--neon-accent)] flex-row-reverse">
              <Wind size={24} />
              <h3 className="font-display tracking-widest text-xl">02 // AERODYNAMIC MESH</h3>
            </div>
            <h2 className="font-display text-6xl md:text-8xl leading-[0.85] mb-6 uppercase">
              Defy<br />Gravity
            </h2>
            <p className="font-body text-lg md:text-xl text-white/70 leading-relaxed font-light text-right">
              Ultra-lightweight upper construction breathes life into every step. 
              It wraps around your foot like a second skin, shedding ounces without compromising on structural integrity.
            </p>
          </div>
        </motion.div>

        {/* SECTION 4: CALL TO ACTION */}
        <motion.div 
          className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center pointer-events-auto"
          style={{ opacity: ctaOpacity, scale: ctaScale }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />
          <div className="z-10 flex flex-col items-center text-center p-6">
            <Hexagon size={48} className="text-[var(--neon-accent)] mb-8" strokeWidth={1} />
            <h2 className="font-display text-7xl md:text-9xl mb-4 tracking-tighter uppercase hero-text-shadow">
              Own The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--neon-accent)]">Force</span>
            </h2>
            <p className="font-body text-xl md:text-2xl text-white/80 max-w-2xl mb-12 font-light">
              The evolution of the icon is complete. Experience the pinnacle of performance and streetwear design.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="group relative px-10 py-5 bg-white text-black font-display tracking-widest text-xl uppercase overflow-hidden hover:scale-105 transition-transform duration-300">
                <span className="relative z-10 flex items-center gap-2">
                  Buy Now <ShoppingCart size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-[var(--neon-accent)] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0" />
              </button>
              
              <button className="px-10 py-5 border border-white/30 text-white font-display tracking-widest text-xl uppercase hover:bg-white/10 transition-colors duration-300 backdrop-blur-md">
                View Gallery
              </button>
            </div>
            
            <div className="mt-16 flex gap-8 items-center border-t border-white/20 pt-8 text-white/50 text-sm font-body">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> In Stock</span>
              <span>Free Global Shipping</span>
              <span>30-Day Returns</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

