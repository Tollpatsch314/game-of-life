"use strict";

// Resetet das Spielfeld
// - params: (void)
// - ret: (void)
function reset() : void {
	game.reset();
	gameField = game.getGameField();
	gameField.draw();

	// Deaktivere Resetbutton
	let btn = document.getElementById("btnReset") as HTMLButtonElement;
	btn.setAttribute("disabled", "true");

	pauseGame();	// Pause-Button => Start-Button (falls nötig)
}

// Ändert die Größe des Spielfeldes
// - params: (void)
// - ret: (void)
function changeFieldSize() : void {
	if(!game.isResetable()) {
		let rng = document.getElementById("rngSize") as HTMLInputElement;
		let a_max = parseInt(rng.value);
		gameField = new GameField(a_max, a_max, drawField);
		gameField.draw();
	}
}

// Lädt die Spielfeldkonfiguration aus der gegbenen Datei
// - params: (file: File)
// - ret: (void)
async function uploadFile(file: File) {
	let txt: string = await file.text();
	initFromText(txt);
}

// Zum Herunterladen der Feldkonfiguration
// - params: (void)
// - ret: (void)
function downloadConfig() {
	pauseGame();
	downloadFieldConfig();
}

// Lädt bevorzug aus "GamePresets" die Presets im definierten File Format
// - params: (text: string ... text im File-Format)
// - ret: (void)
function loadConfig(text: string) : void {
	initFromText(text);
}

// Ändert die Spielreglen
// - params: (ruleId: number ... siehe switch-statement)
// - ret: (void)
function toggleGameRule(ruleId: number) : void {
	switch(ruleId) {
		case 0: game.setGameRules(GameRules.normal);	                    break;
		case 1: game.setGameRules(GameRules.inversed);	                    break;
		case 2: game.setGameRules(GameRules.copyWorld);						break;
	}
}

// Ändert die Berechnungsmethode der Ränder
// - params: (ruleId: number ... siehe switch-statement)
// - ret: (void)
function toggleEdgeRule(ruleId: number) : void {	
	switch(ruleId) {
		case 0: gameField.setFieldCalculation(FieldCalc.overlapingEdges);	break;
		case 1: gameField.setFieldCalculation(FieldCalc.deadEdges);			break;
		case 2: gameField.setFieldCalculation(FieldCalc.livingEdges);		break;
	}
}

// Handler zur Änderung des Berechnungszeitintervalls
// Ausgeführt durch "rngInterval" (onchange)
// - params: (void)
// - ret: (void)
function changeInterval() : void {
	let rng = document.getElementById("rngInterval") as HTMLInputElement;
	game.setInterval(parseInt(rng.value));
	let lbl = document.getElementById("lblInterval") as HTMLLabelElement;
	lbl.innerHTML = rng.value;

}

// Aufruf bei der Änderung des Reglers zur zufälligen Verteilung lebendiger Zellen auf den Feld
// Ausgeführt durch "rngDistrib" (onchange)
// - params: (void)
// - ret: (void)
function changeDistrib() : void {
	let rng = document.getElementById("rngDistrib") as HTMLInputElement;
	randInit(parseFloat(rng.value));
	let lbl = document.getElementById("lblDistrib") as HTMLLabelElement;
	lbl.innerHTML = rng.value;
}
