# Builds out/hubdbg.html: the page with frames on a timer (so it keeps running while the browser
# pane is hidden) and a debug handle, for looking at the konak by hand. Never ship the handle.
import pathlib
here = pathlib.Path(__file__).parent
s = (here.parent.parent / 'mehter-seferi-v3.html').read_text(encoding='utf-8')
i = s.index('<script>')
s = s[:i] + '<script>window.requestAnimationFrame = (f) => setTimeout(() => f(performance.now()), 16);</script>\n' + s[i:]
j = s.rindex('})();')
s = s[:j] + 'window.__dbg = { get G() { return G; }, meta, enterHub, interact, openPanel, panelAct, start, endRun, SPOTS, HUB, held, hurtLeader, earnSan, abandonRun };\n' + s[j:]
(here / 'out').mkdir(exist_ok=True)
(here / 'out' / 'hubdbg.html').write_text(s, encoding='utf-8')
print('ok')
