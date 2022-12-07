import { getSolutions } from "./winningStates.js";

const game = {
  boardSize: "",
  xTurn: true,
  xState: [],
  oState: [],
  savedGame: { x:[], o:[], xTurn: true },
  gamesCounter: 1,
  winnings: {},
  winningStates: [],
  alerts: {
    emptyBoard: "The board still empty!",
    noWin: "No winnings yet",
    noSave: "No saved game",
  },
};

const createBoard = (size) => {
  const gameContainer = document.querySelector(".game");
  gameContainer.classList.remove("hidden");
  if (game.boardSize !== "") {
    gameContainer.innerHTML = "";
  }
  for (let i = 0; i < size ** 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add(`grid-cell`);
    cell.dataset.value = i;
    gameContainer.appendChild(cell);
  }
  game.boardSize = size;
  document.documentElement.style.setProperty("--boardSize", size);
};

const oneStepBack = (lastCell, player, state, xTurn) => {
  lastCell.classList.remove(`${player}`, "disabled");
  state.pop();
  game.xTurn = !game.xTurn;
};

const findLastCell = (state, length) => {
  return document.querySelector(
    `[data-value = '${state[length - 1]}']`)
  }

const saveStates = (playerState, savedState) => {
  playerState.forEach((state) => {
    savedState.push(state);
  });
};

document.querySelectorAll(".board-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const boardSize = btn.dataset.board;
    createBoard(boardSize);
    game.winningStates = getSolutions(boardSize);
    document.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("hidden");
    });
  });
});

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
        game.winnings[game.gamesCounter] =
          game.xState.length + game.oState.length;
      }
    });
  }
});

document.querySelector(".return-one-step").addEventListener("click", () => {
  const xLength = game.xState.length;
  const oLength = game.oState.length;
  const oState = game.oState;
  const xState = game.xState;
  const lastXCell = findLastCell (xState, xLength);
  const lastOCell = findLastCell (oState, oLength);
  if (xLength > 0) {
    if (game.xTurn) {
      oneStepBack(lastOCell, "o", oState);
    } 
    else {
      oneStepBack(lastXCell, "x", xState);
    }
  } else {
    alert(game.alerts.emptyBoard);
  }
});

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
    alert(game.alerts.noWin);
  }
});

document.querySelector(".save-game").addEventListener("click", () => {
  if (game.xState.length > 0) {
    saveStates(game.xState, game.savedGame.x);
    saveStates(game.oState, game.savedGame.o);
  } else {
    alert(game.alerts.emptyBoard);
  }
  game.savedGame.xTurn = game.xTurn;
  console.log(game.savedGame)
});

document.querySelector(".load-game").addEventListener("click", () => {
  const savedStates = game.savedGame.states;
  if (savedStates[0].length > 0) {
    game.xState = [];
    game.oState = [];
    game.xState.push(...savedStates[0]);
    game.oState.push(...savedStates[1]);
    document.querySelectorAll(".grid-cell").forEach((cell) => {
      cell.classList.remove("disabled", "x", "o");
      if (game.xState.includes(cell.dataset.value)) {
        cell.classList.add("x", "disabled");
      }
      if (game.oState.includes(cell.dataset.value)) {
        cell.classList.add("o", "disabled");
      }
    });
    game.xTurn = game.savedGame.xTurn;
  } else {
    alert(game.alerts.noSave);
  }
});

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
    game.savedGame = { states: [[], []], xTurn: true };
  });
});
