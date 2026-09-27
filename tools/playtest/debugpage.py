# Builds out/hubdbg.html: the page with frames on a timer (so it keeps running while the browser
# pane is hidden) and a debug handle, for looking at the konak by hand. Never ship the handle.
# usage: debugpage.py [v3|v4]  (default v4)
import pathlib, sys
here = pathlib.Path(__file__).resolve().parent
ver = sys.argv[1] if len(sys.argv) > 1 else 'v4'
s = (here.parent.parent / f'mehter-seferi-{ver}.html').read_text(encoding='utf-8')
i = s.index('<script>')
s = s[:i] + '<script>window.requestAnimationFrame = (f) => setTimeout(() => f(performance.now()), 16);</script>\n' + s[i:]
j = s.rindex('})();')
s = s[:j] + 'window.__dbg = { get G() { return G; }, meta, enterHub, interact, openPanel, panelAct, start, endRun, SPOTS, HUB, held, hurtLeader, earnSan, abandonRun, startWave, ' + ('playCard, openKonak, openTerfi, tutStep, tutNext, endTutorial, drum, beats, heardNow' if ver == 'v4' else 'fireUlti') + ' };\n' + s[j:]
(here / 'out').mkdir(exist_ok=True)
(here / 'out' / 'hubdbg.html').write_text(s, encoding='utf-8')
print('ok')
