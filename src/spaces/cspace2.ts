
class CSpace2 {
	readonly workspace: Workspace

	obstacles: Polygon

	constructor(workspace: Workspace) {
		this.workspace = workspace
	}

	
}


var CSpace2D = function(workspace) {
	this.workspace = workspace
	this.width = workspace.width
	this.height = workspace.height
	this.obstacles = []
	this.borders = []
	this.robot = null
	this.canvas = null
	this.context = null
	this.setupContext()
}

CSpace2D.prototype.make = function() {

	robot = this.workspace.robot
	this.robot = robot.origin
	let angle = robot.angle

	// First we need to flip the robot
	robot.setAngle(angle + 180)
	let r = robot.getVertices()
	robot.setAngle(angle)

	// Then, the robot's origin must be at (0,0) for the minkowski sum
	for(let i = 0; i < r.length; i+=1) {
		r[i] = r[i].subtract(robot.origin)
	}

	for(let i = 0; i < this.workspace.obstacles.length; i+=1) {
		let o = this.workspace.obstacles[i].getVertices()
		let t = minkowski(r, o)
		this.addObstacle(new Convex(t))
	}

	for(let i = 0; i < this.workspace.borders.length; i+=1) {
		let o = this.workspace.borders[i].getVertices()
		let t = minkowski(r, o)
		this.borders.push(new Convex(t))
		this.borders[i].draw(this.context)
	}
}

CSpace2D.prototype.addObstacle = function(obs) {
	nullcheck(obs, 'obs')
	
	this.obstacles.push(obs)
	obs.draw(this.context)
}

CSpace2D.prototype.draw = function(context) {
	nullcheck(context, 'context')

	context.drawImage(this.canvas, 0, 0)
	if(this.robot != null) {
		this.robot.draw(context)
	}
	if(this.workspace.goal != null) {
		this.workspace.goal.draw(context, 'rgb(255, 25, 50)')
	}
}

CSpace2D.prototype.setupContext = function() {
	this.canvas = document.createElement('canvas')
	this.canvas.width = this.width
	this.canvas.height = this.height
	this.context = this.canvas.getContext('2d')
	this.context.lineWidth = 2
	this.context.lineCap = 'round'
	this.context.lineJoin = 'round'
	drawGrid(this.context, this.canvas.width, this.canvas.height)
}

CSpace2D.prototype.collidesLine = function(p0, p1) {
	nullcheck(p0, 'p0')
	nullcheck(p1, 'p1')

	for(let i = 0; i < this.obstacles.length; i+=1) {
		if(this.obstacles[i].collidesLine(p0, p1)) {
			return true
		}
	}
	for(let i = 0; i < this.borders.length; i+=1) {
		if(this.borders[i].collidesLine(p0, p1)) {
			return true
		}
	}
	return false
}

CSpace2D.prototype.collidesVertex = function(v) {
	nullcheck(v, 'v')

	for(let i = 0; i < this.obstacles.length; i+=1) {
		if(this.obstacles[i].collidesVertex(v)) {
			return true
		}
	}
	for(let i = 0; i < this.borders.length; i+=1) {
		if(this.borders[i].collidesVertex(v)) {
			return true
		}
	}
	return false
}

CSpace2D.prototype.getRandomVertex = function() {
	
	for(let i = 0; i < 100000; i+=1) {
		let x = Math.random() * this.width
		let y = Math.random() * this.height
		let v = new Vector2(x, y)
		if(!this.collidesVertex(v)) {
			return v
		}
	}

	throw Error('Space too crowded, couldnt find any open areas')
}

CSpace2D.prototype.getGoalVertex = function() {
	return this.workspace.goal
}

CSpace2D.prototype.getStartVertex = function() {
	return this.workspace.robot.origin
}