import Car from './Car.js'
import Road from './Road.js'

const canvas = document.getElementById('canvas')
canvas.width = 200

const ctx = canvas.getContext('2d')
const road = new Road(canvas.width / 2, canvas.width * 0.85)
const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'AI')
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2)]

const animate = () => {
  for (const trafficCar of traffic) {
    trafficCar.update(road.borders, [])
  }
  car.update(road.borders, traffic)

  canvas.height = window.innerHeight

  // hold the car in one position
  ctx.save()
  ctx.translate(0, -car.y + canvas.height * 0.8)

  road.draw(ctx)
  for (const trafficCar of traffic) {
    trafficCar.draw(ctx, 'gray')
  }
  car.draw(ctx, 'blue')

  ctx.restore()

  requestAnimationFrame(animate)
}

animate()
