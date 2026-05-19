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

export function Navigation() {
  return (
    <nav className="top-nav hidden md:block">
      <ul className="top-nav-list glass-card">
        <li><a href="#intro">Intro</a></li>
        <li><a href="#structure">Structure</a></li>
        <li><a href="#content">Content</a></li>
        <li><a href="#media">Media</a></li>
        <li><a href="#semantics">Semantics</a></li>
        <li><a href="#steps">Steps</a></li>
        <li><a href="#memories">Memories</a></li>
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
        Passed down like folk songs. A beginner's diary to writing HTML, the foundation of every story told online.
      </p>
      <div className="scroll-cue">
        <span>Scroll Gently</span>
        <div className="scroll-line" />
      </div>
    </header>
  );
}

export function IntroSection() {
  return (
    <section id="content" className="section reveal relative">
      <div className="section-number">I</div>
      <SectionCard>
        <h2 className="section-title">What is HTML?</h2>
        <p className="section-copy">
          HTML stands for <span className="italic">HyperText Markup Language</span>. If a website were a cabin in the woods, HTML would be the wooden beams and the floorboards. It doesn't paint the walls or build the furniture (that's CSS), but it provides the essential structure.
        </p>
        <p className="section-copy">
          It uses a system of "tags" to wrap around text, whispering to the web browser:
        </p>
        <p className="handwritten-quote">
          "Make this a title. Make this a paragraph. Put a picture here."
        </p>
      </SectionCard>
    </section>
  );
}

export function SkeletonSection() {
  return (
    <section id="structure" className="section reveal relative">
      <div className="section-number right">II</div>
      <SectionCard>
        <h2 className="section-title">The Skeleton</h2>
        <p className="section-copy">
          Every letter needs an envelope. Every web page needs a standard blueprint called the "boilerplate." This tells the browser exactly how to read your writing.
        </p>
        <div className="code-block">
          <button className="copy-button" type="button">Copy</button>
          <pre><code>{`<!-- The Declaration -->
<!DOCTYPE html>

<!-- The Root Envelope -->
<html lang="en">

  <!-- The Mind (Invisible settings) -->
  <head>
    <title>My Folklore Diary</title>
  </head>

  <!-- The Heart (What the user sees) -->
  <body>
    Content goes here...
  </body>

</html>`}</code></pre>
        </div>
      </SectionCard>
    </section>
  );
}

export function SectionDivider() {
  return (
    <div className="section-divider reveal">
      <svg width="200" height="20" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10C50 10 50 0 100 0C150 0 150 10 200 10" stroke="#8C7E6C" strokeWidth="0.5" />
        <circle cx="100" cy="5" r="2" fill="#8C7E6C" />
      </svg>
    </div>
  );
}

export function MediaSection() {
  return (
    <section id="media" className="section reveal relative">
      <SectionCard>
        <h2 className="section-title">Pathways & Photographs</h2>
        <div className="stacked-blocks">
          <div>
            <h3 className="subsection-title">
              <span className="chapter-label-inline">01.</span> Anchors
            </h3>
            <p className="section-copy">
              The <code>{'<a>'}</code> tag creates a hyperlink, anchoring one page to another. It requires an <code>href</code> attribute to know where to go.
            </p>
            <div className="code-block compact">
              <code>
                <span className="t-tag">{'<a'}</span>{" "}
                <span className="t-attr">href=</span>
                <span className="t-val">"https://taylorswift.com"</span>
                <span className="t-tag">{'>'}</span>
                Take me home
                <span className="t-tag">{'</a>'}</span>
              </code>
            </div>
          </div>

          <div>
            <h3 className="subsection-title">
              <span className="chapter-label-inline moss">02.</span> Images
            </h3>
            <p className="section-copy">
              The <code>{'<img>'}</code> tag places a picture on the wall. It is a "void element"—it has no closing tag. It needs a <code>src</code> and an <code>alt</code>.
            </p>
            <div className="code-block compact">
              <code>
                <span className="t-tag">{'<img'}</span>{" "}
                <span className="t-attr">src=</span>
                <span className="t-val">"cabin.jpg"</span>{" "}
                <span className="t-attr">alt=</span>
                <span className="t-val">"An old wooden cabin"</span>
                <span className="t-tag">{'>'}</span>
              </code>
            </div>
          </div>
        </div>
      </SectionCard>
    </section>
  );
}

export function SemanticsSection() {
  return (
    <section id="semantics" className="section reveal relative">
      <div className="section-number">IV</div>
      <SectionCard>
        <h2 className="section-title">Semantic Tags: Giving Meaning</h2>
        <p className="section-copy">
          Imagine building a cozy wooden cabin. Legos let you build anything, but labeling a room "Kitchen", "Living Room", or "Porch" helps everyone instantly know what it is!
        </p>

        <div className="semantic-grid">
          <div className="semantic-card">
            <code>{'<header>'}</code>
            <h4>The Welcome Porch</h4>
            <p>The introductory space of your page. Perfect for logos, navigation lists, and big titles!</p>
          </div>
          <div className="semantic-card">
            <code>{'<main>'}</code>
            <h4>The Living Room</h4>
            <p>The heart of your cabin. Holds the central story, chapters, and thoughts you want visitors to read.</p>
          </div>
          <div className="semantic-card">
            <code>{'<footer>'}</code>
            <h4>The Backyard Gate</h4>
            <p>The end of your garden path. Perfect for copyrights, signature sign-offs, and contact links.</p>
          </div>
        </div>

        <div className="meaning-box">
          <h4>Why use Semantic Tags?</h4>
          <p>These tags don't change how things look visually, but they help search engines and screen readers understand and navigate your layout effortlessly!</p>
        </div>
      </SectionCard>
    </section>
  );
}

export function StepsSection() {
  return (
    <section id="steps" className="section reveal relative">
      <div className="section-number right">V</div>
      <SectionCard className="section-card-border">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Step-by-Step Diary</h2>
            <p className="section-copy small">Begin your journey to writing your very first song on the web.</p>
          </div>
          <div className="studio-pill">
            <span className="studio-dot" />
            <span>Folk Craft Studio</span>
          </div>
        </div>

        <div className="steps-list">
          <article className="step-card">
            <div className="step-badge">Step 1</div>
            <h3>Open Your Craftbook</h3>
            <p>Every poet needs a blank parchment. To write your code, you need a basic text-editing workspace:</p>
            <div className="mini-grid">
              <div className="mini-card">
                <h4>Notepad</h4>
                <p>Built directly into Windows computers. Ultra simple, clean, and perfect for writing pure, raw words.</p>
              </div>
              <div className="mini-card">
                <h4>VS Code</h4>
                <p>The ultimate tool used by programmers. It adds guide-colors to your syntax so you never lose your place.</p>
              </div>
            </div>
          </article>

          <article className="step-card">
            <div className="step-badge moss">Step 2</div>
            <h3>Write the Magic Words</h3>
            <p>Type out this clean, simple, and theme-fitting HTML block.</p>
            <div className="code-switcher">
              <div className="tab-bar">
                <button type="button" className="tab-active">Raw Code</button>
                <button type="button">How It Works</button>
              </div>
              <div className="code-block compact">
                <pre><code>{`<!DOCTYPE html>
<html>
  <head>
    <title>Cabin in the Woods</title>
  </head>
  <body>

    <h1>August Studio</h1>
    <p>A lyric written on a typewriter inside a cozy log cabin.</p>

  </body>
</html>`}</code></pre>
              </div>
            </div>
          </article>

          <article className="step-card">
            <div className="step-badge dark">Step 3</div>
            <h3>Save the Sealed Letter</h3>
            <p>Now save your work so the browser can recognize it! Follow these exact naming rules:</p>
            <div className="filename-box">
              <div>
                <p className="filename-label">Filename requirement</p>
                <p className="filename">index.html</p>
                <p className="filename-note">Make sure there is no hidden .txt suffix or spacing in the title!</p>
              </div>
              <div className="filename-side">
                <p><strong>The Golden Rule:</strong> Browsers seek out the title "index" automatically as the entry porch for any website on the internet!</p>
              </div>
            </div>
          </article>

          <article className="step-card">
            <div className="step-badge bark">Step 4</div>
            <h3>See the Magic Sparkle!</h3>
            <p>Go to the folder where you stored your document and double-click on it:</p>
            <div className="final-note">
              <p>Your web browser will open up. It translates your rustic tags instantly into a bright, living page. You have officially coded your first story on the web!</p>
            </div>
          </article>
        </div>
      </SectionCard>
    </section>
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
      <p className="footer-signoff">By Luiese 🤍</p>
    </footer>
  );
}

export function ParticleCanvas() {
  return <canvas id="particle-canvas" className="particle-canvas" aria-hidden="true" />;
}
