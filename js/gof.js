"use strict";
class GameRules {
    static normal(neighborCount, cellLife) {
        return neighborCount == 3 || (neighborCount == 2 && cellLife);
    }
    static inversed(neighborCount, cellLife) {
        return neighborCount != 5 && (neighborCount != 6 || cellLife);
    }
}
class Game {
    constructor(gameField) {
        this._timerID = 0;
        this._tickInterval = 700;
        this._isRunning = false;
        this._isResetable = false;
        this._generation = 0;
        this._t_0 = 0;
        this._field = gameField;
        this._gameRules = GameRules.normal;
    }
    isGameRunning() { return this._isRunning; }
    isResetable() { return this._isResetable; }
    reset() {
        if (!this._isResetable)
            return false;
        this.pauseGame();
        this._generation = 0;
        this._field.genField();
        return true;
    }
    startGame() {
        if (!this._isRunning) {
            this._isRunning = true;
            this._isResetable = true;
            var t = this;
            this._timerID = window.setInterval(t.gameIteration.bind(t), 5);
        }
    }
    pauseGame() {
        window.clearInterval(this._timerID);
        this._isRunning = false;
    }
    setGameRules(func) {
        this._gameRules = func;
    }
    setInterval(interval) {
        this._tickInterval = interval;
        if (this._isRunning) {
            window.clearInterval(this._timerID);
            var t = this;
            this._timerID = window.setInterval(t.gameIteration.bind(t), 5);
        }
    }
    getGameField() { return this._field; }
    getGArray() { return this._field.field; }
    getGeneration() { return this._generation.toString(); }
    gameIteration() {
        if (performance.now() - this._t_0 < this._tickInterval)
            return;
        this._generation++;
        this._field.field = this.getNextGen();
        this._field.draw();
        this._t_0 = performance.now();
    }
    getNextGen() {
        let nextGen = makeGField(this._field.cols, this._field.rows);
        let neighborCount = this._field.getNeigborCount.bind(this._field);
        for (let x = 0; x < this._field.cols; x++) {
            for (let y = 0; y < this._field.rows; y++) {
                if (this._gameRules(neighborCount(x, y), this._field.getCell(x, y))) {
                    nextGen[x][y] = 1;
                }
            }
        }
        return nextGen;
    }
}
function makeGField(cols, rows) {
    let arr = new Array(cols);
    for (let x = 0; x < cols; x++)
        arr[x] = new Uint8Array(rows).fill(0);
    return arr;
}
class FieldCalc {
    static overlapingEdges(f, x, y) {
        return f.field[(x + f.cols) % f.cols][(y + f.rows) % f.rows];
    }
    static deadEdges(f, x, y) {
        let l = f.field?.[x]?.[y];
        return (l !== undefined) ? l : 0;
    }
    static livingEdges(f, x, y) {
        let l = f.field?.[x]?.[y];
        return (l !== undefined) ? l : 1;
    }
    static mirrorEdges(f, x, y) {
        let l = f.field[x][y];
        return (l !== undefined) ? l : 1;
    }
}
class GameField {
    constructor(cols, rows, drawFunc) {
        this.cols = cols;
        this.rows = rows;
        this.field = makeGField(this.cols, this.rows);
        this._drawFunc = drawFunc;
        this._fieldCalcFunc = FieldCalc.overlapingEdges;
    }
    genField() { this.field = makeGField(this.cols, this.rows); }
    setFieldCalculation(calcFunc) { this._fieldCalcFunc = calcFunc; }
    getCell(x, y) { return this.field[x][y] != 0; }
    setCell(x, y, alive) { this.field[x][y] = alive ? 1 : 0; }
    draw() { this._drawFunc(this.field); }
    getLivingCellCount() {
        let count = 0;
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                if (this.getCell(x, y))
                    count++;
            }
        }
        return count;
    }
    getNeigborCount(x, y) {
        let count = -this._fieldCalcFunc(this, x, y);
        for (let delta_y = -1; delta_y < 2; delta_y++) {
            for (let delta_x = -1; delta_x < 2; delta_x++) {
                count += this._fieldCalcFunc(this, x + delta_x, y + delta_y);
            }
        }
        return count;
    }
}
var ctx;
var canvas;
var game;
var gameField;
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: Math.round(evt.clientY - rect.top)
    };
}
function getFieldPos(mousePos) {
    return {
        x: Math.floor(mousePos.x / (ctx.canvas.width / gameField.cols)),
        y: Math.floor(mousePos.y / (ctx.canvas.height / gameField.rows))
    };
}
var mousedown, mouseIsSetting, veryFirstInit = true;
function loadPage() {
    canvas = document.getElementById("game-field");
    ctx = canvas.getContext("2d");
    function calcCtxSize() {
        let min = Math.min(window.innerHeight, window.innerWidth);
        ctx.canvas.width = min / 10 * 8.6;
        ctx.canvas.height = min / 10 * 8.6;
    }
    calcCtxSize();
    game = new Game(new GameField(50, 50, drawField));
    gameField = game.getGameField();
    gameField.draw();
    let btn = document.getElementById("btnReset");
    btn.setAttribute("disabled", "true");
    pauseGame();
    if (veryFirstInit) {
        function drawEvent(evt) {
            var pos = getFieldPos(getMousePos(canvas, evt));
            gameField.setCell(pos.x, pos.y, mouseIsSetting);
            gameField.draw();
        }
        canvas.addEventListener("mousedown", (evt) => {
            mousedown = true;
            var pos = getFieldPos(getMousePos(canvas, evt));
            mouseIsSetting = !gameField.getCell(pos.x, pos.y);
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
            gameField.draw();
        });
        veryFirstInit = false;
        f_pentomino();
    }
}
function rand(min, max) {
    return Math.round(Math.random() * (max - min + 1) - 0.5) + min;
}
function randInit(percentageLivingCells) {
    let absoluteCount = Math.round((percentageLivingCells / 100) * gameField.rows * gameField.cols);
    absoluteCount -= gameField.getLivingCellCount();
    let addVal;
    if (absoluteCount == 0)
        return;
    else if (absoluteCount > 0)
        addVal = true;
    else {
        addVal = false;
        absoluteCount *= -1;
    }
    function genX() { return rand(0, gameField.cols); }
    function genY() { return rand(0, gameField.rows); }
    let n = 0;
    while (true) {
        let x_spot = genX(), y_spot = genY();
        for (let k = 0; k < rand(2, 5); k++) {
            let x = rand(-2, 2) + x_spot, y = rand(-2, 2) + y_spot;
            x = (x + gameField.cols) % gameField.cols, y = (y + gameField.rows) % gameField.rows;
            if (gameField.getCell(x, y) ? !addVal : addVal) {
                gameField.setCell(x, y, addVal);
                n++;
            }
            if (n >= absoluteCount) {
                gameField.draw();
                return;
            }
        }
    }
}
function reset() {
    game.reset();
    loadPage();
}
function enableReset() {
    if (game.isResetable()) {
        let btn = document.getElementById("btnReset");
        btn.removeAttribute("disabled");
    }
}
function startGame() {
    game.startGame();
    enableReset();
    let btn = document.getElementById("btnStartPause");
    let rngDst = document.getElementById("rngDistrib");
    rngDst.setAttribute("disabled", "true");
    if (btn !== null) {
        btn.classList.replace("btn-start", "btn-pause");
        btn.onclick = pauseGame;
        btn.value = "Pause";
    }
}
function pauseGame() {
    game.pauseGame();
    let btn = document.getElementById("btnStartPause");
    let rngDst = document.getElementById("rngDistrib");
    rngDst.removeAttribute("disabled");
    if (btn !== null) {
        btn.classList.replace("btn-pause", "btn-start");
        btn.onclick = startGame;
        btn.value = "Start";
    }
}
function clearField() {
    gameField = new GameField(50, 50, drawField);
}
function toggleGameRule(ruleId) {
    switch (ruleId) {
        case 0:
            game.setGameRules(GameRules.normal);
            break;
        case 1:
            game.setGameRules(GameRules.inversed);
            break;
    }
}
function toggleEdgeRule(ruleId) {
    switch (ruleId) {
        case 0:
            gameField.setFieldCalculation(FieldCalc.overlapingEdges);
            break;
        case 1:
            gameField.setFieldCalculation(FieldCalc.deadEdges);
            break;
        case 2:
            gameField.setFieldCalculation(FieldCalc.livingEdges);
            break;
        case 3:
            gameField.setFieldCalculation(FieldCalc.mirrorEdges);
            break;
    }
}
function changeInterval() {
    let rng = document.getElementById("rngInterval");
    game.setInterval(parseInt(rng.value));
    let lbl = document.getElementById("lblInterval");
    lbl.innerHTML = rng.value;
}
function setDistribDspl(percentageLivingCells) {
    let rng = document.getElementById("rngDistrib");
    rng.value = percentageLivingCells.toString();
    let lbl = document.getElementById("lblDistrib");
    lbl.innerHTML = rng.value;
}
function changeDistrib() {
    let rng = document.getElementById("rngDistrib");
    randInit(parseFloat(rng.value));
    let lbl = document.getElementById("lblDistrib");
    lbl.innerHTML = rng.value;
}
function drawField(field) {
    let xCan, yCan, width;
    let lblGen = document.getElementById("lbl-generation");
    lblGen.textContent = game.getGeneration();
    let count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < gameField.cols; x++) {
        for (let y = 0; y < gameField.rows; y++) {
            xCan = x * ctx.canvas.height / gameField.cols;
            yCan = y * ctx.canvas.height / gameField.cols;
            width = ctx.canvas.height / gameField.cols;
            if (field[x][y] != 0) {
                ctx.fillRect(xCan, yCan, width, width);
                count++;
            }
            else {
                ctx.fillStyle = "rgba(0, 0, 0, 0)";
                ctx.fillRect(xCan, yCan, width, width);
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.strokeRect(xCan, yCan, width, width);
            }
        }
    }
    setDistribDspl(100 * count / (gameField.cols * gameField.rows));
}
function f_pentomino() {
    gameField.setCell(25, 25, true);
    gameField.setCell(25, 26, true);
    gameField.setCell(25, 27, true);
    gameField.setCell(26, 25, true);
    gameField.setCell(24, 26, true);
    gameField.draw();
}
//# sourceMappingURL=gof.js.map