let data = [
    { Rank: 1, Name: 'Player 1', Score: 1000 },
    { Rank: 2, Name: 'Player 2', Score: 800 },
    { Rank: 3, Name: 'Player 3', Score: 600 },
    { Rank: 1, Name: 'Player 1', Score: 1000 },
    { Rank: 2, Name: 'Player 2', Score: 800 },
    { Rank: 3, Name: 'Player 3', Score: 600 },
];

let tableBody = document.querySelector("#scoreTable tbody");

data.forEach(item => {
    let row = document.createElement('tr');
    row.innerHTML = `<td>${item.Rank}</td><td>${item.Name}</td><td>${item.Score}</td>`;
    tableBody.appendChild(row);
});
