// Test bot for mehter-seferi-v3 and v4. Profile from location.hash: #vur | #mid | #good | #rand
// v4 takes a meta mode after a colon:
//   #good:full     every upgrade bought and every chapter cleared, the best deck for the chapter
//   #good:buy300   300 san in the book, spent on the cheapest open upgrades first, chapters cleared
//   #good:full:units=azap.deli.kalkanli   as full, but the deck holds only these soldiers (best four of them)
//   #good:camp     a whole campaign: run after run, buying the cheapest open upgrade after each, until
//                  the book is full (or 40 runs); one CAMP line per run
// In v4 (D.playCard) it plays hand cards; in v3 it fires ultis.
(() => {
const [PROF, MODE = '', OPT = ''] = (location.hash.slice(1) || 'mid').split(':');
// #mid:full:units=azap.deli.kalkanli  limits the soldiers the bot's deck may hold, to compare cards.
const ONLY = OPT.startsWith('units=') ? OPT.slice(6).split('.') : null;
const P = {
  // A beginner: often late, blocks a third of the blows, does not raid, and picks its deck well only half the time.
  new: { smart: true, jitter: 0.075, skip: 0.3, ulti: false, raid: false, react: 0.3, dodge: 0.2, cardSense: 0.3, deckSmart: 0.5 },
  vur: { smart: false, jitter: 0.02, skip: 0, cardSense: 0 }, mid: { smart: true, jitter: 0.045, skip: 0.12, ulti: false, raid: false, react: 0.6, dodge: 0.5, cardSense: 0.5 },
  good: { smart: true, jitter: 0.02, skip: 0.03, ulti: true, raid: true, react: 0.92, dodge: 0.9, cardSense: 1 },
  // As good, but its cards are picked at random: how much the choice of card is worth.
  rand: { smart: true, jitter: 0.02, skip: 0.03, ulti: true, raid: true, react: 0.92, dodge: 0.9, cardSense: 1, cardRand: true } }[PROF];
const D = window.__dbg;
const log = [];
const out = () => { let pre = document.getElementById('botlog'); if (!pre) { pre = document.createElement('pre'); pre.id = 'botlog'; document.body.appendChild(pre); } pre.textContent = log.join('\n'); };
let prevPending = [], lastHearts = 3, started = false, lastK = -1, pressAt = null, waveInfo = null, lastPhase = '';
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
// ---- v4 meta: the book, and the company and deck the bot takes to a chapter.
const SMART = !!MODE, CAMP = MODE === 'camp';
let runNo = 0, runStart = 0;
const upSpent = () => D.UPGRADES.reduce((t, u) => t + u.cost.slice(0, D.rank(u.id)).reduce((a, b) => a + b, 0), 0);
const bookFull = () => D.UPGRADES.every((u) => D.rank(u.id) >= u.cost.length);
// How well a soldier answers a chapter's monsters: strong +1, weak -0.5, giants count three times.
function chapterScore(unit, ch) {
  let sc = 0;
  for (let wi = 1; wi <= 5; wi++) {
    const w = D.WAVES[ch][wi];
    if (!w) continue;
    for (const t in w) sc += w[t] * ((D.STRONG[unit].includes(t) ? 1 : 0) - (D.WEAK[unit].includes(t) ? 0.5 : 0)) * (D.ENEMY[t].big ? 3 : 1);
  }
  return sc;
}
const bestUnits = (ch) => D.openSoldiers().filter((t) => !ONLY || ONLY.includes(t)).sort((a, b) => chapterScore(b, ch) - chapterScore(a, ch));
// The four soldiers that fit the chapter best and the four plain spells.
function deckFor(ch) {
  // One soldier only: two of its cards and every spell, to see what that soldier is worth.
  if (ONLY && ONLY.length === 1) { const d = [ONLY[0], ONLY[0], 'top', 'duvar', 'mars', 'hucum', 'zil', 'akinci']; return D.validDeck(d) ? d : D.DEFAULT_DECK.slice(); }
  const d = bestUnits(ch).slice(0, 4).concat(['top', 'duvar', 'mars', 'hucum']);
  return D.validDeck(d) ? d : D.DEFAULT_DECK.slice();
}
function buyOne(u) { const m = D.meta, n = D.rank(u.id); m.san -= u.cost[n]; m.ranks[u.id] = n + 1; D.saveMeta(); return u.id + (u.cost.length > 1 ? n + 1 : ''); }
// Spends the book's san on the cheapest upgrade that is open and affordable, until none is.
function autoBuy() {
  const m = D.meta, bought = [];
  for (;;) {
    const c = D.UPGRADES.filter((u) => D.rank(u.id) < u.cost.length && D.upgOpen(u) && m.san >= u.cost[D.rank(u.id)])
      .sort((a, b) => a.cost[D.rank(a.id)] - b.cost[D.rank(b.id)])[0];
    if (!c) return bought;
    bought.push(buyOne(c));
  }
}
function prepMeta() {
  const m = D.meta;
  if (MODE === 'full') { for (const u of D.UPGRADES) m.ranks[u.id] = u.cost.length; m.cleared = 3; }
  else if (/^buy\d+$/.test(MODE)) { m.san = +MODE.slice(3); m.cleared = 3; autoBuy(); }
}
const wise = () => Math.random() < (P.deckSmart == null ? 1 : P.deckSmart);
function prepRun() {
  if (!SMART) return;
  const m = D.meta;
  if (wise()) { m.company = bestUnits(1)[0]; m.deck = deckFor(1); }
  else { const o = D.openSoldiers(); m.company = o[Math.floor(Math.random() * o.length)]; m.deck = D.DEFAULT_DECK.slice(); }
  D.saveMeta();
}
function walk(tx, ty, stopAt) {
  const G = D.G, L = G.leader, h = D.held;
  for (const k of ['KeyW', 'KeyA', 'KeyS', 'KeyD']) h.delete(k);
  if (tx == null) return;
  const dx = tx - L.x, dy = ty - L.y;
  if (Math.hypot(dx, dy) < (stopAt || 20)) return;
  const a = Math.atan2(dy, dx);
  if (Math.cos(a) > 0.38) h.add('KeyD'); if (Math.cos(a) < -0.38) h.add('KeyA');
  if (Math.sin(a) > 0.38) h.add('KeyS'); if (Math.sin(a) < -0.38) h.add('KeyW');
}
function bannerFor(G) {
  if (!P.smart) return G.banners[0];
  const score = (type) => Object.keys(G.def).reduce((s, t) => s + (D.STRONG[type].includes(t) ? G.def[t] : 0) - (D.WEAK[type].includes(t) ? G.def[t] * 0.5 : 0), 0);
  return G.banners.slice().sort((a, b) => score(b.type) - score(a.type))[0];
}
function choose(G, t) {
  const cd = (d) => G.cd[d] <= t;
  if (!P.smart) return 'up';
  const L = G.leader;
  const threat = G.pending.some((p) => !p.done && p.atk.block !== false && p.at >= t - 0.05 && p.at <= t + 0.5 &&
    (p.atk.shape === 'roar' ? false : D.covers(p.atk, L) || G.soldiers.some((s) => !s.dead && !D.isOut(s) && D.inAura(s) && D.covers(p.atk, s))));
  if (threat && cd('down')) return 'down';
  const alive = G.soldiers.filter((s) => !s.dead);
  const outN = alive.filter((s) => D.isOut(s) || !D.inAura(s)).length;
  const hurt = alive.filter((s) => s.hp < s.maxHp * 0.45 || s.poisonUntil > G.h).length;
  if ((outN >= Math.max(2, alive.length * 0.3) || hurt >= Math.max(2, alive.length * 0.3)) && cd('left')) return 'left';
  const winding = G.enemies.some((e) => !e.dead && e.state === 'wind' && (e.aimTarget !== L || (e.atk && e.atk.shape === 'spell')) && alive.some((s) => dist(s, e) < 240));
  if (winding && outN === 0 && cd('right')) return 'right';
  return cd('up') ? 'up' : null;
}
// v4: which card in hand to play now. A company scores for every monster near or coming that it
// is strong against, and loses for those it is weak against; a spell scores by the moment. A
// careless player (cardSense 0) plays whatever it can afford, first slot first, when the bar is
// full or now and then.
let nextCardT = 0;
function cards(G, now) {
  if (now < nextCardT) return;
  const L = G.leader, full = G.bar >= 9.99;
  const ok = G.hand.map((k, i) => (k && G.bar >= k.cost ? i : -1)).filter((i) => i >= 0);
  if (!ok.length) return;
  if (Math.random() >= P.cardSense) {
    if (full || Math.random() < 0.01) { D.playCard(ok[0]); nextCardT = now + 1; }
    return;
  }
  const alive = G.soldiers.filter((s) => !s.dead);
  const foes = G.enemies.filter((e) => !e.dead && !D.ENEMY[e.type].fixed && dist(e, L) < 600).map((e) => e.type)
    .concat(P.cardSense >= 1 ? G.incoming.flatMap((g) => g.list) : []);
  const near = G.enemies.filter((e) => !e.dead && !D.ENEMY[e.type].fixed && dist(e, L) < 300).length;
  const hurt = alive.filter((s) => s.hp < s.maxHp * 0.4).length;
  const score = (k) => {
    if (k.unit) return 0.4 + foes.reduce((s, t) => s + (D.STRONG[k.unit].includes(t) ? 1 : 0) - (D.WEAK[k.unit].includes(t) ? 0.6 : 0), 0) - alive.length * 0.05;
    if (k.id === 'duvar') return G.hucum && G.hucum.at - G.h < 1.2 ? 6 : 0;
    if (k.id === 'mars') return hurt >= 4 ? hurt * 0.6 : 0;
    if (k.id === 'top') return near >= 6 ? near * 0.5 : 0;
    if (k.id === 'hucum') return near >= 8 ? near * 0.4 : 0;
    if (k.id === 'zil') return G.hucum ? 5 : near >= 10 ? 3 : 0;
    if (k.id === 'akinci') return G.bar >= 9 ? 4 : 0;
    return 0;
  };
  // Both a careful and a random player play a card as soon as they can, at the same pace; only
  // the choice differs. A careful one takes the best-scoring card it can afford.
  if (!full && Math.random() >= 0.012) return;
  let best = ok[Math.floor(Math.random() * ok.length)];
  if (!P.cardRand) { let bs = -99; for (const i of ok) { const sc = score(G.hand[i]) - G.hand[i].cost * 0.15; if (sc > bs) { bs = sc; best = i; } } }
  D.playCard(best); nextCardT = now + 0.6;
}
function tick() {
  const G = D.G;
  if (!started) {
    started = true; runStart = performance.now() / 1000;
    if (D.meta) { if (runNo === 0) prepMeta(); prepRun(); }
    D.start(false);
    if (runNo === 0) log.push('start ' + (location.hash || '#mid'));
    setTimeout(tick, 4);
    return;
  }
  if (G.mode === 'over') {
    log.push(`RESULT ${G.phase === 'won' ? 'WON' : 'LOST'} at c${G.chapter}w${G.wi} sec=${Math.round(performance.now() / 1000)} terfi=${G.level} loot=${G.stats.loot} san=${G.san} kills=${G.stats.kills} perfect=${G.stats.perfect} good=${G.stats.good} miss=${G.stats.miss} use=${JSON.stringify(G.stats.use)}` + (G.stats.played ? ` cards=${JSON.stringify(G.stats.played)} wasted=${Math.round(G.stats.wasted)}` : ''));
    if (!CAMP) { out(); document.title = 'DONE'; return; }
    // A campaign goes on: the run's san is in the book, spend it and set out again.
    const m = D.meta, won = G.phase === 'won';
    runNo++;
    const gained = G.san, bought = autoBuy();
    log.push(`CAMP run ${String(runNo).padStart(2)} ${won ? 'WON ' : 'LOST'} c${G.chapter}w${G.wi} sec=${Math.round(performance.now() / 1000 - runStart)} san+${String(gained).padStart(3)} book ${String(m.san).padStart(3)} spent ${String(upSpent()).padStart(3)} terfi ${G.level} cleared ${m.cleared} open ${D.openSoldiers().length}${bought.length ? ' bought ' + bought.join(',') : ''}`);
    out();
    if (runNo >= 40 || bookFull()) { log.push(bookFull() ? `CAMPAIGN DONE after ${runNo} runs` : `CAMPAIGN STOPPED at run ${runNo}, spent ${upSpent()}`); out(); document.title = 'DONE'; return; }
    started = false; prevPending = []; lastHearts = 3; lastK = -1; pressAt = null; waveInfo = null; lastPhase = ''; nextCardT = 0;
    setTimeout(tick, 4);
    return;
  }
  if (G.terfi) { D.pickCard(Math.floor(Math.random() * G.terfi.cards.length), true); }
  if (G.konak) {
    if (SMART) {
      const next = G.chapter + 1, o = D.openSoldiers();
      if (wise()) { D.toggleUlti(o.indexOf(bestUnits(next)[0])); G.konak.deck = deckFor(next); }
      else D.toggleUlti(Math.floor(Math.random() * o.length));
    }
    else if (D.toggleUlti && D.playCard) D.toggleUlti(Math.floor(Math.random() * 4));
    D.leaveKonak();
  }
  const now = performance.now() / 1000;
  if (G.leader.hearts < lastHearts) {
    const near = G.enemies.filter((e) => !e.dead && dist(e, G.leader) < 140).map((e) => e.type);
    const by = prevPending.filter((p) => !G.pending.includes(p)).map((p) => `${p.type}:${p.atk.id || p.atk.shape}${p.atk.shape === 'single' && p.atk.target === G.leader ? '@L' : ''}`);
    log.push(`   -heart c${G.chapter}w${G.wi} by ${by.join(',')} near: ${near.join(',')} army ${G.soldiers.filter((s) => !s.dead).length} kos ${G.kos ? (now - G.kos.t).toFixed(2) : '-'} cdDown ${(G.cd.down - now).toFixed(2)}`);
  }
  prevPending = G.pending.slice();
  lastHearts = G.leader.hearts;
  if (G.phase !== lastPhase) {
    if (G.phase === 'wave') waveInfo = { t: now, hearts: G.leader.hearts, army: G.soldiers.filter((s) => !s.dead).length, kills: G.stats.kills, hits: 0, lost: 0 };
    if (lastPhase === 'wave' && waveInfo) {
      const army = G.soldiers.filter((s) => !s.dead).length;
      log.push(`c${G.chapter}w${G.wi} ${G.goal.padEnd(7)} ${(now - waveInfo.t).toFixed(0).padStart(4)}s hearts ${waveInfo.hearts}->${G.leader.hearts} army ${waveInfo.army}->${army} kills ${G.stats.kills - waveInfo.kills} cezbe ${G.bar.toFixed(0)} loot ${G.stats.loot} terfi ${G.level}`);
      out();
    }
    lastPhase = G.phase;
  }
  // Movement.
  if (G.phase === 'breather') {
    if (G.banners && !G.picked && G.banners.length) { const b = bannerFor(G); walk(b.x, b.y, 10); }
    else { walk(null); if (G.breatherBeat >= 2 && !G.terfi) D.startWave(); }
  } else if (G.phase === 'wave') {
    const tg = G.target && !G.target.dead ? G.target : null;
    let goal = null;
    if (tg && D.ENEMY[tg.type].fixed) goal = [tg.x, tg.y, 150];
    else if (P.raid && G.leader.hearts < 3) {
      const f = G.forts.filter((f) => !f.dead && f.type === 'hisar')[0];
      if (f) goal = [f.x, f.y, 170];
    }
    if (!goal) {
      // Stay with the army's enemies: drift toward the nearest enemy if none is close.
      const es = G.enemies.filter((e) => !e.dead && !D.ENEMY[e.type].fixed && !e.hidden);
      let near = null, nd = 1e9;
      for (const e of es) { const d = dist(e, G.leader); if (d < nd) { nd = d; near = e; } }
      if (near && nd > 260) goal = [near.x, near.y, 200];
      else if (tg) goal = [tg.x, tg.y, 230];
      else if (!near) {
        const f = G.forts.filter((f) => !f.dead)[0];
        if (f && G.groups.every((g) => g.done)) goal = [f.x, f.y, 170];
      }
    }
    // A marked ground closing on the leader: step out of it.
    if (P.dodge) {
      const L = G.leader;
      for (const p of G.pending) {
        if (p.done || p.at - now > 1.4 || !['circle', 'cone', 'line'].includes(p.atk.shape) || !D.covers(p.atk, L)) continue;
        if (p.botDodge == null) p.botDodge = Math.random() < P.dodge;
        if (!p.botDodge) continue;
        const cx = p.atk.shape === 'line' ? (p.atk.x + p.atk.x2) / 2 : p.atk.x, cy = p.atk.shape === 'line' ? (p.atk.y + p.atk.y2) / 2 : p.atk.y;
        let a = Math.atan2(L.y - cy, L.x - cx);
        if (p.atk.shape === 'line') a = Math.atan2(p.atk.y2 - p.atk.y, p.atk.x2 - p.atk.x) + Math.PI / 2;
        goal = [L.x + Math.cos(a) * 200, L.y + Math.sin(a) * 200, 5];
        break;
      }
    }
    goal ? walk(goal[0], goal[1], goal[2]) : walk(null);
    if (D.playCard) cards(G, now);
    // Ultis.
    else if (P.ulti && D.level() >= 1) {
      const alive = G.soldiers.filter((s) => !s.dead);
      const hurt = alive.filter((s) => s.hp < s.maxHp * 0.4).length;
      const near = G.enemies.filter((e) => !e.dead && !D.ENEMY[e.type].fixed && dist(e, G.leader) < 300).length;
      if (G.hucum && G.hucum.at - G.h < 1 && G.ultis.includes('duvar')) D.fireUlti(G.ultis.indexOf('duvar'));
      else if (hurt >= 4 && G.ultis.includes('mars')) D.fireUlti(G.ultis.indexOf('mars'));
      else if (D.level() >= 2 && near >= 8 && G.ultis.includes('top')) D.fireUlti(G.ultis.indexOf('top'));
    }
  } else walk(null);
  // A blow about to land between beats: a player who sees it plays the Kös off the beat.
  if (G.phase === 'wave' && P.react) {
    const L = G.leader;
    for (const p of G.pending) {
      if (p.done || p.atk.block === false || p.atk.shape === 'roar' || p.at - now > 0.12 || p.at < now - 0.06) continue;
      const hits = D.covers(p.atk, L) || G.soldiers.some((s) => !s.dead && !D.isOut(s) && D.inAura(s) && D.covers(p.atk, s));
      if (!hits || D.kosCovers(p.at)) continue;
      if (p.botReact == null) p.botReact = Math.random() < P.react;
      if (p.botReact && G.cd.down <= now) { D.drum('down', performance.now()); break; }
    }
  }
  // Playing: once per beat, at the beat plus a jitter.
  if (G.phase === 'wave' || G.phase === 'breather') {
    const nb = D.beats.find((b) => b.k > lastK && b.t > now - 0.1);
    if (nb && pressAt == null) {
      lastK = nb.k;
      if (Math.random() >= P.skip) pressAt = nb.t + (Math.random() * 2 - 1) * P.jitter * 1.6;
    }
    if (pressAt != null && now >= pressAt) {
      const dir = G.phase === 'wave' ? choose(G, now) : 'up';
      if (dir) D.drum(dir, performance.now());
      pressAt = null;
    }
  }
  setTimeout(tick, 4);
}
setTimeout(tick, 500);
})();
