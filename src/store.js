export const game = {
  xTurn: true,
  xState: [],
  oState: [],
  gamesCounter: 1,
  winnings: {},
  winningStates: [],
};

export const gameTools = {
boardSize: "",
savedGame: { x: [], o: [], xTurn: true },
};

export const ALERTS = {
  emptyBoard: "The board still empty!",
  noWin: "No winnings yet",
  noSave: "No saved game",
};

export const gridCell = document.querySelectorAll('grid-cell');
