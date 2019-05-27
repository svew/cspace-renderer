
abstract class Vector {
	readonly x: number
	readonly y: number
	readonly z: number

	constructor(x: number, y: number, z?: number) {
		this.x = x
		this.y = y
		if(z == null) {
			this.z = NaN
		}
	}

	abstract add(v: Vector): Vector
	abstract subtract(v: Vector): Vector
	abstract multiply(v: Vector): Vector
	abstract divide(v: Vector): Vector

	abstract unit(): Vector
	abstract reverse(): Vector
	abstract length(): number

	abstract dot(v: Vector): number
	abstract cross(v: Vector): Vector

	equals(v: Vector): boolean {
		return this.x == v.x && this.y == v.y && this.z == v.z
	}
	toString(): string {
		if(this.z == NaN) {
			return "<" + this.x + ", " + this.y + ">"
		} else {
			return "<" + this.x + ", " + this.y + ", " + this.z + ">"
		}
	}
	draw(context: CanvasRenderingContext2D, color?: string) {
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
}

class Vector2 extends Vector {
	constructor(x: number, y: number) {
		super(x, y)
	}
	add(v: Vector2): Vector2 {
		return new Vector2(this.x + v.x, this.y + v.y)
	}
	subtract(v: Vector2): Vector2 {
		return new Vector2(this.x - v.x, this.y - v.y)
	}
	multiply(v: Vector2): Vector2 {
		return new Vector2(this.x * v.x, this.y * v.y)
	}
	divide(v: Vector2): Vector2 {
		return new Vector2(this.x / v.x, this.y / v.y)
	}
	unit(): Vector2 {
		let l = this.length()
		return new Vector2(this.x / l, this.y / l)
	}
	reverse(): Vector2 {
		return new Vector2(-this.x, -this.y)
	}
	length(): number {
		return Math.sqrt(this.x*this.x + this.y*this.y)
	}
	dot(v: Vector): number {
		return this.x*v.x + this.y*v.y
	}
	cross(v: Vector): Vector3 {
		return new Vector3(0, 0, this.x*v.y - this.y*v.x)
	}
}

class Vector3 extends Vector {
	constructor(x: number, y: number, z: number) {
		super(x, y, z)
	}
	add(v: Vector2): Vector3 {
		return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z)
	}
	subtract(v: Vector2): Vector3 {
		return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z)
	}
	multiply(v: Vector2): Vector3 {
		return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z)
	}
	divide(v: Vector2): Vector3 {
		return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z)
	}
	unit(): Vector3 {
		let l = this.length()
		return new Vector3(this.x / l, this.y / l, this.z / l)
	}
	reverse(): Vector3 {
		return new Vector3(-this.x, -this.y, -this.z)
	}
	length(): number {
		return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z)
	}
	dot(v: Vector): number {
		return this.x*v.x + this.y*v.y + this.z*v.z
	}
	cross(v: Vector): Vector {
		throw new Error("Method not implemented.");
	}
}




/*
	i, j, k: Integers denoting direction vector is going in.

var Vector2 = function(x, y) {
	this.x = x
	this.y = y
}

Vector2.prototype.cosangle = function(v) {
	return this.dot(v) / (this.len() * v.len())
}
Vector2.prototype.angle = function(v) {
	return Math.acos(this.cosangle(v))
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
*/