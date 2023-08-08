import * as toxicity from "@tensorflow-models/toxicity";

const threshold = 0.9;

export default async function toxicityAnalysis(sentences: string) {
  const results = await toxicity.load(threshold, []);

  const data = await results.classify(sentences);

  return data;
}
