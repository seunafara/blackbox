export default {
  container: document.getElementById("container"),
  button: {
    data: {
      new: document.getElementById("new-data-button")
    },
    net: {
      test: document.getElementById("test-net-button"),
      train: document.getElementById("train-net-button")
    },
    back: document.getElementById("back-button"),
    settings: {
      icon: document.getElementById("settings-icon-button"),
      save: document.getElementById("settings-save-button")
    },
    train: {
      stop: document.getElementById("stop-training-button")
    }
  },
  controlPanel: {
    training: {
      text: document.getElementById("training-net-text")
    }
  },
  editor: {
    test: document.getElementById("test-editor"),
    train: document.getElementById("train-editor")
  },
}
