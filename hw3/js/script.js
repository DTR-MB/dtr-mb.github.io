const form = document.getElementById("wcForm");
const input = document.getElementById("searchInput");
const dropdown = document.getElementById("leagueSelect");
const error = document.getElementById("error");
const results = document.getElementById("results");
const matchesDiv = document.getElementById("matches");

let leagues = [];

fetch("https://www.thesportsdb.com/api/v1/json/1/all_leagues.php")
  .then(res => res.json())
  .then(data => {
    leagues = data.leagues;

    leagues
      .filter(l =>
        l.strSport === "Soccer" &&
        l.strLeague.toLowerCase().includes("world")
      )
      .forEach(l => {
        const option = document.createElement("option");
        option.value = l.idLeague;
        option.textContent = l.strLeague;
        dropdown.appendChild(option);
      });
  })
  .catch(err => {
    console.error("Fetch error:", err);
  });


form.addEventListener("submit", function(e) {
  e.preventDefault();

  const text = input.value.trim().toLowerCase();
  const selected = dropdown.value;

  results.innerHTML = "";
  matchesDiv.innerHTML = "";

  if (text === "" && selected === "") {
    error.textContent = "Enter search or select a league.";
    return;
  } else {
    error.textContent = "";
  }

  let filtered = [];

  if (selected !== "") {
    filtered = leagues.filter(l => l.idLeague === selected);
  } else {
    filtered = leagues.filter(l =>
      l.strLeague.toLowerCase().includes(text)
    );
  }

  if (filtered.length === 0) {
    results.innerHTML = "<p>No leagues found.</p>";
    return;
  }

  filtered.forEach(l => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <h3>${l.strLeague}</h3>
      <p><strong>Sport:</strong> ${l.strSport}</p>
      <p><strong>Country:</strong> ${l.strCountry}</p>
    `;

    results.appendChild(div);

    loadMatches(l.idLeague, "2022");
  });
});


function loadMatches(leagueId, season) {
  fetch(`https://www.thesportsdb.com/api/v1/json/1/eventsseason.php?id=${leagueId}&s=${season}`)
    .then(res => res.json())
    .then(data => {

      if (!data.events) {
        matchesDiv.innerHTML = "<p>No matches found.</p>";
        return;
      }

      data.events.slice(0, 10).forEach(match => {
        const div = document.createElement("div");
        div.classList.add("match-card");

        div.innerHTML = `
          <p><strong>${match.strHomeTeam}</strong> vs <strong>${match.strAwayTeam}</strong></p>
          <p>Date: ${match.dateEvent}</p>
          <p>Score: ${match.intHomeScore ?? "-"} : ${match.intAwayScore ?? "-"}</p>
        `;

        matchesDiv.appendChild(div);
      });
    })
    .catch(() => {
      matchesDiv.innerHTML = "<p>Error loading matches.</p>";
    });
}