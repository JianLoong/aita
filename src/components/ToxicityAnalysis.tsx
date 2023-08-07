import * as toxicity from "@tensorflow-models/toxicity";
import { useState } from "react";
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

  const process = (query) => {
    const threshold = 0.9;

    toxicity.load(threshold, []).then((model) => {
      const sentences = [query];

      model.classify(sentences).then((predictions) => {
        setResult(predictions);
      });
    });
  };

  return (
    <div>
      <input
        type="text"
        name="query"
        className="input input-bordered input-primary w-full "
        // className={!disabled? "input input-bordered input-primary w-full ": "hidden"}
        id="search"
        placeholder="Toxicity Analysis"
        aria-label="search"
        onKeyDown={(e: any) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setSearchQuery(e.target.value);
            const query = e.target.value;
            process(query);
          }
        }}
        aria-describedby="search"
      />
      <table className="table table-zebra table-lg">
        <thead>
          <tr>
            {/* <th>Id</th> */}
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
          {
            results.length != 0 &&
            <tr key={Math.random()}>
              <td className="">{JSON.stringify(results[0].results[0].match)} </td>
              <td className="">{JSON.stringify(results[1].results[0].match)}</td>
              <td className="">{JSON.stringify(results[2].results[0].match)}</td>
              <td className="">{JSON.stringify(results[3].results[0].match)}</td>
              <td className="">{JSON.stringify(results[4].results[0].match)}</td>
              <td className="">{JSON.stringify(results[5].results[0].match)}</td>
              <td className="">{JSON.stringify(results[6].results[0].match)}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
}
