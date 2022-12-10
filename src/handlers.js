import { getSolutions } from "./winningStates.js";

const createBoard = (size) => {
    const gameContainer = document.querySelector(".game");
    gameContainer.classList.remove("hidden");
      gameContainer.innerHTML = "";
    for (let i = 0; i < size ** 2; i++) {
      const cell = document.createElement("div");
      cell.classList.add(`grid-cell`);
      cell.dataset.value = i;
      gameContainer.appendChild(cell);
    }
    document.documentElement.style.setProperty("--boardSize", size);
  };

export const chooseBoard = (game, gameTools) => {
document.querySelectorAll(".board-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const size = btn.dataset.board;
      createBoard(size);
      gameTools.boardSize = size;
      game.winningStates = getSolutions(size);
      document.querySelectorAll("button").forEach((btn) => {
        btn.classList.toggle("hidden");
      });
    });
  });
}

export const gameMoves = (game, gameTools) => {
    document.addEventListener("click", (event) => {
        const target = event.target;
        const isCell = target.classList.contains("grid-cell");
        const isDisabled = target.classList.contains("disabled");
      
        if (isCell && !isDisabled) {
          const cellValue = target.dataset.value;
      
          game.xTurn === true
            ? game.xState.push(cellValue)
            : game.oState.push(cellValue);
      
          target.classList.add("disabled");
          target.classList.add(game.xTurn ? "x" : "o");
      
          game.xTurn = !game.xTurn;
      
          // If all cells are disabled, then its draw
          if (!document.querySelectorAll(".grid-cell:not(.disabled)").length) {
            document.querySelector(".game-over").classList.add("visible");
            document.querySelector(".game-over-text").textContent = "Draw!";
          }
      
          game.winningStates.forEach((winningState) => {
            const xWins = winningState.every((state) => game.xState.includes(state));
            const oWins = winningState.every((state) => game.oState.includes(state));
      
            if (xWins || oWins) {
              document
                .querySelectorAll(".grid-cell")
                .forEach((cell) => cell.classList.add("disabled"));
              document.querySelector(".game-over").classList.add("visible");
              document.querySelector(".game-over-text").textContent = xWins
                ? "X wins!"
                : "O wins!";
              game.winnings[gameTools.gamesCounter] =
                game.xState.length + game.oState.length;
            }
          });
        }
      });
};