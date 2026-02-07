let show = [];
let currentIndex = 0;

export function loadShow(newShow) {
  show = newShow;
  currentIndex = 0;
}

export function nextScene() {
  if (currentIndex < show.length - 1) {
    currentIndex++;
  }

  activateScene(show[currentIndex]);
}

export function previousScene() {
  if (currentIndex > 0) {
    currentIndex--;
  }

  activateScene(show[currentIndex]);
}

export function getCurrentScene() {
  return show[currentIndex];
}

function activateScene(scene) {
  console.log("🎬 Scene:", scene.name);
}
