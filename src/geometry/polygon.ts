
// Defines a simple polygon
class Polygon {
	static readonly DEFAULT_STROKE_STYLE = 'rgb(255, 51, 0)'
	static readonly DEFAULT_FILL_STYLE = 'rgb(255, 150, 100)'

	readonly vertices: Vector2[]
	readonly n: number

	strokeStyle: string
	fillStyle: string 

	constructor(vertices: Vector2[]) {
		if(vertices.length < 1) {
			throw Error("Polygon requires at least one vertex")
		}
		this.vertices = vertices
		this.n = vertices.length
		this.strokeStyle = Polygon.DEFAULT_STROKE_STYLE
		this.fillStyle = Polygon.DEFAULT_FILL_STYLE
	}

	setColor(color: string) {
		
	}

	draw(context: CanvasRenderingContext2D) {
		if(this.n == 1) {
			this.vertices[0].draw(context, this.strokeStyle)
		} else {
			context.strokeStyle = this.strokeStyle
			context.fillStyle = this.fillStyle
	
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