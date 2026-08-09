/**
 * chat.js
 * Manages the AI Assistant chat interface.
 * Sends messages to the FastAPI backend /api/chat endpoint
 * and renders AI responses with a typing animation.
 */

const API_BASE = 'https://portfolio-prashant-l42z.onrender.com';
/* -------------------------------------------------------
   DOM References
------------------------------------------------------- */
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const clearChatBtn = document.getElementById('clear-chat-btn');
const chatSuggestions = document.getElementById('chat-suggestions');

/* -------------------------------------------------------
   Utility: Scroll chat to bottom
------------------------------------------------------- */
function scrollChatToBottom() {
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

/* -------------------------------------------------------
   Utility: Auto-grow textarea
------------------------------------------------------- */
function autoGrowTextarea(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

/* -------------------------------------------------------
   Append a user message bubble
------------------------------------------------------- */
function appendUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg-user';
    div.innerHTML = `
    <div class="msg-bubble">${escapeHtml(text)}</div>
    <div class="msg-avatar">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </div>
  `;
    chatMessages.appendChild(div);
    scrollChatToBottom();
}

/* -------------------------------------------------------
   Append a loading indicator bubble
------------------------------------------------------- */
function appendLoadingBubble() {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg-ai';
    div.id = 'chat-loading-bubble';
    div.innerHTML = `
    <div class="msg-avatar">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5 5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z"/><path d="M2 21c0-3.3 2.7-6 6-6h8c3.3 0 6 2.7 6 6"/></svg>
    </div>
    <div class="msg-bubble">
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;
    chatMessages.appendChild(div);
    scrollChatToBottom();
    return div;
}

/* -------------------------------------------------------
   Replace loading bubble with AI response text
------------------------------------------------------- */
function replaceLoadingWithResponse(loadingEl, responseText) {
    loadingEl.remove();

    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg-ai';
    div.innerHTML = `
    <div class="msg-avatar">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3 4 6l-3 1 3 1 1 3 1-3 3-1-3-1-1-3z"/><path d="M19 13l-1 2.5L15.5 17l2.5 1 1 2.5 1-2.5 2.5-1-2.5-1-1-2.5z"/></svg>
    </div>
    <div class="msg-bubble" id="new-ai-response"></div>
  `;
    chatMessages.appendChild(div);

    // Typewriter effect for AI response
    const bubble = div.querySelector('#new-ai-response');
    typeWriterResponse(bubble, responseText);
    scrollChatToBottom();
}

/* -------------------------------------------------------
   Typewriter effect for AI message
------------------------------------------------------- */
function typeWriterResponse(el, text) {
    const words = text.split(' ');
    let i = 0;
    el.textContent = '';

    const interval = setInterval(() => {
        if (i >= words.length) {
            clearInterval(interval);
            scrollChatToBottom();
            return;
        }
        el.textContent += (i === 0 ? '' : ' ') + words[i];
        i++;

        // Periodically scroll
        if (i % 8 === 0) scrollChatToBottom();
    }, 30);
}

/* -------------------------------------------------------
   Escape HTML to prevent XSS
------------------------------------------------------- */
function escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
    return str.replace(/[&<>"']/g, m => map[m]);
}

/* -------------------------------------------------------
   Send message to backend
------------------------------------------------------- */
async function sendMessage(message) {
    if (!message.trim()) return;

    // Disable input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    chatSendBtn.disabled = true;

    // Hide suggestions after first use
    if (chatSuggestions) chatSuggestions.style.display = 'none';

    // Append user message
    appendUserMessage(message);

    // Show loading bubble
    const loadingBubble = appendLoadingBubble();

    try {
        const response = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();
        replaceLoadingWithResponse(loadingBubble, data.response || "I couldn't generate a response. Please try again.");

    } catch (err) {
        // Show user-friendly error
        replaceLoadingWithResponse(
            loadingBubble,
            "⚠️ The AI backend doesn't seem to be running. Please start the FastAPI server and try again. (Run: uvicorn main:app --reload inside /backend)"
        );
    }

    chatSendBtn.disabled = false;
}

/* -------------------------------------------------------
   Suggestion chip handler (called from HTML onclick)
------------------------------------------------------- */
window.sendSuggestion = function (btn) {
    const msg = btn.getAttribute('data-msg');
    if (msg) sendMessage(msg);
};

/* -------------------------------------------------------
   "Ask AI About This Project" handler
------------------------------------------------------- */
window.askAIAboutProject = function (btn) {
    const project = btn.getAttribute('data-project');
    if (!project) return;

    // Scroll to AI section
    const aiSection = document.getElementById('ai-assistant');
    if (aiSection) {
        aiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Small delay to let scroll complete, then send
        setTimeout(() => sendMessage(`Tell me more about ${project}`), 800);
    }
};

/* -------------------------------------------------------
   Clear conversation
------------------------------------------------------- */
function clearConversation() {
    if (!chatMessages) return;
    chatMessages.innerHTML = '';
    // Re-add initial AI greeting
    const initial = document.createElement('div');
    initial.className = 'chat-msg chat-msg-ai';
    initial.innerHTML = `
    <div class="msg-avatar">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
    </div>
    <div class="msg-bubble">
      <p>Conversation cleared. How can I help you? Ask me anything about Prashant! 👋</p>
    </div>
  `;
    chatMessages.appendChild(initial);
    // Show suggestions again
    if (chatSuggestions) chatSuggestions.style.display = 'flex';
}

/* -------------------------------------------------------
   Event Listeners
------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

    // Send on button click
    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', () => {
            sendMessage(chatInput.value.trim());
        });
    }

    // Send on Enter (Shift+Enter for newline)
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(chatInput.value.trim());
            }
        });

        chatInput.addEventListener('input', () => autoGrowTextarea(chatInput));
    }

    // Clear chat button
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', clearConversation);
    }
});
