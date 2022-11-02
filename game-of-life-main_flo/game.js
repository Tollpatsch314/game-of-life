"use strict";
/*
# Idee der Datenstruktur

- 8 Bit ( Array<Uint8Array> ) -> B000'UUUU
    => B ... Boolean (Feld lebendig)
    => U ... umgebende lebendige Felder

*/
var ctx;
var canv;
var field_size;
var game_field;
canv = document.getElementById("myCanvas");

function f() {return{ sourElmCount: 0, alive: false }; }

const def = {sourElmCount: 0, alive: false};

function genGField() {
	var arr = [];

	// inserting elements to array
	for (let i = 0; i < field_size[0]; i++) {
		arr[i] = [];
		for (let j = 0; j < field_size[0]; j++) {
			arr[i][j] = { sourElmCount: 0, alive: false };
		}
	}
	return arr;
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: Math.round(evt.clientY - rect.top)
    };
}
function loadPage() {
    var canv = document.getElementById("myCanvas");
    ctx = canv.getContext("2d");
	ctx.canvas.width = window.innerHeight / 10 * 9;
    ctx.canvas.height = window.innerHeight / 10 * 9;
    initGame(50, 50); // Default init
    drawField(game_field);
    // report the mouse position on click
    canv.addEventListener("click", function (evt) {
        var mousePos = getMousePos(canv, evt);
        var x = Math.floor(mousePos.x / (ctx.canvas.width / 50));
        var y = Math.floor(mousePos.y / (ctx.canvas.height / 50));
        game_field[x][y].alive = !game_field[x][y].alive;
        drawField(game_field);
    }, false);
}
function initGame(width, height) {
    field_size = [width, height];
    game_field = genGField();
    f_pentomino();
}
const gameTimeInterval = 700;
var functionTimer; // Speichert die ID der Timer-Funktion
function startGame() {
    functionTimer = window.setInterval(iterGame, gameTimeInterval, drawField);
    return true;
}
function pauseGame() {
    window.clearInterval(functionTimer);
}
// Gibt die Anzahl der umgebenden Feldern, welche leben zurück
function getEnvrmCount(field, x, y) {
    let l = (x == 0 ? field_size[0] - 1 : -1), // left
    	t = (y == 0 ? field_size[1] - 1 : -1), // top
    	r = (x == field_size[0] - 1 ? -x : 1), // right
    	b = (y == field_size[1] - 1 ? -y : 1); // bottom

    function fld(xAdd, yAdd) {
        return (field[x + xAdd][y + yAdd].alive ? 1 : 0);
    }

    return (fld(l, t) + fld(0, t) + fld(r, t) +
        fld(l, 0) +                fld(r, 0) +
        fld(l, b) + fld(0, b) + fld(r, b));
}
function convertField(field) {
    field.forEach((xVal, x, xArr) => {
        xVal.forEach((yVal, y, yArr) => {
            yVal.sourElmCount = getEnvrmCount(field, x, y);
        });
    });
	return field;
}
function drawField(field) {
    let xCan, yCan, width;
	console.log(field);
    for (let x = 0; x < field.length; x++) {
        for (let y = 0; y < field[x].length; y++) {
            xCan = x * ctx.canvas.height / 50;
            yCan = y * ctx.canvas.height / 50;
            width = ctx.canvas.height / 50;
            if (field[x][y].alive) {
                ctx.fillRect(xCan, yCan, width, width);
				console.log("a");
            }
            if(!field[x][y].alive) {
                ctx.fillStyle = "rgb(0, 0, 255)";
                ctx.fillRect(xCan, yCan, width, width);
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.strokeRect(xCan, yCan, width, width);
            }
        }
    }
}
function iterGame(drawField) {
    let new_field = genGField();
	game_field = convertField(game_field);

    for (let x = 0; x < game_field.length; x++) {
        for (let y = 0; y < game_field[x].length; y++) {
            if (game_field[x][y].sourElmCount == 3 || // Tod und Drei Nachbarn, bzw. drei Nachbarn (gleiches Ergebnis)
                (game_field[x][y].sourElmCount == 2 && game_field[x][y].alive)) // Lebendig und zwei lebendige Nachbarn
             {
                new_field[x][y].alive = true;
            }
        }
    }
    game_field = new_field;
	drawField(new_field);
	console.log("134");
    // TODO: Spielfeld Zeichnen
    // TODO: Funktion "pausieren"
}


function f_pentomino() {
    game_field[25][25].alive = true;
    game_field[25][26].alive = true;
    game_field[25][27].alive = true;
    game_field[26][25].alive = true;
    game_field[24][26].alive = true;
}