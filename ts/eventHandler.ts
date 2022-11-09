"use strict";

// Ändert die Größe des Spielfeldes
// - params: (void)
// - ret: (void)
function changeFieldSize() {
	if(!game.isResetable() && gameField.getLivingCellCount() == 0) {
		let a_max = parseInt((document.getElementById("rngSize") as HTMLInputElement).value);
		reset();
		gameField = new GameField(a_max, a_max, drawField);
	}
}

// Lädt die Spielfeldkonfiguration aus der gegbenen Datei
// - params: (file: File)
// - ret: (void)
async function uploadFile(file: File) {
	let txt: string = await file.text();
	initFromText(txt);
}

// Ändert die Spielreglen
// - params: (ruleId: number ... siehe switch-statement)
// - ret: (void)
function toggleGameRule(ruleId: number) : void {
	switch(ruleId) {
		case 0: game.setGameRules(GameRules.normal);	                    break;
		case 1: game.setGameRules(GameRules.inversed);	                    break;
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
		case 3: gameField.setFieldCalculation(FieldCalc.mirrorEdges);		break;
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
