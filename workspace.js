
var Workspace = function(width, height) {
	this.width = width
	this.height = height
	this.obstacles = []
	this.borders = []
	this.robot = null
	this.goal = null
	this.canvas = null
	this.context = null
	this.setupContext()
	this.setupBorders()
}

Workspace.prototype.addObstacle = function(obs) {
	this.obstacles.push(obs)
	obs.draw(this.context)
	let v = obs.getVertices()
	console.log('Added new obstacle: ')
	for(let i = 0; i < v.length; i+=1) {
		console.log(v[i])
	}
}

Workspace.prototype.addRobot = function(robot) {
	this.robot = robot
	let v = robot.getVertices()
	console.log('Added new robot: ')
	for(let i = 0; i < v.length; i+=1) {
		console.log(v[i])
	}
}

Workspace.prototype.draw = function(context) {
	context.drawImage(this.canvas, 0, 0)
	if(this.robot != null) {
		this.robot.draw(context)
	}
	if(this.goal != null) {
		this.goal.draw(context, 'rgb(255, 25, 50)')
	}
}

Workspace.prototype.reset = function() {
	this.obstacles = []
	this.borders = []
	this.robot = null
	this.goal = null
	this.setupContext()
	this.setupBorders()
}

Workspace.prototype.setupContext = function() {
	this.canvas = document.createElement('canvas')
	this.canvas.width = this.width
	this.canvas.height = this.height
	this.context = this.canvas.getContext('2d')
	this.context.lineWidth = 2
	this.context.lineCap = 'round'
	this.context.lineJoin = 'round'
	drawGrid(this.context, this.canvas.width, this.canvas.height)
}

Workspace.prototype.setupBorders = function() {
	v0 = new Vector2(0, 0)
	v1 = new Vector2(0, this.height)
	v2 = new Vector2(this.width, this.height)
	v3 = new Vector2(this.width, 0)
	this.borders.push(new Line(v0, v1))
	this.borders.push(new Line(v1, v2))
	this.borders.push(new Line(v2, v3))
	this.borders.push(new Line(v3, v0))
}