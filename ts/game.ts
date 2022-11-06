"use strict";

class GameRules {
	public static normal(neighborCount: number, cellLife: boolean) : boolean {			// Spielregeln für das "normale" Game of Life
		return neighborCount == 3 || (neighborCount == 2 && cellLife);
	}

	public static inversed(neighborCount: number, cellLife: boolean) : boolean {     	// Spielregeln für inversed Game of Life
		return neighborCount != 5 && (neighborCount != 6 || cellLife);
	}
}

class Game {
	private _field: GameField;
	private _timerID: number = 0;
	private _tickInterval: number = 700;     // time in ms (min. 20 ms)
	private _isRunning: boolean = false;
	private _gameRules: Function;
	private _generation: number = 0;
	private _t_0: number = 0;

	public constructor(gameField: GameField) {
		this._field = gameField;
		this._gameRules = GameRules.normal;
	}

	public isGameRunning() : boolean {
		return this._isRunning;
	}

	public startGame() : void {
		if(!this._isRunning) {
			this._isRunning = true;
			this._timerID = window.setInterval(this.gameIteration.bind(this), 5);
		}
	}

	public pauseGame() : void {
		window.clearInterval(this._timerID);
		this._isRunning = false;
	}

	public changeInterval(interval: number) : void {
		this._tickInterval = interval;

		if(this._isRunning) {
			window.clearInterval(this._timerID);
			this._timerID = window.setInterval(this.gameIteration.bind(this), 5);
		}
	}

	public getGameField() : GameField { return this._field as GameField; }

	public getGArray() : GField { return this._field.field as GField; }

	public getGeneration() : string { return this._generation.toString(); }

	public gameIteration() : void {
		if(performance.now() - this._t_0 < this._tickInterval)
			return;	

		this._generation++;											// neue Generation
		this._field.field = this.getNextGen();
		this._field.draw();

		this._t_0 = performance.now();
	}

	private getNextGen() : GField {									// Erzeugt die nächste Generation
		let nextGen: GField = makeGField(this._field.cols, this._field.rows);
		let neighborCount: Function = this._field.getNeigborCount;
	
		for(let x = 0; x < this._field.cols; x++) {
			for(let y = 0; y < this._field.rows; y++) {
				if(this._gameRules(neighborCount(x, y), this._field.getCell(x, y))) {							
					nextGen[x][y] = 1;
				}
			}
		}
		
		return nextGen;
	}
}

// bestimmt ob diese Zelle in der nächsten Generation tod/lebendig ist, das wird durch
// 	- die Anzahl der Nachbarn
//	- die eigene "Lebendigkeit"
// bestimmt
