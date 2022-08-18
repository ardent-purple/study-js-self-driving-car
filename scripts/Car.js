import Controls from './Controls.js'
import Sensor from './Sensor.js'
import { polysIntersect } from './utils.js'

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

    if (controlType !== 'DUMMY') {
      this.sensor = new Sensor(this)
    }
    this.controls = new Controls(controlType)
  }

  draw(ctx, color) {
    if (this.damaged) {
      ctx.fillStyle = 'red'
    } else {
      ctx.fillStyle = color
    }

    ctx.beginPath()
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
    for (let i = 0; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
    }
    ctx.fill()

    this.sensor?.draw(ctx)
  }

  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move()
      this.polygon = this.#createPolygon()
      this.damaged = this.#assessDamage(roadBorders, traffic)
    }
    this.sensor?.update(roadBorders, traffic)
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
