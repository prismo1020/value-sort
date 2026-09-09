# Value Sort

A values clarification exercise. It narrows a deck of 62 values down to the ten
that genuinely drive you, in three rounds: sort every card into keep, maybe, or
no; mark the keepers you would actually miss if they were gone; then narrow what
survives to exactly ten. The final ten are not ranked, and are listed
alphabetically so no order of importance is implied.

Everything runs in the browser. No build step, no framework, no dependencies, no
backend, and no network calls of any kind. Progress saves to your own device and
nothing is ever uploaded.

**[Try it](https://prismo1020.github.io/value-sort/)**

- **Run it locally:** `npx serve .`, then open the printed URL. A plain `file://`
  open will not work, because the app uses ES modules.
- **Deploy it:** push to GitHub and enable Pages on the default branch, root
  folder. There is nothing to build.
- **Edit the deck:** `assets/js/values.js` is a plain array, and nothing is
  hard-coded to a fixed count.
- **What changed from the original:** see [CHANGELOG.md](CHANGELOG.md).
- **License:** MIT, see [LICENSE](LICENSE).
