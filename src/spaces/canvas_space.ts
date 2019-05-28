
abstract class CanvasSpace {

	protected canvas: HTMLCanvasElement
	protected context: CanvasRenderingContext2D
	protected canvasWidth: number
	protected canvasHeight: number
	protected canvasGridLines: boolean
	protected canvasGridWidth: number

	constructor(width: number, height: number, gridLines: boolean = true, gridWidth: number = 15) {
		this.canvasWidth = width
		this.canvasHeight = height
		this.canvasGridLines = gridLines
		this.canvasGridWidth = gridWidth
		
		this.setupContext()
		if(this.canvasGridLines) {
			this.setupGrid()
		}
	}

	private setupContext() {
		// Sets up a canvas for grid objects to be drawn on

		this.canvas = document.createElement('canvas')
		this.canvas.width = this.canvasWidth
		this.canvas.height = this.canvasHeight
		
		this.context = this.canvas.getContext('2d')
		this.setupGrid()
		this.context.lineWidth = 2
		this.context.lineCap = 'round'
		this.context.lineJoin = 'round'
	}
	
	private setupGrid() {
		// Draws a grid on the space's canvas
		
		this.context.lineWidth = 1
		this.context.strokeStyle = 'rgb(190, 190, 190)'

		//Draw grid lines
		for(let i = 0; i <= this.canvasWidth; i += this.canvasGridWidth) {
			this.context.beginPath()
			this.context.moveTo(i, 0)
			this.context.lineTo(i, this.canvasHeight)
			this.context.closePath()
			this.context.stroke()
		}
		for(let i = 0; i <= this.canvasHeight; i += this.canvasGridWidth) {
			this.context.beginPath()
			this.context.moveTo(0, i)
			this.context.lineTo(this.canvasWidth, i)
			this.context.closePath()
			this.context.stroke()
		}
	}

	draw(context: CanvasRenderingContext2D) {
		context.drawImage(this.canvas, 0, 0)
	}
}