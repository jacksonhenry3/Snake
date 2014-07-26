var up         = 38,// These are the key codes for the directions
	down       = 40,
	left       = 37,
	right      = 39,
	scoreBoard = document.getElementById('score')
	options    = {},// can be used to change default initial values
	board      = new gameBoard(options),
	snake      = new Snake(board,options);

function resize()
{
	// rescale the board cells
	board.update()

	// rescale the snake to match the new board
	snake.resizeCell()

	renderFruit()

}

function init()
{
	// send the banner off screen
	document.getElementById('banner').style.left = '-110%'

	// change to looking for arrow key presses
	d3.select("body").on("keydown", function()
	{
		newDir = d3.event.keyCode
		if ([up,down,left,right].indexOf(newDir) > -1 ){
			if (newDir ==down && snake.direction !=up)
			{
				snake.direction = newDir
			}
			if (newDir ==up && snake.direction !=down)
			{
				snake.direction = newDir
			}
			if (newDir ==left && snake.direction !=right)
			{
				snake.direction = newDir
			}
			if (newDir ==right && snake.direction !=left)
			{
				snake.direction = newDir
			}
		}
	})

	// draw the board
	board.drawGrid()
	// set initial position of fruit
	allFruit        = []
	allFruit        = genFruit(allFruit)
	renderFruit()
	
	// this resets all initial snake conditions to defaults (should depend on options)
	snake.blockData = [{x:Math.floor(board.nCells.hori/2),y:Math.floor(board.nCells.vert/2)}];
	snake.speed     = 10;
	snake.direction = up;
	snake.start()

	// reset the score board
	scoreBoard.innerHTML = snake.getLength();	
}


function fruit(x,y,type)
{
	this.type     = type
	this.position = {x:x,y:y}
}




function genFruit(allFruit)
{
	for (var i = 10 - 1; i >= 0; i--) {
		x = Math.floor(Math.random()*(board.nCells.hori-2))+1
		y = Math.floor(Math.random()*(board.nCells.vert-2))+1
		allFruit.push(new fruit(x,y,'apple'))
	};
	return(allFruit)
}

function addFruit(allFruit,i)
{

	x1 = Math.floor(Math.random()*(board.nCells.hori-2))+1
	y1 = Math.floor(Math.random()*(board.nCells.vert-2))+1
	allFruit = removeFruit(allFruit,i)
	allFruit.unshift(new fruit(x1,y1,'apple'))
	renderFruit()
	return(allFruit)
}

function renderFruit()
{

	board.vCanvas.selectAll('circle.apple').remove()
	board.vCanvas.selectAll('circle.apple')
	.data(allFruit)
	.enter()
	.append('circle')
	.attr('class','apple')
	.attr("r",board.realCellDim.w/2)
	.attr('cx',function(d){return((d.position.x+1/2)*board.realCellDim.w)})
	.attr('cy',function(d){return((d.position.y+1/2)*board.realCellDim.h)})
	.attr('fill',function(){if(this.class = 'fruit.apple'){return('rgba(50,220,50,.35)')}});
}
function removeFruit(allFruit,i)
{
	allFruit.splice(i,1)
	return(allFruit)
}

window.onresize = resize

// if enter is pressed then start the game!
d3.select("body").on("keydown", function(){if(d3.event.keyCode===13){init()}})
