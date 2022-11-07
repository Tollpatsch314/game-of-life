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

var mousedown: boolean, mouseIsSetting: boolean;
function loadPage() : void {	// Funktion lädt die Seite und den Canvas, sowie wichtige Variablen
	canvas = document.getElementById("game-field") as HTMLCanvasElement;
	ctx = canvas.getContext("2d");

	function calcCtxSize() {
		let min = Math.min(window.innerHeight, window.innerWidth);
		ctx.canvas.width = min / 10 * 9;
		ctx.canvas.height = min / 10 * 9;
	}

	calcCtxSize();

	// Default Werte					<=========
	game = new Game(new GameField(50, 50, drawField));
	gameField = game.getGameField();
	gameField.draw();

	// Deaktiviert reset-Button
	let btn = document.getElementById("btnReset") as HTMLButtonElement;
	btn.setAttribute("disabled", "true");

	// Pause => Start
	pauseGame();
	
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
}

function rand(min: number, max: number) : number {
	return Math.round(Math.random() * (max - min + 1) - 0.5) + min;
}

function randInit(percentageLivingCells: number) : void {
	let absoluteCount = Math.round((percentageLivingCells / 100) * gameField.rows * gameField.cols);
	absoluteCount -= gameField.getLivingCellCount();

	function genX() : number { return rand(0, gameField.cols); }
	function genY() : number { return rand(0, gameField.rows); }

	let n = 0;

	while(true) {
		let x_spot: number = genX(), y_spot: number = genY();

		for(let k = 0; k < rand(2, 5); k++) {
			let x: number = rand(-2, 2) + x_spot, y: number = rand(-2, 2) + y_spot;
			x = (x + gameField.cols) % gameField.cols, y = (y + gameField.rows) % gameField.rows;

			if(!gameField.getCell(x, y))  {
				gameField.setCell(x, y, true);
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
	loadPage();
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
    if(btn !== null) {
		btn.classList.replace("btn-start", "btn-pause");
    	btn.onclick = pauseGame;
    	btn.value = "Pause";
	}
}

function pauseGame() : void {
	game.pauseGame();
	let btn = document.getElementById("btnStartPause") as HTMLButtonElement;

	if(btn !== null) {
		btn.classList.replace("btn-pause", "btn-start");
		btn.onclick = startGame;
		btn.value = "Start";
	}
}

function clearField() : void {
	gameField = new GameField(50, 50, drawField);
}

function changeInterval() : void {
	let rng = document.getElementById("rngInterval") as HTMLInputElement;
	game.setInterval(parseInt(rng.value));
}

function drawField(field: GField) : void {
	let xCan, yCan, width;

	let lblGen = document.getElementById("lbl-generation") as HTMLLabelElement;
	lblGen.textContent = "Generation: " + game.getGeneration();

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let x = 0; x < gameField.cols; x++) {
		for (let y = 0; y < gameField.rows; y++) {
				xCan = x * ctx.canvas.height / gameField.cols;
				yCan = y * ctx.canvas.height / gameField.cols;
				width = ctx.canvas.height / gameField.cols;
			if (field[x][y] != 0) {
				ctx.fillRect(xCan, yCan, width, width);
			}
			else {
				ctx.fillStyle = "rgba(0, 0, 0, 0)";	
				ctx.fillRect(xCan, yCan, width, width)
				ctx.fillStyle = "rgb(0, 0, 0)";
				ctx.strokeRect(xCan, yCan, width, width);
			}
		}
	}
}

function f_pentomino() : void {
    gameField.field[25][25] = 1;
    gameField.field[25][26] = 1;
    gameField.field[25][27] = 1;
    gameField.field[26][25] = 1;
    gameField.field[24][26] = 1;
}
