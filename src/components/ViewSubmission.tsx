import parse from "html-react-parser";
import { Chart } from "react-google-charts";
import { TagCloud } from "react-tagcloud";
import useSWR from "swr";
import { convertDate, makeHTMLFromString } from "../utils/helpers";
import ShowAlert from "./ShowAlert";
import { useSearchParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';


interface Entry {
  value: string;
  count: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useSummary(id: number) {
  const summaryEndPoint = `https://jianliew.me/reddit-store/api/summary/${id}.json`;

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
  const submissionEndPoint = `https://jianliew.me/reddit-store/api/submissions/${id}.json`;

  const { data, error, isLoading } = useSWR(submissionEndPoint, fetcher);

  return {
    submission: data,
    isLoading,
    isError: error,
  };
}

export default function ViewSubmission({ id }: Index) {

  const location = useLocation()

  const submissionId = Number(location["pathname"].split("/")[3]) || id;

  const { submission, isLoading, isError } = useSubmission(submissionId);

  const { summary, wordFrequency, isSummaryLoading, isSummaryError } =
    useSummary(submissionId);

  if (isLoading)
    return (
      <div>
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  if (isError || isSummaryError) {
    return <ShowAlert />;
  }

  if (isSummaryLoading)
    return (
      <div>
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  const selfText = makeHTMLFromString(submission?.selftext);

  const options = {
    luminosity: "dark",
    hue: "blue",
  };

  const SimpleCloud = () => {
    return (
      <TagCloud
        minSize={30}
        maxSize={60}
        tags={wordFrequency}
        colorOptions={options}
      />
    );
  };

  const PieChart = (summary: any) => {
    const data = [
      ["Category", "Counts"],
      ["Not the asshole", summary?.counts?.nta_count],
      ["You are the asshole", summary?.counts?.yta_count],
      ["Everyone Sucks Here", summary?.counts?.esh_count],
      ["Not Enough Information", summary?.counts?.info_count],
      ["No assholes here", summary?.counts?.nah_count],
    ];

    const options = {
      legend: { position: "bottom" },
      is3D: true,
      colors: [
        "green",
        "red",
        "rgb(255, 205, 86)",
        "rgb(201, 203, 207)",
        "rgb(54, 162, 235)",
      ],
      // pieSliceText: "label"
    };

    return (
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"100%"}
        height={"500px"}
      />
    );
  };

  const EmotionTable = (summary: any) => {
    return (
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Emotion</th>
            <th className="text-center">Raw Emotion Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Positive</td>
            <td>{summary?.emotion.positive}</td>
          </tr>
          <tr>
            <td>Trust</td>
            <td>{summary?.emotion.trust}</td>
          </tr>
          <tr>
            <td>Anger</td>
            <td>{summary?.emotion.anger}</td>
          </tr>
          <tr>
            <td>Disgust</td>
            <td>{summary?.emotion.disgust}</td>
          </tr>
          <tr>
            <td>Negative</td>
            <td>{summary?.emotion.negative}</td>
          </tr>
          <tr>
            <td>Joy</td>
            <td>{summary?.emotion.joy}</td>
          </tr>
          <tr>
            <td>Anticipation</td>
            <td>{summary?.emotion.anticipation}</td>
          </tr>
          <tr>
            <td>Sadness</td>
            <td>{summary?.emotion.sadness}</td>
          </tr>
          <tr>
            <td>Surprise</td>
            <td>{summary?.emotion.surprise}</td>
          </tr>
          <tr>
            <td>Fear</td>
            <td>{summary?.emotion.fear}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div key={submission?.id}>
      <div className="card mb-2 bg-base-100 shadow-xl p-2">
        <div className="card-body">
          <h2 className="card-title">{submission?.title}</h2>
          <small>{convertDate(submission?.created_utc)}</small>
          <div className="">{parse(selfText)}</div>
          <p>
            View original post{" "}
            <a href={"https://reddit.com" + submission?.permalink}>here</a>
          </p>

          <p>
            Number of replies: <strong>{submission?.replies.length}</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3">
            <div>
              <h3 className="text-center">Generated Word Cloud</h3>
              {<SimpleCloud />}
            </div>
            <div className="">
              <h3 className="text-center">
                Results of NRC Emotion Lexicon Analysis
              </h3>
              <EmotionTable {...summary} />
            </div>

            <div className="">
              <h3 className="text-center">Breakdown of Replies</h3>
              <PieChart {...summary} />
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
