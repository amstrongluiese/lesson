import { useEffect, useMemo, useRef, useState } from "react";
import { FooterSection, HeroSection, IntroSection, MediaSection, MemoriesSection, Navigation, ParticleCanvas, SectionDivider, SemanticsSection, SkeletonSection, StepsSection } from "./components";
import "./styles.css";

type MusicState = "muted" | "playing";

function App() {
  const [musicState, setMusicState] = useState<MusicState>("muted");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const augustSong = new URL("../august.mp3", import.meta.url).href;

  const collageImages = useMemo(
    () => [
      { src: new URL("../images/1.jpg", import.meta.url).href, alt: "Memory One", caption: "the first sketch", rotation: -8, top: "5%", left: "5%", width: 235 },
      { src: new URL("../images/2.jpg", import.meta.url).href, alt: "Memory Two", caption: "weaving structures", rotation: 4, top: "12%", left: "36%", width: 245, zIndex: 5 },
      { src: new URL("../images/3.jpg", import.meta.url).href, alt: "Memory Three", caption: "deep connections", rotation: -5, top: "8%", left: "68%", width: 235 },
      { src: new URL("../images/4.jpg", import.meta.url).href, alt: "Memory Four", caption: "rustic trails", rotation: 11, top: "48%", left: "8%", width: 240, zIndex: 2 },
      { src: new URL("../images/5.jpg", import.meta.url).href, alt: "Memory Five", caption: "handwritten lore", rotation: -6, top: "44%", left: "37%", width: 255, zIndex: 10 },
      { src: new URL("../images/6.jpg", import.meta.url).href, alt: "Memory Six", caption: "the twilight arch", rotation: 9, top: "50%", left: "68%", width: 240, zIndex: 3 },
    ],
    []
  );

  useEffect(() => {
    const reveals = document.querySelectorAll<HTMLElement>(".reveal");
    const progressBar = document.getElementById("scroll-progress");

    const revealOnScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

      if (progressBar) {
        progressBar.style.width = `${scrolled}%`;
      }

      const windowHeight = window.innerHeight;
      reveals.forEach((reveal) => {
        const revealTop = reveal.getBoundingClientRect().top;
        if (revealTop < windowHeight - 100) {
          reveal.classList.add("active");
        }
      });
    };

    revealOnScroll();
    window.addEventListener("scroll", revealOnScroll);
    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  useEffect(() => {
    const loader = document.getElementById("cinematic-loader");
    const text1 = document.getElementById("loader-text-1");
    const text2 = document.getElementById("loader-text-2");

    const timers = [
      window.setTimeout(() => {
        if (text1) text1.style.opacity = "1";
      }, 500),
      window.setTimeout(() => {
        if (text2) text2.style.opacity = "1";
      }, 2000),
      window.setTimeout(() => {
        if (loader) {
          loader.style.opacity = "0";
          window.setTimeout(() => {
            loader.style.display = "none";
          }, 1500);
        }
      }, 4500),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const canvasElement = canvas;
    const ctx = context;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const particleCount = Math.max(30, Math.floor((window.innerWidth * window.innerHeight) / 15000));
    let animationFrame = 0;
    let particles: Particle[] = [];
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvasElement.width;
        this.y = Math.random() * canvasElement.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = Math.random() > 0.5 ? "rgba(255, 255, 255, 0.6)" : "rgba(209, 201, 184, 0.6)";
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (isFinePointer) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            this.x -= dx * 0.01;
            this.y -= dy * 0.01;
          }
        }

        if (this.x < 0 || this.x > canvasElement.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvasElement.height) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const resizeCanvas = () => {
      canvasElement.width = window.innerWidth;
      canvasElement.height = window.innerHeight;
      particles = Array.from({ length: particleCount }, () => new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      animationFrame = window.requestAnimationFrame(animate);
    };

    resizeCanvas();

    if (isFinePointer) {
      const onMouseMove = (event: MouseEvent) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("resize", resizeCanvas);
      animate();

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", resizeCanvas);
        window.cancelAnimationFrame(animationFrame);
      };
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const onFirstInteraction = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("#music-toggle")) return;

      setMusicState("playing");
    };

    window.addEventListener("scroll", onFirstInteraction, { once: true });
    document.body.addEventListener("click", onFirstInteraction, { once: true });
    document.body.addEventListener("touchstart", onFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("scroll", onFirstInteraction);
      document.body.removeEventListener("click", onFirstInteraction);
      document.body.removeEventListener("touchstart", onFirstInteraction);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicState === "playing") {
      void audio.play().catch(() => {
        setMusicState("muted");
      });
      return;
    }

    audio.pause();
  }, [musicState]);

  return (
    <div className="app-shell">
      <div id="scroll-progress" />

      <div className="film-grain" />
      <div className="fog-bg" />
      <ParticleCanvas />
      <audio ref={audioRef} src={augustSong} loop preload="auto" />

      <div className="fog-container animate-slow-pan">
        <div className="fog-layer" />
        <div className="fog-layer" />
      </div>
      <div className="fog-container animate-slow-pan-reverse fog-container-secondary">
        <div className="fog-layer" />
        <div className="fog-layer" />
      </div>

      <div id="cinematic-loader">
        <div className="loader-copy text-center px-4">
          <h1 className="loader-title" id="loader-text-1">
            Take a deep breath...
          </h1>
          <p className="loader-subtitle" id="loader-text-2">
            let the story of the web unfold.
          </p>
        </div>
      </div>

      <Navigation />

      <div className="music-toggle-wrap">
        <button
          id="music-toggle"
          className="music-toggle glass-card"
          type="button"
          aria-label={musicState === "playing" ? "Mute ambient music" : "Play ambient music"}
          onClick={(event) => {
            event.stopPropagation();
            setMusicState((current) => (current === "playing" ? "muted" : "playing"));
          }}
        >
          <span className="music-toggle-label">{musicState === "playing" ? "♫" : "♪"}</span>
        </button>
      </div>

      <main className="page-main">
        <HeroSection />
        <IntroSection />
        <SkeletonSection />
        <SectionDivider />
        <MediaSection />
        <SemanticsSection />
        <StepsSection />
        <MemoriesSection images={collageImages} />
        <FooterSection />
      </main>
    </div>
  );
}

export default App;
