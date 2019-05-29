
abstract class Builder {
	// Assists a user in constructing some kind of shape, allowing them to click
	// on the space to add new objects onto it

	protected vertices: Vector2[]
	protected maxVertices: number

	constructor(maxVertices: number) {
		this.vertices = []
		this.maxVertices = maxVertices
	}

	abstract append(vertex: Vector2): void
	abstract draw(context: CanvasRenderingContext2D, next?: Vector2): void
	abstract finish(): any

	isFinished(): boolean {
		return this.maxVertices <= this.vertices.length
	}
}

abstract class PolygonBuilder extends Builder {
	abstract finish(): Polygon
}

class ConvexBuilder extends PolygonBuilder {
	// Assists in constructing a new convex polygon

	constructor(maxVertices: number) {
		super(maxVertices)
	}
	
	append(vertex: Vector2): void {
		if(this.isFinished()) {
			return
		}
		
	}

	draw(context: CanvasRenderingContext2D, next?: Vector2): void {

	}

	finish(): Polygon {
		return null
	}
}

class RectangleBuilder extends PolygonBuilder {
	append(vertex: Vector2): void {
		throw new Error("Method not implemented.");
	}	
	draw(context: CanvasRenderingContext2D, next?: Vector2): void {
		throw new Error("Method not implemented.");
	}
	finish(): Polygon {
		throw new Error("Method not implemented.");
	}
}

class GridBuilder extends Builder {
	// Assists in creating rectangles which 

	append(vertex: Vector2): void {
		throw new Error("Method not implemented.");
	}	
	draw(context: CanvasRenderingContext2D, next?: Vector2): void {
		throw new Error("Method not implemented.");
	}
	finish(): Polygon {
		throw new Error("Method not implemented.");
	}
}
