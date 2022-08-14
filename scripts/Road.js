import { lerp } from './utils.js'

export default class Road {
  constructor(x, w, laneCount = 3) {
    this.x = x
    this.w = w
    this.laneCount = laneCount

    this.left = x - w / 2
    this.right = x + w / 2

    this.height = 10000000
    this.top = -9999999
    this.bottom = 9999999
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

    for (let i = 0; i <= this.laneCount; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount)

      if (i > 0 && i < this.laneCount) {
        ctx.setLineDash([20, 20])
      } else {
        ctx.setLineDash([])
      }

      ctx.beginPath()
      ctx.moveTo(x, this.top)
      ctx.lineTo(x, this.bottom)
      ctx.stroke()
    }
  }
}
