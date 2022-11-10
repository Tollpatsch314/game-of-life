"use strict";

// Klasse an vordefinierten Spielregeln für die Game-Klase
class GameRules {
	public static normal(neighborCount: number, cellLife: boolean) : boolean {			// Spielregeln für das "normale" Game of Life
		return neighborCount == 3 || (neighborCount == 2 && cellLife);
	}

	public static inversed(neighborCount: number, cellLife: boolean) : boolean {     	// Spielregeln für inversed Game of Life
		return neighborCount != 5 && (neighborCount != 6 || cellLife);
	}

	public static copyWorld(neighborCount: number/*, cellLife: boolean*/) : boolean {
		return neighborCount % 2 == 1;
	}
}

class Game {
	private _field: GameField;					// Speichert das Spielfeld
	private _timerID: number = 0;				// Id des Timers zum Aufruf in einen definierten Zeitintervall
	private _tickInterval: number = 700;		// Aufrufintervall in ms (min. 20 ms)
	private _isRunning: boolean = false;		// Speichert ob das Spiel läuft
	private _isResetable: boolean = false;		// Speichert ob das Spiel jemals gestartet wurde
	private _gameRules: Function;				// Funktionspointer zur "Spielregelfunktion"
	private _generation: number = 0;			// Iterator der aktuellen Generation
	private _t_0: number = 0;					// t_0 = Startzeitpunkt der aktuellen Generationsiteration (wird zur Berechung des Intervalls benötigt)

	// Konstruktor, setzt Spielregeln auf "normal", brauch ein Spielfeld
	// - params: (gameField: GameField ... Spielfeld (kann in Größe und berechnungsregeln vordefiniert sein))
	// - ret: Objekt der Klasse Game
	public constructor(gameField: GameField) {
		this._field = gameField;
		this._gameRules = GameRules.normal;
	}

	// Gibt zurück, ob das Spiel gerade am laufen ist
	// - params: (void)
	// - ret: (boolean ... ob Spiel läuft)
	public isGameRunning() : boolean { return this._isRunning; }

	// Gibt zurück ob das Spiel zurücksetzbar ist (also ob es jemals gestartet ist)
	// - params: (void)
	// - ret: (boolean ... Zurücksetzbarkeit)
	public isResetable() : boolean { return this._isResetable; }

	// Setzt das gesamte Spielfeld zurück, stopt ggf. das Spiel
	// - params: (void)
	// - ret: (boolean ... Erfolgsstatus)
	public reset() : boolean {
		if(!this._isResetable) return false;
		this.pauseGame();
		this._generation = 0;
		this._field.genField();
		return true;
	}

	// Startet das Spiel, setzt erforderliche Variablen dafür
	// - params: (void)
	// - ret: (void)
	public startGame() : void {
		if(!this._isRunning) {
			this._isRunning = true;
			this._isResetable = true;
			var t: Game = this;
			this._timerID = window.setInterval(t.gameIteration.bind(t), 5);
		}
	}

	// Pausiert das Spiel
	// - params: (void)
	// - ret: (void)
	public pauseGame() : void {
		window.clearInterval(this._timerID);
		this._isRunning = false;
	}

	// Ermöglicht das setzen / ändern von den Spielregeln (der Berechnung von der Lebendigkeit der Zellen der nächsten Generation)
	// - params: (func. Function (neighborCount: number, cellLife: boolean) => {  }; neighborCount ... Anzahl der Nachbarn, cellLife ... Anktuelle Zelle lebt)
	// - ret: (void)
	public setGameRules(func: Function) : void { this._gameRules = func; }

	// Gibt das gesetzte Intervall in welchen neue Generationen erzeugt werden zurück
	// - params: (void)
	// - ret: (number ... das Intervall in ms [20;[)
	public getInterval() : number { return this._tickInterval; }

	// Ändert das Intervall in welchen neue Generationen erzeugt werden
	// - params: (interval: number ... Intervall in ms, min 20 ms)
	// - ret: (void)
	public setInterval(interval: number) : void {
		this._tickInterval = interval;

		if(this._isRunning) {
			window.clearInterval(this._timerID);
			var t: Game = this;
			this._timerID = window.setInterval(t.gameIteration.bind(t), 5);
		}
	}

	// Ändert die Referenz des Spielfeldes innehalb des Objektes
	// - params: (fiels: GameField ... die Referenz)
	// - ret: (void)
	public setGameField(field: GameField) : void { this._field = field; }

	// Gibt ein Objekt der Spielffeldklassse zurück (bzw. Pointer)
	// - params: (void)
	// - ret: (GameField ... der Pointer)
	public getGameField() : GameField { return this._field as GameField; }

	// Gibt das wirkliche Feld (Array<Uint8array>) zurück (bzw. Pointer)
	// - params: (void)
	// - ret: (GField ... Array<Uint8array> => der Pointers)
	public getGArray() : GField { return this._field.field as GField; }

	// Gibt die Funktion zur Berechnung der Lebendigkeit der Zellen der nächsten Generation zurück
	// - params: (void)
	// - ret: (Function ... (neighborCount: number, cellLife: boolean) => {  }; neighborCount ... Anzahl der Nachbarn, cellLife ... Anktuelle Zelle lebt)
	public getGameRuleFunc() : Function { return this._gameRules as Function; }

	// Gibt den aktuellen Generationsiterator (als string) zurück
	// - params: (void)
	// - ret: (string ... der String)
	public getGeneration() : string { return this._generation.toString(); }

	// Wird (so das Spiel läuft) aller 5 ms aufgerufen. Testet ob Wartezeit erreicht wurde und führt ggf. die Berechnung der Folgegeneration aus
	// - params: (void)
	// - ret: (void)
	public gameIteration() : void {
		if(performance.now() - this._t_0 < this._tickInterval)		// => delta_t < festgelegtes Interval ?
			return;													//		==> return

		this._generation++;											// neue Generation
		this._field.field = this.getNextGen();
		this._field.draw();

		this._t_0 = performance.now();
	}

	// Generiert das Feld (Array!) der Folgegeneration.
	// - params: (void)
	// - ret: (GField ... das Feld)
	private getNextGen() : GField {									// Erzeugt die nächste Generation
		let nextGen: GField = makeGField(this._field.cols, this._field.rows);
		let neighborCount: Function = this._field.getNeigborCount.bind(this._field);
	
		for(let x = 0; x < this._field.cols; x++) {											// bestimmt ob diese Zelle in der nächsten Generation tod/lebendig ist, das wird durch
			for(let y = 0; y < this._field.rows; y++) {										// 	- die Anzahl der Nachbarn
				if(this._gameRules(neighborCount(x, y), this._field.getCell(x, y))) {		//	- die eigene "Lebendigkeit"
					nextGen[x][y] = 1;														// definiert
				}
			}
		}
		
		return nextGen;
	}
}
