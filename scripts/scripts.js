const applyCardGlow = () => {
  document.querySelectorAll('.card').forEach((card) => {
    const handlePointer = (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    card.addEventListener('pointermove', handlePointer, { passive: true });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    });
  });
};

const applyPointerGlow = () => {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  document.body.addEventListener(
    'pointermove',
    (event) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      document.body.style.setProperty('--pointer-x', `${x}%`);
      document.body.style.setProperty('--pointer-y', `${y}%`);
    },
    { passive: true }
  );
};

const applyTabGroups = () => {
  document.querySelectorAll('[data-tab-group]').forEach((group) => {
    const buttons = Array.from(group.querySelectorAll('.tab-button'));
    const panels = Array.from(group.querySelectorAll('.tab-panel'));

    const activate = (targetId) => {
      buttons.forEach((button) => {
        const isActive = button.dataset.tabTarget === targetId;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      panels.forEach((panel) => {
        const isActive = panel.id === targetId;
        panel.classList.toggle('active', isActive);
        panel.setAttribute('aria-hidden', String(!isActive));
      });
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        activate(button.dataset.tabTarget);
      });
    });
  });
};

const applyTimelinePulse = () => {
  const events = Array.from(document.querySelectorAll('[data-timeline] .timeline-event'));
  if (events.length === 0) return;

  let index = events.findIndex((event) => event.classList.contains('active'));
  if (index < 0) index = 0;

  const rotate = () => {
    events.forEach((event, i) => {
      event.classList.toggle('active', i === index);
    });
    index = (index + 1) % events.length;
  };

  setInterval(rotate, 6000);
};

const applyAccordion = () => {
  document.querySelectorAll('[data-accordion] .accordion-trigger').forEach((trigger) => {
    const panel = trigger.nextElementSibling;
    if (!panel) return;

    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      trigger.querySelector('.icon').textContent = expanded ? '+' : '–';
      if (expanded) {
        panel.hidden = true;
      } else {
        panel.hidden = false;
      }
    });
  });
};

const applyCopyButtons = () => {
  document.querySelectorAll('[data-copy]').forEach((button) => {
    const selector = button.getAttribute('data-copy');
    if (!selector) return;
    const target = document.querySelector(selector);
    if (!target) return;

    button.addEventListener('click', async () => {
      const text = target.textContent?.trim();
      if (!text) return;

      const original = button.textContent;
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = 'Copied!';
      } catch (error) {
        console.error('Copy failed', error);
        button.textContent = 'Press Ctrl+C';
      }

      setTimeout(() => {
        button.textContent = original;
      }, 1800);
    });
  });
};

const applyContactForm = () => {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactStatus');
  if (!form || !status) return;

  let timeoutId;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const rawName = formData.get('name');
    const friendly = rawName ? rawName.toString().trim().split(' ')[0] : 'operator';

    status.textContent = `Appreciate it, ${friendly}. Strategy desk will revert within one business day.`;
    status.classList.add('visible');

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      status.textContent = '';
      status.classList.remove('visible');
    }, 8000);

    form.reset();
  });
};

const applyNavToggle = () => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const links = document.querySelector('[data-nav-links]');
  if (!toggle || !links) return;

  const update = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    links.dataset.open = open ? 'true' : 'false';
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    update(open);
  });

  links.querySelectorAll('a').forEach((anchor) => {
    anchor.addEventListener('click', () => update(false));
  });
};

const applyYear = () => {
  const target = document.getElementById('year');
  if (target) {
    target.textContent = new Date().getFullYear();
  }
};

const boot = () => {
  applyCardGlow();
  applyPointerGlow();
  applyTabGroups();
  applyTimelinePulse();
  applyAccordion();
  applyCopyButtons();
  applyContactForm();
  applyNavToggle();
  applyYear();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
