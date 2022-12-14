export const game = {
  xTurn: true,
  xState: [],
  oState: [],
  winnings: [],
  xWins: 0,
  oWins: 0,
  winningStates: [],
};

export const gameTools = {
  gamesCounter: 1,
  boardSize: "",
  savedGame: { x: [], o: [], xTurn: true},
};

export const ALERTS = {
  emptyBoard: "The board still empty!",
  noWin: "No winnings yet",
  noSave: "No saved game",
};
