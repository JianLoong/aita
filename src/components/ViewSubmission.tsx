import parse from "html-react-parser";
import { NavLink, useLocation } from "react-router-dom";
import useSWR from "swr";
import { convertDate, makeHTMLFromString } from "../utils/helpers";
import { ShowAlert } from "./ShowAlert";
import { Index } from "../types/index";
// import ViewToxicity from "./ViewToxicity";
import { memo, useState } from "react";
import { EmotionTable } from "./EmotionTable";
import { PieChart } from "./PieChart";
import { SimpleCloud } from "./SimpleCloud";

interface Entry {
  value: string;
  count: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useSummary(id: number) {
  const summaryEndPoint = `https://jian.sh/reddit-store/api/summary/${id}.json`;

  const { data, error, isLoading } = useSWR(summaryEndPoint, fetcher, {
    compare: (a, b) => {
      return a?.id === b?.id;
    },
  });

  let wordFrequency: Entry[] = [];

  const words = data?.word_freq;

  if (words != undefined) {
    Object.keys(words).forEach(function (key) {
      const entry = {
        value: key,
        count: words[key],
      };

      wordFrequency.push(entry);
    });
  }

  wordFrequency = wordFrequency.slice(0, 30);

  return {
    summary: data,
    wordFrequency: wordFrequency,
    isSummaryLoading: isLoading,
    isSummaryError: error,
  };
}

function useSubmission(id: number) {
  const submissionEndPoint = `https://jian.sh/reddit-store/api/submissions/${id}.json`;

  const { data, error, isLoading } = useSWR(submissionEndPoint, fetcher);

  return {
    submission: data,
    isLoading,
    isError: error,
  };
}

export const ViewSubmission = memo(({ id }: Index) => {
  const location = useLocation();

  const submissionId = Number(location["pathname"].split("/")[2]) || id;

  const { submission, isLoading, isError } = useSubmission(submissionId);

  const [shown, setShown] = useState<boolean>(false);

  const [repliesShown, setShowReplies] = useState<boolean>(false);

  const { summary, wordFrequency, isSummaryLoading, isSummaryError } =
    useSummary(submissionId);

  const handleShow = () => {
    setShown(!shown);
  };

  const handleShowReplies = () => {
    setShowReplies(!repliesShown);
  };

  if (isLoading)
    return (
      <div>
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  if (isError || isSummaryError) {
    return (
      <ShowAlert
        payload={"Please try again later, there has been an error"}
        type={"error"}
      />
    );
  }

  if (isSummaryLoading)
    return (
      <div>
        <span className="loading loading-dots loading-lg">
          Loading submission
        </span>
      </div>
    );

  const selfText = makeHTMLFromString(submission?.selftext);

  const isDirectPage = location["pathname"].startsWith("/submission");

  // isDirectPage ? window.scrollTo(0, 0) : "";

  const DownChevron = (props) => {
    const text = props.value;

    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
        {text}
      </>
    );
  };

  const UpChevron = (props) => {
    const text = props.value;

    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 15.75l7.5-7.5 7.5 7.5"
          />
        </svg>
        {text}
      </>
    );
  };

  return (
    <div key={submission?.id}>
      <div id={"section" + submission?.id} className=""></div>
      <div className="card mb-2 bg-base-100 shadow-xl p-3">
        <div className="card-body">
          <h2 className="card-title">
            <strong>{submission?.title}</strong>
          </h2>
          <small>{convertDate(submission?.created_utc)}</small>

          <article className="prose max-w-none">{parse(selfText)}</article>
          <p>
            View original post{" "}
            <a
              className="text-blue-600 dark:text-blue:500 hover:underline"
              href={"https://reddit.com" + submission?.permalink}
            >
              here
            </a>
          </p>

          <button className={"btn btn-info"} onClick={handleShow}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>

            {shown ? "Hide Results" : "See what the others think.."}
          </button>

          <p>
            Number of replies: <strong>{submission?.replies.length}</strong>
          </p>

          <div
            className={shown ? "grid grid-cols-1 md:grid-cols-3" : "hidden"}
            data-theme="wireframe"
          >
            <div className="m-1">
              <h3 className="text-center">
                <strong>Generated Word Cloud</strong>
              </h3>
              <br />
              <SimpleCloud {...wordFrequency} />
            </div>
            <div className="m-1">
              <h3 className="text-center">
                <strong>Results of NRC Emotion Lexicon Analysis</strong>
              </h3>
              <br />
              <EmotionTable {...summary} />
            </div>

            <div className="m-2">
              <h3 className="text-center">
                <strong>Breakdown of Replies</strong>
              </h3>
              <br />
              <PieChart className="p-2" {...summary} />
            </div>
          </div>

          {!isDirectPage ? (
            <NavLink
              className="link"
              to={"/submission/" + submission?.id}
              key={submission?.id}
            >
              View in detail
            </NavLink>
          ) : (
            <div>
              <button
                className="btn btn-info"
                name="repliesShown"
                onClick={handleShowReplies}
              >
                {repliesShown ? (
                  <UpChevron value="Hide Replies" />
                ) : (
                  <DownChevron value="Show Replies" />
                )}
              </button>

              <div className={repliesShown ? "break-all" : "hidden"}>
                {/* <ViewToxicity sentences={submission?.selftext} /> */}
                <br />
                {submission?.replies.map((e: string) => {
                  return <li key={Math.random()}>{e}</li>;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
