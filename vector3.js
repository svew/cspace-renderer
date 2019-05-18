
/*
	i, j, k: Integers denoting direction vector is going in.
*/
var Vector3 = function(x, y, z) {
	nancheck(x, 'x')
	nancheck(y, 'y')
	nancheck(z, 'z')

	this.x = x
	this.y = y
	this.z = z
}

Vector3.prototype.add = function(v) {
	if(typeof v == "number") {
		v = new Vector3(v, v, v)
	}
	return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z)
}
Vector3.prototype.subtract = function(v) {
	if(typeof v == "number") {
		v = new Vector3(v, v, v)
	}
	return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z)
}
Vector3.prototype.multiply = function(v) {
	if(typeof v == "number") {
		v = new Vector3(v, v, v)
	}
	return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z)
}
Vector3.prototype.divide = function(v) {
	if(typeof v == "number") {
		v = new Vector3(v, v, v)
	}
	return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z)
}
Vector3.prototype.cross = function(v) {
	let sx = this.y*v.z - this.z*v.y
	let sy = this.z*v.x - this.x*v.z
	let sz = this.x*v.y - this.y*v.x
	return new Vector3(sx, sy, sz)
}
Vector3.prototype.reverse = function() {
	return this.multiply(-1)
}
Vector3.prototype.normalize = function() {
	let len = this.len()
	return new Vector3(this.x/len, this.y/len, this.z/len)
}
Vector3.prototype.len = function() {
	return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z)
}
Vector3.prototype.dot = function(v) {
	return this.x*v.x + this.y*v.y + this.z*v.z
}
Vector3.prototype.cosangle = function(v) {
	return this.dot(v).divide(this.len()).divide(v.len())
}
Vector3.prototype.angle = function(v) {
	return Math.acos(this.cosangle(v))
}
Vector3.prototype.clone = function() {
	return new Vector3(this.x, this.y, this.z)
}
Vector3.prototype.toString = function() {
	return "<" + this.x + ", " + this.y + ", " + this.z + ">"
}
Vector3.prototype.equals = function(v) {
	return this.x == v.x && this.y == v.y && this.z == v.z
}
Vector3.prototype.asVector2 = function() {
	return new Vector2(this.x, this.z)
}
Vector3.prototype.rotateX = function(degrees) {
	let rads = degrees / 180 * Math.PI
	let sx = this.x
	let sy = this.y * Math.cos(rads) - this.z * Math.sin(rads)
	let sz = this.y * Math.sin(rads) + this.z * Math.cos(rads)
	return new Vector3(sx, sy, sz)
}
Vector3.prototype.rotateY = function(degrees) {
	let rads = degrees / 180 * Math.PI
	let sx = this.x * Math.cos(rads) + this.z * Math.sin(rads)
	let sy = this.y
	let sz = this.z * Math.cos(rads) - this.x * Math.sin(rads)
	return new Vector3(sx, sy, sz)
}
Vector3.prototype.rotateZ = function(degrees) {
	let rads = degrees / 180 * Math.PI
	let sx = this.x * Math.cos(rads) - this.y * Math.sin(rads)
	let sy = this.x * Math.sin(rads) + this.y * Math.cos(rads)
	let sz = this.z
	return new Vector3(sx, sy, sz)
}