/**
 * terminal.js
 * Animates the hero terminal with a typing-effect sequence.
 * Runs after the loading screen fades out.
 */

// Terminal lines to display with timing
const TERMINAL_LINES = [
  { text: '$ whoami', class: 't-cmd', delay: 100 },
  { text: '  Prashant Padwal — AI & Full Stack Engineer', class: 't-white', delay: 600 },
  { text: '', class: '', delay: 300 },
  { text: '$ cat skills.json', class: 't-cmd', delay: 400 },
  { text: '  {', class: 't-muted', delay: 300 },
  { text: '    "ai": ["Gemini", "RAG", "LLMs", "FAISS"],', class: 't-accent', delay: 250 },
  { text: '    "backend": ["FastAPI", "Node.js", "Express"],', class: 't-accent', delay: 250 },
  { text: '    "db": ["MongoDB", "MySQL", "SQLite"],', class: 't-accent', delay: 250 },
  { text: '    "languages": ["Python", "JS", "C++", "SQL"]', class: 't-accent', delay: 250 },
  { text: '  }', class: 't-muted', delay: 200 },
  { text: '', class: '', delay: 300 },
  { text: '$ git log --oneline -3', class: 't-cmd', delay: 400 },
  { text: '  a9f34b1 feat: MediAssist AI RAG pipeline 🧠', class: 't-primary', delay: 200 },
  { text: '  7c12de8 feat: ShopNest Razorpay integration 💳', class: 't-primary', delay: 200 },
  { text: '  3e871f5 fix: FAISS vector store chunking strategy', class: 't-primary', delay: 200 },
  { text: '', class: '', delay: 300 },
  { text: '$ echo $STATUS', class: 't-cmd', delay: 400 },
  { text: '  🚀 Open to opportunities · Building every day', class: 't-accent', delay: 200 },
  { text: '', class: '', delay: 200 },
];

/**
 * Types a single character at a time into an element.
 */
function typeText(element, text, speed = 28) {
  return new Promise((resolve) => {
    if (!text) { resolve(); return; }
    let i = 0;
    const interval = setInterval(() => {
      element.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

/**
 * Appends a new line element to the terminal body.
 */
function appendLine(container, className) {
  const span = document.createElement('span');
  span.className = `t-line ${className}`;
  container.appendChild(span);
  return span;
}

/**
 * Runs the full terminal animation sequence.
 */
async function runTerminalSequence() {
  const terminalBody = document.getElementById('terminal-body');
  if (!terminalBody) return;

  terminalBody.innerHTML = '';

  for (const line of TERMINAL_LINES) {
    // Wait before printing this line
    await new Promise(r => setTimeout(r, line.delay));

    const el = appendLine(terminalBody, line.class);

    if (line.text) {
      await typeText(el, line.text, line.class === 't-cmd' ? 30 : 10);
    }

    // Auto-scroll terminal
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // Add blinking cursor after last line
  const cursor = document.createElement('span');
  cursor.className = 'cursor-blink';
  terminalBody.appendChild(cursor);
}

// Export for use by main.js
window.runTerminalSequence = runTerminalSequence;
