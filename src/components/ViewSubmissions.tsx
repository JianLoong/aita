import { useState } from "react";
import DatePicker from "react-datepicker";
import useSWR from "swr";
import { sortIndexes } from "../utils/helpers";
import ViewSubmission from "./ViewSubmission";
import queryString from "query-string";
import { useSearchParams } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import Introduction from "./Introduction";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useIndexes() {
  const indexesEndPoint =
    "https://jianliew.me/reddit-store/api/indexes/indexes.json";

  const { data, error, isLoading } = useSWR(indexesEndPoint, fetcher);

  return {
    indexes: data,
    isLoading,
    isError: error,
  };
}

function useSubmission(
  indexes: Index[],
  startUTC: number,
  endUTC: number,
  selectedNoOfPost: number,
  selectedSortOrder: string
) {
  const submissions = [];

  const sorted: Index[] = sortIndexes(
    indexes,
    startUTC,
    endUTC,
    selectedNoOfPost,
    selectedSortOrder
  );

  for (const index of sorted) {
    submissions.push(<ViewSubmission {...index} key={index?.id} />);
  }

  return {
    submissions: submissions,
  };
}

export default function ViewSubmissions() {
  // Search params to be used for input

  const [searchParams, setSearchParams] = useSearchParams();

  const noOfPost = searchParams.get("noOfPost") || 5;
  const sortOrder = searchParams.get("sortOrder") || "hot";
  const queryDate = new Date(Number(searchParams.get("date")));
  
  console.log(queryDate);

  
  
  const { indexes, isLoading, isError } = useIndexes();

  const [selectedNoOfPost, setNoOfPost] = useState<number>(Number(noOfPost));
  const [selectedSortOrder, setSortOrder] = useState<string>(sortOrder);
  const [selectedDate, setDate] = useState<Date>(queryDate);

  const startOfDay = new Date(selectedDate);
  const endOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  endOfDay.setHours(24, 0, 0, 0);

  const startUTC = startOfDay.getTime() / 1000;
  const endUTC = endOfDay.getTime() / 1000;

  const { submissions } = useSubmission(
    indexes,
    startUTC,
    endUTC,
    selectedNoOfPost,
    selectedSortOrder
  );

  if (isLoading)
    return (
      <div>
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  return (
    <div className="pt-6 p-2" key={1}>
      <article className="prose lg:prose-xl mx-auto">
        <Introduction />
      </article>
      <form method="GET">
        <div className="pb-6 grid grid-cols-1 md:grid-cols-3">
          <div className="">
            <label className="label">
              <span className="label-text">No of post</span>
            </label>
            <select
              className="input input-bordered input-primary w-full max-w-xs"
              aria-label="Number of post"
              name="noOfPost"
              onChange={(e) => {
                e.preventDefault();

                const noOfPost: number = parseInt(e.target.value);
                setNoOfPost(noOfPost);

                const currentQuery = {
                  noOfPost: noOfPost,
                  sortOrder: selectedSortOrder,
                  date: selectedDate.getTime(),
                };

                const stringified = queryString.stringify(currentQuery);
                console.log(stringified);
                setSearchParams(stringified);
                e.stopPropagation();
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="100">100</option>
            </select>
          </div>

          <div className="">
            <label className="label">
              <span className="label-text">Sort</span>
            </label>
            <select
              className="input input-bordered input-primary w-full max-w-xs"
              aria-label="Number of post"
              id="sortOrder"
              onChange={(e) => {
                setSortOrder(e.target.value);

                const currentQuery = {
                  noOfPost: selectedNoOfPost,
                  sortOrder: e.target.value,
                  date: selectedDate.getTime(),
                };

                const stringified = queryString.stringify(currentQuery);
                console.log(stringified);
                setSearchParams(stringified);
                e.stopPropagation();
              }}
            >
              <option value="hot">hot</option>
              <option value="newest">newest</option>
            </select>
          </div>

          <div className="">
            <label className="label">
              <span className="label-text">Date</span>
            </label>
            <DatePicker
              className="input input-bordered input-primary w-full max-w-xs"
              selected={selectedDate}
              onChange={(date: Date) => {
                setDate(date);
                const currentQuery = {
                  "noOfPost": selectedNoOfPost,
                  "sortOrder": selectedSortOrder,
                  "date": date.getTime()
                }
              
                const stringified = queryString.stringify(currentQuery);
                console.log(stringified);
                setSearchParams(stringified);
                //e.stopPropagation();
              }}
              maxDate={new Date()}
            />
          </div>
        </div>
      </form>
      {submissions}
    </div>
  );
}
