
// Defines a simple polygon
class Polygon  extends Drawable {

	readonly vertices: Vector2[]
	readonly n: number

	strokeStyle: string
	fillStyle: string 

	constructor(vertices: Vector2[]) {
		if(vertices.length < 1) {
			throw Error("Polygon requires at least one vertex")
		}
		super(Color.ORANGE)
		this.vertices = vertices
		this.n = vertices.length
	}

	draw(context: CanvasRenderingContext2D) {
		super.draw(context)
		if(this.n == 1) {
			this.vertices[0].draw(context)
		} else {
			context.beginPath()
			context.moveTo(this.vertices[0].x, this.vertices[0].y)
			for(let i = 0; i <= this.n; i += 1) {
				let v = this.vertices[i % this.n]
				context.lineTo(v.x, v.y)
			}
	
			context.fill()
			context.stroke()
		}
	}

	protected lowestVertexIndex(): number {
		let lowest = 0
		for(let i = 1; i < this.n; i += 1) {
			let v0 = this.vertices[lowest]
			let v1 = this.vertices[i]
			if(v1.y < v0.y || (v1.y == v0.y && v1.x < v0.x)) {
				lowest = i
			}
		}
		return lowest
	}
}