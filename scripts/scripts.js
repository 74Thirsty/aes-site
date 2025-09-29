// === Mouse glow effect on cards ===
const applyMouseGlow = () => {
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    });

    card.addEventListener('touchmove', (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${touch.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${touch.clientY - rect.top}px`);
    }, { passive: true });
  });
};
applyMouseGlow();

// === Pointer glow background ===
if (window.matchMedia('(pointer: fine)').matches) {
  document.body.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    document.body.style.setProperty('--pointer-x', `${x}%`);
    document.body.style.setProperty('--pointer-y', `${y}%`);
  }, { passive: true });
}

// === Scroll progress bar ===
const progressBar = document.querySelector('.scroll-progress span');
if (progressBar) {
  const updateProgress = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
    const clamped = Math.min(100, Math.max(12, progress));
    progressBar.style.width = `${clamped}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
}

// === AES Assistant ===
const assistantForm = document.getElementById('assistantForm');
const assistantLog = document.getElementById('assistantLog');

if (assistantForm && assistantLog) {
  const assistantInput = document.getElementById('assistantInput');
  const assistantButton = assistantForm.querySelector('button[type="submit"]');

  const fallbackResponses = [
    "Here’s what I can prep for you next:\n• Capture goals and constraints\n• Draft a systems map\n• Share the first interactive prototype plan.",
    "I can pull a short brief with scope, timeline, and three pricing routes so you can pick the path that fits.",
    "Let’s sync your library with the assistant. I’ll package prompts, automations, and launch collateral for an easy start."
  ];

  const patterns = [
    { test: /arbitrage|path|cycle|profit|execution/, response: "AES Copilot: I’ll pull the latest validated arbitrage paths, profit margins, and execution steps for you." },
    { test: /loan|flashloan|depth|liquidity/, response: "AES Copilot: Here’s the flashloan depth across providers and liquidity metrics relevant to your query." },
    { test: /service|integration|retainer/, response: "AES Copilot: We can provision forensic logs, custom integrations, or research retainers depending on your needs." },
    { test: /ai|assistant|copilot|automation/, response: "AES Copilot: I summarize logs, generate execution breakdowns, and help tune your arbitrage strategies in real time." },
    { test: /price|budget|cost|rate|subscription/, response: "AES Copilot: Forensic log subscriptions and integrations are priced by scope; I’ll draft options for you." }
  ];

  let responseIndex = 0;

  const appendMessage = (role, text) => {
    const bubble = document.createElement('div');
    bubble.className = `message ${role}`;
    bubble.textContent = text;
    assistantLog.appendChild(bubble);
    assistantLog.scrollTop = assistantLog.scrollHeight;
  };

  const generateResponse = (input) => {
    const normalized = input.toLowerCase();
    for (const pattern of patterns) {
      if (pattern.test(normalized)) {
        return pattern.response;
      }
    }
    const reply = fallbackResponses[responseIndex % fallbackResponses.length];
    responseIndex += 1;
    return reply;
  };

  const defaultLabel = assistantButton ? assistantButton.textContent : '';

  assistantForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = assistantInput.value.trim();
    if (!value) return;

    appendMessage('user', value);
    assistantInput.value = '';

    if (assistantButton) {
      assistantButton.disabled = true;
      assistantButton.textContent = 'Thinking…';
    }

    setTimeout(() => {
      appendMessage('bot', generateResponse(value));
      if (assistantButton) {
        assistantButton.disabled = false;
        assistantButton.textContent = defaultLabel;
      }
      assistantInput.focus();
    }, 550 + Math.random() * 450);
  });
}

// === Contact form handler ===
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

if (contactForm && contactStatus) {
  let statusTimeout;
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const rawName = (formData.get('name') || '').toString().trim();
    const friendlyName = rawName ? rawName.split(' ')[0] : 'friend';

    contactStatus.textContent = `Thanks ${friendlyName}! We’ll reply within one business day.`;
    contactStatus.classList.add('visible');

    clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => {
      contactStatus.classList.remove('visible');
    }, 8000);

    contactForm.reset();
  });
}

