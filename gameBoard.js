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