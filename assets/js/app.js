/**
 * Value Sort
 * -----------------------------------------------------------------------------
 * A four-stage exercise that narrows 62 values down to a top ten.
 *
 *   intro -> sort (round 1) -> [rescue] -> filter (round 2) -> [select] -> results
 *
 * Bracketed stages are conditional. Everything runs client-side; the only
 * persistence is a single localStorage key holding value *names*, rehydrated
 * against the deck on load so the saved blob stays small and version-tolerant.
 *
 * The final ten carry no ranking. They are presented alphabetically so no
 * order of importance is implied.
 */

import { VALUES, BY_NAME } from "./values.js";

const TARGET = 10;
const STORE_KEY = "value-sort:v1";
const THEME_KEY = "value-sort:theme";

/* ============================== small helpers ============================= */

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** Fisher-Yates. The original used `sort(() => Math.random() - 0.5)`, which is biased. */
function shuffle(list) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const names = (list) => list.map((v) => v.name);
const hydrate = (list) => (list || []).map((n) => BY_NAME[n]).filter(Boolean);

/** The finished ten, alphabetical, since nothing here is ranked. */
const finalTen = () =>
  state.selected.slice().sort((a, b) => a.name.localeCompare(b.name));

/* ================================= state ================================= */

const blankState = () => ({
  screen: "intro",
  name: "",
  deck: [],
  idx: 0,
  me: [],
  meh: [],
  notMe: [],
  history: [],
  filterDeck: [],
  filterIdx: 0,
  frustrating: [],
  less: [],
  filterHistory: [],
  pool: [],
  selected: [],
});

let state = blankState();

/* =============================== persistence ============================== */

function save() {
  if (state.screen === "intro") return;
  try {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({
        screen: state.screen,
        name: state.name,
        deck: names(state.deck),
        idx: state.idx,
        me: names(state.me),
        meh: names(state.meh),
        notMe: names(state.notMe),
        filterDeck: names(state.filterDeck),
        filterIdx: state.filterIdx,
        frustrating: names(state.frustrating),
        less: names(state.less),
        pool: names(state.pool),
        selected: names(state.selected),
        savedAt: Date.now(),
      })
    );
  } catch {
    /* private mode or a full quota: the exercise still works, just not resumable */
  }
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || typeof d.screen !== "string" || d.screen === "intro") return null;
    return {
      ...blankState(),
      screen: d.screen,
      name: typeof d.name === "string" ? d.name : "",
      deck: hydrate(d.deck),
      idx: Number(d.idx) || 0,
      me: hydrate(d.me),
      meh: hydrate(d.meh),
      notMe: hydrate(d.notMe),
      filterDeck: hydrate(d.filterDeck),
      filterIdx: Number(d.filterIdx) || 0,
      frustrating: hydrate(d.frustrating),
      less: hydrate(d.less),
      pool: hydrate(d.pool),
      selected: hydrate(d.selected),
      savedAt: d.savedAt,
    };
  } catch {
    return null;
  }
}

const clearSaved = () => {
  try {
    localStorage.removeItem(STORE_KEY);
  } catch {
    /* nothing to clean up */
  }
};

/* ================================ chrome ================================= */

const SCREENS = ["intro", "sort", "rescue", "filter", "select", "results"];

const STEPS = [
  { key: "sort", label: "Sort" },
  { key: "filter", label: "Filter" },
  { key: "select", label: "Choose" },
];
const STEP_ORDER = { sort: 0, rescue: 0, filter: 1, select: 2, results: 3 };

function buildStepper() {
  const list = $("stepperList");
  list.replaceChildren();
  for (const step of STEPS) {
    const li = el("li");
    li.dataset.key = step.key;
    const bar = el("span", "bar");
    bar.append(el("i"));
    li.append(bar, el("span", "lbl", step.label));
    list.append(li);
  }
}

/** `progress` is 0..1 within the active step. */
function paintStepper(progress) {
  const active = STEP_ORDER[state.screen];
  const show = state.screen !== "intro";
  $("stepper").hidden = !show;
  $("restartBtn").hidden = !show;
  if (!show) return;

  [...$("stepperList").children].forEach((li, i) => {
    const done = i < active;
    li.dataset.state = done ? "done" : i === active ? "current" : "todo";
    const fill = li.querySelector("i");
    fill.style.width = done ? "100%" : i === active ? `${Math.round((progress || 0) * 100)}%` : "0%";
  });
}

function show(screen, progress) {
  state.screen = screen;
  for (const s of SCREENS) $(`screen-${s}`).hidden = s !== screen;
  paintStepper(progress);
  window.scrollTo(0, 0);
  save();
}

let toastTimer;
function toast(message) {
  const node = $("toast");
  node.textContent = message;
  node.hidden = false;
  requestAnimationFrame(() => node.setAttribute("data-show", "true"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    node.removeAttribute("data-show");
    setTimeout(() => (node.hidden = true), 220);
  }, 2200);
}

/* ============================= round 1: sort ============================== */

function startSort() {
  state.deck = shuffle(VALUES);
  state.idx = 0;
  state.me = [];
  state.meh = [];
  state.notMe = [];
  state.history = [];
  renderSort();
  show("sort", 0);
}

function renderSort() {
  const total = state.deck.length;
  const value = state.deck[state.idx];
  if (!value) return finishSort();

  $("sortPos").textContent = String(state.idx + 1);
  $("sortTotal").textContent = String(total);
  $("sortRemaining").textContent = `${plural(total - state.idx, "value", "values")} left`;
  $("sortFill").style.width = `${(state.idx / total) * 100}%`;

  $("sortCat").textContent = value.category;
  $("sortName").textContent = value.name;
  $("sortDesc").textContent = value.description;

  const card = $("sortCard");
  card.removeAttribute("data-leaving");
  card.setAttribute("data-entering", "true");
  setTimeout(() => card.removeAttribute("data-entering"), 220);

  $("sortUndo").disabled = state.history.length === 0;
  $("sortTally").innerHTML =
    `<strong>${state.me.length}</strong> kept &middot; ` +
    `<strong>${state.meh.length}</strong> maybe &middot; ` +
    `<strong>${state.notMe.length}</strong> passed`;

  paintStepper(state.idx / total);
}

let sortBusy = false;
function choosePile(pile) {
  if (sortBusy || state.screen !== "sort") return;
  const value = state.deck[state.idx];
  if (!value) return;

  sortBusy = true;
  state[pile].push(value);
  state.history.push({ pile, name: value.name });
  state.idx += 1;

  const card = $("sortCard");
  card.setAttribute("data-leaving", pile);
  setTimeout(() => {
    sortBusy = false;
    if (state.idx >= state.deck.length) finishSort();
    else renderSort();
    save();
  }, 190);
}

function undoSort() {
  if (sortBusy || state.history.length === 0) return;
  const last = state.history.pop();
  const pile = state[last.pile];
  const at = pile.findIndex((v) => v.name === last.name);
  if (at > -1) pile.splice(at, 1);
  state.idx = Math.max(0, state.idx - 1);
  renderSort();
  save();
}

function finishSort() {
  if (state.me.length < TARGET) return openRescue();
  startFilter();
}

/* -------- shortfall rescue: promote set-aside values instead of redoing ---- */

function openRescue() {
  const short = TARGET - state.me.length;
  $("rescueSub").textContent =
    `You kept ${plural(state.me.length, "value", "values")}, and the next round needs at least ${TARGET}. ` +
    `Promote ${plural(short, "more value", "more values")} to continue.`;

  const list = $("rescueList");
  list.replaceChildren();

  const pool = [...state.meh, ...state.notMe];
  for (const value of pool) {
    list.append(
      pickRow(value, {
        pressed: () => state.me.some((v) => v.name === value.name),
        tag: state.meh.some((v) => v.name === value.name) ? "Maybe" : "Passed",
        onToggle: (on) => {
          if (on) state.me.push(value);
          else {
            const at = state.me.findIndex((v) => v.name === value.name);
            if (at > -1) state.me.splice(at, 1);
          }
          $("rescueContinue").disabled = state.me.length < TARGET;
          $("rescueSub").textContent =
            state.me.length >= TARGET
              ? `You now have ${plural(state.me.length, "value", "values")}. Ready when you are.`
              : `You kept ${plural(state.me.length, "value", "values")}, and the next round needs at least ${TARGET}. ` +
                `Promote ${plural(TARGET - state.me.length, "more value", "more values")} to continue.`;
          save();
        },
      })
    );
  }

  $("rescueContinue").disabled = state.me.length < TARGET;
  show("rescue", 1);
}

/* ============================ round 2: filter ============================= */

function startFilter() {
  state.filterDeck = shuffle(state.me);
  state.filterIdx = 0;
  state.frustrating = [];
  state.less = [];
  state.filterHistory = [];
  state.pool = [];
  state.selected = [];
  renderFilter();
  show("filter", 0);
}

function renderFilter() {
  const total = state.filterDeck.length;
  const value = state.filterDeck[state.filterIdx];
  if (!value) return finishFilter();

  $("filterPos").textContent = String(state.filterIdx + 1);
  $("filterTotal").textContent = String(total);
  $("filterRemaining").textContent = `${plural(total - state.filterIdx, "value", "values")} left`;
  $("filterFill").style.width = `${(state.filterIdx / total) * 100}%`;

  $("filterCat").textContent = value.category;
  $("filterName").textContent = value.name;
  $("filterDesc").textContent = value.description;

  const card = $("filterCard");
  card.removeAttribute("data-leaving");
  card.setAttribute("data-entering", "true");
  setTimeout(() => card.removeAttribute("data-entering"), 220);

  $("filterUndo").disabled = state.filterHistory.length === 0;
  $("filterTally").innerHTML = `<strong>${state.frustrating.length}</strong> would be missed`;

  paintStepper(state.filterIdx / total);
}

let filterBusy = false;
function chooseFilter(bucket) {
  if (filterBusy || state.screen !== "filter") return;
  const value = state.filterDeck[state.filterIdx];
  if (!value) return;

  filterBusy = true;
  const key = bucket === "frustrating" ? "frustrating" : "less";
  state[key].push(value);
  state.filterHistory.push({ key, name: value.name });
  state.filterIdx += 1;

  const card = $("filterCard");
  card.setAttribute("data-leaving", bucket === "frustrating" ? "me" : "notMe");
  setTimeout(() => {
    filterBusy = false;
    if (state.filterIdx >= state.filterDeck.length) finishFilter();
    else renderFilter();
    save();
  }, 190);
}

function undoFilter() {
  if (filterBusy || state.filterHistory.length === 0) return;
  const last = state.filterHistory.pop();
  const bucket = state[last.key];
  const at = bucket.findIndex((v) => v.name === last.name);
  if (at > -1) bucket.splice(at, 1);
  state.filterIdx = Math.max(0, state.filterIdx - 1);
  renderFilter();
  save();
}

function finishFilter() {
  const n = state.frustrating.length;

  if (n === TARGET) {
    // Exactly ten survived the filter: the choosing round has nothing to decide.
    state.selected = state.frustrating.slice();
    return showResults();
  }

  if (n > TARGET) {
    state.pool = state.frustrating.slice();
    state.selected = [];
  } else {
    // Short of ten: keep the survivors checked and offer the rest as backfill.
    const missed = new Set(names(state.frustrating));
    state.pool = [...state.frustrating, ...state.less.filter((v) => !missed.has(v.name))];
    state.selected = state.frustrating.slice();
  }
  openSelect();
}

/* ============================ round 3: select ============================= */

/** Shared row used by both the rescue list and the selection list. */
function pickRow(value, { pressed, tag, onToggle, lockWhenFull }) {
  const btn = el("button", "pick");
  btn.type = "button";
  btn.setAttribute("aria-pressed", String(pressed()));

  const box = el("span", "box");
  box.textContent = "✓";

  const txt = el("span", "txt");
  txt.append(el("span", "nm", value.name), el("span", "ds", value.description));

  btn.append(box, txt);
  if (tag) btn.append(el("span", "tag", tag));

  btn.addEventListener("click", () => {
    const on = btn.getAttribute("aria-pressed") === "true";
    if (!on && lockWhenFull && lockWhenFull()) return;
    btn.setAttribute("aria-pressed", String(!on));
    onToggle(!on);
  });

  return btn;
}

function openSelect() {
  const list = $("selectList");
  list.replaceChildren();

  const isOn = (v) => state.selected.some((s) => s.name === v.name);
  const preChecked = state.selected.length > 0;

  for (const value of state.pool) {
    list.append(
      pickRow(value, {
        pressed: () => isOn(value),
        tag: preChecked && isOn(value) ? "Would miss" : null,
        lockWhenFull: () => state.selected.length >= TARGET,
        onToggle: (on) => {
          if (on) state.selected.push(value);
          else {
            const at = state.selected.findIndex((v) => v.name === value.name);
            if (at > -1) state.selected.splice(at, 1);
          }
          paintSelect();
          save();
        },
      })
    );
  }

  paintSelect();
  show("select", 0);
}

function paintSelect() {
  const n = state.selected.length;
  const short = TARGET - n;

  $("selectCount").textContent = String(n);
  $("selectContinue").disabled = n !== TARGET;

  $("selectEyebrow").textContent =
    n === TARGET ? "Round 3 · Ready" : "Round 3 · Choose your ten";
  $("selectTitle").textContent =
    n === 0
      ? "Narrow it to ten"
      : n === TARGET
        ? "That is your ten"
        : `${short} more to go`;
  $("selectSub").textContent =
    state.pool.length > TARGET && state.selected.length && short > 0
      ? "The values you said you would miss are already ticked. Add the rest from what is left."
      : n === TARGET
        ? "Change any pick by unticking it, or move on to your results."
        : "Tick exactly ten, the ones you would defend if pushed.";

  const pips = $("selectPips");
  pips.replaceChildren();
  for (let i = 0; i < TARGET; i++) {
    const pip = el("i");
    pip.dataset.on = i < n ? "1" : "0";
    pips.append(pip);
  }

  // Once ten are ticked, everything unticked stops responding.
  const full = n >= TARGET;
  for (const btn of $("selectList").children) {
    btn.disabled = full && btn.getAttribute("aria-pressed") !== "true";
  }

  paintStepper(n / TARGET);
}

/* ================================ results ================================ */

function showResults() {
  const who = state.name.trim();
  $("resultsSub").textContent = who
    ? `${who}, these are yours in no particular order.`
    : "In no particular order.";

  const list = $("resultsList");
  list.replaceChildren();
  for (const value of finalTen()) {
    const li = el("li");
    li.append(el("div", "rn", value.name), el("div", "rd", value.description));
    list.append(li);
  }

  renderBreakdown();
  show("results", 1);
}

/** Theme -> count, busiest first. Shared by the screen and both exports. */
function clusterCounts() {
  const counts = new Map();
  for (const v of finalTen()) counts.set(v.category, (counts.get(v.category) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function renderBreakdown() {
  const rows = clusterCounts();
  const max = rows.length ? rows[0][1] : 1;

  const host = $("breakdownBars");
  host.replaceChildren();
  for (const [cat, n] of rows) {
    const row = el("div", "bar-row");
    const track = el("div", "bar-track");
    const fill = el("div", "bar-fill");
    fill.style.width = `${(n / max) * 100}%`;
    track.append(fill);
    row.append(el("div", "bar-name", cat), track, el("div", "bar-n", String(n)));
    host.append(row);
  }
}

/* ------------------------------- exporting -------------------------------- */

function resultsMarkdown() {
  const who = state.name.trim();
  return [
    who ? `# Core values (${who})` : "# Core values",
    "",
    "| Value | What it means |",
    "| --- | --- |",
    ...finalTen().map((v) => `| ${v.name} | ${v.description} |`),
    "",
    "## Where your values cluster",
    "",
    "| Theme | Count |",
    "| --- | --- |",
    ...clusterCounts().map(([cat, n]) => `| ${cat} | ${n} |`),
    "",
    `_Completed ${new Date().toLocaleDateString()} with the Value Sort exercise._`,
  ].join("\n");
}

async function copyResults() {
  const text = resultsMarkdown();
  try {
    await navigator.clipboard.writeText(text);
    toast("Copied to clipboard");
  } catch {
    // Clipboard API needs a secure context; fall back to a hidden textarea.
    const ta = el("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    toast(ok ? "Copied to clipboard" : "Copy failed. Select the list and copy manually.");
  }
  $("exportStatus").textContent = "Results copied.";
}

function downloadResults() {
  const who = state.name.trim();
  const payload = {
    name: who || null,
    completedAt: new Date().toISOString(),
    note: "The ten values are unranked and listed alphabetically.",
    topTen: finalTen().map((v) => ({
      name: v.name,
      description: v.description,
      category: v.category,
    })),
    clusters: Object.fromEntries(clusterCounts()),
  };
  const slug = (who || "value-sort").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
  );
  const a = el("a");
  a.href = url;
  a.download = `${slug || "value-sort"}-core-values.json`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Downloaded");
}

/* ============================== theme toggle ============================== */

function applyTheme(mode) {
  document.documentElement.dataset.theme = mode;
  const dark =
    mode === "dark" ||
    (mode === "auto" && !window.matchMedia("(prefers-color-scheme: light)").matches);
  document.querySelector("[data-theme-icon]").textContent = dark ? "☼" : "☾";
  $("themeBtn").title = `Theme: ${mode}`;
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {
    /* theme preference is a nicety, not worth failing over */
  }
}

function cycleTheme() {
  const order = ["auto", "light", "dark"];
  const now = document.documentElement.dataset.theme || "auto";
  applyTheme(order[(order.indexOf(now) + 1) % order.length]);
}

/* ============================== restart flow ============================== */

function restart({ confirmFirst = true } = {}) {
  if (confirmFirst && state.screen !== "intro" && state.screen !== "results") {
    if (!window.confirm("Start over? Your current progress will be lost.")) return;
  }
  clearSaved();
  const keepName = state.name;
  state = blankState();
  state.name = keepName;
  $("nameInput").value = keepName;
  $("resumeCard").hidden = true;
  show("intro");
}

/* ============================ resume on load ============================= */

function offerResume() {
  const saved = loadSaved();
  if (!saved) return;

  const labels = {
    sort: "Round 1, the three-pile sort",
    rescue: "Round 1, choosing a few more keepers",
    filter: "Round 2, the emotional filter",
    select: "Round 3, choosing your ten",
    results: "your results",
  };
  const when = saved.savedAt ? new Date(saved.savedAt).toLocaleString() : null;
  $("resumeDetail").textContent =
    `You stopped at ${labels[saved.screen] || "an earlier step"}` + (when ? ` on ${when}.` : ".");
  $("resumeCard").hidden = false;

  $("resumeBtn").onclick = () => {
    const { savedAt, ...rest } = saved;
    state = rest;
    $("nameInput").value = state.name;
    $("resumeCard").hidden = true;

    switch (state.screen) {
      case "sort":
        renderSort();
        show("sort", state.idx / Math.max(1, state.deck.length));
        break;
      case "rescue":
        openRescue();
        break;
      case "filter":
        renderFilter();
        show("filter", state.filterIdx / Math.max(1, state.filterDeck.length));
        break;
      case "select":
        openSelect();
        break;
      case "results":
        showResults();
        break;
      default:
        restart({ confirmFirst: false });
    }
  };

  $("discardBtn").onclick = () => {
    clearSaved();
    $("resumeCard").hidden = true;
  };
}

/* ================================= wiring ================================ */

function init() {
  buildStepper();

  let theme = "auto";
  try {
    theme = localStorage.getItem(THEME_KEY) || "auto";
  } catch {
    /* fall back to auto */
  }
  applyTheme(theme);
  $("themeBtn").addEventListener("click", cycleTheme);

  $("startForm").addEventListener("submit", (e) => {
    e.preventDefault();
    state.name = $("nameInput").value.trim();
    clearSaved();
    startSort();
  });

  for (const btn of document.querySelectorAll("[data-pile]")) {
    btn.addEventListener("click", () => choosePile(btn.dataset.pile));
  }
  $("sortUndo").addEventListener("click", undoSort);

  for (const btn of document.querySelectorAll("[data-filter]")) {
    btn.addEventListener("click", () => chooseFilter(btn.dataset.filter));
  }
  $("filterUndo").addEventListener("click", undoFilter);

  $("rescueContinue").addEventListener("click", () => {
    if (state.me.length >= TARGET) startFilter();
  });
  $("rescueRedo").addEventListener("click", () => startSort());

  $("selectBack").addEventListener("click", () => {
    if (window.confirm("Go back to round 2? Your emotional filter answers will be redone.")) {
      startFilter();
    }
  });
  $("selectContinue").addEventListener("click", () => {
    if (state.selected.length === TARGET) showResults();
  });

  $("copyBtn").addEventListener("click", copyResults);
  $("downloadBtn").addEventListener("click", downloadResults);
  $("printBtn").addEventListener("click", () => window.print());
  $("againBtn").addEventListener("click", () => restart({ confirmFirst: false }));
  $("restartBtn").addEventListener("click", () => restart());

  // Keyboard shortcuts for the two card rounds.
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (state.screen === "sort") {
      if (e.key === "ArrowRight" || e.key === "1") { e.preventDefault(); choosePile("me"); }
      else if (e.key === "ArrowDown" || e.key === "2") { e.preventDefault(); choosePile("meh"); }
      else if (e.key === "ArrowLeft" || e.key === "3") { e.preventDefault(); choosePile("notMe"); }
      else if (e.key === "Backspace" || e.key === "u") { e.preventDefault(); undoSort(); }
    } else if (state.screen === "filter") {
      if (e.key === "ArrowRight" || e.key === "1") { e.preventDefault(); chooseFilter("frustrating"); }
      else if (e.key === "ArrowLeft" || e.key === "2") { e.preventDefault(); chooseFilter("less"); }
      else if (e.key === "Backspace" || e.key === "u") { e.preventDefault(); undoFilter(); }
    }
  });

  offerResume();
  show("intro");
}

init();
