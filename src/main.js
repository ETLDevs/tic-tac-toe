import {game, gameTools, gridCell, ALERTS} from "./store.js";
import { chooseBoard, gameMoves, restart, ReturnOneStep, showRecord } from "./handlers.js";


chooseBoard(game, gameTools);
gameMoves(game, gameTools);
restart(game, gameTools);
ReturnOneStep(game, ALERTS);
showRecord(game, ALERTS);