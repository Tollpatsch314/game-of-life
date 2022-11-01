
/*
# Idee der Datenstruktur

- 8 Bit ( Array<Uint8Array> ) -> B000'UUUU
	=> B ... Boolean (Feld lebendig)
	=> U ... umgebende lebendige Felder

*/

type GField = Array<Uint8Array>;
var field_size: [number, number];
var game_field: GField;

function genGField(): GField {
	return Array(field_size[0]).fill(new Uint8Array(field_size[1]).fill(0));
}

function initGame(width, height) {
	field_size = [width, height];
	game_field = genGField();
}

// Gibt die Anzahl der umgebenden Feldern, welche leben zurück
function getEnvrmCount(field: GField, x: number, y: number): number {
	let
		l = (x == 0 ? field_size[0] - 1 : -1),			// left
		t = (y == 0 ? field_size[1] - 1 : -1),			// top
		r = (x == field_size[0] - 1 ? 0 : 1),			// right
		b = (y == field_size[1] - 1 ? 0 : 1);			// bottom

	function fld(xAdd: number, yAdd: number) {	// "... & 0x80 "  maskiert den uint8 auf das erste Bit
		return (field[x + xAdd][y + yAdd] & 0x80) >> 7;	// " ... >> 7" shiftet die Bits um 7 (0x80 => 0x01)
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
			y |= getEnvrmCount(field, x, y);
		} );
	} );
}

function iterGame() {
	
	let new_field: GField = genGField();

	for(let x = 0; x < game_field.length; x++)
	{
		for(let y = 0; y < game_field.length; y++)
		{
			if ((game_field[x][y] & 0x0F) == 3 ||		// Tod und Drei Nachbarn, bzw. drei Nachbarn (gleiches Ergebnis)
				((game_field[x][y] & 0x0F) == 2 && (game_field[x][y]) != 0))	// Lebendig und zwei lebendige Nachbarn
			{
				new_field[x][y] = 0x80;					// Erstes Bit => Zelle lebt
			}
		}
	}

	convertField(new_field);
	game_field = new_field;

	// TODO: Spielfeld Zeichnen
	// TODO: Funktion "pausieren"
}
