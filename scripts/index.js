import Car from './Car.js'
import NeuralNetwork from './Network.js'
import Road from './Road.js'
import Visualizer from './Visualizer.js'

const carCanvas = document.getElementById('carCanvas')
const networkCanvas = document.getElementById('networkCanvas')
carCanvas.width = 200
networkCanvas.width = 500

const carCtx = carCanvas.getContext('2d')
const networkCtx = networkCanvas.getContext('2d')

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.85)

const N = 800
const LOCAL_STORAGE_KEY = 'self-driving-car:bestBrain'

const cars = generateCars(N)
let bestCar = cars[0]
const toLoad = localStorage.getItem(LOCAL_STORAGE_KEY)
if (toLoad) {
  bestCar.brain = JSON.parse(toLoad)
  for (let i = 1; i < cars.length; i++) {
    cars[i].brain = JSON.parse(toLoad)
    NeuralNetwork.mutate(cars[i].brain, 0.15)
  }
}
function generateCars(n) {
  const cars = []
  for (let i = 0; i < n; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'))
  }
  return cars
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bestCar.brain))
}
function discard() {
  localStorage.removeItem(LOCAL_STORAGE_KEY)
}
window.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    console.log('best brain is saved')
    save()
    return
  }
  if (e.code === 'Backspace') {
    console.log('best brain was discarded')
    discard()
  }
})

const TRAFFIC_ROWS = 50
const traffic = [
  // new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2),
  // new Car(road.getLaneCenter(0), -300, 30, 50, 'DUMMY', 2),
  // new Car(road.getLaneCenter(2), -300, 30, 50, 'DUMMY', 2),
  // new Car(road.getLaneCenter(0), -500, 30, 50, 'DUMMY', 2),
  // new Car(road.getLaneCenter(1), -500, 30, 50, 'DUMMY', 2),
  // new Car(road.getLaneCenter(1), -700, 30, 50, 'DUMMY', 2),
  // new Car(road.getLaneCenter(2), -700, 30, 50, 'DUMMY', 2),
  // new Car(road.getLaneCenter(0), -900, 30, 50, 'DUMMY', 2),
  // new Car(road.getLaneCenter(2), -900, 30, 50, 'DUMMY', 2),
]
for (let i = 0; i < TRAFFIC_ROWS; i++) {
  const lanesToFill = Array(road.laneCount)
    .fill(0)
    .map((_, i) => i)
  const laneToRemove = Math.floor(Math.random() * lanesToFill.length)

  for (let j = 0; j < lanesToFill.length; j++) {
    if (j === laneToRemove) {
      continue
    }
    traffic.push(
      new Car(road.getLaneCenter(j), -100 + i * -200, 30, 50, 'DUMMY', 2)
    )
  }
}

const centerLaneX = road.getLaneCenter(Math.floor(road.laneCount / 2))

const animate = (timestamp) => {
  carCanvas.height = window.innerHeight
  networkCanvas.height = window.innerHeight

  for (const trafficCar of traffic) {
    trafficCar.update(road.borders, [])
  }

  for (const car of cars) {
    car.update(road.borders, traffic)
  }
  const minCarsY = Math.min(...cars.map((car) => car.y))

  const minCarsXToCenter = Math.min(
    ...cars.map((car) => Math.abs(centerLaneX - car.x))
  )
  bestCar = cars.find((car) => car.y === minCarsY)

  // hold the car in one position
  carCtx.save()
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.8)

  road.draw(carCtx)
  for (const trafficCar of traffic) {
    trafficCar.draw(carCtx, 'red')
  }

  carCtx.globalAlpha = 0.2
  for (const car of cars) {
    car.draw(carCtx, 'blue')
  }
  carCtx.globalAlpha = 1
  bestCar.draw(carCtx, 'blue', true)

  carCtx.restore()

  networkCtx.lineDashOffset = -timestamp / 60
  Visualizer.draw(networkCtx, bestCar.brain)

  requestAnimationFrame(animate)
}

animate()
