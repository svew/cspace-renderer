
class RRT2DLayer extends Layer {
	private checkGoalFreq: number
	private space: FreeSpace
	private nodes: RRTNode[]
	private end: Vector2

	constructor(space: FreeSpace, start: Vector2, end: Vector2) {
		super()
		this.nodes = []
		this.space = space
		this.checkGoalFreq = 100
		this.end = end

		let init = new RRTNode()
		init.position = start
		this.nodes.push(init)
	}
	step(): void {
		if(this.nodes.length % this.checkGoalFreq == 0) {
			
		}
	}
	draw(context: CanvasRenderingContext2D): void {
		for(let i = 0; i < this.nodes.length; i += 1) {
			let node = this.nodes[i]
			if(node.line != null) {
				if(node.highlight) {
					node.line.setColor("blue")
				} else {
					node.line.setColor("black")
				}
				node.line.draw(context)
			}
			//color = 'rgb(100, 100, 255)'
			//color = 'rgb(10, 10, 10)'
		}
	}
	getPath(): Vector2[] {
		let path: Vector2[] = []
		let iter = this.nodes[this.nodes.length - 1]
		while(iter != null) {
			path.push(iter.position)
			iter = iter.parent
		}
		return path
	}
}

class RRTNode {
	position: Vector
	parent: RRTNode = null
	line: Line = null
	highlight: boolean = false
}