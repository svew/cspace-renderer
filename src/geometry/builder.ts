
abstract class PolygonBuilder {
	protected vertices: Vector2[]
	protected maxVertices: number

	constructor(maxVertices: number) {
		this.vertices = []
		this.maxVertices = maxVertices
	}

	abstract append(vertex: Vector2): void

	abstract draw(context: CanvasRenderingContext2D, next?: Vector2): void

	abstract finish(): Polygon

	isFinished(): boolean {
		return this.maxVertices <= this.vertices.length
	}
}

class ConvexBuilder extends PolygonBuilder {
	private vertices: Vector2[]

	constructor(maxVertices: number) {
		super(maxVertices)
		this.vertices = []
	}
	
	append(vertex: Vector2): void {
		if(this.isFinished()) {
			return
		}
		
	}

	draw(context: CanvasRenderingContext2D, next?: Vector2): void {

	}

	finish(): Polygon {
		
	}
}
