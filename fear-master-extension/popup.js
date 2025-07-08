const fearList = document.getElementById("fearList");
const input = document.getElementById("fearInput");
const addBtn = document.getElementById("addFearBtn");

// Add fear
addBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return;

  const fears = await getFears();
  fears.push({
    id: Date.now().toString(),
    text,
    status: "active",
    timeStarted: Date.now(),
    timeElapsed: 0,
  });

  await saveFears(fears);
  input.value = "";
  renderFears();
});

// Format time as HH:MM:SS
function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600).toString().padStart(2, "0");
  const m = Math.floor((total % 3600) / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// Renders all fear cards
async function renderFears() {
  const fears = await getFears();
  fearList.innerHTML = "";

  const ongoing = fears.filter(f => f.status !== "completed");
  const completed = fears.filter(f => f.status === "completed");

  ongoing.forEach((fear) => {
    const card = createFearCard(fear);
    fearList.appendChild(card);
  });

  if (completed.length > 0) {
    const header = document.createElement("h3");
    header.textContent = "✅ Completed Fears";
    header.style.marginTop = "20px";
    header.style.color = "#34d399";
    fearList.appendChild(header);

    completed.forEach((fear) => {
      const card = createFearCard(fear, true);
      fearList.appendChild(card);
    });
  }
}

function createFearCard(fear, isCompleted = false) {
  const card = document.createElement("div");
  card.className = "fear-card";

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = fear.text;

  const meta = document.createElement("div");
  meta.className = "meta";

  const status = document.createElement("span");
  status.className = `status-tag status-${fear.status}`;
  status.textContent = fear.status.charAt(0).toUpperCase() + fear.status.slice(1);
  if (fear.status === "active") status.classList.add("glow-active");

  const timer = document.createElement("span");
  timer.className = "timer-pill";
  timer.id = `timer-${fear.id}`;
  timer.textContent = getTimerText(fear);

  meta.appendChild(status);
  meta.appendChild(timer);

  const actions = document.createElement("div");
  actions.className = "actions";

  if (!isCompleted) {
    if (fear.status === "active") {
      actions.appendChild(createActionBtn("Pause", "pause", () => pauseFear(fear.id)));
    } else if (fear.status === "paused") {
      actions.appendChild(createActionBtn("Resume", "resume", () => resumeFear(fear.id)));
    }

    actions.appendChild(createActionBtn("Complete", "complete", () => completeFear(fear.id)));
  } else {
    const summary = document.createElement("div");
    summary.style.fontSize = "0.8rem";
    summary.style.color = "#9ca3af";
    summary.textContent = `Well done! Total Time: ${formatTime(fear.timeElapsed)}`;
    actions.appendChild(summary);
  }

  actions.appendChild(createActionBtn("Delete", "delete", () => deleteFear(fear.id)));

  card.appendChild(title);
  card.appendChild(meta);
  card.appendChild(actions);

  return card;
}

// Utility: Get formatted timer text
function getTimerText(fear) {
  const now = Date.now();
  let elapsed = fear.timeElapsed;
  if (fear.status === "active") elapsed += now - fear.timeStarted;
  return `⏱ ${formatTime(elapsed)}`;
}

// Utility: Create button
function createActionBtn(label, style, handler) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.className = style;
  btn.onclick = handler;
  return btn;
}

// Timer update every second
setInterval(async () => {
  const fears = await getFears();
  fears.forEach((fear) => {
    const timerEl = document.getElementById(`timer-${fear.id}`);
    if (timerEl && fear.status === "active") {
      let total = fear.timeElapsed + (Date.now() - fear.timeStarted);
      timerEl.textContent = `⏱ ${formatTime(total)}`;
    }
  });
}, 1000);

// Handlers
window.pauseFear = async (id) => {
  await updateFearById(id, (f) => {
    f.status = "paused";
    f.timeElapsed += Date.now() - f.timeStarted;
    f.timeStarted = null;
    return f;
  });
  renderFears();
};

window.resumeFear = async (id) => {
  await updateFearById(id, (f) => {
    f.status = "active";
    f.timeStarted = Date.now();
    return f;
  });
  renderFears();
};

window.completeFear = async (id) => {
  await updateFearById(id, (f) => {
    if (f.status === "active") {
      f.timeElapsed += Date.now() - f.timeStarted;
    }
    f.status = "completed";
    f.timeStarted = null;
    return f;
  });
  renderFears();
};

window.deleteFear = async (id) => {
  await deleteFearById(id);
  renderFears();
};

renderFears();
