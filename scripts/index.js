import Car from './Car.js'
import Road from './Road.js'
import Visualizer from './Visualizer.js'

const carCanvas = document.getElementById('carCanvas')
const networkCanvas = document.getElementById('networkCanvas')
carCanvas.width = 200
networkCanvas.width = 500

const carCtx = carCanvas.getContext('2d')
const networkCtx = networkCanvas.getContext('2d')

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.85)
const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'AI')
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2)]

const animate = (timestamp) => {
  for (const trafficCar of traffic) {
    trafficCar.update(road.borders, [])
  }
  car.update(road.borders, traffic)

  carCanvas.height = window.innerHeight
  networkCanvas.height = window.innerHeight

  // hold the car in one position
  carCtx.save()
  carCtx.translate(0, -car.y + carCanvas.height * 0.8)

  road.draw(carCtx)
  for (const trafficCar of traffic) {
    trafficCar.draw(carCtx, 'gray')
  }
  car.draw(carCtx, 'blue')

  carCtx.restore()

  networkCtx.lineDashOffset = -timestamp / 60
  Visualizer.draw(networkCtx, car.brain)

  requestAnimationFrame(animate)
}

animate()
