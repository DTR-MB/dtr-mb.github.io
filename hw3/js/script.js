const form = document.getElementById("wcForm");
const yearSelect = document.getElementById("yearSelect");
const teamSearch = document.getElementById("teamSearch");
const error = document.getElementById("error");
const matchesDiv = document.getElementById("matches");

const worldCups = [];

for (let year = 1990; year <= 2026; year += 4) {
    worldCups.push(year);
}

worldCups.forEach(year => {
    const option = document.createElement("option");

    option.value = year;
    option.textContent =
        year === 2026
            ? "World Cup 2026 (Upcoming)"
            : `World Cup ${year}`;

    yearSelect.appendChild(option);
});

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const year = yearSelect.value;
    const team = teamSearch.value.trim();

    matchesDiv.innerHTML = "";

    if (year === "") {
        error.textContent = "Please select a World Cup year.";
        return;
    }

    error.textContent = "";

    loadMatches(year, team);

});

function loadMatches(year, team) {
    const leagueID = 4429;
    const url =
        `https://www.thesportsdb.com/api/v1/json/123/eventsseason.php?id=${leagueID}&s=${year}`;

    fetch(url)
        .then(response => {

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return response.json();
        })

        .then(data => {
            matchesDiv.innerHTML = "";

            if (!data.events) {
                matchesDiv.innerHTML =
                    `<p>No match data found for World Cup ${year}.</p>`;

                return;
            }

            let matches = data.events;

            if (team !== "") {
                matches = matches.filter(match =>
                    match.strHomeTeam
                        .toLowerCase()
                        .includes(team.toLowerCase())
                    ||

                    match.strAwayTeam
                        .toLowerCase()
                        .includes(team.toLowerCase())
                );
            }

            if (matches.length === 0) {
                matchesDiv.innerHTML =
                    `<p>No matches found for ${team} in the ${year} World Cup.</p>`;

                return;
            }

            matches.forEach(match => {
                const card = document.createElement("div");
                card.classList.add("match-card");

                card.innerHTML = `
                    <h3>
                        ${match.strHomeTeam}
                        vs
                        ${match.strAwayTeam}
                    </h3>

                    <p>
                        Date:
                        ${match.dateEvent}
                    </p>

                    <p>
                        Score:
                        ${match.intHomeScore ?? "-"}
                        -
                        ${match.intAwayScore ?? "-"}
                    </p>

                    <button 
                        class="details-btn"
                        onclick="getMatchDetails('${match.idEvent}', this)">
                        More Details
                    </button>

                    <div class="details"></div>
                `;

                matchesDiv.appendChild(card);
            });
        })

        .catch(error => {
            console.error(error);
            matchesDiv.innerHTML =
                `<p>${error.message}</p>`;
        });
}

function getMatchDetails(eventID, button) {
    const detailsDiv = button.nextElementSibling;

    if (detailsDiv.innerHTML !== "") {
        detailsDiv.innerHTML = "";
        button.textContent = "More Details";

        return;
    }

    button.textContent = "Loading...";
    fetch(
        `https://www.thesportsdb.com/api/v1/json/123/lookupevent.php?id=${eventID}`
    )

        .then(response => response.json())
        .then(data => {

            if (!data.events) {
                detailsDiv.innerHTML =
                    "<p>No additional information available.</p>";

                button.textContent = "More Details";
               
                return;
            }

            const match = data.events[0];
            detailsDiv.innerHTML = `
                <hr>

                <h4>Match Details</h4>

                <p>
                    <strong>Round:</strong>
                    ${match.strRound ?? "Not available"}
                </p>

                <p>
                    <strong>Group:</strong>
                    ${match.strGroup ?? "Knockout Stage"}
                </p>

                <p>
                    <strong>Home Goal Scorers:</strong>
                    ${match.strHomeGoalDetails ?? "No scorer data available"}
                </p>

                <p>
                    <strong>Away Goal Scorers:</strong>
                    ${match.strAwayGoalDetails ?? "No scorer data available"}
                </p>

                <p>
                    <strong>Venue:</strong>
                    ${match.strVenue ?? "Not available"}
                </p>

                <p>
                    <strong>Referee:</strong>
                    ${match.strOfficial ?? "Not available"}
                </p>

                <p>
                    <strong>Attendance:</strong>
                    ${match.intSpectators ?? "Not available"}
                </p>
            `;

            button.textContent = "Hide Details";
        })

        .catch(error => {
            console.error(error);
            detailsDiv.innerHTML =
                "<p>Error loading match details.</p>";

            button.textContent = "More Details";

        });
}