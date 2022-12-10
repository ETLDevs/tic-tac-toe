import { ALERTS, gameTools } from "./store.js";
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

export const restart = (game, gameTools) => {
    document.querySelectorAll(".restart").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (document.querySelector(".game-over").classList.contains("visible")) {
        document.querySelector(".game-over").classList.remove("visible");
        game.gamesCounter++;
      }
      document.querySelectorAll("button").forEach((btn) => {
        btn.classList.toggle("hidden");
      });
  
      document.querySelectorAll(".grid-cell").forEach((cell) => {
        cell.classList.remove("disabled", "x", "o");
      });
  
      document.querySelector(".game").classList.add("hidden");
  
      game.xTurn = true;
      game.xState = [];
      game.oState = [];
      gameTools.savedGame = {x: [], o: [], xTurn: true };
    });
  });
};

export const ReturnOneStep = (game, ALERTS) => {
    document.querySelector(".return-one-step").addEventListener("click", () => {
    const userLastState = game.xTurn ? game.oState : game.xState;
    const userSymbol = game.xTurn ? 'o' : 'x'; 
    const lastCell = document.querySelector(
      `[data-value = '${userLastState[userLastState.length - 1]}']`)
    if (userLastState.length > 0) {
        oneStepBack(lastCell, userSymbol, userLastState, game);
    } 
    else {
      alert(ALERTS.emptyBoard);
    }
  });
};

const oneStepBack = (lastCell, player, state, game) => {
    lastCell.classList.remove(`${player}`, "disabled");
    state.pop();
    game.xTurn = !game.xTurn;
  };

export const showRecord = (game, ALERTS) => {  
    document.querySelector(".show-record").addEventListener("click", () => {
    const scoresArr = [];
  
    for (const score in game.winnings) {
      scoresArr.push([score, game.winnings[score]]);
    }
    if (scoresArr.length > 0) {
      scoresArr.sort((a, b) => a[1] - b[1]);
      alert(
        `The fastest game was game ${scoresArr[0][0]} with ${scoresArr[0][1]} moves`
      );
    } else {
      alert(ALERTS.noWin);
    }
  });
};

export const saveGame = (game, gameTools, ALERTS) => {
    document.querySelector(".save-game").addEventListener("click", () => {
    if (game.xState.length > 0) {
      gameTools.savedGame = {x: [], o: [], xTurn: true };
      gameTools.savedGame.xTurn = game.xTurn;
      saveStates(game.xState, gameTools.savedGame.x);
      saveStates(game.oState, gameTools.savedGame.o);
    } 
    else {
      alert(ALERTS.emptyBoard);
    }
  });
};

const saveStates = (playerState, savedState) => {
    playerState.forEach((state) => {
      savedState.push(state);
    });
  };

export const loadGame = (game, gameTools, ALERTS) => {
     document.querySelector(".load-game").addEventListener("click", () => {
    const savedStates = gameTools.savedGame;
    if (savedStates.x.length > 0) {
      game.xState = [];
      game.oState = [];
      game.xState.push(...savedStates.x);
      game.oState.push(...savedStates.o);
  
      document.querySelectorAll(".grid-cell").forEach((cell) => {
        cell.classList.remove("disabled", "x", "o");
        const cellValue = cell.dataset.value;
        if (game.xState.includes(cellValue)) {
          cell.classList.add("x", "disabled");
        }
        if (game.oState.includes(cellValue)) {
          cell.classList.add("o", "disabled");
        }
      });
      game.xTurn = gameTools.savedGame.xTurn;
    } else {
      alert(ALERTS.noSave);
    }
  });
};