let fixtureIndex = 0;
let checking = false;

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

  status.innerText = text;
  status.style.background = color || "#111";
  name.innerText = currentFixture?.name || "";
}

function sendFrame(frame) {
  fetch("http://192.168.1.194/dmx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ frame })
  }).catch(() => {});
}

async function testFixture(fixture) {
  updateUI("Tester lampe", "#111");

  for (const color in fixture.channels) {
    if (!COLOR_MAP[color]) continue;

    let frame = {};

    // nulstil alle kanaler på lampen
    for (const ch in fixture.channels) {
      frame[fixture.address + fixture.channels[ch] - 1] = 0;
    }

    // master dimmer hvis den findes
    if (fixture.channels.master) {
      frame[fixture.address + fixture.channels.master - 1] = 255;
    }

    // aktiv farve
    frame[fixture.address + fixture.channels[color] - 1] = 255;

    updateUI(`Tester ${color.toUpperCase()}`, COLOR_MAP[color].css);
    sendFrame(frame);

    await sleep(1000);
  }

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
