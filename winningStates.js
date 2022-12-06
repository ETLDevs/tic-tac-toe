import { game } from "./game.js";
 
const transposeMatrix = (matrix) => {
   const row = matrix;
   return row.map((_, col) => matrix.map((row) => row[col]));
 };
 
 export const getSolutions = (size) => {
   const rows = [];
   let i = 0;
   while (i < size) {
     const row = [];
     let c = 0;
     while (c < size) {
       row.push(i * size + c + "");
       c++;
     }
     rows.push(row);
     i++;
   }
 
   const columns = transposeMatrix(rows);
 
   const leftDiagonal = [];
   i = 0;
   while (i < size) {
     leftDiagonal.push(rows[i][i]);
     i++;
   }
 
   const rightDiagonal = [];
   i = 0;
   let k = size - 1;
   while (i < size) {
     rightDiagonal.push(rows[i][k--]);
     i++;
   }
 
   game.winningStates = [...rows, ...columns, leftDiagonal, rightDiagonal];
 };