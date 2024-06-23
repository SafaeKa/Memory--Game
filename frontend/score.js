// Hier könnte man über eine eigene Klasse für den Typ Score nachdenken. Macht die Entwicklung einfacher und entspricht eher Best-Practices (ist also positiv für die Bewertung)
// Ich gehe mal davon aus, dass hier langfristig tatsächliche Daten genutzt werden
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
    // Bitte keine innerHTML nutzen, das würde zu abzügen führen, da nicht Best-Practice wie in der Vorlesung vorgestellt!
    row.innerHTML = `<td>${item.Rank}</td><td>${item.Name}</td><td>${item.Score}</td>`;
    tableBody.appendChild(row);
});
