// import Config from './Config.js'
import Elements from './Elements.js'
class Settings {
  constructor() {
    this.data = {
      accuracyTestMark: {
        name: "Accuracy Test Mark",
        classes: [],
        value: 51,
        element: {
          type: "input",
          mode: "number",
          classes: ["form-input"],
        }
      },
      inputMaxValue: {
        name: "Max Value (Input)",
        classes: [],
        value: 10,
        element: {
          type: "input",
          mode: "number",
          classes: ["form-input"],
        }
      },
      simulate: {
        name: "Simulate",
        classess: [],
        value: false,
        element: {
          type: "input",
          mode: "checkbox",
          classes: [],
        }
      },
      simulateSize: {
        name: "Simulation Size",
        classes: [],
        value: 10,
        element: {
          type: "input",
          mode: "number",
          classes: ["form-input"],
        }
      }
    }
  }
  backButtonClick(trainEditor, trainEditorData){
    // Show Train Screen
    new Promise((resolve, _) => {
      document.getElementById("settings-editor").remove()
      document.getElementById("train-editor").remove()
      // Toggle Screen Action Button
      Elements.button.net.test.classList.add("hidden")
      Elements.button.net.train.classList.remove("hidden")
      Elements.button.settings.save.classList.add("hidden")
      Elements.button.settings.icon.classList.remove("hidden")
      resolve("Done")
    }).then(() => {
      trainEditor.render(trainEditorData, this.data)
    })
  }
  render(trainEditor, trainEditorData) {
    const parent = this
    document.getElementById("train-editor").classList.add("hidden")
    // Settings Section
    const settingsEditor = document.createElement("section")
    settingsEditor.setAttribute("id", "settings-editor")
    // Back Button
    const backButton = document.createElement("button")
    backButton.setAttribute("id", "back-button")
    backButton.classList.add("back-button")
    backButton.innerHTML = "&larr;"
    backButton.addEventListener("click", function () {
      parent.backButtonClick(trainEditor, trainEditorData)
    })
    settingsEditor.append(backButton)
    // Create Data Box
    const dataBoxElement = document.createElement("div")
    dataBoxElement.classList.add("data-box")
    dataBoxElement.classList.add("settings-data-box")
    // For
    const settingItem = Object.entries(this.data)
    for (let idx = 0; idx < settingItem.length; idx++) {
      const [key, setting] = settingItem[idx];
      // Add Input wrapper
      const dataWrapperElement = document.createElement("div")
      dataWrapperElement.classList.add("data-wrapper")
      dataWrapperElement.classList.add("settings-wrapper")
      const maxInputLabel = document.createElement("label")
      maxInputLabel.innerText = setting.name
      // Switch
      const maxInputElement = document.createElement(setting.element.type)
      setting.element.classes.forEach(x => maxInputElement.classList.add(x))
      if (setting.element.mode === "checkbox") {
        setting.value ? maxInputElement.setAttribute("checked", setting.value) : maxInputElement.removeAttribute("checked")
      } else {
        maxInputElement.setAttribute("value", setting.value)
      }
      maxInputElement.setAttribute("type", setting.element.mode)
      maxInputElement.addEventListener("change", function(e){
        if(setting.element.mode === "checkbox"){
          parent.data[key].value = e.target.checked
        } else {
          parent.data[key].value = e.target.value
        }
      })
      // End Switch
      // Append KV Setting to Data input wrapper
      dataWrapperElement.append(maxInputLabel)
      dataWrapperElement.append(maxInputElement)
      // Append data wrapper to data-box
      dataBoxElement.append(dataWrapperElement) 
    }
    // End For
    settingsEditor.append(dataBoxElement)
    Elements.container.append(settingsEditor)
  }
}
export {
  Settings
}
