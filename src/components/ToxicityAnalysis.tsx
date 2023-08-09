import * as toxicity from "@tensorflow-models/toxicity";
import { KeyboardEvent, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function ToxicityAnalysis() {
  const [searchParams, setSearchParams] = useSearchParams();

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

  const [model, setModel] = useState<any>();

  function toxicityAnalysis(sentences: string, model) {
    if (model === undefined) return [];

    const data = model.classify(sentences);

    return data;
  }

  async function loadModel() {
    const threshold = 0.9;

    const results = await toxicity.load(threshold, []);

    setModel(results);
  }

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (selectedSearchQuery === undefined || selectedSearchQuery.length == 0 || model === undefined) {
      setResult([]);
      return;
    }

    const response = toxicityAnalysis(selectedSearchQuery, model);

    response.then((response) => {
      setResult(response);
    });


  }, [selectedSearchQuery, model]);

  const isLoading = () => (
    <strong className="loading loading-dots loading-lg"></strong>
  );

  return (
    <div>
      <div className="prose max-w-none break-all">
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
        <br />
      </div>
      <input
        type="text"
        name="query"
        className="input input-bordered input-primary w-full "
        // className={!disabled? "input input-bordered input-primary w-full ": "hidden"}
        id="search"
        placeholder="Please enter text here and hit enter"
        aria-label="search"
        maxLength={200}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            e.preventDefault();
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
              <tr key={1}>
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
