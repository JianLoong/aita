import useSWR from "swr";
import ViewSubmission from "./ViewSubmission";

import ShowAlert from "./ShowAlert";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useIndexes() {
  const indexesEndPoint =
    "https://jianliew.me/reddit-store/api/indexes/indexes.json";

  const { data, error, isLoading } = useSWR(indexesEndPoint, fetcher);

  if (data === undefined) {
    return {
        submissions: [],
        isLoading,
        isError: error,
      };
  }

  const submissions = [];
  
  const randomSubmission = data[Math.floor(Math.random() * data.length)];

  submissions.push(<ViewSubmission {...randomSubmission} key={randomSubmission?.id} />);

  return {
    submissions: submissions,
    isLoading,
    isError: error,
  };
}

export default function Random() {

  const { submissions, isLoading, isError } = useIndexes();

  if (isError) {
    return <ShowAlert payload={"Please try again later, there has been an error"} type={"error"} />
  }

  if (isLoading)
    return (
      <div className="p-2">
         <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  return (
    <div className="pt-6 p-2" key={1}>
      {
        submissions.length === 0? <ShowAlert payload={"There are no submissions for this criteria."} type={"warning"} /> : submissions
      }
    </div>
  );
}
