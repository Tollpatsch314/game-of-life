"use strict";

type GField = Array<Uint8Array>;

function makeGField(cols: number, rows: number) : GField {
	let arr = new Array<Uint8Array>(cols);
	for(let x: number = 0; x < cols; x++) arr[x] = new Uint8Array(rows).fill(0);
	return arr;
}

class FieldCalc {
	public static overlapingEdges(f: GameField, x: number, y: number) : number {	// Die Ränder "überlappen" (x = 0) - 1 => x_max, usw.
		return f.field[(x + f.cols) % f.cols][(y + f.rows) % f.rows] as number;
	}

	public static deadEdges(f: GameField, x: number, y: number) : number {			// Die Ränder werden als tod interpretiert
		let l = (f.field as GField)[x][y];
		return l !== undefined ? l : 0;
	}

	public static livingEdges(f: GameField, x: number, y: number) : number {		// Die Ränder werden als lebendig interpretiert
		let l = (f.field as GField)[x][y];
		return l !== undefined ? l : 1;
	}

	public static mirrorEdges(f: GameField, x: number, y: number) : number {		// Die Ränder spiegeln die Lebendigkeit (an der x- und y-Achse)
		let l = (f.field as GField)[x][y];											// TODO
		return l !== undefined ? l : 1;
	}
}

class GameField {
	public   field: GField;
	public   cols: number /* x_max */;
	public   rows: number /* y_max */;
	private _drawFunc: Function;			// Speichert die Zeichenfunktion (änderbar)
	private _fieldCalcFunc: Function;		// Speichert die Berechnungsfunktion (änderbar)

	public constructor(cols: number, rows: number, drawFunc: Function) {
		this.cols = cols;
		this.rows = rows;
		this.field = makeGField(this.cols, this.rows);
		this._drawFunc = drawFunc;
		//this.draw();
		this._fieldCalcFunc = FieldCalc.overlapingEdges;
	}

	public genField() : void { this.field = makeGField(this.cols, this.rows); }

	public setFieldCalculation(calcFunc: Function) : void { this._fieldCalcFunc = calcFunc; }

	public getCell(x: number, y: number) : boolean { return this.field[x][y] != 0; }

	public setCell(x: number, y: number, alive: boolean) : void { this.field[x][y] = alive ? 1 : 0; }

	public draw() : void { this._drawFunc(this.field); }

	public getLivingCellCount() : number {
		let count = 0;

		for(let x: number = 0; x < this.cols; x++) {
			for(let y: number = 0; y < this.rows; y++) {
				if(this.getCell(x, y)) count++;
			}
		}

		return count;
	}

	public getNeigborCount(x: number, y: number) : number {
		let count: number = -this._fieldCalcFunc(this, x, y);						// Eigenes Feld wird in den for-Schleifen mit beachtet

		for(let delta_y: number = -1; delta_y < 2; delta_y++) {
			for(let delta_x: number = -1; delta_x < 2; delta_x++) {
				count += this._fieldCalcFunc(this, x + delta_x, y + delta_y);
			}
		}
		
		return count;
	}
}
