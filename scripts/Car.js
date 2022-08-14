import Controls from './Controls.js'

export default class Car {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h

    this.speed = 0
    this.acceleration = 0.2
    this.maxForwardSpeed = 3
    this.maxBackwardSpeed = 1
    this.friction = 0.05
    this.angle = 0

    this.controls = new Controls()
  }

  draw(ctx) {
    ctx.save()

    ctx.translate(this.x, this.y)
    ctx.rotate(-this.angle)

    ctx.beginPath()
    ctx.fillStyle = '#000'
    ctx.rect(-this.w / 2, -this.h / 2, this.w, this.h)
    ctx.fill()

    ctx.restore()
  }

  update() {
    this.#move()
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
