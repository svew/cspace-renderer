
// A file of definitions which must be loaded before all else

// Different types of drawing
var DT_NONE = 0
var DT_RECT = 1
var DT_TRI = 2
var DT_LINE = 3
var DT_RECT_ROBOT = 4
var DT_TRI_ROBOT = 5
var DT_LINE_ROBOT = 6
var DT_GOAL = 7

// Cursor types
var CT_NONE = 0
var CT_OBSTACLE = 1
var CT_ROBOT = 2

// Different types of convex shapes
var CONVEX_VERTEX = 0
var CONVEX_LINE = 1
var CONVEX_TRIANGLE = 2
var CONVEX_RECTANGLE = 3
var CONVEX_POLYGON = 4

// The width of the grid the mouse may affix to
var GRID_WIDTH = 15.0

// Apparently, % in js isn't actually a modulus, it's remainder. Returns a % b
function modulus(a: number, b: number): number {
	return a - b * Math.floor(a / b)
}

function getRandomInt(max: number): number {
	return Math.floor(Math.random() * Math.floor(max))
}


// Draws the shortest line from the given point to the given line
function findPointToLine(start, end, point) {

	let result = findPointToLineEuclidean(start, end, point)

	// If the points are 3D and the nearest point is in a different y plane than the point,
	// used a mixed search to find the distance and intermediate node
	/*if(point.z != null && result.nearestPoint.y != point.y) {
		let nearest = result.nearestPoint
		let intermediate = new Vector3(point.x, nearest.y, point.z)
		let distance = point.subtract(intermediate).len()
		distance += intermediate.subtract(nearest).len()
		return { 
			'distance': distance, 
			'nearestPoint': nearest, 
			'intermediatePoint': intermediate 
		}
	}*/
	return result
}


function nullcheck(arg, name) {
	if(arg == null) {
		throw Error("'" + name + "' cannot be null, was " + arg)
	}
}

function nancheck(arg, name) {
	if(arg == null || isNaN(arg) || arg == undefined) {
		throw Error("'" + name + "' must be a number, was " + arg)
	}
}