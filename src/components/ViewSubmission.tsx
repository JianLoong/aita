import parse from "html-react-parser";
import { Chart } from "react-google-charts";
import { NavLink, useLocation } from "react-router-dom";
import { TagCloud } from "react-tagcloud";
import useSWR from "swr";
import { convertDate, makeHTMLFromString } from "../utils/helpers";
import ShowAlert from "./ShowAlert";
import { Index } from "../types/index";
// import ViewToxicity from "./ViewToxicity";
import { useState } from "react";

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
  const location = useLocation();

  const submissionId = Number(location["pathname"].split("/")[2]) || id;

  const { submission, isLoading, isError } = useSubmission(submissionId);

  const [shown, setShown] = useState<boolean>(false);

  const { summary, wordFrequency, isSummaryLoading, isSummaryError } =
    useSummary(submissionId);

  const handleShow = () => {
    setShown(true);
  }

  if (isLoading)
    return (
      <div>
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  if (isError || isSummaryError) {
    return <ShowAlert payload={"Please try again later, there has been an error"} type={"error"} />
  }

  if (isSummaryLoading)
    return (
      <div>
        <span className="loading loading-dots loading-lg">Loading submission</span>
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

  const PieChart = (summary) => {
    const data = [
      ["Category", "Counts"],
      ["Not the asshole", summary?.counts?.nta_count],
      ["You are the asshole", summary?.counts?.yta_count],
      ["Everyone Sucks Here", summary?.counts?.esh_count],
      ["Not Enough Information", summary?.counts?.info_count],
      ["No assholes here", summary?.counts?.nah_count],
    ];

    // const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // console.log(darkMode);

    const options = {
      legend: { position: "bottom" },
      is3D: true,
      // backgroundColor: darkMode? "rgb(166, 173, 186)" : '',
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

  const EmotionTable = (summary) => {
    return (
      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th className="text-center">Emotion</th>
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

  // window.scrollTo(0, 0);

  const isMainPage = location["pathname"].startsWith("/submission");

  return (
    <div key={submission?.id}>
      <div id={"section" + submission?.id} className=""></div>
      <div className="card mb-2 bg-base-100 shadow-xl p-3">
        <div className="card-body">
          <h2 className="card-title">
            <strong>{submission?.title}</strong>
          </h2>
          <small>{convertDate(submission?.created_utc)}</small>

          <article className="prose max-w-none break-all">{parse(selfText)}</article>
          <p>
            View original post{" "}
            <a href={"https://reddit.com" + submission?.permalink}>here</a>
          </p>

          <button className={shown? "hidden" : "btn btn-info"} onClick={handleShow}>Show results</button>

          <p>
            Number of replies: <strong>{submission?.replies.length}</strong>
          </p>          

          <div className={shown? "grid grid-cols-1 md:grid-cols-3": "hidden" }>
            <div>
              <h3 className="text-center">
                <strong>Generated Word Cloud</strong>
              </h3>
              {<SimpleCloud />}
            </div>
            <div className="">
              <h3 className="text-center">
                <strong>Results of NRC Emotion Lexicon Analysis</strong>
              </h3>
              <EmotionTable {...summary} />
            </div>

            <div className="">
              <h3 className="text-center">
                <strong>Breakdown of Replies</strong>
              </h3>
              <PieChart className="p-2" {...summary} />
            </div>
          </div>


          {!isMainPage ? (
            <NavLink className="link" to={"/submission/" + submission?.id} key={submission?.id}>
              View in detail
            </NavLink>
          ) : (
            <div className="break-all">
              {/* <ViewToxicity sentences={submission?.selftext} /> */}
              <br />
              {submission?.replies.map((e: string) => {
                return <li key={Math.random()}>{e}</li>;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
