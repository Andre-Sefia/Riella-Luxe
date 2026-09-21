// ============================================================
// TAP GATE + LOADING VIDEO + BACKGROUND MUSIC
// Browsers block audio (and video with sound) from autoplaying
// without a user gesture, so the whole site waits behind a single
// tap. That tap plays the loading video (unmuted) and starts the
// background music at the same time.
// ============================================================
(function () {
  const tapGate = document.getElementById('tapGate');
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingVideo = document.getElementById('loadingVideo');
  const bgMusic = document.getElementById('bgMusic');
  const siteContent = document.getElementById('siteContent');
  const muteToggle = document.getElementById('muteToggle');

  if (!tapGate) return;

  document.body.style.overflow = 'hidden';

  function finishLoading() {
    loadingScreen.classList.add('loading-screen-hide');
    document.body.style.overflow = '';
    if (siteContent) siteContent.classList.add('site-content-in');
    setTimeout(() => loadingScreen.remove(), 850);
  }

  function enterSite() {
    tapGate.classList.add('tap-gate-hide');
    setTimeout(() => tapGate.remove(), 650);

    loadingScreen.hidden = false;

    if (bgMusic) {
      bgMusic.volume = 0.35;
      bgMusic.play().catch(() => {});
    }

    if (loadingVideo) {
      loadingVideo.muted = false;
      loadingVideo.play().catch(() => {});
      loadingVideo.addEventListener('ended', finishLoading, { once: true });
      // Safety net: don't trap people behind the loading video if it stalls
      setTimeout(finishLoading, 11000);
    } else {
      finishLoading();
    }
  }

  tapGate.addEventListener('click', enterSite, { once: true });

  // Mute toggle — controls the background music only (the loading video's
  // brief sound isn't tied to this, since it plays and finishes on its own)
  if (muteToggle && bgMusic) {
    muteToggle.addEventListener('click', () => {
      bgMusic.muted = !bgMusic.muted;
      muteToggle.classList.toggle('is-muted', bgMusic.muted);
      muteToggle.setAttribute('aria-pressed', bgMusic.muted ? 'true' : 'false');
      muteToggle.setAttribute('aria-label', bgMusic.muted ? 'Unmute background music' : 'Mute background music');
    });
  }
})();


const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// Cinematic reveal: title words and paragraph fade in the first time
// the section enters view, then stay revealed
const revealTitle = document.querySelector('.reveal-title');
const revealTagline = document.querySelector('.reveal-tagline');
const revealPara = document.querySelector('.reveal-para');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      revealTitle.classList.add('in-view');
      revealTagline.classList.add('in-view');
      revealPara.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

observer.observe(document.getElementById('cinematic'));

// Subtle slide-in for section-level blocks, staggered slightly for
// side-by-side items like journal cards
const revealEls = document.querySelectorAll('.reveal-on-scroll');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el, i) => {
  const group = el.closest('.j-grid, .exp-list');
  if (group) {
    const siblings = Array.from(group.children).filter(c => c.classList.contains('reveal-on-scroll'));
    const index = siblings.indexOf(el);
    el.style.transitionDelay = `${Math.min(index, 3) * 0.1}s`;
  }
  revealObserver.observe(el);
});
