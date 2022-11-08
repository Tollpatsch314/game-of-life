"use strict";

var ctx: any;
var canvas: HTMLCanvasElement;
var game: Game;
var gameField: GameField;

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) : {x: number, y: number} {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: Math.round(evt.clientY - rect.top)
	};
}

function getFieldPos(mousePos: {x: number, y: number}) : {x: number, y: number} {
	return {
		x: Math.floor(mousePos.x / (ctx.canvas.width / gameField.cols)),
		y: Math.floor(mousePos.y / (ctx.canvas.height / gameField.rows))
	};
}

var mousedown: boolean, mouseIsSetting: boolean, veryFirstInit: boolean = true;
function loadPage() : void {	// Funktion lädt die Seite und den Canvas, sowie wichtige Variablen
	canvas = document.getElementById("game-field") as HTMLCanvasElement;
	ctx = canvas.getContext("2d");

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
	
	// event-Funktionen
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

function initFromText(txt: string) {
	let txtArr: string[] = txt.split("\n");
	let a_max: number = parseInt(txtArr[0]);
	
	gameField = new GameField(a_max, a_max, drawField);

	for(let x = 0; x < a_max; x++) {
		for(let y = 0; y < a_max; y++) {
			gameField.setCell(x, y, txtArr[x + 2][y] == '1');
		}
	}
	
	toggleGameRule(parseInt(txtArr[1][0]));
	toggleEdgeRule(parseInt(txtArr[1][1]));

	function setRadio(name: string, max: number, ruleId: string) {
		let n = parseInt(ruleId);
		for(let i = 0; i < max; i++) {
			document.getElementById(name + i.toString())?.removeAttribute("checked");
			if(n == i) document.getElementById(name + i.toString())?.setAttribute("checked", "true");
		}
	}

	setRadio("gameRule", 2, txtArr[1][0]);
	setRadio("edgeRule", 4, txtArr[1][1]);

	game = new Game(gameField);
	gameField.draw();
}

function downloadConf() {
	pauseGame();
	let txt: string = gameField.cols.toString() + "\n";

	switch(game.getGameRuleFunc()) {
		case GameRules.normal:			txt += "0"; break;
		case GameRules.inversed:		txt += "1"; break;
	}

	switch(gameField.getFieldCalculation()) {
		case FieldCalc.overlapingEdges:	txt += "0"; break;
		case FieldCalc.deadEdges:		txt += "1"; break;
		case FieldCalc.livingEdges:		txt += "2"; break;
		case FieldCalc.mirrorEdges:		txt += "3"; break;
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

async function uploadfile(file: File) {
	let txt: string = await file.text();
	initFromText(txt);
}

function rand(min: number, max: number) : number {				// generiert Zufallszahl
	return Math.round(Math.random() * (max - min + 1) - 0.5) + min;
}

function randInit(percentageLivingCells: number) : void {		// zufällige Befüllung, bzw. entfernen der Felder
	let absoluteCount = Math.round((percentageLivingCells / 100) * gameField.rows * gameField.cols);	// absolute Anzahl an gewünschten Feldern
	absoluteCount -= gameField.getLivingCellCount();			// zu ändernde Zellen

	let addVal: boolean;

	if(absoluteCount == 0)										// nichts zu ändern
		return;
	else if(absoluteCount > 0)									// es müssen welche hinzugefügt werden
		addVal = true;
	else {														// es müssen Felder entfernt werden
		addVal = false;
		absoluteCount *= -1;
	}

	function genX() : number { return rand(0, gameField.cols); }	// generiert eine zufällige Ordinate
	function genY() : number { return rand(0, gameField.rows); }	// generiert eine zufällige Abszisse

	let n = 0;														// Zähler für Felder

	while(true) {
		let x_spot: number = genX(), y_spot: number = genY();		// generiere Koordinaten eines "Spots"

		for(let k = 0; k < rand(2, 5); k++) {
			let x: number = rand(-2, 2) + x_spot, y: number = rand(-2, 2) + y_spot;
			x = (x + gameField.cols) % gameField.cols, y = (y + gameField.rows) % gameField.rows;

			if(gameField.getCell(x, y) ? !addVal : addVal)  {		// leider gibt es kein XOR in JS ):
				gameField.setCell(x, y, addVal);
				n++;
			}

			if(n >= absoluteCount) {
				gameField.draw();
				return;
			}
		}
	}
}

function reset() : void {
	game.reset();
	gameField = game.getGameField();
	gameField.draw();

	// Deaktivere Reset
	let btn = document.getElementById("btnReset") as HTMLButtonElement;
	btn.setAttribute("disabled", "true");

	pauseGame();	// Pause => Start
}

function enableReset() : void {
	if(game.isResetable()) {
		let btn = document.getElementById("btnReset") as HTMLButtonElement;
		btn.removeAttribute("disabled");
	}
}

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

function toggleGameRule(ruleId: number) : void {
	switch(ruleId) {
		case 0: game.setGameRules(GameRules.normal);	break;
		case 1: game.setGameRules(GameRules.inversed);	break;
	}
}

function toggleEdgeRule(ruleId: number) : void {	
	switch(ruleId) {
		case 0: gameField.setFieldCalculation(FieldCalc.overlapingEdges);	break;
		case 1: gameField.setFieldCalculation(FieldCalc.deadEdges);			break;
		case 2: gameField.setFieldCalculation(FieldCalc.livingEdges);		break;
		case 3: gameField.setFieldCalculation(FieldCalc.mirrorEdges);		break;
	}
}

function changeInterval() : void {
	let rng = document.getElementById("rngInterval") as HTMLInputElement;
	game.setInterval(parseInt(rng.value));
	let lbl = document.getElementById("lblInterval") as HTMLLabelElement;
	lbl.innerHTML = rng.value;

}

function setDistribDspl(percentageLivingCells: number) : void {
	let rng = document.getElementById("rngDistrib") as HTMLInputElement;
	rng.value = percentageLivingCells.toString();
	let lbl = document.getElementById("lblDistrib") as HTMLLabelElement;
	lbl.innerHTML = rng.value;
}

function changeDistrib() : void {
	let rng = document.getElementById("rngDistrib") as HTMLInputElement;
	randInit(parseFloat(rng.value));
	let lbl = document.getElementById("lblDistrib") as HTMLLabelElement;
	lbl.innerHTML = rng.value;
}

function drawField(field: GField) : void {
	let xCan, yCan, height, width;

	// Generations-Label setzten
	let lblGen = document.getElementById("lbl-generation") as HTMLLabelElement;
	lblGen.textContent = game.getGeneration();

	let count = 0;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let x = 0; x < gameField.cols; x++) {
		for (let y = 0; y < gameField.rows; y++) {
			xCan = x * ctx.canvas.width / gameField.cols;
			yCan = y * ctx.canvas.height / gameField.rows;
			width = ctx.canvas.width / gameField.cols;
			height =  ctx.canvas.height / gameField.rows

			if (field[x][y] != 0) {
				ctx.fillRect(xCan, yCan, width, height);
				count++;
			}
			else {
				ctx.fillStyle = "rgba(0, 0, 0, 0)";	
				ctx.fillRect(xCan, yCan, width, height)
				ctx.fillStyle = "rgb(0, 0, 0)";
				ctx.strokeRect(xCan, yCan, width, height);
			}
		}
	}

	// Anteil an lebendigen Zellen berechnen & im Slider verändern
	setDistribDspl(100 * count / (gameField.cols * gameField.rows));
}

function f_pentomino() : void {
	gameField.setCell(25, 25, true);
	gameField.setCell(25, 26, true);
	gameField.setCell(25, 27, true);
	gameField.setCell(26, 25, true);
	gameField.setCell(24, 26, true);
	gameField.draw();
}
