const createBoard = (game, size) => {
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
    document.documentElement.style.setProperty("--boardSize", size);
  };

export const chooseBoard = (game) => {
document.querySelectorAll(".board-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const size = btn.dataset.board;
      createBoard(game, size);
      game.winningStates = getSolutions(size);
      game.boardSize = size;
      document.querySelectorAll("button").forEach((btn) => {
        btn.classList.toggle("hidden");
      });
    });
  });
}