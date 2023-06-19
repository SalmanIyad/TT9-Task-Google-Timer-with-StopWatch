// Timer Elements
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const toggleButton = document.getElementById('toggle');
const resetButton = document.getElementById('reset');
const muteButton = document.getElementById('mute');
const fullscreenButton = document.getElementById('fullscreen');

// Stopwatch Elements
const stopwatchHoursElement = document.getElementById('stopwatch-hours');
const stopwatchMinutesElement = document.getElementById('stopwatch-minutes');
const stopwatchSecondsElement = document.getElementById('stopwatch-seconds');
const stopwatchMillisecondsElement = document.getElementById('stopwatch-milliseconds');
const startStopwatchButton = document.getElementById('startStopwatch');
const resetStopwatchButton = document.getElementById('resetStopwatch');

// Timer Variables
let timer;
let targetTime = 0;
let isMuted = false;
let isTimerRunning = false;

// Stopwatch Variables
let stopwatchInterval;
let stopwatchMilliseconds = 0;
let stopwatchRunning = false;

// audio Variable
const audio = document.getElementById('audio');


function toggleDarkTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');

    body.classList.toggle('dark-theme');
    themeIcon.classList.toggle('fa-moon');
    themeIcon.classList.toggle('fa-sun');

    updateColors();
}

function updateColors() {
    const body = document.body;
    const isDarkTheme = body.classList.contains('dark-theme');

    if (isDarkTheme) {
        body.style.setProperty('--background-color', '#ccc');
        body.style.setProperty('--primary-color', '#222');
        body.style.setProperty('--text-color', '#1f1f1f');
    } else {
        body.style.setProperty('--background-color', '#252525');
        body.style.setProperty('--primary-color', '#ddd');
        body.style.setProperty('--text-color', '#f1f1f1');
    }
}



function toggleTimer() {
    if (isTimerRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    if (timer) return; // Prevent multiple timers

    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;

    targetTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
    localStorage.setItem('targetTime', targetTime.toString());

    if (targetTime <= 0) return;

    timer = setInterval(updateTimer, 10);
    isTimerRunning = true;
    toggleButton.innerHTML = '<i class="fas fa-pause"></i>';
    toggleButton.removeEventListener('click', startTimer);
    toggleButton.addEventListener('click', pauseTimer);
    resetButton.disabled = false;
    muteButton.disabled = false;
    fullscreenButton.disabled = false;
}

function pauseTimer() {
    clearInterval(timer);
    timer = null;
    isTimerRunning = false;
    toggleButton.innerHTML = '<i class="fas fa-play"></i>';
    toggleButton.removeEventListener('click', pauseTimer);
    toggleButton.addEventListener('click', startTimer);
    resetButton.disabled = false;
    muteButton.disabled = false;
    fullscreenButton.disabled = false;
    audio.pause();
}


toggleButton.addEventListener('click', toggleTimer);


function resetTimer() {
    clearInterval(timer);
    timer = null;
    targetTime = 0;
    hoursInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';
    localStorage.removeItem('targetTime');
    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = true;
    muteButton.disabled = false;
    fullscreenButton.disabled = false;
    audio.pause();
}

function updateTimer() {
    const storedTargetTime = localStorage.getItem('targetTime');
    if (!storedTargetTime) {
        clearInterval(timer);
        timer = null;
        return;
    }

    targetTime = parseInt(storedTargetTime);
    targetTime -= 10;
    localStorage.setItem('targetTime', targetTime.toString());

    if (targetTime <= 0) {
        pauseTimer();
        playSound();
    }

    updateDisplay();
}

function updateDisplay() {
    const hours = Math.floor(targetTime / 3600000);
    const minutes = Math.floor((targetTime % 3600000) / 60000);
    const seconds = Math.floor((targetTime % 60000) / 1000);

    hoursInput.value = padTime(hours);
    minutesInput.value = padTime(minutes);
    secondsInput.value = padTime(seconds);
}

function padTime(time) {
    return time.toString().padStart(2, '0');
}

function toggleMute() {
    isMuted = !isMuted;
    muteButton.innerHTML = `<i class="fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}"></i>`;
    if (isMuted) {
        audio.pause();
    }
}

function playSound() {
    if (!isMuted) {
        audio.currentTime = 0;
        audio.play();
    }
}

function toggleFullscreen() {
    const container = document.querySelector('.container');

    if (document.fullscreenElement) {
        document.exitFullscreen();
        fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
        container.style.transform = '';
    } else {
        document.documentElement.requestFullscreen();
        fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
        container.style.transform = 'scale(1.4)';
    }
}

resetButton.addEventListener('click', resetTimer);
muteButton.addEventListener('click', toggleMute);
fullscreenButton.addEventListener('click', toggleFullscreen);


// StopWatch

const storedTargetTime = localStorage.getItem('targetTime');
if (storedTargetTime) {
    startTimer();
}



function startStopwatch() {
    if (stopwatchRunning) return; // Prevent multiple starts

    stopwatchInterval = setInterval(updateStopwatch, 10);
    stopwatchRunning = true;
    startStopwatchButton.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchRunning = false;
    startStopwatchButton.innerHTML = '<i class="fas fa-play"></i>';
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchMilliseconds = 0;
    stopwatchHoursElement.textContent = '00';
    stopwatchMinutesElement.textContent = '00';
    stopwatchSecondsElement.textContent = '00';
    stopwatchMillisecondsElement.textContent = '00';
    stopwatchRunning = false;
    startStopwatchButton.innerHTML = '<i class="fas fa-play"></i>';
}

function updateStopwatch() {
    stopwatchMilliseconds += 10;

    let hours = Math.floor(stopwatchMilliseconds / 3600000);
    let minutes = Math.floor((stopwatchMilliseconds % 3600000) / 60000);
    let seconds = Math.floor((stopwatchMilliseconds % 60000) / 1000);
    let milliseconds = Math.floor((stopwatchMilliseconds % 1000) / 10);

    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }

    if (minutes >= 60) {
        hours += 1;
        minutes = 0;
    }

    if (hours >= 24) {
        hours = 0;
    }

    stopwatchHoursElement.textContent = padTime(hours);
    stopwatchMinutesElement.textContent = padTime(minutes);
    stopwatchSecondsElement.textContent = padTime(seconds);
    stopwatchMillisecondsElement.textContent = padTime(milliseconds);
}



// Utility Function to Pad Time with Leading Zeros
function padTime(time, length = 2) {
    return time.toString().padStart(length, '0');
}

// Event Listeners for Stopwatch Buttons
startStopwatchButton.addEventListener('click', function() {
    if (stopwatchRunning) {
        pauseStopwatch();
    } else {
        startStopwatch();
    }
});

resetStopwatchButton.addEventListener('click', resetStopwatch);


// Button Elements
const timerButton = document.getElementById('timerButton');
const stopwatchButton = document.getElementById('stopwatchButton');

// Timer and Stopwatch Section Elements
const timerSection = document.getElementById('timerSection');
const stopwatchSection = document.getElementById('stopwatchSection');

// Show Timer Section
function showTimerSection() {
    timerSection.style.display = 'block';
    stopwatchSection.style.display = 'none';
    timerButton.style.transform = 'scaleX(1.05)';
    stopwatchButton.style.transform = 'scaleX(0.95)';
}

// Show Stopwatch Section
function showStopwatchSection() {
    timerSection.style.display = 'none';
    stopwatchSection.style.display = 'block';
    stopwatchButton.style.transform = 'scaleX(1.05)';
    timerButton.style.transform = 'scaleX(0.95)';
}

timerButton.addEventListener('click', showTimerSection);
stopwatchButton.addEventListener('click', showStopwatchSection);

showTimerSection();