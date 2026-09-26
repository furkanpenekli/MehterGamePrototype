// Test bot for mehter-seferi-v3. Profile from location.hash: #vur | #mid | #good
(() => {
const P = { vur: { smart: false, jitter: 0.02, skip: 0 }, mid: { smart: true, jitter: 0.045, skip: 0.12, ulti: false, raid: false, react: 0.6, dodge: 0.5 },
  good: { smart: true, jitter: 0.02, skip: 0.03, ulti: true, raid: true, react: 0.92, dodge: 0.9 } }[location.hash.slice(1) || 'mid'];
const D = window.__dbg;
const log = [];
const out = () => { let pre = document.getElementById('botlog'); if (!pre) { pre = document.createElement('pre'); pre.id = 'botlog'; document.body.appendChild(pre); } pre.textContent = log.join('\n'); };
let prevPending = [], lastHearts = 3, started = false, lastK = -1, pressAt = null, waveInfo = null, lastPhase = '';
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
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
function tick() {
  const G = D.G;
  if (!started) { started = true; D.start(false); log.push('start ' + (location.hash || '#mid')); }
  if (G.mode === 'over') {
    log.push(`RESULT ${G.phase === 'won' ? 'WON' : 'LOST'} at c${G.chapter}w${G.wi} kills=${G.stats.kills} perfect=${G.stats.perfect} good=${G.stats.good} miss=${G.stats.miss} use=${JSON.stringify(G.stats.use)}`);
    out(); document.title = 'DONE'; return;
  }
  if (G.terfi) { D.pickCard(Math.floor(Math.random() * G.terfi.cards.length), true); }
  if (G.konak) { D.leaveKonak(); }
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
      log.push(`c${G.chapter}w${G.wi} ${G.goal.padEnd(7)} ${(now - waveInfo.t).toFixed(0).padStart(4)}s hearts ${waveInfo.hearts}->${G.leader.hearts} army ${waveInfo.army}->${army} kills ${G.stats.kills - waveInfo.kills} cezbe ${G.bar.toFixed(0)}`);
      out();
    }
    lastPhase = G.phase;
  }
  // Movement.
  if (G.phase === 'breather') {
    if (!G.picked && G.banners.length) { const b = bannerFor(G); walk(b.x, b.y, 10); }
    else { walk(null); if (G.breatherBeat >= 2) D.startWave(); }
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
    // Ultis.
    if (P.ulti && D.level() >= 1) {
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
