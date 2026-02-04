/* =========================
   MakeLight – Check Flow
   ========================= */

const UNIVERSE_SIZE = 512;
const ESP_DMX_URL = "http://192.168.4.1/dmx";

/* ---------- STATE ---------- */

let fixtureIndex = 0;
let runId = 0;
let badFixtures = new Set();

/* ---------- COLOR MAP ---------- */

const COLOR_MAP = {
  red:   { css: "#ef4444", label: "RED" },
  green: { css: "#22c55e", label: "GREEN" },
  blue:  { css: "#3b82f6", label: "BLUE" },
  white: { css: "#e5e7eb", label: "WHITE" },
  amber: { css: "#f59e0b", label: "AMBER" },
  uv:    { css: "#a855f7", label: "UV" }
};

/* ---------- DMX HELPERS ---------- */

function emptyFrame() {
  return new Uint8Array(UNIVERSE_SIZE);
}

function sendFrame(frame) {
  fetch(ESP_DMX_URL, {
    method: "POST",
    body: frame
  }).catch(() => {});
}

/* ---------- UI ---------- */

function channelRange(fixture) {
  const maxChannel = Math.max(...Object.values(fixture.channels));
  const start = fixture.address;
  const end = fixture.address + maxChannel - 1;
  return `${start}–${end}`;
}

function updateUI({ status, color }) {
  const fixture = fixtures[fixtureIndex];

  document.body.style.background = color || "#020617";

  document.getElementById("fixtureName").innerText =
    fixture.name;

  document.getElementById("fixtureMeta").innerText =
    `${fixture.type} · DMX ${fixture.address} (${channelRange(fixture)})`;

  document.getElementById("status").innerText = status;

  document.getElementById("flagBtn").innerText =
    badFixtures.has(fixture.id)
      ? "⚠️ Marker fjernet"
      : "⚠️ Marker reagerede forkert";
}

/* ---------- INTERRUPTIBLE DELAY ---------- */

function wait(ms, localRunId) {
  return new Promise(resolve => {
    const start = Date.now();
    function tick() {
      if (localRunId !== runId) return resolve(false);
      if (Date.now() - start >= ms) return resolve(true);
      requestAnimationFrame(tick);
    }
    tick();
  });
}

/* ---------- TEST LOGIC ---------- */

async function testFixture(fixture, localRunId) {

  const dimmer =
    fixture.channels.master ??
    fixture.channels.dimmer ??
    null;

  /* ---- FARVER ---- */

  for (const key of Object.keys(COLOR_MAP)) {
    if (!(key in fixture.channels)) continue;

    const frame = emptyFrame();

    if (dimmer) {
      frame[fixture.address + dimmer - 1] = 255;
    }

    frame[fixture.address + fixture.channels[key] - 1] = 255;

    updateUI({
      status: `Tester ${COLOR_MAP[key].label}`,
      color: COLOR_MAP[key].css
    });

    sendFrame(frame);

    const ok = await wait(1000, localRunId);
    if (!ok) return;
  }

  /* ---- MOVING HEAD BEVÆGELSE ---- */

  if (
    fixture.type.startsWith("moving_head") &&
    fixture.channels.pan &&
    fixture.channels.tilt
  ) {
    const positions = [
      { name: "VENSTRE", pan: 0,   tilt: 127 },
      { name: "HØJRE",   pan: 255, tilt: 127 },
      { name: "MIDT",    pan: 127, tilt: 127 }
    ];

    for (const pos of positions) {
      const frame = emptyFrame();

      if (dimmer) {
        frame[fixture.address + dimmer - 1] = 255;
      }

      if (fixture.channels.white) {
        frame[fixture.address + fixture.channels.white - 1] = 255;
      }

      frame[fixture.address + fixture.channels.pan  - 1] = pos.pan;
      frame[fixture.address + fixture.channels.tilt - 1] = pos.tilt;

      updateUI({
        status: `MOVE ${pos.name}`,
        color: "#0f172a"
      });

      sendFrame(frame);

      const ok = await wait(2000, localRunId);
      if (!ok) return;
    }
  }

  updateUI({ status: "Pause", color: "#020617" });
  await wait(1200, localRunId);
}

/* ---------- CONTROLS ---------- */

function startCheck() {
  runId++;

  const fixture = fixtures[fixtureIndex];
  const localRunId = runId;

  testFixture(fixture, localRunId);

  fixtureIndex = (fixtureIndex + 1) % fixtures.length;
}

function toggleFlag() {
  const fixture = fixtures[fixtureIndex];

  if (badFixtures.has(fixture.id)) {
    badFixtures.delete(fixture.id);
  } else {
    badFixtures.add(fixture.id);
  }

  updateUI({ status: "Marker opdateret", color: "#111827" });
}

/* ---------- INIT ---------- */

document.getElementById("nextBtn").onclick = startCheck;
document.getElementById("flagBtn").onclick = toggleFlag;

updateUI({ status: "Klar", color: "#020617" });