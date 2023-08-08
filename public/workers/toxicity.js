// eslint-disable-next-line no-undef
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js");
// eslint-disable-next-line no-undef
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity");
// eslint-disable-next-line no-undef
importScripts("https://cdn.jsdelivr.net/npm/workerpool@6.4.0/dist/workerpool.min.js");

// Supress warnings from WEBGL2
console.warn = () => {""};

// https://github.com/tensorflow/tfjs/issues/4284
// eslint-disable-next-line no-undef
tf.ENV.registerFlag('HAS_WEBGL', '1');
// eslint-disable-next-line no-undef
tf.ENV.registerFlag('WEBGL_VERSION', '1');
// eslint-disable-next-line no-undef
tf.ENV.backend = 'webgl';
// eslint-disable-next-line no-undef
tf.setBackend('webgl');    

async function toxicityAnalysis(sentences) {
  const threshold = 0.9;

  // eslint-disable-next-line no-undef
  const results = await toxicity.load(threshold, []);

  const data = await results.classify(sentences);

  return data;
}

// eslint-disable-next-line no-undef
workerpool.worker({
  toxicityAnalysis: toxicityAnalysis,
});
