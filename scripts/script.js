  let current = 1;
  const total = 5;

  function showSection(n) {
    document.querySelectorAll('.section').forEach((sec, i) => {
      sec.classList.remove('active');
      if (i === n-1) sec.classList.add('active');
    });

    // Toggle submit button
    if (n === total) {
      document.getElementById("submitBtn").style.display = "inline-block";
    } else {
      document.getElementById("submitBtn").style.display = "none";
    }
  }

  function nextSection() {
    if (current < total) {
      current++;
      showSection(current);
    }
  }

  function prevSection() {
    if (current > 1) {
      current--;
      showSection(current);
    }
  }

  function submitQuiz() {
    alert("Quiz submitted! Thank you.");
  }

  function toggleScript() {
  const script = document.getElementById("listening-script");
  script.style.display = script.style.display === "none" ? "block" : "none";
}

// ====== SPEAKING SECTION AUDIO RECORDER ======
const recorders = document.querySelectorAll('.recorder');

recorders.forEach((recorderEl, idx) => {
  let mediaRecorder, audioChunks = [], timerInterval, seconds = 0;

  // Create UI
  recorderEl.innerHTML = `
    <button class="startBtn">🎙 Start</button>
    <button class="stopBtn" disabled>⏹ Stop</button>
    <span class="timer">00:00</span>
    <audio controls style="display:none; margin-top:8px;"></audio>
  `;

  const startBtn = recorderEl.querySelector('.startBtn');
  const stopBtn = recorderEl.querySelector('.stopBtn');
  const timerEl = recorderEl.querySelector('.timer');
  const audioEl = recorderEl.querySelector('audio');

  // Timer function
  function startTimer() {
    seconds = 0;
    timerEl.textContent = "00:00";
    timerInterval = setInterval(() => {
      seconds++;
      let min = String(Math.floor(seconds / 60)).padStart(2, '0');
      let sec = String(seconds % 60).padStart(2, '0');
      timerEl.textContent = `${min}:${sec}`;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  // Start recording
  startBtn.addEventListener('click', async () => {
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      audioEl.src = url;
      audioEl.style.display = "block";
    };
    mediaRecorder.start();

    startBtn.disabled = true;
    stopBtn.disabled = false;
    startTimer();
  });

  // Stop recording
  stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    stopTimer();
  });
});

document.getElementById("downloadRecording").addEventListener("click", () => {
    if (!recordedBlob) {
        alert("No recording available!");
        return;
    }

    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "response.mp3";  
    a.click();
    URL.revokeObjectURL(url);
});

// ====== SECTION ANSWER KEYS ======
const answerKey = {
  // --- Section 3 (Reading) ---
  r1: "b",
  r2: "absorb disturbances",
  r3: "a",
  r4: "b",
  r5: "c",

  // --- Section 4 (Listening) ---
  q1: "b",
  q2: "a",
  q3: ["collaboration", "societal demand"], // accept two key ideas
  q4: "a",
  q5: "c",

  // --- Section 5 (Grammar & Vocabulary) ---
  g1: "Hardly had I arrived at the conference when I realized I had left my notes at home.",
  g2: "a",
  g3: "assertiveness",
  g4: "Only after the funding had been approved did they start the project.",
  g5: "a"
};

// ====== QUIZ SUBMIT FUNCTION ======
function submitQuiz() {
  let score = 0;
  let totalQs = 0;
  let results = "<h2>Results</h2>";

  // === Helper for radio questions ===
  function checkRadio(qName, correct, label) {
    totalQs++;
    let selected = document.querySelector(`input[name='${qName}']:checked`);
    if (selected && selected.value === correct) {
      score++; results += `<p>${label} ✅ Correct</p>`;
    } else {
      results += `<p>${label} ❌ Correct Answer: ${correct}</p>`;
    }
  }

  // === Helper for text input questions ===
  function checkText(qName, correct, label, options=[]) {
    totalQs++;
    let input = document.querySelector(`[name='${qName}']`);
    if (!input) return;
    let ans = input.value.trim().toLowerCase();

    // allow synonyms / multiple answers
    let accepted = [correct.toLowerCase(), ...options.map(o=>o.toLowerCase())];

    if (accepted.some(a => ans.includes(a))) {
      score++; results += `<p>${label} ✅ Correct</p>`;
    } else {
      results += `<p>${label} ❌ Correct Answer: ${correct}</p>`;
    }
  }

  // === Section 3 ===
  results += "<h3>Section 3: Reading</h3>";
  checkRadio("r1", answerKey.r1, "Q1");
  checkText("r2", answerKey.r2, "Q2");
  checkRadio("r3", answerKey.r3, "Q3");
  checkRadio("r4", answerKey.r4, "Q4");
  checkRadio("r5", answerKey.r5, "Q5");

  // === Section 4 ===
  results += "<h3>Section 4: Listening</h3>";
  checkRadio("q1", answerKey.q1, "Q1");
  checkRadio("q2", answerKey.q2, "Q2");
  checkText("q3", "collaboration", "Q3", ["chance", "societal demand"]);
  checkRadio("q4", answerKey.q4, "Q4");
  checkRadio("q5", answerKey.q5, "Q5");

  // === Section 5 ===
  results += "<h3>Section 5: Grammar & Vocabulary</h3>";
  checkText("g1", answerKey.g1, "Q1", ["had arrived", "had left"]); 
  checkRadio("g2", answerKey.g2, "Q2");
  checkText("g3", answerKey.g3, "Q3");
  checkText("g4", answerKey.g4, "Q4", ["did they start the project"]);
  checkRadio("g5", answerKey.g5, "Q5");

  // === Final Score ===
  results += `<h3>Final Score: ${score} / ${totalQs}</h3>`;

  // Replace body with results
  document.body.innerHTML = results;
}