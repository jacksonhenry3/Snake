width = window.innerWidth
height = window.innerHeight
k = 40
direction = k
	coords = [[5,3]]
d3.select("body").on("keydown", KEY)
var svg = d3.select("#game").append("svg:svg")
	.attr("width", width)
	.attr("height", height)
	
	// .style("background-color",'teal')
	.style("pointer-events", "all");

idealCellEdge = 100

NHorizCells = Math.floor(width/idealCellEdge)
NVertiCells = Math.floor(height/idealCellEdge)

actualCellWidth = width/NHorizCells
actualCellHeight = height/NVertiCells

window.onresize = resize
resize()
function resize()
{
	width = window.innerWidth
	height = window.innerHeight
	svg.attr("width", width)
	   .attr("height", height)

	idealCellEdge = 10

	NHorizCells = Math.floor(width/idealCellEdge)
	NVertiCells = Math.floor(height/idealCellEdge)

	actualCellWidth = width/NHorizCells
	actualCellHeight = height/NVertiCells

	makeGrid()


	// svg.selectAll("rect").remove()

svg.selectAll('rect')
	.data(coords)
	.enter()
	.append('rect')
	.attr("width",actualCellWidth)
	.attr("height",actualCellHeight)
	.attr('x',function(d){return((d[0]+2)*actualCellWidth)})
	.attr('y',function(d){return((d[1]+2)*actualCellHeight)})
	.attr('fill','rgba(0,0,0,.2)')

}

length = 10
function makeGrid()
{
data = []
K = 2*actualCellWidth
for (var i = NHorizCells -4; i >= 0; i--) {
	data.push({x1:K,x2:K,y1:2*actualCellHeight,y2:height-2*actualCellHeight})
	K += actualCellWidth
};
K = 2*actualCellHeight
for (var i = NVertiCells-4 ; i >= 0; i--) {
	data.push({x1:actualCellWidth*2,x2:width-actualCellWidth*2,y1:K,y2:K})
	K += actualCellHeight
};


svg.selectAll("line").remove()
svg.selectAll("line")
	.data(data)
	.enter()
	.append("line")
	.attr("x1",function(d){return(d.x1)})
	.attr("x2",function(d){return(d.x2)})
	.attr("y1",function(d){return(d.y1)})
	.attr("y2",function(d){return(d.y2)})
	.attr("stroke-width",.2)
	.attr("stroke",'rgb(0,0,0)');

}

function KEY()
{
	k = d3.event.keyCode

}


function go()
{
	// coords.push(coords[0])
	if (k===40 && direction != 38)
		{

			newCoord = [coords[coords.length-1][0],coords[coords.length-1][1]]
			newCoord[1]+=1
			coords.push(newCoord)
			direction = k
		}
	else if (k===38 && direction !=40)
		{
			newCoord = [coords[coords.length-1][0],coords[coords.length-1][1]]
			newCoord[1]-=1
			coords.push(newCoord)
			direction = k
		}
	else if (k===37 && direction !=39)
		{
			newCoord = [coords[coords.length-1][0],coords[coords.length-1][1]]
			newCoord[0]-=1
			coords.push(newCoord)
			direction = k
		}
	else if (k===39 && direction !=37)
		{
			newCoord = [coords[coords.length-1][0],coords[coords.length-1][1]]
			newCoord[0]+=1
			coords.push(newCoord)
			direction = k
		}
	else
	{
	if (direction===40)
		{
			newCoord = [coords[coords.length-1][0],coords[coords.length-1][1]]
			newCoord[1]+=1
			coords.push(newCoord)
			
		}
	else if (direction===38)
		{
			newCoord = [coords[coords.length-1][0],coords[coords.length-1][1]]
			newCoord[1]-=1
			coords.push(newCoord)
			
		}
	else if (direction===37 )
		{
			newCoord = [coords[coords.length-1][0],coords[coords.length-1][1]]
			newCoord[0]-=1
			coords.push(newCoord)
			
		}
	else if (direction===39)
		{
			newCoord = [coords[coords.length-1][0],coords[coords.length-1][1]]
			newCoord[0]+=1
			coords.push(newCoord)
			
		}

	}
	
	if (collision() == true)
	{
		clearInterval(game);
	}
	resize()
}
game = window.setInterval(go,500)



function collision()
{
	// for (var i = coords.length - 1; i >= 0; i--) {
	// 	for (var j = coords.length - 1; j >= 0; j--) {
	// 		console.log(i,j)
	// 		if (coords[i] == coords[j])
	// 		{
	// 			// console.log(i,j)
	// 			return(true)
	// 		}
	// 	};
	// };
		for (var i = coords.length - 1; i >= 0; i--) {
			console.log(coords[i])
			for (var j = coords.length - 1; j >= 0; j--) {
			
			if (coords[i] == [5,3])
			{
		console.log(i,j)
				if (i != j)
				{
					return(true)
				}
			}
		};
	};
}