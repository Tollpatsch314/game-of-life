'use strict';

type GField = Array<Uint8Array>;

class GFieldData {
	public static field: GField;
	public static cols: number /* x_max */;
	public static rows: number /* y_max */;
    public static generation: number = 0;

	public static genField(): GField {
		GFieldData.field = makeGField(GFieldData.cols, GFieldData.rows);
		return GFieldData.field;
	}
}

class GameStates {
    private static _timerID: number;
    private static _tickInterval: number = 700;     // time in ms (min. 20 ms)
    private static _isRunning: boolean;
	private static _drawFunction: Function;

    public static changeInterval(interval: number): void {
        GameStates._tickInterval = interval;

        if(GameStates._isRunning) {
            window.clearInterval(GameStates._timerID);
			GameStates._timerID = window.setInterval(clock, 5, GameStates._tickInterval, GameStates._drawFunction);
        }
    }

    public static startGame(drawGameField: Function): void {
		GameStates._drawFunction = drawGameField;
        GameStates._timerID = window.setInterval(clock, 5, GameStates._tickInterval, drawGameField);
        GameStates._isRunning = true;
        console.log(GameStates._tickInterval);
    }

    public static pauseGame(): void {
        window.clearInterval(GameStates._timerID);
        GameStates._isRunning = false;
    }

	public static isRunning(): boolean {
		return GameStates._isRunning;
	}
}

function makeGField(cols: number, rows: number): GField {
    let arr = new Array<Uint8Array>(cols);
	for(let x: number = 0; x < cols; x++) arr[x] = new Uint8Array(rows).fill(0);
	return arr;
}

function getNeighborCount(x: number, y: number, gameField: GField): number {

	function numIsNeighbor(cord_x: number, cord_y: number): number {
        return gameField[(cord_x + GFieldData.cols) % GFieldData.cols][(cord_y + GFieldData.rows) % GFieldData.rows];
    }

    let count: number = -numIsNeighbor(x, y);

    for(let delta_y: number = -1; delta_y <= 1; delta_y++) {
        for(let delta_x: number = -1; delta_x <= 1; delta_x++) {
            count += numIsNeighbor(x + delta_x, y + delta_y);
        }
    }

    return count;
}

function gameRules(neighborCount: number, cellLife: boolean): boolean {             // Spielregeln für das "normale" Game of Life
    return neighborCount == 3 || (neighborCount == 2 && cellLife);
}

function gameRulesInversed(neighborCount: number, cellLife: boolean): boolean {     // Spielregeln für inversed Game of Life
    return !gameRules(neighborCount, cellLife);
}

function getNextGen(gameField: GField, gameRules: Function): GField {

    let nextGen: GField = makeGField(GFieldData.cols, GFieldData.rows);

    function isCellAlive(cord_x: number, cord_y: number) {
        return gameField[cord_x][cord_y] != 0;
    }

    for(let x = 0; x < GFieldData.cols; x++) {
        for(let y = 0; y < GFieldData.rows; y++) {
            if(gameRules(getNeighborCount(x, y, gameField), isCellAlive(x, y))) {      // if (willLive)
                nextGen[x][y] = 1;
            }
        }
    }

    return nextGen;
}

var t_0: number = performance.now(), delta_t: number = 0;               // Damit der Slider eine lineare Änderung vornehmen kann
function clock(interval: number, drawGameField: Function): void {
    let t_1 = performance.now();
    delta_t += t_1 - t_0;

    if(delta_t < interval) {
        t_0 = t_1;
        return;
    }

    gameIteration(drawGameField);
    delta_t = 0;
    t_0 = performance.now();
}

function gameIteration(drawGameField: Function): void {
    GFieldData.generation++;
    GFieldData.field = getNextGen(GFieldData.field, gameRules);
    drawGameField(GFieldData.field);
}
