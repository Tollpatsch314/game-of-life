
/*
# Idee der Datenstruktur

- 8 Bit ( Array<Uint8Array> ) -> B000'UUUU
	=> B ... Boolean (Feld lebendig)
	=> U ... umgebende lebendige Felder

*/

var ctx: any;
var canvas: CanvasRenderingContext2D;
type Cell = { sourElmCount: number, alive: boolean };
type GField = Array<Array<Cell>>;
var field_size: [number, number];
var game_field: GField;

canv = document.getElementById("myCanvas");

function genGField(): GField {	// nicht schön, funktioniert aber
	return new Array<Array<Cell>>(field_size[0]).fill(new Array<Cell>(field_size[1]).fill({sourElmCount: 0, alive: false}));
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: Math.round(evt.clientY - rect.top)
	};
}

function loadPage() {	// Funktion lädt die Seite und den Canvas, sowie wichtige Variablen
	ctx.canvas.width = window.innerHeight / 10 * 9;
	ctx.canvas.height = window.innerHeight / 10 * 9;
	var canv = document.getElementById("myCanvas");
	ctx = canv.getContext("2d");

	initGame(50, 50);	// Default init

	drawField(game_field);
	
	// report the mouse position on click
	canv.addEventListener("click", function (evt) {
		var mousePos = getMousePos(canv, evt);
		var x = Math.floor(mousePos.x / (ctx.canvas.height / 50));
		var y = Math.floor(mousePos.y / (ctx.canvas.height / 50));

		game_field[x][y].alive = !game_field[x][y].alive;
		drawField(game_field);
	}, false);
}

function initGame(width: number, height: number) {
	field_size = [width, height];
	game_field = genGField();
}

const gameTimeInterval = 700;
var functionTimer: any;			// Speichert die ID der Timer-Funktion

function startGame() {
	functionTimer = window.setInterval(iterGame, gameTimeInterval, drawField);
	return true;
}

function pauseGame() {
	window.clearInterval(functionTimer);
}

// Gibt die Anzahl der umgebenden Feldern, welche leben zurück
function getEnvrmCount(field: GField, x: number, y: number): number {
	let
		l = (x == 0 ? field_size[0] - 1 : -1),			// left
		t = (y == 0 ? field_size[1] - 1 : -1),			// top
		r = (x == field_size[0] - 1 ? 0 : 1),			// right
		b = (y == field_size[1] - 1 ? 0 : 1);			// bottom

	function fld(xAdd: number, yAdd: number) {
		return field[x + xAdd][y + yAdd].alive ? 1 : 0;
	}

	return (
		fld(l, t) + fld(0, t) + fld(r, t) + 
		fld(l, 0) + 			fld(r, 0) +
		fld(l, b) + fld(0, t) + fld(r, b)
	);	
}

function convertField(field: GField) {
	field.forEach( (xVal, x, xArr) => {
		xVal.forEach( (yVal, y, yArr) => {
			yVal.sourElmCount = getEnvrmCount(field, x, y);
		} );
	} );
}

function drawField(field: GField) {
	let xCan, yCan, width;

	for (let x = 0; x < field.length; x++) {
		for (let y = 0; y < field[x].length; y++) {
				xCan = x * ctx.canvas.height / field_size[0];
				yCan = y * ctx.canvas.height / field_size[1];
				width = ctx.canvas.height / field_size[0];
			if (field[x][y].alive) {
				ctx.fillRect(xCan, yCan, width, width);
			}
			else {
				ctx.fillStyle =	"rgba(0, 0, 0, 0)";
				ctx.fillRect(xCan, yCan, width, width)
				ctx.fillStyle = "rgb(0, 0, 0, 255)";
				ctx.strokeRect(xCan, yCan, width, width);
			}
		}
	}
}

function iterGame(drawField: Function) {
	
	let new_field: GField = genGField();

	for(let x = 0; x < game_field.length; x++)
	{
		for(let y = 0; y < game_field.length; y++)
		{
			if (game_field[x][y].sourElmCount == 3 ||		// Tod und Drei Nachbarn, bzw. drei Nachbarn (gleiches Ergebnis)
				(game_field[x][y].sourElmCount == 2 && game_field[x][y].alive))	// Lebendig und zwei lebendige Nachbarn
			{
				new_field[x][y].alive;					// Erstes Bit => Zelle lebt
			}
		}
	}

	convertField(new_field);
	game_field = new_field;

	// TODO: Spielfeld Zeichnen
	// TODO: Funktion "pausieren"
}
