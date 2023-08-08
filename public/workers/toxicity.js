// import * as toxicity from "@tensorflow-models/toxicity";
// import workerpool from "workerpool";
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity");
importScripts("https://cdn.jsdelivr.net/npm/workerpool@6.4.0/dist/workerpool.min.js");

async function toxicityAnalysis(sentences) {
  const threshold = 0.9;

  const results = await toxicity.load(threshold, []);

  const data = await results.classify(sentences);

  return data;
}

workerpool.worker({
  toxicityAnalysis: toxicityAnalysis,
});
