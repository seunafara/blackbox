import Config from './Config.js'
import Elements from './Elements.js'
class TestEditor {
  constructor() {
    this.form = Config.net.data.blank
  }
  render() {
    const parent = this
    document.getElementById("train-editor").classList.add("hidden")
    // Test Editor Section
    const newTestEditor = document.createElement("section")
    newTestEditor.setAttribute("id", "test-editor")
    // Back Button
    const backButton = document.createElement("button")
    backButton.setAttribute("id", "back-button")
    backButton.classList.add("back-button")
    backButton.innerHTML = "&larr;"
    backButton.addEventListener("click", function () {
      // Show Train Screen
      document.getElementById("test-editor").remove()
      document.getElementById("train-editor").classList.remove("hidden")
      // Toggle Screen Action Button
      Elements.button.net.test.classList.add("hidden")
      Elements.button.net.train.classList.remove("hidden")
      Elements.button.settings.icon.classList.remove("hidden")
    })
    newTestEditor.append(backButton)
    // Create Data Box
    const newDataBoxElement = document.createElement("div")
    newDataBoxElement.classList.add("data-box")
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
    for (let dataInputIndex = 0; dataInputIndex < this.form.input.length; dataInputIndex++) {
      const inputDataArr = this.form.input[dataInputIndex];
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
          outputInputElement.setAttribute("max", 10)
          outputInputElement.setAttribute("value", outputValue)
          outputInputElement.addEventListener("change", function (e) {
            const value = Number(e.target.value)
            parent.form.input[dataInputIndex][dataIdx][outputIndex] = value
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
    for (let outputI = 0; outputI < this.form.output.length; outputI++) {
      const output = this.form.output[outputI]
      const outputInputElement = document.createElement("input")
      outputInputElement.classList.add("form-input")
      outputInputElement.setAttribute("type", "number")
      outputInputElement.setAttribute("value", output)
      outputInputElement.setAttribute("min", 0)
      outputInputElement.setAttribute("max", 10)
      outputInputElement.setAttribute("disabled", true)
      outputInputElement.setAttribute("id", `output-${outputI}`)
      // Append output(input) to data-inputs
      outputDataRecordElement.append(outputInputElement)
    }
    // Append data-inputs to output-wrapper
    outputElement.append(outputDataRecordElement)
    // Append output-wrapper to data-box
    newDataBoxElement.append(outputElement)
    newTestEditor.append(newDataBoxElement)
    Elements.container.append(newTestEditor)
  }
}
export {
  TestEditor
}
