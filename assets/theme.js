document.documentElement.classList.remove('no-js');

const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });
}
