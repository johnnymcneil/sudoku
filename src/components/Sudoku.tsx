import { useEffect, useState } from 'react';

import './Sudoku.css';
import { ICell } from '~/interfaces';

/**
 * Generate a grid of zeroed cells
 * @param square - Size of the grid
 * @returns {ICell[][]} Grid of zeroed cells
 */
const createGrid = (square: number): ICell[][] =>
  Array.from({ length: square }, (_, i) =>
    Array.from({ length: square }, (_, j) => ({ row: i, col: j, value: 0 }))
  );

export const Sudoku = () => {
  const square: number = 9;
  const k: number = 0;
  const sqrt: number = Math.floor(Math.sqrt(square));
  let temp_grid = createGrid(square);
  const [grid, setGrid] = useState<ICell[][]>(temp_grid);

  /**
   * Get the cells in a row.
   * @param {number} row - Index of the row to retrieve
   * @returns {ICell[]} The cells in the row
   */
  const getRow = (row: number): ICell[] => {
    return grid[row];
  };

  /**
   * Get the cells in a column.
   * @param {number} col - Index of the column to retrieve
   * @returns {ICell[]} The cells in the column
   */
  const getCol = (col: number): ICell[] => {
    return grid.map((row) => row[col]);
  };

  /**
   * Get the cells in a 3x3 box.
   * @param {number} box_index - Index of the box to retrieve.
   * Starting at 0, left to right, top to bottom.
   * @returns {ICell[]} The cells in the box at the given index
   */
  const getBox = (box_index: number): ICell[] => {
    const cells: ICell[] = [];
    const startRow = Math.floor(box_index / sqrt);
    const startCol = box_index % sqrt;
    const endRow = startRow + sqrt;
    const endCol = startCol + sqrt;

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        cells.push(grid[row][col]);
      }
    }

    return cells;
  };

  /**
   * Convert a grid to an array of rows.
   * @param {ICell[][]} grid - The grid to convert
   * @returns {ICell[][]} The grid as an array of boxes' cells
   */
  const morphToBoxes = (grid: ICell[][]): ICell[][] => {
    const boxes: ICell[][] = [];
    for (let row = 0; row < square; row += sqrt) {
      for (let col = 0; col < square; col += sqrt) {
        boxes.push(
          grid
            .slice(row, row + sqrt)
            .map((row) => row.slice(col, col + sqrt))
            .flat()
        );
      }
    }
    return boxes;
  };

  type IBoxIndexOverload = {
    /**
     * Get the index of the box containing cell of cell_index.
     * @param {number} cell_index - The index of the cell to retrieve the box index for.
     * Starting at 0, left to right, top to bottom.
     * @returns {number} The index of the box that the cell is in.
     */
    (cell_index: number): number;
    /**
     * Get the index of the box containing cell of cell_row and cell_col.
     * @param {number} cell_row - The row of the cell to retrieve the box index for.
     * Starting at 0, top to bottom.
     * @param {number} cell_col - The column of the cell to retrieve the box index for.
     * Starting at 0, left to right.
     * @returns {number} The index of the box that the cell is in.
     */
    (cell_row: number, cell_col: number): number;
  };

  /**
   * Gets the index of the box containing the specified cell.
   * @remarks
   * See {@link IBoxIndexOverload} for overloads.
   * @param {number} x - Either the index of the cell or the row of the cell.
   * @param {number} [y] - The column of the cell. (If x is the row of the cell)
   * @returns {number} The index of the box that the cell is in.
   */
  const boxIndex: IBoxIndexOverload = (x: number, y?: number): number => {
    const row = y ? x : Math.floor(x / square);
    const col = y ?? x;
    const boxRow = Math.floor(row / sqrt);
    const boxCol = Math.floor(col / sqrt);
    return boxRow * sqrt + boxCol;
  };

  /**
   * Get the index of the cell at the given row and column.
   * @param {number} row - The row of the cell.
   * @param {number} col - The column of the cell.
   * @returns {number} The index of the cell.
   */
  const cellIndex = (row: number, col: number): number => {
    return row * square + col;
  };

  /**
   * Check if a value is present in a row.
   * @param {number} row - The index of the row to check.
   * @param {number} value - The value to check for.
   * @returns {boolean} Whether the value is present in the row.
   */
  const presentInRow = (row: number, value: number): boolean => {
    return grid[row].some((cell) => cell.value === value);
  };

  /**
   * Check if a value is present in a column.
   * @param {number} col - The index of the column to check.
   * @param {number} value - The value to check for.
   * @returns {boolean} Whether the value is present in the column.
   */
  const presentInCol = (col: number, value: number): boolean => {
    return grid.some((row) => row[col].value === value);
  };

  /**
   * Check if a value is present in a box.
   * @param {number} box_index - The index of the box to check.
   * @param {number} value - The value to check for.
   * @returns {boolean} Whether the value is present in the box.
   */
  const presentInBox = (box_index: number, value: number): boolean => {
    return getBox(box_index).some((cell) => cell.value === value);
  };

  /**
   * Check if a value is safe to place in a cell.
   * @param {number} row - The row of the cell.
   * @param {number} col - The column of the cell.
   * @param {number} value - The value to check for.
   * @returns {boolean} Whether the value is safe to place in the cell.
   */
  const valueIsSafe = (row: number, col: number, value: number): boolean => {
    return (
      !presentInRow(row, value) &&
      !presentInCol(col, value) &&
      !presentInBox(boxIndex(row, col), value)
    );
  };

  /**
   * Update the value of a cell in the grid
   * @param {number} row - Index of cell row
   * @param {number} col - Index of cell column
   * @param {number} new_value - New value for cell
   * @returns {void}
   */
  const updateCell = (row: number, col: number, new_value: number): void => {
    temp_grid[row][col] = { row, col, value: new_value };
    // setGrid((prevGrid) => {
    //   const newGrid = prevGrid ? [...prevGrid] : [];
    //   newGrid[row][col].value = new_value;
    //   return newGrid;
    // });
  };

  /**
   * Generates a random number between 1 and `square`
   * @returns {number} Random value
   */
  const generateValue = (max: number): number => {
    return Math.floor(Math.random() * max + 1);
  };

  /**
   * Fill a 3x3 box with valid numbers
   * @param {number} row - Index of the box row
   * @param {number} col - Index of the box column
   * @returns {void}
   */
  const fillBox = (row: number, col: number) => {
    let value;
    for (let i = 0; i < sqrt; i++) {
      for (let j = 0; j < sqrt; j++) {
        do {
          value = generateValue(square);
        } while (!valueIsSafe(row + i, col + j, value));
        updateCell(row + i, col + j, value);
      }
    }
  };

  /**
   * Run `fillBox` on diagonal boxes from top-left to bottom-right
   * @returns {void}
   */
  const fillDiagonal = () => {
    for (let i = 0; i < square; i += sqrt) {
      fillBox(i, i);
    }
  };

  /**
   *
   * @param row - Index of cell row
   * @param col - Index of cell column
   * @returns {void}
   */
  const fillRemaining = (row: number, col: number): void => {
    let value;
    for (let i = row; i < square; i++) {
      for (let j = col; j < square; j++) {
        if (temp_grid[i][j].value !== 0) {
          continue;
        }
        do {
          value = generateValue(square);
        } while (!valueIsSafe(i, j, value));
        updateCell(i, j, value);
      }
    }

    // // Check if we have reached the end of the grid
    // if (row === square - 1 && col === square) {
    //   return true;
    // }

    // // Move to next row if at end of current row
    // if (col === square) {
    //   row++;
    //   col = 0;
    // }

    // // Skip if the cell is already filled
    // if (grid[row][col].value !== 0) {
    //   return fillRemaining(row, col + 1);
    // }

    // // Attempt to fill current cell with valid value
    // for (let value = 1; value <= square; value++) {

    //   do {
    //     value = generateValue(square);
    //   } while (!valueIsSafe(row + i, col + j, value));
    //   updateCell(row + i, col + j, value);

    //   if (valueIsSafe(row, col, value)) {
    //     updateCell(row, col, value);

    //     // Try moving to next cell, returns true if already at end
    //     if (fillRemaining(row, col + 1)) {
    //       return true;
    //     }

    //     // Reset cell if no valid value was found
    //     updateCell(row, col, 0);
    //   }
    // }

    // // No valid value was found
    // return false;
  };

  /**
   * Remove `k` number of digits from the grid
   */
  const removeKDigits = () => {
    let count = k;
    while (count !== 0) {
      const randomRow = generateValue(square) - 1;
      const randomCol = generateValue(square) - 1;
      if (grid[randomRow][randomCol].value !== 0) {
        count--;
        updateCell(randomRow, randomCol, 0);
      }
    }
  };

  const initializeGrid = () => {
    fillDiagonal();
    // fillRemaining(0, sqrt);
    console.log(temp_grid);
    // setGrid(temp_grid);
    // removeKDigits();
  };

  useEffect(() => {
    console.log('Inside useEffect');
    initializeGrid();
  }, []);

  return (
    <div className="sudoku">
      {morphToBoxes(grid).map((box, box_index) => (
        <div className="box" key={box_index}>
          {box.map((cell, cell_index) => (
            <div className="cell" key={`${box_index}-${cell_index}`}>
              {cell.value || ' '}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
