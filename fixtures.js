async function testFixture(fixture, runId) {
  updateUI("Tester lampe", "#111");

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
  if (fixture.channels.pan && fixture.channels.tilt) {
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

      frame[fixture.address + fixture.channels.pan  - 1] = pos.pan;
      frame[fixture.address + fixture.channels.tilt - 1] = pos.tilt;

      updateUI(`MOVE ${pos.name}`, "#e5e7eb");
      sendFrame(frame);

      const ok = await sleep(2000, runId);
      if (!ok) return;
    }
  }

  updateUI("Pause", "#111");
  await sleep(2000, runId);
}