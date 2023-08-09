// import * as toxicity from "@tensorflow-models/toxicity";

// const threshold = 0.9;

export default async function toxicityAnalysis(sentences: string, models) {
  // const results = await toxicity.load(threshold, []);

  const data = await models.classify(sentences);

  return data;
}
