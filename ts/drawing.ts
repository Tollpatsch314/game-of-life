"use strict";

var ctx: CanvasRenderingContext2D;								// Context auf den gezeichnet wird
var canvas: HTMLCanvasElement;									// Canvas für den Context

// Zeichnet das Feld auf ein Canvas, Funktion wird an das Spielfeldobjekt der GameField Klasse übergeben
// - params: (field: GField ... Das Array was gezeichnet wird)
// - ret: (void)
function drawField(field: GField) : void {
	let xCan, yCan, width;
	let count = 0;

	ctx.clearRect(0, 0, canvas.width, canvas.height);			// leert das Canvas

	for (let x: number = 0; x < gameField.cols; x++) {
		for (let y: number = 0; y < gameField.rows; y++) {
			xCan = x * ctx.canvas.width / gameField.cols;
			yCan = y * ctx.canvas.height / gameField.rows;
			width = ctx.canvas.width / gameField.cols;

			if (field[x][y] != 0) {								// Feld lebendig
				ctx.fillRect(xCan, yCan, width, width);
				count++;
			}
			else {												// Feld tot
				ctx.fillStyle = "rgba(0, 0, 0, 0)";				// leer zeichnen (das davor entfernen, so vorhanden)
				ctx.fillRect(xCan, yCan, width, width)
				ctx.fillStyle = "rgb(0, 0, 0)";
				ctx.strokeRect(xCan, yCan, width, width);
			}
		}
	}

	// Anteil an lebendigen Zellen berechnen & im Slider verändern
	setDistribDspl(100 * count / (gameField.cols * gameField.rows));

	// Generations-Label setzten
	let lblGen = document.getElementById("lbl-generation") as HTMLLabelElement;
	lblGen.textContent = game.getGeneration();
}
