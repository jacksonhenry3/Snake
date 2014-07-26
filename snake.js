var up         = 38,// These are the key codes for the directions
    down       = 40,
    left       = 37,
    right      = 39;
  
function Snake(board,options)
{
	this.class        = options.class             || 'snake';
	this.deltaSpeed   = options.deltaSpeed        || 1/4;
	this.speed        = options.initialSpeed      || 10;
	this.blockData    = options.intialSnakeBlocks || [{x:Math.floor(board.nCells.hori/2),y:Math.floor(board.nCells.vert/2)}];
	this.direction    = options.initialDirection  || up;
	this.getLength    = function(){return(this.blockData.length);};
	this.selectBlocks = function(){return(board.vCanvas.selectAll('rect.'+this.class ));};
	this.head         = function(){return(this.blockData[this.blockData.length-1]);};
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
	this.redraw       = function()
		{
			this.selectBlocks()
				.data(this.blockData)
				.transition()
				.ease("linear")
				.duration(1000/this.speed)
				.attr('x',function(d){return((d.x)*board.realCellDim.w);})
				.attr('y',function(d){return((d.y)*board.realCellDim.h);});
		}.bind(this);
	this.updatePos    = function()
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
	this.hitWall      = function()
		{
			head = this.head();
			if (head.x < 0 || head.y < 0 || head.x >= board.nCells.hori || head.y >= board.nCells.vert)
			{
				return(true);
			}
		}.bind(this);
	this.hitSelf      = function()
		{
			for (var i = this.blockData.length - 2; i >= 0; i--)
			{
				if (objEquiv(this.blockData[i],this.head()))
				{
					return(true);
				}
			}
		}.bind(this);
	this.collide      = function()
		{
			if (this.hitWall() || this.hitSelf())
				{
					return(true);
				}
		}.bind(this);
	this.stop         = function()
		{
			window.clearInterval(this.gameLoop)
		}.bind(this);
	this.changeSpeed  = function()
		{
			this.speed+=this.deltaSpeed;
			this.stop();
			this.start();
		}.bind(this);
	this.restart      = function()
		{
			this.speed             = options.initialSpeed      || 10;
			this.blockData         = options.intialSnakeBlocks || [{x:Math.floor(board.nCells.hori/2),y:Math.floor(board.nCells.vert/2)}];
			this.direction         = options.initialDirection  || up;
			this.gameLoop          = gameLoop;
			this.start();
		}.bind(this);
	this.go           = function()
		{
			this.updatePos();
			if (this.collide())
			{
				this.stop();
				document.getElementById('banner').style.backgroundColor = 'rgb(200,35,60)';
				document.getElementById('play').innerHTML = 'Try to beat '+this.getLength();
				document.getElementById('banner').style.left = '0%';
				d3.select("body").on("keydown", function()
				{if (d3.event.keyCode===13){init();}});
			}

			for (var fruitIndex = allFruit.length - 1; fruitIndex >= 0;fruitIndex--) {
				
					if (objEquiv(allFruit[fruitIndex].position,this.head()))
					{
						// add a new block to beginning of blockData
						// this block is outside the board
						// Because of the follow behavior it will jump to end of snake next turn
						this.blockData.unshift({x:board.nCells.hori/2,y:-1});

						scoreBoard.innerHTML = this.getLength();

						//draw the newly added block			
						this.drawNewBlock();

						// add new fruit and remove the eaten fruit
						allFruit = addFruit(allFruit,fruitIndex);

						// increases the speed by set amount (deltaSpeed)
						this.changeSpeed();
					}
				}
			this.redraw();
		}.bind(this);
	this.start        = function()
		{
			this.drawNewBlock();
			this.gameLoop = window.setInterval(snake.go,1000/this.speed);
		}.bind(this);
	this.resizeCell   = function()
		{
			this.selectBlocks()
				.data(this.blockData)
				.attr("width",board.realCellDim.w)
				.attr("height",board.realCellDim.h)
				.attr('x',function(d){return((d.x)*board.realCellDim.w);})
				.attr('y',function(d){return((d.y)*board.realCellDim.h);})
				.attr('fill','rgba(0,0,0,.2)');
		}.bind(this);
}