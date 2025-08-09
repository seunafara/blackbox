import Config from './Config.js';
import Elements from './Elements.js';
class TrainEditor {
  constructor(data, settings) {
    this.settings = settings
    this.data = data
  }
  render() {
    const settingsConfig = this.settings
    const parent = this
    const root = document.createElement("section")
    root.setAttribute("id", "train-editor")
    const addNewButton = document.createElement("button")
    addNewButton.setAttribute("id", "new-data-button")
    addNewButton.innerText = "+"
    addNewButton.addEventListener("click", (e) => {
      e.preventDefault()
      new Promise((resolve, _) => {
        parent.data.push(structuredClone(Config.net.data.blank))
        document.getElementById("train-editor").remove()
        resolve(parent.data)
      }).then((x) => {
        parent.render(x, settingsConfig)
      })
    })
    root.append(addNewButton)
    const trainEditorElement = root
    const lastChild = trainEditorElement.lastElementChild
    for (let dataBoxIdx = 0; dataBoxIdx < this.data.length; dataBoxIdx++) {
      const dataBox = this.data[dataBoxIdx];
      // Create Data Box
      const newDataBoxElement = document.createElement("div")
      newDataBoxElement.classList.add("data-box")
      // Add Context Menu
      const contextMenu = document.createElement("div")
      contextMenu.classList.add("context-menu")
      const contextMenuIcon = document.createElement("div")
      contextMenuIcon.innerHTML = "&#8942;"
      contextMenuIcon.classList.add("context-menu-icon")
      const contextMenuItems = document.createElement("ul")
      // Loop context menu items
      const contextMenuDeleteItem = document.createElement("li")
      contextMenuDeleteItem.innerText = "Delete"
      contextMenuDeleteItem.addEventListener("click", function() {
        new Promise((resolve, _) => {
          const dataClone = structuredClone(parent.data)
          dataClone.splice(dataBoxIdx, 1)
          document.getElementById("train-editor").remove()
          parent.data.splice(0)
          parent.data.push(...dataClone)
          resolve(dataClone)
        }).then((x) => {
          parent.render(x, settingsConfig)
        })
      })
      contextMenuItems.append(contextMenuDeleteItem)
      // END Loop context menu items
      // Context Menu on Click - show items
      contextMenu.addEventListener("click", function() {
        const ul = contextMenu.querySelector("ul")
        if (ul.style.display === "" || ul.style.display === "none"){
          ul.style.display = "flex"
        } else {
          ul.style.display = "none"
        }
      })
      contextMenu.append(contextMenuIcon)
      contextMenu.append(contextMenuItems)
      newDataBoxElement.append(contextMenu)
      // Add Input wrapper
      const dataWrapperElement = document.createElement("div")
      dataWrapperElement.classList.add("data-wrapper")
      // A
      const teamAData = document.createElement("div")
      teamAData.classList.add("data")
      teamAData.classList.add("data-a")
      // B
      const teamBData = document.createElement("div")
      teamBData.classList.add("data")
      teamBData.classList.add("data-b")
      for (let dataInputIndex = 0; dataInputIndex < dataBox.input.length; dataInputIndex++) {
        const inputDataArr = dataBox.input[dataInputIndex];
        for (let dataIdx = 0; dataIdx < inputDataArr.length; dataIdx++) {
          const dataRecordWrapper = document.createElement("div")
          dataRecordWrapper.classList.add("data-inputs")
          const output = inputDataArr[dataIdx];
          // Inputs
          for (let outputIndex = 0; outputIndex < output.length; outputIndex++) {
            const outputValue = output[outputIndex];
            const outputInputElement = document.createElement("input")
            outputInputElement.classList.add("form-input")
            outputInputElement.setAttribute("type", "number")
            outputInputElement.setAttribute("min", 0)
            outputInputElement.setAttribute("max", settingsConfig?.data.inputMaxValue?.value || Config.maxValue)
            outputInputElement.setAttribute("value", outputValue)
            const outputDataboxIndex = settingsConfig?.isNew ? this.data.length - 1 : dataBoxIdx
            outputInputElement.setAttribute("name", `${outputDataboxIndex}-output-${outputIndex}`)
            outputInputElement.addEventListener("change", function (e) {
              const value = Number(e.target.value)
              parent.data[outputDataboxIndex].input[dataInputIndex][dataIdx][outputIndex] = value
            })
            dataRecordWrapper.append(outputInputElement)
          }
          dataInputIndex === 0 ? teamAData.append(dataRecordWrapper) : teamBData.append(dataRecordWrapper)
        }
      }
      // Append Team A input data to data-wrapper
      dataWrapperElement.append(teamAData)
      // Append Team B input data to data-wrapper
      dataWrapperElement.append(teamBData)
      // Append data wrapper to data-box
      newDataBoxElement.append(dataWrapperElement)
      // Add output wrapper
      const outputElement = document.createElement("div")
      outputElement.classList.add("output-wrapper")
      // output-wrapper data-inputs
      const outputDataRecordElement = document.createElement("div")
      outputDataRecordElement.classList.add("data-inputs")
      for (let outputI = 0; outputI < dataBox.output.length; outputI++) {
        const output = dataBox.output[outputI]
        const outputInputElement = document.createElement("input")
        outputInputElement.classList.add("form-input")
        outputInputElement.setAttribute("type", "number")
        outputInputElement.setAttribute("value", output)
        outputInputElement.setAttribute("min", 0)
        outputInputElement.setAttribute("max", 1)
        const outputDataboxIndex = settingsConfig?.isNew ? this.data.length - 1 : dataBoxIdx
        outputInputElement.setAttribute("name", `${outputDataboxIndex}-output-${outputI}`)
        outputInputElement.addEventListener("change", function (e) {
          parent.data[outputDataboxIndex].output[outputI] = Number(e.target.value)
        })
        // Append output(input) to data-inputs
        outputDataRecordElement.append(outputInputElement)
      }
      // Append data-inputs to output-wrapper
      outputElement.append(outputDataRecordElement)
      // Append output-wrapper to data-box
      newDataBoxElement.append(outputElement)
      // show
      lastChild.before(newDataBoxElement)
    }

    Elements.container.append(root)
  }
}
export { TrainEditor }
