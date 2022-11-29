"use strict";
const game = {
  xTurn: true,
  xState: [],
  oState: [],
  savedGame: { states: [[], []], xTurn: true },
  gamesCounter: 1,
  winnings: {},

  winningStates: [
    // Rows
    ["0", "1", "2"],
    ["3", "4", "5"],
    ["6", "7", "8"],

    // Columns
    ["0", "3", "6"],
    ["1", "4", "7"],
    ["2", "5", "8"],

    // Diagonal
    ["0", "4", "8"],
    ["2", "4", "6"],
  ],
};

const oneStepBack = (lastCell, player, state, xTurn) => {
  lastCell.classList.remove(`${player}`, "disabled");
  state.pop();
  game.xTurn = xTurn;
};

const saveStates = (playerState, savedState) => {
  playerState.map((state) => {
    savedState.push(state);
  });
};

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
  let xLength = game.xState.length;
  let oLength = game.oState.length;
  const oState = game.oState;
  const xState = game.xState;
  const lastXCell = document.querySelector(
    `[data-value = '${game.xState[xLength - 1]}']`
  );
  const lastOCell = document.querySelector(
    `[data-value = '${game.oState[oLength - 1]}']`
  );
  if (xLength > 0) {
    if (game.xTurn) {
      oneStepBack(lastOCell, "o", oState, (game.xTurn = false));
    } else {
      oneStepBack(lastXCell, "x", xState, (game.xTurn = true));
    }
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
    alert("No winnings yet");
  }
});

document.querySelector(".save-game").addEventListener("click", function () {
  game.savedGame.states = [[], []];
  if (game.xState.length > 0){ 
    saveStates(game.xState, game.savedGame.states[0]);
    saveStates(game.oState, game.savedGame.states[1]);}
   else {
    alert("The board still empty");
  }
  game.savedGame.xTurn = game.xTurn;
});

document.querySelector(".load-game").addEventListener("click", () => {
  const savedStates = game.savedGame.states;
    if (savedStates.length > 0) {
    game.xState = [];
    game.oState =[];
    game.xState.push(...savedStates[0]);
    game.oState.push(...savedStates[1]);
    document.querySelectorAll(".grid-cell").forEach((cell) => {
      cell.classList.remove("disabled", "x", "o");
      if (game.xState.includes(cell.dataset.value)) cell.classList.add("x");
      if (game.oState.includes(cell.dataset.value)) cell.classList.add("o");
    });
    game.xTurn = game.savedGame.xTurn;
  } else {
    alert("No saved game");
  }
});

document.querySelectorAll(".restart").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (document.querySelector(".game-over").classList.contains("visible")) {
      document.querySelector(".game-over").classList.remove("visible");
      game.gamesCounter++;
    }

    document.querySelectorAll(".grid-cell").forEach((cell) => {
      cell.classList.remove("disabled", "x", "o");
    });
    game.xTurn = true;
    game.xState = [];
    game.oState = [];
  });
});
