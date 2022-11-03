var ctx: any;
var canvas: HTMLCanvasElement;

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: Math.round(evt.clientY - rect.top)
	};
}

function getFieldPos(mousePos: {x: number, y: number}): object {
	return {
		x: Math.floor(mousePos.x / (ctx.canvas.height / GFieldData.cols)),
		y: Math.floor(mousePos.y / (ctx.canvas.height / GFieldData.rows))
	};
}

var mousedown: boolean, mouseIsSetting: boolean;
function loadPage() {	// Funktion lädt die Seite und den Canvas, sowie wichtige Variablen
	canvas = document.getElementById("game-field") as HTMLCanvasElement;
	ctx = canvas.getContext("2d");

	function calcCtxSize() {
		ctx.canvas.width = window.innerHeight / 10 * 9;
		ctx.canvas.height = window.innerHeight / 10 * 9;
	}

	calcCtxSize();

	// Default Werte
	GFieldData.cols = 50;
	GFieldData.rows = 50;
	GFieldData.genField();
	drawField(GFieldData.field);
	
	function drawEvent(evt: MouseEvent): void {
		var pos = getFieldPos(getMousePos(canvas, evt));
		GFieldData.field[pos.x][pos.y] = mouseIsSetting ? 1 : 0;
		drawField(GFieldData.field);
	}

	canvas.addEventListener("mousedown", function (evt) {
		mousedown = true;
		var pos = getFieldPos(getMousePos(canvas, evt));
		mouseIsSetting = GFieldData.field[pos.x][pos.y] != 0 ? false : true;
	});

	canvas.addEventListener("mouseup", function (evt) {
		drawEvent(evt);
		mousedown = false;
	});

	canvas.addEventListener("mousemove", function(evt) {
		if(!mousedown) return;
		drawEvent(evt);
	});

	canvas.addEventListener("click", drawEvent);

	window.addEventListener("resize", function(evt) {
		calcCtxSize();
		drawField(GFieldData.field);
	});
}

function startGame(): void {
	GameStates.startGame(drawField);
	let btn = document.getElementById("btnStartPause") as HTMLButtonElement;
    if(btn !== null) {
		btn.classList.replace("btn-start", "btn-pause");
    	btn.onclick = pauseGame;
    	btn.value = "Pause";
	}
}

function pauseGame(): void {
	GameStates.pauseGame();
	let btn = document.getElementById("btnStartPause") as HTMLButtonElement;
	if(btn !== null) {
		btn.classList.replace("btn-pause", "btn-start");
		btn.onclick = startGame;
		btn.value = "Start";
	}
}

function clearField(): void {
	pauseGame();
	drawField(GFieldData.genField());
}

function drawField(field: GField): void {
	let xCan, yCan, width;

	for (let x = 0; x < GFieldData.cols; x++) {
		for (let y = 0; y < GFieldData.rows; y++) {
				xCan = x * ctx.canvas.height / GFieldData.cols;
				yCan = y * ctx.canvas.height / GFieldData.cols;
				width = ctx.canvas.height / GFieldData.cols;
			if (field[x][y] != 0) {
				ctx.fillRect(xCan, yCan, width, width);
			}
			else {
				ctx.fillStyle = "rgb(245, 245, 245)";		// <== keine schönere Lösung gefunden (die funktioniert)
				ctx.fillRect(xCan, yCan, width, width)
				ctx.fillStyle = "rgb(0, 0, 0)";
				ctx.strokeRect(xCan, yCan, width, width);
			}
		}
	}
}

function f_pentomino() {
    GFieldData.field[25][25] = 1;
    GFieldData.field[25][26] = 1;
    GFieldData.field[25][27] = 1;
    GFieldData.field[26][25] = 1;
    GFieldData.field[24][26] = 1;
}
