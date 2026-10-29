'use strict';
// Shared behavior for index.html and memories.html. No backend or build step.
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const storage = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem('julie-' + key)) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem('julie-' + key, JSON.stringify(value)); } catch { /* Works without storage, too. */ } }
  };
  document.documentElement.dataset.theme = storage.get('theme', 'day') === 'night' ? 'night' : 'day';

  // Shared overlays. Native dialogs provide focus trapping and Escape support.
  document.body.insertAdjacentHTML('beforeend', `
    <div class="effects" aria-hidden="true"></div>
    <div class="page-veil" aria-hidden="true">♡</div>
    <div class="toast" role="status" hidden></div>
    <dialog class="love-dialog" id="surprise-dialog" aria-labelledby="surprise-title">
      <button class="icon-button dialog-close" aria-label="Close surprise">×</button>
      <div class="magic" aria-hidden="true"></div>
      <h2 id="surprise-title"></h2><div class="dialog-copy"></div>
      <div class="dialog-actions"><button class="button secondary" id="surprise-replay">Replay the magic ↻</button><button class="text-button" id="surprise-done">Keep it in my heart ♡</button></div>
    </dialog>
    <aside class="music-player" aria-label="Our song music player">
      <audio id="our-song" src="assets/music/music.mp3" preload="none" loop></audio>
      <div class="music-top">
        <button class="music-toggle" aria-label="Play our song">▶</button>
        <div class="track-info"><strong id="song-title"></strong><small id="song-artist"></small></div>
        <button class="minimize" aria-label="Minimize music player" aria-expanded="true" aria-controls="music-details">−</button>
      </div>
      <div class="music-details" id="music-details">
        <div class="progress-row"><span id="elapsed">0:00</span><input id="song-progress" type="range" min="0" max="100" value="0" step="0.1" aria-label="Song position" disabled><span id="duration">0:00</span></div>
        <div class="volume-row"><button id="mute-song" aria-label="Mute song" aria-pressed="false">♪</button><input id="song-volume" type="range" min="0" max="1" value="0.5" step="0.05" aria-label="Music volume"><div class="visualizer" aria-hidden="true"><i></i><i></i><i></i><i></i></div></div>
      </div>
      <p class="music-status" id="music-status" role="status"></p>
    </aside>`);

  const effects = $('.effects');
  let toastTimer;
  function toast(message) {
    const box = $('.toast'); box.textContent = message; box.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { box.hidden = true; }, 3800);
  }
  function burst(x = innerWidth / 2, y = innerHeight / 2, amount = 18) {
    if (motion.matches) return;
    const available = Math.max(0, 60 - effects.querySelectorAll('.burst').length);
    for (let i = 0; i < Math.min(amount, available); i++) {
      const heart = document.createElement('span'); heart.className = 'burst';
      heart.textContent = i % 4 === 0 ? '❀' : '♥';
      heart.style.cssText = `--x:${x}px;--y:${y}px;--size:${12 + Math.random() * 18}px;--dx:${(Math.random() - .5) * 400}px;--dy:${-80 - Math.random() * 270}px;--rotation:${Math.random() * 90 - 45}deg`;
      effects.append(heart); setTimeout(() => heart.remove(), 1800);
    }
  }
  function atElement(element, amount) {
    const r = element.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, amount);
  }
  window.Love = { storage, burst, toast, motion, atElement };

  // A bounded set of decorations, never hundreds of animated nodes.
  for (let i = 0; i < 10; i++) {
    const petal = document.createElement('i'); petal.className = 'petal';
    petal.style.cssText = `--left:${i * 10 + Math.random() * 7}%;--duration:${11 + Math.random() * 9}s;--delay:${-Math.random() * 20}s`;
    effects.append(petal);
    const light = document.createElement('i'); light.className = 'fairy';
    light.style.cssText = `--left:${Math.random() * 100}%;--top:${Math.random() * 100}%;--delay:${-Math.random() * 5}s`;
    effects.append(light);
  }
  addEventListener('load', () => burst(innerWidth / 2, innerHeight * .65, 1), { once: true });
  document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused-effects', document.hidden));
  let lastTrail = 0;
  document.addEventListener('pointermove', event => {
    if (motion.matches || event.pointerType !== 'mouse' || event.buttons || Date.now() - lastTrail < 180) return;
    lastTrail = Date.now();
    const heart = document.createElement('span'); heart.className = 'cursor-heart'; heart.textContent = '♡';
    heart.style.left = event.clientX + 8 + 'px'; heart.style.top = event.clientY + 8 + 'px';
    effects.append(heart); setTimeout(() => heart.remove(), 1150);
    const bouquet = $('.bouquet');
    if (bouquet) {
      bouquet.style.setProperty('--parallax-x', (event.clientX / innerWidth - .5) * 9 + 'px');
      bouquet.style.setProperty('--parallax-y', (event.clientY / innerHeight - .5) * 7 + 'px');
    }
  }, { passive: true });

  // Content stays visible without JavaScript or IntersectionObserver.
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: .08 });
    $$('.reveal').forEach((element, i) => {
      element.classList.add('observe'); element.style.setProperty('--reveal-delay', (i % 3) * .09 + 's'); observer.observe(element);
    });
  }
  motion.addEventListener('change', () => {
    if (motion.matches) $$('.observe').forEach(element => element.classList.add('visible'));
  });
  function updateThemeButton() {
    const night = document.documentElement.dataset.theme === 'night';
    $$('button[data-theme]').forEach(button => { button.textContent = night ? '☀' : '☾'; button.setAttribute('aria-label', night ? 'Switch to soft daylight mode' : 'Switch to dreamy night mode'); button.setAttribute('aria-pressed', String(night)); });
  }
  updateThemeButton();
  $$('button[data-theme]').forEach(button => button.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'night' ? 'day' : 'night';
    document.documentElement.dataset.theme = theme; storage.set('theme', theme); updateThemeButton(); atElement(button, 6);
  }));

  // Native cross-document View Transitions are enabled in CSS. This fallback
  // only handles ordinary same-origin HTML links; back/forward remain native.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname || !url.pathname.endsWith('.html')) return;
    if (!motion.matches && !('onpageswap' in window)) {
      event.preventDefault(); document.body.classList.add('leaving'); setTimeout(() => location.assign(url.href), 180);
    }
  });
  addEventListener('pageshow', () => document.body.classList.remove('leaving'));

  function openLetter() {
    const envelope = $('#envelope'), letter = $('#love-letter');
    if (!letter) return;
    envelope.classList.remove('opened'); letter.classList.remove('writing');
    void envelope.offsetWidth; // Restart only this intentional replay.
    envelope.classList.add('opened'); letter.classList.add('writing');
    $('#letter').scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth' });
    letter.focus({ preventScroll: true }); burst(innerWidth / 2, innerHeight * .65, 24);
  }
  $$('.letter-words p').forEach((p, i) => p.style.setProperty('--i', i));
  $('#open-heart')?.addEventListener('click', openLetter);
  $('#replay-letter')?.addEventListener('click', openLetter);

  const reasons = [
    'Your kindness makes even small moments feel warm.',
    'You have a smile that I keep thinking about after we say goodbye.',
    'I appreciate the time and care you choose to share with me.',
    'I love getting to know your thoughts, your dreams, and your little stories.',
    'You remind me to notice the good in an ordinary day.',
    'Your effort matters to me, including the quiet things nobody applauds.',
    'I enjoy your company, even when there is nothing special planned.',
    'You are your own wonderful person, and I feel grateful to know you.'
  ];
  const littleLove = ['Somewhere in the middle of my day, I am smiling because I thought of you.', 'A little reminder, my love: you deserve kindness on your tired days, too.', 'If today feels busy, here is a tiny pocket of peace and a heart from me.', 'You do not need a special occasion to be appreciated. I am grateful for you today.', 'I hope something small and lovely makes you smile today, Baby Julie.'];
  const wishes = ['I wish for more ordinary days together: unhurried conversations, shared laughter, and time to know each other better.', 'I wish for peace in your heart, courage for your dreams, and a future we both feel happy choosing.', 'I wish that we keep growing in patience, honesty, and kindness, one little day at a time.'];
  const secrets = {
    kiss: { title: 'A Secret Kiss', icon: '💋', text: 'A tiny kiss for my Baby Julie, sent with a smile. If you would like it, imagine a gentle kiss on your forehead and me whispering, “I am so happy to know you.”' },
    hug: { title: 'A Hug From James', icon: '♡', text: 'If I could be beside you right now, I would hold you close and remind you how special you are to me.\n\nHere is a little pause from the busy world. Take a slow breath, relax your shoulders, and stay as long as you need, my love.' },
    prayer: { title: 'A Little Prayer', icon: '✧', text: 'Dear God, thank You for Julie and for letting our paths cross. Please protect her, give her peace, and guide her through the things on her heart. Bless her dreams, her family, and the work she puts into each day.\n\nHelp me care for her with patience, honesty, and respect. Give us wisdom as we get to know each other, and guide us toward what is good for both of us. May she feel supported and deeply valued. Amen.' },
    reasons: { title: 'Reasons I Love You', icon: '♡', text: '' },
    hiddenLetter: { title: 'A Letter Just for You', icon: '💌', text: `My sweetest Baby Julie,\n\nIf you found this little letter, let me tell you something quietly: I am grateful for the chance to care about you. Not only during the sweet conversations or the exciting moments, but during the ordinary spaces between them. You still come to mind when the day is simple and there is nothing important to announce.\n\nI hope you know that you are allowed to have your own pace. You can be busy, need rest, change your mind, or take time to understand what you feel. My affection is not a deadline. I want whatever grows between us to have room for honesty and for both of us to feel comfortable being ourselves.\n\nThere are things about you I will keep discovering, and that makes me happy. I want to learn which little things brighten your day and which kind of support feels helpful to you. I want to hear the stories you feel ready to share and respect the ones you want to keep to yourself. Knowing someone well is a gift built over time.\n\nWhen I imagine caring for you, I think of small, useful things: remembering something you told me, asking how an important day went, listening carefully, and making time when I say I will. I know that a beautiful message cannot take the place of showing up. I want these words to remind me of the care I hope to practice.\n\nI also hope we keep room for laughter. I want us to enjoy the silly moments, the little jokes, and the days when being together does not need a plan. Life can be serious enough. Sharing a smile with you is something I never want to stop appreciating.\n\nIf the future brings us closer, I hope we meet it with open hearts and clear words. We do not have to rush into a story before we are ready. I would rather take the time to build trust, learn from each other, and choose our next steps together.\n\nFor now, thank you for being part of my life. Thank you for every kindness, every bit of time, and every chance to know you better. I pray that today is gentle with you and that this little hidden note brings you a moment of warmth.\n\nWith a grateful heart,\nYour James 💗` },
    rose: { title: 'The Secret Rose', icon: '🌹', text: 'If I could tuck a note into every rose, each one would say this: I notice you. I appreciate you. I am glad our paths crossed.\n\nThis little garden is a reminder that care grows through small things done with love, again and again.' },
    thousand: { title: 'A Thousand Hearts', icon: '💞', text: 'A little sky full of love, just for you, Baby Julie. Every floating heart carries the same simple thought: I am grateful for you.' },
    final: { title: 'One Last Secret', icon: '🎀', text: 'You found the little heart, followed the star, and untied the ribbon. Here is what was waiting underneath it all.\n\nMy favorite part of making this gift was knowing it was for you. Every little detail was a chance to think about the happiness you bring into my days. I hope you leave this page with a smile and with no doubt that your kindness and presence are appreciated.\n\nThere is no question you have to answer here and nothing you need to give in return. Just take this little moment of love with you. Whatever our next chapter holds, I hope we write it with honesty, patience, faith, and care.\n\nWith all the love in my heart,\nYour James Traigo 💗' }
  };
  const dialog = $('#surprise-dialog');
  let activeSecret = '', reasonIndex = 0, opener = null;
  const usedRandom = {};
  function pick(list, name) {
    let index = Math.floor(Math.random() * list.length);
    if (index === usedRandom[name]) index = (index + 1) % list.length;
    usedRandom[name] = index; return list[index];
  }
  function paragraphs(text) {
    const area = $('.dialog-copy', dialog); area.replaceChildren();
    text.split('\n\n').forEach(text => { const p = document.createElement('p'); p.textContent = text; area.append(p); });
  }
  function animateSecret() {
    const magic = $('.magic', dialog); magic.classList.remove('animate'); void magic.offsetWidth; magic.classList.add('animate');
    if (activeSecret === 'thousand' || activeSecret === 'kiss' || activeSecret === 'rose') burst(innerWidth / 2, innerHeight * .65, activeSecret === 'thousand' ? 42 : 18);
  }
  function nextReason() {
    const area = $('.dialog-copy', dialog);
    if (reasonIndex >= reasons.length) { reasonIndex = 0; area.replaceChildren(); }
    const card = document.createElement('div'); card.className = 'reason-card';
    const label = document.createElement('small'); label.textContent = `Reason ${reasonIndex + 1} of ${reasons.length}`;
    const text = document.createElement('span'); text.textContent = reasons[reasonIndex++]; card.append(label, text); area.append(card);
    card.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'nearest' });
    $('#surprise-replay').textContent = reasonIndex === reasons.length ? 'Read the reasons again ♡' : 'One more reason ♡';
  }
  function openSecret(name, trigger) {
    if (name === 'final' && charms.size < 3) return;
    activeSecret = name; opener = trigger;
    const data = name === 'littleLove' ? { title: 'A Little Love for Julie', icon: '💗', text: pick(littleLove, name) } : name === 'wish' ? { title: 'A Wish for Us', icon: '✨', text: pick(wishes, name) } : secrets[name];
    if (!data) return;
    $('#surprise-title').textContent = data.title;
    const magic = $('.magic', dialog); magic.dataset.effect = name; magic.replaceChildren();
    for (let i = 0; i < (name === 'hug' ? 2 : 1); i++) { const span = document.createElement('span'); span.textContent = data.icon; magic.append(span); }
    paragraphs(data.text); reasonIndex = 0;
    $('#surprise-replay').textContent = name === 'littleLove' ? 'Another little love 💗' : name === 'wish' ? 'Another little wish ✨' : 'Replay the magic ↻';
    dialog.showModal(); dialog.scrollTop = 0;
    if (name === 'reasons') { $('.dialog-copy', dialog).replaceChildren(); nextReason(); }
    animateSecret();
  }
  $$('[data-secret]').forEach(button => button.addEventListener('click', () => openSecret(button.dataset.secret, button)));
  $('#surprise-replay').addEventListener('click', () => {
    if (activeSecret === 'reasons') nextReason();
    else if (activeSecret === 'littleLove') paragraphs(pick(littleLove, activeSecret));
    else if (activeSecret === 'wish') paragraphs(pick(wishes, activeSecret));
    animateSecret();
  });
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  $('#surprise-done').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));

  const savedCharms = storage.get('charms', []);
  const charms = new Set((Array.isArray(savedCharms) ? savedCharms : []).filter(x => ['heart', 'star', 'bow'].includes(x)));
  function updateCharms() {
    $$('[data-charm]').forEach(button => button.setAttribute('aria-pressed', String(charms.has(button.dataset.charm))));
    if ($('#charm-status')) $('#charm-status').textContent = charms.size === 3 ? 'All three charms found. Your last little secret is ready. 3 / 3' : `Find the heart, star, and ribbon charms. A final letter is waiting. ${charms.size} / 3`;
    if ($('#final-secret')) $('#final-secret').hidden = charms.size < 3;
  }
  updateCharms();
  $$('[data-charm]').forEach(button => button.addEventListener('click', () => {
    const name = button.dataset.charm;
    if (charms.has(name)) { toast('This charm is already tucked safely in your heart.'); return; }
    charms.add(name); storage.set('charms', [...charms]); updateCharms(); atElement(button, 12);
    toast(charms.size === 3 ? 'All three found! Open One Last Secret in the rose garden. 🎀' : `${charms.size} of 3 charms found. A little more magic is waiting.`);
  }));
  let hearts = Math.max(0, Number(storage.get('hearts', 0)) || 0);
  if ($('#heart-count')) $('#heart-count').textContent = hearts;
  $('#heart-counter')?.addEventListener('click', event => {
    hearts++; storage.set('hearts', hearts); $('#heart-count').textContent = hearts;
    $('#heart-status').textContent = `${hearts} little hearts for Julie`; atElement(event.currentTarget, 9);
  });

  // CUSTOMIZE: change these labels, then put your MP3 at assets/music/music.mp3.
  const SONG = { title: 'Our little love song', artist: 'Chosen with love by James' };
  $('#song-title').textContent = SONG.title; $('#song-artist').textContent = SONG.artist;
  const audio = $('#our-song'), player = $('.music-player'), progress = $('#song-progress');
  const playButton = $('.music-toggle'), volume = $('#song-volume'), mute = $('#mute-song');
  let audioFailed = false, lastSaved = 0;
  audio.volume = Math.min(1, Math.max(0, Number(storage.get('volume', .5)) || 0));
  audio.muted = storage.get('muted', false) === true; volume.value = audio.volume;
  function clock(value) { const seconds = Number.isFinite(value) ? Math.floor(value) : 0; return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; }
  function saveAudio() { if (audio.readyState > 0) storage.set('song-time', audio.currentTime); storage.set('volume', audio.volume); storage.set('muted', audio.muted); }
  function syncAudio() {
    const playing = !audio.paused && !audio.ended;
    player.classList.toggle('playing', playing); playButton.textContent = playing ? 'Ⅱ' : '▶'; playButton.setAttribute('aria-label', playing ? 'Pause our song' : 'Play our song');
    $$('[data-play]').forEach(button => { button.textContent = playing ? 'Pause Our Song ♫' : 'Play Our Song 🎶'; });
    mute.textContent = audio.muted ? '×♪' : '♪'; mute.setAttribute('aria-label', audio.muted ? 'Unmute song' : 'Mute song'); mute.setAttribute('aria-pressed', String(audio.muted));
  }
  async function toggleAudio() {
    if (!audio.paused) { audio.pause(); return; }
    $('#music-status').textContent = 'Opening our song…';
    if (audioFailed) { audioFailed = false; audio.load(); }
    try { await audio.play(); $('#music-status').textContent = ''; }
    catch (error) { $('#music-status').textContent = error.name === 'NotAllowedError' ? 'Tap play once more to allow music.' : 'Our song is waiting. Add music.mp3 to assets/music/, then tap play again.'; }
  }
  playButton.addEventListener('click', toggleAudio);
  $$('[data-play]').forEach(button => button.addEventListener('click', toggleAudio));
  audio.addEventListener('play', syncAudio); audio.addEventListener('pause', () => { syncAudio(); saveAudio(); });
  audio.addEventListener('error', () => { audioFailed = true; $('#music-status').textContent = 'Our song is waiting. Add music.mp3 to assets/music/, then tap play again.'; syncAudio(); });
  audio.addEventListener('loadedmetadata', () => {
    progress.disabled = !Number.isFinite(audio.duration); $('#duration').textContent = clock(audio.duration);
    const saved = Number(storage.get('song-time', 0));
    if (Number.isFinite(audio.duration) && saved > 0 && saved < audio.duration) audio.currentTime = saved;
  });
  audio.addEventListener('timeupdate', () => {
    $('#elapsed').textContent = clock(audio.currentTime);
    progress.value = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.currentTime / audio.duration * 100 : 0;
    progress.setAttribute('aria-valuetext', `${clock(audio.currentTime)} of ${clock(audio.duration)}`);
    if (Date.now() - lastSaved > 2000) { saveAudio(); lastSaved = Date.now(); }
  });
  progress.addEventListener('input', () => { if (Number.isFinite(audio.duration)) audio.currentTime = Number(progress.value) / 100 * audio.duration; });
  volume.addEventListener('input', () => { audio.volume = Number(volume.value); saveAudio(); });
  mute.addEventListener('click', () => { audio.muted = !audio.muted; saveAudio(); syncAudio(); });
  function setMinimized(value) {
    player.classList.toggle('minimized', value); const button = $('.minimize');
    button.textContent = value ? '+' : '−'; button.setAttribute('aria-expanded', String(!value)); button.setAttribute('aria-label', value ? 'Expand music player' : 'Minimize music player');
    storage.set('minimized', value);
  }
  setMinimized(storage.get('minimized', true));
  $('.minimize').addEventListener('click', () => setMinimized(!player.classList.contains('minimized')));
  addEventListener('pagehide', saveAudio); syncAudio();
})();
