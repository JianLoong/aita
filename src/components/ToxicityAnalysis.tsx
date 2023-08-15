import { KeyboardEvent, useState } from "react";
import workerpool from "workerpool";

export default function ToxicityAnalysis() {
  const [selectedSearchQuery, setSearchQuery] = useState<string>("");

  const [results, setResults] = useState<
    Array<{
      label: string;
      results: Array<{
        probabilities: Float32Array;
        match: boolean;
      }>;
    }>
  >([]);

  const [isModelLoading, setModelLoading] = useState<boolean>();

  const process = (selectedSearchQuery) => {
    const pool = workerpool.pool("./workers/toxicity.js");

    if (selectedSearchQuery == undefined || selectedSearchQuery.length == 0)
      return;

    setModelLoading(true);

    pool
      .exec("toxicityAnalysis", [selectedSearchQuery])
      .then(function (result) {
        setResults(result);
        setModelLoading(false);
      })
      .catch(function (err) {
        console.error(err);
      })
      .then(function () {
        pool.terminate(); // terminate all workers when done
      });
  };

  return (
    <div className="p-2">
      <div className="prose max-w-none">
        <p>
          This tool is based on Tensorflow.js to allow the determination if a
          text is of toxic nature.
        </p>
        <p>
          This is based on a demo{" "}
          <a href="https://github.com/tensorflow/tfjs-models/tree/master/toxicity">
            here
          </a>
        </p>
        <p>Examples</p>
        <ol>
          <li>
            We're dudes on computers, moron. You are quite astonishingly stupid.
          </li>
          <li>
            Please stop. If you continue to vandalize Wikipedia, as you did to
            Kmart, you will be blocked from editing.
          </li>
          <li>Wow, you are bad at this.</li>
        </ol>

        <br />
      </div>

      {isModelLoading && (
        <div>
          <strong className="loading loading-dots loading-lg"></strong>
          <p>Processing </p>
        </div>
      )}

      {!isModelLoading && (
        <input
          type="text"
          name="query"
          className="input input-bordered input-primary w-full "
          // className={!disabled? "input input-bordered input-primary w-full ": "hidden"}
          id="search"
          placeholder="Please enter text here and hit enter"
          aria-label="search"
          maxLength={200}
          onChange={() => {
            setResults([]);
          }}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              setResults([]);
              e.preventDefault();
              setSearchQuery(e.currentTarget.value);
              process(e.currentTarget.value);
            }
          }}
          defaultValue={selectedSearchQuery}
          aria-describedby="search"
        />
      )}
      <br />
      <br />

      {results.length != 0 && (
        <div className="overflow-x-auto">
          <h3>Toxicity Analysis</h3>
          <table className="table table-zebra table-lg">
            <thead>
              <tr>
                <th>Identity Attack</th>
                <th>Insult</th>
                <th>Obscene</th>
                <th>Severe Toxicity</th>
                <th>Sexual Explicit</th>
                <th>Threat</th>
                <th>Toxicity</th>
              </tr>
            </thead>

            <tbody>
              <tr key={Math.random()}>
                {results.map((result) => {
                  return !result.results[0].match ? (
                    <td key={Math.random()} className="">
                      {JSON.stringify(result.results[0].match)}
                    </td>
                  ) : (
                    <td key={Math.random()} className="text-error">
                      <strong>{JSON.stringify(result.results[0].match)}</strong>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
