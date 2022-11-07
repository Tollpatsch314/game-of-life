'use strict';
class GFieldData {
    static genField() {
        GFieldData.field = makeGField(GFieldData.cols, GFieldData.rows);
        return GFieldData.field;
    }
}
GFieldData.generation = 0;
class GameStates {
    static changeInterval(interval) {
        GameStates._tickInterval = interval;
        if (GameStates._isRunning) {
            window.clearInterval(GameStates._timerID);
            GameStates._timerID = window.setInterval(clock, 5, GameStates._tickInterval, GameStates._drawFunction);
        }
    }
    static startGame(drawGameField) {
        GameStates._drawFunction = drawGameField;
        GameStates._timerID = window.setInterval(clock, 5, GameStates._tickInterval, drawGameField);
        GameStates._isRunning = true;
        console.log(GameStates._tickInterval);
    }
    static pauseGame() {
        window.clearInterval(GameStates._timerID);
        GameStates._isRunning = false;
    }
    static isRunning() {
        return GameStates._isRunning;
    }
}
GameStates._tickInterval = 700; // time in ms (min. 20 ms)
function makeGField(cols, rows) {
    let arr = new Array(cols);
    for (let x = 0; x < cols; x++)
        arr[x] = new Uint8Array(rows).fill(0);
    return arr;
}
function getNeighborCount(x, y, gameField) {
    function numIsNeighbor(cord_x, cord_y) {
        return gameField[(cord_x + GFieldData.cols) % GFieldData.cols][(cord_y + GFieldData.rows) % GFieldData.rows];
    }
    let count = -numIsNeighbor(x, y);
    for (let delta_y = -1; delta_y <= 1; delta_y++) {
        for (let delta_x = -1; delta_x <= 1; delta_x++) {
            count += numIsNeighbor(x + delta_x, y + delta_y);
        }
    }
    return count;
}
function gameRules(neighborCount, cellLife) {
    return neighborCount == 3 || (neighborCount == 2 && cellLife);
}
function gameRulesInversed(neighborCount, cellLife) {
    return !gameRules(neighborCount, cellLife);
}
function getNextGen(gameField, gameRules) {
    let nextGen = makeGField(GFieldData.cols, GFieldData.rows);
    function isCellAlive(cord_x, cord_y) {
        return gameField[cord_x][cord_y] != 0;
    }
    for (let x = 0; x < GFieldData.cols; x++) {
        for (let y = 0; y < GFieldData.rows; y++) {
            if (gameRules(getNeighborCount(x, y, gameField), isCellAlive(x, y))) { // if (willLive)
                nextGen[x][y] = 1;
            }
        }
    }
    return nextGen;
}
var t_0 = performance.now(), delta_t = 0; // Damit der Slider eine lineare Änderung vornehmen kann
function clock(interval, drawGameField) {
    let t_1 = performance.now();
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
var ctx;
var canvas;
var firstStart = false;
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: Math.round(evt.clientY - rect.top)
    };
}
function getFieldPos(mousePos) {
    return {
        x: Math.floor(mousePos.x / (ctx.canvas.width / GFieldData.cols)),
        y: Math.floor(mousePos.y / (ctx.canvas.height / GFieldData.rows))
    };
}
var mousedown, mouseIsSetting;
function loadPage() {
    canvas = document.getElementById("game-field");
    ctx = canvas.getContext("2d");
    function calcCtxSize() {
        let min = Math.min(window.innerHeight, window.innerWidth);
        ctx.canvas.width = min / 10 * 8;
        ctx.canvas.height = min / 10 * 8;
    }
    calcCtxSize();
    // Default Werte                    <=========
    GFieldData.cols = 50;
    GFieldData.rows = 50;
    GFieldData.genField();
    drawField(GFieldData.field);
    function drawEvent(evt) {
        var pos = getFieldPos(getMousePos(canvas, evt));
        GFieldData.field[pos.x][pos.y] = mouseIsSetting ? 1 : 0;
        drawField(GFieldData.field);
    }
    canvas.addEventListener("mousedown", function (evt) {
        mousedown = true;
        var pos = getFieldPos(getMousePos(canvas, evt));
        mouseIsSetting = GFieldData.field[pos.x][pos.y] != 0 ? false : true;
    });
    canvas.addEventListener("mouseup", (evt) => {
        drawEvent(evt);
        mousedown = false;
    });
    canvas.addEventListener("mousemove", (evt) => {
        if (!mousedown)
            return;
        drawEvent(evt);
    });
    canvas.addEventListener("mouseout", () => {
        mousedown = false;
    });
    canvas.addEventListener("click", drawEvent);
    window.addEventListener("resize", () => {
        calcCtxSize();
        drawField(GFieldData.field);
    });
}
function enableReset() {
    if (!firstStart) {
        firstStart = true;
        let btn = document.getElementById("btnReset");
        btn.removeAttribute("disabled");
    }
}
function startGame() {
    GameStates.startGame(drawField);
    enableReset();
    let btn = document.getElementById("btnStartPause");
    if (btn !== null) {
        btn.classList.replace("btn-start", "btn-pause");
        btn.onclick = pauseGame;
        btn.value = "Pause";
    }
}
function pauseGame() {
    GameStates.pauseGame();
    let btn = document.getElementById("btnStartPause");
    if (btn !== null) {
        btn.classList.replace("btn-pause", "btn-start");
        btn.onclick = startGame;
        btn.value = "Start";
    }
}
function resetField() {
    let btn = document.getElementById("btnReset");
    btn.setAttribute("disabled", "true");
    firstStart = false;
    clearField();
}
function clearField() {
    pauseGame();
    GFieldData.generation = 0;
    drawField(GFieldData.genField());
}
function changeInterval() {
    let rng = document.getElementById("rngInterval");
    GameStates.changeInterval(parseInt(rng.value));
}
function drawField(field) {
    let xCan, yCan, width;
    let lblGen = document.getElementById("lbl-generation");
    lblGen.textContent = "Generation: " + GFieldData.generation.toString();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < GFieldData.cols; x++) {
        for (let y = 0; y < GFieldData.rows; y++) {
            xCan = x * ctx.canvas.height / GFieldData.cols;
            yCan = y * ctx.canvas.height / GFieldData.cols;
            width = ctx.canvas.height / GFieldData.cols;
            if (field[x][y] != 0) {
                ctx.fillRect(xCan, yCan, width, width);
            }
            else {
                ctx.fillStyle = "rgba(0, 0, 0, 0)";
                ctx.fillRect(xCan, yCan, width, width);
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.strokeRect(xCan, yCan, width, width);
            }
        }
    }
}
function f_pentomino() {
    GFieldData.field[25][25] = 1;
    GFieldData.field[25][26] = 1;
    GFieldData.field[25][27] = 1;
    GFieldData.field[26][25] = 1;
    GFieldData.field[24][26] = 1;
}
