import { useEffect, useState } from "react";
import toxicityAnalysis from "../utils/toxicity_analysis";

export default function ViewToxicity({sentences}) {

  const [results, setResult] = useState<
    Array<{
      label: string;
      results: Array<{
        probabilities: Float32Array;
        match: boolean;
      }>;
    }>
  >([]);

  useEffect(() => {
    const process = async (query) => {

        const sentences = [query];
        // const sentences = ["We're dudes on computers, moron. You are quite astonishingly stupid."];
        const predictions = await toxicityAnalysis(sentences);
    
        setResult(predictions);
      };

    process(sentences);
  }, [sentences]);



  return (
    <div>
    <h3><strong>Toxicity Analysis</strong></h3>
      <table className="table table-zebra table-lg">
        <thead>
          <tr>
            <th className="">Identity Attack</th>
            <th className="">Insult</th>
            <th className="">Obscene</th>
            <th className="">Severe Toxicity</th>
            <th className="">Sexual Explicit</th>
            <th className="">Threat</th>
            <th className="">Toxicity</th>
          </tr>
        </thead>
        <tbody>
          {results.length != 0 && (
            <tr key={JSON.stringify(results[0])}>
              <td className="">
                {JSON.stringify(results[0].results[0].match)}{" "}
              </td>
              <td className="">
                {JSON.stringify(results[1].results[0].match)}
              </td>
              <td className="">
                {JSON.stringify(results[2].results[0].match)}
              </td>
              <td className="">
                {JSON.stringify(results[3].results[0].match)}
              </td>
              <td className="">
                {JSON.stringify(results[4].results[0].match)}
              </td>
              <td className="">
                {JSON.stringify(results[5].results[0].match)}
              </td>
              <td className="">
                {JSON.stringify(results[6].results[0].match)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
