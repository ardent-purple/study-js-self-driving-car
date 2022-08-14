import { lerp } from './utils.js'

export default class Road {
  constructor(x, w, laneCount = 3) {
    this.x = x
    this.w = w
    this.laneCount = laneCount

    this.left = x - w / 2
    this.right = x + w / 2

    this.height = 9999999
    this.top = -this.height
    this.bottom = this.height

    const topLeft = { x: this.left, y: this.top }
    const topRight = { x: this.right, y: this.top }
    const bottomLeft = { x: this.left, y: this.bottom }
    const bottomRight = { x: this.right, y: this.bottom }

    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ]
  }

  getLaneCenter(laneIndex) {
    const laneWidth = this.w / this.laneCount
    return (
      this.left +
      laneWidth * Math.min(laneIndex, this.laneCount - 1) +
      laneWidth / 2
    )
  }

  draw(ctx) {
    ctx.lineWidth = 5
    ctx.strokeStyle = 'white'

    for (let i = 1; i < this.laneCount; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount)

      ctx.setLineDash([20, 20])

      ctx.beginPath()
      ctx.moveTo(x, this.top)
      ctx.lineTo(x, this.bottom)
      ctx.stroke()
    }

    ctx.setLineDash([])
    for (const [{ x: x1, y: y1 }, { x: x2, y: y2 }] of this.borders) {
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
  }
}
