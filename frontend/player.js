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

    updateAttempts(playerNumber) {
        document.querySelector(`.attemptsPlayer${playerNumber}`).textContent = this.getAttemptsText();
    }

    updateScore(playerNumber) {
        document.querySelector(`.scorePlayer${playerNumber}`).textContent = this.getScoreText();
    }
    setPlayerMessage(playerMessage) {
        document.querySelector(".player").textContent = playerMessage;
    }

    static capitalizeName(name) {
        if (!name) return name;
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

}
