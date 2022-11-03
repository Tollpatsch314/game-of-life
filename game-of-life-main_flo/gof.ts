
type GField = Array<Uint8Array>;

class GFieldData {
	public static field: GField;
	public static cols: number /* x_max */;
	public static rows: number /* y_max */;

	public static genField(): GField {
		GFieldData.field = makeGField(GFieldData.cols, GFieldData.rows);
		return GFieldData.field;
	}
}

class GameStates {
    private static _timerID: number;
    private static _tickInterval: number;
    private static _isRunning: boolean;
	private static _drawFunction: Function;

    public static changeInterval(interval: number): void {
        GameStates._tickInterval = interval;

        if(GameStates._isRunning) {
            window.clearInterval(GameStates._timerID);
			GameStates._timerID = window.setInterval(gameIteration, GameStates._tickInterval, GameStates._drawFunction);
        }
    }

    public static startGame(drawGameField: Function): void {
		GameStates._drawFunction = drawGameField;
        GameStates._timerID = window.setInterval(gameIteration, GameStates._tickInterval, drawGameField);
        GameStates._isRunning = true;
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
	for(let x: number = 0; x < cols; x++) arr[x] = new Uint8Array(cols).fill(0);
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

function gameRules(neighborCount: number, cellLive: boolean): boolean {
    return neighborCount == 3 || (neighborCount == 2 && cellLive);
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

function gameIteration(drawGameField: Function): void {
    GFieldData.field = getNextGen(GFieldData.field, gameRules);
    drawGameField(GFieldData.field);
}
