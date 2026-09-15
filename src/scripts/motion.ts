const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let cleanups: Array<() => void> = [];

function onCleanup(fn: () => void) {
  cleanups.push(fn);
}

function initReveal() {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (items.length === 0) return;
  if (reduceMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );
  items.forEach((el) => io.observe(el));
  onCleanup(() => io.disconnect());
}

function initSpotlight() {
  const handler = (event: PointerEvent) => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('.spot');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    target.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };
  document.addEventListener('pointermove', handler, { passive: true });
  onCleanup(() => document.removeEventListener('pointermove', handler));
}

function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
  update();
  window.addEventListener('scroll', update, { passive: true });
  onCleanup(() => window.removeEventListener('scroll', update));

  const links = Array.from(header.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
  const sections = links
    .map((link) => {
      const hash = link.getAttribute('href')?.split('#')[1];
      return hash ? document.getElementById(hash) : null;
    })
    .filter((el): el is HTMLElement => Boolean(el));
  if (sections.length === 0 || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((link) => {
          const active = link.getAttribute('href')?.endsWith(`#${entry.target.id}`);
          link.classList.toggle('is-active', Boolean(active));
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((section) => io.observe(section));
  onCleanup(() => io.disconnect());
}

function initMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
  if (!toggle || !panel) return;
  const setOpen = (open: boolean) => {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  };
  setOpen(false);
  const onToggle = () => setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') setOpen(false);
  };
  const onLink = (event: Event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  };
  toggle.addEventListener('click', onToggle);
  document.addEventListener('keydown', onKey);
  panel.addEventListener('click', onLink);
  onCleanup(() => {
    toggle.removeEventListener('click', onToggle);
    document.removeEventListener('keydown', onKey);
    panel.removeEventListener('click', onLink);
    document.body.classList.remove('menu-open');
  });
}

function initTheme() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  if (buttons.length === 0) return;
  const apply = (theme: 'dark' | 'light') => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* storage unavailable */
    }
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(theme === 'light')));
  };
  const onClick = () => apply(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
  buttons.forEach((button) => {
    button.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'light'));
    button.addEventListener('click', onClick);
  });
  onCleanup(() => buttons.forEach((button) => button.removeEventListener('click', onClick)));
}

function initProgress() {
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.transform = `scaleX(${ratio})`;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  onCleanup(() => {
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', update);
  });
}

type Node = { x: number; y: number; vx: number; vy: number; r: number };

function initConstellation() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-constellation]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let nodes: Node[] = [];
  let frame = 0;
  const pointer = { x: -9999, y: -9999, active: false };
  const still = reduceMotion();

  const color = () => {
    const styles = getComputedStyle(document.documentElement);
    return {
      signal: styles.getPropertyValue('--signal').trim() || '#d5e786',
      ink: styles.getPropertyValue('--ink').trim() || '#eef2e8',
    };
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(18, Math.min(60, Math.floor((width * height) / 22000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 1 + Math.random() * 1.6,
    }));
  };

  const draw = () => {
    const { signal, ink } = color();
    ctx.clearRect(0, 0, width, height);
    const linkDist = Math.min(180, width / 6);

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < linkDist) {
          ctx.globalAlpha = (1 - dist / linkDist) * 0.35;
          ctx.strokeStyle = ink;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      if (pointer.active) {
        const dist = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (dist < linkDist * 1.2) {
          ctx.globalAlpha = (1 - dist / (linkDist * 1.2)) * 0.8;
          ctx.strokeStyle = signal;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
    }

    for (const node of nodes) {
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (pointer.active) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = signal;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const step = () => {
    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < -10) node.x = width + 10;
      if (node.x > width + 10) node.x = -10;
      if (node.y < -10) node.y = height + 10;
      if (node.y > height + 10) node.y = -10;
    }
    draw();
    frame = requestAnimationFrame(step);
  };

  const onMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
    if (still) draw();
  };
  const onLeave = () => {
    pointer.active = false;
    if (still) draw();
  };

  resize();
  if (still) draw();
  else frame = requestAnimationFrame(step);

  const onResize = () => {
    resize();
    if (still) draw();
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerleave', onLeave);
  const observer = new MutationObserver(() => {
    if (still) draw();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  onCleanup(() => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerleave', onLeave);
    observer.disconnect();
  });
}

function init() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
  document.documentElement.classList.remove('no-js');
  initTheme();
  initHeader();
  initMenu();
  initReveal();
  initSpotlight();
  initProgress();
  initConstellation();
}

function restoreTheme() {
  let theme: string | null = null;
  try {
    theme = localStorage.getItem('theme');
  } catch {
    /* storage unavailable */
  }
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.remove('no-js');
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', () => {
  cleanups.forEach((fn) => fn());
  cleanups = [];
});
// ClientRouter replaces <html> attributes on navigation, which drops data-theme.
document.addEventListener('astro:after-swap', restoreTheme);
