(() => {
  'use strict';

  const status = document.getElementById('copy-status');
  document.querySelectorAll('[data-copy]').forEach((button) => {
    const target = document.getElementById(button.dataset.copy);
    if (!target || !navigator.clipboard?.writeText) return;
    button.hidden = false;
    let resetTimer;
    button.addEventListener('click', async () => {
      clearTimeout(resetTimer);
      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        button.textContent = 'Copied!';
        status.textContent = 'Copied to clipboard.';
      } catch {
        // Leave the example selected when clipboard permission is unavailable.
        const range = document.createRange();
        range.selectNodeContents(target);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        button.textContent = 'Select & copy';
        status.textContent = 'Clipboard access is unavailable. The text is selected; use your device’s copy command.';
      }
      resetTimer = setTimeout(() => { button.textContent = 'Copy'; }, 2500);
    });
  });

  const links = [...document.querySelectorAll('.toc li a')];
  const sections = links.map((link) => document.querySelector(link.hash)).filter(Boolean);
  let scheduled = false;
  const updateActive = () => {
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 130) current = section;
    }
    for (const link of links) {
      if (link.hash === `#${current?.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateActive);
    }
  }, { passive: true });
  window.addEventListener('resize', updateActive);
  window.addEventListener('load', updateActive);
  updateActive();
})();
