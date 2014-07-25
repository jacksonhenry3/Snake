if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
}

function objEquiv(obj1,obj2){for(var key in obj1){if (obj1[key]!=obj2[key]){return false}}return true}

function gameBoard(options)
{
	this.idealCellEdge = options.idealEdge || 30;
	this.width         = window.innerWidth-100;
	this.height        = window.innerHeight-100;
	this.nCells        = {hori:Math.floor(this.width/this.idealCellEdge),vert:Math.floor(this.height/this.idealCellEdge)};
	this.realCellDim   = {w: this.width/this.nCells.hori,h:this.height/this.nCells.vert};
	this.vCanvas       =  d3.select("#game").append("svg:svg")
											.attr("width", this.width)
											.attr("height", this.height)
											.style('position','relative')
											.style('padding','20px')
											.style('top','30px')
											.style('left','30px');
	this.drawGrid	   = function ()
		{
			gridData = []
			K = 0
			for (var i = this.nCells.hori ; i >= 0; i--) {
				gridData.push({x1:K,x2:K,y1:0,y2:this.height})
				K += this.realCellDim.w
			};
			K = 0
			for (var i = this.nCells.vert ; i >= 0; i--) {
				gridData.push({x1:0,x2:this.width,y1:K,y2:K})
				K += this.realCellDim.h
			};

			this.vCanvas.selectAll("line.gridLine").remove()
			this.vCanvas.selectAll("line.gridLine")
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
	this.update        = function()
		{
			this.width       = window.innerWidth-100;
			this.height      = window.innerHeight-100;
			this.nCells      = {hori:Math.floor(this.width/this.idealCellEdge),vert:Math.floor(this.height/this.idealCellEdge)};
			this.realCellDim = {w: this.width/this.nCells.hori,h:this.height/this.nCells.vert};
			this.vCanvas.attr("width", this.width)
						.attr("height", this.height);
			this.drawGrid()
		};
}

function Snake(board,options)
{
	this.class       = options.snakeClass        || 'snake';
	this.deltaSpeed  = options.deltaSpeed        || .25;
	this.speed       = options.initialSpeed      || 10;
	this.blockData   = options.intialSnakeBlocks || [{x:Math.floor(board.nCells.hori/2),y:Math.floor(board.nCells.vert/2)}];
	this.direction   = options.initialDirection  || up;
	this.getLength   = function(){return(this.blockData.length);};
	this.selectBlocks = function(){return(board.vCanvas.selectAll('rect.'+this.class ));};
	this.head        = function(){return(this.blockData.last());};
	this.drawNewBlock = function()
		{
			this.selectBlocks().remove();
			this.selectBlocks()
				.data(this.blockData)
				.enter()
				.append('rect')
				.attr('class',this.class )
				.attr("width",board.realCellDim.w)
				.attr("height",board.realCellDim.h)
				.attr('x',function(d){return((d.x)*board.realCellDim.w);})
				.attr('y',function(d){return((d.y)*board.realCellDim.h);})
				.attr('fill','rgba(0,0,0,.4)');
		};
	this.redraw      = function()
		{
			this.selectBlocks()
				.data(this.blockData)
				.transition()
				.ease("linear")
				.duration(1000/this.speed)
				.attr('x',function(d){return((d.x)*board.realCellDim.w);})
				.attr('y',function(d){return((d.y)*board.realCellDim.h);});
		}.bind(this);
	this.updatePos   = function()
		{
			// all non-head blocks follow the leading block
			for (var blockIndex = 0; blockIndex < this.getLength()-1; blockIndex++)
			{

				this.blockData[blockIndex].y = this.blockData[blockIndex+1].y;
				this.blockData[blockIndex].x = this.blockData[blockIndex+1].x;
			}

			// move the head one block in the current direction
			if (this.direction === down)
			{
				this.head().y+=1;
			}
			else if (this.direction === up)
			{
				this.head().y-=1;
			}
			else if (this.direction === left)
			{
				this.head().x-=1;
			}
			else if (this.direction === right)
			{
				this.head().x+=1;
			}
		}.bind(this);
	this.hitWall     = function()
		{
			head = this.head();
			if (head.x < 0 || head.y < 0 || head.x >= board.nCells.hori || head.y >= board.nCells.vert)
			{
				return(true);
			}
		}.bind(this);
	this.hitSelf     = function()
		{
			for (var i = this.blockData.length - 2; i >= 0; i--)
			{
				if (objEquiv(this.blockData[i],this.head()))
				{
					return(true);
				}
			}
		}.bind(this);
	this.collide     = function()
		{
			if (this.hitWall() || this.hitSelf()){return(true);}
		}.bind(this);
	this.stop        = function()
		{
			window.clearInterval(this.gameLoop);
		}.bind(this);
	this.changeSpeed = function()
		{
			this.speed+=this.deltaSpeed;
			this.stop();
			this.start();
		}.bind(this);
	this.restart     = function()
		{
			this.speed             = options.initialSpeed      || 10;
			this.blockData         = options.intialSnakeBlocks || [{x:Math.floor(board.nCells.hori/2),y:Math.floor(board.nCells.vert/2)}];
			this.direction         = options.initialDirection  || up;
			this.gameLoop          = gameLoop;
			this.start();
		}.bind(this);
	this.go          = function()
		{
			console.log('a')
			this.updatePos() 
			if (this.collide())
			{
				this.stop();
				document.getElementById('banner').style.backgroundColor = 'rgb(200,35,60)'
				document.getElementById('play').innerHTML = 'Try to beat '+snake.getLength()
				document.getElementById('banner').style.left = '0%'
				d3.select("body").on("keydown", function()
				{if ( d3.event.keyCode===13){init()}})
			}

			for (var f = 0;f <fruitPos.length;f++)
				{
					if (objEquiv(fruitPos[f],this.head()))
					{
						// add a new block to beginning of blockData
						// this block is outside the board
						// Because of the follow behavior it will jump to end of snake next turn
						this.blockData.unshift({x:board.nCells.hori/2,y:-1});

						scoreBoard.innerHTML = this.getLength();

						//draw the newly added block			
						this.drawNewBlock();

						// add new fruit and remove the eaten fruit
						fruitPos = addFruit(fruitPos,f);

						// increases the speed by set amount (deltaSpeed)
						this.changeSpeed();
					}
				}
			this.redraw();
		}.bind(this)
	this.start       = function()
		{
			this.drawNewBlock()
			this.gameLoop = window.setInterval(snake.go,1000/this.speed);
		}
}

var scoreBoard        = document.getElementById('score')
	up                = 38,
	down              = 40,
	left              = 37,
	right             = 39,
    board             = new gameBoard({})
    snake             = new Snake(board,{})

d3.select("body").on("keydown", function()
	{if ( d3.event.keyCode===13){init()}})


function resize()
{
	board.update()


	board.vCanvas.selectAll('rect.snake')
		.data(snake.blockData)
		.attr("width",board.realCellDim.w)
		.attr("height",board.realCellDim.h)
		.attr('x',function(d){return((d.x)*board.realCellDim.w)})
		.attr('y',function(d){return((d.y)*board.realCellDim.h)})
		.attr('fill','rgba(0,0,0,.2)');

	board.vCanvas.selectAll('circle.fruit').remove()
	board.vCanvas.selectAll('circle.fruit')
		.data(da)
		.enter()
		.append('circle')
		.attr('class','fruit')
		.attr("r",board.realCellDim.w/2)
		.attr('cx',function(d){return((d.x+1/2)*board.realCellDim.w)})
		.attr('cy',function(d){return((d.y+1/2)*board.realCellDim.h)})
		.attr('fill','rgba(50,220,50,.35)')
}

function init()
{
	document.getElementById('banner').style.left = '-110%'
	// document.getElementById('banner').style.height = '-40%'
	scoreBoard.innerHTML = snake.getLength();
d3.select("body").on("keydown", function()
	{

		newDir = d3.event.keyCode
		console.log(newDir)
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

	board.drawGrid()
	// snake.blockData()
	snake.blockData = [{x:Math.floor(board.nCells.hori/2),y:Math.floor(board.nCells.vert/2)}];
	snake.speed = 10;
	snake.direction = up;
	snake.start()
	fruitPos = genFruit()
}



function genFruit()
{
	da = []
	for (var i = 10 - 1; i >= 0; i--) {
			x = Math.floor(Math.random()*(board.nCells.hori-2))+1
		y = Math.floor(Math.random()*(board.nCells.vert-2))+1
		da.push({x:x,y:y})
	};

		board.vCanvas.selectAll('circle.fruit').remove()
		board.vCanvas.selectAll('circle.fruit')
			.data(da)
			.enter()
			.append('circle')
			.attr('class','fruit')
			.attr("r",board.realCellDim.w/2)
			.attr('cx',function(d){return((d.x+1/2)*board.realCellDim.w)})
			.attr('cy',function(d){return((d.y+1/2)*board.realCellDim.h)})
			.attr('fill','rgba(50,220,50,.35)')
	return(da)
}

function addFruit(f,i)
{

	x1 = Math.floor(Math.random()*(board.nCells.hori-2))+1
	y1 = Math.floor(Math.random()*(board.nCells.vert-2))+1
	f.splice(i,1)
	f.unshift({x:x1,y:y1})
		board.vCanvas.selectAll('circle.fruit').remove()
		board.vCanvas.selectAll('circle.fruit')
			.data(da)
			.enter()
			.append('circle')
			.attr('class','fruit')
			.attr("r",board.realCellDim.w/2)
			.attr('cx',function(d){return((d.x+1/2)*board.realCellDim.w)})
			.attr('cy',function(d){return((d.y+1/2)*board.realCellDim.h)})
			.attr('fill','rgba(50,220,50,.35)')
	return(f)
}





window.onresize = resize

