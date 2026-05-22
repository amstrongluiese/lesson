import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import Lenis from "lenis";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

let sharedAudioContext: AudioContext | null = null;

type LessonTwoProps = {
  onNavigateHome: () => void;
};

type EvidencePhoto = {
  label: string;
  title: string;
  caption: string;
  src: string;
  zIndex: number;
  rotation: number;
  speed: number;
};

const SECRET_CODE = "TTPD";
const ACTIVITY_SUBMISSION_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwv2FMFAbTQ-1S4PEyiS9Fo-K3ipJxTf_L8DNL2L2p5Z6XIB-yAYYMhDWqUT6xsWt63PA/exec";
const ACTIVITY_UPLOAD_TIMEOUT_MS = 45000;
const INTRO_DUST_COUNT = 14;
const TYPE_BAR_COUNT = 9;
const INTRO_PLACEHOLDER = "awaiting file code...";
const INTRO_DUST_PARTICLES = Array.from({ length: INTRO_DUST_COUNT }, (_, index) => ({
  delay: `${index * -0.52}s`,
  left: `${(index * 31) % 100}%`,
  size: `${2 + (index % 3)}px`,
}));
const TYPE_BARS = Array.from({ length: TYPE_BAR_COUNT }, (_, index) => ({
  angle: `${-32 + index * 8}deg`,
  height: `${5.1 + (index % 4) * 0.18}rem`,
}));
const TYPEWRITER_ROWS = [
  {
    id: "numbers",
    offset: -2,
    keys: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6", value: "6" },
      { label: "7", value: "7" },
      { label: "8", value: "8" },
      { label: "9", value: "9" },
      { label: "0", value: "0" },
      { label: "-", value: "-" },
      { label: "=", value: "=" },
    ],
  },
  {
    id: "top",
    offset: 12,
    keys: "QWERTYUIOP".split("").map((letter) => ({ label: letter, value: letter })),
  },
  {
    id: "home",
    offset: 28,
    keys: [
      ...("ASDFGHJKL".split("").map((letter) => ({ label: letter, value: letter }))),
      { label: ";", value: ";" },
      { label: "'", value: "'" },
    ],
  },
  {
    id: "bottom",
    offset: 48,
    keys: [
      ...("ZXCVBNM".split("").map((letter) => ({ label: letter, value: letter }))),
      { label: ",", value: "," },
      { label: ".", value: "." },
      { label: "/", value: "/" },
    ],
  },
];
const SCROLL_POLAROIDS = [
  { src: new URL("../images/a.jpg", import.meta.url).href, label: "syntax file", top: "18%", left: "3%", rotation: "-8deg", delay: "0s" },
  { src: new URL("../images/b.jpg", import.meta.url).href, label: "archive note", top: "34%", right: "4%", rotation: "7deg", delay: "-1.5s" },
  { src: new URL("../images/c.jpg", import.meta.url).href, label: "memory proof", top: "50%", left: "6%", rotation: "5deg", delay: "-2.2s" },
  { src: new URL("../images/d.jpg", import.meta.url).href, label: "submitted draft", top: "66%", right: "5%", rotation: "-6deg", delay: "-0.8s" },
  { src: new URL("../images/e.jpg", import.meta.url).href, label: "final exhibit", top: "82%", left: "4%", rotation: "9deg", delay: "-2.9s" },
];

type SyntaxLesson = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  tags: string[];
  code: string;
  preview: React.ReactNode;
  note: string;
};

type UploadStatus = "idle" | "ready" | "uploading" | "success" | "error";

type ArchiveApiResponse = {
  success?: boolean;
  rewardUnlocked?: boolean;
  message?: string;
};

const BASIC_SYNTAX_LESSONS: SyntaxLesson[] = [
  {
    id: "headings",
    eyebrow: "Hierarchy",
    title: "Headings",
    description:
      "Headings organize a page from most important to least important. Use one h1 for the main title, then h2 to h6 for smaller sections.",
    tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
    code: `<h1>The Manuscript</h1>
<h2>Chapter One</h2>
<h3>Scene: The Archive</h3>
<h4>Evidence Note</h4>
<h5>Small Detail</h5>
<h6>Footnote</h6>`,
    preview: (
      <div className="lesson2-heading-preview">
        <h1>The Manuscript</h1>
        <h2>Chapter One</h2>
        <h3>Scene: The Archive</h3>
        <h4>Evidence Note</h4>
        <h5>Small Detail</h5>
        <h6>Footnote</h6>
      </div>
    ),
    note: "A page should read like an outline: h1 names the whole work, h2 starts major sections, and deeper headings divide details.",
  },
  {
    id: "text",
    eyebrow: "Voice",
    title: "Paragraph And Text Tags",
    description:
      "Text tags shape the reading rhythm. Paragraphs hold ideas, line breaks separate lines, and emphasis tags give words emotional weight.",
    tags: ["p", "br", "hr", "strong", "em", "small", "mark"],
    code: `<p>This is a paragraph from the archive.</p>
<p>I remember it <strong>clearly</strong>.</p>
<p>Some words feel <em>soft</em>.</p>
<p><small>Filed quietly at midnight.</small></p>
<p>The clue was <mark>hidden in plain sight</mark>.</p>
<br>
<hr>`,
    preview: (
      <div className="lesson2-text-preview">
        <p>This is a paragraph from the archive.</p>
        <p>
          I remember it <strong>clearly</strong>, and some words feel <em>soft</em>.
        </p>
        <small>Filed quietly at midnight.</small>
        <p>
          The clue was <mark>hidden in plain sight</mark>.
        </p>
        <hr />
      </div>
    ),
    note: "Use strong for important meaning, em for emphasis, small for side notes, and mark for highlighted text.",
  },
  {
    id: "lists",
    eyebrow: "Collected Evidence",
    title: "Lists",
    description:
      "Lists keep related details together. Use ul when order does not matter, ol when the sequence matters, and li for every item.",
    tags: ["ul", "ol", "li"],
    code: `<ul>
  <li>ink ribbon</li>
  <li>folded letter</li>
  <li>old photograph</li>
</ul>

<ol>
  <li>Open the file</li>
  <li>Read the note</li>
  <li>Write the page</li>
</ol>`,
    preview: (
      <div className="lesson2-list-preview">
        <ul>
          <li>ink ribbon</li>
          <li>folded letter</li>
          <li>old photograph</li>
        </ul>
        <ol>
          <li>Open the file</li>
          <li>Read the note</li>
          <li>Write the page</li>
        </ol>
      </div>
    ),
    note: "Every bullet or number must live inside an li tag.",
  },
  {
    id: "links",
    eyebrow: "Navigation",
    title: "Links",
    description:
      "The a tag creates a clickable path. Its href attribute tells the browser where the link should go.",
    tags: ["a", "href"],
    code: `<a href="https://example.com">
  Visit the memory archive
</a>

<a href="#activity">
  Jump to the final activity
</a>`,
    preview: (
      <div className="lesson2-link-preview">
        <a href="#activity">Visit the memory archive</a>
        <a href="#activity">Jump to the final activity</a>
      </div>
    ),
    note: "href can point to a website, a file, an email address, or an id on the same page.",
  },
  {
    id: "images",
    eyebrow: "Visual Artifact",
    title: "Images",
    description:
      "The img tag places an image on the page. src tells the browser what image to load, and alt describes it for accessibility.",
    tags: ["img", "src", "alt", "width", "height"],
    code: `<img
  src="memory.jpg"
  alt="A faded photograph on a desk"
  width="320"
  height="220"
>`,
    preview: (
      <figure className="lesson2-image-preview">
        <img src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=480&q=80" alt="Books and papers on a table" />
        <figcaption>alt text: Books and papers on a table</figcaption>
      </figure>
    ),
    note: "Always write useful alt text. It helps screen readers and appears when an image cannot load.",
  },
  {
    id: "tables",
    eyebrow: "Records",
    title: "Tables",
    description:
      "Tables organize information into rows and columns. th creates header cells, tr creates rows, and td creates regular cells.",
    tags: ["table", "tr", "td", "th"],
    code: `<table>
  <tr>
    <th>File</th>
    <th>Status</th>
  </tr>
  <tr>
    <td>Letter A</td>
    <td>Recovered</td>
  </tr>
</table>`,
    preview: (
      <table className="lesson2-table-preview">
        <tbody>
          <tr>
            <th>File</th>
            <th>Status</th>
          </tr>
          <tr>
            <td>Letter A</td>
            <td>Recovered</td>
          </tr>
          <tr>
            <td>Photo B</td>
            <td>Classified</td>
          </tr>
        </tbody>
      </table>
    ),
    note: "Use tables for structured data, not for general page layout.",
  },
  {
    id: "forms",
    eyebrow: "Submitted Evidence",
    title: "Forms",
    description:
      "Forms collect information from users. Labels name each field, inputs accept short answers, textareas accept longer notes, and buttons submit actions.",
    tags: ["form", "input", "textarea", "button", "label"],
    code: `<form>
  <label for="name">Archive name</label>
  <input id="name" type="text" placeholder="Clara">

  <label for="note">Memory note</label>
  <textarea id="note"></textarea>

  <button type="submit">Send File</button>
</form>`,
    preview: (
      <form className="lesson2-form-preview" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="archive-name">Archive name</label>
        <input id="archive-name" type="text" placeholder="Clara" />
        <label htmlFor="archive-note">Memory note</label>
        <textarea id="archive-note" placeholder="A sentence you want to remember." />
        <button type="submit">Send File</button>
      </form>
    ),
    note: "The for value on a label should match the id of its input so the form is easier to use.",
  },
  {
    id: "containers",
    eyebrow: "Architecture",
    title: "Div And Containers",
    description:
      "Containers group related content so a webpage has structure. section marks a major area, article marks independent content, and div is a flexible wrapper.",
    tags: ["div", "section", "article"],
    code: `<section>
  <article>
    <h2>Memory File</h2>
    <div class="card">
      <p>This content belongs together.</p>
    </div>
  </article>
</section>`,
    preview: (
      <div className="lesson2-container-preview">
        <section>
          <article>
            <span>section</span>
            <h4>Memory File</h4>
            <div>div.card</div>
          </article>
        </section>
      </div>
    ),
    note: "Containers make your HTML easier to style later with CSS.",
  },
  {
    id: "structure",
    eyebrow: "Foundation",
    title: "HTML Page Structure",
    description:
      "Every complete HTML page needs a document type, an html root, a head for information about the page, and a body for visible content.",
    tags: ["DOCTYPE", "html", "head", "body", "title"],
    code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Digital Memory Archive</title>
  </head>
  <body>
    <h1>My Archive</h1>
    <p>This page holds my first HTML memory.</p>
  </body>
</html>`,
    preview: (
      <div className="lesson2-structure-preview">
        <span>&lt;!DOCTYPE html&gt;</span>
        <span>&lt;html&gt;</span>
        <span>&lt;head&gt; title lives here &lt;/head&gt;</span>
        <span>&lt;body&gt; visible page lives here &lt;/body&gt;</span>
      </div>
    ),
    note: "The title appears in the browser tab; the body appears inside the page.",
  },
  {
    id: "comments",
    eyebrow: "Hidden Notes",
    title: "Comments",
    description:
      "Comments are notes inside your code that the browser ignores. They help developers explain decisions or leave reminders.",
    tags: ["<!-- comment -->"],
    code: `<!-- This note will not appear on the webpage -->
<p>The reader sees this sentence.</p>`,
    preview: (
      <div className="lesson2-comment-preview">
        <p>The visible webpage only shows the paragraph.</p>
        <span>comment hidden in the archive</span>
      </div>
    ),
    note: "Comments are useful, but do not place private passwords or secrets in them.",
  },
];

function playTone(frequency: number, duration = 0.04, gain = 0.025) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  sharedAudioContext ??= new AudioContextClass();
  const context = sharedAudioContext;
  if (context.state === "suspended") {
    void context.resume().catch(() => undefined);
  }
  const oscillator = context.createOscillator();
  const volume = context.createGain();

  oscillator.frequency.value = frequency;
  oscillator.type = "triangle";
  volume.gain.value = gain;
  oscillator.connect(volume);
  volume.connect(context.destination);
  oscillator.start();
  volume.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  oscillator.stop(context.currentTime + duration);
}

function BackgroundEffects() {
  return (
    <div className="lesson2-background" aria-hidden="true">
      <div className="lesson2-background-wash" />
      <div className="lesson2-floating-paper lesson2-floating-paper-one lesson2-crumpled-paper">
        <p>for the record...</p>
      </div>
      <div className="lesson2-floating-paper lesson2-floating-paper-two lesson2-torn-paper" />
      <div className="lesson2-floating-paper lesson2-floating-paper-three lesson2-polaroid" />
      <div className="lesson2-dust-field">
        {Array.from({ length: 10 }, (_, index) => (
          <span key={index} style={{ "--delay": `${index * -0.7}s`, "--left": `${(index * 37) % 100}%` } as CSSProperties} />
        ))}
      </div>
    </div>
  );
}

function ScrollPolaroidTrail() {
  return (
    <div className="lesson2-scroll-polaroids" aria-hidden="true">
      {SCROLL_POLAROIDS.map((photo) => (
        <figure
          key={photo.label}
          className="lesson2-scroll-polaroid"
          style={
            {
              "--photo-top": photo.top,
              "--photo-left": photo.left,
              "--photo-right": photo.right,
              "--photo-rotation": photo.rotation,
              "--photo-delay": photo.delay,
            } as CSSProperties
          }
        >
          <img src={photo.src} alt="" />
          <figcaption>{photo.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function CinematicTypewriterIntro({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);
  const [activeKey, setActiveKey] = useState("");
  const [secretActive, setSecretActive] = useState(false);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const carriageRef = useRef<HTMLDivElement | null>(null);
  const machineRef = useRef<HTMLDivElement | null>(null);
  const armRef = useRef<HTMLDivElement | null>(null);
  const rollerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const typedCodeRef = useRef("");
  const finishTimerRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!sceneRef.current || !paperRef.current) return;

    gsap.fromTo(
      sceneRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      machineRef.current,
      { y: 36, rotateX: 16, scale: 0.94, autoAlpha: 0 },
      { y: 0, rotateX: 0, scale: 1, autoAlpha: 1, duration: 1.7, delay: 0.35, ease: "expo.out" }
    );
  }, []);

  useEffect(() => {
    sceneRef.current?.focus({ preventScroll: true });
    return () => {
      if (finishTimerRef.current) {
        window.clearTimeout(finishTimerRef.current);
      }
    };
  }, []);

  const finishIntro = useCallback(() => {
    if (isFinishing || !paperRef.current || !sceneRef.current) return;

    setIsFinishing(true);
    setSecretActive(true);
    playTone(90, 0.24, 0.055);
    playTone(720, 0.34, 0.026);
    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut", force3D: true, overwrite: "auto" },
      onComplete,
    });

    timeline
      .to(sceneRef.current, { "--intro-glow": "0.78", duration: 0.6 }, 0)
      .to(machineRef.current, { scale: 1.018, y: -6, duration: 0.65 }, 0)
      .to(paperRef.current, { y: -34, rotateX: 5, duration: 0.72 }, 0.18)
      .to(carriageRef.current, { x: -14, duration: 0.55, ease: "sine.inOut" }, 0.3)
      .to(paperRef.current, {
        z: 340,
        scale: 2.2,
        rotateZ: -7,
        rotateX: -10,
        duration: 0.62,
        ease: "expo.in",
        onStart: () => playTone(180, 0.28, 0.04),
      })
      .to(paperRef.current, {
        x: "58vw",
        y: "-74vh",
        scale: 1.35,
        rotateZ: 28,
        rotateX: 18,
        opacity: 0.94,
        duration: 0.78,
        ease: "expo.out",
      })
      .to(sceneRef.current, { autoAlpha: 0, duration: 0.38 }, "-=0.28");
  }, [isFinishing, onComplete]);

  const animateTypeStrike = useCallback((key: string, nextLength: number) => {
    setActiveKey(key);
    window.setTimeout(() => setActiveKey((current) => (current === key ? "" : current)), 130);

    playTone(470 + Math.random() * 170, 0.038, 0.02);

    if (machineRef.current) {
      gsap.fromTo(machineRef.current, { x: -1.2, rotateZ: -0.04 }, { x: 0, rotateZ: 0, duration: 0.1, ease: "power2.out", overwrite: "auto" });
    }

    if (paperRef.current) {
      gsap.fromTo(
        paperRef.current,
        { x: Math.min(nextLength * 0.32, 7), y: 0, rotateZ: -0.1 },
        {
          x: Math.min(nextLength * 0.5, 10),
          y: nextLength > 0 && nextLength % 10 === 0 ? -1.5 : 0,
          rotateZ: 0.08,
          duration: 0.08,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
          overwrite: "auto",
        }
      );
    }

    if (carriageRef.current) {
      gsap.to(carriageRef.current, { x: Math.min(nextLength * 3.8, 64), duration: 0.12, ease: "power2.out", overwrite: "auto" });
    }

    if (rollerRef.current) {
      gsap.fromTo(
        rollerRef.current,
        { rotateZ: -0.18 },
        { rotateZ: 0.16, duration: 0.08, yoyo: true, repeat: 1, ease: "power2.out", overwrite: "auto" }
      );
    }

    if (armRef.current) {
      gsap.fromTo(
        armRef.current,
        { rotateZ: -14, y: 12, autoAlpha: 0.45 },
        { rotateZ: 0, y: -6, autoAlpha: 1, duration: 0.06, yoyo: true, repeat: 1, ease: "power3.out", overwrite: "auto" }
      );
    }
  }, []);

  const typeCharacter = useCallback(
    (key: string) => {
      if (isFinishing) return;

      const normalizedKey = key.toUpperCase();

      if (normalizedKey === "BACKSPACE") {
        setText((current) => current.slice(0, -1));
        typedCodeRef.current = typedCodeRef.current.slice(0, -1);
        playTone(150, 0.055, 0.018);
        return;
      }

      const printableKey = normalizedKey === "SPACE" ? " " : key.length === 1 ? key : normalizedKey;
      const isPrintableKey = printableKey.length === 1 && /^[A-Z0-9.,;'\-/= ]$/.test(printableKey.toUpperCase());
      if (!isPrintableKey) return;

      let nextText = "";
      setText((current) => {
        nextText = (current + printableKey.toUpperCase()).slice(0, 34);
        return nextText;
      });

      if (/^[A-Z]$/.test(printableKey.toUpperCase())) {
        typedCodeRef.current = (typedCodeRef.current + printableKey.toUpperCase()).slice(-SECRET_CODE.length);
      }

      animateTypeStrike(normalizedKey === " " ? "SPACE" : normalizedKey, nextText.length || text.length + 1);

      if (typedCodeRef.current === SECRET_CODE) {
        setSecretActive(true);
        finishTimerRef.current = window.setTimeout(finishIntro, 520);
      }
    },
    [animateTypeStrike, finishIntro, isFinishing, text.length]
  );

  return (
    <div
      ref={sceneRef}
      className={`lesson2-cinema-intro ${secretActive ? "is-secret-active" : ""}`}
      tabIndex={0}
      role="application"
      aria-label="Interactive vintage typewriter intro. Type or click T T P D to unlock Chapter II."
      onKeyDown={(event) => {
        if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
          event.preventDefault();
        }
        if (event.key === "Enter" && typedCodeRef.current === SECRET_CODE) {
          event.preventDefault();
          finishIntro();
          return;
        }
        if (event.key === "Backspace" || event.key.length === 1) {
          event.preventDefault();
          typeCharacter(event.key === "Backspace" ? "BACKSPACE" : event.key === " " ? "SPACE" : event.key);
        }
      }}
    >
      <div className="lesson2-projector" />
      <div className="lesson2-desk-light" />
      <div className="lesson2-intro-dust" aria-hidden="true">
        {INTRO_DUST_PARTICLES.map((particle) => (
          <span
            key={`${particle.left}-${particle.delay}`}
            style={{ "--delay": particle.delay, "--left": particle.left, "--size": particle.size } as CSSProperties}
          />
        ))}
      </div>

      <div ref={machineRef} className={`lesson2-typewriter-machine ${isFinishing ? "is-final" : ""}`}>
        <div className="lesson2-typewriter-shadow" aria-hidden="true" />
        <div ref={carriageRef} className="lesson2-typewriter-carriage">
          <div className="lesson2-carriage-rail" aria-hidden="true" />
          <span className="lesson2-carriage-knob knob-left" aria-hidden="true" />
          <span className="lesson2-carriage-knob knob-right" aria-hidden="true" />
          <div className="lesson2-paper-rear-curve" aria-hidden="true" />
          <div ref={rollerRef} className="lesson2-roller" />
          <div className="lesson2-paper-guide" aria-hidden="true" />
          <div ref={paperRef} className="lesson2-typewriter-paper">
            <div className="lesson2-paper-meta">TTPD / CHAPTER II / PRIVATE FILE</div>
            <p className="lesson2-paper-stamp">CLASSIFIED MANUSCRIPT</p>
            <p className={`lesson2-typed-line ${text ? "has-text" : ""}`}>
              {text || INTRO_PLACEHOLDER}
              <span className="lesson2-type-cursor" />
            </p>
            <p className="lesson2-enter-note">access code required / ttpd</p>
            <span className="lesson2-ink-mark mark-one" />
            <span className="lesson2-ink-mark mark-two" />
          </div>
          <div className="lesson2-paper-front-curve" aria-hidden="true" />
          <div className="lesson2-paper-bail" aria-hidden="true">
            <span />
            <span />
          </div>
          <div className="lesson2-paper-clamps" aria-hidden="true">
            <span />
            <span />
          </div>
          <div className="lesson2-paper-slot" aria-hidden="true" />
        </div>

        <div className="lesson2-paper-throat-shadow" aria-hidden="true" />

        <div className={`lesson2-type-basket ${activeKey ? "is-striking" : ""}`} aria-hidden="true">
          <div ref={armRef} className="lesson2-type-arm" />
          {TYPE_BARS.map((bar) => (
            <span key={bar.angle} style={{ "--bar-angle": bar.angle, "--bar-height": bar.height } as CSSProperties} />
          ))}
        </div>

        <div className="lesson2-typewriter-body">
          <div className="lesson2-typewriter-bridge" aria-hidden="true" />
          <div className="lesson2-brand-plate">THE TORTURED POETS DEPARTMENT</div>
          <div className="lesson2-key-deck" aria-hidden="true" />
          <div className="lesson2-keyboard" aria-label="Clickable vintage typewriter keys">
            {TYPEWRITER_ROWS.map((row) => (
              <div key={row.id} className="lesson2-key-row" style={{ "--row-offset": `${row.offset}px` } as CSSProperties}>
                {row.keys.map((key) => (
                  <button
                    key={`${row.id}-${key.value}`}
                    type="button"
                    className={`lesson2-machine-key ${activeKey === key.value ? "is-pressed" : ""} ${secretActive ? "is-glowing" : ""}`}
                    onClick={() => typeCharacter(key.value)}
                    disabled={isFinishing}
                    aria-label={`Type ${key.label}`}
                  >
                    <span>{key.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="lesson2-spacebar-row">
            <button type="button" className="lesson2-machine-key lesson2-backspace-key" onClick={() => typeCharacter("BACKSPACE")} disabled={isFinishing}>
              <span>BACK</span>
            </button>
            <button
              type="button"
              className={`lesson2-spacebar ${activeKey === "SPACE" ? "is-pressed" : ""}`}
              onClick={() => typeCharacter("SPACE")}
              disabled={isFinishing}
              aria-label="Type space"
            >
              <span>SPACE</span>
            </button>
            <button type="button" className="lesson2-machine-key lesson2-return-key" onClick={finishIntro} disabled={isFinishing || typedCodeRef.current !== SECRET_CODE}>
              <span>RETURN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="lesson2-hero">
      <div className="lesson2-hero-photo" />
      <motion.div
        className="lesson2-hero-inner"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="lesson2-type-key key-h">T</span>
        <span className="lesson2-type-key key-t">T</span>
        <span className="lesson2-type-key key-m">P</span>
        <span className="lesson2-type-key key-l">D</span>

        <p className="lesson2-hand lesson2-kicker">Welcome to</p>
        <h1>
          TTPD
          <br />
          <span>Chapter II</span>
        </h1>
        <div className="lesson2-title-pill">A cinematic HTML manuscript from the department archives</div>
        <div className="lesson2-scroll-note">
          <p>Scroll to open the archive</p>
          <span />
        </div>
      </motion.div>
    </header>
  );
}

function renderHighlightedCode(code: string) {
  const tokenPattern = /(<!--[\s\S]*?-->|<\/?[A-Za-z!][A-Za-z0-9-]*|[A-Za-z-]+(?==)|"[^"]*"|>)/g;

  return code.split("\n").map((line, lineIndex) => {
    const pieces: React.ReactNode[] = [];
    let cursor = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenPattern.exec(line)) !== null) {
      if (match.index > cursor) {
        pieces.push(line.slice(cursor, match.index));
      }

      const token = match[0];
      const className = token.startsWith("<!--")
        ? "muted"
        : token.startsWith("<") || token === ">"
          ? "tag"
          : token.startsWith("\"")
            ? "value"
            : "attr";

      pieces.push(
        <span key={`${lineIndex}-${match.index}`} className={className}>
          {token}
        </span>
      );
      cursor = match.index + token.length;
    }

    if (cursor < line.length) {
      pieces.push(line.slice(cursor));
    }

    return (
      <span className="lesson2-code-line" key={`${line}-${lineIndex}`}>
        {pieces.length ? pieces : " "}
      </span>
    );
  });
}

function CodeBlock({ children, code }: { children?: React.ReactNode; code?: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    if (!code) return;
    playTone(620, 0.035, 0.012);
    void navigator.clipboard
      ?.writeText(code)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      })
      .catch(() => setCopied(false));
  };

  return (
    <div className="lesson2-code-wrap">
      {code && (
        <button type="button" className="lesson2-copy-code" onClick={copyCode}>
          {copied ? "copied" : "copy"}
        </button>
      )}
      <pre className="lesson2-code">
        <code>{code ? renderHighlightedCode(code) : children}</code>
      </pre>
    </div>
  );
}

function SyntaxCard({ lesson, index }: { lesson: SyntaxLesson; index: number }) {
  return (
    <motion.article
      className="lesson2-syntax-card"
      initial={{ opacity: 0, y: 36, rotateX: 5 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, delay: Math.min(index * 0.035, 0.24), ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="lesson2-syntax-copy">
        <span className="lesson2-syntax-eyebrow">{lesson.eyebrow}</span>
        <h4>{lesson.title}</h4>
        <p>{lesson.description}</p>
        <div className="lesson2-tag-strip" aria-label={`${lesson.title} tags`}>
          {lesson.tags.map((tag) => (
            <code key={tag}>{tag}</code>
          ))}
        </div>
      </div>

      <div className="lesson2-syntax-demo">
        <CodeBlock code={lesson.code} />
        <details className="lesson2-example-drawer">
          <summary onClick={() => playTone(320, 0.025, 0.01)}>Open live example</summary>
          <div className="lesson2-live-preview">{lesson.preview}</div>
          <p>{lesson.note}</p>
        </details>
      </div>
    </motion.article>
  );
}

function BasicSyntaxLesson() {
  return (
    <ScrollRevealSection title="I." subtitle="Introducing Basic HTML Syntax">
      <article className="lesson2-syntax-archive">
        <span className="lesson2-tape tape-top" />
        <span className="lesson2-wax">I</span>
        <p className="lesson2-hand lesson2-note">the rest of the alphabet...</p>
        <div className="lesson2-syntax-intro">
          <p>
            Now that the page has a skeleton, the archive needs its everyday language: headings, paragraphs, lists,
            links, images, tables, forms, containers, structure, and comments.
          </p>
          <p>
            These are the common HTML tags beginners use to turn a blank file into a readable webpage.
          </p>
        </div>

        <div className="lesson2-syntax-grid">
          {BASIC_SYNTAX_LESSONS.map((lesson, index) => (
            <SyntaxCard key={lesson.id} lesson={lesson} index={index} />
          ))}
        </div>
      </article>
    </ScrollRevealSection>
  );
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function createArchiveFileName(studentName: string, fileName: string) {
  const cleanStudentName = studentName
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-");
  const cleanFileName = fileName.replace(/[\\/:*?"<>|]/g, "");

  return `${cleanStudentName}-${cleanFileName}`;
}

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read archive file."));
    reader.readAsDataURL(file);
  });
}

function ArchiveDust({ active }: { active: boolean }) {
  return (
    <div className={`lesson2-archive-dust ${active ? "is-active" : ""}`} aria-hidden="true">
      {Array.from({ length: 18 }, (_, index) => (
        <span
          key={index}
          style={
            {
              "--dust-left": `${(index * 29) % 100}%`,
              "--dust-delay": `${index * -0.23}s`,
              "--dust-size": `${2 + (index % 4)}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function StudentActivity() {
  const [studentName, setStudentName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rewardUnlocked, setRewardUnlocked] = useState(false);
  const [isRewardRevealed, setIsRewardRevealed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadCardRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLSpanElement | null>(null);
  const acceptedRef = useRef<HTMLDivElement | null>(null);
  const canSubmitActivity = Boolean(selectedFile && studentName.trim()) && uploadStatus !== "uploading";
  const rewardImage = new URL("../images/reward1.png", import.meta.url).href;
  const starterCode = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My Digital Memory Archive</title>
  </head>
  <body>
    <h1>My Digital Memory Archive</h1>
    <p>Hello, I am writing my first HTML page.</p>

    <img src="favorite-photo.jpg" alt="A favorite memory" width="300">

    <h2>Favorite Songs Or Movies</h2>
    <ul>
      <li>First favorite</li>
      <li>Second favorite</li>
      <li>Third favorite</li>
    </ul>

    <h2>Memory Table</h2>
    <table>
      <tr>
        <th>Memory</th>
        <th>Year</th>
      </tr>
      <tr>
        <td>A special day</td>
        <td>2026</td>
      </tr>
    </table>

    <h2>Contact The Archive</h2>
    <form>
      <label for="visitor">Your name</label>
      <input id="visitor" type="text">
      <label for="message">Message</label>
      <textarea id="message"></textarea>
      <button type="submit">Send</button>
    </form>
  </body>
</html>`;

  const resetForFile = (file: File) => {
    setSelectedFile(file);
    setUploadStatus("ready");
    setErrorMessage("");
    setRewardUnlocked(false);
    setIsRewardRevealed(false);
    playTone(340, 0.04, 0.012);
    playTone(510, 0.05, 0.01);
  };

  const selectArchiveFile = (file?: File) => {
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isAcceptedType = [".html", ".htm", ".css", ".zip"].some((extension) => lowerName.endsWith(extension));

    if (!isAcceptedType) {
      setUploadStatus("error");
      setErrorMessage("Only .html, .css, and .zip manuscripts can enter this archive.");
      playTone(140, 0.08, 0.026);
      return;
    }

    resetForFile(file);
  };

  const removeArchiveFile = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
    setRewardUnlocked(false);
    setIsRewardRevealed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    playTone(180, 0.04, 0.012);
  };

  const runSuccessSequence = () => {
    playTone(620, 0.04, 0.018);
    window.setTimeout(() => playTone(690, 0.04, 0.016), 90);
    window.setTimeout(() => playTone(760, 0.18, 0.014), 220);
    window.setTimeout(() => playTone(190, 0.7, 0.035), 440);

    const timeline = gsap.timeline({ defaults: { ease: "power3.out", force3D: true, overwrite: "auto" } });
    timeline
      .to(uploadCardRef.current, { filter: "brightness(0.72) contrast(1.08)", duration: 0.38 }, 0)
      .fromTo(acceptedRef.current, { autoAlpha: 0, y: 18, letterSpacing: "0.34em" }, { autoAlpha: 1, y: 0, letterSpacing: "0.16em", duration: 0.7 }, 0.24)
      .fromTo(sealRef.current, { autoAlpha: 0, scale: 2.6, rotate: -18 }, { autoAlpha: 1, scale: 1, rotate: -7, duration: 0.52, ease: "back.out(1.8)" }, 0.62)
      .fromTo(flashRef.current, { autoAlpha: 0 }, { autoAlpha: 0.92, duration: 0.08, yoyo: true, repeat: 1 }, 0.94)
      .to(uploadCardRef.current, { filter: "brightness(1) contrast(1)", duration: 0.72 }, 1.06);
  };

  const runErrorSequence = () => {
    playTone(120, 0.08, 0.032);
    window.setTimeout(() => playTone(92, 0.11, 0.026), 90);
    gsap.fromTo(
      uploadCardRef.current,
      { x: -6, boxShadow: "0 0 0 rgba(93, 14, 14, 0)" },
      { x: 0, boxShadow: "0 0 38px rgba(93, 14, 14, 0.34)", duration: 0.09, repeat: 5, yoyo: true, ease: "power2.inOut", overwrite: "auto" }
    );
  };

  const submitArchive = async () => {
    if (!selectedFile || !studentName.trim()) return;

    setUploadStatus("uploading");
    setErrorMessage("");
    playTone(420, 0.06, 0.012);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), ACTIVITY_UPLOAD_TIMEOUT_MS);

    try {
      const fileData = await readFileAsBase64(selectedFile);
      const archiveFileName = createArchiveFileName(studentName, selectedFile.name);
      const response = await fetch(ACTIVITY_SUBMISSION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        signal: controller.signal,
        body: JSON.stringify({
          fileName: selectedFile.name,
          desiredFileName: archiveFileName,
          mimeType: selectedFile.type || "application/octet-stream",
          fileData,
          studentName: studentName.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Archive rejected the request: ${response.status}`);
      }

      const result = (await response.json()) as ArchiveApiResponse;
      if (!result.success) {
        throw new Error(result.message || "Archive submission failed.");
      }

      setUploadStatus("success");
      setRewardUnlocked(Boolean(result.rewardUnlocked));
      runSuccessSequence();
    } catch (error) {
      setUploadStatus("error");
      setRewardUnlocked(false);
      setErrorMessage(
        error instanceof DOMException && error.name === "AbortError"
          ? "Archive connection timed out. Try a smaller ZIP or submit again when Google responds."
          : error instanceof TypeError
            ? "Archive connection was blocked or timed out before a response returned."
            : error instanceof Error
              ? error.message
              : "Archive submission failed."
      );
      runErrorSequence();
    } finally {
      window.clearTimeout(timeout);
    }
  };

  useEffect(() => {
    if (!isRewardRevealed) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isRewardRevealed]);

  const rewardPopover = (
    <AnimatePresence>
      {isRewardRevealed && (
        <motion.div
          className="lesson2-reward-popover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Sea Salt Matcha Latte reward unlocked"
          onClick={() => setIsRewardRevealed(false)}
        >
          <motion.div
            className="lesson2-reward-stage"
            initial={{ y: 38, scale: 0.82, rotateX: 10 }}
            animate={{ y: 0, scale: 1, rotateX: 0 }}
            exit={{ y: 24, scale: 0.92 }}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="lesson2-reward-popover-close"
              onClick={() => setIsRewardRevealed(false)}
              aria-label="Close reward"
            >
              Close
            </button>
            <div className="lesson2-reward-spotlight" aria-hidden="true" />
            <div className="lesson2-ttpd-orbit" aria-hidden="true">
              <span>T</span>
              <span>T</span>
              <span>P</span>
              <span>D</span>
            </div>
            <figure>
              <img src={rewardImage} alt="Sea Salt Matcha Latte reward" />
              <figcaption>
                <span>Reward Unlocked</span>
                Sea Salt Matcha Latte
              </figcaption>
            </figure>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <section id="activity" className="lesson2-activity">
      <motion.div
        className="lesson2-activity-card"
        initial={{ opacity: 0, y: 42, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.28 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="lesson2-activity-stamp">classified assignment</span>
        <p className="lesson2-file-label">End of lesson activity</p>
        <h2>Activity: Build Your First HTML Memory Page</h2>
        <p>
          Create a simple webpage with the theme <strong>A Digital Memory Archive</strong>. Your mission is to turn
          basic syntax into a small, personal page that feels like a file worth keeping.
        </p>

        <div className="lesson2-activity-layout">
          <div className="lesson2-activity-brief">
            <h3>Requirements</h3>
            <ol>
              <li>Create a webpage title.</li>
              <li>Add a personal introduction.</li>
              <li>Insert a favorite image with alt text.</li>
              <li>Create a favorite song or movie list.</li>
              <li>Add a simple table.</li>
              <li>Create a contact form.</li>
              <li>Add custom styling later using CSS.</li>
            </ol>
            <a href="#activity" onClick={() => playTone(250, 0.04, 0.012)}>
              Begin the archive
            </a>
          </div>

          <div className="lesson2-activity-code">
            <CodeBlock code={starterCode} />
          </div>
        </div>

        <div className="lesson2-submission-dossier">
          <motion.div
            ref={uploadCardRef}
            className={`lesson2-submission-copy lesson2-archive-uploader is-${uploadStatus} ${isDragging ? "is-dragging" : ""}`}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ArchiveDust active={isDragging || uploadStatus === "success"} />
            <span ref={flashRef} className="lesson2-archive-flash" />
            <div ref={acceptedRef} className="lesson2-archive-accepted" aria-hidden={uploadStatus !== "success"}>
              ARCHIVE ACCEPTED
            </div>
            <div ref={sealRef} className="lesson2-wax-seal" aria-hidden={uploadStatus !== "success"}>
              <span>TTPD</span>
            </div>

            <p className="lesson2-file-label">Activity Submission</p>
            <h3>Submit Your HTML Memory Archive</h3>
            <p>Insert your completed manuscript into the archive.</p>

            <label htmlFor="student-name">Student name</label>
            <input
              id="student-name"
              type="text"
              value={studentName}
              placeholder="Write your archive name"
              onChange={(event) => setStudentName(event.target.value)}
            />

            <input
              ref={fileInputRef}
              id="archive-upload"
              className="lesson2-native-file-input"
              type="file"
              accept=".html,.htm,.css,.zip"
              onChange={(event) => selectArchiveFile(event.target.files?.[0])}
            />

            <button
              type="button"
              className="lesson2-drop-zone"
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                selectArchiveFile(event.dataTransfer.files?.[0]);
              }}
            >
              <span className="lesson2-drop-icon" aria-hidden="true" />
              <strong>{isDragging ? "Release the manuscript" : "Drag your manuscript here"}</strong>
              <small>.html, .css, or .zip accepted</small>
            </button>

            <AnimatePresence>
              {selectedFile && (
                <motion.div
                  className="lesson2-selected-file-card"
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.96 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span />
                  <div>
                    <strong>{selectedFile.name}</strong>
                    <small>{formatFileSize(selectedFile.size)} / archive-ready</small>
                  </div>
                  <button type="button" className="lesson2-remove-file" onClick={removeArchiveFile} aria-label="Remove selected file">
                    Remove
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="button" className="lesson2-submit-activity" disabled={!canSubmitActivity} onClick={submitArchive}>
              {uploadStatus === "uploading" ? "Inscribing..." : "Insert Into Archive"}
            </button>

            <AnimatePresence mode="wait">
              {uploadStatus === "error" && (
                <motion.p
                  key="archive-error"
                  className="lesson2-upload-status is-error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  Archive submission failed.
                  {errorMessage && <span>{errorMessage}</span>}
                </motion.p>
              )}
              {uploadStatus === "success" && (
                <motion.p
                  key="archive-success"
                  className="lesson2-upload-status is-success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  Your memory has been accepted into the archive.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <div className={`lesson2-reward-file ${rewardUnlocked ? "is-unlocked" : ""} ${isRewardRevealed ? "is-revealed" : ""}`}>
            <div className="lesson2-mystery-reward">
              {isRewardRevealed ? (
                <figure className="lesson2-reward-preview">
                  <img src={rewardImage} alt="Sea Salt Matcha Latte reward" />
                  <figcaption>Sea Salt Matcha Latte</figcaption>
                </figure>
              ) : (
                <div className="lesson2-reward-seal">
                  <span>{rewardUnlocked ? "!" : "?"}</span>
                  <small>{rewardUnlocked ? "reward unlocked" : "archive locked"}</small>
                </div>
              )}
            </div>
            <button
              type="button"
              disabled={!rewardUnlocked}
              onClick={() => {
                if (!rewardUnlocked) return;
                setIsRewardRevealed(true);
                playTone(720, 0.08, 0.018);
                playTone(960, 0.1, 0.012);
              }}
            >
              Unlock Chapter Reward
            </button>
          </div>
        </div>

      </motion.div>
    </section>
      {createPortal(rewardPopover, document.body)}
    </>
  );
}

function ScrollRevealSection({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <motion.section
      className="lesson2-section"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2>{title}</h2>
      <h3>{subtitle}</h3>
      {children}
    </motion.section>
  );
}

function Chapters() {
  return (
    <div className="lesson2-chapters">
      <BasicSyntaxLesson />
    </div>
  );
}

function FinaleDesk() {
  const photos: EvidencePhoto[] = [
    { label: "File A", title: "The First Draft", caption: "a page pulled from the department archive", src: new URL("../images/a.jpg", import.meta.url).href, zIndex: 5, rotation: -5, speed: 0.8 },
    { label: "File B", title: "Black Ink Evidence", caption: "the kind of photo that feels typewritten", src: new URL("../images/b.jpg", import.meta.url).href, zIndex: 7, rotation: 8, speed: 0.9 },
    { label: "File C", title: "The Unsent Note", caption: "hovered, pinned, and left for later", src: new URL("../images/c.jpg", import.meta.url).href, zIndex: 15, rotation: -3, speed: 1.1 },
    { label: "File D", title: "Department Light", caption: "a quiet scene under fluorescent confession", src: new URL("../images/d.jpg", import.meta.url).href, zIndex: 9, rotation: 6, speed: 0.95 },
    { label: "File E", title: "Pinned Memory", caption: "filed between poetry and markup", src: new URL("../images/e.jpg", import.meta.url).href, zIndex: 13, rotation: -8, speed: 1.05 },
    { label: "File F", title: "Final Exhibit", caption: "the last artifact before the closing tag", src: new URL("../images/f.jpg", import.meta.url).href, zIndex: 11, rotation: 4, speed: 0.85 },
  ];
  const [activePhoto, setActivePhoto] = useState(photos[0].label);
  const selectedPhoto = photos.find((photo) => photo.label === activePhoto) ?? photos[0];

  return (
    <section className="lesson2-finale">
      <div className="lesson2-finale-heading">
        <h2>Final File: The Photo Evidence Desk</h2>
        <p>Files A-F, recovered after the activity submission</p>
        <span />
        <em>the last archive opens as a photo collage...</em>
      </div>

      <div className="lesson2-photo-lab">
        <div className="lesson2-photo-board" aria-label="Interactive TTPD-inspired photo evidence board">
          {photos.map((photo) => (
            <button
              key={photo.label}
              className={`lesson2-evidence-photo ${activePhoto === photo.label ? "is-active" : ""}`}
              type="button"
              onClick={() => setActivePhoto(photo.label)}
              onFocus={() => setActivePhoto(photo.label)}
              onMouseEnter={() => setActivePhoto(photo.label)}
              style={{ zIndex: photo.zIndex, transform: `rotate(${photo.rotation}deg)`, animationDuration: `${9 / photo.speed}s` }}
              aria-pressed={activePhoto === photo.label}
            >
              <figure className="lesson2-polaroid">
                <span className="lesson2-file-label">{photo.label}</span>
                <img src={photo.src} alt={photo.title} />
                <figcaption>{photo.title}</figcaption>
              </figure>
            </button>
          ))}
          <span className="lesson2-evidence-thread thread-one" />
          <span className="lesson2-evidence-thread thread-two" />
          <span className="lesson2-type-key desk-key-one">&lt;</span>
          <span className="lesson2-type-key desk-key-two">/</span>
          <span className="lesson2-type-key desk-key-three">&gt;</span>
        </div>

        <aside className="lesson2-inspection-card" aria-live="polite">
          <p className="lesson2-file-label">{selectedPhoto.label}</p>
          <h3>{selectedPhoto.title}</h3>
          <p>{selectedPhoto.caption}</p>
          <code>&lt;img src="{selectedPhoto.label.toLowerCase().replace("file ", "")}.jpg" alt="{selectedPhoto.title}" /&gt;</code>
        </aside>
      </div>

      <footer className="lesson2-end">
        <p>&lt;/end_of_manuscript&gt;</p>
        <small>Department of Poet ni Luiese 2026</small>
        <br />
        <small>By your Luiese</small>
      </footer>
    </section>
  );
}

function AudioPlayer({ shouldAutoPlay }: { shouldAutoPlay: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fortnightSong = new URL("../fortnight.mp3", import.meta.url).href;

  useEffect(() => {
    const audio = audioRef.current;
    if (!shouldAutoPlay || !audio) return;

    audio.volume = 0.28;
    void audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [shouldAutoPlay]);

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
    <div className={`lesson2-audio ${isPlaying ? "is-playing" : ""}`}>
      <div className="lesson2-audio-copy">
        <span>fortnight.mp3</span>
        <span>{isPlaying ? "now playing" : "click to play"}</span>
      </div>
      <button type="button" onClick={toggleMusic} aria-label={isPlaying ? "Pause music" : "Play music"}>
        <span className={isPlaying ? "is-spinning" : ""}>
          <i />
        </span>
      </button>
      <audio ref={audioRef} src={fortnightSong} loop preload="auto" />
    </div>
  );
}

export default function LessonTwo({ onNavigateHome }: LessonTwoProps) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (!showIntro) return;

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;
    const previousBodyHeight = body.style.height;
    const previousTouchAction = body.style.touchAction;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.height = "100dvh";
    body.style.touchAction = "none";

    const preventScroll = (event: Event) => event.preventDefault();
    const preventScrollKeys = (event: globalThis.KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScrollKeys, { passive: false });

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      body.style.height = previousBodyHeight;
      body.style.touchAction = previousTouchAction;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventScrollKeys);
      window.scrollTo({ top: scrollY, behavior: "auto" });
    };
  }, [showIntro]);

  useEffect(() => {
    if (showIntro) return;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    frame = window.requestAnimationFrame(raf);
    return () => {
      window.cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="lesson2-shell">
      <button className="lesson-switcher lesson-switcher-dark" type="button" onClick={onNavigateHome}>
        Lesson 1
      </button>

      <div className="lesson2-film-grain" />
      <div className="lesson2-vignette" />
      {!showIntro && <BackgroundEffects />}

      <AnimatePresence mode="wait">
        {showIntro && <CinematicTypewriterIntro key="intro" onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      <motion.div
        className="lesson2-content"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 18 : 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden={showIntro}
      >
        <ScrollPolaroidTrail />
        <Header />
        <Chapters />
        <StudentActivity />
        <FinaleDesk />
      </motion.div>

      {!showIntro && <AudioPlayer shouldAutoPlay />}
    </div>
  );
}
