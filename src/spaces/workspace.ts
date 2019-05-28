
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