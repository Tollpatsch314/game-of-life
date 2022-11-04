var GFieldData = /** @class */ (function () {
    function GFieldData() {
    }
    GFieldData.genField = function () {
        GFieldData.field = makeGField(GFieldData.cols, GFieldData.rows);
        return GFieldData.field;
    };
    GFieldData.generation = 0;
    return GFieldData;
}());
var GameStates = /** @class */ (function () {
    function GameStates() {
    }
    GameStates.changeInterval = function (interval) {
        GameStates._tickInterval = interval;
        if (GameStates._isRunning) {
            window.clearInterval(GameStates._timerID);
            GameStates._timerID = window.setInterval(clock, 5, GameStates._tickInterval, GameStates._drawFunction);
        }
    };
    GameStates.startGame = function (drawGameField) {
        GameStates._drawFunction = drawGameField;
        GameStates._timerID = window.setInterval(clock, 5, GameStates._tickInterval, drawGameField);
        GameStates._isRunning = true;
        console.log(GameStates._tickInterval);
    };
    GameStates.pauseGame = function () {
        window.clearInterval(GameStates._timerID);
        GameStates._isRunning = false;
    };
    GameStates.isRunning = function () {
        return GameStates._isRunning;
    };
    GameStates._tickInterval = 700; // time in ms (min. 20 ms)
    return GameStates;
}());
function makeGField(cols, rows) {
    var arr = new Array(cols);
    for (var x = 0; x < cols; x++)
        arr[x] = new Uint8Array(cols).fill(0);
    return arr;
}
function getNeighborCount(x, y, gameField) {
    function numIsNeighbor(cord_x, cord_y) {
        return gameField[(cord_x + GFieldData.cols) % GFieldData.cols][(cord_y + GFieldData.rows) % GFieldData.rows];
    }
    var count = -numIsNeighbor(x, y);
    for (var delta_y = -1; delta_y <= 1; delta_y++) {
        for (var delta_x = -1; delta_x <= 1; delta_x++) {
            count += numIsNeighbor(x + delta_x, y + delta_y);
        }
    }
    return count;
}
function gameRules(neighborCount, cellLive) {
    return neighborCount == 3 || (neighborCount == 2 && cellLive);
}
function getNextGen(gameField, gameRules) {
    var nextGen = makeGField(GFieldData.cols, GFieldData.rows);
    function isCellAlive(cord_x, cord_y) {
        return gameField[cord_x][cord_y] != 0;
    }
    for (var x = 0; x < GFieldData.cols; x++) {
        for (var y = 0; y < GFieldData.rows; y++) {
            if (gameRules(getNeighborCount(x, y, gameField), isCellAlive(x, y))) { // if (willLive)
                nextGen[x][y] = 1;
            }
        }
    }
    return nextGen;
}
var t_0 = performance.now(), delta_t = 0; // Damit der Slider eine lineare Änderung vornehmen kann
function clock(interval, drawGameField) {
    var t_1 = performance.now();
    delta_t += t_1 - t_0;
    if (delta_t < interval) {
        t_0 = t_1;
        return;
    }
    gameIteration(drawGameField);
    delta_t = 0;
    t_0 = performance.now();
}
function gameIteration(drawGameField) {
    GFieldData.generation++;
    GFieldData.field = getNextGen(GFieldData.field, gameRules);
    drawGameField(GFieldData.field);
}
