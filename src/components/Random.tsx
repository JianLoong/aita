import React from "react";
import { useLocation } from "react-router-dom";
import useSWR from "swr";
import { ShowAlert } from "./ShowAlert";
import { ViewSubmission } from "./ViewSubmission";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Random() {

  const location = useLocation();

  const randomEndPoint = "https://api.jian.sh/aita/api/v2/submissions/random";

  let { data, error, mutate, isLoading } = useSWR(randomEndPoint, fetcher);

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

  function handleRefresh(event: React.MouseEvent<HTMLInputElement>): void {
    event.preventDefault();
    mutate()
  }

  //https://github.com/remix-run/react-router/issues/7416
  return (
    <>
    <p onClick={handleRefresh} className="flex flex-col items-center btn btn-primary">Get another random submission</p>
    <div className="pt-6 p-2" key={location.key}>
      {data.length === 0 ? (
        <ShowAlert
          payload={"There are no submissions for this criteria."}
          type={"warning"}
        />
      ) : (
        <ViewSubmission {...data} key={Date.now()} />
      )}
    </div>
    </>
  );
}
