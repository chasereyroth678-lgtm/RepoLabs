(function () {
  const toggleBtn = document.getElementById('chat-toggle');
  const closeBtn = document.getElementById('chat-close');
  const panel = document.getElementById('chat-panel');
  const messagesEl = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');

  if (!toggleBtn || !panel) return; // widget not on this page somehow

  // In-memory only (no browser storage) - resets on page reload, which is fine for a help widget
  let history = [];
  let isWaiting = false;

  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
      input.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.add('hidden');
  });

  function addMessage(text, sender) {
    const el = document.createElement('div');
    el.className = `chat-msg chat-msg-${sender}`;
    el.textContent = text;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  function addTyping() {
    const el = document.createElement('div');
    el.className = 'chat-msg chat-msg-bot chat-msg-typing';
    el.id = 'chat-typing-indicator';
    el.textContent = '...';
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('chat-typing-indicator');
    if (el) el.remove();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || isWaiting) return;

    addMessage(text, 'user');
    input.value = '';
    isWaiting = true;
    addTyping();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
      });

      const data = await res.json();
      removeTyping();

      if (!res.ok) {
        addMessage(data.error || 'Something went wrong. Try again.', 'bot');
      } else {
        addMessage(data.reply, 'bot');
        history.push({ role: 'user', text });
        history.push({ role: 'model', text: data.reply });
      }
    } catch (err) {
      removeTyping();
      addMessage('Could not reach the chat service. Check your connection and try again.', 'bot');
    } finally {
      isWaiting = false;
      input.focus();
    }
  });
})();
