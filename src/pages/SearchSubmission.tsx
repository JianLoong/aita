import { useState, KeyboardEvent } from "react";
import useSWR from "swr";
import { NavLink } from "react-router-dom";
import { ShowAlert } from "../components/ShowAlert";
import { Submission } from "../types/submission";


const fetcher = (url: string) => fetch(url).then((res) => res.json());

function createResultTable(submission: Submission[]) {
  if (submission.length == 0) {
    return "";
  }

  return (
    <div className="p-2">
      <h3>Results</h3>
      <table className="table table-zebra table-x">
        <thead>
          <tr>
            <th className="">ID</th>
            <th className="">Post Title</th>
          </tr>
        </thead>
        <tbody>
          {submission.map((result) => {
            return (
              <tr key={result.id}>
                <td>{result.id}</td>
                <td className="">
                  <NavLink 
                  className="link" to={"/submission/" + result.id} state={result}>
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
  // const [searchParams, setSearchParams] = useSearchParams();

  // const queryString = searchParams.get("query") || "";

  const [selectedSearchQuery, setSearchQuery] = useState<string>("");

  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const fuzzySearchEndPoint = `https://api.jian.sh/aita/api/v2/submissions/fuzzy-search?query=${selectedSearchQuery}`

  const { data, error, isLoading } = useSWR(shouldFetch ? fuzzySearchEndPoint : null, fetcher);

  if (error) {
    return (
      <ShowAlert
        payload={"Please try again later, there has been an error"}
        type={"error"}
      />
    );
  }

  if (isLoading)
    return (
      <div className="p-2">
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
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              
              if (e.key === "Enter") {
                e.preventDefault();
                setSearchQuery(e.currentTarget.value);
                setShouldFetch(true);
              }
              
            }}
            aria-describedby="search"
          />
        </form>
        <br />

        <div className="pt-2">
          {data  && data.length != 0 ? (
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

      <div className="pt-5">{data && createResultTable(data)}</div>
    </div>
  );
}
