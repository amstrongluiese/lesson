import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";

type LessonTwoProps = {
  onNavigateHome: () => void;
};

type ScrapStyle = {
  top: string;
  left?: string;
  right?: string;
  zIndex: number;
  rotation: number;
  speed: number;
};

function RealisticPaperPlane() {
  return (
    <svg className="lesson2-plane-svg" viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="lesson2-paper-grain" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 0.9 0 0 0  0 0.8 0 0 0  0 0 0 0.15 0"
            in="noise"
            result="coloredNoise"
          />
          <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" />
        </filter>
        <linearGradient id="lesson2-left-outer" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e3dfd5" />
          <stop offset="100%" stopColor="#a39f97" />
        </linearGradient>
        <linearGradient id="lesson2-right-outer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdfcf8" />
          <stop offset="100%" stopColor="#d1cdc5" />
        </linearGradient>
        <linearGradient id="lesson2-left-inner" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6e6b66" />
          <stop offset="100%" stopColor="#8f8c85" />
        </linearGradient>
        <linearGradient id="lesson2-right-inner" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b8b4ab" />
          <stop offset="100%" stopColor="#8f8c85" />
        </linearGradient>
      </defs>
      <g filter="url(#lesson2-paper-grain)">
        <polygon points="80,10 10,110 70,125" fill="url(#lesson2-left-outer)" />
        <polygon points="80,10 150,100 90,120" fill="url(#lesson2-right-outer)" />
        <polygon points="80,10 70,125 80,165" fill="url(#lesson2-left-inner)" />
        <polygon points="80,10 90,120 80,165" fill="url(#lesson2-right-inner)" />
        <line x1="80" y1="10" x2="80" y2="165" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
        <line x1="80" y1="10" x2="70" y2="125" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
        <line x1="80" y1="10" x2="90" y2="120" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      </g>
    </svg>
  );
}

function BackgroundEffects() {
  const particles = useMemo(
    () =>
      Array.from({ length: 35 }, (_, index) => ({
        id: index,
        size: 1 + Math.random() * 3,
        left: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 10 + Math.random() * 20,
      })),
    []
  );

  return (
    <div className="lesson2-background" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="lesson2-particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            animationDelay: `-${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
      <div className="lesson2-floating-paper lesson2-floating-paper-one lesson2-crumpled-paper">
        <p>scratch idea #4...</p>
      </div>
      <div className="lesson2-floating-paper lesson2-floating-paper-two lesson2-torn-paper" />
      <div className="lesson2-floating-paper lesson2-floating-paper-three lesson2-polaroid" />
    </div>
  );
}

function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [isFlying, setIsFlying] = useState(false);
  const startPoint = useRef({ x: 0, y: 0 });
  const completeIntro = (xDirection = 1, yDirection = -1) => {
    if (isFlying) return;

    setIsFlying(true);
    setDrag({
      x: window.innerWidth * xDirection * 1.4,
      y: window.innerHeight * yDirection * 1.2,
    });
    window.setTimeout(onComplete, 900);
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (isFlying) return;
    startPoint.current = { x: event.clientX - drag.x, y: event.clientY - drag.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (isFlying || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    setDrag({
      x: event.clientX - startPoint.current.x,
      y: event.clientY - startPoint.current.y,
    });
  };

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (isFlying) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    const distance = Math.hypot(drag.x, drag.y);

    if (distance < 50) {
      completeIntro(1, -1);
      return;
    }

    const dirX = drag.x >= 0 ? 1 : -1;
    const dirY = drag.y >= 0 ? 1 : -1;
    completeIntro(dirX, dirY);
  };

  return (
    <div className={`lesson2-intro ${isFlying ? "lesson2-intro-flying" : ""}`}>
      <div className="lesson2-old-wall" />
      <div className="lesson2-intro-copy">
        <p>Tap or swipe the paper plane to begin</p>
        <span />
      </div>
      <button
        className={`lesson2-plane-button ${isFlying ? "is-flying" : ""}`}
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          transform: `translate3d(${drag.x}px, ${drag.y}px, 0) rotate(${isFlying ? drag.x * 0.04 : -45}deg) scale(${isFlying ? 2.6 : 1})`,
        }}
        aria-label="Swipe the paper plane to open Lesson 2"
      >
        <RealisticPaperPlane />
      </button>
    </div>
  );
}

function Header() {
  return (
    <header className="lesson2-hero">
      <div className="lesson2-hero-photo" />
      <div className="lesson2-hero-inner">
        <span className="lesson2-type-key key-h">H</span>
        <span className="lesson2-type-key key-t">T</span>
        <span className="lesson2-type-key key-m">M</span>
        <span className="lesson2-type-key key-l">L</span>

        <p className="lesson2-hand lesson2-kicker">Welcome to</p>
        <h1>
          THE TORTURED
          <br />
          <span>coders</span>
          <br />
          DEPARTMENT
        </h1>
        <div className="lesson2-title-pill">A manuscript on the Syntax of HTML</div>
        <div className="lesson2-scroll-note">
          <p>Scroll to open the typewriter</p>
          <span />
        </div>
      </div>
    </header>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return <div className="lesson2-code">{children}</div>;
}

function ScrollRevealSection({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="lesson2-section">
      <h2>{title}</h2>
      <h3>{subtitle}</h3>
      {children}
    </section>
  );
}

function Chapters() {
  return (
    <div className="lesson2-chapters">
      <ScrollRevealSection title="I." subtitle="The Blank Page">
        <article className="lesson2-journal">
          <span className="lesson2-tape tape-top" />
          <span className="lesson2-wax">I</span>
          <p className="lesson2-hand lesson2-note">the root of it all...</p>

          <div className="lesson2-two-column">
            <p>
              Before a poem can be written, we must load the paper into the carriage.{" "}
              <strong>HTML (HyperText Markup Language)</strong> requires a specific foundation, a skeleton that tells
              the browser how to read our confessions.
            </p>
            <figure className="lesson2-polaroid lesson2-card-photo">
              <img
                src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=500&q=80"
                alt="Blank books"
              />
              <figcaption>empty pages</figcaption>
            </figure>
          </div>

          <h4>The Document Structure</h4>
          <p>
            Every HTML document is divided into two realms: <code>&lt;head&gt;</code>, the mind holding metadata, and{" "}
            <code>&lt;body&gt;</code>, the heart containing what the world will see.
          </p>
          <CodeBlock>
            <span className="muted">&lt;!-- The declaration of truth --&gt;</span>
            <br />
            <span className="tag">&lt;!DOCTYPE html&gt;</span>
            <br />
            <span className="tag">&lt;html</span> <span className="attr">lang</span>=<span className="value">"en"</span>
            <span className="tag">&gt;</span>
            <br />
            <br />
            &nbsp;&nbsp;<span className="tag">&lt;head&gt;</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="tag">&lt;title&gt;</span>My Secret Diary
            <span className="tag">&lt;/title&gt;</span>
            <br />
            &nbsp;&nbsp;<span className="tag">&lt;/head&gt;</span>
            <br />
            <br />
            &nbsp;&nbsp;<span className="tag">&lt;body&gt;</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="muted">&lt;!-- What the reader beholds --&gt;</span>
            <br />
            &nbsp;&nbsp;<span className="tag">&lt;/body&gt;</span>
            <br />
            <br />
            <span className="tag">&lt;/html&gt;</span>
          </CodeBlock>
        </article>
      </ScrollRevealSection>

      <ScrollRevealSection title="II." subtitle="The Anatomy of a Tag">
        <article className="lesson2-journal">
          <h4>Opening & Closing</h4>
          <p>
            HTML uses tags wrapped in angle brackets <code>&lt; &gt;</code>. The opening tag begins the thought; the
            closing tag, marked with <code>/</code>, puts it to rest.
          </p>
          <CodeBlock>
            <span className="tag">&lt;p&gt;</span>I loved you in secret.<span className="tag">&lt;/p&gt;</span>
          </CodeBlock>

          <h4>Emphasis & Poetry</h4>
          <p>
            We use <code>&lt;em&gt;</code> for italicized emphasis, <code>&lt;strong&gt;</code> for importance, and{" "}
            <code>&lt;blockquote&gt;</code> for borrowed words.
          </p>
          <CodeBlock>
            <span className="tag">&lt;p&gt;</span>
            <br />
            &nbsp;&nbsp;I am <span className="tag">&lt;strong&gt;</span>terrified
            <span className="tag">&lt;/strong&gt;</span> of how much I <span className="tag">&lt;em&gt;</span>care
            <span className="tag">&lt;/em&gt;</span>.
            <br />
            <span className="tag">&lt;/p&gt;</span>
            <br />
            <br />
            <span className="tag">&lt;blockquote&gt;</span>"All is fair in love and poetry."
            <span className="tag">&lt;/blockquote&gt;</span>
          </CodeBlock>
        </article>
      </ScrollRevealSection>

      <ScrollRevealSection title="III." subtitle="Hidden Attributes">
        <article className="lesson2-journal">
          <span className="lesson2-tape tape-bottom" />
          <p>
            Attributes are the secrets kept inside the opening tag. They provide identity, destination, or source, and
            they usually follow the format <code>name="value"</code>.
          </p>

          <h4>The Anchor (Links)</h4>
          <p>
            The <code>&lt;a&gt;</code> tag connects us to other memories. It relies on <code>href</code> to know where to
            send the reader.
          </p>
          <CodeBlock>
            <span className="tag">&lt;a</span> <span className="attr">href</span>=
            <span className="value">"https://the-lakes.com"</span>
            <span className="tag">&gt;</span>Take me to the lakes<span className="tag">&lt;/a&gt;</span>
          </CodeBlock>

          <h4>The Image</h4>
          <p>
            The <code>&lt;img&gt;</code> tag embeds visual artifacts. It requires <code>src</code> and <code>alt</code>,
            a text description if the memory fails to load.
          </p>
          <CodeBlock>
            <span className="tag">&lt;img</span>
            <br />
            &nbsp;&nbsp;<span className="attr">src</span>=<span className="value">"polaroid.jpg"</span>
            <br />
            &nbsp;&nbsp;<span className="attr">alt</span>=<span className="value">"Me and you by the door"</span>
            <span className="tag">&gt;</span>
          </CodeBlock>
        </article>
      </ScrollRevealSection>
    </div>
  );
}

function FinaleDesk() {
  const scraps: Array<ScrapStyle & { kind: "photo" | "note" | "placeholder"; title: string; src?: string }> = [
    {
      kind: "photo",
      title: "draft 01.",
      src: "https://images.unsplash.com/photo-1518826727449-ae1dc237dc6b?auto=format&fit=crop&w=600&q=80",
      top: "5%",
      left: "5%",
      zIndex: 5,
      rotation: -5,
      speed: 0.8,
    },
    { kind: "note", title: "Always remember to close the tags. Or the formatting bleeds into everything else.", top: "16%", left: "36%", zIndex: 10, rotation: 12, speed: 1.2 },
    {
      kind: "photo",
      title: "the archives",
      src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
      top: "27%",
      right: "8%",
      zIndex: 7,
      rotation: 8,
      speed: 0.9,
    },
    { kind: "placeholder", title: "[INSERT PHOTO 1]", top: "48%", right: "24%", zIndex: 3, rotation: -15, speed: 0.6 },
    {
      kind: "photo",
      title: "unsent tags",
      src: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=600&q=80",
      top: "58%",
      left: "10%",
      zIndex: 15,
      rotation: -3,
      speed: 1.1,
    },
  ];

  return (
    <section className="lesson2-finale">
      <div className="lesson2-finale-heading">
        <h2>V. Discarded Drafts</h2>
        <p>The fragments left on the desk</p>
        <span />
        <em>hover over the torn pieces...</em>
      </div>

      <div className="lesson2-desk">
        {scraps.map((scrap) => (
          <div
            key={scrap.title}
            className="lesson2-scrap"
            style={{
              top: scrap.top,
              left: scrap.left,
              right: scrap.right,
              zIndex: scrap.zIndex,
              transform: `rotate(${scrap.rotation}deg)`,
              animationDuration: `${9 / scrap.speed}s`,
            }}
          >
            {scrap.kind === "photo" && (
              <figure className="lesson2-polaroid">
                <img src={scrap.src} alt={scrap.title} />
                <figcaption>{scrap.title}</figcaption>
              </figure>
            )}
            {scrap.kind === "note" && (
              <div className="lesson2-crumpled-paper lesson2-note-scrap">
                <span className="lesson2-wax small">T</span>
                <p className="lesson2-hand">Note to self:</p>
                <p>{scrap.title}</p>
              </div>
            )}
            {scrap.kind === "placeholder" && (
              <div className="lesson2-torn-paper lesson2-placeholder">
                <span>{scrap.title}</span>
                <code>&lt;img src="..." /&gt;</code>
              </div>
            )}
          </div>
        ))}

        <span className="lesson2-type-key desk-key-one">&lt;</span>
        <span className="lesson2-type-key desk-key-two">/</span>
        <span className="lesson2-type-key desk-key-three">&gt;</span>
      </div>

      <footer className="lesson2-end">
        <p>&lt;/end_of_manuscript&gt;</p>
        <small>Department of Web Poetics 2026</small>
      </footer>
    </section>
  );
}

function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const augustSong = new URL("../august.mp3", import.meta.url).href;

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  return (
    <div className="lesson2-audio">
      <div className="lesson2-audio-copy">
        <span>august.mp3</span>
        <span>click to play/pause</span>
      </div>
      <button type="button" onClick={toggleMusic} aria-label={isPlaying ? "Pause music" : "Play music"}>
        <span className={isPlaying ? "is-spinning" : ""}>
          <i />
        </span>
      </button>
      <audio ref={audioRef} src={augustSong} loop preload="auto" />
    </div>
  );
}

export default function LessonTwo({ onNavigateHome }: LessonTwoProps) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="lesson2-shell">
      <button className="lesson-switcher lesson-switcher-dark" type="button" onClick={onNavigateHome}>
        Lesson 1
      </button>

      <div className="lesson2-film-grain" />
      <div className="lesson2-vignette" />
      <BackgroundEffects />

      {showIntro && <CinematicIntro onComplete={() => setShowIntro(false)} />}

      {!showIntro && (
        <div className="lesson2-content">
          <Header />
          <Chapters />
          <FinaleDesk />
          <AudioPlayer />
        </div>
      )}
    </div>
  );
}
