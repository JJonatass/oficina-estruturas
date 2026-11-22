/* Kit dos desafios da Oficina · mundo da Masmorra
   K.init({id, titulo, kicker, vidas, rotNivel, ajuda, comecar, iniciar, tecla, auto}) */
(function(){
'use strict';
const $ = s => document.querySelector(s);
const K = window.K = {};
K.rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
K.pick = a => a[Math.floor(Math.random()*a.length)];
K.shuffle = a => { a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
K.distintos = (n,a,b) => { const s = new Set(); while (s.size < n) s.add(K.rnd(a,b)); return [...s]; };
K.esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
K.esperar = ms => new Promise(r => setTimeout(r, ms));

/* ---------- som ---------- */
let ctx = null; K.som = true;
K.tom = function(f, d=.12, tipo='triangle', v=.07, atraso=0){
  if (!K.som) return;
  try { ctx = ctx || new (window.AudioContext||window.webkitAudioContext)(); const t = ctx.currentTime+atraso, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo; o.frequency.setValueAtTime(f, t); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t+d);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t+d+.02); } catch(e) {}
};
K.SFX = {
  acerto(c=1){ [523,659,784].forEach((f,i)=>K.tom(f*(1+.06*Math.min(c,5)),.13,'triangle',.07,i*.05)); },
  erro(){ K.tom(196,.25,'sawtooth',.06); K.tom(147,.3,'sawtooth',.05,.08); },
  clique(){ K.tom(880,.04,'square',.025); },
  passo(){ K.tom(330,.05,'square',.02); },
  onda(){ [392,523,659,784,1046].forEach((f,i)=>K.tom(f,.18,'triangle',.06,i*.09)); },
  tic(){ K.tom(1200,.03,'square',.02); },
  whoosh(){ K.tom(260,.18,'sine',.05); K.tom(520,.12,'sine',.03,.05); },
  fim(){ [523,392,330,262].forEach((f,i)=>K.tom(f,.3,'triangle',.07,i*.16)); }
};

/* ---------- estado ---------- */
let cfg = null;
K.s = {};
K.opc = { explicar:true };
const T = { ativo:false, t:0, max:1, onFim:null };
K.timer = {
  start(seg, onFim){ T.ativo = true; T.t = seg; T.max = seg; T.onFim = onFim; },
  parar(){ T.ativo = false; },
  mais(seg){ T.t = Math.max(0.05, Math.min(T.max, T.t + seg)); },
  frac(){ return T.ativo ? Math.max(0, T.t / T.max) : 0; },
  resta(){ return T.t; }
};
function recKey(){ return 'oficina2-' + cfg.id; }
function lerRec(){ try { return +localStorage.getItem(recKey()) || 0; } catch(e) { return 0; } }

K.init = function(c){
  cfg = c;
  document.title = c.titulo + ' · Desafios da Oficina';
  const hud = document.createElement('header'); hud.className = 'hud';
  hud.innerHTML = `<div><p class="kick">${c.kicker}</p><h1>${c.titulo}</h1></div>
   <div class="stats"><div><span>Pontos</span><b id="kPontos">0</b></div><div><span>Combo</span><b id="kCombo">×1</b></div><div><span>${c.rotNivel||'Nível'}</span><b id="kNivel">1</b></div><div><span>Vidas</span><b class="vidas" id="kVidas"></b></div><div><span>Recorde</span><b id="kRec">${lerRec().toLocaleString('pt-BR')}</b></div></div>
   <div class="hbts"><button id="kSom">Som <kbd>M</kbd></button><button id="kPausa">Pausar <kbd>P</kbd></button><button id="kBDica" class="ouro">Dica <kbd>H</kbd></button></div>`;
  document.body.prepend(hud);
  const tira = document.createElement('div'); tira.className = 'tira'; tira.innerHTML = '<span class="trk"><i id="kTbar"></i></span><b id="kTseg">–</b>';
  hud.after(tira);
  const dica = document.createElement('div'); dica.id = 'kDica'; tira.after(dica);
  const m = document.createElement('div'); m.className = 'modal'; m.id = 'kModal'; m.hidden = true; m.innerHTML = '<div class="caixa" role="dialog" aria-modal="true"><div id="kMc"></div></div>';
  document.body.appendChild(m);
  const b = document.createElement('div'); b.className = 'kbanner'; b.id = 'kBanner'; document.body.appendChild(b);
  $('#kSom').onclick = () => { K.som = !K.som; $('#kSom').innerHTML = (K.som ? 'Som' : 'Mudo') + ' <kbd>M</kbd>'; };
  $('#kPausa').onclick = K.pausar;
  $('#kBDica').onclick = K.dica;
  document.addEventListener('keydown', e => {
    if (!$('#kModal').hidden) { if (e.key === 'Enter' || e.key === 'Escape') { const p = $('#kMc .pri'); if (p) { e.preventDefault(); p.click(); } } return; }
    const k = e.key.toLowerCase();
    if (k === 'm') $('#kSom').click(); else if (k === 'p') K.pausar(); else if (k === 'h') K.dica();
    else if (cfg.tecla && K.s.rodando && !K.s.ocupado) cfg.tecla(e);
  });
  K.s = { pontos:0, combo:1, vidas:c.vidas||3, nivel:1, rodando:false };
  desenharVidas(); K.placar();
  requestAnimationFrame(laco);
  window.__auto = () => (K.s.rodando && !K.s.ocupado && $('#kModal').hidden && cfg.auto) ? cfg.auto() : null;
  window.__K = K;
  c.preparar && c.preparar();
  K.ajuda(true);
};
K.novo = function(){
  K.s = { pontos:0, combo:1, vidas:cfg.vidas||3, nivel:1, rodando:true, ocupado:false, pausado:false, dicaN:0 };
  T.ativo = false; desenharVidas(); K.placar(); $('#kNivel').textContent = 1; $('#kDica').textContent = '';
  cfg.iniciar();
};

/* ---------- laço do relógio ---------- */
let ult = performance.now();
function laco(t){
  const dt = Math.min(.1, (t - ult)/1000); ult = t;
  if (T.ativo && K.s.rodando && !K.s.pausado && !K.s.ocupado && $('#kModal').hidden) {
    const antes = Math.ceil(T.t); T.t -= dt;
    if (Math.ceil(T.t) !== antes && T.t < 3.5 && T.t > 0) K.SFX.tic();
    if (T.t <= 0) { T.t = 0; T.ativo = false; const f = T.onFim; T.onFim = null; f && f(); }
  }
  const f = T.ativo ? Math.max(0, T.t / T.max) : 0;
  const bar = $('#kTbar'); if (bar) { bar.style.width = (100*f) + '%'; bar.style.background = f > .5 ? 'var(--verde)' : (f > .25 ? 'var(--ouro)' : 'var(--verm)'); }
  const sg = $('#kTseg'); if (sg) sg.textContent = T.ativo ? Math.ceil(T.t) + ' s' : '–';
  requestAnimationFrame(laco);
}

/* ---------- turno, acerto, erro ---------- */
K.turno = function(seg, onFim, provDica){
  K.s.dicaN = 0; K.dicaProv = provDica || null; $('#kDica').textContent = '';
  document.querySelectorAll('.k-dica').forEach(x => x.classList.remove('k-dica'));
  K.timer.start(seg, onFim);
};
K.acerto = function(el, base=100){
  const frac = K.timer.frac();
  const ganho = Math.max(20, Math.round((base + 150*frac - 40*(K.s.dicaN||0)) * K.s.combo));
  K.s.pontos += ganho; K.s.combo = Math.min(5, K.s.combo + 1); K.placar();
  K.SFX.acerto(K.s.combo);
  if (el) K.flutua(`+${ganho}${K.s.combo > 2 ? ' ×' + (K.s.combo-1) : ''}`, el);
  return ganho;
};
K.bonus = function(pts, el, txt){ K.s.pontos += pts; K.placar(); if (el) K.flutua(txt || `+${pts}`, el, 'var(--verdeC)'); };
K.erro = function(html, depois, o={}){
  K.timer.parar(); K.s.ocupado = true;
  K.s.vidas--; K.s.combo = 1; K.placar(); desenharVidas();
  K.SFX.erro();
  const cena = document.querySelector('.cena'); if (cena) { cena.classList.remove('dano'); void cena.offsetWidth; cena.classList.add('dano'); }
  const seguir = () => { K.s.ocupado = false; if (K.s.vidas <= 0) return K.fim(); depois && depois(); };
  setTimeout(() => {
    if (K.opc.explicar && html) K.modal(`<p class="kick">${o.kicker || 'Não foi dessa vez'}</p><h2>${o.titulo || 'A jogada certa'}</h2>${html}`, [{t:'Continuar', pri:true, f:seguir}]);
    else setTimeout(seguir, 600);
  }, o.atraso ?? 380);
};
K.vida = function(){ if (K.s.vidas < (cfg.vidas||3)) { K.s.vidas++; desenharVidas(); K.flutua('+1 ♥', document.getElementById('kVidas'), 'var(--verm)'); } };
K.subirNivel = function(n, sub){ K.s.nivel = n; $('#kNivel').textContent = n; K.banner(`${cfg.rotNivel||'Nível'} ${n}${sub?`<small>${sub}</small>`:''}`); K.SFX.onda(); };

/* ---------- dica ---------- */
K.dica = function(){
  if (!K.s.rodando || K.s.ocupado || !K.dicaProv || K.s.dicaN >= 2 || !$('#kModal').hidden) return;
  const d = K.dicaProv(); if (!d) return;
  K.s.dicaN++; K.s.combo = 1; K.placar(); K.timer.mais(3);
  const item = d[K.s.dicaN - 1];
  const txt = typeof item === 'function' ? item() : item;
  $('#kDica').innerHTML = `<b>${K.s.dicaN}ª camada:</b> ${txt}`;
};

/* ---------- desenho ---------- */
function desenharVidas(){ const v = $('#kVidas'); if (v) v.innerHTML = Array.from({length:cfg.vidas||3}, (_,i) => `<i class="${i >= K.s.vidas ? 'perdida' : ''}">♥</i>`).join(''); }
K.placar = function(){ const p = $('#kPontos'); if (!p) return; p.textContent = (K.s.pontos||0).toLocaleString('pt-BR'); $('#kCombo').textContent = '×' + (K.s.combo||1); $('#kCombo').classList.toggle('quente', (K.s.combo||1) >= 3); };
K.flutua = function(txt, alvo, cor){
  let x, y;
  if (alvo && alvo.getBoundingClientRect) { const r = alvo.getBoundingClientRect(); x = r.left + r.width/2; y = r.top + 6; } else if (alvo) { x = alvo.x; y = alvo.y; } else return;
  const f = document.createElement('div'); f.className = 'flutua'; f.textContent = txt; if (cor) f.style.color = cor;
  f.style.left = (x - 30) + 'px'; f.style.top = y + 'px'; document.body.appendChild(f); setTimeout(() => f.remove(), 1050);
};
K.banner = function(html){ const b = $('#kBanner'); b.innerHTML = html; b.classList.add('on'); setTimeout(() => b.classList.remove('on'), 1150); };
K.anima = function(el, cls){ if (!el) return; el.classList.remove(cls); void (el.getBoundingClientRect && el.getBoundingClientRect()); el.classList.add(cls); };
/* voo de um elemento clonado de 'de' até 'para' */
K.voar = function(html, de, para, ms=550){
  if (!de || !para) return;
  const a = de.getBoundingClientRect(), b = para.getBoundingClientRect();
  const v = document.createElement('div'); v.innerHTML = html;
  Object.assign(v.style, {position:'fixed', zIndex:30, pointerEvents:'none', left:(a.left + a.width/2) + 'px', top:(a.top + a.height/2) + 'px', transform:'translate(-50%,-50%)', transition:`transform ${ms}ms cubic-bezier(.4,1.3,.6,1)`});
  document.body.appendChild(v);
  requestAnimationFrame(() => v.style.transform = `translate(calc(-50% + ${b.left + b.width/2 - a.left - a.width/2}px), calc(-50% + ${b.top + b.height/2 - a.top - a.height/2}px))`);
  setTimeout(() => v.remove(), ms + 40);
};

/* ---------- janelas ---------- */
K.modal = function(html, botoes){
  $('#kMc').innerHTML = html + `<div class="mbts">${botoes.map((b,i)=>`<button data-i="${i}" class="${b.pri?'pri':''}">${b.t}</button>`).join('')}</div>`;
  $('#kModal').hidden = false;
  $('#kMc').querySelectorAll('[data-i]').forEach(x => x.onclick = () => { $('#kModal').hidden = true; const f = botoes[+x.dataset.i].f; f && f(); });
  setTimeout(() => ($('#kMc .pri') || $('#kMc button'))?.focus(), 30);
};
K.ajuda = function(inicio){
  K.modal(`<p class="kick">${cfg.kicker}</p><h2>${cfg.titulo}</h2>${cfg.ajuda}
    <p class="nota">Dica <kbd>H</kbd>: a 1ª camada mostra o que observar, a 2ª o raciocínio. Dica zera o combo e dá +3 s. <kbd>P</kbd> pausa, <kbd>M</kbd> liga ou desliga o som.</p>
    <div class="kops"><label><input type="checkbox" id="kOExp" ${K.opc.explicar?'checked':''}> Explicar cada erro numa janela</label></div>`,
    inicio ? [{t:cfg.comecar || 'Começar', pri:true, f:K.novo}] : [{t:'Voltar ao jogo', pri:true, f:() => K.s.pausado = false}]);
  const cb = $('#kOExp'); if (cb) cb.onchange = () => K.opc.explicar = cb.checked;
};
K.pausar = function(){
  if (!K.s.rodando || !$('#kModal').hidden) return;
  K.s.pausado = true;
  K.modal(`<p class="kick">Pausa</p><h2>${cfg.pausa || 'A masmorra espera por você'}</h2><p class="nota">O relógio está parado.</p>`, [{t:'Continuar', pri:true, f:() => K.s.pausado = false}, {t:'Como jogar', f:() => K.ajuda(false)}]);
};
K.fim = function(extra){
  K.s.rodando = false; T.ativo = false; K.SFX.fim();
  const rec = lerRec(), novo = K.s.pontos > rec;
  if (novo) { try { localStorage.setItem(recKey(), String(K.s.pontos)); } catch(e) {} $('#kRec').textContent = K.s.pontos.toLocaleString('pt-BR'); }
  K.modal(`<p class="kick">Fim de jogo</p><h2>${novo ? 'Novo recorde neste aparelho!' : (cfg.fimTitulo || 'A masmorra venceu desta vez')}</h2>
    <div class="placar"><div><span>Pontos</span><b class="ouro">${K.s.pontos.toLocaleString('pt-BR')}</b></div><div><span>${cfg.rotNivel||'Nível'}</span><b>${K.s.nivel}</b></div><div><span>Recorde</span><b>${Math.max(rec, K.s.pontos).toLocaleString('pt-BR')}</b></div></div>
    ${extra || ''}<p class="nota">Cada partida sorteia desafios novos.</p>`, [{t:'Jogar de novo', pri:true, f:K.novo}]);
};
})();
