var ctx;
var canvas;
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: Math.round(evt.clientY - rect.top)
    };
}
function getFieldPos(mousePos) {
    return {
        x: Math.floor(mousePos.x / (ctx.canvas.height / GFieldData.cols)),
        y: Math.floor(mousePos.y / (ctx.canvas.height / GFieldData.rows))
    };
}
var mousedown, mouseIsSetting;
function loadPage() {
    canvas = document.getElementById("game-field");
    ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerHeight / 10 * 9;
    ctx.canvas.height = window.innerHeight / 10 * 9;
    // Default Werte
    GFieldData.cols = 50;
    GFieldData.rows = 50;
    GFieldData.genField();
    drawField(GFieldData.field);
    canvas.addEventListener("mousedown", function (evt) {
        mousedown = true;
        var pos = getFieldPos(getMousePos(canvas, evt));
        mouseIsSetting = GFieldData.field[pos.x][pos.y] != 0 ? false : true;
    });
    canvas.addEventListener("mouseup", function (evt) {
        mousedown = false;
    });
    canvas.addEventListener("mousemove", function (evt) {
        if (!mousedown)
            return;
        var pos = getFieldPos(getMousePos(canvas, evt));
        GFieldData.field[pos.x][pos.y] = mouseIsSetting ? true : false;
        drawField(GFieldData.field);
    });
    canvas.addEventListener("click", function (evt) {
        var pos = getFieldPos(getMousePos(canvas, evt));
        GFieldData.field[pos.x][pos.y] = GFieldData.field[pos.x][pos.y] != 0 ? 0 : 1;
        drawField(GFieldData.field);
    });
}
function startGame() {
    GameStates.startGame(drawField);
    var btn = document.getElementById("btnStartPause");
    if (btn !== null) {
        btn.classList.replace("btn-start", "btn-pause");
        btn.onclick = pauseGame;
        btn.value = "Pause";
    }
}
function pauseGame() {
    GameStates.pauseGame();
    var btn = document.getElementById("btnStartPause");
    if (btn !== null) {
        btn.classList.replace("btn-pause", "btn-start");
        btn.onclick = startGame;
        btn.value = "Start";
    }
}
function clearField() {
    pauseGame();
    drawField(GFieldData.genField());
}
function drawField(field) {
    var xCan, yCan, width;
    for (var x = 0; x < GFieldData.cols; x++) {
        for (var y = 0; y < GFieldData.rows; y++) {
            xCan = x * ctx.canvas.height / GFieldData.cols;
            yCan = y * ctx.canvas.height / GFieldData.cols;
            width = ctx.canvas.height / GFieldData.cols;
            if (field[x][y] != 0) {
                ctx.fillRect(xCan, yCan, width, width);
            }
            else {
                ctx.fillStyle = "rgb(245, 245, 245)";
                ctx.fillRect(xCan, yCan, width, width);
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.strokeRect(xCan, yCan, width, width);
            }
        }
    }
}
function f_pentomino() {
    game_field[25][25] = 1;
    game_field[25][26] = 1;
    game_field[25][27] = 1;
    game_field[26][25] = 1;
    game_field[24][26] = 1;
}
