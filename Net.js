import Config from './Config.js'
import Elements from './Elements.js'
import { shuffle } from './Helpers.js'
class Net {
  constructor(data, settings) {
    this.data = data
    this.workerName = Config.net.worker.name
    this.worker = new Worker(Config.net.worker.name)
    this.inputSet = null
    this.outputSet = null
    this.inputSize = 0
    this.outputSize = 0
    this.config = {
      binaryThresh: 0.5,
      simulate: {
        inputSize: 0,
        outputSize: 0
      },
      worker: {
        cmd: "ai"
      }
    },
    this.settings = settings
    this.trained = null
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
  prepareData() {
    this.validateSettings()
    const settingsConfig = this.settings.data
    const editorUIdata = this.data
    const shouldSimulate = Boolean(settingsConfig.simulate.value) === Config.net.types.simulate
    let data
    switch (shouldSimulate) {
      case true:
        this.mapSet(editorUIdata)
        this.setIOsizes(editorUIdata[0].input.flat().length, editorUIdata[0].output.length)
        data = this.simulate().map(this.flattenInputs)
        break
      default:
        data = editorUIdata.map(this.flattenInputs)
        break
    }
    return data
  }
  async runWorker(e, testEditor) {
    this.validateSettings()
    const editorUIdata = this.data
    const settingsData = this.settings.data
    const settingsHL = settingsData?.hiddenLayers?.value
    const hiddenLayers = settingsHL ? String(settingsHL).split(",").map(x => Number(x)) : Config.net.hiddenLayers
    if (e.data instanceof Object) {
      switch (e.data.cmd) {
        case "net-refreshed":
          if (Config.debug) console.log("received net ", e.data);
          const testData = this.prepareData(editorUIdata, settingsData).map(this.flattenInputs)
          const newNet = new brain.NeuralNetwork(hiddenLayers).fromJSON(e.data.net)
          const shouldSimulate = Boolean(settingsData.simulate.value) === Config.net.types.simulate
          const { accuracy } = this.validate(newNet, shouldSimulate ? editorUIdata.map(this.flattenInputs) : testData)
          const accuracyToMatch = (settingsData.accuracyTestMark.value || Config.accuracyTestMark)
          if (accuracy >= accuracyToMatch) {
            // Assign net
            this.trained = newNet
            // Toggle Screen Action Button
            Elements.controlPanel.training.text.classList.add("hidden")
            Elements.button.train.stop.classList.add("hidden")
            Elements.button.net.test.classList.remove("hidden")
            Elements.button.net.train.classList.add("hidden")
            Elements.button.settings.icon.classList.add("hidden")
            // Render & Show Test Screen
            testEditor.render()
          } else {
            this.worker.terminate()
            this.worker = new Worker(this.workerName)
            this.worker.addEventListener('message', async (e) => await this.runWorker(e, testEditor))
            const trainingData = this.prepareData(editorUIdata, settingsData).map(this.flattenInputs)
            this.train(trainingData, settingsData)
          }
          break;
        default:
          self.postMessage('Unknown command');
      }
    }
  }
  setIOsizes(inputSize, outputSize) {
    this.config.simulate.inputSize = inputSize
    this.config.simulate.outputSize = outputSize
  }
  simulate() {
    this.validateSettings()
    const settingsData = this.settings.data
    if (Boolean(settingsData.simulate.value) !== Config.net.types.simulate) {
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
    let size = settingsData.simulateSize.value || Config.net.simulate.size
    const data = []
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
    this.validateSettings()
    const settingsData = this.settings.data
    const settingsHL = settingsData?.hiddenLayers?.value
    const hiddenLayers = settingsHL ? String(settingsHL).split(",").map(x => Number(x)) : Config.net.hiddenLayers
    if (Config.debug) {
      console.log("settingsConfig ", settingsData);
      console.log("trainingData ", trainingData);
    }
    this.worker.postMessage({
      cmd: this.config.worker.cmd,
      config: {
        net: {
          config: {
            binaryThresh: this.config.binaryThresh,
            hiddenLayers  
          },
          train: {
            ...Config.net.train.config
          }
        },
        settings: settingsData
      },
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
  validateSettings(){
    if (!this.settings) {
      const errorMessage = "Error: No Net Settings Found"
      alert(errorMessage)
      throw new Error(errorMessage)
    }
  }
}
export { Net }
