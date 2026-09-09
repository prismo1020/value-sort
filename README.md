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

## What is different from the original

See [CHANGELOG.md](CHANGELOG.md).

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
