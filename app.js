/* ============================================================
   SURPRISE ASKIM — logique (scènes, code, quiz, souvenirs,
   lettre, dou'a, musique). Même architecture que la V1.
   ============================================================ */

const scenes = [...document.querySelectorAll('.scene')];
let current = 0;
const transition = document.getElementById('transition');

const music       = document.getElementById('music');
const musicPill   = document.getElementById('musicPill');
const musicToggle = document.getElementById('musicToggle');

/* Meilleure partie de Mazel Mazel : le refrain démarre ici
   (drop de basses ~11 s plus tard, pile pendant les photos). */
const MUSIC_START = 62.4;

/* ---------- navigation entre scènes ---------- */
function showScene(index){
  if(index < 0 || index >= scenes.length || index === current) return;
  transition.classList.remove('go');
  void transition.offsetWidth;
  transition.classList.add('go');
  setTimeout(() => {
    scenes[current].classList.remove('active');
    current = index;
    scenes[current].classList.add('active');
    onScene(index);
  }, 480);
}

function onScene(index){
  const name = scenes[index].dataset.scene;
  if(name === 'quiz'){
    initDroneQuiz();
  }
  if(name === 'letterPage'){
    typeText('letterText',
`Merci pour tous nos moments, nos sourires et tous les souvenirs que nous avons déjà créés.

Cette version sert surtout à te montrer le rendu visuel. Le vrai texte sera remplacé ensuite, mot par mot, exactement comme tu le souhaites.

— Abdulkaan`, 34);
  }
  if(name === 'dua'){
    typeText('duaText',
`Ya Allah, protège Lydia Kara, accorde-lui la paix, la santé, le bonheur et la réussite.

Guide chacun de ses pas vers ce qui est bon et préserve son cœur de toute tristesse.

Ameen.`, 30);
  }
}

document.querySelectorAll('.next').forEach(b => b.addEventListener('click', () => showScene(current + 1)));
document.getElementById('restart').addEventListener('click', () => showScene(1));

/* ---------- code secret (1009) ---------- */
const keypad = document.getElementById('keypad');
let code = '';
[1,2,3,4,5,6,7,8,9,'',0,'⌫'].forEach(v => {
  if(v === ''){ keypad.append(document.createElement('span')); return; }
  const b = document.createElement('button');
  b.textContent = v;
  b.onclick = () => v === '⌫' ? erase() : add(String(v));
  keypad.append(b);
});
function paint(){
  document.querySelectorAll('#pin i').forEach((d,i) => d.classList.toggle('filled', i < code.length));
}
function erase(){ code = code.slice(0,-1); paint(); }
function add(n){
  if(code.length < 4) code += n;
  paint();
  if(code.length === 4) setTimeout(() => {
    if(code === '1009'){
      document.getElementById('error').textContent = '';
      preloadPhotos();
      primeAudio();
      showScene(1);
    } else {
      document.getElementById('error').textContent = 'Ce n’est pas le bon code';
      const card = document.querySelector('.lock-card');
      card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
      navigator.vibrate?.([50,40,50]);
      code = ''; paint();
    }
  }, 180);
}
document.getElementById('erase').onclick = erase;

/* ---------- quiz : le drone au-dessus de Strasbourg ---------- */
/* Bonne réponse : le drone vole vers la prochaine étape.
   Mauvaise réponse : il se crashe, puis on réessaie. */
const DRONE_QUESTIONS = [
  { pin:'brunch',    q:'Le matin, on commence par manger…',
    answers:['Brunch','Brunch Algérien','Petit dej turc','Petit dej basique'], ok:0 },
  { pin:'parfum',    q:'Ensuite, direction un atelier… lequel ?',
    answers:['Atelier Parfum','Atelier Poterie','Atelier Bougie'], ok:0 },
  { pin:'promenade', q:'L’après-midi, on part faire quoi ?',
    answers:['Promenade sur Strasbourg','Cinéma','Shopping'], ok:0 },
  { pin:'steak',     q:'Et pour finir, le resto du soir…',
    answers:['Resto Chinois','Resto Italien','Restaurant normal','Steak House'], ok:3 },
];

const droneMap    = document.getElementById('droneMap');
const droneRig    = document.getElementById('droneRig');
const droneMsg    = document.getElementById('droneMsg');
const droneAnswers= document.getElementById('droneAnswers');
const quizScene   = document.querySelector('.quiz');
const DRONE_INTRO = droneMsg ? droneMsg.textContent : '';
let droneIdx = 0, droneBusy = false;

/* la caméra : translate la carte pour amener un lieu pile sous le drone.
   La perspective fausse un calcul direct, donc on résout par itérations
   (transition coupée, mesures instantanées), puis on anime vers la cible. */
function droneCenterOn(name, instant){
  const pin = droneMap.querySelector(`[data-pin="${name}"]`);
  if(!pin) return;
  const read = v => parseFloat(droneMap.style.getPropertyValue(v)) || 0;
  const prevTx = read('--tx'), prevTy = read('--ty');
  const cos = Math.cos(58 * Math.PI/180);

  droneMap.style.transition = 'none';
  let tx = prevTx, ty = prevTy;
  for(let k = 0; k < 5; k++){
    droneMap.style.setProperty('--tx', tx + 'px');
    droneMap.style.setProperty('--ty', ty + 'px');
    void droneMap.offsetWidth;
    const rig = droneRig.getBoundingClientRect();
    const p = pin.getBoundingClientRect();
    const dx = rig.left - (p.left + p.width/2);
    const dy = (rig.top - (p.top + p.height/2)) / cos;
    tx += dx; ty += dy;
    if(Math.abs(dx) < 1 && Math.abs(dy) < 1) break;
  }
  droneMap.style.setProperty('--tx', tx + 'px');
  droneMap.style.setProperty('--ty', ty + 'px');
  void droneMap.offsetWidth;

  if(instant){
    droneMap.style.transition = '';
    return;
  }
  /* revenir au point de départ sans transition, puis animer vers la cible */
  droneMap.style.setProperty('--tx', prevTx + 'px');
  droneMap.style.setProperty('--ty', prevTy + 'px');
  void droneMap.offsetWidth;
  droneMap.style.transition = '';
  void droneMap.offsetWidth;
  droneMap.style.setProperty('--tx', tx + 'px');
  droneMap.style.setProperty('--ty', ty + 'px');
}

function droneAsk(){
  const Q = DRONE_QUESTIONS[droneIdx];
  droneMsg.textContent = Q.q;
  droneMsg.className = 'muted drone-msg';
  droneAnswers.innerHTML = '';
  Q.answers.forEach((label, i) => {
    const b = document.createElement('button');
    b.textContent = label;
    if(Q.answers.length % 2 === 1 && i === Q.answers.length - 1) b.classList.add('solo');
    b.onclick = () => droneAnswer(b, i === Q.ok);
    droneAnswers.append(b);
  });
}

function droneAnswer(btn, good){
  if(droneBusy) return;
  droneBusy = true;
  [...droneAnswers.children].forEach(b => b.disabled = true);
  if(good){
    btn.classList.add('good');
    const Q = DRONE_QUESTIONS[droneIdx];
    droneMsg.textContent = 'Bonne réponse ! Le drone décolle… 🚁';
    droneMsg.classList.add('good');
    setTimeout(() => {
      droneRig.classList.add('flying');
      droneCenterOn(Q.pin);
      setTimeout(() => {
        droneRig.classList.remove('flying');
        const pin = droneMap.querySelector(`[data-pin="${Q.pin}"]`);
        pin.classList.remove('locked');
        pin.classList.add('reached','pulse');
        setTimeout(() => pin.classList.remove('pulse'), 2200);
        droneIdx++;
        droneBusy = false;
        if(droneIdx < DRONE_QUESTIONS.length) droneAsk();
        else droneFinish();
      }, 2000);
    }, 550);
  } else {
    btn.classList.add('bad');
    droneCrash();
  }
}

function droneCrash(){
  droneMsg.textContent = 'Oh non… mauvaise réponse !';
  droneMsg.className = 'muted drone-msg bad';
  droneRig.classList.add('crashing');
  setTimeout(() => {
    droneRig.classList.add('crashed');
    quizScene.classList.add('shake');
    const flash = quizScene.querySelector('.crash-flash');
    flash.classList.add('on');
    navigator.vibrate?.([70,50,70]);
    droneMsg.textContent = '💥 Le drone s’est crashé ! On réessaie…';
    setTimeout(() => {
      quizScene.classList.remove('shake');
      flash.classList.remove('on');
      droneRig.classList.remove('crashing','crashed');
      droneRig.classList.add('respawn');
      setTimeout(() => droneRig.classList.remove('respawn'), 750);
      droneBusy = false;
      droneAsk();
    }, 1450);
  }, 1150);
}

function droneFinish(){
  droneMsg.textContent = '🎉 Tu as deviné toute notre journée !';
  droneMsg.className = 'muted drone-msg good';
  droneAnswers.innerHTML = '';
  quizScene.classList.add('done');
}

function initDroneQuiz(){
  droneIdx = 0;
  droneBusy = false;
  quizScene.classList.remove('done');
  droneMap.querySelectorAll('.map-pin').forEach(p => {
    if(p.dataset.pin !== 'start'){ p.classList.add('locked'); p.classList.remove('reached','pulse'); }
  });
  if(!quizScene.querySelector('.crash-flash')){
    const f = document.createElement('div');
    f.className = 'crash-flash';
    quizScene.append(f);
  }
  droneMsg.textContent = DRONE_INTRO;
  droneMsg.className = 'muted drone-msg';
  droneCenterOn('start', true);
  setTimeout(droneAsk, 1400);
}

/* ---------- enveloppe → page lettre ---------- */
const envelope = document.getElementById('envelope');
let envelopeBusy = false;
envelope.onclick = () => {
  if(envelopeBusy) return;
  envelopeBusy = true;
  envelope.classList.add('opening');
  setTimeout(() => {
    showScene(current + 1);
    setTimeout(() => { envelope.classList.remove('opening'); envelopeBusy = false; }, 900);
  }, 850);
};

/* ---------- effet machine à écrire ---------- */
function typeText(id, text, speed){
  const el = document.getElementById(id);
  el.textContent = '';
  el.classList.add('typing');
  clearInterval(el.timer);
  let i = 0;
  const tick = () => {
    el.textContent += text[i] ?? '';
    const ch = text[i]; i++;
    if(i >= text.length){
      clearInterval(el.timer);
      el.classList.remove('typing');
      return;
    }
    /* petite respiration après la ponctuation */
    if(ch === '.' || ch === ',' || ch === '\n'){
      clearInterval(el.timer);
      setTimeout(() => { el.timer = setInterval(tick, speed); }, ch === '.' ? 340 : 150);
    }
    el.scrollTop = el.scrollHeight;
  };
  el.timer = setInterval(tick, speed);
}

/* ---------- musique ---------- */
/* Certains hébergeurs ne permettent pas de se déplacer dans un MP3 en
   streaming. On précharge donc le fichier en Blob (toujours seekable),
   avec l'URL d'origine en secours si le téléchargement échoue. */
let musicStarted = false;
function primeAudio(){
  /* cache:'no-store' : évite d'attendre l'entrée de cache que le
     préchargement de <audio> est en train d'écrire */
  fetch(music.src, { cache:'no-store' })
    .then(r => r.ok ? r.blob() : Promise.reject())
    .then(b => {
      if(musicStarted) return;               /* trop tard, on ne coupe pas la lecture */
      music.src = URL.createObjectURL(b);
      music.load();
    })
    .catch(() => {});
}
function startMusic(){
  if(musicStarted) return;
  musicStarted = true;
  const go = () => {
    try{ music.currentTime = MUSIC_START; }catch(e){}
    music.play().catch(() => {});
  };
  if(music.readyState >= 2) go();
  else music.addEventListener('canplay', go, { once:true });
  /* filets de sécurité : si le refrain n'est pas atteint, on re-tente */
  [1500, 4000].forEach(t => setTimeout(() => {
    if(musicStarted && music.currentTime < MUSIC_START - 2){
      try{ music.currentTime = MUSIC_START; }catch(e){}
      music.play().catch(() => {});
    }
  }, t));
  musicPill.classList.add('visible');
  musicToggle.textContent = 'Ⅱ';
}
musicToggle.onclick = () => {
  if(music.paused){ music.play(); musicToggle.textContent = 'Ⅱ'; }
  else { music.pause(); musicToggle.textContent = '♪'; }
};

/* ---------- souvenirs ---------- */
/* Ordre voulu :
   1  Mirror selfie ................. photo-15
   2  Ensemble au supermarché ....... photo-12
   3  Moi seul au supermarché ....... photo-13
   4  Elle seule au supermarché ..... photo-14
   5  Miroir avec bouquet ........... photo-08
   6  Selfie voiture ensemble ....... photo-09
   7  DJI Pocket 3 sur les jambes ... photo-11
   8  Moi avec la DJI Pocket 3 ...... photo-10
   9  Selfie McDonald's ............. photo-07
   10 Photo BUT ensemble ............ photo-06
   11 Photo cagoule voiture ......... photo-01
   12 Elle qui dort dans la voiture . photo-05
   13 Portrait d'elle ............... photo-04
   14 Europa Park cagoule ........... photo-02
   15 Selfie dans le train .......... photo-03 */
const PHOTO_ORDER = [15,12,13,14,8,9,11,10,7,6,1,5,4,2,3];
const photos = PHOTO_ORDER.map(n => `assets/photos/photo-${String(n).padStart(2,'0')}.jpg`);

function preloadPhotos(){
  photos.forEach(src => { const im = new Image(); im.src = src; });
}

const stage    = document.getElementById('memoryStage');
const startBtn = document.getElementById('startMemories');
const memoriesScene = document.querySelector('.memories');
let memoryRunning = false;

startBtn.onclick = async () => {
  if(memoryRunning) return;
  memoryRunning = true;
  memoriesScene.classList.add('running');
  startMusic();                       /* la musique n'accompagne que les souvenirs */
  stage.innerHTML = '';
  const imgs = [];
  let prev = null;

  for(let i = 0; i < photos.length; i++){
    const img = document.createElement('img');
    img.src = photos[i];
    img.alt = '';
    img.className = 'memory-photo';
    img.style.setProperty('--r', `${(Math.random()*8 - 4).toFixed(1)}deg`);
    stage.append(img);
    imgs.push(img);
    await wait(60);
    img.classList.add('show');        /* la photo apparaît */
    if(prev) prev.classList.add('out');   /* fondu croisé avec la précédente */
    prev = img;
    await wait(2050);
  }

  /* regroupement final façon V1 : toutes les photos se rassemblent */
  imgs.forEach((img,i) => {
    img.className = 'memory-photo collage';
    img.style.setProperty('--x', `${13 + (i % 5) * 18.5}%`);
    img.style.setProperty('--y', `${19 + Math.floor(i / 5) * 31}%`);
    img.style.setProperty('--r', `${[-7,5,-3,7,-5][i % 5]}deg`);
    img.style.setProperty('--wait', `${i * 70}ms`);
  });
  setTimeout(() => {
    memoriesScene.classList.add('done');
    memoryRunning = false;
  }, photos.length * 70 + 1100);
};

function wait(ms){ return new Promise(r => setTimeout(r, ms)); }

/* ---------- cœurs flottants + étincelles sur l'accueil ---------- */
(function(){
  const hero = document.querySelector('.hero');
  if(!hero) return;
  const wrap = document.createElement('div');
  wrap.className = 'float-hearts';
  for(let i = 0; i < 9; i++){
    const s = document.createElement('span');
    s.textContent = '♥';
    s.style.setProperty('--x', `${5 + Math.random()*90}%`);
    s.style.setProperty('--s', `${(0.7 + Math.random()*1.1).toFixed(2)}rem`);
    s.style.setProperty('--t', `${(9 + Math.random()*8).toFixed(1)}s`);
    s.style.setProperty('--d', `${(Math.random()*10).toFixed(1)}s`);
    s.style.setProperty('--o', (0.25 + Math.random()*0.4).toFixed(2));
    wrap.append(s);
  }
  hero.append(wrap);

  /* étincelles autour du titre, comme dans la vidéo de référence */
  const spots = [
    ['16%','30%','#ffd9ec'],['82%','27%','#ffdf9e'],['9%','46%','#c9a6ff'],
    ['88%','49%','#ffd9ec'],['24%','60%','#ffdf9e'],['74%','63%','#c9a6ff'],
  ];
  const sp = document.createElement('div');
  sp.className = 'sparkles';
  spots.forEach(([x,y,c],i) => {
    const s = document.createElement('i');
    s.style.setProperty('--sx', x);
    s.style.setProperty('--sy', y);
    s.style.setProperty('--sc', c);
    s.style.setProperty('--ss', `${10 + (i%3)*4}px`);
    s.style.setProperty('--st', `${(2.4 + i*0.5).toFixed(1)}s`);
    s.style.setProperty('--sd', `${(i*0.7).toFixed(1)}s`);
    sp.append(s);
  });
  hero.querySelector('.hero-content').append(sp);
})();

/* ---------- navigation au balayage ---------- */
let touchX = 0;
document.addEventListener('touchstart', e => touchX = e.touches[0].clientX, { passive:true });
document.addEventListener('touchend', e => {
  const d = e.changedTouches[0].clientX - touchX;
  if(Math.abs(d) > 100 && current > 0 && !memoryRunning) showScene(current + (d < 0 ? 1 : -1));
}, { passive:true });
