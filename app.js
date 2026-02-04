let fixtureIndex = 0;
let checking = false;
let currentFixture = null;

const COLOR_MAP = {
  red:    { css: "red" },
  green:  { css: "green" },
  blue:   { css: "blue" },
  white:  { css: "#e5e7eb" },
  amber:  { css: "orange" },
  uv:     { css: "purple" }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateUI(text, color) {
  const status = document.getElementById("status");
  const name = document.getElementById("fixtureName");
  const dmxInfo = document.getElementById("dmxInfo");

  status.innerText = text;
  status.style.background = color || "#111";

  if (currentFixture) {
    name.innerText = currentFixture.name || "";
    dmxInfo.innerText = `DMX start: ${currentFixture.address}`;
  } else {
    name.innerText = "";
    dmxInfo.innerText = "";
  }
}

function sendFrame(frame) {
  fetch("http://192.168.4.1/dmx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ frame })
  }).catch(() => {});
}

// Nulstil ALLE kanaler på fixture
function resetFixture(fixture) {
  let frame = {};
  for (const ch in fixture.channels) {
    frame[fixture.address + fixture.channels[ch] - 1] = 0;
  }
  return frame;
}

// Bevægelsestest for moving heads
async function testMovement(fixture) {
  if (!fixture.channels.pan || !fixture.channels.tilt) return;

  const panCh  = fixture.address + fixture.channels.pan  - 1;
  const tiltCh = fixture.address + fixture.channels.tilt - 1;

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

    if (fixture.channels.white) {
      frame[fixture.address + fixture.channels.white - 1] = 255;
    }

    frame[panCh]  = pos.pan;
    frame[tiltCh] = pos.tilt;

    updateUI(`MOVE ${pos.name}`, "#e5e7eb");
    sendFrame(frame);

    await sleep(2000);
  }
}

// Hoved test-flow for én lampe
async function testFixture(fixture) {
  updateUI("Tester lampe", "#111");

  // Farvetest
  for (const color in fixture.channels) {
    if (!COLOR_MAP[color]) continue;

    let frame = resetFixture(fixture);

    if (fixture.channels.master) {
      frame[fixture.address + fixture.channels.master - 1] = 255;
    }

    frame[fixture.address + fixture.channels[color] - 1] = 255;

    updateUI(`Tester ${color.toUpperCase()}`, COLOR_MAP[color].css);
    sendFrame(frame);

    await sleep(1000);
  }

  // Bevægelse (kun hvis relevant)
  await testMovement(fixture);

  updateUI("Pause", "#111");
  await sleep(2000);
}

async function startCheck() {
  if (checking) return;
  checking = true;

  currentFixture = fixtures[fixtureIndex];
  await testFixture(currentFixture);

  fixtureIndex = (fixtureIndex + 1) % fixtures.length;
  checking = false;
}