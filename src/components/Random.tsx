import React from "react";
import { useLocation } from "react-router-dom";
import useSWR from "swr";
import { ShowAlert } from "./ShowAlert";
import { ViewSubmission } from "./ViewSubmission";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useIndexes() {

  const indexesEndPoint = "http://localhost:8000/api/v2/random";

  const { data, error, isLoading } = useSWR(indexesEndPoint, fetcher);

  return {
    indexes: data,
    isLoading: isLoading,
    isError: error,
  };
}

function useSubmissions(indexes) {
  const submissions = [];

  if (indexes === undefined)
    return {
      submissions: submissions,
    };

  submissions.push(
    <ViewSubmission {...indexes} key={Date.now()} />
  );

  return {
    submissions: submissions,
  };
}

export default function Random() {

  const location = useLocation();

 

  const { indexes, isLoading, isError } = useIndexes();

  let { submissions } = useSubmissions(indexes);

  if (isError) {
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

  function handleRefresh(event: React.MouseEvent<HTMLInputElement>): void {
    event.preventDefault();
    
    window.location.reload(); 

  }

  //https://github.com/remix-run/react-router/issues/7416
  return (
    <>
    <p onClick={handleRefresh} className="flex flex-col items-center btn btn-primary">Get another random submission</p>
    <div className="pt-6 p-2" key={location.key}>
      {submissions.length === 0 ? (
        <ShowAlert
          payload={"There are no submissions for this criteria."}
          type={"warning"}
        />
      ) : (
        submissions
      )}
    </div>
    </>
  );
}
