# Value Sort

A guided values clarification exercise. It narrows a deck of **62 values** down to
the ten that genuinely drive you.

Everything runs in the browser. No build step, no framework, no dependencies, no
backend, no analytics, no network calls of any kind.

**[Try it](https://prismo1020.github.io/value-sort/)**

---

## How the exercise works

| Stage | What happens | Gate |
| --- | --- | --- |
| **1. Sort** | Every value in a shuffled deck goes into one of three piles: *This is me*, *Meh*, *Not me*. | At least 10 keepers to continue |
| **2. Filter** | The keepers come back one at a time. Mark the ones you would genuinely miss if they were absent. | none |
| **3. Choose** | Narrow the survivors to exactly ten. | Exactly 10 |
| **Results** | Your ten values, plus a breakdown of the themes they cluster into, and export options. | none |

Stage 3 is skipped automatically when exactly ten values survive the filter,
since there is nothing left to decide.

The final ten are **not ranked**. They are shown alphabetically so that no order
of importance is implied.

### Why two rounds before choosing

Round 1 asks what you *identify with*, which is easy to over-claim. Round 2 asks
what you would *miss*, which is a much harder test and does most of the real
narrowing. Running them in that order keeps the first pass fast and honest.

---

## Running it

It is a static site, so any file server works:

```bash
npx serve .
```

Then open the printed URL. A plain `file://` open will **not** work, because the
app uses ES modules, which browsers block over the file protocol.

### Deploying

Push to GitHub and enable Pages on the default branch, root folder. There is
nothing to build. `.nojekyll` is included so paths starting with an underscore
would be served correctly if any are added later.

---

## What is different from the version this replaces

This is a rewrite of an earlier React/Next.js prototype. The exercise design is
kept; the implementation and the rough edges are not.

**Progress is no longer lost**
- The original held everything in React state and dropped it on refresh. This one
  autosaves to `localStorage` after every card and offers to resume.
- **Undo** in both card rounds. Previously a single misclick was unrecoverable
  dozens of cards deep.

**The failure path no longer punishes you**
- The original fired a native `alert()` when you finished round 1 with fewer than
  ten keepers, then threw away every answer and restarted with a fresh shuffle.
- Now you get a recovery screen listing what you set aside, and you promote a few
  to reach ten. Redoing the round is still offered, but it is a choice.

**Faster to get through**
- Keyboard shortcuts throughout: arrow keys or `1`/`2`/`3` to sort, `Backspace`
  to undo.
- Card animations shortened and made interruption-safe.

**The results say more**
- Every value carries a theme (Character, Growth, Relationships, and so on). The
  original loaded that field and never used it. The results screen now shows how
  your top ten cluster, and that breakdown is included in both exports.
- Export as Markdown to the clipboard, as JSON, or via a proper print stylesheet.

**Correctness and accessibility**
- The shuffle uses Fisher-Yates. The original used `sort(() => Math.random() - 0.5)`,
  which is measurably biased.
- Semantic buttons, ARIA live regions, visible focus rings, `prefers-reduced-motion`,
  and a skip link.
- Light and dark themes that follow the system by default.
- Fixed two string-concatenation bugs that rendered as `12in "This is Me" pile`
  and `10/10selected`.

**A tighter deck**
- The original deck ran to 86 cards, many of which were the same idea worded
  twice: *Acceptance* next to *Self-Acceptance*, *Loved* next to *Loving*,
  *Health* next to *Fitness*, *Authority* next to *Power*. Sorting near-synonyms
  is fatigue, not insight.
- The deck is now **62**. Twenty-four cards were folded into the card they
  duplicated, and every merged entry records what it absorbed in its `merged`
  field, so nothing was silently dropped. A few labels were also clarified
  (*Industry* became *Hard Work*, *Virtue* became *Integrity*).

**Smaller**
- Roughly 600 KB of JavaScript across ten chunks became three files and no
  dependencies.

---

## Project layout

```
index.html              markup for all six screens
assets/css/styles.css   theming, layout, print styles
assets/js/values.js     the 62-value deck
assets/js/app.js        state machine, persistence, rendering
```

### Editing the deck

`assets/js/values.js` is a plain array. Add, remove, or reword entries freely,
since nothing is hard-coded to a fixed count. Keep `TARGET` in `app.js` below the
size of the smallest pile you expect anyone to finish round 1 with.

---

## Privacy

Nothing leaves the device. The only storage is two `localStorage` keys, one for
in-progress answers and one for the theme preference, both cleared by *Start over*.

## License

MIT. See [LICENSE](LICENSE).
