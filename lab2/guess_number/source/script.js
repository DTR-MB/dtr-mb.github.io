document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

let randomNumber;
let attempts = 0;
let maxAttempts = 7;
let wins = 0;
let losses = 0;

initializeGame();

function initializeGame() {
   randomNumber = Math.floor(Math.random() * 99) + 1;
   console.log("randomNumber: " + randomNumber);

   document.querySelector("#resetBtn").style.display = "none";

   document.querySelector("#guessBtn").style.display = "inline";
  
   let playerGuess = document.querySelector("#playerGuess");
   playerGuess.focus();
   playerGuess.value = "";
   feedback = document.querySelector("#playerGuess");
   feedback.textContent = "";
   document.querySelector("#guesses").textContent = "";

   attempts = 0;
   document.querySelector("#attemptsLeft").textContent = maxAttempts;

}

function checkGuess() {
    let guess = document.querySelector("#playerGuess").value;
    console.log("Player guess: " + guess);
    let feedback = document.querySelector("#playerGuess");
    if(guess < 1 || guess > 99) {
       feedback.textContent = "Please enter a value between 1 & 99.";
       feedback.style.color = "red";
       return;
    }
    attempts++;
    let attemptsLeft = maxAttempts - attempts;
    document.querySelector("#attemptsLeft").textContent = attemptsLeft;
    console.log("Attempts: " + attempts);
    feedback.style.color = "orange";
    if (guess == randomNumber) {
        feedback.textContent = "You guessed correct! You win!";
        feedback.style.color = "darkgreen";
        wins++;
        document.querySelector("#wins").textContent = wins;
        gameOver();
    }
    else {
        document.querySelector("#guesses").textContent += guess + " ";
        if(attempts == 7) {
            feedback.textContent = "Sorry, you lose.";
            feedback.style.color = "red";
            losses++;
            document.querySelector("#losses").textContent = losses;
            gameOver();
        } else if (guess > randomNumber) {
            feedback.textContent = "Number is too high.";
        } else {
            feedback.textContent = "Number is too low.";
        }
    }
}
