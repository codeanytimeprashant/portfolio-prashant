'use strict';
/**
 * main.js — macOS Portfolio Controller
 * Handles: window management, dragging, dock, clock, terminal, chat
 */

/* ============================================================
   WINDOW STATE
============================================================ */
const openWindows = new Set();
let topZ = 100;
let dragging = null;
let dragOffsetX = 0, dragOffsetY = 0;

/* ============================================================
   OPEN / CLOSE / MINIMIZE WINDOWS
============================================================ */
function openWindow(id) {
    const win = document.getElementById('win-' + id);
    if (!win) return;
    win.style.display = 'flex';
    win.classList.remove('minimized');
    focusWindow(win);
    openWindows.add(id);
    updateDockDot(id, true);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Special — render terminal once
    if (id === 'terminal') renderTerminal();
    // Special — init chat
    if (id === 'chat') initMacChat();
}

function closeWindow(id) {

    const win = document.getElementById('win-' + id);

    if (!win) return;

    // Hide window
    win.style.display = 'none';

    // Reset chat when Ask AI is closed
    if (id === 'chat') {
        resetMacChat();
    }

    openWindows.delete(id);

    updateDockDot(id, false);
}

function minimizeWindow(id) {
    const win = document.getElementById('win-' + id);
    if (!win) return;
    win.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    win.style.transform = 'scale(0.75) translateY(80px)';
    win.style.opacity = '0';
    setTimeout(() => {
        win.style.display = 'none';
        win.style.transform = '';
        win.style.opacity = '';
        win.style.transition = '';
    }, 250);
    openWindows.delete(id);
}

function focusWindow(win) {
    topZ++;
    win.style.zIndex = topZ;
}

/* ============================================================
   BRING CLICKED WINDOW TO FRONT
============================================================ */
document.addEventListener('mousedown', function (e) {
    const win = e.target.closest('.win');
    if (win) focusWindow(win);
});

/* ============================================================
   DOCK DOTS
============================================================ */
const dockMap = {
    finder: 'finder',
    projects: 'projects',
    mediassist: 'projects',
    shopnest: 'projects',
    recruiterai: 'projects',
    dpi: 'projects',
    terminal: 'terminal',
    contact: 'contact',
    chat: 'chat',
};

function updateDockDot(id, active) {
    const dockId = dockMap[id];
    if (!dockId) return;
    const dot = document.getElementById('dot-' + dockId);
    if (!dot) return;
    if (active) {
        dot.classList.add('active');
    } else {
        const related = Object.keys(dockMap).filter(k => dockMap[k] === dockId);
        const anyOpen = related.some(k => openWindows.has(k));
        if (!anyOpen) dot.classList.remove('active');
    }
}

/* ============================================================
   DRAGGING
============================================================ */
function startDrag(e, id) {
    const win = document.getElementById('win-' + id);
    if (!win) return;
    e.preventDefault();
    dragging = win;
    const rect = win.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    focusWindow(win);
}

document.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    const x = e.clientX - dragOffsetX;
    const y = e.clientY - dragOffsetY;
    dragging.style.left = Math.max(0, x) + 'px';
    dragging.style.top = Math.max(28, y) + 'px';
});

document.addEventListener('mouseup', function () { dragging = null; });

/* ============================================================
   OPEN RESUME FILE
============================================================ */
function openFile(type) {
    if (type === 'resume') {
        window.open('assets/resume/Prashant_Padwal_Resume.pdf', '_blank');
    }
}


/* ============================================================
   TERMINAL ANIMATION
============================================================ */
var terminalRendered = false;

var TECH_STACK_LINES = [
    { text: '@Prashant % show tech stack', cls: 't-cmd', delay: 100 },
    { text: '', cls: '', delay: 200 },
    { text: 'Category         Technologies', cls: 't-white', delay: 300 },
    { text: '────────────────────────────────────────────────', cls: 't-muted', delay: 100 },
    { text: '✓  Language       Python, JavaScript, C++, SQL', cls: 't-accent', delay: 200 },
    { text: '✓  AI / ML        Gemini, RAG, FAISS, LLMs, Embeddings', cls: 't-accent', delay: 200 },
    { text: '✓  Backend        FastAPI, Node.js, Express.js', cls: 't-accent', delay: 200 },
    { text: '✓  Database       MongoDB, MySQL, SQLite, FAISS', cls: 't-accent', delay: 200 },
    { text: '✓  Frontend       HTML5, CSS3, JavaScript', cls: 't-accent', delay: 200 },
    { text: '✓  Dev Tools      Git, GitHub, Postman, AWS', cls: 't-accent', delay: 200 },
    { text: '', cls: '', delay: 200 },
    { text: '✓ 6 stacks loaded (100%)', cls: 't-cmd', delay: 300 },
    { text: '▶ Render time: 4ms', cls: 't-muted', delay: 100 },
];

function renderTerminal() {
    var body = document.getElementById('terminal-mac-body');
    if (!body || terminalRendered) return;
    terminalRendered = true;
    body.innerHTML = '';

    var idx = 0;
    function nextLine() {
        if (idx >= TECH_STACK_LINES.length) {
            var cursor = document.createElement('span');
            cursor.className = 'cursor-blink';
            body.appendChild(cursor);
            return;
        }
        var line = TECH_STACK_LINES[idx++];
        setTimeout(function () {
            var span = document.createElement('span');
            span.className = 't-line ' + line.cls;
            body.appendChild(span);
            body.scrollTop = body.scrollHeight;
            if (line.text) {
                typeInto(span, line.text, line.cls === 't-cmd' ? 25 : 8, function () {
                    nextLine();
                });
            } else {
                nextLine();
            }
        }, line.delay);
    }
    nextLine();
}

function typeInto(el, text, speed, callback) {
    var i = 0;
    var iv = setInterval(function () {
        el.textContent += text[i++];
        if (i >= text.length) {
            clearInterval(iv);
            if (callback) callback();
        }
    }, speed);
}

/* ============================================================
   AI CHAT
============================================================ */
/* ============================================================
   AI CHAT
============================================================ */

var API_BASE = 'https://portfolio-prashant-l42z.onrender.com';
function initMacChat() {
    // Chat is already initialized by HTML.
}


/* ------------------------------------------------------------
   Send message from input
------------------------------------------------------------ */

function sendMacChatFromInput() {

    const input = document.getElementById('chat-input-mac');

    if (!input) return;

    const message = input.value.trim();

    if (!message) return;

    input.value = '';

    sendMacChat(message);
}


/* ------------------------------------------------------------
   Send message to FastAPI
------------------------------------------------------------ */

async function sendMacChat(message) {

    const container = document.getElementById('chat-messages-mac');

    if (!container) return;

    // Hide greeting
    const greeting = document.getElementById('chat-greeting');

    if (greeting) {
        greeting.style.display = 'none';
    }

    // Add user message
    appendBubble(container, message, 'user-msg');

    // Create AI bubble
    const aiWrap = document.createElement('div');
    aiWrap.className = 'chat-bubble-wrap';

    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble ai';

    aiBubble.textContent = '';

    aiWrap.appendChild(aiBubble);
    container.appendChild(aiWrap);

    container.scrollTop = container.scrollHeight;


    try {

        const response = await fetch(
            `${API_BASE}/api/chat`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );


        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }


        // Make sure streaming is available
        if (!response.body) {
            throw new Error('Streaming response not supported.');
        }


        const reader = response.body.getReader();

        const decoder = new TextDecoder();

        let buffer = '';


        while (true) {

            const { value, done } = await reader.read();

            if (done) {
                break;
            }


            buffer += decoder.decode(value, {
                stream: true
            });


            const lines = buffer.split('\n');

            // Keep incomplete line for next chunk
            buffer = lines.pop();


            for (let line of lines) {

                line = line.trim();


                if (!line.startsWith('data:')) {
                    continue;
                }


                const data = line.substring(5).trim();


                if (data === '[DONE]') {
                    continue;
                }


                try {

                    const parsed = JSON.parse(data);


                    if (parsed.error) {
                        throw new Error(parsed.error);
                    }


                    if (parsed.text) {

                        aiBubble.textContent += parsed.text;

                        container.scrollTop =
                            container.scrollHeight;
                    }

                } catch (parseError) {

                    console.error(
                        'Stream parsing error:',
                        parseError
                    );

                }
            }
        }


    } catch (error) {

        console.error(
            'AI Chat Error:',
            error
        );


        aiBubble.textContent =
            '⚠️ Something went wrong while generating the response.';
    }


    container.scrollTop = container.scrollHeight;
}

/* ------------------------------------------------------------
   Add chat bubble
------------------------------------------------------------ */

function appendBubble(container, text, type) {

    const wrap = document.createElement('div');

    wrap.className =
        'chat-bubble-wrap' +
        (type === 'user-msg' ? ' user' : '');


    const bubble = document.createElement('div');

    bubble.className =
        'chat-bubble ' + type;


    bubble.textContent = text;


    wrap.appendChild(bubble);

    container.appendChild(wrap);


    container.scrollTop = container.scrollHeight;
}


/* ============================================================
   PROJECT → ASK AI
============================================================ */

function askAIFromProject(projectContext) {

    openWindow('chat');

    setTimeout(function () {

        sendMacChat(
            'Tell me more about ' + projectContext
        );

    }, 500);
}

/* ============================================================
   PROJECT → ASK AI SHORTCUT
============================================================ */
function askAIFromProject(projectContext) {
    openWindow('chat');
    setTimeout(function () {
        sendMacChat('Tell me more about ' + projectContext);
    }, 500);
}

/* ============================================================
   INIT — runs on DOMContentLoaded
============================================================ */
function init() {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    startClock();
    openWindow('finder');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function resetMacChat() {

    const container = document.getElementById('chat-messages-mac');

    if (!container) return;

    container.innerHTML = `
        <div class="chat-greeting" id="chat-greeting">

            <p style="font-size:1.3rem;margin-bottom:14px;">
                👋 Ask me anything!
            </p>

            <div class="chat-suggestions-mac" id="chat-suggestions-mac">

                <button class="chat-chip"
                        onclick="sendMacChat('Tell me about Prashant as an engineer.')">
                    • Tell me about yourself
                </button>

                <button class="chat-chip"
                        onclick="sendMacChat('What projects has Prashant built?')">
                    • Projects you made
                </button>

                <button class="chat-chip"
                        onclick="sendMacChat('Why should a company hire Prashant?')">
                    • Why should I hire you?
                </button>

                <button class="chat-chip"
                        onclick="sendMacChat('What are Prashant\\'s backend skills?')">
                    • Show your backend skills
                </button>

                <button class="chat-chip"
                        onclick="sendMacChat('What is Prashant\\'s tech stack?')">
                    • What's your tech stack?
                </button>

            </div>

        </div>
    `;

    // Scroll back to top
    container.scrollTop = 0;
}