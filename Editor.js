import Elements from './Elements.js'
import { Net } from './Net.js'
import { Settings } from './Settings.js'
import { TestEditor } from './TestEditor.js'
import { TrainEditor } from "./TrainEditor.js"
class Editor {
  constructor(data){
    this.data = data
    this.settings = new Settings(),
    this.editors = {
      train: new TrainEditor(data, this.settings),
      test: new TestEditor(),
    },
    this.net = new Net(data, this.settings)
  }
  test(){
    new Promise((resolve) => {
      resolve("done")
    }).then(() => {
      const output = this.net.trained.run(this.editors.test.form.input.flat(Infinity))
      document.getElementById("output-0").setAttribute("value", Math.round(output[0]))
      document.getElementById("output-1").setAttribute("value", Math.round(output[1]))
    })
  }
  train(){
    //Control Panel UI changes
    Elements.button.net.train.classList.add("hidden")
    Elements.button.settings.icon.classList.add("hidden")
    Elements.controlPanel.training.text.classList.remove("hidden")
    Elements.button.train.stop.classList.remove("hidden")
    const trainingData = this.net.prepareData()
    this.net.train(trainingData)
    return
  }
  showSettings(){
    this.settings.render(this.editors.train, this.data)
    Elements.button.settings.icon.classList.add("hidden")
    Elements.button.net.train.classList.add("hidden")
    Elements.button.settings.save.classList.remove("hidden")
  }
  saveSettings(){
    this.settings.backButtonClick(this.editors.train, this.data)
  }
  stopTraining(){
    new Promise((resolve) => {
      // Terminate current worker & create new
      this.net.worker.terminate()
      this.net.worker = new Worker(this.net.workerName)
      this.net.worker.addEventListener('message', (e) => this.net.runWorker(e, this.editors.test))
      resolve("Done")
    }).then(() => {
      // Control Panel UI changes
      Elements.button.net.train.classList.remove("hidden")
      Elements.button.settings.icon.classList.remove("hidden")
      Elements.controlPanel.training.text.classList.add("hidden")
      Elements.button.train.stop.classList.add("hidden")
    })
  }
}
export {
  Editor
}
