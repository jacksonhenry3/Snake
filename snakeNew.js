if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

var idealEdge         = 15,
	initialSpeed      = 20, //in cells per second
	initialLength     = 1,
	up                = 38,
	down              = 40,
	left              = 37,
	right             = 39,
	initialDirection  = up;
function screenW(){return(window.innerWidth)}
function screenH(){return(window.innerHeight)}
	window.nCells            = {hori:Math.floor(screenW()/idealEdge),vert:Math.floor(screenH()/idealEdge)},
	window.cellDim           = {w: screenW()/window.nCells.hori,h:screenH()/window.nCells.vert},
	intialSnakeBlocks = [];
	// intialSnakeBlocks = [{x:Math.floor(window.nCells.hori/2),y:Math.floor(window.nCells.vert/2)},{x:Math.floor(window.nCells.hori/2),y:Math.floor(window.nCells.vert/2)+1},{x:Math.floor(window.nCells.hori/2),y:Math.floor(window.nCells.vert/2)+2}];
	for (var i = initialLength ; i > 0; i--) {
		intialSnakeBlocks.push({x:Math.floor(window.nCells.hori/2),y:Math.floor(window.nCells.vert/2)+i})


d3.select("body").on("keydown", function(){if ([up,down,left,right].indexOf(d3.event.keyCode) > -1 ){snake.direction = d3.event.keyCode}})}

var svg = d3.select("#game").append("svg:svg")
	.attr("width", screenW())
	.attr("height", screenH());

// ============== The Grid =================
	function makeGrid()
	{
		gridData = []
		K = 0
		for (var i = window.nCells.hori ; i >= 0; i--) {
			gridData.push({x1:K,x2:K,y1:0,y2:screenH()})
			K += window.cellDim.w
		};
		K = 0
		for (var i = window.nCells.vert ; i >= 0; i--) {
			gridData.push({x1:0,x2:screenW(),y1:K,y2:K})
			K += window.cellDim.h
		};

		svg.selectAll("line.gridLine").remove()
		svg.selectAll("line.gridLine")
			.data(gridData)
			.enter()
			.append("line")
			.attr('class','gridLine')
			.attr("x1",function(d){return(d.x1)})
			.attr("x2",function(d){return(d.x2)})
			.attr("y1",function(d){return(d.y1)})
			.attr("y2",function(d){return(d.y2)})
			.attr("stroke-width",.2)
			.attr("stroke",'rgba(0,0,0,0)');
	};

function resize()
{
	window.nCells  = {hori:Math.floor(screenW()/idealEdge),vert:Math.floor(screenH()/idealEdge)},
	window.cellDim = {w: screenW()/window.nCells.hori,h:screenH()/window.nCells.vert};
	svg.attr("width", screenW())
	   .attr("height", screenH())
	makeGrid(window.nCells,window.cellDim)


	snake.cellDim = window.cellDim

	svg.selectAll('rect.snake')
		.data(snake.blocks)
		.attr("width",window.cellDim.w)
		.attr("height",window.cellDim.h)
		.attr('x',function(d){return((d.x)*window.cellDim.w)})
		.attr('y',function(d){return((d.y)*window.cellDim.h)})
		.attr('fill','rgba(0,0,0,.2)');
}

// =============== The snake =================
	var snake =
	{
		blocks       : intialSnakeBlocks,
		head         : function(){return(this.blocks.last())},
		direction    : initialDirection,
		length       : initialLength,
		speed        : initialSpeed,
	};

	snake.newBlock  = function()
	{
		svg.selectAll('rect.snake').remove()
		svg.selectAll('rect.snake')
			.data(this.blocks)
			.enter()
			.append('rect')
			.attr('class','snake')
			.attr("width",window.cellDim.w)
			.attr("height",window.cellDim.h)
			.attr('x',function(d){return((d.x)*window.cellDim.w)})
			.attr('y',function(d){return((d.y)*window.cellDim.h)})
			.attr('fill','rgba(0,0,0,.2)')
	}

	snake.move = function()
	{
		for (var i = 0; i < this.blocks.length-1; i++) {
			this.blocks[i].y = this.blocks[i+1].y
			this.blocks[i].x = this.blocks[i+1].x
		};

		if (this.direction === down)
		{
			this.blocks.last().y+=1
		}
		else if (this.direction === up)
		{
			this.blocks.last().y-=1
		}
		else if (this.direction === left)
		{
			this.blocks.last().x-=1
		}
		else if (this.direction === right)
		{
			this.blocks.last().x+=1
		}
		if (collide())
		{
			svg.selectAll('rect.snake')
				.data(this.blocks)
				.transition()
				.attr("width",100)
				.attr("height",100);
			window.clearInterval(gameLoop)
		}

		if (this.head().x == fruitPos.x && this.head().y == fruitPos.y)
		{
			this.blocks.unshift({x:-1,y:-1})
			this.newBlock()		
			fruitPos = genFruit()

		}



		
		svg.selectAll('rect.snake')
			.data(this.blocks)
			.transition()
			.ease("linear" )
			.duration(1000/snake.speed)
			.attr('x',function(d){return((d.x)*window.cellDim.w)})
			.attr('y',function(d){return((d.y)*window.cellDim.h)});
	}


function collide()
{
	head = snake.head()

	if (head.x <= 0 || head.y <= 0 || head.x >= window.nCells.hori || head.y >= window.nCells.vert)
	{
		return(true)
	}
	for (var i = snake.blocks.length - 2; i >= 0; i--) {
		if (snake.blocks[i].y == head.y && snake.blocks[i].x == head.x)
		{
			
			return(true)
		}
	};
}



function init()
{
	makeGrid()
	snake.newBlock()
	fruitPos = genFruit()
}



function genFruit()
{
	x = Math.floor(Math.random()*window.nCells.hori)
	y = Math.floor(Math.random()*window.nCells.vert)
		svg.selectAll('rect.fruit').remove()
		svg.selectAll('rect.fruit')
			.data([{x:x,y:y}])
			.enter()
			.append('rect')
			.attr('class','fruit')
			.attr("width",window.cellDim.w)
			.attr("height",window.cellDim.h)
			.attr('x',function(d){return((d.x)*window.cellDim.w)})
			.attr('y',function(d){return((d.y)*window.cellDim.h)})
			.attr('fill','rgba(255,0,0,.2)')
	return({x:x,y:y})
}


init()



window.onresize = resize
gameLoop = window.setInterval(function(){snake.move()},1000/snake.speed)