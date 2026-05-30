import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import type { CSSProperties, ReactNode } from "react";

type MemoryImage = {
  src: string;
  alt: string;
  caption: string;
  rotation: number;
  top: string;
  left: string;
  width: number;
  zIndex?: number;
};

function SectionCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass-card section-card ${className}`.trim()}>{children}</div>;
}

type ManuscriptSectionProps = {
  id: string;
  chapterNumber: string;
  title: string;
  explanation: ReactNode;
  realLifeExample: ReactNode;
  codeSample: ReactNode;
  visualExample: ReactNode;
  beginnerTip: string;
  isRightNumber?: boolean;
};

export function DriedFlower({ type = 1, style, className = "" }: { type?: number; style?: CSSProperties; className?: string }) {
  const flowers = {
    1: (
      <svg viewBox="0 0 100 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        {/* Fern / Stem */}
        <path d="M50 190 Q45 100 50 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M50 150 Q20 140 30 110 Q45 120 50 150" fill="currentColor" opacity="0.6" />
        <path d="M50 140 Q80 130 70 100 Q55 110 50 140" fill="currentColor" opacity="0.6" />
        <path d="M50 110 Q10 100 20 60 Q45 80 50 110" fill="currentColor" opacity="0.5" />
        <path d="M50 100 Q90 90 80 50 Q55 70 50 100" fill="currentColor" opacity="0.5" />
        <path d="M50 70 Q20 50 30 20 Q45 40 50 70" fill="currentColor" opacity="0.4" />
        <path d="M50 60 Q80 40 70 10 Q55 30 50 60" fill="currentColor" opacity="0.4" />
      </svg>
    ),
    2: (
      <svg viewBox="0 0 100 150" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        {/* Stem */}
        <path d="M50 140 Q55 90 50 40" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="50" cy="40" r="4" fill="currentColor" opacity="0.8" />
        <path d="M50 40 Q20 50 35 25 Q45 35 50 40" fill="currentColor" opacity="0.5" />
        <path d="M50 40 Q80 50 65 25 Q55 35 50 40" fill="currentColor" opacity="0.5" />
        <path d="M50 40 Q30 20 45 10 Q48 25 50 40" fill="currentColor" opacity="0.4" />
        <path d="M50 40 Q70 20 55 10 Q52 25 50 40" fill="currentColor" opacity="0.4" />
        <path d="M50 90 Q30 85 45 70 Q48 80 50 90" fill="currentColor" opacity="0.5" />
        <path d="M50 70 Q70 65 55 50 Q52 60 50 70" fill="currentColor" opacity="0.5" />
      </svg>
    )
  };

  return (
    <div className={`dried-flower ${className}`} style={{ ...style, pointerEvents: 'none', mixBlendMode: 'multiply' }}>
      {flowers[type as keyof typeof flowers] || flowers[1]}
      <div className="flower-tape" />
    </div>
  );
}

export function ManuscriptSection({
  id,
  chapterNumber,
  title,
  explanation,
  realLifeExample,
  codeSample,
  visualExample,
  beginnerTip,
  isRightNumber,
}: ManuscriptSectionProps) {
  // Generate some deterministic variation based on title
  const hasFlower = (title.length + id.length) % 3 !== 0; // Show on most sections
  const flowerType = (title.length % 2) + 1;
  const flowerRot = -30 + ((title.length * 15) % 60);
  const flowerScale = 0.85 + ((title.length % 3) * 0.1);

  return (
    <section id={id} className="section reveal relative">
      <div className={`section-number ${isRightNumber ? 'right' : ''}`}>{chapterNumber}</div>
      <div className="manuscript-section">
        {hasFlower && (
          <DriedFlower
            type={flowerType}
            style={{
              position: 'absolute',
              top: '-20px',
              [isRightNumber ? 'left' : 'right']: '15%',
              transform: `rotate(${flowerRot}deg) scale(${flowerScale})`,
              zIndex: 15
            }}
          />
        )}
        <div className="paper-clip" />
        <div className="masking-tape" />
        <h2 className="section-title">{title}</h2>
        <div className="section-copy">{explanation}</div>

        <h3 className="subsection-title" style={{ marginTop: '2rem' }}>Real-Life Analogy</h3>
        <div className="section-copy" style={{ fontStyle: 'italic', color: 'var(--moss)' }}>
          {realLifeExample}
        </div>

        <div className="manuscript-code">
          {codeSample}
        </div>

        <div className="visual-example">
          {visualExample}
        </div>

        <div className="beginner-tip-note">
          {beginnerTip}
        </div>
        <div className="wax-seal" aria-hidden="true" />
      </div>
    </section>
  );
}

export function Navigation() {
  return (
    <nav className="top-nav hidden md:block">
      <ul className="top-nav-list glass-card">
        <li><a href="#intro">Intro</a></li>
        <li><a href="#what-is-html">Basics</a></li>
        <li><a href="#headings">Text</a></li>
        <li><a href="#lists">Lists</a></li>
        <li><a href="#links">Links</a></li>
        <li><a href="#images">Media</a></li>
        <li><a href="#tables">Tables</a></li>
        <li><a href="#forms">Forms</a></li>
        <li><a href="#div-containers">Divs</a></li>
        <li><a href="#activity">Mission</a></li>
      </ul>
    </nav>
  );
}

export function HeroSection() {
  return (
    <header id="intro" className="section reveal hero-section">
      <span className="chapter-label">chapter one</span>
      <h1 className="hero-title">
        The Art <span className="hero-accent">of the</span> Web
      </h1>
      <p className="hero-copy">
        Passed down like folk songs. A beginner's diary to writing HTML, the foundation of every story told.
      </p>
      <div className="scroll-cue">
        <span>Scroll Gently</span>
        <div className="scroll-line" />
      </div>
    </header>
  );
}



export function MemoriesSection({ images }: { images: MemoryImage[] }) {
  return (
    <section id="memories" className="section reveal memories-section">
      <div className="text-center mb-16">
        <h2 className="memories-title">Long story short...</h2>
        <p className="memories-subtitle">you've built the foundation. The rest is just poetry.</p>
      </div>

      <div className="collage-container" id="collage">
        {images.map((image) => (
          <div
            key={image.alt}
            className="polaroid"
            style={
              {
                top: image.top,
                left: image.left,
                width: `${image.width}px`,
                transform: `rotate(${image.rotation}deg)`,
                zIndex: image.zIndex ?? 1,
              } as CSSProperties
            }
          >
            <div className="polaroid-image-wrap">
              <img src={image.src} alt={image.alt} />
            </div>
            <p className="polaroid-caption">{image.caption}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FooterSection() {
  return (
    <footer className="footer reveal">
      <p className="footer-kicker">A Cinematic Study Experience</p>
      <p className="footer-signoff">By Luiese</p>
    </footer>
  );
}

export function ParticleCanvas() {
  return <canvas id="particle-canvas" className="particle-canvas" aria-hidden="true" />;
}

// ─── Lesson 1 Activity & Submission ──────────────────────────────────────────

const ACTIVITY_SUBMISSION_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwv2FMFAbTQ-1S4PEyiS9Fo-K3ipJxTf_L8DNL2L2p5Z6XIB-yAYYMhDWqUT6xsWt63PA/exec";
const ACTIVITY_UPLOAD_TIMEOUT_MS = 45000;

type UploadStatus = "idle" | "ready" | "uploading" | "success" | "error";

type ArchiveApiResponse = {
  success?: boolean;
  rewardUnlocked?: boolean;
  message?: string;
};

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
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}

function ActivityDust({ active }: { active: boolean }) {
  return (
    <div className={`l1-activity-dust ${active ? "is-active" : ""}`} aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          style={
            {
              "--dust-left": `${(i * 29) % 100}%`,
              "--dust-delay": `${i * -0.25}s`,
              "--dust-size": `${2 + (i % 3)}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function LessonOneActivity({ onUnlock }: { onUnlock?: () => void }) {
  const [studentName, setStudentName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rewardUnlocked, setRewardUnlocked] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadCardRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLSpanElement | null>(null);
  const acceptedRef = useRef<HTMLDivElement | null>(null);

  const canSubmit = Boolean(selectedFile && studentName.trim()) && uploadStatus !== "uploading";
  const rewardImage = new URL("../images/reward1.png", import.meta.url).href;

  const starterCode = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My Folklore Diary</title>
  </head>
  <body>
    <h1>A Page About Me</h1>
    <p>This is my very first paragraph.</p>

    <h2>My Favorite Things</h2>
    <ul>
      <li>Rain</li>
      <li>Acoustic guitars</li>
    </ul>
  </body>
</html>`;

  const resetForFile = (file: File) => {
    setSelectedFile(file);
    setUploadStatus("ready");
    setErrorMessage("");
    setRewardUnlocked(false);
    setRewardClaimed(false);
    setShowRewardModal(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
    setRewardUnlocked(false);
    setRewardClaimed(false);
    setShowRewardModal(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const runSuccessSequence = () => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out", force3D: true, overwrite: "auto" } });
    timeline
      .to(uploadCardRef.current, { filter: "brightness(1.08) contrast(1.05)", duration: 0.38 }, 0)
      .fromTo(acceptedRef.current, { autoAlpha: 0, y: 18, letterSpacing: "0.34em" }, { autoAlpha: 1, y: 0, letterSpacing: "0.12em", duration: 0.7 }, 0.24)
      .fromTo(sealRef.current, { autoAlpha: 0, scale: 2.4, rotate: -18 }, { autoAlpha: 1, scale: 1, rotate: -6, duration: 0.52, ease: "back.out(1.8)" }, 0.62)
      .fromTo(flashRef.current, { autoAlpha: 0 }, { autoAlpha: 0.85, duration: 0.08, yoyo: true, repeat: 1 }, 0.94)
      .to(uploadCardRef.current, { filter: "brightness(1) contrast(1)", duration: 0.72 }, 1.06);
  };

  const runErrorSequence = () => {
    gsap.fromTo(
      uploadCardRef.current,
      { x: -5 },
      { x: 0, duration: 0.09, repeat: 5, yoyo: true, ease: "power2.inOut", overwrite: "auto" }
    );
  };

  const submitActivity = async () => {
    if (!selectedFile || !studentName.trim()) return;

    setUploadStatus("uploading");
    setErrorMessage("");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), ACTIVITY_UPLOAD_TIMEOUT_MS);

    try {
      const fileData = await readFileAsBase64(selectedFile);
      const archiveFileName = createArchiveFileName(studentName, selectedFile.name);
      const response = await fetch(ACTIVITY_SUBMISSION_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        signal: controller.signal,
        body: JSON.stringify({
          fileName: selectedFile.name,
          desiredFileName: archiveFileName,
          mimeType: selectedFile.type || "application/octet-stream",
          fileData,
          studentName: studentName.trim(),
        }),
      });

      if (!response.ok) throw new Error(`Server rejected: ${response.status}`);

      const result = (await response.json()) as ArchiveApiResponse;
      if (!result.success) throw new Error(result.message || "Submission failed.");

      setUploadStatus("success");
      setRewardUnlocked(Boolean(result.rewardUnlocked));
      onUnlock?.();
      runSuccessSequence();
    } catch (error) {
      setUploadStatus("error");
      setRewardUnlocked(false);
      setErrorMessage(
        error instanceof DOMException && error.name === "AbortError"
          ? "Connection timed out. Try a smaller file or submit again."
          : error instanceof TypeError
            ? "Connection was blocked or timed out before a response returned."
            : error instanceof Error
              ? error.message
              : "Submission failed."
      );
      runErrorSequence();
    } finally {
      window.clearTimeout(timeout);
    }
  };

  // Lock scroll when reward popover is open
  useEffect(() => {
    if (!showRewardModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showRewardModal]);

  const rewardPopover = (
    <AnimatePresence>
      {showRewardModal && (
        <motion.div
          className="l1-reward-popover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Mystery reward unlocked"
          onClick={() => setShowRewardModal(false)}
        >
          <button
            type="button"
            className="l1-reward-close"
            onClick={() => setShowRewardModal(false)}
            aria-label="Close reward"
          >
            Close
          </button>
          <motion.div
            className="l1-reward-stage"
            initial={{ y: 40, scale: 0.82, rotateX: 10 }}
            animate={{ y: 0, scale: 1, rotateX: 0 }}
            exit={{ y: 24, scale: 0.92 }}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="l1-reward-glow" aria-hidden="true" />
            <div className="l1-reward-orbit" aria-hidden="true">
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
            </div>
            <div className="l1-envelope-wrapper">
              <div className="l1-envelope-back" />
              <div className="l1-envelope-inner-glow" />
              <figure className="l1-reward-item">
                <img src={rewardImage} alt="Your mystery reward" />
              </figure>
              <div className="l1-envelope-front" />
              <div className="l1-envelope-flap" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <section id="activity" className="section reveal l1-activity">
        <motion.div
          className="l1-activity-card glass-card"
          initial={{ opacity: 0, y: 42, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="l1-activity-stamp">archive mission</span>

          <div className="l1-activity-header">
            <span className="chapter-label">Manuscript Assignment</span>
            <h2 className="section-title">The First Page</h2>
            <p className="section-copy">
              Your task is to write a simple HTML file about yourself.
              Save your file as <code>index.html</code> and place it into the archive to unlock the next chapter.
            </p>
          </div>

          <div className="l1-activity-layout">
            {/* Brief */}
            <div className="l1-activity-brief">
              <h3>Objectives</h3>
              <ul>
                <li>Add a page title using <code>&lt;title&gt;</code>.</li>
                <li>Write a main heading using <code>&lt;h1&gt;</code>.</li>
                <li>Write a short paragraph about yourself.</li>
                <li>Add a list of favorite things using <code>&lt;ul&gt;</code>.</li>
              </ul>
            </div>

            {/* Starter code */}
            <div className="l1-activity-code">
              <p className="l1-code-label">Starter Template</p>
              <div className="code-block">
                <button
                  className="copy-button"
                  type="button"
                  onClick={() => void navigator.clipboard?.writeText(starterCode)}
                >
                  Copy
                </button>
                <pre><code>{starterCode}</code></pre>
              </div>
            </div>
          </div>

          {/* ── Submission dossier ── */}
          <div className="l1-submission-dossier">

            {/* Upload card */}
            <motion.div
              ref={uploadCardRef}
              className={`l1-uploader glass-card is-${uploadStatus} ${isDragging ? "is-dragging" : ""}`}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <ActivityDust active={isDragging || uploadStatus === "success"} />
              <span ref={flashRef} className="l1-archive-flash" />

              <div ref={acceptedRef} className="l1-archive-accepted" aria-hidden={uploadStatus !== "success"}>
                SUBMITTED
              </div>
              <div ref={sealRef} className="l1-wax-seal" aria-hidden={uploadStatus !== "success"}>
                <span>✓</span>
              </div>

              <p className="l1-uploader-label">Activity Submission</p>
              <h3>Submit Your HTML File</h3>
              <p className="section-copy small">Drop your completed <code>index.html</code> or ZIP into the archive.</p>

              <label htmlFor="l1-student-name">Your name</label>
              <input
                id="l1-student-name"
                type="text"
                value={studentName}
                placeholder="Write your name here"
                onChange={(e) => setStudentName(e.target.value)}
              />

              <input
                ref={fileInputRef}
                id="l1-archive-upload"
                className="l1-native-file-input"
                type="file"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) resetForFile(f); }}
              />

              <button
                type="button"
                className="l1-drop-zone"
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) resetForFile(f);
                }}
              >
                {uploadStatus === "success" ? (
                  <>
                    <span className="l1-drop-icon success" aria-hidden="true" style={{ borderColor: 'transparent', fontSize: '1.8rem', color: '#4a6642', background: 'transparent' }}>✓</span>
                    <strong style={{ color: '#3d5e37' }}>SUCCESSFULLY ARCHIVED</strong>
                    <small>Your manuscript is safely stored.</small>
                  </>
                ) : (
                  <>
                    <span className="l1-drop-icon" aria-hidden="true" />
                    <strong>{isDragging ? "Release your file" : "Drag your file here"}</strong>
                    <small>HTML, ZIP, CSS, or any archive file</small>
                  </>
                )}
              </button>

              <AnimatePresence>
                {selectedFile && (
                  <motion.div
                    className="l1-selected-file"
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span />
                    <div>
                      <strong>{selectedFile.name}</strong>
                      <small>{formatFileSize(selectedFile.size)} · ready</small>
                    </div>
                    <button type="button" className="l1-remove-file" onClick={removeFile} aria-label="Remove file">
                      Remove
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                className="l1-submit-btn"
                disabled={!canSubmit}
                onClick={() => void submitActivity()}
              >
                {uploadStatus === "uploading" ? "Submitting…" : "Submit to Archive"}
              </button>

              <AnimatePresence mode="wait">
                {uploadStatus === "error" && (
                  <motion.p
                    key="l1-error"
                    className="l1-upload-status is-error"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    Submission failed.
                    {errorMessage && <span>{errorMessage}</span>}
                  </motion.p>
                )}
                {uploadStatus === "success" && (
                  <motion.div
                    key="l1-success"
                    className="l1-upload-status is-success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <p className="typewriter-text">Your manuscript has been accepted.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Reward card */}
            <div className={`l1-reward-file ${rewardUnlocked ? "is-unlocked" : ""} ${rewardClaimed ? "is-revealed" : ""}`}>
              <div className="l1-mystery-reward">
                {rewardClaimed ? (
                  <>
                    <div className="l1-envelope-wrapper inline-envelope">
                      <div className="l1-envelope-back" />
                      <div className="l1-envelope-inner-glow" />
                      <figure className="l1-reward-item">
                        <img src={rewardImage} alt="Your mystery reward" />
                      </figure>
                      <div className="l1-envelope-front" />
                      <div className="l1-envelope-flap" />
                    </div>
                    <p style={{ fontFamily: '"Courier Prime", monospace', fontSize: '0.85rem', letterSpacing: '0.05em', color: 'rgba(90, 122, 82, 0.9)', margin: 0, fontWeight: 'bold' }}>
                      Twister Fries
                    </p>
                  </>
                ) : (
                  <div className="l1-reward-seal">
                    <span>{rewardUnlocked ? "!" : "?"}</span>
                    <small>{rewardUnlocked ? "reward unlocked" : "complete & submit to unlock"}</small>
                  </div>
                )}
              </div>
              {!rewardClaimed && (
                <button
                  type="button"
                  className="l1-claim-btn"
                  disabled={!rewardUnlocked}
                  onClick={() => {
                    if (!rewardUnlocked) return;
                    setRewardClaimed(true);
                    setShowRewardModal(true);
                  }}
                >
                  Claim Your Reward
                </button>
              )}
              {rewardClaimed && (
                <button
                  type="button"
                  className="l1-claim-btn"
                  onClick={() => {
                    window.location.hash = "lesson-2";
                  }}
                  style={{ marginTop: '0.5rem', background: 'rgba(90, 122, 82, 0.85)', color: '#fff', border: 'none' }}
                >
                  Proceed to Lesson 2
                </button>
              )}
            </div>

          </div>
        </motion.div>
      </section>

      {createPortal(rewardPopover, document.body)}
    </>
  );
}
