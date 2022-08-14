import Car from './Car.js'
import Road from './Road.js'

const canvas = document.getElementById('canvas')
canvas.width = 200

const ctx = canvas.getContext('2d')
const road = new Road(canvas.width / 2, canvas.width * 0.95)
const car = new Car(road.getLaneCenter(1), 100, 30, 50)

const animate = () => {
  canvas.height = window.innerHeight
  car.update()

  road.draw(ctx)
  car.draw(ctx)
  requestAnimationFrame(animate)
}

animate()
