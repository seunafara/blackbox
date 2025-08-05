import Config from './Config.js'
import { shuffle } from './Helpers.js'
class Net {
  constructor() {
    this.worker = new Worker('Networker.js')
    this.inputSet = null
    this.outputSet = null
    this.inputSize = 0
    this.outputSize = 0
    this.config = {
      binaryThresh: 0.5,
      hiddenLayers: [3],
      activation: 'sigmoid',
      simulate: {
        inputSize: 0,
        outputSize: 0
      },
      worker: {
        cmd: "ai"
      }
    }
  }
  flattenInputs(x) {
    return ({ input: x.input.flat(Infinity), output: x.output })
  }
  mapSet(data) {
    const inputsTo1D = data.map(x => x.input.flat()).flat().map(x => x.toString().replace(",", "-"))
    const outputsTo1D = data.map(x => x.output.toString().replace(",", "-"))
    const comboSet = new Set([...inputsTo1D, ...outputsTo1D])
    this.inputSet = [...new Set([...inputsTo1D])]
    this.outputSet = [...new Set([...outputsTo1D])]
    return [...comboSet]
  }
  prepareData(editorUIdata, settingsConfig) {
    const shouldSimulate = Boolean(settingsConfig.simulate.value) === Config.net.types.simulate
    let data
    switch (shouldSimulate) {
      case true:
        this.mapSet(editorUIdata)
        this.setIOsizes(editorUIdata[0].input.flat().length, editorUIdata[0].output.length)
        data = this.simulate(editorUIdata, settingsConfig)
        break
      default:
        data = editorUIdata.map(this.flattenInputs)
        break
    }
    return data
  }
  setIOsizes(inputSize, outputSize) {
    this.config.simulate.inputSize = inputSize
    this.config.simulate.outputSize = outputSize
  }
  simulate(editorUIdata, settingsConfig) {
    if (Boolean(settingsConfig.simulate.value) !== Config.net.types.simulate) {
      const errorMessage = "Error: Incorrect Train Type \nFix: Change train type to simulate"
      alert(errorMessage)
      throw new Error(errorMessage)
    }
    if (this.inputSet === null || this.outputSet === null) {
      const errorMessage = `Error: Missing ${this.inputSet ? "Input Set" : "Output Set"} \nFix: Run Net.mapSet()`
      alert(errorMessage)
      throw new Error(errorMessage)
    }
    const inputSize = this.config.simulate.inputSize
    const outputSize = this.config.simulate.outputSize
    if (!inputSize || !outputSize) {
      const errorMessage = `Error: Missing ${this.inputSize ? "Input Size" : "Output Size"} \nFix: Run Net.setIOsizes()`
      alert(errorMessage)
      throw new Error(errorMessage)
    }
    let size = settingsConfig.simulateSize.value || Config.net.simulate.size
    const data = []
    this.mapSet(editorUIdata)
    const shuffleSet = (set) => String(shuffle(set)[0]).split("-").map(x => Number(x))
    while (size) {
      const input = Array.from({ length: 2 }, () => Array.from({ length: inputSize / 2 }, () => shuffleSet(this.inputSet)))
      const output = shuffleSet(this.outputSet)
      data.push({
        input, output
      })
      size--
    }
    return data
  }
  train(trainingData) {
    if (Config.debug) console.log("trainingData ", trainingData);
    this.worker.postMessage({
      cmd: this.config.worker.cmd,
      config: this.config,
      trainConfig: Config.net.train.config,
      trainingData,
    })
  }
  validate(net, data) {
    const total = { value: 0 }
    for (let dataIdx = 0; dataIdx < data.length; dataIdx++) {
      const element = data[dataIdx];
      const output = net.run(element.input).map(x => Math.round(x))
      if (output.toString() === element.output.toString()) { // 
        if (Config.debug) {
          console.log("Net output ", output);
          console.log("Actual Output ", element.output);
        }
        total.value++
      }
    }
    const accuracy = Math.floor((total.value / data.length) * 100)
    console.log("Accuracy (%): ", accuracy);
    return {
      accuracy
    }
  }
}
export { Net }
