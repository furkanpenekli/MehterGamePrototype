# Mehter Seferi - browser prototype

A small, playable browser prototype of a simpler Mehter design, built between 2026-09-19 and
2026-09-21 to find out whether a lighter loop is fun before anything moves into the Unity
project. It started from the user's request for a game that is easy to learn, easy to play and
full of dopamine hits. It is one HTML file with no build step.

**Status, 2026-09-21: version 6.** The user played versions 1-4 and gave the feedback recorded
below. Versions 5 and 6 were only played by a test bot. The design is **not** adopted as the
game's direction: `FestivalGame/Docs/Design/GameLoop.md` and `FestivalGame/Docs/Design/EnemyPlan.md` still describe the
Unity build, and nothing under FestivalGame's `Assets/` was changed for this prototype.

**Plan, 2026-09-21: version 7.** The user decided that the Unity version will be updated from
this prototype, and started with the planning below. Version 7 exists only as a plan: the
flowchart and `UnitStats.xlsx` show it. `mehter-seferi-v2.html` is prototype 2 and
plays it; `mehter-seferi.html` stays as prototype 1 and still plays version 6. See "Version 7
plan" and "Prototype 2" below.

## Files

| File | What it is |
|---|---|
| `mehter-seferi.html` | Prototype 1, the old version: plays version 6. Open it in a desktop browser with sound on. |
| `mehter-seferi-v2.html` | Prototype 2: plays the version 7 plan. Kept as a separate file so prototype 1 stays playable. |
| `mehter-seferi-v3.html` | Prototype 3: prototype 2 made real-time (decision 19), with Mehterhane Konağı, the hub between runs (decision 25). Not published as an artifact yet. |
| `mehter-seferi-v4.html` | Prototype 4: prototype 3 with a Clash Royale-style deck for choosing soldiers (decision 27). Prototypes 1-3 stay as they are. |
| `game-loop-flowchart.html` | Five linked flowcharts: the konak between runs (0), the run, every instrument press, the fight, the ulti. Since 2026-09-26 they draw prototype 3; the published artifact still shows the older prototype 2 loop. |
| `dusman-plani.md` | The enemy plan for prototype 3, in Turkish: monsters instead of armies, three themed chapters, one boss each. A plan only, not built yet. |
| `mehter-sefer-akisi.pdf` | The flowchart printed to A4, one chart per page. Re-print it from the HTML with headless Chrome after each change. |
| `README.md` | This file: the design, the user's decisions, what is still open. |

Both pages are also published as private artifacts, in Turkish like the files:

- Prototype 1: https://claude.ai/artifact/VeZaEh8ebEvvu9DqKAAV2b
- Prototype 2: https://claude.ai/artifact/RUvdwbP64UowN4ypcas6p2
- Flowchart: https://claude.ai/artifact/FwPr9DGTgeqkL68o5x5XNU

The files here are standalone copies. The artifact host adds its own `<!doctype>` / `<head>` /
`<body>` skeleton, so to update an artifact, publish the part between `<head>` and `</body>`
without this folder's wrapper, to the same URL. Keep the file and the artifact in step, and
update the flowchart whenever the loop changes.

The player-facing text of both pages is Turkish, because it is what the user plays and reads;
code and comments are English.

## Controls

| Input | Keyboard | Gamepad |
|---|---|---|
| VUR (davul) | ↑ | Y |
| DİREN (kös) | ↓ | A |
| ATIL (çevgen) | → | B |
| TOPLAN / seal a combo (zil) | ← | X |
| Walk; walk under a banner to pick it | W A S D | Left stick |
| Pick a promotion card | A W D (left, middle, right) | X Y B |
| Konak (prototype 3): talk to someone, go through the gate | E, Enter or Space | A |
| Konak panel: move between buttons, press, close | Arrows, Enter, Esc | D-pad, A, B |
| Skip the breather | Space | Back |
| Pause, latency calibration, settings | Esc | Start |
| Tempo: call-and-response / every beat | T | - |
| Timing cue: ring + mallet / mallet / ring | H | - |
| Beat click on / off | M | - |

The right hand plays and the left hand chooses. That split is deliberate: see decision 2 below.

## The design

See `game-loop-flowchart.html` for the loop drawn out. In words:

- **The leader never fights.** Each instrument, played on the beat, is an order to the soldiers
  standing inside the aura. Soldiers outside the aura do not hear orders.
- **Four orders.**
  - VUR: every soldier in the aura strikes at once.
  - DİREN: blocks every enemy blow that lands on that beat on the leader or a soldier in the aura.
    A Perfect block stuns the attacker for 2 beats.
  - ATIL: soldiers dash at the nearest enemy and leave the aura to fight there for a moment.
  - TOPLAN: soldiers outside the aura run back.
  - Soldiers also fight on their own, at 40% damage.
- **Timing.**
  - Windows are Perfect ±60 ms and Good ±150 ms.
  - Every cue anticipates the beat; none of them appears only on it. Reaction time is longer
    than the window, so a cue that only appears on the beat always arrives too late.
  - Three cues sit on the leader, where the eye already is: the aura ring warms from bronze to
    gold as the press nears, a mallet bounces and lands on the leader, and rings close onto a
    hit ring.
- **Call and response (default tempo).** The player presses every other beat. On the beat in
  between the army shouts "HEY!", and after a VUR it strikes again at 60%. Enemy blows are
  moved onto the player's beats so DİREN can always answer them. Every per-press gain is
  doubled, so a run's pace in seconds does not depend on the mode.
- **Cezbe** is the one meter (0-36).
  - It rises with every hit (Good +1, Perfect +1.5) and falls with a miss (−6), a blow on the
    leader (−12) and silence (−3 per bar).
  - Pressing on the army's beat counts as a miss but costs no Cezbe, and the game says whose
    beat it was.

  | Level (at) | Armor | Attack speed | Move speed | Order damage |
  |---|---|---|---|---|
  | - (0) | 0% | ×1 | +0% | ×1 |
  | I (10) | 15% | ×1.3 | +15% | ×1.5 |
  | II (20) | 30% | ×1.6 | +30% | ×2 |
  | III (30) | 45% | ×2 | +45% | ×2.5 |

  At level III soldiers arrive twice as fast and loot drops double.
- **Reinforcements (combos).**
  - Play one instrument twice on consecutive calls, then seal it with the zil. The two presses
    still give their orders.
  - After a matching pair a "← ZİL: …" prompt appears under the leader.
  - Each reinforcement lasts 8 calls:

  | Combo | Reinforcement |
  |---|---|
  | ↓ ↓ ← | Can: +40% health now, then 5% a call |
  | → → ← | Hız: soldiers ×1.6 speed, dashes ×1.3, leader ×1.25 |
  | ↑ ↑ ← | Vuruş hızı: auto-attacks ×2.5, the "HEY!" blow at full strength |

- **The army.**
  - It starts with 6 Azap and is capped at 30.
  - Every 16 good beats a soldier arrives. The type comes from the banner the leader walked
    under during the breather, and it is not tied to any instrument.
  - Each soldier counters one enemy:

  | Soldier | Health · damage | Counters |
  |---|---|---|
  | Azap | 22 · 6 | - |
  | Yeniçeri | 34 · 10 | Piyade ×1.5, Kalkanlı ×2, the gate ×1.5 |
  | Kemankeş | 14 · 6, ranged | Atlı ×2.5 |
  | Sipahi | 24 · 7, fast | Okçu ×2.5 |

- **Enemies.** Every blow is telegraphed as a red ring that closes on a beat.
  - Piyade: swarm.
  - Kalkanlı: takes 25% damage from the front (60% from a Yeniçeri). It is open while it
    recovers from a blow or is stunned.
  - Okçu: fires from 220-330 px.
  - Atlı: dives at the leader.
  - Blows at the leader always telegraph for at least 2 beats. Waves 1-3 allow one leader
    attacker at a time, later waves two.
- **Loot and promotions.** Kills drop gold (3 per Kalkanlı or Atlı). Each full loot bar opens a
  Terfi: pick 1 of 3 cards, while the world waits and the beat goes on.
- **The run.**
  - The leader has 3 hearts, and one comes back every third wave.
  - Waves 1-5 teach one thing each, in order: VUR, DİREN, ATIL, then Kalkanlı and a mix.
  - Wave 6 is the siege. A gate (7000 health, scaled by wave) sends out a sally every 8
    beats, and breaking it wins the run.
  - Tempo climbs 80 → 88 → 96 bpm across the run.

## Version 7 plan

Planned on 2026-09-21. Not built yet.

- **Fixed tempo.** No BPM changes across the run, and no call and response: the "HEY!" beat
  is gone. The beat and its timing check stay.
- **No combos.** The reinforcement combos and their buffs are removed.
- **The aura colour is the only timing cue.** It warms towards the press. The mallet is gone.
- **Cezbe levels raise soldiers' health, damage and speed a little.** This replaces armor,
  attack speed, move speed and order damage.
- **Chapters and the konak.**
  - The run is made of chapters, and each chapter has five waves.
  - Each chapter has forward outposts to raid, castles to tear down and bosses to beat.
  - Each wave's goal is one of these, or scattering the enemy. A wave ends when its goal is met.
  - The short breather between waves stays. The next wave is shown and the banner is picked.
  - After every fifth wave the army stops at a konak to rest and rearrange, and then the chapter
    changes.
  - The run is won by finishing the last chapter. The siege of wave 6 is replaced.
- **Ultis spend Cezbe levels.**
  - There are four ulti slots.
  - The player arranges them at the konak.
  - Spending a level also takes away that level's health, damage and speed bonus.
- **Unit stats** are in `UnitStats.xlsx`.
  - Plain numbers, a rock-paper-scissors table and one-on-one fight tables.
  - A strong matchup deals double damage, and a weak matchup takes double damage.
  - Piyade is a pikeman.
  - Sipahi is renamed Deli.
  - Summons bring several soldiers at once: Azap 3, Yeniçeri 2, Kemankeş 2, Deli 3.
  - Armored elite units come later.
- **Open.** Prototype 2 gives an answer to each of these, and none is confirmed:
  - How many chapters there are.
  - Which wave carries which goal.
  - What the konak restores. For example, do hearts refill there? The "+1 heart every third
    wave" rule is not in this plan.
  - Which input fires an ulti.
  - How many levels an ulti costs.
  - What each ulti does.
  - The exact Cezbe level bonuses.
  - The fixed tempo's value.

## Prototype 2

Built on 2026-09-21 from the version 7 plan. Only a test bot has played it.

- **The player picks the instrument (2026-09-26).** The user: "karakterin hangi çalgıya
  vuracağını oyun değil oyuncu belirlesin, plan yapsın, her bir çalgının avantajı dezavantajı
  olsun, stratejiyi oyuncu kursun." There is no right or wrong instrument any more; only timing
  is judged. Four instruments, on the arrow keys (Y A B X on a gamepad):

  | Key | Instrument · order | Gain | Price |
  |---|---|---|---|
  | ↑ | Davul · VUR | Every soldier that hears strikes at full damage. | Nothing is blocked. |
  | ↓ | Kös · DİREN | Every blow on that call on the leader or a soldier that hears is blocked; a Perfect stuns the attacker for 2 calls. | Nobody strikes. |
  | → | Çevgen · ATIL | Soldiers dash at their prey up to 260 px out (ranged: 1.4× reach), strike at ×1.5 with more knockback, and a blow breaks that enemy's wind-up. | They leave the aura: they do not hear the next call's order, DİREN does not cover them, and they walk back on their own. |
  | ← | Zil · TOPLAN | Everyone breaks off and runs back at 1.8× speed, heals 15% (×1.5 on Perfect), and Cezbe rises twice as fast. | Nobody strikes and nothing is blocked. |

  - Enemies still strike in volleys, 2-3 calls apart. One call before a volley, every enemy
    close enough to its target winds up at once, and melee enemies lunge in up to 90 px.
  - The aura is the only timing cue. It still warms red before a volley and gold before a quiet
    call, but only as information: a volley can be blocked (Kös), cut (Çevgen) or raced by
    killing the attackers first (Davul).
  - Any instrument on time raises Cezbe and gives its order. A miss still costs 6 Cezbe.
  - Soldiers that hear wait for an order. Soldiers outside the aura, or charged out, fight on
    their own at half damage every 1.5 s; charged-out soldiers are drawn dimmed with a dashed
    orange ring.
  - Two new Terfi cards: Akın Çevgeni (ATIL ×2) and Zil Merhemi (TOPLAN heals twice as much).
  - The end screen counts how often each instrument was played. Tuning is in `ORD`.
  - Bot test, 2026-09-26: a bot that chose all four instruments by the situation, one that
    played Kös on red and Davul otherwise, and one that only played VUR all finished the 15
    waves with 2-3 hearts. A bot that chose at random lost its whole army in chapter 3 when ATIL
    kept soldiers out for 2 calls, which is why it is now 1 call.
- **Tutorial.** It runs on the first start; the title's "Eğitimle başla" replays it, and Space
  skips it. One step per instrument, with no enemies and nothing to lose: 3 VURs, 2 DİRENs on
  scripted red calls, 2 ATILs, 2 TOPLANs. Each step names the instrument's gain and price, and
  its key is written under the leader. Cezbe and the stats reset when it ends.
- **Fixed tempo:** 80 bpm, one call every other beat (1.5 s). No "HEY!" beat, no combos, no ATIL or
  TOPLAN, no mallet and no beat rings.
- **Cezbe:** thresholds 10/20/30 of 36. Each level gives +10% health, damage and speed.
- **Ultis:** keys 1-4 (LB RB LT RT on a gamepad). Each costs 1 or 2 levels, which takes away
  10 Cezbe per level. There are six, and four are picked at the konak:
  - Top Atışı: 40 damage around the leader.
  - Kös Duvarı: 4 calls of automatic blocks.
  - Mehter Marşı: full heal.
  - Hücum Borusu: 4 calls of double damage.
  - Akıncı Baskını: a free company.
  - Zil Çınlaması: stuns every enemy for 3 calls.
- **Run:** 3 chapters of 5 waves, in this order: open battle, outpost raid, open battle, castle
  siege, serdar (boss).
  - The outpost, gate and serdar send out garrison groups until they fall.
  - The konak heals every soldier, gives one heart back, and is where the four ulti slots are
    chosen.
- **Units:** numbers from `UnitStats.xlsx`, with the ×2 strong and weak matchups.
  - Soldiers come only from the banner. Four banners are offered each breather, one can be
    picked, and its soldiers arrive the moment the leader steps under it: Azap 6, Yeniçeri 4,
    Kemankeş 4, Deli 6 (two companies of 3, 2, 2, 3).
  - The army is capped at 15 and starts with 6 Azap.
  - **Soldiers hunt their prey (2026-09-22).** So that the banner pick matters, a soldier goes
    first for the nearest enemy it is strong against: Deli for Okçu, Azap for Atlı, Yeniçeri for
    Kalkanlı. It looks 1.8 times further out for one, and up to 1.4 times further from the
    leader. With no prey in reach it takes the nearest enemy, and one it is weak against counts
    as 1.6 times further. VUR strikes the hunted prey when it is in reach. Kemankeş has no strong
    matchup, so it still takes the nearest enemy. Tuning is in `PREY`.
- **Waves:** each holds 2 times the enemies it used to (+60% per chapter), sent in groups of 8
  every 8 beats. A wave's goal (outpost, gate, serdar) sends out 4-6 more every 10 beats. At
  most 30 enemies are on the field at once.
- **Raids (2026-09-21, the user asked for more enemies and castles and outposts to raid).**
  Each chapter scatters 2 outposts and 1 castle (hisar) around the map, off the waves' path.
  They are optional: a wave does not need them.
  - A fort sleeps until the leader comes within 430-500 px or it is hit. Then it sends its
    garrison out every 6 beats: an outpost 12, a castle 22, both growing each chapter.
  - An outpost that falls pays loot and frees a company of a random soldier type. A castle pays
    more loot, frees 2 companies and gives a heart back.
  - Off-screen forts show as a tower marker with their distance. Tuning is in `RAID`.
  - Bot test: a bot that went for every fort took 9 over the run, finished all 15 waves in about
    10 minutes and lost at most 2 hearts at once. A bot that left them alone finished in about
    12 minutes without losing a heart. Both pressed on time and chose the right instrument 85%
    of the time, so the game may still be too easy for the user.
- **Figures:** flat side-view figures drawn in the canvas, after a reference picture the user
  gave. Soldiers wear warm cloth, enemies grey steel.
- **Bot-tested only,** before the banner and wave change above. A bot that pressed the right instrument on time 85% of the time finished
  all 15 waves in about 7.5 minutes and lost one heart. A volley came on 25% of the calls.
  - Earlier tunings were too easy: the army of 24-30 killed enemies before they could strike,
    and only 10% of the calls held a volley. That led to the lunge, the cap of 15 and the
    denser waves.
  - A human's timing will be looser than the bot's, but the difficulty still needs the user's
    play-test.

## Prototype 3

Built on 2026-09-26 from prototype 2 (with decision 18), after the user asked to drop the
turn-like call rhythm and go real-time so the game flows better (decision 19). Only a test bot
has played it. Everything not listed here is as in prototype 2. Its storage keys are
`mehter3.*`. `game-loop-flowchart.html` and its PDF draw this prototype.

- **Play any time, on the beat is better.** The four instruments of decision 18 can be played at
  any moment they are ready. Each has a cooldown counted in beats (decision 23): VUR and DİREN
  one beat, ATIL and TOPLAN two. The beat keeps ticking at 80 bpm, and every beat (0.75 s) is a
  chance to be on time:
  - on the beat (Perfect ±60 ms, Good ±150 ms): the order is ×1.25 on Perfect, the instrument is
    ready again 150 ms before the beat its cooldown ends on (so VUR and DİREN can be played on
    every beat, ATIL and TOPLAN on every second one), Cezbe rises (once per beat, so a chord does
    not pay twice), and the streak grows;
  - off the beat: the order still goes out at ×0.75, the cooldown runs its full beats from the
    press (so the next beat is usually missed), no Cezbe, and the streak breaks. There is no miss
    penalty.
  - An instrument that is not ready only ticks; the HUD buttons darken from the top while they
    recharge.
  - Cezbe drops 3 every 1.5 s after 3 s without a press on the beat.
- **DİREN in real time.** A Kös press guards blows that land up to 0.4 s after it (0.55 s on the
  beat), and up to 0.08 s before it. A blow that lands within 0.2 s of the press stuns its
  attacker.
- **Enemies attack on their own clocks** (the user: "düşman bazen topluca hücuma geçer ama
  normalde ilki geçerli").
  - When its target is in reach and it has rested (2.2-3.4 s after its last blow, scaled by the
    difficulty ramp of decision 24), an enemy winds up: 1.0-1.6 s by type, and at the leader at
    least 2 s on the first wave down to 1.2 s on the last. The red ring closes on its target over
    the wind-up. One enemy at a time may aim at the leader early on, up to three at the end.
  - **Toplu hücum:** every 16-24 s (scaled by the ramp), every enemy near its target winds
    up at once, the foot soldiers lunge in, and all the blows land on the same beat, 3 beats
    later. "TOPLU HÜCUM!" shows and the war drum sounds twice.
  - The aura warms red when a blow closes on the leader or a hücum is coming; otherwise gold.
- **Soldiers** all fight on their own at half damage every 1.5 s, in the aura or not; an order
  is a full strike on top of that. ATIL takes soldiers out for 3 beats.
- **Volume (2026-09-26, also in prototype 2):** the pause menu (Esc) has three sliders, for
  everything, for the instruments and the battle, and for the tempo click. They are shared
  between the prototypes (`mehter.volume`), like the latency offset.
- **Tutorial:** the same four steps. The Kös step drops practice blows on the leader (a red ring
  that closes in 3 beats) and counts blocks.
- **Bot test, 2026-09-26.** Both bots finished all 15 waves in about 7.5 minutes without losing
  a heart: one that used all four instruments (VUR 270, DİREN 8, ATIL 24, TOPLAN 23) and one that
  only pressed VUR on every beat. The game is far too easy, and so far nothing forces the other
  instruments. The same was true of prototype 2 after decision 18: a VUR-only bot won there too.
  Difficulty needs a pass.
- **Bot test after decision 24, 2026-09-26** (`tools/playtest`, see "Testing it without a
  person"). Per 15 waves, over 10-12 runs each:

  | Bot | Wins | Where it falls |
  | --- | --- | --- |
  | good: on time, guards 92% of blows, dodges, raids, uses ultis | 9 of 10 | once at 3-4 |
  | mid: ±70 ms, skips 12% of beats, guards 60%, dodges half | 5 of 12 | 1-5, 2-4, and five times at 3-4 or 3-5 |
  | VUR only | 0 of 4 | always at 1-3 |

  The first three waves cost the mid bot 3 hearts in 12 runs; deaths gather at the end.
- **Mehterhane Konağı (decision 25, 2026-09-26).** A Hades-style hub: every run starts in it and
  every run ends in it, and it keeps what lasts from run to run. It is a walled courtyard at dusk,
  drawn in the same three-quarter view as the land, and the title screen sits over it.
  - **Walking round.** The leader walks it with WASD, and the army of the loadout follows. The beat
    goes on and the instruments can be played anywhere, graded as in a run but with no Cezbe.
    Walking up to someone shows what they say (it depends on how the last run went) and what E
    does there. There are no enemies.
  - **Şan** is the one thing kept between runs. A run pays it as it goes, and keeps it even when
    the leader falls or the run is left from the pause menu: each wave cleared 3, 4 or 5 by chapter,
    each outpost 4, each castle 8, each serdar 15 more, and the whole campaign 25 more (`SAN`).
    A won campaign pays about 180, a fall in chapter 1 about 10-20. The HUD shows it under the
    army, and the end screen shows what the run paid and what the book holds.
  - **The Kethüda** (west) sells permanent upgrades for şan, rank by rank (`UPGRADES`):

    | Upgrade | Ranks · price | Gives |
    | --- | --- | --- |
    | Sıkı Talim | 15 · 30 · 50 | soldiers' health +6% a rank |
    | Ganimet Payı | 15 · 30 · 50 | loot +10% a rank |
    | Ocak Kadrosu | 20 · 45 | one more starting company a rank |
    | Kıdem | 20 · 40 | every terfi 3 loot cheaper a rank |
    | Coşkulu Açılış | 20 · 40 | every wave starts with at least 5 Cezbe a rank |
    | Gür Nevbet | 25 · 50 | aura +6% a rank |
    | Hızır Duası | 40 · 90 | when the last heart goes, get up with one heart, once a rank; the monsters near the leader are thrown back and stunned |
    | Akıncı Baskını | 30 | unlocks this ulti |
    | Zil Çınlaması | 45 | unlocks this ulti |

    Everything costs 655 şan. Akıncı Baskını and Zil Çınlaması are now locked until bought, at
    the konak and at the chapter konak alike.
  - **The Bayraktar** (north-west) keeps the loadout: the starting company (two companies of
    Azap, Yeniçeri, Kemankeş or Deli, and one more per Ocak Kadrosu rank) and the four starting
    ulti slots. The chosen company's banner stands tall on his rack. Each company card names the
    monsters it is strong against, once they have been met.
  - **The Talimci** (east) stands by a practice dummy. VUR and ATIL near it make the soldiers
    strike it, and the damage shows over it, so a Perfect's worth can be felt. His panel shows the
    latency suggestion from the presses made in the konak, the click, and "Eğitimle sefere çık".
  - **The Vakanüvis** (north-east) keeps the chronicle: runs, wins, the furthest wave, all şan
    earned, the last ten runs with what ended them, and every monster met, by chapter, with its
    tip (unmet ones show as ???).
  - **The gate** (north) starts the run: the leader walks out as the screen darkens. The first run
    still starts with the tutorial.
  - **Three musicians** of the band play on the beat by the south wall.
  - The end screen's "Konağa dön" (Enter) goes back; "Hemen yeniden sefere" skips the konak. The
    pause menu's "Seferi bırak, konağa dön" leaves a run and keeps its şan.
  - Storage: `mehter3.meta` holds şan, ranks, the loadout, the chronicle and the monsters met. It
    took over `mehter3.best` and `mehter3.wins`, which it reads once.
  - The bots start runs straight away with an empty book, so their numbers are unchanged: after the
    konak the good bot won 6 of 6, and the mid bot lost 8 of 8, as it did on the commit before.
- **Background music** (decision 26). A quiet track plays on the beat clock under everything, a
  different one in each land and a much calmer one in the konak (the hub and the chapter konak
  alike). It is procedural Web Audio, each track a makam: Tepegöz Yurdu a ney in Hüseyni, Şahmeran
  Diyarı a kanun-like pluck in Hicaz, Ejderha Dağı a low horn in Saba with a soft heartbeat every
  other beat, the konak a sparse ud (and now and then a ney) in Rast at about half the level. Each
  has a low drone, 16-beat phrases and a whole phrase of rest in its loop; none has drums, so the
  player's davul stays alone. A new track starts on the next bar and crossfades in. It is not
  adaptive (decision 3). It has its own bus, softened by a lowpass and a dark echo, and its own
  slider, "Fon müziği", in the pause menu (`mehter.volume.music`).
- **Next:** publishing prototype 3 and the flowchart as artifacts, and republishing prototype 2's
  artifact with decision 18.

## Prototype 4

Built on 2026-09-27 from prototype 3, after the user found the way soldiers are chosen for the
fight too thin and asked whether a Clash Royale-style model would help (decision 27). Only a test
bot has played it. Everything not listed here is as in prototype 3. Its storage keys are
`mehter4.*`; `game-loop-flowchart.html` still draws prototype 3.

- **Cezbe is the elixir.** Ten pips. One fills by itself every 8 beats during a wave, and every
  beat played on time adds 0.2 more (Perfect 0.3, the zil twice that), once per beat. The breather
  pays nothing. A blow on the leader takes 2. A wave starts with at least 4. What would go past a
  full bar is wasted, and the bar blinks "DOLU · kart oyna!". Cezbe no longer raises the soldiers'
  health, damage or speed, and there are no levels.
- **The deck.** Eight cards, built at the Bayraktar in the konak; a company card may go in twice, a
  spell once. Four are in hand on 1-4 (LB RB LT RT), with the next one shown beside them. A played
  card goes to the back and the next comes into its slot. Cards are played only in a wave.

  | Card | Cost | Does |
  |---|---|---|
  | Azap | 2 | 3 Azap |
  | Yeniçeri | 4 | 2 Yeniçeri |
  | Kemankeş | 3 | 2 Kemankeş |
  | Deli | 3 | 3 Deli |
  | Top Atışı | 3 | as the ulti |
  | Kös Duvarı | 3 | as the ulti |
  | Mehter Marşı | 4 | as the ulti |
  | Hücum Borusu | 4 | as the ulti |
  | Akıncı Baskını | 7 | a company of each of the four kinds (locked until bought) |
  | Zil Çınlaması | 5 | as the ulti (locked until bought) |

  The default deck is the first eight. Tuning is in `KARTS`, `DECK_SIZE` and `HAND`.
- **Soldiers from cards are temporary.** A company from a card fights for 32 beats, with a gold
  arc under each soldier that shrinks as its time runs out, then goes home. The core army stays:
  the Bayraktar's starting companies, prisoners freed from forts, and one company of the player's
  choice added at each chapter konak (which replaces choosing ulti slots there). The army's limit
  is 20, 24 and 28 by chapter.
- **Terfis come when a wave ends (decision 28).** Loot still fills the bar in a wave, but a terfi
  it has earned waits for the breather and opens there, one after another while the loot lasts;
  the breather's count waits with it. During a wave the loot line says "dalga sonunda". A terfi
  earned in a chapter's last wave opens after the konak. The breather has no banners any more.
- **The chapter konak rearranges the deck (decision 28).** Besides the core company, the konak
  after each chapter shows the run's deck, to change for the next chapter in the same way as at
  the Bayraktar; the deck is shuffled again when the band leaves. The change is for that run only:
  the Bayraktar's deck is what the next run starts with. Arrows (the d-pad) move between the
  cards, Enter (A) presses one, and Enter off the cards or Start leaves.
- **Monsters come in groups of one kind.** Each kind in a wave is its own group (split in two past
  8), and each big monster comes alone, in the second half. A group is announced 4 beats before
  it comes, with a marker at the screen's edge on the side it comes from: how many, what, the beats
  left, and which soldier is strong against it. The gap to the next group grows with its size, 4-8
  beats. Tuning is in `T.warnBeats`, `T.groupGap` and `T.groupSize`.
- **Tutorial:** a fifth step plays two cards.
- **End screen:** cards played, the three most played, and Cezbe wasted.
- **Bot test after decision 28:** good 7 of 8 (4 hearts lost, one fall at 3-4), mid 0 of 8
  (falls at 3-2 twice and 3-4 six times). Without the banners' free companies the mid bot is back
  where it was in prototype 3.
- **Bot test, 2026-09-27, before decision 28** (`tools/playtest`, 8 runs each). The bots play a card as soon as they
  can afford one; the good bot picks the card that is strong against the monsters near and coming,
  the new `rand` bot picks at random at the same pace:

  | Bot | Wins | Hearts lost | Where it falls |
  | --- | --- | --- | --- |
  | good | 7 of 8 | 4 | once at 3-4 |
  | rand (good, random cards) | 6 of 8 | 7 | 3-4, 3-5 |
  | mid | 4 of 8 | 14 | 1-5, 3-4, 3-5 twice |
  | VUR only (4 runs, earlier build) | 0 of 4 | - | 1-4, 1-5 |

  - **Choosing the right card helps, but only a little.** How many cards are played matters more.
    An earlier bot that held its cards for a good match lost to one that played at random but
    sooner (3 of 6 against 6 of 6).
  - A strong match doing ×3 instead of ×2 did not widen the gap within the noise of 8 runs, so it
    is back at ×2 (`MATCH`).
  - Chapters 1 and 2 cost the good bots nothing; the last two waves decide most runs.
  - The waves are about 15 s each, half of prototype 3's.

## The user's decisions

Build on these; do not re-propose what they rule out.

1. **2026-09-19.** A simpler, more fun Mehter: easy to learn, easy to play, with dopamine bursts.
2. **Soldier type must not depend on which instrument is played.** Tying both the next soldier
   and the soldiers' behaviour to one input would confuse the player. It became a banner
   picked once per wave, with the movement hand.
3. **No adaptive music.** The game will get its own music track, and the layered music was
   overwhelming. Sound effects only; a quiet click stands in for the beat.
4. **Timing UI belongs on the leader, not in a bottom lane.** The player cannot follow the fight
   and a HUD strip at once.
5. **The ring alone was still tiring,** so a second cue was asked for. The mallet was added,
   then call and response, which halves how often the player must press.
6. **The aura ring's colour should change as the press approaches.**
7. **Combos give soldiers short buffs to health, speed or attack speed.** Instrument-based
   orders stay the core mechanic.
8. **Missing lowers Cezbe, and Cezbe affects armor, attack speed and speed.** Changed by 12.
9. **2026-09-21: the Unity version will be updated from this prototype.**
10. **Unit stats are plain numbers in one table.** No star budgets or formulas, because the
    reader should not have to calculate anything. Every soldier has a matchup it is strong
    against and one it is weak against.
11. **Fixed tempo, no combos.** Decision 7 is withdrawn.
12. **Each Cezbe level raises health, damage and speed a little.** Cezbe levels are spent on
    ultis from four slots, which are arranged at the konak.
13. **Chapters of five waves, with a konak after each.** A chapter holds forward outposts to
    raid, castles to tear down and bosses to beat. The chapter changes after the konak.
14. **The player times presses by the aura's colour, not a mallet.**
15. **2026-09-21: defend when the enemy strikes, press VUR when the beat is quiet.** Built as
    prototype 2; prototype 1 stays as the old version.
16. **2026-09-21: soldiers arrive as soon as their banner is picked, and correct calls no longer
    bring reinforcements.** Waves are a little longer. (Prototype 2.)

17. **2026-09-22: soldiers hunt the enemy they are strong against,** so that picking a banner
    for the coming wave is a meaningful choice. Chosen from four proposals: the others were a
    wave's leading threat shown in the breather, goals that favour one soldier type, and army-wide
    traits for 6+ soldiers of one type. They are not built. (Prototype 2.)
18. **2026-09-26: the player, not the game, decides which instrument to play.** Each instrument
    has its own gain and price, and the strategy is the player's. There is no wrong-instrument
    penalty. This replaces the "right instrument" rule of decision 15; the red aura stays as
    information. ATIL and TOPLAN are back, with new trade-offs. (Prototype 2.)
19. **2026-09-26: the game goes real-time, so that it flows better.** Instruments are played at
    any time, with cooldowns, and a press on the beat is stronger (chosen over a fully free
    version and over pressing on every beat). Enemies normally attack one by one on their own
    clocks, and sometimes charge together. Built as prototype 3; prototype 2 stays.

20. **2026-09-26: monsters instead of armies (prototype 3).** Their attacks are easier to make
    distinct, and some are large and attack in other ways. Chapters must not repeat each other.
    Tepegöz, Şahmeran and Ejderha are the three big bosses, one before each konak. The theme
    changes after the konak, so each chapter has its own small monsters that fit its boss. The
    roster is in `dusman-plani.md`; the individual monsters are Claude's proposal.

21. **2026-09-26: slower terfis, a visible build, army growth at the konak (prototype 3).**
    Terfis came too fast, and the player could not keep the build in mind. The army should only
    grow after a konak, and when the army is big enough, a wave should pay loot instead, to keep
    the dopamine. Built as: a terfi costs 15 loot, then 10 more for each one taken (was 7, then
    5 more); the terfis taken show in the HUD (wide screens), under the terfi cards, in the pause
    menu and on the end screen, and a card already owned says "sende ×n"; the army cap is 12,
    16 and 20 by chapter, raised at the konak; a soldier who would join a full army (banner,
    raid, Akıncı Baskını) comes as 2 loot instead. The numbers are Claude's.

22. **2026-09-26: walking away must not pause a wave (prototype 3).** The player has to raid the
    forts and outposts and hold off the wave at the same time. Before, a raid or gate wave's
    monsters came out of its goal, and most monsters are slower than the leader, so walking off
    left the wave behind. Built as: when the goal is 700 px or more from the leader, its groups
    and its garrison come at the band from the goal's side, and a monster more than 650 px from
    the leader moves 3 times faster until it is back. The numbers are Claude's.

23. **2026-09-26: shorter cooldowns, and a land that looks better (prototype 3).** The old
    cooldowns were too demanding: DİREN could not be played on every beat. VUR and DİREN now
    recharge just before the next beat, ATIL and TOPLAN just before the beat after it, so the
    player can play them every beat and every second beat. The ground was a flat colour with
    grass tufts; the user asked for the level to look nicer. Built as: each chapter's land is
    painted with light and shade swells, small things of its own (Tepegöz Yurdu: grass, stones,
    flowers, bushes; Şahmeran Diyarı: reeds, puddles, ferns, mushrooms; Ejderha Dağı: glowing
    cracks, embers, black glass), a landmark every thousand steps or so (a stone ring, a boulder
    field, an old sheep fold; a pond, a ruined shrine; a lava pool, dragon ribs, a glass field),
    trodden earth round the forts, drifting pollen, fireflies or embers in the air, and a dark
    vignette. The ground is only looks: nothing on it blocks or slows anyone. The art and the
    150 ms margin are Claude's.

24. **2026-09-26: the game starts easy and grows hard (prototype 3).** The user asked for a
    playtest and a difficulty curve from easy to hard. A bot test showed the curve was not
    rising: the mid bot died in chapter 1 (four Karakoncolos in wave 3, the gate wave), while
    chapter 2 cost the good bot almost nothing. Built as: one difficulty ramp over the 15 waves,
    `DIFF` in the page, from its easy value on wave 1 to its hard one on wave 15: monster health
    ×0.8 → ×2.1, damage ×0.7 → ×1.7, rest between attacks ×1.5 → ×0.7, the wind-up of a blow at
    the leader 2 s → 1.2 s, time between charges ×1.5 → ×0.75, monsters aiming at the leader at
    once 1 → 3, and a goal fort or serdar sending a group every 14 → 8 beats. It replaces the
    per-chapter steps. Wave 1-3 has 2 Karakoncolos and 2 Sapancı instead of 4 and 4; wave 3-3
    has 2 Od Cadısı instead of 3 (wave 3-4 gets the third); the Od Cadısı's fire on the leader
    is telegraphed as long as any blow at the leader. The numbers are Claude's.

25. **2026-09-26: a konak at the start of the game, a Hades-style home base (prototype 3).** The
    user: "oyunun başına da bir konak eklemeliyiz. hades usulu bir bekleme yeri ... ana base
    olarak". Built as Mehterhane Konağı, a courtyard to walk round between runs (see "Prototype
    3"). Everything in it beyond "a Hades-style hub" is Claude's proposal (listed below).
26. **2026-09-26: light background music, one per land, a calmer one in the konak (prototype
    3).** The user: "oyuna güzel bir arka fon ekle her temada değişsin ama çok hafif olsun
    konaklarda da çok daha sakin bir konak müziği olacak". It is quiet and does not follow the
    fight, so decision 3 still holds; the music itself is Claude's (listed below).

27. **2026-09-27: a Clash Royale-style model for choosing soldiers (prototype 4).** The user:
    "neye göre savaştığımıza bağlı olarak hangi askeri seçip ilerleyeceğimiz konusundaki mekanik
    hala bana yetersiz geliyor ... clash royale tarzı bir strateji mekaniği birim seçmede işimize
    yarayabilir mi", then "v4 olarak bunu yapalım diğerleri yedekte kalsın". Built as prototype 4
    from Claude's proposal: Cezbe as the elixir, a deck of eight with four in hand, companies from
    cards that fight for a while, and monsters in announced groups of one kind. The user did not
    choose between the options offered (Cezbe as pure elixir or with its stat bonus kept; temporary
    or capped soldiers; what the breather offers), so the details are Claude's (listed below).
28. **2026-09-27: terfis when a wave ends, no free banner card, the deck rearranged at the konaks
    (prototype 4 only).** The user: "v4te terfiler wave bitince olsun bedava karta da gerek kalmadı
    bu durumda böyle ufak bir sadeleşmeye gidebiliriz. konaklarda da deste yeniden düzenlenir ama
    bunlar v4e özgü". Built as in "Prototype 4". Loot still decides when a terfi is earned; only
    when it opens changed (Claude's reading, listed below).

## Claude's calls the user has not confirmed

- Decision 18's four instruments and their gains and prices: bringing back ATIL and TOPLAN, the
  wind-up break, the aura exit, the Zil's double Cezbe, and every number in `ORD`.
- Prototype 3's numbers: the cooldowns, the on-beat bonuses, the Kös windows, every number in
  `ATK`, soldiers in the aura fighting on their own, and no penalty for an off-beat press.

- The zil's own order being TOPLAN. The user did not say what the zil should do once the
  Zil-triggered fever was folded into the Cezbe meter.
- The siege as wave 6, the gate's 7000 health, and the run ending there. The v7 chapters replace it.
- All of Cezbe's numbers: thresholds 10/20/30, the level table, −6 per miss.
- Gamepad support and its button map.
- Decision 25's content: şan as the one currency kept between runs, and what pays it; every
  upgrade and price in `UPGRADES`; locking Akıncı Baskını and Zil Çınlaması behind şan; Hızır Duası;
  the four people (Kethüda, Bayraktar, Talimci, Vakanüvis) and their lines; the starting company
  and starting ulti slots as a loadout; the dummy; the musicians; the name Mehterhane Konağı; the
  "Hemen yeniden sefere" shortcut. The upgrades make every later run easier, which the `DIFF` ramp
  was not tuned for. A Hades-style answer would be a heat system (the Pact of Punishment) once
  the upgrades are bought, and keepsakes for the loadout; neither is built.
- Decision 26's music: the makams, the voices, every phrase, the levels, the echo, and the
  chapter konak playing the konak's track.
- Decision 27's details: Cezbe as a pure elixir with no stat bonus, its ten pips and every gain;
  the card costs; a company card allowed twice in a deck; 32 beats for a company from a card; a
  company added to the core at each chapter konak instead of choosing ulti slots; Akıncı Baskını
  as a company of each kind; groups of one kind, the 4-beat warning and the gaps; the army limits
  20/24/28.
- Decision 28's reading: a terfi is still earned by loot and only waits for the wave's end (not
  one terfi every wave); the chapter konak's deck change lasts for that run only.
- One banner per breather, bringing two companies, and waves 1.5 times as large (decision 16
  only asked for soldiers on pick and a little longer waves).

## Open questions

- Which parts of `FestivalGame/Docs/Design/GameLoop.md` and `EnemyPlan.md` the prototype replaces, now that it
  is the base for the Unity game (decision 9):
  - the fervor tiers, upkeep, crowding, casualty toll and bank;
  - boon stacks;
  - the military school;
  - the four scripted patterns.
- How strong the konak's upgrades may be. Decision 25 answered "meta progression or a full
  reset" with Claude's upgrades; whether the game should get harder again as they add up is open.
- Army size: the prototype allows 30, against the Unity build's 4 slots.
- Balance past wave 4 has only been bot-tested.

## Where the numbers live

Every tuning value is at the top of the script in `mehter-seferi.html` (prototype 2 has its own
`T`, `SOLDIER`, `ENEMY`, `RAID`, `ULTIS` and `waveDef` in `mehter-seferi-v2.html`):

| Table | Holds |
|---|---|
| `T` | Windows, Cezbe gains and losses, soldier pace, aura, hearts |
| `LV` | Cezbe level effects |
| `BUFFS` | Combos |
| `SOLDIER` · `COUNTER` · `ENEMY` | Units |
| `waveDef` · `waveBpm` | The run |
| `CARDS` | Promotions |

Prototype 3's konak keeps its own: `SAN` (what a run pays), `UPGRADES` (the Kethüda's book),
`HUB` and `SPOTS` (the courtyard's layout and its people).

## Testing it without a person

To look at the konak by hand in the desktop app's browser pane, `python tools/playtest/debugpage.py`
writes `tools/playtest/out/hubdbg.html`: the page with frames on a timer, so it keeps running while
the pane is hidden, and a `window.__dbg` handle (`enterHub`, `openPanel`, `panelAct`, `start`,
`hurtLeader`, `meta`, `G`, ...). Serve the folder and open it from `out/`.

The page runs off `requestAnimationFrame`, which stops while the desktop app's browser pane is
hidden, and synthetic key events carry an empty `code` (the page falls back to `key`). What
worked:

1. Serve the folder over `http://localhost` with a temporary `.claude/launch.json` entry and
   the `preview_start` tool.
2. In a **local copy only**, expose a debug handle (`window.__dbg` with `G`, `frame`, `beats`,
   `isCallBeat`, `startBreather`, `startWave`).
3. Wrap `AudioContext` to capture the context, and stub `requestAnimationFrame`.
4. Drive `frame()` from a `MessageChannel` loop, pressing keys when the heard time reaches a
   call beat in `beats`.

Never ship the debug handle.

A faster route, used for prototype 2: headless Chrome with virtual time. It needs no server
and plays a whole run in about two minutes.

1. In a **local copy only**:
   - Replace `AudioContext` with a fake whose `currentTime` and `getOutputTimestamp()` read
     `performance.now()`.
   - Make `requestAnimationFrame` a `setTimeout`.
   - Expose `window.__dbg`.
2. Add a bot script before the **last** `</body>`. The first one sits in the header comment.
   The bot presses `drum()` on each call beat and writes its log to `document.title`.
3. Run `chrome --headless=new --virtual-time-budget=2000000 --dump-dom <file>` and read the
   `<title>` from the output.

`tools/playtest` holds this route ready to run (from Git Bash):

    python tools/playtest/build.py              # writes tools/playtest/out/test.html (v4; pass v3 for prototype 3)
    tools/playtest/many.sh r1 mid 8             # 8 runs of the mid bot in parallel
    python tools/playtest/sum.py r1 mid         # hearts lost and deaths per wave

The bots are `vur`, `mid` and `good` (see `bot.js`), and for prototype 4 `rand`: the good bot
with its cards chosen at random, to measure what the choice of card is worth.
`debugpage.py` also takes `v3` or `v4` (default v4). A run takes a few seconds, because the
test copy skips drawing. The debug handle only lives in `out/`, which git ignores.

Headless `--screenshot` does not capture the canvas. Look at the game through the browser pane
instead.
