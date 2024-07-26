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
    if (e.target.closest('#timer')) return;

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

function padNumber(number, length = 2) {
    return number.toString().padStart(length, '0');
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

let timerInterval;
let timerDisplay = document.getElementById('timer-display');

document.querySelectorAll('.timer-button').forEach(button => {
    button.addEventListener('click', () => {
        clearInterval(timerInterval);

        if (button.id === 'clear') {
            timerDisplay.textContent = '00:00';
            return;
        }

        let time = parseInt(button.dataset.time) * 1000;
        let endTime = Date.now() + time;

        timerInterval = setInterval(() => {
            let remainingTime = endTime - Date.now();
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = '00:00';
            } else {
                let minutes = Math.floor(remainingTime / 60000);
                let seconds = Math.floor((remainingTime % 60000) / 1000);
                timerDisplay.textContent = `${padNumber(minutes)}:${padNumber(seconds)}`;
            }
        }, 1000);
    });
});
