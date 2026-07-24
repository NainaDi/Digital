document.documentElement.classList.remove('no-js');

function hydrateLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

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

(function () {
  function refreshReveals(root) {
    const items = (root || document).querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  }

  function initOtoHomeInteractions() {
    hydrateLucideIcons();

    const homeRail = document.getElementById('homeProductRail');
    const homeTabs = document.querySelectorAll('[data-home-tab]');
    if (homeRail && homeTabs.length) {
      homeTabs.forEach((button) => {
        button.addEventListener('click', () => {
          const tab = button.dataset.homeTab;
          homeTabs.forEach((item) => {
            const active = item === button;
            item.classList.toggle('is-active', active);
            item.setAttribute('aria-selected', String(active));
          });
          homeRail.querySelectorAll('.product-card').forEach((card, index) => {
            const groups = (card.dataset.otoGroups || 'new best ready').split(/\s+/);
            const fallbackVisible = tab === 'new' ? index < 8 : tab === 'best' ? index % 2 === 0 : index % 3 === 0;
            const visible = groups.includes(tab) || (!card.dataset.otoGroups && fallbackVisible);
            card.hidden = !visible;
          });
          homeRail.scrollTo({ left: 0, behavior: 'smooth' });
        });
      });
    }

    const focus = document.getElementById('focusProduct');
    const slides = focus ? Array.from(focus.querySelectorAll('[data-focus-slide]')) : [];
    if (focus && slides.length) {
      let index = 0;
      const render = () => slides.forEach((slide, i) => {
        slide.hidden = i !== index;
        slide.classList.toggle('is-active', i === index);
      });
      document.getElementById('focusPrev')?.addEventListener('click', () => { index = (index - 1 + slides.length) % slides.length; render(); });
      document.getElementById('focusNext')?.addEventListener('click', () => { index = (index + 1) % slides.length; render(); });
      render();
    }

    const community = document.getElementById('communityGrid');
    const communityTabs = document.querySelectorAll('[data-community-tab]');
    if (community && communityTabs.length) {
      const allCards = Array.from(community.children);
      const groups = {
        creators: allCards.slice(0, 3),
        people: allCards.slice(3, 6),
        influencers: allCards.slice(0, 2).concat(allCards.slice(-1))
      };
      const renderCommunity = (tab) => {
        community.replaceChildren(...(groups[tab] || groups.creators).map((node) => node.cloneNode(true)));
        communityTabs.forEach((item) => {
          const active = item.dataset.communityTab === tab;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-selected', String(active));
        });
        refreshReveals(community);
        hydrateLucideIcons();
      };
      communityTabs.forEach((button) => button.addEventListener('click', () => renderCommunity(button.dataset.communityTab)));
      renderCommunity('creators');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initOtoHomeInteractions);
  else initOtoHomeInteractions();
  window.addEventListener('load', hydrateLucideIcons, { once: true });
}());
