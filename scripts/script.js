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