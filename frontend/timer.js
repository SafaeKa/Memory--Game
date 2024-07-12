export default class Timer {
    constructor(difficulty, timerDisplaySelector) {
        this.timerDisplay = document.querySelector(timerDisplaySelector);
        this.timerInterval = null;

        if (difficulty === "4") {
            this.totalSeconds = 30;
            this.timerInitialState = "00:30";
        } else if (difficulty === "6") {
            this.totalSeconds = 45;
            this.timerInitialState = "00:45";
        } else if (difficulty === "9") {
            this.totalSeconds = 75;
            this.timerInitialState = "01:15";
        } else {
            //default
            this.totalSeconds = 30;
            this.timerInitialState = "00:30";
        }

        this.updateDisplay();
    }

    start() {
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    updateTimer() {
        this.totalSeconds--;
        this.updateDisplay();
        if (this.totalSeconds === 0) {
            this.stop();
            this.onFinish();
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.totalSeconds / 60);
        const seconds = this.totalSeconds % 60;
        this.timerDisplay.textContent = this.formatTime(minutes, seconds);
    }

    formatTime(minutes, seconds) {
        return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
    }

    padZero(num) {
        return (num < 10 ? '0' : '') + num;
    }

    stop() {
        clearInterval(this.timerInterval);
    }

    onFinish() {
        /*saveScores()
            .then(() => {
                window.location.href = 'scores.html';
            })
            .catch(error => {
                console.error('Error saving scores:', error);
            });*/
    }
}
