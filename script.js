import Config from './Config.js';
import Elements from './Elements.js';
import { TrainEditor } from './TrainEditor.js';
import { Net } from './Net.js';
import { TestEditor } from './TestEditor.js';
import { Settings } from './Settings.js';
const trainEditor = new TrainEditor(Config.data.default)
const testEditor = new TestEditor()
const settings = new Settings()
const net = new Net()
window.onload = () => {
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("Serviceworker.js")
  }
  trainEditor.render(trainEditor.data)
  // Train Click
  Elements.button.net.train.addEventListener("click", function () {
    const trainingData = net.prepareData(trainEditor.data, settings.data).map(net.flattenInputs)
    net.train(trainingData)
    return
  })
  // Test Click
  Elements.button.net.test.addEventListener("click", function () {
    const output = net.net.run(testEditor.form.input.flat(Infinity))
    document.getElementById("output-0").setAttribute("value", Math.round(output[0]))
    document.getElementById("output-1").setAttribute("value", Math.round(output[1]))
  })
  // Settings Click
  Elements.button.settings.icon.addEventListener("click", function(){
    settings.render(trainEditor, trainEditor.data)
    Elements.button.settings.icon.classList.add("hidden")
    Elements.button.net.train.classList.add("hidden")
    Elements.button.settings.save.classList.remove("hidden")
  })
  // Save Settings Click
  Elements.button.settings.save.addEventListener("click", function(){
    settings.backButtonClick(trainEditor, trainEditor.data)
  })

  function ensureBrainLoaded() {
    return new Promise(resolve => {
      if (typeof brain !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'brain.js';
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }

  // Listen to net.worker for messages
  net.worker.addEventListener('message', async function (e) {
    if (e.data instanceof Object) {
      switch (e.data.cmd) {
        case "net-refreshed":
          await ensureBrainLoaded();
          const shouldSimulate = Boolean(settings.data.simulate.value) === Config.net.types.simulate
          if (Config.debug) console.log("received net ", e.data);
          const testData = net.prepareData(trainEditor.data, settings.data).map(net.flattenInputs)
          const newNet = new brain.NeuralNetwork().fromJSON(e.data.net)
          const { accuracy } = net.validate(newNet, shouldSimulate ? trainEditor.data.map(net.flattenInputs) : testData)
          if (accuracy >= (settings.data.accuracyTestMark.value || Config.accuracyTestMark)) {
            // Assign net
            net.net = newNet
            // Toggle Screen Action Button
            Elements.button.net.test.classList.remove("hidden")
            Elements.button.net.train.classList.add("hidden")
            Elements.button.settings.icon.classList.add("hidden")
            // Render & Show Test Screen
            testEditor.render()
          } else {
            const trainingData = net.prepareData(trainEditor.data, settings.data).map(net.flattenInputs)
            net.train(trainingData)
          }
          break;
        default:
          self.postMessage('Unknown command');
      }
    }
  })
}
