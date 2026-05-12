const pet = document.getElementById("pet");
const quitButton = document.getElementById("quitButton");
const thoughtBubble = document.getElementById("thoughtBubble");
const sleepBubble = document.getElementById("sleepBubble");
const foodBowl = document.getElementById("foodBowl");

const CELL_W = 192;
const CELL_H = 208;

const sheets = {
  base: {
    image: "./assets/spritesheet.webp",
    cols: 8,
    rows: 9
  },
  life: {
    image: "./assets/life-spritesheet.webp",
    cols: 16,
    rows: 4
  }
};

const animations = {
  idle: { sheet: "base", row: 0, frames: 6, ms: 1500 },
  "running-right": { sheet: "base", row: 1, frames: 8, ms: 1250 },
  "running-left": { sheet: "base", row: 2, frames: 8, ms: 1250 },
  waving: { sheet: "base", row: 3, frames: 4, ms: 1350 },
  jumping: { sheet: "base", row: 4, frames: 5, ms: 1150 },
  failed: { sheet: "base", row: 5, frames: 8, ms: 1350 },
  waiting: { sheet: "base", row: 6, frames: 6, ms: 1700 },
  running: { sheet: "base", row: 7, frames: 6, ms: 1400 },
  review: { sheet: "base", row: 8, frames: 6, ms: 1500 },
  eating: { sheet: "life", row: 0, frames: 16, ms: 1450 },
  sleeping: { sheet: "life", row: 1, frames: 16, ms: 1900 },
  "slow-walk-right": { sheet: "life", row: 2, frames: 16, ms: 1500 },
  "slow-walk-left": { sheet: "life", row: 3, frames: 16, ms: 1500 }
};

let state = "idle";
let frame = 0;
let direction = 1;
let dragging = false;
let dragOffset = { x: 0, y: 0 };
let quitTimer;
let behaviorBusy = false;
let frameTimer;
let thoughtTimer;
let clickTimer;
let interactionToken = 0;
let dragMoved = false;
let pointerStart = { x: 0, y: 0 };

const thoughts = [
  "饭呢",
  "阳光不错",
  "先眯一下",
  "那边有动静",
  "这人还行",
  "尾巴在想事",
  "今天慢慢来",
  "刚才是梦吗",
  "要不要过去",
  "算了，躺着"
];

function setFrame(nextState, nextFrame) {
  state = nextState;
  const animation = animations[state];
  const sheet = sheets[animation.sheet];
  frame = nextFrame % animation.frames;
  const x = -frame * CELL_W;
  const y = -animation.row * CELL_H;
  pet.style.backgroundImage = `url("${sheet.image}")`;
  pet.style.backgroundSize = `${sheet.cols * CELL_W}px ${sheet.rows * CELL_H}px`;
  pet.style.backgroundPosition = `${x}px ${y}px`;
}

function scheduleNextFrame() {
  clearTimeout(frameTimer);
  const animation = animations[state];
  frameTimer = setTimeout(() => {
    setFrame(state, frame + 1);
    scheduleNextFrame();
  }, animation.ms);
}

function play(nextState) {
  setFrame(nextState, 0);
  scheduleNextFrame();
}

play("idle");

function stepFrame() {
  setFrame(state, frame + 1);
  scheduleNextFrame();
}

function rest(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chooseThought() {
  return thoughts[Math.floor(Math.random() * thoughts.length)];
}

function showThought() {
  thoughtBubble.textContent = chooseThought();
  thoughtBubble.classList.add("visible");
}

function clearProps() {
  clearTimeout(thoughtTimer);
  pet.classList.remove("eating", "sleeping");
  thoughtBubble.classList.remove("visible");
  sleepBubble.classList.remove("visible");
  foodBowl.classList.remove("visible");
}

function cancelCurrentBehavior() {
  interactionToken += 1;
  behaviorBusy = false;
}

function chooseQuietMood() {
  const options = ["idle", "waiting", "review"];
  return options[Math.floor(Math.random() * options.length)];
}

async function slowWalk() {
  if (dragging) return;

  const token = interactionToken;
  clearProps();
  direction = Math.random() > 0.5 ? 1 : -1;
  const steps = 7 + Math.floor(Math.random() * 9);
  const stepX = 4 + Math.random() * 4;
  play(direction > 0 ? "slow-walk-right" : "slow-walk-left");

  for (let i = 0; i < steps; i += 1) {
    if (dragging || token !== interactionToken) return;
    window.petWindow.moveBy(direction * stepX, Math.sin(i / 5) * 0.35);
    await rest(1150);
  }

  play("idle");
}

async function thinkForAWhile(duration = 52000 + Math.random() * 52000) {
  if (dragging) return;

  const token = interactionToken;
  clearProps();
  play(Math.random() > 0.5 ? "waiting" : "review");
  showThought();

  const startedAt = Date.now();
  while (!dragging && token === interactionToken && Date.now() - startedAt < duration) {
    await rest(8500 + Math.random() * 6500);
    if (!dragging && token === interactionToken) showThought();
  }

  if (token !== interactionToken) return;
  clearProps();
  if (!dragging) play("idle");
}

async function sleepForAWhile() {
  if (dragging) return;

  const token = interactionToken;
  clearProps();
  play("sleeping");
  await rest(90000 + Math.random() * 90000);
  if (token !== interactionToken) return;
  clearProps();
  if (!dragging) play("idle");
}

async function eatForAWhile() {
  if (dragging) return;

  const token = interactionToken;
  clearProps();
  play("eating");
  await rest(65000 + Math.random() * 45000);
  if (token !== interactionToken) return;
  clearProps();
  if (!dragging) play("idle");
}

async function quietForAWhile() {
  const token = interactionToken;
  clearProps();
  play(chooseQuietMood());
  await rest(70000 + Math.random() * 70000);
  if (token !== interactionToken) return;
}

async function behaviorLoop() {
  if (!dragging && !behaviorBusy) {
    behaviorBusy = true;
    const token = interactionToken;
    const roll = Math.random();
    if (roll < 0.14) {
      await slowWalk();
    } else if (roll < 0.28) {
      await thinkForAWhile();
    } else if (roll < 0.42) {
      await eatForAWhile();
    } else if (roll < 0.68) {
      await sleepForAWhile();
    } else {
      await quietForAWhile();
    }
    if (token === interactionToken) {
      behaviorBusy = false;
    }
  }

  setTimeout(behaviorLoop, 65000 + Math.random() * 55000);
}

behaviorLoop();

pet.addEventListener("pointerenter", () => {
  if (!dragging && !behaviorBusy) {
    clearProps();
    play("waving");
  }
});

pet.addEventListener("click", () => {
  clearTimeout(clickTimer);
  clickTimer = setTimeout(() => {
    if (!dragging && !dragMoved && !behaviorBusy) {
      clearProps();
      play("jumping");
    }
  }, 240);
});

pet.addEventListener("dblclick", async () => {
  clearTimeout(clickTimer);
  if (dragging || dragMoved) return;

  cancelCurrentBehavior();
  behaviorBusy = true;
  await thinkForAWhile(36000);
  behaviorBusy = false;
});

pet.addEventListener("pointerdown", (event) => {
  dragging = true;
  dragMoved = false;
  pointerStart = { x: event.screenX, y: event.screenY };
  clearProps();
  pet.classList.add("dragging");
  pet.setPointerCapture(event.pointerId);
  dragOffset = {
    x: event.screenX - window.screenX,
    y: event.screenY - window.screenY
  };
});

pet.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  if (Math.abs(event.screenX - pointerStart.x) > 3 || Math.abs(event.screenY - pointerStart.y) > 3) {
    dragMoved = true;
  }
  window.petWindow.dragTo(event.screenX - dragOffset.x, event.screenY - dragOffset.y);
});

pet.addEventListener("pointerup", (event) => {
  dragging = false;
  pet.classList.remove("dragging");
  pet.releasePointerCapture(event.pointerId);
  if (dragMoved) {
    play("idle");
  }
});

pet.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  quitButton.classList.add("visible");
  clearTimeout(quitTimer);
  quitTimer = setTimeout(() => {
    quitButton.classList.remove("visible");
  }, 3500);
});

quitButton.addEventListener("click", () => {
  window.petWindow.quit();
});
