export function generateShow(song) {
  const title = song.title?.toLowerCase() || "";

  let structure = ["intro", "verse", "chorus", "verse", "chorus", "outro"];
  let palette = ["amber", "green", "pink"];

  if (title.includes("human")) {
    structure = ["intro", "verse", "chorus", "verse", "chorus", "big_final"];
    palette = ["amber", "green", "white"];
  }

  const scenes = structure.map((part, index) => {
    const isChorus = part.includes("chorus") || part.includes("final");

    return {
      name: part,
      frontLights: { static: true },
      backLights: {
        color: palette[index % palette.length],
        intensity: isChorus ? 0.9 : 0.5,
        fade: 2000
      },
      movingHeads: {
        active: isChorus,
        movement: isChorus ? "slow_wide" : "none"
      }
    };
  });

  return scenes;
}
