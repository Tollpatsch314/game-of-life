"use strict";

var game: Game;
var gameField: GameField;

// Berechnet die Mausposition anhand eines Click-Events auf einen Canvas
// - params: (canvas: HTMLCanvasElement ... der Canvas; evt: MouseEvent ... das Click-Event)
// - ret: (object ... besteht aus x: number & y: number)
function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) : {x: number, y: number} {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: Math.round(evt.clientY - rect.top)
	};
}

// Gibt die Zellenkoordinate (/Zellindex) zurück (basierend auf einer Canvas-Koordinate)
// - params: (mousePos: object ... x: number, y: number)
// - ret: (object: index, besteht aus x: number & y: number)
function getFieldPos(mousePos: {x: number, y: number}) : {x: number, y: number} {
	return {
		x: Math.floor(mousePos.x / (ctx.canvas.width / gameField.cols)),
		y: Math.floor(mousePos.y / (ctx.canvas.height / gameField.rows))
	};
}

// Variablen für das Seitenladen & die übergebenen Events
var mousedown: boolean, mouseIsSetting: boolean, veryFirstInit: boolean = true;

// Funktion die beim Laden der Seite aufgerufen wird
// - params: (void)
// - ret: void
function loadPage() : void {	// Funktion lädt die Seite und den Canvas, sowie wichtige Variablen
	canvas = document.getElementById("game-field") as HTMLCanvasElement;
	ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

	function calcCtxSize() {	// Berechnung des Context vom Canvas
		let min = Math.min(window.innerHeight, window.innerWidth);
		ctx.canvas.width = min / 10 * 8.6;
		ctx.canvas.height = min / 10 * 8.6;
	}

	calcCtxSize();

	// Default Werte					<=========
	game = new Game(new GameField(50, 50, drawField));
	gameField = game.getGameField();
	gameField.draw();

	// Deaktiviert reset-Button
	let btn = document.getElementById("btnReset") as HTMLButtonElement;
	btn.setAttribute("disabled", "true");

	// Radiobuttons auf Standart setzten
	setRadio("gameRule", 3, "0");
	setRadio("edgeRule", 3, "0");

	// Setzten des Intervalls zur Berechnung
	(document.getElementById("rngInterval") as HTMLInputElement).value = "700";
	changeInterval();

	// Setzten der Feldgröße (range)
	(document.getElementById("rngSize") as HTMLInputElement).value = "50";
	
	// Event-Funktionen
	if(veryFirstInit) {

		function drawEvent(evt: MouseEvent) : void {
			var pos = getFieldPos(getMousePos(canvas, evt));
			gameField.setCell(pos.x, pos.y, mouseIsSetting);
			gameField.draw();
		}

		canvas.addEventListener("mousedown", (evt) => {
			mousedown = true;
			var pos = getFieldPos(getMousePos(canvas, evt));
			mouseIsSetting = !gameField.getCell(pos.x, pos.y);
		});

		canvas.addEventListener("mouseup", (evt) => {
			drawEvent(evt);
			mousedown = false;
		});

		canvas.addEventListener("mousemove", (evt) => {
			if(!mousedown) return;
			drawEvent(evt);
		});

		canvas.addEventListener("mouseout", () => {
			mousedown = false;
		})

		canvas.addEventListener("click", drawEvent);

		window.addEventListener("resize", () => {
			calcCtxSize();
			gameField.draw();
		});

		veryFirstInit = false;
		f_pentomino();					// <======== Default Figure
	}
}

// Setzt die Radiobox
// - params: (name: string ... der Name sollte gleich sein, ohne Iterator; max: number ... Anzahl an Radiobuttons; ruleId: string nummer als String des zu setzten Radiobuttons)
// - ret: (void)
function setRadio(name: string, max: number, ruleId: string) {		// Setzt Radioboxen
	let n = parseInt(ruleId);
	for(let i = 0; i < max; i++) {
		(document.getElementById(name + i.toString()) as any).checked = false;
	}
	(document.getElementById(name + n.toString()) as any).click();
}

// Initialisiert das Spiel von einem String im gegebenen Konfigurationsformat (siehe README.md), erzeugt ein neues Feld &
// ändert Buttons entsprechend
// - params: (txt: string ... der String)
// - ret: (void)
function initFromText(txt: string) {

	let txtArr: string[] = txt.split("\n");
	let a_max: number = parseInt(txtArr[0]);					// Kantenlänge / Anzahl Felder 
	
	reset();
	gameField = new GameField(a_max, a_max, drawField);

	for(let x = 0; x < a_max; x++) {
		for(let y = 0; y < a_max; y++) {
			gameField.setCell(x, y, txtArr[x + 2][y] == '1');
		}
	}

	toggleGameRule(parseInt(txtArr[1][0]));
	toggleEdgeRule(parseInt(txtArr[1][1]));

	setRadio("gameRule", 3, txtArr[1][0]);
	setRadio("edgeRule", 3, txtArr[1][1]);

	game = new Game(gameField);
	gameField.draw();
}

// Ermöglicht das Herunterladen der Feldkonfiguration
// - params: (void)
// - ret: (void)
function downloadFieldConfig() {
	let txt: string = gameField.cols.toString() + "\n";

	switch(game.getGameRuleFunc()) {
		case GameRules.normal:			txt += "0"; break;
		case GameRules.inversed:		txt += "1"; break;
		case GameRules.copyWorld:		txt += "2"; break;
	}

	switch(gameField.getFieldCalculation()) {
		case FieldCalc.overlapingEdges:	txt += "0"; break;
		case FieldCalc.deadEdges:		txt += "1"; break;
		case FieldCalc.livingEdges:		txt += "2"; break;
	}

	for(let x = 0; x < gameField.cols; x++) {
		txt += "\n";
		for(let y = 0; y < gameField.rows; y++) {
			txt += gameField.getCell(x, y) ? "1" : "0";
		}
	}

	let file = new Blob([txt], {type: "text/plain"});
	let link = document.createElement("a") as any;
	link.setAttribute("href", URL.createObjectURL(file));
	link.setAttribute("download", "ABC.txt");
	link.click();
	URL.revokeObjectURL(link.href);
}

// Generiert eine Zufallszahl (Ganzzahl) im übergebenen Bereich
// - params: (min: number ... Minimus (einschl.); max: number ... Maximum (einschl.))
// - ret: (number ... die Zufallszahl)
function rand(min: number, max: number) : number {				// generiert Zufallszahl
	return Math.round(Math.random() * (max - min + 1) - 0.5) + min;
}

// Befüllt/leert die Zellen zufällig in einen gegebenen Prozentsatz
// - params: (percentageLivingCells: number ... Prozentsatz an lebendigen Zellen)
// - ret: (void)
function randInit(percentageLivingCells: number) : void {			// zufällige Befüllung, bzw. entfernen der Felder
	let absoluteCount = Math.round((percentageLivingCells / 100) * gameField.rows * gameField.cols);	// absolute Anzahl an gewünschten Feldern
	absoluteCount -= gameField.getLivingCellCount();				// zu ändernde Zellen

	let addVal: boolean;

	if(absoluteCount == 0)											// nichts zu ändern
		return;
	else if(absoluteCount > 0)										// es müssen welche hinzugefügt werden
		addVal = true;
	else {															// es müssen Felder entfernt werden
		addVal = false;
		absoluteCount *= -1;
	}

	function genX() : number { return rand(0, gameField.cols); }	// generiert eine zufällige Ordinate
	function genY() : number { return rand(0, gameField.rows); }	// generiert eine zufällige Abszisse

	let n = 0;														// Zähler für Felder

	while(true) {
		let x_spot: number = genX(), y_spot: number = genY();		// generiere Koordinaten eines "Spots"

		for(let k = 0; k < rand(2, 5); k++) {
			let x: number = rand(-2, 2) + x_spot,
				y: number = rand(-2, 2) + y_spot;
			x = (x + gameField.cols) % gameField.cols,
			y = (y + gameField.rows) % gameField.rows;

			if(gameField.getCell(x, y) ? !addVal : addVal)  {		// leider gibt es kein XOR in JS ):
				gameField.setCell(x, y, addVal);
				n++;
			}

			if(n >= absoluteCount) {								// Wenn Anzahl an lebendigen Zellen erreicht ist
				gameField.draw();
				return;
			}
		}
	}
}

// Aktiviert den Reset-Button
// - params: (void)
// - ret: (vodi)
function enableReset() : void {
	if(game.isResetable()) {
		let btn = document.getElementById("btnReset") as HTMLButtonElement;
		btn.removeAttribute("disabled");
	}
}

// Startet das Spiel, setzt Button entsprechend
// - params: (void)
// - ret: (void)
function startGame() : void {
	game.startGame();
	enableReset();
	let btn = document.getElementById("btnStartPause") as HTMLButtonElement;
	let rngDst = document.getElementById("rngDistrib") as HTMLInputElement;
	rngDst.setAttribute("disabled", "true");
    if(btn !== null) {
		btn.classList.replace("btn-start", "btn-pause");
    	btn.onclick = pauseGame;
    	btn.value = "Pause";
	}
}

// Pausiert das Spiel
// - params: (void)
// - ret: (void)
function pauseGame() : void {
	game.pauseGame();
	let btn = document.getElementById("btnStartPause") as HTMLButtonElement;
	let rngDst = document.getElementById("rngDistrib") as HTMLInputElement;
	rngDst.removeAttribute("disabled");

	if(btn !== null) {
		btn.classList.replace("btn-pause", "btn-start");
		btn.onclick = startGame;
		btn.value = "Start";
	}
}

// Startconfiguration beim Laden
// - params: (void)
// - ret: (void)
function f_pentomino() : void {
	gameField.setCell(25, 25, true);
	gameField.setCell(25, 26, true);
	gameField.setCell(25, 27, true);
	gameField.setCell(26, 25, true);
	gameField.setCell(24, 26, true);
	gameField.draw();
}
