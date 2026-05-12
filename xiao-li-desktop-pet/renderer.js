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
let behaviorTurn = 0;
let nudgeState = "";
let nudgeCount = 0;

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
  "算了，躺着",
  "窗外有风",
  "我听见了",
  "这个角度好",
  "爪子要收好",
  "先不理你",
  "可以摸一下",
  "只能摸一下",
  "肚子不行",
  "耳朵在工作",
  "胡须知道",
  "地板有温度",
  "太阳归我",
  "那块光不错",
  "慢慢巡视",
  "人类真忙",
  "你又来了",
  "在想鱼",
  "在想罐头",
  "碗怎么空了",
  "水要新鲜的",
  "今天适合睡",
  "梦里有台阶",
  "刚才踩空了",
  "不承认",
  "我很稳",
  "尾巴不同意",
  "脚脚有计划",
  "椅子是我的",
  "键盘也不错",
  "这里有你的味道",
  "我要占这里",
  "先压住",
  "别动，我看看",
  "那个声音可疑",
  "门后有什么",
  "柜子上面呢",
  "我能上去",
  "只是懒得上",
  "走两步吧",
  "算了明天",
  "现在不急",
  "保持神秘",
  "眼睛半开就够",
  "我没睡",
  "我在监听",
  "呼噜准备中",
  "下巴需要挠",
  "这里挠得对",
  "再往左一点",
  "人类学得慢",
  "还可以",
  "勉强满意",
  "我要巡逻",
  "领地正常",
  "桌角正常",
  "影子正常",
  "你不太正常",
  "今天很安全",
  "有一点饿",
  "有很多点饿",
  "饭碗在召唤",
  "我闻到了",
  "不是这个味",
  "要香一点",
  "鱼干在哪里",
  "罐头开了吗",
  "听见袋子了",
  "那是零食吗",
  "别骗猫",
  "我记得你",
  "你欠我一摸",
  "你欠我一饭",
  "我先记账",
  "账本在心里",
  "今天原谅你",
  "暂时原谅",
  "我有点忙",
  "忙着躺好",
  "姿势要讲究",
  "尾巴摆一下",
  "耳朵转一下",
  "假装没看见",
  "其实看见了",
  "不要太吵",
  "小声一点",
  "梦还没完",
  "再睡五分钟",
  "五分钟很长",
  "时间归猫管",
  "光斑在移动",
  "我要跟着光",
  "风里有消息",
  "空气变了",
  "今天有故事",
  "故事先不讲",
  "你猜不到",
  "我知道秘密",
  "秘密是饭",
  "看我干嘛",
  "我也看你",
  "我们扯平",
  "靠近一点",
  "别太靠近",
  "距离刚好",
  "我喜欢这里",
  "这里很安心",
  "你在就好"
];

const recentThoughts = [];
const RECENT_THOUGHT_LIMIT = 10;

const nudgeThoughts = {
  sleeping: [
    "别吵……睡觉呢",
    "叫我吗？好困……",
    "梦还没存档",
    "再等五分钟",
    "眼睛还没开机",
    "被窝信号很好",
    "我在梦里巡逻",
    "现在不接电话",
    "呼噜还没结束",
    "困意占上风"
  ],
  eating: [
    "等我吃完",
    "饭比你重要一点",
    "嘴里有事",
    "先不要打扰饭",
    "这口很关键",
    "碗正在汇报",
    "吃饭要专心",
    "马上，嚼完再说",
    "别抢我的碗",
    "我听见了，先吃"
  ]
};

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
  const candidates = thoughts.filter((thought) => !recentThoughts.includes(thought));
  const pool = candidates.length > 0 ? candidates : thoughts;
  const thought = pool[Math.floor(Math.random() * pool.length)];
  recentThoughts.push(thought);

  if (recentThoughts.length > RECENT_THOUGHT_LIMIT) {
    recentThoughts.shift();
  }

  return thought;
}

function chooseNudgeThought(activity, count) {
  const lines = nudgeThoughts[activity] || thoughts;
  return lines[(count - 1) % lines.length];
}

function showThought(text = chooseThought(), autoHideMs = 0) {
  clearTimeout(thoughtTimer);
  thoughtBubble.textContent = text;
  thoughtBubble.classList.add("visible");

  if (autoHideMs > 0) {
    thoughtTimer = setTimeout(() => {
      thoughtBubble.classList.remove("visible");
    }, autoHideMs);
  }
}

function clearProps() {
  clearTimeout(thoughtTimer);
  pet.classList.remove("eating", "sleeping", "walking");
  thoughtBubble.classList.remove("visible");
  sleepBubble.classList.remove("visible");
  foodBowl.classList.remove("visible");
}

function resetNudgeCount() {
  nudgeState = "";
  nudgeCount = 0;
}

function cancelCurrentBehavior() {
  interactionToken += 1;
  behaviorBusy = false;
  resetNudgeCount();
}

function currentInterruptibleActivity() {
  if (pet.classList.contains("sleeping")) return "sleeping";
  if (pet.classList.contains("eating")) return "eating";
  return "";
}

function chooseQuietMood() {
  const options = ["idle", "waiting", "review"];
  return options[Math.floor(Math.random() * options.length)];
}

async function slowWalk() {
  if (dragging) return;

  const token = interactionToken;
  resetNudgeCount();
  clearProps();
  direction *= -1;
  const steps = 24 + Math.floor(Math.random() * 12);
  const stepX = 6 + Math.random() * 2.5;
  pet.classList.add("walking");
  play(direction > 0 ? "slow-walk-right" : "slow-walk-left");

  for (let i = 0; i < steps; i += 1) {
    if (dragging || token !== interactionToken) return;
    window.petWindow.moveBy(direction * stepX, Math.sin(i / 5) * 0.35);
    await rest(820);
  }

  pet.classList.remove("walking");
  play("idle");
}

async function thinkForAWhile(duration = 52000 + Math.random() * 52000) {
  if (dragging) return;

  const token = interactionToken;
  resetNudgeCount();
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
  resetNudgeCount();
  clearProps();
  pet.classList.add("sleeping");
  sleepBubble.classList.add("visible");
  play("sleeping");
  await rest(65000 + Math.random() * 55000);
  if (token !== interactionToken) return;
  clearProps();
  if (!dragging) play("idle");
}

async function eatForAWhile() {
  if (dragging) return;

  const token = interactionToken;
  resetNudgeCount();
  clearProps();
  pet.classList.add("eating");
  play("eating");
  await rest(48000 + Math.random() * 36000);
  if (token !== interactionToken) return;
  clearProps();
  if (!dragging) play("idle");
}

async function quietForAWhile() {
  const token = interactionToken;
  resetNudgeCount();
  clearProps();
  play(chooseQuietMood());
  await rest(42000 + Math.random() * 42000);
  if (token !== interactionToken) return;
}

async function runNaturalBehavior(roll) {
  behaviorTurn += 1;

  if (behaviorTurn === 1 || behaviorTurn % 3 === 0) {
    await slowWalk();
  } else if (behaviorTurn === 2 || behaviorTurn % 6 === 0) {
    await sleepForAWhile();
  } else if (roll < 0.26) {
    await slowWalk();
  } else if (roll < 0.42) {
    await thinkForAWhile(42000 + Math.random() * 42000);
  } else if (roll < 0.58) {
    await eatForAWhile();
  } else if (roll < 0.82) {
    await sleepForAWhile();
  } else {
    await quietForAWhile();
  }
}

async function behaviorLoop() {
  if (!dragging && !behaviorBusy) {
    behaviorBusy = true;
    const token = interactionToken;
    const roll = Math.random();
    await runNaturalBehavior(roll);
    if (token === interactionToken) {
      behaviorBusy = false;
    }
  }

  setTimeout(behaviorLoop, 18000 + Math.random() * 22000);
}

setTimeout(behaviorLoop, 2500);

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

  const activity = currentInterruptibleActivity();
  if (activity) {
    nudgeCount = nudgeState === activity ? nudgeCount + 1 : 1;
    nudgeState = activity;

    if (nudgeCount < 3) {
      showThought(chooseNudgeThought(activity, nudgeCount), 5200);
      return;
    }
  }

  cancelCurrentBehavior();
  behaviorBusy = true;
  await thinkForAWhile(36000);
  behaviorBusy = false;
});

pet.addEventListener("pointerdown", (event) => {
  dragging = true;
  dragMoved = false;
  pointerStart = { x: event.screenX, y: event.screenY };
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
    if (!dragMoved) {
      resetNudgeCount();
      clearProps();
    }
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
