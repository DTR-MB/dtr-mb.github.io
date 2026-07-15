const form = document.getElementById("wcForm");
const input = document.getElementById("competitionInput");
const dropdown = document.getElementById("competitionSelect");
const error = document.getElementById("error");
const results = document.getElementById("results");
const matchesDiv = document.getElementById("matches");

let competitionsData = [];

fetch("https://api.football-data.org/v4/competitions/")
    .then(res => res.json())
    .then(data => {
        competitionsData = data.competitions;

        data.competitions.forEach(comp => {
            const option = document.createElement("option");
            option.value = comp.code;
            option.textContent = comp.name;
            dropdown.appendChild(option);
        });
    });

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const textValue = input.value.trim().toLowerCase();
    const selectedValue = dropdown.value;

    results.innerHTML = "";
    matchesDiv.innerHTML = "";

    if (textValue === "" && selectedValue === "") {
        error.textContent = "Enter text OR choose a competition.";
        return;
    } else {
        error.textContent = "";
    }

    let filtered = [];

    if (selectedValue !== "") {
        filtered = competitionsData.filter(c => c.code === selectedValue);
    } else {
        filtered = competitionsData.filter(c =>
            c.name.toLowerCase().includes(textValue) ||
            c.code.toLowerCase().includes(textValue)
        );
    }

    if (filtered.length === 0) {
        results.innerHTML = "<p>No competitions found.</p>";
        return;
    }

    filtered.forEach(comp => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <h3>${comp.name}</h3>
            <p><strong>Code:</strong> ${comp.code}</p>
            <p><strong>Region:</strong> ${comp.area.name}</p>
            <img src="${comp.emblem}" alt="logo">
        `;

        results.appendChild(div);

        if (comp.code === "WC") {
            loadMatches();
        }
    });
});


function loadMatches() {
    fetch("http://api.football-data.org/v4/competitions/WC/matches")
        .then(res => res.json())
        .then(data => {

            const matches = data.matches;

            if (matches.length === 0) {
                matchesDiv.innerHTML = "<p>No matches found.</p>";
                return;
            }

            matches.slice(0, 10).forEach(match => {

                const home = match.homeTeam.name;
                const away = match.awayTeam.name;
                const date = new Date(match.utcDate).toLocaleDateString();
                const score = match.score.fullTime;

                const div = document.createElement("div");
                div.classList.add("match-card");

                div.innerHTML = `
                    <p><strong>${home}</strong> vs <strong>${away}</strong></p>
                    <p>Date: ${date}</p>
                    <p>Score: ${score.home ?? "-"} : ${score.away ?? "-"}</p>
                    <p>Status: ${match.status}</p>
                `;

                matchesDiv.appendChild(div);
            });
        })
        .catch(err => {
            matchesDiv.innerHTML = "<p>Error loading matches.</p>";
        });
}