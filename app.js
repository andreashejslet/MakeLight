/* =========================
   MakeLight – Fixture Tester
   ========================= */

const universeSize = 512;

/* ---------- STATE ---------- */

let fixtureIndex = 0;
let currentRunId = 0;
let badFixtures = new Set();

/* ---------- FIXTURES ---------- */

const fixtures = [
  {
    name: "Front PAR L",
    type: "PAR",
    address: 1,
    channels: {
      master: 1,
      red: 2,
      green: 3,
      blue: 4,
      white: 5
    }
  },
  {
    name: "Front PAR R",
    type: "PAR",
    address: 9,
    channels: {
      master: 1,
      red: 2,
      green: 3,
      blue: 4,
      white: 5
    }
  },
  {
    name: "Moving Head 1",
    type: "Moving Head",
    address: 65,
    channels: {
      pan: 1,
      tilt: 2,
      master: 3,
      red: 4,
      green: 5,
      blue: 6,
      white: 7
    }
  }
];

/* ---------- COLOR MAP ---------- */

const COLOR_MAP = {
  red:   { css: "#ef4444" },
  green: { css: "#22c55e" },
  blue:  { css: "#3b82f6" },
  white: { css: "#e5e7eb" }
};

/* ---------- DMX ---------- */

function resetUniverse() {
  return new Uint8Array(universeSize);
}

function resetFixture(fixture) {
  const frame = resetUniverse();
  return frame;
}

function sendFrame(frame) {
  fetch("/dmx", {
    method: "POST",
    body: frame
  }).catch(() => {});
}

/* ---------- UI ---------- */

function channelRange(fixture) {
  const channelCount = Math.max(...Object.values(fixture.channels));
  const start = fixture.address;
  const end = fixture.address + channelCount - 1;
  return `${start}–${end}`;
}

function updateUI(statusText, bgColor) {
  const fixture = fixtures[fixtureIndex];
  const range = channelRange(fixture);

  document.body.style.background = bgColor;

  document.getElementById("fixtureName").innerText =
    `${fixture.name}`;

  document.getElementById("fixtureMeta").innerText =
    `${fixture.type} · DMX ${fixture.address} (${range})`;

  document.getElementById("status").innerText = statusText;

  document.getElementById("flagBtn").innerText =
    badFixtures.has(fixture.name)
      ? "⚠️ Marker fjernet"
      : "⚠️ Marker reagerede forkert";
}

/* ---------- INTERRUPTIBLE SLEEP ---------- */

function sleep(ms, runId) {
  return new Promise(resolve => {
    const start = Date.now();
    function check() {
      if (runId !== currentRunId) return resolve(false);
      if (Date.now() - start >= ms) return resolve(true);
      requestAnimationFrame(check);
    }
    check();
  });
}

/* ---------- TEST LOGIC ---------- */

async function testFixture(fixture, runId) {

  // FARVER
  for (const color in fixture.channels) {
    if (!COLOR_MAP[color]) continue;

    let frame = resetFixture(fixture);

    if (fixture.channels.master) {
      frame[fixture.address + fixture.channels.master - 1] = 255;
    }

    frame[fixture.address + fixture.channels[color] - 1] = 255;

    updateUI(`Tester ${color.toUpperCase()}`, COLOR_MAP[color].css);
    sendFrame(frame);

    const ok = await sleep(1000, runId);
    if (!ok) return;
  }

  // BEVÆGELSE
  if (fixture.type === "Moving Head" &&
      fixture.channels.pan &&
      fixture.channels.tilt) {

    const positions = [
      { name: "VENSTRE", pan: 0,   tilt: 127 },
      { name: "HØJRE",   pan: 255, tilt: 127 },
      { name: "MIDT",    pan: 127, tilt: 127 }
    ];

    for (const pos of positions) {
      let frame = resetFixture(fixture);

      if (fixture.channels.master) {
        frame[fixture.address + fixture.channels.master - 1] = 255;
      }

      frame[fixture.address + fixture.channels.white - 1] = 255;
      frame[fixture.address + fixture.channels.pan  - 1] = pos.pan;
      frame[fixture.address + fixture.channels.tilt - 1] = pos.tilt;

      updateUI(`MOVE ${pos.name}`, "#0f172a");
      sendFrame(frame);

      const ok = await sleep(2000, runId);
      if (!ok) return;
    }
  }

  updateUI("Pause", "#020617");
  await sleep(1500, runId);
}

/* ---------- CONTROLS ---------- */

function startCheck() {
  currentRunId++;

  const fixture = fixtures[fixtureIndex];
  const runId = currentRunId;

  testFixture(fixture, runId);

  fixtureIndex = (fixtureIndex + 1) % fixtures.length;
}

function toggleFlag() {
  const name = fixtures[fixtureIndex].name;

  if (badFixtures.has(name)) {
    badFixtures.delete(name);
  } else {
    badFixtures.add(name);
  }

  updateUI("Marker opdateret", "#111827");
}

/* ---------- INIT ---------- */

document.getElementById("nextBtn").onclick = startCheck;
document.getElementById("flagBtn").onclick = toggleFlag;

updateUI("Klar", "#020617");