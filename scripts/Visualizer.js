import { lerp } from './utils.js'

const MARGIN = 40
const NODE_RADIUS = 20
const NODE_INNER_RADIUS_COEFF = 0.7

export default class Visualizer {
  static draw(ctx, network) {
    const top = MARGIN
    const left = MARGIN
    const width = ctx.canvas.width - MARGIN * 2
    const height = ctx.canvas.height - MARGIN * 2
    const right = left + width
    const bottom = top + height
    const levelCount = network.levels.length

    ctx.setLineDash([5, 4])
    for (let i = levelCount - 1; i >= 0; i--) {
      const levelTop = lerp(top, bottom, (levelCount - i - 1) / levelCount)
      const levelBottom = lerp(top, bottom, (levelCount - i) / levelCount)
      Visualizer.drawLevel(
        ctx,
        levelTop,
        left,
        levelBottom,
        right,
        network.levels[i],
        i === levelCount - 1 ? ['▲', '◀', '▶', '▼'] : []
      )
    }

    ctx.setLineDash([])
  }

  static drawLevel(ctx, top, left, bottom, right, level, outputLabels) {
    const { inputs, outputs, weights, biases } = level

    // weights
    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights[i].length; j++) {
        const xBottom = getNodeX(left, right, i, inputs)
        const xTop = getNodeX(left, right, j, outputs)

        ctx.beginPath()
        ctx.strokeStyle = getRGBA(weights[i][j])
        ctx.moveTo(xBottom, bottom)
        ctx.lineTo(xTop, top)
        ctx.stroke()
      }
    }

    // inputs
    for (let i = 0; i < inputs.length; i++) {
      const x = getNodeX(left, right, i, inputs)

      ctx.beginPath()
      ctx.fillStyle = getRGBA(inputs[i])
      ctx.arc(x, bottom, NODE_RADIUS, 0, 2 * Math.PI)
      ctx.fill()
    }

    // outputs
    for (let i = 0; i < outputs.length; i++) {
      const x = getNodeX(left, right, i, outputs)

      ctx.beginPath()
      ctx.arc(x, top, NODE_RADIUS, 0, 2 * Math.PI)
      ctx.fillStyle = 'black'
      ctx.fill()

      ctx.fillStyle = ctx.strokeStyle = getRGBA(outputs[i])
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x, top, NODE_RADIUS * NODE_INNER_RADIUS_COEFF, 0, 2 * Math.PI)
      ctx.fill()

      // symbols
      if (!outputLabels[i]) {
        continue
      }
      ctx.beginPath()
      ctx.setLineDash([])

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.strokeStyle = 'tomato'
      ctx.fillStyle = 'tomato'
      ctx.font = `${NODE_RADIUS * 0.9}px Arial`
      ctx.fillText(outputLabels[i], x, top)
      ctx.lineWidth = 2
      ctx.strokeText(outputLabels[i], x, top)
      ctx.setLineDash([5, 4])
    }
  }
}

function getRGBA(value) {
  const R = value > 0 ? 255 : 0
  const G = R
  const B = value < 0 ? 255 : 0
  const A = Math.abs(value)
  return `rgba(${R},${G},${B},${A})`
}

function getNodeX(left, right, i, array) {
  return lerp(left, right, array.length === 1 ? 0.5 : i / (array.length - 1))
}
