import parse from "html-react-parser";
import { memo, useState } from "react";
import { useLocation } from "react-router-dom";
import useSWR from "swr";
import { Submission } from "../types/submission";
import { convertDate, makeHTMLFromString } from "../utils/helpers";
import { PieChart } from "./PieChart";
import { SimpleCloud } from "./SimpleCloud";
import { EmotionTable } from "./EmotionTable";
import { ShowAlert } from "./ShowAlert";
import { ViewAIInference } from "./ViewAIInference";

interface Entry {
  value: string;
  count: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useSummary(id: number) {

  const summaryEndPoint = `${import.meta.env.VITE_API_BASE_URL}/summary/${id}`;

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

export const ViewSubmission = memo((submission: Submission) => {
  const location = useLocation();

  if (location.state != undefined)
    submission = location.state;

  const [shown ] = useState<boolean>(false);

  const { summary, wordFrequency, isSummaryLoading, isSummaryError } =
    useSummary(submission.id);

  if (isSummaryLoading)
    return (
      <div>
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  if (isSummaryError) {
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

  return (
    <>
      <div key={submission?.id}>
        <div id={"section" + submission?.id} className=""></div>
        <div className="card mb-2 bg-base-100 shadow-xl p-3">
          <div className="card-body">
            <h2 className="card-title">
              <strong>{submission?.title}</strong>
            </h2>
            <small>{convertDate(submission?.created_utc)}</small>

            <div className="grid grid-flow-row-dense lg:grid-cols-3">

              <article className="prose max-w-none lg:col-span-2 p-2">{parse(selfText)}
                <p>
                  View original post{" "}
                  <a
                    className="text-blue-600 dark:text-blue:500 hover:underline"
                    href={"https://reddit.com" + submission?.permalink}
                  >
                    here
                  </a>
                </p>
              </article>
              <div className="lg:col-span-1">
                <h3 className="text-center">
                  <strong>Breakdown of Replies</strong>
                </h3>
                <br />
                <PieChart className="p-2" {...summary} />
              </div>

            </div>
            <div className="grid lg:grid-cols-3 gap-4 mt-4">
              <div>
                <h3 className="text-center">
                  <strong>Word Cloud</strong>
                </h3>
                <SimpleCloud wordFrequency={wordFrequency} />
              </div>
              <div>
                <h3 className="text-center">
                  <strong>Emotion Results</strong>
                </h3>
                <EmotionTable {...summary} />
              </div>
              {submission?.id && (
                <div>
                  <ViewAIInference id={submission?.id} />
                </div>
              )}
            </div>
            <div
              className={shown ? "grid" : "hidden"}
              data-theme="wireframe"
            >
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
