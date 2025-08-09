import Config from './Config.js';
import Elements from './Elements.js';
import { Editor } from './Editor.js';
window.onload = () => {
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("Serviceworker.js")
  }
  const editor = new Editor(structuredClone(Config.data.default))
  new Promise((resolve) => {
    // Render Editor
    editor.editors.train.render()
    resolve("done")
  }).then(() => {
    // Train Click
    Elements.button.net.train.addEventListener("click", () => editor.train())
    // Test Click
    Elements.button.net.test.addEventListener("click", () => editor.test())
    // Settings Click
    Elements.button.settings.icon.addEventListener("click", () => editor.showSettings())
    // Save Settings Click
    Elements.button.settings.save.addEventListener("click", () => editor.saveSettings())
    // Stop Training Click
    Elements.button.train.stop.addEventListener("click", () => editor.stopTraining())
    // Listen to net.worker for messages
    editor.net.worker.addEventListener('message', (e) => editor.net.runWorker(e, editor.editors.test))
  })
}
