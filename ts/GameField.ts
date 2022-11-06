"use strict";

type GField = Array<Uint8Array>;

function makeGField(cols: number, rows: number): GField {
	let arr = new Array<Uint8Array>(cols);
	for(let x: number = 0; x < cols; x++) arr[x] = new Uint8Array(rows).fill(0);
	return arr;
}

class FieldCalc {
	public static overlapingEdges(f: GameField, x: number, y: number) : number {
		return f.field[(x + f.cols) % f.cols][(y + f.rows) % f.rows] as number;
	}

	public static endingEdges(f: GameField, x: number, y: number) : number {
		let l = (f.field as GField)[x][y];
		return l !== undefined ? l : 0;
	}
}

class GameField {
	public   field: GField;
	public   cols: number /* x_max */;
	public   rows: number /* y_max */;
	private _drawFunc: Function;
	private _fieldCalcFunc: Function;

	public constructor(cols: number, rows: number, drawFunc: Function) {
		this.cols = cols;
		this.rows = rows;
		this.field = makeGField(this.cols, this.rows);
		this._drawFunc = drawFunc;
		//this.draw();
		this._fieldCalcFunc = FieldCalc.overlapingEdges;
	}

	public genField() : void { this.field = makeGField(this.cols, this.rows); }

	public changeFieldCalculation(calcFunc: Function) : void { this._fieldCalcFunc = calcFunc; }

	public getCell(x: number, y: number) : boolean { return this.field[x][y] != 0; }

	public setCell(x: number, y: number, alive: boolean) : void { this.field[x][y] = alive ? 1 : 0; }

	public draw() : void { this._drawFunc(this.field); }

	public getNeigborCount(x: number, y: number) : number {
		let count: number = -this._fieldCalcFunc(this, x, y);

		for(let delta_y: number = -1; delta_y < 2; delta_y++) {
			for(let delta_x: number = -1; delta_x < 2; delta_x++) {
				count += this._fieldCalcFunc(this, x, y);
			}
		}

		return count;
	}
}
