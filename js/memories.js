'use strict';
(() => {
  const cards = [...document.querySelectorAll('.photo-card')];
  const { storage, atElement, motion } = window.Love;
  const saved = storage.get('favorites', []);
  const favorites = new Set((Array.isArray(saved) ? saved : []).filter(id => ['1','2','3','4','5'].includes(id)));
  const lightbox = document.querySelector('.lightbox');
  const largeImage = document.getElementById('lightbox-image');
  const placeholder = document.getElementById('lightbox-placeholder');
  const stage = document.querySelector('.lightbox-stage');
  let current = 0, originalButton = null, touchStart = null;

  function updateFavorites() {
    cards.forEach(card => {
      const button = card.querySelector('.favorite'), active = favorites.has(card.dataset.memory);
      button.textContent = active ? '♥' : '♡'; button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', `${active ? 'Unfavorite' : 'Favorite'} memory ${card.dataset.memory}`);
    });
    document.getElementById('favorites-status').textContent = `${favorites.size} of 5 memories close to your heart.`;
  }
  function updatePhoto() {
    const card = cards[current], source = card.querySelector('img');
    const loaded = source.complete && source.naturalWidth > 0;
    largeImage.hidden = !loaded; placeholder.hidden = loaded;
    largeImage.alt = source.alt;
    if (loaded) largeImage.src = source.getAttribute('src'); else largeImage.removeAttribute('src');
    document.getElementById('lightbox-caption').textContent = card.querySelector('.caption-text').textContent;
    document.getElementById('lightbox-count').textContent = `${current + 1} / ${cards.length}`;
    stage.classList.remove('changing'); void stage.offsetWidth; stage.classList.add('changing');
  }
  function changePhoto(direction) { current = (current + direction + cards.length) % cards.length; updatePhoto(); }
  largeImage.addEventListener('error', () => { largeImage.hidden = true; placeholder.hidden = false; });

  cards.forEach((card, index) => {
    const image = card.querySelector('img');
    function photoState() {
      card.classList.toggle('has-image', image.naturalWidth > 0);
      if (lightbox.open && current === index) updatePhoto();
    }
    image.addEventListener('load', photoState); image.addEventListener('error', photoState);
    if (image.complete) photoState();
    card.querySelector('.favorite').addEventListener('click', event => {
      const id = card.dataset.memory;
      if (favorites.has(id)) favorites.delete(id); else { favorites.add(id); atElement(event.currentTarget, 9); }
      storage.set('favorites', [...favorites]); updateFavorites();
    });
    card.querySelector('.photo-open').addEventListener('click', event => {
      current = index; originalButton = event.currentTarget; updatePhoto(); lightbox.showModal();
    });
  });
  updateFavorites();
  document.getElementById('previous-photo').addEventListener('click', () => changePhoto(-1));
  document.getElementById('next-photo').addEventListener('click', () => changePhoto(1));
  document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    const r = lightbox.getBoundingClientRect();
    if (event.target === lightbox && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) lightbox.close();
  });
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); changePhoto(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); changePhoto(-1); }
  });
  stage.addEventListener('touchstart', event => { const t = event.changedTouches[0]; touchStart = { x:t.clientX, y:t.clientY }; }, { passive:true });
  stage.addEventListener('touchend', event => {
    if (!touchStart) return;
    const t = event.changedTouches[0], dx = t.clientX - touchStart.x, dy = t.clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) changePhoto(dx < 0 ? 1 : -1);
    touchStart = null;
  }, { passive:true });
  lightbox.addEventListener('close', () => {
    const card = originalButton?.closest('.photo-card');
    originalButton?.focus({ preventScroll:true });
    if (card && !motion.matches) { card.classList.add('returning'); setTimeout(() => card.classList.remove('returning'), 550); }
  });
})();
