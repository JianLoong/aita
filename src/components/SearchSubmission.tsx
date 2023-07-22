import Fuse from "fuse.js";
import { useState } from "react";
import useSWR from "swr";
import { NavLink } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import ShowAlert from "./ShowAlert";

interface Result {
  id: string;
  title: string;
  score: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useSearch() {
  const summaryEndPoint = `https://jianliew.me/reddit-store/api/search/search.json`;

  const { data, error, isLoading } = useSWR(summaryEndPoint, fetcher);

  return {
    searchIndexes: data,
    isLoading: isLoading,
    isError: error,
  };
}

function useSearchResult(searchIndexes: Result[], searchQuery: string) {
  const results: Result[] = [];

  
  if (searchIndexes === undefined || searchQuery === undefined)
    return {
      results: [],
    };
  const options = {
    includeScore: true,
    keys: ["id", "title"],
  };

  // setDisabled(true);

  const fuse = new Fuse(searchIndexes, options);

  const fuseResults = fuse.search(searchQuery, {
    limit: 20,
  });

  fuseResults.forEach((e) => {
    const result = {
      id: e.item.id,
      score: e.score,
      title: e.item.title,
    } as Result;

    results.push(result);
  });


  return {
    results: results,
  };
}

function createResultTable(results: Result[]) {
  if (results.length == 0) {
    return "";
  }

  return (
    <div className="p-2">
      <h3>Results</h3>
      <table className="table table-zebra table-x">
        <thead>
          <tr>
            {/* <th>Id</th> */}
            <th className="">Score</th>
            <th className="">Post Title</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => {
            return (
              <tr key={result.id}>
                <td>{result.score}</td>
                <td className="">
                  <NavLink className="link" to={"/submission/" + result.id}>
                    {result.title}
                  </NavLink>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function SearchSubmission() {
  // Search params to be used for input
  const [searchParams, setSearchParams] = useSearchParams();

  const queryString = searchParams.get("query") || "";

  const { searchIndexes, isLoading } = useSearch();

  const [selectedSearchQuery, setSearchQuery] = useState<string>(queryString);

  const { results } = useSearchResult(searchIndexes, selectedSearchQuery);

  if (isLoading)
    return (
      <div>
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  return (
    <div>
      <div className="p-2">
        <article className="pb-2 prose lg:prose-xl">
          <h5>Search</h5>
        </article>

        <form method="GET">
          <input
            type="text"
            name="query"
            className="input input-bordered input-primary w-full "
            // className={!disabled? "input input-bordered input-primary w-full ": "hidden"}
            id="search"
            placeholder="Type anything and hit enter to begin search..."
            aria-label="search"
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setSearchQuery(e.target.value);
                setSearchParams("query=" + e.target.value);
              }
            }}
            aria-describedby="search"
          />
        </form>
        <div className="pt-2">
          {results.length != 0 ? (
            <ShowAlert
              payload={"Search results are as follows"}
              type={"success"}
            />
          ) : selectedSearchQuery !== "" ? (
            <ShowAlert
              payload={"There are no results for this search"}
              type={"warning"}
            />
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="pt-5">{createResultTable(results)}</div>
    </div>
  );
}
