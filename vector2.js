
/*
	i, j, k: Integers denoting direction vector is going in.
*/
var Vector2 = function(x, y) {
	this.x = x
	this.y = y
}

Vector2.prototype.add = function(v) {
	if(typeof v == "number") {
		v = new Vector2(v, v)
	}
	return new Vector2(this.x + v.x, this.y + v.y)
}
Vector2.prototype.subtract = function(v) {
	if(typeof v == "number") {
		v = new Vector2(v, v)
	}
	return new Vector2(this.x - v.x, this.y - v.y)
}
Vector2.prototype.multiply = function(v) {
	if(typeof v == "number") {
		v = new Vector2(v, v)
	}
	return new Vector2(this.x * v.x, this.y * v.y)
}
Vector2.prototype.divide = function(v) {
	if(typeof v == "number") {
		v = new Vector2(v, v)
	}
	return new Vector2(this.x / v.x, this.y / v.y)
}
Vector2.prototype.cross = function(v) {
	return this.x*v.y - this.y*v.x
}
Vector2.prototype.reverse = function() {
	return this.multiply(-1)
}
Vector2.prototype.normalize = function() {
	let len = this.len()
	return new Vector2(this.x/len, this.y/len)
}
Vector2.prototype.len = function() {
	return Math.sqrt(this.x*this.x + this.y*this.y)
}
Vector2.prototype.dot = function(v) {
	return this.x*v.x + this.y*v.y
}
Vector2.prototype.cosangle = function(v) {
	return this.dot(v) / (this.len() * v.len())
}
Vector2.prototype.angle = function(v) {
	return Math.acos(this.cosangle(v))
}
Vector2.prototype.toString = function() {
	return "<" + this.x + ", " + this.y + ">"
}
Vector2.prototype.equals = function(v) {
	return this.x == v.x && this.y == v.y
}
Vector2.prototype.rotateZ = function(degrees) {
	let rads = degrees / 180 * Math.PI
	let sx = this.x * Math.cos(rads) - this.y * Math.sin(rads)
	let sy = this.x * Math.sin(rads) + this.y * Math.cos(rads)
	return new Vector2(sx, sy)
}
Vector2.prototype.asVector2 = function() {
	return this
}
Vector2.prototype.getVertices = function() {
	return [ this ]
}
Vector2.prototype.draw = function(context, color) {
	if(color == null) {
		context.fillStyle = 'rgb(20, 20, 20)'
	} else {
		context.fillStyle = color
	}
	context.beginPath()
	context.moveTo(this.x, this.y)
	context.arc(this.x, this.y, 3, 0, Math.PI * 2)
	context.fill()
}