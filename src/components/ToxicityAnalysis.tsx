import * as toxicity from "@tensorflow-models/toxicity";
import { KeyboardEvent, useEffect, useState } from "react";
import useSWR from "swr";

export default function ToxicityAnalysis() {
  const [selectedSearchQuery, setSearchQuery] = useState<string>("");

  const modelFetcher = () =>
    toxicity.load(0.08, []).then((res) => {
      return res;
    });

  const useModel = () => {
    const { data, error, isLoading } = useSWR("model", modelFetcher);

    return {
      model: data,
      isModelLoading: isLoading,
      isError: error,
    };
  };

  const { model, isModelLoading } = useModel();

  const toxicityFetcher = (sentences: string) =>
    model.classify(sentences).then((results) => {
      return results;
    });

  const useToxicity = (sentence: string) => {
    const { data, error, isLoading } = useSWR(sentence, toxicityFetcher);

    return {
      data: data,
      isResultError: error,
      isResultLoading: isLoading,
    };
  };

  const [results, setResults] = useState<
    Array<{
      label: string;
      results: Array<{
        probabilities: Float32Array;
        match: boolean;
      }>;
    }>
  >([]);

  // TODO add result loading implementation
  const { data, isResultLoading } = useToxicity(selectedSearchQuery);

  useEffect(() => {
    if (
      selectedSearchQuery === undefined ||
      selectedSearchQuery.length == 0 ||
      model === undefined ||
      data == undefined
    ) {
      setResults([]);
      return;
    }

    setResults(data);

  }, [selectedSearchQuery, data, model]);

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
      </div>
      {isModelLoading && (
        <div className="p-2">
          <p>Loading model</p>
          <span className="loading loading-dots loading-lg"> </span>
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
            }
          }}
          defaultValue={selectedSearchQuery}
          aria-describedby="search"
        />
      )}
      <br />
      <br />

      {isResultLoading && (
        <div className="p-2">
          <p>Loading model</p>
          <span className="loading loading-dots loading-lg"> </span>
        </div>
      )}

      {results.length != 0  && (
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
