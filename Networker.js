const loadBrain = async () => {
  if (typeof brain !== 'undefined') {
    return;
  }
  try {
    const response = await fetch('brain.js');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const script = await response.text();
    eval(script);
  } catch (error) {
    console.error('Failed to load brain.js:', error);
    throw new Error('Could not load brain.js. The app may not work correctly offline.');
  }
};
self.addEventListener("message", async (e) => {
  const data = e.data;
  if (data.cmd !== "ai") return;
  try {
    await loadBrain();
    if (typeof brain === 'undefined') {
      throw new Error('brain.js is not defined after loading attempt.');
    }
    const netConfig = data.config.net.config
    const net = data.config.settings.useGPU.value ? new brain.NeuralNetworkGPU(netConfig) : new brain.NeuralNetwork(netConfig);
    net.train(data.trainingData, {
      ...data.config.net.train,
      // User setting || Default config value
      iterations: Number(data?.config?.settings?.iterations?.value) || data.config.net.train.iterations,
    });
    self.postMessage({
      cmd: "net-refreshed",
      net: net.toJSON()
    });
  } catch (error) {
    self.postMessage({
      cmd: "net-error",
      error: error.message
    });
  }
});
