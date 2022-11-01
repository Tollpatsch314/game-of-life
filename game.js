
var game_field;
var game_field_size;

function ASSERT(condition, msg) {
	if(!condition) { throw new Error(msg || "Assertion failed!"); }
}

function initGame(SIZE)
{                                           // setzt die Spielfeldgröße und erstellt das Spielfeldarray
	ASSERT(typeof SIZE === "number")
	game_field_size = SIZE;
	game_field = genGameField(SIZE);
}

function genGameField(SIZE)	
{											// erstellt das Spielfeldarray
	
	ASSERT(typeof SIZE === "number")
	let field = new Int8Array(SIZE);        // Integer statt Booleans (lassen sich beim Zählen besser addieren)
	field.forEach( x => {
			x = new Int8Array(SIZE);
			x.forEach(y => { y = 0 });
	});
	return field;
}

function getNeighborsCount(index, border = [0, 0])
{
	const [x, y] = index;
	const [x_border, y_border] = border;

	return  game_field[x + 1][y + 1] + game_field[x + 1][y] + game_field[x + 1][y - 1] + 
			game_field[  x  ][y + 1] + /*     Index      */   game_field[  x  ][y - 1] + 
			game_field[x - 1][y + 1] + game_field[x - 1][y] + game_field[x - 1][y - 1];
}

function willDie(index)
{
	let neighbors_count = getNeighborsCount(index);
	return neighbors_count >= 2 && neighbors_count <= 3;
}

function gameIteration() {
	var new_game_field = genGameField(game_field_size);

	for (var x = 1; x < game_field.length - 1; x++) {
		getNeighborsCount([0])
		for (var y = 1; y < game_field[x].length - 1; y++) {
			new_game_field[x][y] = parseInt(willDie([x, y]));
		}

	}

	game_field = new_game_field;
}