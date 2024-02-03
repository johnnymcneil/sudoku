import { ICell, ISudoku } from '~/interfaces';

/** Class representing a sudoku game */
export class SudokuHandler implements ISudoku {
  constructor(size: number) {
    this.#size = size;
    this.#sqrt = Math.floor(Math.sqrt(size));
  }

  #size: number;
  /** @returns {number} The size of the sudoku grid. */
  get size(): number {
    return this.#size;
  }

  #sqrt: number;
  /** @returns {number} The square root of the size. */
  get sqrt(): number {
    return this.#sqrt;
  }
  #grid: ICell[][] = [];
  /**
   * @returns {ICell[][]} The sudoku grid.
   */
  get grid(): ICell[][] {
    return this.#grid;
  }

  /**
   * Get the cells in a row.
   * @param {number} row - Index of the row to retrieve
   * @returns {ICell[]} The cells in the row
   */
  getRow(row: number): ICell[] {
    return this.#grid[row];
  }

  /**
   * Get the cells in a column.
   * @param {number} col - Index of the column to retrieve
   * @returns {ICell[]} The cells in the column
   */
  getCol(col: number): ICell[] {
    return this.#grid.map((row) => row[col]);
  }

  /**
   * Get the cells in a 3x3 box.
   * @param {number} box_index - Index of the box to retrieve.
   * Starting at 0, left to right, top to bottom.
   * @returns {ICell[]} The cells in the box at the given index
   */
  getBox(box_index: number): ICell[] {
    const cells: ICell[] = [];
    const startRow = Math.floor(box_index / this.#sqrt);
    const startCol = box_index % this.#sqrt;
    const endRow = startRow + this.#sqrt;
    const endCol = startCol + this.#sqrt;

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        cells.push(this.#grid[row][col]);
      }
    }

    return cells;
  }

  /**
   * Get the index of the box containing cell of cell_index.
   * @param {number} cell_index - The index of the cell to retrieve the box index for.
   * Starting at 0, left to right, top to bottom.
   * @returns {number} The index of the box that the cell is in.
   */
  boxIndex(cell_index: number): number;
  /**
   * Get the index of the box containing cell of cell_row and cell_col.
   * @param {number} cell_row - The row of the cell to retrieve the box index for.
   * Starting at 0, top to bottom.
   * @param {number} cell_col - The column of the cell to retrieve the box index for.
   * Starting at 0, left to right.
   * @returns {number} The index of the box that the cell is in.
   */
  boxIndex(cell_row: number, cell_col: number): number;
  /**
   * Gets the index of the box containing the specified cell.
   * @param {number} x - Either the index of the cell or the row of the cell.
   * @param {number} [y] - The column of the cell. (If x is the row of the cell)
   * @returns {number} The index of the box that the cell is in.
   */
  boxIndex(x: number, y?: number): number {
    const row = y ? x : Math.floor(x / this.#size);
    const col = y ?? x;
    const boxRow = Math.floor(row / this.#sqrt);
    const boxCol = Math.floor(col / this.#sqrt);
    return boxRow * this.#sqrt + boxCol;
  }

  /**
   * Get the index of the cell at the given row and column.
   * @param {number} row - The row of the cell.
   * @param {number} col - The column of the cell.
   * @returns {number} The index of the cell.
   */
  cellIndex(row: number, col: number): number {
    return row * this.#size + col;
  }

  /**
   * Check if a value is present in a row.
   * @param {number} row - The index of the row to check.
   * @param {number} value - The value to check for.
   * @returns {boolean} Whether the value is present in the row.
   */
  presentInRow(row: number, value: number): boolean {
    return this.#grid[row].some((cell) => cell.value === value);
  }

  /**
   * Check if a value is present in a column.
   * @param {number} col - The index of the column to check.
   * @param {number} value - The value to check for.
   * @returns {boolean} Whether the value is present in the column.
   */
  presentInCol(col: number, value: number): boolean {
    return this.#grid.some((row) => row[col].value === value);
  }

  /**
   * Check if a value is present in a box.
   * @param {number} box_index - The index of the box to check.
   * @param {number} value - The value to check for.
   * @returns {boolean} Whether the value is present in the box.
   */
  presentInBox(box_index: number, value: number): boolean {
    return this.getBox(box_index).some((cell) => cell.value === value);
  }

  /**
   * Check if a value is safe to place in a cell.
   * @param {number} row - The row of the cell.
   * @param {number} col - The column of the cell.
   * @param {number} value - The value to check for.
   * @returns {boolean} Whether the value is safe to place in the cell.
   */
  valueIsSafe(row: number, col: number, value: number): boolean {
    return (
      !this.presentInRow(row, value) &&
      !this.presentInCol(col, value) &&
      !this.presentInBox(this.boxIndex(row, col), value)
    );
  }
}
