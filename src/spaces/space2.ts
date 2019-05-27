
abstract class Space2 {
	public static readonly GRID_WIDTH = 15

	protected canvas: HTMLCanvasElement
	protected context: CanvasRenderingContext2D
	protected width: number
	protected height: number

	protected objects: Polygon[]
	protected robots: Robot[]

	Space2(width: number, height: number, grid: boolean = true) {
		this.width = width
		this.height = height
		
		this.setupContext()
		if(grid) {
			this.setupGrid()
		}
	}

	private setupContext() {
		this.canvas = document.createElement('canvas')
		this.canvas.width = this.width
		this.canvas.height = this.height
		
		this.context = this.canvas.getContext('2d')
		this.setupGrid()
		this.context.lineWidth = 2
		this.context.lineCap = 'round'
		this.context.lineJoin = 'round'
	}
	
	private setupGrid() {
		this.context.lineWidth = 1
		this.context.strokeStyle = 'rgb(190, 190, 190)'

		//Draw grid lines
		for(let i = 0; i <= this.width; i += Space2.GRID_WIDTH) {
			this.context.beginPath()
			this.context.moveTo(i, 0)
			this.context.lineTo(i, this.height)
			this.context.closePath()
			this.context.stroke()
		}
		for(let i = 0; i <= this.height; i += Space2.GRID_WIDTH) {
			this.context.beginPath()
			this.context.moveTo(0, i)
			this.context.lineTo(this.width, i)
			this.context.closePath()
			this.context.stroke()
		}
	}

	public addObstacle(o: Polygon): void {

	}


}