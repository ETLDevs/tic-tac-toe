"use strict";
const game = {
  xTurn: true,
  xState: [],
  oState: [],
  savedGame: { states: [[], []], xTurn: true },
  gamesCounter: 1,
  board3x3: true,
  streaks5x5:{
    xStreaks: 0,
    oStreaks: 0
  },
  winnings: {},

  winningStates3x3: [
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
  winningStates5x5: [
 //Rows
 ["0", "1", "2"], 
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
// Columns 
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
 // Diagonal 
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
 ["10", "16", "22"]
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

const markStreak = (streak, opponent) => {
  document.querySelectorAll('.grid-cell').forEach((cell) => {
     streak.forEach((state =>{
      if(cell.dataset.value === state){
        cell.classList.add('streak')
      }
     }))
    })
    removeStreakFromState(streak, opponent)
}

const removeStreakFromState = (streak, opponent) => {
  streak.forEach((state) =>{
   opponent.splice(opponent.indexOf(state),1);
  })
}

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

//3X3 game    
    if(game.board3x3){
    // If all cells are disabled, then its draw
    if (!document.querySelectorAll(".game-3x3 > .grid-cell:not(.disabled)").length) {
      document.querySelector(".game-over").classList.add("visible");
      document.querySelector(".game-over-text").textContent = "Draw!";
    }

    game.winningStates3x3.forEach((winningState) => {
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
    });}

    // 5X5 game
if(!game.board3x3){
    
  game.winningStates5x5.forEach((winningState) => {
    const xStreak = winningState.every((state) => game.xState.includes(state));
    const oStreak = winningState.every((state) => game.oState.includes(state));
    
    if(xStreak) {
      game.streaks5x5.xStreaks++;
      markStreak(winningState, game.xState);
    }
    if(oStreak){
      game.streaks5x5.oStreaks++;
      markStreak(winningState, game.oState)
      }

      const xStreakNum = game.streaks5x5.xStreaks;
      const oStreakNum = game.streaks5x5.oStreaks;
      const xWins = xStreakNum > oStreakNum ;
      const oWins = oStreakNum > xStreakNum;
      if (document.querySelectorAll(".game-5x5 > .grid-cell:not(.disabled)").length === 1) {
        document.querySelector(".game-over").classList.add("visible");
        document.querySelector(".game-over-text").textContent = "Draw!";

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
}})
}
}
});

document.querySelector(".return-one-step").addEventListener("click", () => {
  let xLength = game.xState.length;
  let oLength = game.oState.length;
  const oState = game.oState;
  const xState = game.xState;
  const lastXCell = document.querySelector(
    `[data-value = '${xState[xLength - 1]}']`
  );
  const lastOCell = document.querySelector(
    `[data-value = '${oState[oLength - 1]}']`
  );
  if (xLength > 0) {
    if (game.xTurn) {
      oneStepBack(lastOCell, "o", oState, game.xTurn = false);
    } else {
      oneStepBack(lastXCell, "x", xState, game.xTurn = true);
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
      cell.classList.remove("disabled", "x", "o", "streak");
    });
    game.xTurn = true;
    game.xState = [];
    game.oState = [];
    game.streaks5x5.xStreaks = 0;
    game.streaks5x5.oStreaks = 0;
  });
});

document.querySelector(".toggle-board").addEventListener("click", (btn)=>{
  const board3x3 = document.querySelector(".game-3x3");
  const board5x5 = document.querySelector(".game-5x5");
  board5x5.classList.toggle('hidden');
  board3x3.classList.toggle('hidden');
  
  if(game.board3x3){
  btn.target.innerHTML = '3X3 Board';
  game.board3x3 = false;
}
  else{
  btn.target.innerHTML = '5X5 Board'; 
  game.board3x3 = true;
}
})
