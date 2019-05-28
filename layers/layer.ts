
// Layers are collections of geometry which are created using some algorithm on
// a space. Some layers must be created using a space, others may need to use
// other layers.
abstract class Layer {
	protected finished: boolean = false

	run() {
		while(!this.finished) {
			this.step()
		}
	}
	isFinished(): boolean {
		return this.finished
	}
	abstract step(): void
	abstract draw(context: CanvasRenderingContext2D): void
}