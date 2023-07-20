import queryString from "query-string";
import { useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import useSWR from "swr";
import { normaliseDate } from "../utils/helpers";
import ViewSubmission from "./ViewSubmission";
import { Top } from "../types/top";
import { Submission } from "../types/submission";

import "react-datepicker/dist/react-datepicker.css";
import Introduction from "./Introduction";
import ShowAlert from "./ShowAlert";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useIndexes() {
  const indexesEndPoint =
    "https://jianliew.me/reddit-store/api/top/top.json";

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

  console.log(selectedMonth);
  console.log(selectedYear);

  for (const top of tops) {

    const normalisedDate = normaliseDate(top?.created_utc);
    top["year"] = Number(normalisedDate[0]);
    top["month"] = Number(normalisedDate[1]);

    if (selectedMonth == top["month"] && selectedYear == top["year"])
      selectedSubmissions.push(top);
  }

  console.log(selectedSubmissions);

  // Get top post here

  return {
    submissions: [],
  };
}

// https://stackoverflow.com/questions/76400197/react-update-url-anchor-when-scrolling-to-a-section-with-this-anchor
export default function ViewTop() {
  // Search params to be used for input

  const [searchParams, setSearchParams] = useSearchParams();

  // Scroll into view

  const location = useLocation();

  if (location["hash"] !== undefined) {

    const scrollTo = location["hash"].toString().slice(1);

    const element = document.getElementById(scrollTo);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const month = searchParams.get("month") || new Date().getMonth();
  const year = searchParams.get("year") || new Date().getFullYear();

  const { tops, isLoading, isError } = useIndexes();

  const [selectedMonth, setMonth] = useState<number>(Number(month));
  const [selectedYear, setYear] = useState<number>(Number(year));

  const { submissions } = useSubmission(
    tops,
    selectedMonth,
    selectedYear
  );

  if (isLoading)
    return (
      <div className="p-2">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  return (
    <div className="pt-6 p-2" key={1}>
      <article className="mx-auto">
        <Introduction />
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
              <option value="3">April</option>
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
      {
        submissions.length === 0 ? <ShowAlert payload={"There are no submissions for this criteria."} type={"warning"} /> : submissions
      }

    </div>
  );
}
