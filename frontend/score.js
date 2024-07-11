const fetchPlayerData = async () => {
    const url = 'http://localhost:8080/player';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch player data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching player data:', error);
        return []; // Return empty array in case of error
    }
};

// Populate the table with player data
const populateTable = async () => {
    const tableBody = document.querySelector('#scoreTable tbody');
    const playerData = await fetchPlayerData();


    playerData.forEach(item => {
        let row = document.createElement('tr');
        row.innerHTML = `<td>${item.rank}</td><td>${item.name}</td><td>${item.score}</td>`;
        tableBody.appendChild(row);
    });
};

// Execute populateTable function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    populateTable();

    const playAgainButton = document.getElementById('playAgainButton');
    playAgainButton.addEventListener('click', () => {
        window.location.href = 'startpage.html';
    });
});