if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

function objEquiv(obj1,obj2){for(var key in obj1){if (obj1[key]!=obj2[key]){return false}}return true}


var idealEdge         = 30,
	initialSpeed      = 10, //in cells per second
	initialLength     = 1,
	up                = 38,
	down              = 40,
	left              = 37,
	right             = 39,
	initialDirection  = up;

function screenW(){return(window.innerWidth-100)}
function screenH(){return(window.innerHeight-100)}
	window.nCells            = {hori:Math.floor(screenW()/idealEdge),vert:Math.floor(screenH()/idealEdge)},
	window.cellDim           = {w: screenW()/window.nCells.hori,h:screenH()/window.nCells.vert},
	intialSnakeBlocks = [];
	// intialSnakeBlocks = [{x:Math.floor(window.nCells.hori/2),y:Math.floor(window.nCells.vert/2)},{x:Math.floor(window.nCells.hori/2),y:Math.floor(window.nCells.vert/2)+1},{x:Math.floor(window.nCells.hori/2),y:Math.floor(window.nCells.vert/2)+2}];
	for (var i = initialLength ; i > 0; i--) {
		intialSnakeBlocks.push({x:Math.floor(window.nCells.hori/2),y:Math.floor(window.nCells.vert/2)+i})
	}

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
	}
	)


var svg = d3.select("#game").append("svg:svg")
	.attr("width", screenW())
	.attr("height", screenH())
	.style('position','relative')
	.style('top','40px')
	.style('left','30px');

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
			.attr("stroke",'rgba(0,0,0,.2)');
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
	document.getElementById('score').innerHTML = snake.length
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

		for (var i = fruitPos.length - 1; i >= 0; i--) {
			
		
		if (this.head().x == fruitPos[i].x && this.head().y == fruitPos[i].y)
		{

							// this.bl
			this.blocks.unshift({x:window.nCells.hori/2,y:-1})
			snake.length+=1
			document.getElementById('score').innerHTML = snake.length
			


			this.newBlock()		
			fruitPos = addFruit(fruitPos,i)
			snake.speed+=.25
			window.clearInterval(gameLoop)
			gameLoop = window.setInterval(function(){snake.move()},1000/snake.speed)

		}
		};



		
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

	if (head.x < 0 || head.y < 0 || head.x >= window.nCells.hori || head.y >= window.nCells.vert)
	{
		return(true)
	}
	for (var i = snake.blocks.length - 2; i >= 0; i--) {
		if (objEquiv(snake.blocks[i],head))
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
	da = []
	for (var i = 10 - 1; i >= 0; i--) {
			x = Math.floor(Math.random()*(window.nCells.hori-2))+1
		y = Math.floor(Math.random()*(window.nCells.vert-2))+1
		da.push({x:x,y:y})
	};

		svg.selectAll('circle.fruit').remove()
		svg.selectAll('circle.fruit')
			.data(da)
			.enter()
			.append('circle')
			.attr('class','fruit')
			.attr("r",window.cellDim.w/2)
			.attr('cx',function(d){return((d.x+1/2)*window.cellDim.w)})
			.attr('cy',function(d){return((d.y+1/2)*window.cellDim.h)})
			.attr('fill','rgba(255,0,0,.2)')
	return(da)
}

function addFruit(f,i)
{
	console.log(i)
			x1 = Math.floor(Math.random()*(window.nCells.hori-2))+1
		y1 = Math.floor(Math.random()*(window.nCells.vert-2))+1
	f.splice(i,1)
	f.unshift({x:x1,y:y1})
			svg.selectAll('circle.fruit').remove()
		svg.selectAll('circle.fruit')
			.data(da)
			.enter()
			.append('circle')
			.attr('class','fruit')
			.attr("r",window.cellDim.w/2)
			.attr('cx',function(d){return((d.x+1/2)*window.cellDim.w)})
			.attr('cy',function(d){return((d.y+1/2)*window.cellDim.h)})
			.attr('fill','rgba(255,0,0,.2)')
	return(f)

}

init()



window.onresize = resize
gameLoop = window.setInterval(function(){snake.move()},1000/snake.speed)