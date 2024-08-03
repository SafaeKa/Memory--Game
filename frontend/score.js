class Score {
    constructor(rank, name, score) {
        this.rank = rank;
        this.name = name;
        this.score = score;
    }
}

const fetchPlayerData = async () => {
    const url = 'https://memory-backend-application-a3d1c61211c9.herokuapp.com/player';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch player data');
        }
        const data = await response.json();
        return data.map((item, index) => new Score(index + 1, item.name, item.score));
    } catch (error) {
        console.error('Error fetching player data:', error);
        return [];
    }
};

const createTableRow = (score) => {
    const row = document.createElement('tr');

    const rankCell = document.createElement('td');
    rankCell.textContent = score.rank;
    row.appendChild(rankCell);

    const nameCell = document.createElement('td');
    nameCell.textContent = score.name;
    row.appendChild(nameCell);

    const scoreCell = document.createElement('td');
    scoreCell.textContent = score.score;
    row.appendChild(scoreCell);

    return row;
};

const populateTable = async () => {
    const tableBody = document.querySelector('#scoreTable tbody');
    const playerData = await fetchPlayerData();

    playerData.forEach(item => {
        const row = createTableRow(item);
        tableBody.appendChild(row);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    populateTable();

    const playAgainButton = document.getElementById('playAgainButton');
    playAgainButton.addEventListener('click', () => {
        window.location.href = 'startpage.html';
    });
});
