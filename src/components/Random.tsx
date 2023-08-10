import useSWR from "swr";
import ViewSubmission from "./ViewSubmission";

import { useLocation } from "react-router-dom";
import ShowAlert from "./ShowAlert";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useIndexes() {
  const indexesEndPoint =
    "https://jianliew.me/reddit-store/api/indexes/indexes.json";

  const { data, error, isLoading } = useSWR(indexesEndPoint, fetcher);

  return {
    indexes: data,
    isLoading: isLoading,
    isError: error,
  };

  // const submissions = [];

  // const randomSubmission = data[Math.floor(Math.random() * data.length)];

  // submissions.push(<ViewSubmission {...randomSubmission} key={randomSubmission?.id} />);

  // return {
  //   submissions: submissions,
  //   isLoading,
  //   isError: error,
  // };
}

function useSubmissions(indexes) {
  const submissions = [];

  if (indexes === undefined)
    return {
      submissions: submissions,
    };

  const randomSubmission = indexes[Math.floor(Math.random() * indexes.length)];

  submissions.push(
    <ViewSubmission {...randomSubmission} key={randomSubmission?.id} />
  );

  return {
    submissions: submissions,
  };
}

export default function Random() {
  const { indexes, isLoading, isError } = useIndexes();

  const { submissions } = useSubmissions(indexes);

  const location = useLocation();

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

  //https://github.com/remix-run/react-router/issues/7416
  return (
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
  );
}
