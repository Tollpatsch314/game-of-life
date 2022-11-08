"use strict";

type GField = Array<Uint8Array>;													// Definiert zur Abkürzung den Typen GField

// Erstellt das Feld(Array<Uint8Array>) über welches das Spielfeld dargestellt wird, initalisiert es mit 0
// - params: (cols: number, rows: number ... x_max und y_max)
// - ret: (GField ... das Feld, bzw. Pointer dorthin)
function makeGField(cols: number, rows: number) : GField {
	let arr = new Array<Uint8Array>(cols);
	for(let x: number = 0; x < cols; x++) arr[x] = new Uint8Array(rows).fill(0);
	return arr;
}

// Klasse an vordefinierten Randberechnungsregeln für die Klasse GameField
class FieldCalc {
	public static overlapingEdges(f: GameField, x: number, y: number) : number {	// Die Ränder "überlappen" (x = 0) - 1 => x_max, usw.
		return f.field[(x + f.cols) % f.cols][(y + f.rows) % f.rows] as number;
	}

	public static deadEdges(f: GameField, x: number, y: number) : number {			// Die Ränder werden als tod interpretiert
		let l = (f.field as GField)?.[x]?.[y];
		return (l !== undefined) ? l : 0;
	}

	public static livingEdges(f: GameField, x: number, y: number) : number {		// Die Ränder werden als lebendig interpretiert
		let l = (f.field as GField)?.[x]?.[y];										// ?. lässt undefined zu
		return (l !== undefined) ? l : 1;
	}

	public static mirrorEdges(f: GameField, x: number, y: number) : number {		// Die Ränder spiegeln die Lebendigkeit (an der x- und y-Achse)
		let l = (f.field as GField)[x][y];											// TODO
		return (l !== undefined) ? l : 1;
	}
}

class GameField {
	public   field: GField;
	public   cols: number /* x_max */;
	public   rows: number /* y_max */;
	private _drawFunc: Function;			// Speichert die Zeichenfunktion (änderbar)
	private _fieldCalcFunc: Function;		// Speichert die Berechnungsfunktion (änderbar)

	// Konstruktor, benötigt Anzahl der Spaltern und Zeilen des Spielfeldes, sowie die Zeichenfunktion
	// - params: (cols: number ... Spalten; rows: number ... Zeilen; drawFunc: Function (GField) => {  } ... die Zeichenfunktion des Spielfeldes)
	// - ret: das Objekt der Klasse GameField
	public constructor(cols: number, rows: number, drawFunc: Function) {
		this.cols = cols;
		this.rows = rows;
		this.field = makeGField(this.cols, this.rows);
		this._drawFunc = drawFunc;
		this._fieldCalcFunc = FieldCalc.overlapingEdges;
	}

	// Generiert auf Basis der übergebenen Werte des Konstruktors das Feld (Array)
	// - params: (void)
	// - ret: (void)
	public genField() : void { this.field = makeGField(this.cols, this.rows); }

	// Setz die Funktion zur Berechung der Ränder und das Feldes (i.w.S.)
	// - params: (calcFunc: Function  (field: GameField, x: number, y: number) => {  } )
	// - ret: (void)
	public setFieldCalculation(calcFunc: Function) : void { this._fieldCalcFunc = calcFunc; }

	// Gibt die aktuelle Berechnungsfunktion zurück
	// - parmas: (void)
	// - ret: (Function ... die Funktion)
	public getFieldCalculation() : Function { return this._fieldCalcFunc; }

	// Gibt den Lebendigkeitsstatus der angeforederten Zelle zurück
	// - params: (x: number, y: number ... Koordinaten absufragenden Zelle)
	// - ret: (boolean ... lebt die Zelle?)
	public getCell(x: number, y: number) : boolean { return this.field[x][y] != 0; }

	// Setzt den Lebendigkeitsstatus der über die Koordinaten bestimmte Zelle
	// - params: (x: number, y: number ... Koordinaten; alive: boolean ... Status)
	// - ret: (void)
	public setCell(x: number, y: number, alive: boolean) : void { this.field[x][y] = alive ? 1 : 0; }

	// Zeichnet das Feld über die definierte Zeichenfunktion
	// - params: (void)
	// - ret: (void)
	public draw() : void { this._drawFunc(this.field); }

	// Gibt die Anzahl der aktuell Lebendigen Zellen auf dem Feld zurück
	// - params: (void)
	// - ret: (number ... die Anzahl)
	public getLivingCellCount() : number {
		let count = 0;

		for(let x: number = 0; x < this.cols; x++) {
			for(let y: number = 0; y < this.rows; y++) {
				if(this.getCell(x, y)) count++;
			}
		}

		return count;
	}
	
	// Gibt die Anzahl der lebendigen Nachbarzellen der über die Koordinaten übergebenen Zelle zurück
	// - params: (x: number, y: number ... Koordinaten)
	// - ret: (number ... Anzahl der Nachbarn [0; 8]) 
	public getNeigborCount(x: number, y: number) : number {							// Anzahl der leb. Nachbarn
		let count: number = -this._fieldCalcFunc(this, x, y);						// Eigenes Feld wird in den for-Schleifen mit beachtet

		for(let delta_y: number = -1; delta_y < 2; delta_y++) {						// Nachbarzellen: x ... Nachbarzellen; o ... aktuelle Zelle
			for(let delta_x: number = -1; delta_x < 2; delta_x++) {					// x x x
				count += this._fieldCalcFunc(this, x + delta_x, y + delta_y);		// x o x
			}																		// x x x
		}
		
		return count;
	}
}
