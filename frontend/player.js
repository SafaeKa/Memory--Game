export default class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.attempts = 0;
    }

    incrementAttempts() {
        this.attempts++;
    }

    incrementScore() {
        this.score++;
    }

    getScoreText() {
        return `Score ${this.name}: ${this.score}`;
    }

    getAttemptsText() {
        return `Attempts ${this.name}: ${this.attempts}`;
    }
}
