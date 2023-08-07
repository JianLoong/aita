import * as toxicity from "@tensorflow-models/toxicity";

const threshold = 0.9;

export default async function toxicityAnalysis(sentences) {
  const results = await toxicity.load(threshold, []);

  const data = await results.classify(sentences);

  console.log(data);

  return data;
}
