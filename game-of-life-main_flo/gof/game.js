

function drawField(field) {
	var canv = document.getElementById("myCanvas");
	var ctx = canv.getContext("2d");
	ctx.canvas.width = window.innerHeight / 10 * 9;
	ctx.canvas.height = window.innerHeight / 10 * 9;

	for (let x = 0; x < field.length; x++) {
		for (let y = 0; y < field.length; y++) {
			a = x * ctx.canvas.height / 50;
			b = y * ctx.canvas.height / 50;
			c = ctx.canvas.height / 50;
			d = ctx.canvas.height / 50;
			if (field[x][y] == 1) {
				ctx.fillRect(a, b, c, d);
			}
			else {
				ctx.fillStyle =	"rgba(0, 0, 0, 0)";
				ctx.fillRect(a, b, c, d)
				ctx.fillStyle = "rgb(0, 0, 0, 255)";
				ctx.strokeRect(a, b, c, d);
			}
		}
	}
}

function myfunc() {
	
	let a, b, c, d;
	
	gamefield = twoDimensionArray(50, 50);
	gamefield[0][0] = 1;
	gamefield[1][1] = 1;
	gamefield[5][7] = 1;
	gamefield[49][49] = 1;
	gamefield[40][40] = 1;

	drawField(gamefield);

	//set up the canvas and context

	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");


	//report the mouse position on click
	canvas.addEventListener("click", function (evt) {
		var mousePos = getMousePos(canvas, evt);
		var x = Math.floor(mousePos.x / (ctx.canvas.height / 50));
		var y = Math.floor(mousePos.y / (ctx.canvas.height / 50));
		gamefield[x][y] = (gamefield[x][y] == 1 ? 0 : 1);

		drawField(gamefield);
	}, false);
}

function twoDimensionArray(a, b) {
	let arr = [];

	// creating two dimensional array
	for (let i = 0; i < a; i++) {
		for (let j = 0; j < b; j++) {
			arr[i] = [];
		}
	}

	// inserting elements to array
	for (let i = 0; i < a; i++) {
		for (let j = 0; j < b; j++) {
			arr[i][j] = 0;
		}
	}
	return arr;
}

function zelleneingabe() {
	document.getElementById('manuellbutton').innerHTML = 'hi'
	for (let i = 0; i < 5; i++) {
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.innerHTML = 'Press me';
		btn.className = 'btn-styled';
		btn.id = 'btn' + i.toString();
		document.getElementById('btn-feld').appendChild(btn);
	}
}

document.addEventListener('click', function () {

});


/*
document.addEventListener('DOMContentLoaded', function() {
	var button = document.createElement('button');
	button.type = 'button';
	button.innerHTML = 'Press me';
	button.className = 'btn-styled';
 
	button.onclick = function() {
		// …
	};
 
	var container = document.getElementById('container');
	container.appendChild(button);
}, false);

*/




//Get Mouse Position
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: Math.round(evt.clientY - rect.top)
	};
}