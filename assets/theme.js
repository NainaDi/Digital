document.documentElement.classList.remove('no-js');

const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 8), { passive: true });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelectorAll('[data-autoplay-video]').forEach((video) => {
  const play = () => video.play().catch(() => {});
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? play() : video.pause());
    }, { threshold: 0.2 });
    observer.observe(video);
  } else {
    play();
  }
});

document.querySelectorAll('.tabs').forEach((tabs) => {
  tabs.addEventListener('click', (event) => {
    const button = event.target.closest('.tab-button');
    if (!button) return;
    tabs.querySelectorAll('.tab-button').forEach((item) => item.classList.toggle('is-active', item === button));
  });
});

document.querySelectorAll('[data-share-product]').forEach((button) => {
  button.addEventListener('click', async () => {
    const shareData = { title: document.title, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (error) { /* User cancelled native share. */ }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      button.textContent = 'Copied';
      window.setTimeout(() => { button.textContent = 'Share'; }, 1800);
    }
  });
});
