var GFieldData = /** @class */ (function () {
    function GFieldData() {
    }
    GFieldData.genField = function () {
        GFieldData.field = makeGField(GFieldData.cols, GFieldData.rows);
        return GFieldData.field;
    };
    return GFieldData;
}());
var GameStates = /** @class */ (function () {
    function GameStates() {
    }
    GameStates.changeInterval = function (interval) {
        GameStates.tickInterval = interval;
        if (GameStates.isRunning) {
            window.clearInterval(GameStates.timerID);
            GameStates.timerID = window.setInterval(gameIteration, GameStates.tickInterval, GameStates.drawFunction);
        }
    };
    GameStates.startGame = function (drawGameField) {
        GameStates.drawFunction = drawGameField;
        GameStates.timerID = window.setInterval(gameIteration, GameStates.tickInterval, drawGameField);
        GameStates.isRunning = true;
    };
    GameStates.pauseGame = function () {
        window.clearInterval(GameStates.timerID);
        GameStates.isRunning = false;
    };
    GameStates.isRunning = function () {
        return GameStates.isRunning;
    };
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
function gameIteration(drawGameField) {
    GFieldData.field = getNextGen(GFieldData.field, gameRules);
    drawGameField(GFieldData.field);
}
