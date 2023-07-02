import useSWR from "swr";
import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import ViewSubmission from "../components/ViewSubmission";

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

function useSearchResult(searchIndexes: Result[], searchQuery: any) {
  let results: Result[] = [];

  if (searchIndexes === undefined || searchQuery === undefined)
    return {
      results: [],
    };
  const options = {
    includeScore: true,
    keys: ["id", "title"],
  };

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
  return (
    <table className="table table-zebra table-x">
      <thead>
        <tr>
          <th>Id</th>
          <th className="text-center">Post Title</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result) => {
          return (
            <tr key={result.id}>
              <td>{result.id}</td>
              <td>{result.title}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function SearchSubmission() {
  const { searchIndexes, isLoading, isError } = useSearch();

  const [selectedSearchQuery, setSearchQuery] = useState<string>("");

  const { results } = useSearchResult(searchIndexes, selectedSearchQuery);

  if (isLoading)
    return (
      <div>
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  return (
    <div>
      <div className="">
        <input
          type="text"
          className="input input-bordered input-primary w-full max-w-xs"
          id="search"
          placeholder="Type anything and hit enter to begin search..."
          aria-label="search"
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              console.log(e.target.value);
              setSearchQuery(e.target.value);
            }
          }}
          aria-describedby="search"
        />
      </div>
      <div>
        <h3>Results</h3>
        {createResultTable(results)}
      </div>
    </div>
  );
}
