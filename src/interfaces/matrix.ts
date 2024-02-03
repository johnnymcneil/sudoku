import type { ICell } from './cell';
import type { Monomial, Binomial } from '../types/polynomials';

export interface ISudoku {
  size: number;
  sqrt: number;
  grid: ICell[][];
  getRow: (row: number) => ICell[];
  getCol: (col: number) => ICell[];
  getBox: (box_index: number) => ICell[];
  boxIndex: Monomial | Binomial;
  cellIndex: (row: number, col: number) => number;
  presentInRow: (row: number, value: number) => boolean;
  presentInCol: (col: number, value: number) => boolean;
  presentInBox: (box_index: number, value: number) => boolean;
  valueIsSafe: (row: number, col: number, value: number) => boolean;
}
