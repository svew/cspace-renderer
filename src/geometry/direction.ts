
class Direction {
	// Describes a cardinal direction in a 2D plane
	public static readonly TRANSLATE = [
		new Vector2(1, 0),
		new Vector2(0, -1),
		new Vector2(-1, 0),
		new Vector2(0, 1)
	]
	public static readonly OFFSET = [
		new Vector2(1, 0),
		new Vector2(0, 0),
		new Vector2(0, 1),
		new Vector2(1, 1)
	]

	value: number

	private constructor(value: number) {
		if(value != 0 && value != 1 && value != 2 && value != 3) {
			throw Error("Direction cannot have value of "+value)
		}
		this.value = value
	}
	
	cw(): Direction {
		let cw = modulus(this.value - 1, 4)
		return new Direction(cw)
	}

	ccw(): Direction {
		let cw = modulus(this.value + 1, 4)
		return new Direction(cw)
	}

	addTo(v: Vector2): Vector2 {
		return Direction.TRANSLATE[this.value].add(v)
	}

	asOffset(): Vector2 {
		return Direction.OFFSET[this.value]
	}

	equals(d: Direction) {
		return this.value == d.value
	}

	static RIGHT(): Direction {
		return new Direction(0)
	}
	static UP(): Direction {
		return new Direction(1)
	}
	static LEFT(): Direction {
		return new Direction(2)
	}
	static DOWN(): Direction {
		return new Direction(3)
	}
}