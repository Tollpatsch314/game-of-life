var ctx;
var canvas;
var field_size;
var game_field;
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: Math.round(evt.clientY - rect.top)
    };
}
function loadPage() {
    var canv = document.getElementById("game-field");
    ctx = canv.getContext("2d");
    ctx.canvas.width = window.innerHeight / 10 * 9;
    ctx.canvas.height = window.innerHeight / 10 * 9;
    GFieldData.colCount = 50;
    GFieldData.rowCount = 50;
    drawField(game_field);
    // report the mouse position on click
    canv.addEventListener("click", function (evt) {
        var mousePos = getMousePos(canv, evt);
        var x = Math.floor(mousePos.x / (ctx.canvas.height / 50));
        var y = Math.floor(mousePos.y / (ctx.canvas.height / 50));
        game_field[x][y] = game_field[x][y] != 0 ? 0 : 1;
        drawField(game_field);
    }, false);
}
function drawField(field) {
    var xCan, yCan, width;
    for (var x = 0; x < field.length; x++) {
        for (var y = 0; y < field[x].length; y++) {
            xCan = x * ctx.canvas.height / field_size[0];
            yCan = y * ctx.canvas.height / field_size[1];
            width = ctx.canvas.height / field_size[0];
            if (field[x][y] != 0) {
                ctx.fillRect(xCan, yCan, width, width);
            }
            else {
                ctx.fillStyle = "rgba(0, 0, 0, 0)";
                ctx.fillRect(xCan, yCan, width, width);
                ctx.fillStyle = "rgb(0, 0, 0, 255)";
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
