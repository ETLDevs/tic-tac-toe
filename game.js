"use strict";
const game = {
  xTurn: true,
  xState: [],
  oState: [],
  savedGame: { states: [[], []], xTurn: true },
  gamesCounter: 1,
  winnings: {},

  winningStates: [
    // Rows 3x3
    ["0", "1", "2"],
    ["3", "4", "5"],
    ["6", "7", "8"],
    //Rows 5x5
    ["1", "2", "3"],
    ["2", "3", "4"],
    ["5", "6", "7"],
    ["7", "8", "9"],
    ["10", "11", "12"],
    ["11", "12", "13"],
    ["12", "13", "14"],
    ["15", "16", "17"],
    ["16", "17", "18"],
    ["17", "18", "19"],
    ["20", "21", "22"],
    ["21", "22", "23"],
    ["22", "23", "24"],

    // Columns 3x3
    ["0", "3", "6"],
    ["1", "4", "7"],
    ["2", "5", "8"],
    // Columns 5x5
    ["0", "5", "10"],
    ["5", "10", "15"],
    ["10", "15", "20"],
    ["1", "6", "11"],
    ["6", "11", "16"],
    ["11", "16", "21"],
    ["2", "7", "12"],
    ["7", "12", "17"],
    ["12", "17", "22"],
    ["3", "8", "13"],
    ["8", "13", "18"],
    ["13", "18", "23"],
    ["4", "9", "14"],
    ["9", "14", "19"],
    ["14", "19", "24"],
    
    // Diagonal 3x3
    ["0", "4", "8"],
    ["2", "4", "6"],
    // Diagonal 5x5
    ["2", "6", "10"],
    ["3", "7", "11"],
    ["7", "11", "15"],
    ["4", "8", "12"],
    ["8", "12", "16"],
    ["12", "16", "20"],
    ["9", "13", "17"],
    ["13", "17", "21"],
    ["14", "18", "22"],
    ["2", "8", "14"],
    ["1", "7", "13"],
    ["7", "13", "19"],
    ["0", "6", "12"],
    ["6", "12", "18"],
    ["12", "18", "24"],
    ["15", "11", "17"],
    ["11", "17", "23"],
    ["10", "16", "22"],
  ]
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

document.querySelector(".toggle-board").addEventListener("click", (btn)=>{
  const board3x3 = document.querySelector(".game-3x3");
  const board5x5 = document.querySelector(".game-5x5");
  board5x5.classList.toggle('hidden');
  board3x3.classList.toggle('hidden');
  
  board5x5.classList.contains('hidden') ?
  btn.target.innerHTML = '3X3 Board':
  btn.target.innerHTML = '5X5 Board'; 
})


//test
document.querySelectorAll('.grid-cell').forEach((cell) => 
addEventListener('click', () =>{
cell.innerHTML = cell.dataset.value;
}))