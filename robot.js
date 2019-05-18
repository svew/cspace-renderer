
function setRobotBrush(context) {
	context.fillStyle = 'rgb(120, 120, 255)'
	context.strokeStyle = 'rgb(30, 30, 255)'
	context.lineWidth = 2
	context.lineCap = 'round'
	context.lineJoin = 'round'
}

var Robot = function(vertices, origin) {
	this.orig_v = vertices
	this.curr_v = vertices
	this.origin = origin
	this.angle = 0
}

Robot.prototype.draw = function(context) {

	setRobotBrush(context)
	context.beginPath()
	context.moveTo(this.curr_v[0].x, this.curr_v[0].y)
	for(i = 0; i <= this.curr_v.length; i+=1) {
		v = this.curr_v[i % this.curr_v.length]
		context.lineTo(v.x, v.y)
	}
	context.fill()
	context.stroke()
	if(this.origin != null) {
		this.origin.draw(context)
	}
}

Robot.prototype.setAngle = function(degrees) {
	if(this.origin == null) {
		throw Error('Cant rotate a robot without an origin')
	}
	this.curr_v = []
	for(i = 0; i < this.orig_v.length; i+=1) {
		v = this.orig_v[i]
		nv = v.subtract(this.origin).rotateZ(degrees).add(this.origin)
		this.curr_v.push(nv)
	}
	this.angle = degrees
}

Robot.prototype.getVertices = function() {
	return this.curr_v
}