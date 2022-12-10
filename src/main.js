import {game, gameTools, gridCell, ALERTS} from "./store.js";
import { chooseBoard, gameMoves, restart } from "./handlers.js";


chooseBoard(game, gameTools);
gameMoves(game, gameTools);
restart(game, gameTools);