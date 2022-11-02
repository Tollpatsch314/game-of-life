function myfunc()
{
var canv = document.getElementById("myCanvas");
var ctx = canv.getContext("2d");
let a, b, c, d;
ctx.canvas.width  = window.innerHeight/10*9;
ctx.canvas.height = window.innerHeight/10*9;
arr= twoDimensionArray(50,50);
arr[0][0]=1;
arr[1][1]=1;
arr[5][7]=1;
arr[49][49]=1;
arr[40][40]=1;
for (let x=0; x < arr.length; x++) 
{
	for (let y=0; y < arr.length; y++) 
	{ 
		a =  x * ctx.canvas.height/50;
		b =  y * ctx.canvas.height/50; 
		c =  ctx.canvas.height/50;
		d =  ctx.canvas.height/50;
		if (arr[x][y] == 1)
		{
			ctx.fillRect(a, b, c , d);
		}
		else
		{
			ctx.strokeRect(a, b, c , d);  
		}
	}
}

//set up the canvas and context

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


//report the mouse position on click
canvas.addEventListener("click", function (evt) {
    var mousePos = getMousePos(canvas, evt);
	var x = Math.floor(mousePos.x/(ctx.canvas.height/50));
	var y = Math.floor(mousePos.y/(ctx.canvas.height/50)); 
    //alert(x + ',' + y);
	if (arr[x][y] == 1)
	{
	arr[x][y]=0;
	
	
	ctx.strokeRect(x * ctx.canvas.height/50, y * ctx.canvas.height/50, ctx.canvas.height/50 , ctx.canvas.height/50);
	}
	if (arr[x][y] == 0)
	{
	arr[x][y]=1;
	ctx.fillRect(x * ctx.canvas.height/50, y * ctx.canvas.height/50, ctx.canvas.height/50 , ctx.canvas.height/50);
	}
}, false);
}

function twoDimensionArray(a, b) {
    let arr = [];

    // creating two dimensional array
    for (let i = 0; i< a; i++) {
        for(let j = 0; j< b; j++) {
            arr[i] = [];
        }
    }

    // inserting elements to array
    for (let i = 0; i< a; i++) {
        for(let j = 0; j< b; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}

function zelleneingabe(){
	document.getElementById('manuellbutton').innerHTML = 'hi'
	for (let i= 0; i<5; i++) {
		var btn = document.createElement('button');
    	btn.type = 'button';
     	btn.innerHTML = 'Press me';
    	btn.className = 'btn-styled';
		btn.id = 'btn'+i.toString();
		document.getElementById('btn-feld').appendChild(btn);
	}
}

document.addEventListener('click', function() {

});


/*
document.addEventListener('DOMContentLoaded', function() {
    var button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = 'Press me';
    button.className = 'btn-styled';
 
    button.onclick = function() {
        // …
    };
 
    var container = document.getElementById('container');
    container.appendChild(button);
}, false);

*/




//Get Mouse Position
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: Math.round(evt.clientY - rect.top)
    };
}