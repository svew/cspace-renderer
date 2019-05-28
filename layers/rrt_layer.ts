
class RRT2DLayer extends Layer {
	private checkGoalFreq: number
	private space: FreeSpace
	private nodes: RRTNode[]

	constructor(space: FreeSpace, start: Vector2, end: Vector2) {
		super()
		this.nodes = []
		this.space = space
		this.checkGoalFreq = 100

		let init = new RRTNode()
		init.position = start
		this.nodes.push(init)
	}
	step(): void {

	}
	finished(): boolean {
		throw new Error("Method not implemented.");
	}
	draw(context: CanvasRenderingContext2D): void {
		
	}
}

class RRTNode {
	position: Vector
	parent: RRTNode = null
	highlight: boolean = false
}