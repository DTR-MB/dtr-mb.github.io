document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

let randomNumber;
let attempts = 0;

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
    console.log("Attempts: " + attempts);
    feedback.style.color = "orange";
    if (guess == randomNumber) {
        feedback.textContent = "You guessed correct! You win!";
        feedback.style.color = "darkgreen";
        gameOver();
    }
    else {
        document.querySelector("#guesses").textContent += guess + " ";
        if(attempts == 7) {
            feedback.textContent = "Sorry, you lose.";
            feedback.style.color = "red";
            gameOver();
        } else if (guess > randomNumber) {
            feedback.textContent = "Number is too high.";
        } else {
            feedback.textContent = "Number is too low.";
        }
    }
}
