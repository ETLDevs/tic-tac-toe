"use strict";
const game = {
    xTurn: true,
    xState: [],
    oState: [],
    savedGame:{states:[],
    xTurn: true},
    gamesCounter: 0,
    winnings : {
    
    },

    winningStates: [
        // Rows
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],

        // Columns
        ['0', '3', '6'],
        ['1', '4', '7'],
        ['2', '5', '8'],

        // Diagonal
        ['0', '4', '8'],
        ['2', '4', '6']
    ]
}

document.addEventListener('click', event => {
    const target = event.target
    const isCell = target.classList.contains('grid-cell')
    const isDisabled = target.classList.contains('disabled')

    if (isCell && !isDisabled) {
    const cellValue = target.dataset.value

        game.xTurn === true
            ? game.xState.push(cellValue)
            : game.oState.push(cellValue)

        target.classList.add('disabled')
        target.classList.add(game.xTurn ? 'x' : 'o')

        game.xTurn = !game.xTurn
        
        // If all cells are disabled, then its draw
        if (!document.querySelectorAll('.grid-cell:not(.disabled)').length) {
            document.querySelector('.game-over').classList.add('visible')
            document.querySelector('.game-over-text').textContent = 'Draw!'
            game.gamesCounter++;
        }

        game.winningStates.forEach(winningState => {
            const xWins = winningState.every(state => game.xState.includes(state))
            const oWins = winningState.every(state => game.oState.includes(state))

            if (xWins || oWins) {
                document.querySelectorAll('.grid-cell').forEach(cell => cell.classList.add('disabled'))
                document.querySelector('.game-over').classList.add('visible')
                document.querySelector('.game-over-text').textContent = xWins
                    ? 'X wins!'
                    : 'O wins!';
                game.gamesCounter++;
                game.winnings[game.gamesCounter] = game.xState.length + game.oState.length;

            }
        })
    }
})

document.querySelector('.restart').addEventListener('click', () => {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('disabled', 'x', 'o')
    })

    game.xTurn = true
    game.xState = []
    game.oState = []
})

document.querySelector('.return-one-step').addEventListener('click', () => {  
    const xLength = game.xState.length;
    const oLength = game.oState.length;
    const lastXCell = document.querySelector(`[data-value = '${game.xState[xLength -1]}']`)
    const lastOCell = document.querySelector(`[data-value = '${game.oState[oLength -1]}']`)
 if (xLength > 0){
    if (game.xTurn) { 
     lastOCell.classList.remove('o', 'disabled');
     game.oState.pop();
    game.xTurn = false;
 }
 else{
     lastXCell.classList.remove('x', 'disabled');
     game.xState.pop();
     game.xTurn = true;
 }}
 })

 document.querySelector('.show-record').addEventListener('click', () => {
 const scoresArr = [];

 for (const score in game.winnings) {
  scoresArr.push([score, game.winnings[score]]);
 }
 if (scoresArr.length > 0){
scoresArr.sort((a , b) =>  a[1] - b[1])
alert(`The fastest game was game ${scoresArr[0][0]} with ${scoresArr[0][1]} moves`);
}
else {
    alert("No winnings yet")
}
})

document.querySelector('.save-game').addEventListener('click', function(){
   if(game.xState.length > 0){
        game.savedGame.states = [game.xState, game.oState]
        game.savedGame.xTurn = game.xTurn;
    }
    else{
        alert("The board still empty")
    }
})

document.querySelector('.load-game').addEventListener('click', () =>{
if(game.savedGame.states.length > 0){
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('disabled', 'x', 'o')
    })
    game.xState = game.savedGame.states[0];
    game.oState = game.savedGame.states[1];

 document.querySelectorAll('.grid-cell').forEach(function(cell){

return game.xState.map((state) =>{
    if(cell.dataset.value === state){
cell.classList.add('x');
    }
});
});

document.querySelectorAll('.grid-cell').forEach(function(cell){
      return game.oState.map((state) =>{
            if(cell.dataset.value === state){
        cell.classList.add('o');
            }
        })
            })
            game.xTurn = game.savedGame.xTurn;
        }
            document.querySelector('.save-game').disabled = false;   
})

document.querySelector('.restart-after-gameover').addEventListener('click', () => {
    document.querySelector('.game-over').classList.remove('visible')
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('disabled', 'x', 'o')
    })

    game.xTurn = true
    game.xState = []
    game.oState = []
})