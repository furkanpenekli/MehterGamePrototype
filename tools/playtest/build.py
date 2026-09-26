# Builds out/test.html: a copy of the game with a fake audio clock, no drawing, a debug handle
# and the bot. Never ship the debug handle.
import pathlib
here = pathlib.Path(__file__).parent
src = (here.parent.parent / 'mehter-seferi-v3.html').read_text(encoding='utf-8')
prelude = r'''<script>
(() => {
  const P = () => new Proxy(function () {}, {
    get(t, k) {
      if (k === 'value') return 0;
      if (k === 'getChannelData') return () => new Float32Array(8);
      if (k === Symbol.toPrimitive) return () => 0;
      return P();
    },
    set() { return true; },
    apply() { return P(); },
  });
  class FakeAC {
    constructor() { this.state = 'running'; this.sampleRate = 8; this.destination = P(); this.baseLatency = 0; this.outputLatency = 0; }
    get currentTime() { return performance.now() / 1000; }
    getOutputTimestamp() { const n = performance.now(); return { contextTime: n / 1000, performanceTime: n }; }
    resume() { return Promise.resolve(); } suspend() { return Promise.resolve(); }
    createBuffer() { return { getChannelData: () => new Float32Array(8) }; }
  }
  for (const m of ['createGain', 'createOscillator', 'createBufferSource', 'createBiquadFilter', 'createDynamicsCompressor', 'createDelay']) FakeAC.prototype[m] = function () { return P(); };
  window.AudioContext = FakeAC;
  window.requestAnimationFrame = (f) => setTimeout(() => f(performance.now()), 16);
})();
</script>
'''
i = src.index('<script>')
src = src[:i] + prelude + src[i:]
j = src.rindex('})();')
src = src[:j] + 'window.__dbg = { get G() { return G; }, held, beats, start, startWave, drum, pickCard, leaveKonak, fireUlti, level, covers, kosCovers, isOut, inAura, ENEMY, STRONG, WEAK };\n' + src[j:]
R = '  } else if (!G.paused) updateFx(rdt);\n  render(now);\n}'
assert src.count(R) == 1
src = src.replace(R, '  } else if (!G.paused) updateFx(rdt);\n}')
k = src.rindex('</body>')
src = src[:k] + '<script>' + (here / 'bot.js').read_text(encoding='utf-8') + '</script>\n' + src[k:]
(here / 'out').mkdir(exist_ok=True)
(here / 'out' / 'test.html').write_text(src, encoding='utf-8')
print('ok')
