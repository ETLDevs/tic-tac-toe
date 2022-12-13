import { game, gameTools, ALERTS } from "./store.js";
import {
  chooseBoard,
  gameMoves,
  restart,
  returnOneStep,
  showRecord,
  saveGame,
  loadGame,
} from "./handlers.js";

chooseBoard(game, gameTools);
gameMoves(game, gameTools);
restart(game, gameTools);
returnOneStep(game, ALERTS);
showRecord(game, ALERTS);
saveGame(game, gameTools, ALERTS);
loadGame(game, gameTools, ALERTS);