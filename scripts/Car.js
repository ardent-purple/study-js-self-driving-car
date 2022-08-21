import Controls from './Controls.js'
import Sensor from './Sensor.js'
import NeuralNetwork from './Network.js'
import { polysIntersect } from './utils.js'

const HIDDEN_LAYER_COUNT = 6
const CONTROLS_LAYER_COUNT = 4

export default class Car {
  constructor(x, y, w, h, controlType, maxSpeed = 3) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h

    this.speed = 0
    this.acceleration = 0.2
    this.maxForwardSpeed = maxSpeed
    this.maxBackwardSpeed = 1
    this.friction = 0.05
    this.angle = 0
    this.damaged = false

    this.useBrain = controlType === 'AI'

    if (controlType !== 'DUMMY') {
      this.sensor = new Sensor(this)
      this.brain = new NeuralNetwork([
        this.sensor.rayCount,
        HIDDEN_LAYER_COUNT,
        CONTROLS_LAYER_COUNT,
      ])
    }
    this.controls = new Controls(controlType)
  }

  draw(ctx, color, drawSensors) {
    if (this.damaged) {
      return
    } else {
      ctx.fillStyle = color
    }

    ctx.beginPath()
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
    for (let i = 0; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
    }
    ctx.fill()

    if (drawSensors) {
      this.sensor?.draw(ctx)
    }
  }

  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move()
      this.polygon = this.#createPolygon()
      this.damaged = this.#assessDamage(roadBorders, traffic)
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic)
      const offsets = this.sensor.readings.map((touch) =>
        touch === null ? 0 : 1 - touch.offset
      )

      const outputs = NeuralNetwork.feedForward(offsets, this.brain)

      if (this.useBrain) {
        this.controls.forward = outputs[0]
        this.controls.left = outputs[1]
        this.controls.right = outputs[2]
        this.controls.backward = outputs[3]
      }
    }
  }

  #createPolygon() {
    const points = []
    const radius = Math.hypot(this.w, this.h) / 2
    const alpha = Math.atan2(this.w, this.h)
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * radius,
      y: this.y - Math.cos(this.angle - alpha) * radius,
    })
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * radius,
      y: this.y - Math.cos(this.angle + alpha) * radius,
    })
    points.push({
      x: this.x - Math.sin(this.angle + Math.PI - alpha) * radius,
      y: this.y - Math.cos(this.angle + Math.PI - alpha) * radius,
    })
    points.push({
      x: this.x - Math.sin(this.angle + Math.PI + alpha) * radius,
      y: this.y - Math.cos(this.angle + Math.PI + alpha) * radius,
    })
    return points
  }

  #assessDamage(roadBorders, traffic) {
    for (const border of roadBorders) {
      if (polysIntersect(this.polygon, border)) {
        return true
      }
    }
    for (const trafficCar of traffic) {
      if (polysIntersect(this.polygon, trafficCar.polygon)) {
        return true
      }
    }
    return false
  }

  #move() {
    // acceleration
    if (this.controls.forward) {
      this.speed += this.acceleration
      this.y
    }
    if (this.controls.backward) {
      this.speed -= this.acceleration
    }

    // speed cap
    if (this.speed > this.maxForwardSpeed) {
      this.speed = this.maxForwardSpeed
    }

    if (this.speed < -this.maxBackwardSpeed) {
      this.speed = -this.maxBackwardSpeed
    }

    // friction
    if (this.speed > 0) {
      this.speed -= this.friction
    }
    if (this.speed < 0) {
      this.speed += this.friction
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0
    }

    // steering
    if (Math.abs(this.speed) > 0) {
      const flipSteering = this.speed > 0 ? 1 : -1
      if (this.controls.left) {
        this.angle += 0.03 * flipSteering
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flipSteering
      }
    }

    this.x -= Math.sin(this.angle) * this.speed
    this.y -= Math.cos(this.angle) * this.speed
  }
}
