import { ManuscriptSection } from "./components";

export function Lesson1Content() {
  return (
    <>
      <ManuscriptSection
        id="what-is-html"
        chapterNumber="I"
        title="What is HTML?"
        explanation={<p>HTML stands for HyperText Markup Language. It is the standard language used to create and design webpages. Think of it as the skeleton of a website; it gives the site structure by defining where headings, paragraphs, images, and links go.</p>}
        realLifeExample="Imagine writing a book. HTML is the outline of chapters, paragraphs, and page numbers, before any cover art or fonts are added."
        codeSample={
          <pre><code>
            <span className="t-comment">{"<!-- This tells the browser what the text is -->"}</span><br/>
            &lt;p&gt;This is a paragraph of text.&lt;/p&gt;
          </code></pre>
        }
        visualExample={<p>This is a paragraph of text.</p>}
        beginnerTip="HTML doesn't style your page, it just organizes it! You'll use CSS later to make it look pretty."
      />

      <ManuscriptSection
        id="html-structure"
        chapterNumber="II"
        title="HTML Structure"
        isRightNumber={true}
        explanation={<p>Every HTML document has a basic structure, often called boilerplate. It wraps your content and tells the web browser how to read the file. The <code>&lt;html&gt;</code> tag holds everything, <code>&lt;head&gt;</code> contains invisible settings, and <code>&lt;body&gt;</code> holds what the user actually sees.</p>}
        realLifeExample="It's like an envelope. The outside (the <head>) has the address and stamps, but the letter inside (the <body>) is what you actually read."
        codeSample={
          <pre><code>
            &lt;!DOCTYPE html&gt;<br/>
            &lt;html&gt;<br/>
            &nbsp;&nbsp;&lt;head&gt;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;title&gt;My Page&lt;/title&gt;<br/>
            &nbsp;&nbsp;&lt;/head&gt;<br/>
            &nbsp;&nbsp;&lt;body&gt;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;Content goes here!<br/>
            &nbsp;&nbsp;&lt;/body&gt;<br/>
            &lt;/html&gt;
          </code></pre>
        }
        visualExample={<p>Content goes here!</p>}
        beginnerTip="Always make sure your content goes inside the <body> tags, otherwise it won't show up on the screen!"
      />

      <ManuscriptSection
        id="headings"
        chapterNumber="III"
        title="Headings"
        explanation={<p>Headings are used to create titles and subtitles on your page. There are six levels of headings, from <code>&lt;h1&gt;</code> (the largest and most important) to <code>&lt;h6&gt;</code> (the smallest).</p>}
        realLifeExample="Think of a newspaper. The massive front-page headline is an <h1>, while the smaller section titles inside are <h2> and <h3>."
        codeSample={
          <pre><code>
            &lt;h1&gt;Main Title&lt;/h1&gt;<br/>
            &lt;h2&gt;Sub Title&lt;/h2&gt;<br/>
            &lt;h3&gt;Smaller Heading&lt;/h3&gt;
          </code></pre>
        }
        visualExample={
          <div>
            <h1 style={{ fontSize: '2em', fontWeight: 'bold' }}>Main Title</h1>
            <h2 style={{ fontSize: '1.5em', fontWeight: 'bold' }}>Sub Title</h2>
            <h3 style={{ fontSize: '1.17em', fontWeight: 'bold' }}>Smaller Heading</h3>
          </div>
        }
        beginnerTip="Use only one <h1> per page! It helps search engines like Google understand what your page is mostly about."
      />

      <ManuscriptSection
        id="paragraphs"
        chapterNumber="IV"
        title="Paragraphs"
        isRightNumber={true}
        explanation={<p>The <code>&lt;p&gt;</code> tag is used to create paragraphs of text. Browsers automatically add an empty line before and after a paragraph to keep things readable.</p>}
        realLifeExample="Just like reading a novel, paragraphs break up walls of text into digestible chunks so your eyes don't get tired."
        codeSample={
          <pre><code>
            &lt;p&gt;Once upon a time, in a faraway land...&lt;/p&gt;<br/>
            &lt;p&gt;There lived a solitary writer.&lt;/p&gt;
          </code></pre>
        }
        visualExample={
          <div>
            <p>Once upon a time, in a faraway land...</p>
            <p>There lived a solitary writer.</p>
          </div>
        }
        beginnerTip="Don't use empty <p></p> tags just to add space. We'll learn better ways to do that!"
      />

      <ManuscriptSection
        id="line-breaks"
        chapterNumber="V"
        title="Line Breaks"
        explanation={<p>Sometimes you want to start a new line without starting a whole new paragraph. The <code>&lt;br&gt;</code> tag inserts a single line break. Notice that it doesn't need a closing tag!</p>}
        realLifeExample="It's like pressing the 'Enter' or 'Return' key on your keyboard while writing a poem."
        codeSample={
          <pre><code>
            &lt;p&gt;Roses are red,&lt;br&gt;<br/>
            Violets are blue.&lt;/p&gt;
          </code></pre>
        }
        visualExample={
          <p>Roses are red,<br/>Violets are blue.</p>
        }
        beginnerTip="Only use <br> for things like poetry or addresses. For normal text spacing, just stick to paragraphs!"
      />

      <ManuscriptSection
        id="horizontal-rules"
        chapterNumber="VI"
        title="Horizontal Rules"
        isRightNumber={true}
        explanation={<p>The <code>&lt;hr&gt;</code> tag creates a thematic break between paragraph-level elements. Visually, it usually looks like a horizontal line drawn straight across the page.</p>}
        realLifeExample="Like a decorative divider at the end of a book chapter, showing that a new scene is about to start."
        codeSample={
          <pre><code>
            &lt;p&gt;End of Chapter 1.&lt;/p&gt;<br/>
            &lt;hr&gt;<br/>
            &lt;p&gt;Start of Chapter 2.&lt;/p&gt;
          </code></pre>
        }
        visualExample={
          <div>
            <p>End of Chapter 1.</p>
            <hr />
            <p>Start of Chapter 2.</p>
          </div>
        }
        beginnerTip="Just like <br>, the <hr> tag is 'empty' and doesn't need a closing tag!"
      />

      <ManuscriptSection
        id="text-formatting"
        chapterNumber="VII"
        title="Text Formatting"
        explanation={<p>You can make specific words stand out inside a paragraph. Use <code>&lt;strong&gt;</code> for bold text and <code>&lt;em&gt;</code> for italicized (emphasized) text.</p>}
        realLifeExample="It's like using a highlighter on your study notes to remember the most important keywords."
        codeSample={
          <pre><code>
            &lt;p&gt;This is &lt;strong&gt;very important&lt;/strong&gt; and this is &lt;em&gt;slightly emphasized&lt;/em&gt;.&lt;/p&gt;
          </code></pre>
        }
        visualExample={
          <p>This is <strong>very important</strong> and this is <em>slightly emphasized</em>.</p>
        }
        beginnerTip="Use <strong> instead of <b>, and <em> instead of <i>. Screen readers for visually impaired users understand them better!"
      />

      <ManuscriptSection
        id="lists"
        chapterNumber="VIII"
        title="Lists"
        isRightNumber={true}
        explanation={<p>Lists help organize items. An unordered list <code>&lt;ul&gt;</code> uses bullet points, while an ordered list <code>&lt;ol&gt;</code> uses numbers. Inside both, you wrap each item in an <code>&lt;li&gt;</code> (list item) tag.</p>}
        realLifeExample="An unordered list is your grocery list, where order doesn't matter. An ordered list is a recipe, where you must follow step 1 before step 2."
        codeSample={
          <pre><code>
            &lt;ul&gt;<br/>
            &nbsp;&nbsp;&lt;li&gt;Apples&lt;/li&gt;<br/>
            &nbsp;&nbsp;&lt;li&gt;Bread&lt;/li&gt;<br/>
            &lt;/ul&gt;
          </code></pre>
        }
        visualExample={
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            <li>Apples</li>
            <li>Bread</li>
          </ul>
        }
        beginnerTip="You can even put lists inside of other lists! This is called 'nesting'."
      />

      <ManuscriptSection
        id="links"
        chapterNumber="IX"
        title="Links"
        explanation={<p>The <code>&lt;a&gt;</code> (anchor) tag connects webpages. It requires an <code>href</code> attribute, which contains the destination address (URL) you want the user to visit when they click the text.</p>}
        realLifeExample="It's a magical portal. You read 'Go to the cabin' on the page, touch the words, and instantly teleport there."
        codeSample={
          <pre><code>
            &lt;a href="https://example.com"&gt;Visit Example Site&lt;/a&gt;
          </code></pre>
        }
        visualExample={
          <a href="#" style={{ color: 'blue', textDecoration: 'underline' }}>Visit Example Site</a>
        }
        beginnerTip="Attributes like 'href' always go inside the opening tag, never the closing tag!"
      />

      <ManuscriptSection
        id="images"
        chapterNumber="X"
        title="Images"
        isRightNumber={true}
        explanation={<p>The <code>&lt;img&gt;</code> tag displays pictures. It needs a <code>src</code> attribute to tell the browser where the image file is located, and an <code>alt</code> attribute to describe the image if it fails to load.</p>}
        realLifeExample="Like pasting a polaroid photograph into your journal. The 'alt' text is the scribbled caption on the back in case the picture fades."
        codeSample={
          <pre><code>
            &lt;img src="forest.jpg" alt="A dark, misty forest" width="200"&gt;
          </code></pre>
        }
        visualExample={
          <div className="polaroid" style={{ position: 'relative', transform: 'rotate(-2deg)', display: 'inline-block', padding: '10px 10px 30px 10px', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <img src={new URL("../images/folklore-woods.jpg", import.meta.url).href} alt="A dark, misty forest" style={{ width: '220px', height: 'auto', display: 'block' }} />
            <div style={{ fontFamily: '"Caveat", cursive', fontSize: '1.2rem', color: '#333', textAlign: 'center', marginTop: '10px' }}>the misty woods</div>
          </div>
        }
        beginnerTip="Always include the 'alt' attribute! It's crucial for users who rely on screen readers."
      />

      <ManuscriptSection
        id="tables"
        chapterNumber="XI"
        title="Tables"
        explanation={<p>Tables display data in a grid. Use <code>&lt;table&gt;</code> to start. <code>&lt;tr&gt;</code> creates a table row, <code>&lt;th&gt;</code> is for a header cell, and <code>&lt;td&gt;</code> is for standard data cells.</p>}
        realLifeExample="Like drawing a schedule or a calendar grid in your notebook to keep track of your daily tasks."
        codeSample={
          <pre><code>
            &lt;table border="1"&gt;<br/>
            &nbsp;&nbsp;&lt;tr&gt;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;th&gt;Day&lt;/th&gt;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;th&gt;Weather&lt;/th&gt;<br/>
            &nbsp;&nbsp;&lt;/tr&gt;<br/>
            &nbsp;&nbsp;&lt;tr&gt;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;td&gt;Monday&lt;/td&gt;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;td&gt;Rainy&lt;/td&gt;<br/>
            &nbsp;&nbsp;&lt;/tr&gt;<br/>
            &lt;/table&gt;
          </code></pre>
        }
        visualExample={
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '4px' }}>Day</th>
                <th style={{ border: '1px solid black', padding: '4px' }}>Weather</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid black', padding: '4px' }}>Monday</td>
                <td style={{ border: '1px solid black', padding: '4px' }}>Rainy</td>
              </tr>
            </tbody>
          </table>
        }
        beginnerTip="Tables are for data only! Back in the 90s, people used tables to design whole websites—don't do that today!"
      />

      <ManuscriptSection
        id="forms"
        chapterNumber="XII"
        title="Forms"
        isRightNumber={true}
        explanation={<p>Forms allow users to send data to a website. Inside a <code>&lt;form&gt;</code>, you can place <code>&lt;input&gt;</code> boxes for typing text, and a <code>&lt;button&gt;</code> to submit the information.</p>}
        realLifeExample="It's just like a physical post office form. You fill in the blank boxes, sign it, and hand it to the clerk."
        codeSample={
          <pre><code>
            &lt;form&gt;<br/>
            &nbsp;&nbsp;&lt;label&gt;Name:&lt;/label&gt;<br/>
            &nbsp;&nbsp;&lt;input type="text" placeholder="Type here"&gt;<br/>
            &nbsp;&nbsp;&lt;button type="submit"&gt;Send&lt;/button&gt;<br/>
            &lt;/form&gt;
          </code></pre>
        }
        visualExample={
          <form onSubmit={e => e.preventDefault()}>
            <label>Name: </label>
            <input type="text" placeholder="Type here" style={{ border: '1px solid #ccc', padding: '2px 4px' }} />
            <button type="submit" style={{ marginLeft: '8px', background: '#e0e0e0', padding: '2px 8px', border: '1px solid #999' }}>Send</button>
          </form>
        }
        beginnerTip="The <label> tag makes forms much easier to use on mobile phones because clicking the label selects the input box!"
      />

      <ManuscriptSection
        id="div-containers"
        chapterNumber="XIII"
        title="Div Containers"
        explanation={<p>The <code>&lt;div&gt;</code> tag is a generic container. It doesn't mean anything on its own, but it is incredibly useful for grouping elements together so you can style them or move them around as a single block.</p>}
        realLifeExample="Think of a cardboard moving box. It doesn't have a specific purpose until you put your books or clothes inside and label it."
        codeSample={
          <pre><code>
            &lt;div class="story-box"&gt;<br/>
            &nbsp;&nbsp;&lt;h2&gt;Chapter 1&lt;/h2&gt;<br/>
            &nbsp;&nbsp;&lt;p&gt;It began in the woods.&lt;/p&gt;<br/>
            &lt;/div&gt;
          </code></pre>
        }
        visualExample={
          <div style={{ padding: '10px', border: '2px solid #ccc' }}>
            <h2 style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Chapter 1</h2>
            <p>It began in the woods.</p>
          </div>
        }
        beginnerTip="Only use <div> when there isn't a better tag. If you are grouping links, use <nav>. If it's the main content, use <main>!"
      />

      <ManuscriptSection
        id="comments"
        chapterNumber="XIV"
        title="Comments"
        isRightNumber={true}
        explanation={<p>Comments are notes in your code that the browser completely ignores. They start with <code>&lt;!--</code> and end with <code>--&gt;</code>. They are meant for you or other developers to read.</p>}
        realLifeExample="Like leaving a sticky note on your manuscript for the editor, saying 'Remind me to fix this later' without printing it in the final book."
        codeSample={
          <pre><code>
            &lt;!-- This is a comment. It won't show on the screen. --&gt;<br/>
            &lt;p&gt;This will show up!&lt;/p&gt;
          </code></pre>
        }
        visualExample={
          <div>
            <p>This will show up!</p>
          </div>
        }
        beginnerTip="Leaving good comments in your code is like writing a love letter to your future self. You'll be thankful you did!"
      />
    </>
  );
}
