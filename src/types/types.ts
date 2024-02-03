export type Cell = {
  num: number;
};
export type CellArray = Cell[];
export type CellArray2D = Cell[][];
export type CellArray3D = Cell[][][];

export interface Matrix {
  [row: number]: {
    [col: number]: Cell;
  };
}

export interface Matrix3D {
  [box: number]: Matrix;
}
