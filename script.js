// ----- ข้อมูล routine -----
const routines = {
  morning: [
    { id: "cleanser", label: "ล้างหน้า - Dermaction Plus Pro Acne Foam" },
    { id: "vitc-pre", label: "พรีเซรั่ม - VIT C Advanced Pre-Serum" },
    { id: "vitc-cream", label: "ครีม - VIT C Whitening Cream" },
    { id: "moist", label: "มอยส์เจอร์ - SRICHAND Skin Moisture Burst Gel Cream" },
    { id: "sunscreen", label: "ครีมกันแดด (แนะนำให้มี)", optional: true },
  ],
  night: [
    { id: "cleanser", label: "ล้างหน้า - Dermaction Plus Pro Acne Foam" },
    { id: "niacinamide", label: "เซรั่ม - Niacinamide 10% + NAG 8%" },
    { id: "essence", label: "ไนท์เอสเซนส์ - Dermaction Plus Completed Recover Night Essence" },
    { id: "moist", label: "มอยส์เจอร์ - SRICHAND Skin Moisture Burst Gel Cream" },
    { id: "spot", label: "แต้มสิว (เลือก 1) - Clear Nose / Watsons SOS" },
    { id: "scar", label: "เจลลดรอย - Dragon's Blood Acne Scar Gel" },
  ],
};

let active = "morning";
let checked = {};

const stepsEl = document.getElementById("steps");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// ----- แสดง steps -----
function renderSteps() {
  stepsEl.innerHTML = "";
  const routine = routines[active];
  routine.forEach((step, i) => {
    const div = document.createElement("div");
    div.className = "p-3 bg-pink-100 rounded-xl shadow flex items-center gap-3";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked[step.id] || false;
    checkbox.className = "h-5 w-5 accent-pink-500 cursor-pointer";
    checkbox.addEventListener("change", () => {
      checked[step.id] = checkbox.checked;
      saveState();
      updateProgress();
    });

    const label = document.createElement("label");
    label.textContent = `${i + 1}. ${step.label}`;
    if (step.optional) label.textContent += " (ตัวเลือก)";
    label.className = "flex-1 text-sm";

    div.appendChild(checkbox);
    div.appendChild(label);
    stepsEl.appendChild(div);
  });

  updateProgress();
}

// ----- อัปเดต progress -----
function updateProgress() {
  const routine = routines[active];
  const total = routine.length;
  const done = routine.filter((s) => checked[s.id]).length;
  const pct = Math.round((done / total) * 100);
  progressText.textContent = `${done}/${total} ขั้นตอน · ${pct}%`;
  progressBar.style.width = `${pct}%`;
}

// ----- สลับ routine -----
document.getElementById("morningBtn").addEventListener("click", () => {
  active = "morning";
  saveState();
  renderSteps();
});
document.getElementById("nightBtn").addEventListener("click", () => {
  active = "night";
  saveState();
  renderSteps();
});

// ----- รีเซ็ต -----
document.getElementById("resetBtn").addEventListener("click", () => {
  checked = {};
  saveState();
  renderSteps();
});

// ----- LocalStorage -----
function saveState() {
  localStorage.setItem("routine-state", JSON.stringify({ active, checked }));
}
function loadState() {
  const raw = localStorage.getItem("routine-state");
  if (!raw) return;
  try {
    const { active: a, checked: c } = JSON.parse(raw);
    if (a) active = a;
    if (c) checked = c;
  } catch {}
}

// ----- เริ่มทำงาน -----
loadState();
renderSteps();

// ----- ลงทะเบียน Service Worker สำหรับ PWA -----
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(() => console.log("Service Worker registered"))
      .catch((err) => console.log("Service Worker registration failed:", err));
  });
}
