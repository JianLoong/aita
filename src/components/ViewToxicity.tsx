import { useState } from "react";
import workerpool from "workerpool";

export default function ViewToxicity({ sentences }) {
  const [results, setResult] = useState<
    Array<{
      label: string;
      results: Array<{
        probabilities: Float32Array;
        match: boolean;
      }>;
    }>
  >([]);

  const pool = workerpool.pool("/workers/toxicity.js");

  // console.log(pool);

  pool
    .exec("toxicityAnalysis", [sentences])
    .then(function (result) {
      // console.log("result", result); 
      setResult(result);
    })
    .catch(function (err) {
      console.error(err);
    })
    .then(function () {
      pool.terminate(); // terminate all workers when done
    });

  const isLoading = () => (
    <strong className="loading loading-dots loading-lg"></strong>
  );

  return (
    <div>
      <h3>
        <strong>Toxicity Analysis</strong>
      </h3>
      {results.length != 0 ? (
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
            <tr key={JSON.stringify(results[0])}>
              <td className="">
                {!results[0].results[0].match ? (
                  <i className="">
                    {JSON.stringify(results[0].results[0].match)}
                  </i>
                ) : (
                  <strong className="text-error">
                    {JSON.stringify(results[0].results[0].match)}
                  </strong>
                )}
              </td>

              <td className="">
                {!results[1].results[0].match ? (
                  <i className="">
                    {JSON.stringify(results[1].results[0].match)}
                  </i>
                ) : (
                  <strong className="text-error">
                    {JSON.stringify(results[1].results[0].match)}
                  </strong>
                )}
              </td>

              <td className="">
                {!results[2].results[0].match ? (
                  <i className="">
                    {JSON.stringify(results[2].results[0].match)}
                  </i>
                ) : (
                  <strong className="text-error">
                    {JSON.stringify(results[2].results[0].match)}
                  </strong>
                )}
              </td>

              <td className="">
                {!results[3].results[0].match ? (
                  <i className="">
                    {JSON.stringify(results[3].results[0].match)}
                  </i>
                ) : (
                  <strong className="text-error">
                    {JSON.stringify(results[3].results[0].match)}
                  </strong>
                )}
              </td>

              <td className="">
                {!results[4].results[0].match ? (
                  <i className="">
                    {JSON.stringify(results[4].results[0].match)}
                  </i>
                ) : (
                  <strong className="text-error">
                    {JSON.stringify(results[4].results[0].match)}
                  </strong>
                )}
              </td>

              <td className="">
                {!results[5].results[0].match ? (
                  <i className="">
                    {JSON.stringify(results[5].results[0].match)}
                  </i>
                ) : (
                  <strong className="text-error">
                    {JSON.stringify(results[5].results[0].match)}
                  </strong>
                )}
              </td>

              <td className="">
                {!results[6].results[0].match ? (
                  <i className="">
                    {JSON.stringify(results[6].results[0].match)}
                  </i>
                ) : (
                  <strong className="text-error">
                    {JSON.stringify(results[6].results[0].match)}
                  </strong>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        isLoading()
      )}
    </div>
  );
}
