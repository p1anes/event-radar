const radar = document.getElementById('radar');
let isDragging = false;
let startX, startY, line, headingText;

function removeExistingLineAndHeading() {
    if (line) {
        radar.removeChild(line);
        line = null;
    }
    if (headingText) {
        radar.removeChild(headingText);
        headingText = null;
    }
}

radar.addEventListener('dragstart', (e) => {
    e.preventDefault();
});

radar.addEventListener('mousedown', (e) => {
    removeExistingLineAndHeading();
    const rect = radar.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDragging = true;
    line = document.createElement('div');
    line.classList.add('line');
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    radar.appendChild(line);
});

radar.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const rect = radar.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    if (angle < 0) {
        angle += 360;
    }
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    let displayedAngle = (angle + 90) % 360;
    if (displayedAngle < 0) {
        displayedAngle += 360;
    }
    displayHeadingText(displayedAngle, (startX + currentX) / 2, (startY + currentY) / 2);
});

radar.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
    }
});

radar.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        removeExistingLineAndHeading();
    }
});

function padNumber(number) {
    return number.toString().padStart(3, '0');
}

function displayHeadingText(angle, midX, midY) {
    if (headingText) {
        radar.removeChild(headingText);
    }
    headingText = document.createElement('div');
    headingText.classList.add('heading');
    headingText.textContent = `${padNumber(Math.round(angle))}°`;
    headingText.style.left = `${midX}px`;
    headingText.style.top = `${midY}px`;
    radar.appendChild(headingText);
}

const timer = document.getElementById('timer');
const timeDisplay = document.getElementById('time-display');
const buttons = document.querySelectorAll('#buttons button');
let dragOffsetX, dragOffsetY, isTimerDragging = false, countdownInterval, currentTime = 0;

timer.addEventListener('mousedown', (e) => {
    isTimerDragging = true;
    const rect = timer.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
});

document.addEventListener('mousemove', (e) => {
    if (!isTimerDragging) return;
    timer.style.left = `${e.clientX - dragOffsetX}px`;
    timer.style.top = `${e.clientY - dragOffsetY}px`;
});

document.addEventListener('mouseup', () => {
    isTimerDragging = false;
});

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const time = parseInt(button.getAttribute('data-time'), 10);
        setTime(time);
    });
});

document.getElementById('reset').addEventListener('click', resetTimer);

function setTime(seconds) {
    clearInterval(countdownInterval);
    currentTime = seconds;
    updateTimeDisplay();
    countdownInterval = setInterval(() => {
        if (currentTime > 0) {
            currentTime--;
            updateTimeDisplay();
        } else {
            clearInterval(countdownInterval);
        }
    }, 1000);
}

function updateTimeDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function resetTimer() {
    clearInterval(countdownInterval);
    currentTime = 0;
    updateTimeDisplay();
}
