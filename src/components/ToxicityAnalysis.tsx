import { useEffect, useState, KeyboardEvent } from "react";
import { useSearchParams } from "react-router-dom";
import workerpool from "workerpool";

export default function ToxicityAnalysis() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [disabled, setDisabled] = useState<boolean>(false);

  const queryString = searchParams.get("query") || "";

  const [selectedSearchQuery, setSearchQuery] = useState<string>(queryString);

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
    const pool = workerpool.pool("./workers/toxicity.js");

    if (selectedSearchQuery === undefined || selectedSearchQuery.length == 0) {
      setResult([]);
      return;
    }

    setDisabled(true);

    pool
      .exec("toxicityAnalysis", [selectedSearchQuery])
      .then(function (result) {
        // console.log("result", result);
        setResult(result);
        setDisabled(false);
      })
      .catch(function (err) {
        console.error(err);
      })
      .then(function () {
        pool.terminate(); // terminate all workers when done
      });
  }, [selectedSearchQuery]);

  const isLoading = () => (
    <strong className="loading loading-dots loading-lg"></strong>
  );

  return (
    <div>
      <div className="prose max-w-none break-all">
        <p>This tool is based on Tensorflow.js to allow the determination if a text is of toxic nature.</p>
        <p>This is based on a demo <a href="https://github.com/tensorflow/tfjs-models/tree/master/toxicity">here</a></p>
        <p>Examples</p>
        <ol>
          <li>We're dudes on computers, moron. You are quite astonishingly stupid.</li>
          <li>Please stop. If you continue to vandalize Wikipedia, as you did to Kmart, you will be blocked from editing.</li>
          <li>Wow, you are bad at this.</li>
        </ol>
        <br />
        <br />
      </div>
      <input
        type="text"
        name="query"
        className="input input-bordered input-primary w-full "
        // className={!disabled? "input input-bordered input-primary w-full ": "hidden"}
        id="search"
        placeholder="Toxicity Analysis"
        aria-label="search"
        disabled={disabled}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            e.preventDefault();
            // setResult([]);
            // const query = e.currentTarget.value;
            // setDisabled(true);
            setSearchParams("query=" + e.currentTarget.value);
            setSearchQuery(e.currentTarget.value);
          }
        }}
        defaultValue={selectedSearchQuery}
        aria-describedby="search"
      />
      <br />
      <br />
      {results.length != 0 ? (
        <div className="overflow-x-auto">
          <h3>Toxicity Analysis</h3>
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
        </div>
      ) : (
        selectedSearchQuery !== "" && isLoading()
      )}
    </div>
  );
}