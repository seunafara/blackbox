export default {
  debug: false,
  routes: {
    index: "index.html"
  },
  accuracyTestMark: 51,
  maxValue: 1,
  net: {
    data: {
      blank: {
        input: [
          [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        ],
        output: [0, 0]
      },
      scale: {
        input: 0,
        output: 0,
      },
    },
    simulate: {
      size: 100,
    },
    train: {
      config: {
        log: true,
        logPeriod: 100,
        iterations: 1
      },
    },
    types: {
      simulate: true, // || "local i.e false"
    },
    worker: {
      name: 'Networker.js'
    }
  },
  data: {
    default: [
      {
        input: [
          [[1, 0], [1, 0], [1, 0], [1, 0], [1, 0]],
          [[0, 0], [1, 0], [1, 0], [1, 0], [1, 0]],
        ],
        output: [1, 0]
      },
      {
        input: [
          [[1, 0], [1, 0], [1, 0], [1, 0], [1, 0]],
          [[1, 0], [1, 0], [0, 0], [1, 0], [1, 0]],
        ],
        output: [1, 0]
      },
      {
        input: [
          [[1, 0], [1, 0], [1, 0], [1, 0], [1, 0]],
          [[1, 0], [1, 0], [1, 0], [1, 0], [0, 0]],
        ],
        output: [1, 0]
      },
      {
        input: [
          [[0, 0], [1, 0], [1, 0], [1, 0], [1, 0]],
          [[1, 0], [1, 0], [1, 0], [1, 0], [1, 0]],
        ],
        output: [0, 0]
      },
      {
        input: [
          [[1, 0], [1, 0], [0, 0], [1, 0], [1, 0]],
          [[1, 0], [1, 0], [1, 0], [1, 0], [1, 0]],
        ],
        output: [0, 0]
      },
      {
        input: [
          [[1, 0], [1, 0], [1, 0], [1, 0], [0, 0]],
          [[1, 0], [1, 0], [1, 0], [1, 0], [1, 0]],
        ],
        output: [0, 0]
      },
    ]
  }
}
