
var game_field;
var game_field_size;

function ASSERT(condition, msg) {
	if(!condition) { throw new Error(msg || "Assertion failed!"); }
}

function initGame(SIZE)
{                                           // setzt die Spielfeldgröße und erstellt das Spielfeldarray
	ASSERT(typeof SIZE === "number");
	game_field_size = SIZE;
	game_field = genGameField(SIZE);

	gameIteration();
}

function genGameField(SIZE)	
{											// erstellt das Spielfeldarray
	
	ASSERT(typeof SIZE === "number");
	let field = new Array(SIZE).fill(new Array(SIZE).fill(0));        // Integer statt Booleans (lassen sich beim Zählen besser addieren)
	console.log(field);

	return field;
}

function getNeighborsCount(index, border = [[-1, 1], [-1, 1]])
{
	let x = index[0], y = index[1];
	//var [[l, r], [t, b]] = border; 	// [[left, rigth], [top, bottom]]
	let l = border[0][0], r = border[0][1], t = border[1][0], b = border[1][1]; 	// [[left, rigth], [top, bottom]]
	console.log (x + "|" + y + "|" + l + "|" + r + "|" + t + "|" + b);

	return (
		game_field[x + l][y + t] + game_field[  x  ][y + t] + game_field[x + r][y + t] + 
		game_field[x + l][  y  ] + /*       Index        */   game_field[x + r][  y  ] + 
		game_field[x + l][y + b] + game_field[  x  ][y + b] + game_field[x + r][y + b]
	);
}

function willDie(index, border) {
	let neighbors_count = getNeighborsCount(index, border);
	return neighbors_count >= 2 && neighbors_count <= 3;
}

function getNewValue(index, border) {
	return parseInt(willDie(index, border));
}

function gameIteration() {
	var new_game_field = genGameField(game_field_size);

	for (var x = 0; x < game_field.length; x++) {

		var border = [[-1, 1], [-1, 1]];
		if(x == 0) border = [[game_field_size - 1, 1], [- 1, 1]];
		else if (x == game_field.length - 1) border = [[- 1, - game_field_size - 1], [- 1, 1]]
		else {
			new_game_field[x][0] = getNewValue([x, 0], [[-1, 1], [game_field_size - 1, 1]]);
			new_game_field[x][game_field_size - 1] = getNewValue([x, 0], [[- 1, 1], [- 1, - game_field_size + 1]]);
			console.log("fsaf");
		}

		for (var y = 1; y < game_field[x].length - 1; y++) {
			new_game_field[x][y] = getNewValue([x, y], border);
		}

	}

	game_field = new_game_field;
}