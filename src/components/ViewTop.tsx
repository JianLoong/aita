import queryString from "query-string";
import { useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import useSWR from "swr";
import { normaliseDate } from "../utils/helpers";
import ViewSubmission from "./ViewSubmission";
import { Top } from "../types/top";
import { Index } from "../types/index";

import ShowAlert from "./ShowAlert";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function processSubmissions(tops: Top[]): Index[] {
  let maxNTA = tops[0]?.nta;
  let maxYTA = tops[0]?.yta;

  let maxINFO = tops[0]?.info;
  let maxNAH = tops[0]?.nah;

  let maxESH = tops[0]?.esh;

  let maxNTAId = tops[0]?.id;
  let maxYTAId = tops[0]?.id;

  let maxINFOId = tops[0]?.id;
  let maxNAHId = tops[0]?.id;
  let maxESHId = tops[0]?.id;

  const sorted: Index[] = [];

  for (const top of tops) {
    if (top.nta > maxNTA) {
      maxNTA = top.nta;
      maxNTAId = top.id;
    }

    if (top.yta > maxYTA) {
      maxYTA = top.yta;
      maxYTAId = top.id;
    }

    if (top.nah > maxNAH) {
      maxNAH = top.nah;
      maxNAHId = top.id;
    }

    if (top.info > maxINFO) {
      maxINFO = top.info;
      maxINFOId = top.id;
    }

    if (top.esh > maxESH) {
      maxESH = top.esh;
      maxESHId = top.id;
    }
  }

  sorted.push({
    id: maxYTAId,
    created_utc: 0,
    score: 0,
  });

  sorted.push({
    id: maxNTAId,
    created_utc: 0,
    score: 0,
  });

  sorted.push({
    id: maxNAHId,
    created_utc: 0,
    score: 0,
  });

  sorted.push({
    id: maxINFOId,
    created_utc: 0,
    score: 0,
  });

  sorted.push({
    id: maxESHId,
    created_utc: 0,
    score: 0,
  });

  return sorted;
}

function useIndexes() {
  const indexesEndPoint = "https://jian.sh/reddit-store/api/top/top.json";

  const { data, error, isLoading } = useSWR(indexesEndPoint, fetcher);

  return {
    tops: data as Top[],
    isLoading,
    isError: error,
  };
}

function useSubmission(
  tops: Top[],
  selectedMonth: number,
  selectedYear: number
) {
  if (tops === undefined)
    return {
      submissions: [],
    };

  const selectedSubmissions = [];

  for (const top of tops) {
    const normalisedDate = normaliseDate(top?.created_utc);
    top["year"] = Number(normalisedDate[0]);
    top["month"] = Number(normalisedDate[1]);

    if (selectedMonth == top["month"] && selectedYear == top["year"])
      selectedSubmissions.push(top);

    if (selectedMonth == 12) {
      selectedSubmissions.push(top);
    }
  }

  // Get top post here
  if (selectedSubmissions.length == 0) {
    return {
      submissions: [],
    };
  }

  const results = processSubmissions(selectedSubmissions);

  const submissions = [];

  submissions.push(
    <strong key={Math.random()}>
      <ShowAlert payload={"Highest number of YTA"} type={"error"}></ShowAlert>
    </strong>
  );
  submissions.push(<ViewSubmission {...results[0]} key={results[0]?.id} />);

  submissions.push(
    <strong key={Math.random()}>
      <ShowAlert payload={"Highest number of NTA"} type={"success"}></ShowAlert>
    </strong>
  );
  submissions.push(<ViewSubmission {...results[1]} key={results[1]?.id} />);

  submissions.push(
    <strong key={Math.random()}>
      <ShowAlert payload={"Highest number of NAH"} type={"warning"}></ShowAlert>
    </strong>
  );
  submissions.push(<ViewSubmission {...results[2]} key={results[2]?.id} />);

  submissions.push(
    <strong key={Math.random()}>
      <ShowAlert payload={"Highest number of INFO"} type={"info"}></ShowAlert>
    </strong>
  );
  submissions.push(<ViewSubmission {...results[3]} key={results[3]?.id} />);

  submissions.push(
    <strong key={Math.random()}>
      <ShowAlert payload={"Highest Number of ESH"} type={"base"}></ShowAlert>
    </strong>
  );

  submissions.push(<ViewSubmission {...results[4]} key={results[4]?.id} />);

  return {
    submissions: submissions,
  };
}

// https://stackoverflow.com/questions/76400197/react-update-url-anchor-when-scrolling-to-a-section-with-this-anchor
export default function ViewTop() {
  // Search params to be used for input

  const [searchParams, setSearchParams] = useSearchParams("");

  const location = useLocation();

  if (location["hash"] !== undefined) {
    const scrollTo = location["hash"].toString().slice(1);

    const element = document.getElementById(scrollTo);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  const month = searchParams.get("month") || new Date().getMonth();
  const year = searchParams.get("year") || new Date().getFullYear();

  const { tops, isLoading, isError } = useIndexes();

  const [selectedMonth, setMonth] = useState<number>(Number(month));
  const [selectedYear, setYear] = useState<number>(Number(year));

  const { submissions } = useSubmission(tops, selectedMonth, selectedYear);

  if (isLoading)
    return (
      <div className="p-2">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  if (isError) {
    return (
      <ShowAlert
        payload={"Please try again later, there has been an error"}
        type={"error"}
      />
    );
  }

  return (
    <div className="pt-6 p-2" key={Math.random()}>
      <article className="mx-auto">
        The following are the highest rated submission for each month.
      </article>
      <form method="GET">
        <div className="pb-6 grid grid-cols-1 md:grid-cols-2">
          <div className="p-2">
            <label className="label">
              <span className="label-text">Month</span>
            </label>
            <select
              className="input input-bordered input-primary w-full"
              aria-label="Number of post"
              name="month"
              value={selectedMonth}
              onChange={(e) => {
                e.preventDefault();

                const month: number = parseInt(e.target.value);
                setMonth(month);

                const currentQuery = {
                  month: month,
                  year: selectedYear,
                };

                const stringified = queryString.stringify(currentQuery);
                setSearchParams(stringified);
                e.stopPropagation();
              }}
            >
              <option value="0">Jan</option>
              <option value="1">Feb</option>
              <option value="2">March</option>
              <option value="3">April</option>
              <option value="4">May</option>
              <option value="5">Jun</option>
              <option value="6">July</option>
              <option value="7">August</option>
              <option value="8">Sep</option>
              <option value="9">October</option>
              <option value="10">November</option>
              <option value="11">December</option>
              <option value="12">All time</option>
            </select>
          </div>

          <div className="p-2">
            <label className="label">
              <span className="label-text">Year</span>
            </label>
            <select
              value={selectedYear}
              className="input input-bordered input-primary w-full"
              aria-label="Number of post"
              id="year"
              onChange={(e) => {
                setYear(Number(e.target.value));

                const currentQuery = {
                  month: selectedMonth,
                  year: e.target.value,
                };

                const stringified = queryString.stringify(currentQuery);
                setSearchParams(stringified);
                e.stopPropagation();
              }}
            >
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>
      </form>
      {submissions.length === 0 ? (
        <ShowAlert
          payload={"The data collection start date was November 2022"}
          type={"warning"}
        />
      ) : (
        submissions
      )}
    </div>
  );
}
