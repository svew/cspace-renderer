
class Vector extends Drawable {
	readonly x: number
	readonly y: number
	readonly z: number

	constructor(x: number, y: number, z?: number) {
		super(Color.BLACK)
		this.x = x
		this.y = y
		if(z == null) {
			this.z = NaN
		}
	}

	add(x: Vector | number, y: number = 0, z: number = NaN): Vector {
		if(x instanceof Vector) {
			return new Vector(this.x + x.x, this.y + x.y, this.z + x.z)
		} else {
			return new Vector(this.x + x, this.y + y, this.z + z)
		}
	}
	subtract(x: Vector | number, y: number = 0, z: number = NaN): Vector {
		if(x instanceof Vector) {
			return new Vector(this.x - x.x, this.y - x.y, this.z - x.z)
		} else {
			return new Vector(this.x - x, this.y - y, this.z - z)
		}
	}
	multiply(x: Vector | number, y: number = 0, z: number = NaN): Vector {
		if(x instanceof Vector) {
			return new Vector(this.x * x.x, this.y * x.y, this.z * x.z)
		} else {
			return new Vector(this.x * x, this.y * y, this.z * z)
		}
	}
	divide(x: Vector | number, y: number = 0, z: number = NaN): Vector {
		if(x instanceof Vector) {
			return new Vector(this.x / x.x, this.y / x.y, this.z / x.z)
		} else {
			return new Vector(this.x / x, this.y / y, this.z / z)
		}
	}
	unit(): Vector {
		let l = this.length()
		return new Vector(this.x / l, this.y / l, this.z / l)
	}
	reverse(): Vector {
		return new Vector(-this.x, -this.y, -this.z)
	}
	length(): number {
		if(this.z == NaN) {
			return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z)
		} else {
			return Math.sqrt(this.x*this.x + this.y*this.y)
		}
	}
	dot(v: Vector): number {
		if(this.z == NaN) {
			return this.x*v.x + this.y*v.y
		} else {
			return this.x*v.x + this.y*v.y + this.z*v.z
		}
	}
	cross(v: Vector): Vector {
		if(this.z == NaN) {
			return new Vector(0, 0, this.x*v.y - this.y*v.x)
		} else {
			let cx = this.y*v.z - this.z*v.y
			let cy = this.z*v.x - this.x*v.z
			let cz = this.x*v.y - this.y*v.x
			return new Vector(cx, cy, cz)
		}
	}
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
	draw(context: CanvasRenderingContext2D) {
		super.draw(context)
		context.beginPath()
		context.moveTo(this.x, this.y)
		context.arc(this.x, this.y, 3, 0, Math.PI * 2)
		context.stroke()
	}
}




/*

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