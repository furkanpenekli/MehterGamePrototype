# usage: sum.py tag profile -> hearts lost and deaths per wave over a batch of runs
import sys, re, glob, collections, pathlib
tag, prof = sys.argv[1], sys.argv[2]
hearts = collections.Counter(); deaths = collections.Counter(); won = 0; runs = 0
for f in glob.glob(str(pathlib.Path(__file__).parent / 'out' / 'logs' / tag / f'{prof}-*.txt')):
    s = open(f, encoding='utf-8').read(); runs += 1
    for m in re.finditer(r'-heart c(\d)w(\d)', s): hearts[m.group(1)+m.group(2)] += 1
    m = re.search(r'RESULT (\w+) at c(\d)w(\d)', s)
    if m and m.group(1) == 'WON': won += 1
    elif m: deaths[m.group(2)+m.group(3)] += 1
waves = [f'{c}{w}' for c in '123' for w in '12345']
print(f'{prof:5} runs {runs} won {won}')
print('  wave   ' + ' '.join(waves))
print('  hearts ' + ' '.join(f'{hearts[w]:>2}' for w in waves))
print('  deaths ' + ' '.join(f'{deaths[w]:>2}' for w in waves))
