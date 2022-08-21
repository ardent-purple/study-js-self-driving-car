import { getNormalizedRandom, lerp } from './utils.js'

export default class NeuralNetwork {
  constructor(neuronCount) {
    this.levels = []
    for (let i = 0; i < neuronCount.length - 1; i++) {
      this.levels.push(new Level(neuronCount[i], neuronCount[i + 1]))
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0])
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i])
    }

    return outputs
  }

  static mutate(network, amount = 1) {
    for (const level of network.levels) {
      // biases
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], getNormalizedRandom(), amount)
      }

      // weights
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            getNormalizedRandom(),
            amount
          )
        }
      }
    }
  }
}

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = Array(inputCount)
    this.outputs = Array(outputCount)
    this.biases = Array(outputCount)

    this.weights = []
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = Array(outputCount)
    }

    Level.#randomize(this)
  }

  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = getNormalizedRandom()
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = getNormalizedRandom()
    }
  }

  static feedForward(givenInputs, level) {
    // store the inputs
    for (let i = 0; i < givenInputs.length; i++) {
      level.inputs[i] = givenInputs[i]
    }

    // calculate the result for each output
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0
      // take all inputs and apply weights that lead to this output
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i]
      }
      if (sum > level.biases[i]) {
        level.outputs[i] = 1
      } else {
        level.outputs[i] = 0
      }
    }

    return level.outputs
  }
}
