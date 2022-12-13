import { gameTools } from "./store.js";
import  { getSolutions }  from "./winningStates.js";

const createBoard = (size) => {
  const gameContainer = document.querySelector(".game");
  gameContainer.innerHTML = "";
  for (let i = 0; i < size ** 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add(`grid-cell`);
    cell.dataset.value = i;
    gameContainer.appendChild(cell);
  }
  const style = document.querySelector(".gridStyle");
  style.innerHTML = 
  `.grid-cell:nth-child(n){
    border-top: none;
    border-left: none;
  }
  .grid-cell:nth-child(${size}n){
    border-right: none; 
  }
  .grid-cell:nth-last-child(-n +${size}){
    border-bottom: none;
  }`
  document.head.appendChild(style);
};

export const chooseBoard = (game, gameTools) => {
  document.querySelectorAll(".board-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const size = btn.dataset.board;
      createBoard(size);
      gameTools.boardSize = size;
      game.winningStates = getSolutions(size);
      document.documentElement.style.setProperty("--boardSize", size);
      document.querySelectorAll(".new").forEach(el => {
        el.classList.toggle("hidden");
      });
      });
  });
};

export const gameMoves = (game, gameTools) => {
  document.addEventListener("click", (event) => {
    const target = event.target;
    const isCell = target.classList.contains("grid-cell");
    const isDisabled = target.classList.contains("disabled");
    
    if (isCell && !isDisabled) {
      const cellValue = target.dataset.value;

    if (game.xTurn === true){
        game.xState.push(cellValue);
        document.querySelector('.dot').style.right = 'inherit';
      }
      else{
        game.oState.push(cellValue);
        document.querySelector('.dot').style.right = '135px';
      }
      target.classList.add("disabled");
      target.classList.add(game.xTurn ? "x" : "o");

      game.xTurn = !game.xTurn;

      // If all cells are disabled, then its draw
      if (!document.querySelectorAll(".grid-cell:not(.disabled)").length) {
        document.querySelector(".game-over").classList.remove("hidden");
        document.querySelector(".game-over-text").textContent = "Draw!";
      };
      game.winningStates.forEach((winningState) => {
        const xWins = winningState.every((state) =>
          game.xState.includes(state)
        );
        const oWins = winningState.every((state) =>
          game.oState.includes(state)
        );

        if (xWins || oWins) {
          document
            .querySelectorAll(".grid-cell")
            .forEach((cell) => cell.classList.add("disabled"));
          document.querySelector(".game-over").classList.remove("hidden");
          if (xWins) {
              document.querySelector(".game-over-text").textContent =  "X wins!";
            game.xWins++
            }
            else{
              document.querySelector(".game-over-text").textContent =  "O wins!";
              game.oWins++
            };
            document.querySelectorAll('.wins').forEach(win => {
              (win.classList.contains('x')) ?
              win.innerHTML = game.xWins:
              win.innerHTML = game.oWins;
            });
            game.winnings.push([
              gameTools.gamesCounter, 
              (game.xState.length + game.oState.length)]);
      };
          });
        }
  });
};

export const newGame = (game, gameTools) => {
  document.querySelector('.newGame').addEventListener('click', () => {
    document.querySelector('.game-over').classList.add('hidden');
    document.querySelector('.game').innerHTML = '';
    createBoard(gameTools.boardSize);
    document.querySelector('.dot').style.right = '135px';
    game.xState = [];
    game.oState = [];
    game.xTurn = true; 
    gameTools.gamesCounter++
  });
}


export const restart = (game, gameTools) => {
  document.querySelectorAll(".restart").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!document.querySelector(".game-over").classList.contains("hidden")) {
        document.querySelector(".game-over").classList.add("hidden");
      }
      document.querySelectorAll(".new").forEach(el => {
        el.classList.toggle("hidden");
      });

      document.querySelectorAll(".grid-cell").forEach((cell) => {
        cell.classList.remove("disabled", "x", "o");
      });
      document.querySelectorAll('.wins').forEach(win => {
      win.innerHTML = "0";
      });
      document.head.querySelector('.gridStyle').innerHTML = '';
      document.querySelector('.dot').style.right = '135px';
      game.xTurn = true;
      game.xState = [];
      game.oState = [];
      game.xWins = 0;
      game.oWins = 0;
      gameTools.savedGame = { x: [], o: [], xTurn: true};
      gameTools.gamesCounter = 1;
    });
  });
};

export const returnOneStep = (game, ALERTS) => {
  document.querySelector(".return-one-step").addEventListener("click", () => {
    const userLastState = game.xTurn ? game.oState : game.xState;
    const userSymbol = game.xTurn ? "o" : "x";
    const lastCell = document.querySelector(
      `[data-value = '${userLastState[userLastState.length - 1]}']`
    );
    if (userLastState.length > 0) {
      oneStepBack(lastCell, userSymbol, userLastState, game);
    } else {
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
   const winnings = game.winnings;
    if (winnings.length > 0) {
      winnings.sort((a, b) => a[1] - b[1]);
      alert(
        `The fastest game was game ${winnings[0][0]} with ${winnings[0][1]} moves`
      );
    } else {
      alert(ALERTS.noWin);
    }
  });
};

export const saveGame = (game, gameTools, ALERTS) => {
  document.querySelector(".save-game").addEventListener("click", () => {
    if (game.xState.length > 0) {
      gameTools.savedGame = { x: [], o: [], xTurn: true };
      gameTools.savedGame.xTurn = game.xTurn;
      gameTools.savedGame.x.push(...game.xState);
      gameTools.savedGame.o.push(...game.oState);
    } else {
      alert(ALERTS.emptyBoard);
    }
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
      game.xTurn = savedStates.xTurn;
    } else {
      alert(ALERTS.noSave);
    }
  });
};
