import { useState, useEffect } from "react";
import useSWR, { Fetcher } from "swr";
import { getCurrentDateInput, sortIndexes } from "../utils/helpers";
import ViewSubmission from "./ViewSubmission";
import ViewSummary from "./ViewSummary";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

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
  selectedSortOrder: String
) {
  let submissions = [];

  const sorted: Index[] = sortIndexes(
    indexes,
    startUTC,
    endUTC,
    selectedNoOfPost,
    selectedSortOrder
  );

  for (let index of sorted) {
    submissions.push(
      <ViewSubmission {...index} key={index?.id} />
    )
  }

  return {
    submissions: submissions,
  };
}

export default function ViewSubmissions() {
  const { indexes, isLoading, isError } = useIndexes();

  const [selectedNoOfPost, setNoOfPost] = useState<number>(5);
  const [selectedSortOrder, setSortOrder] = useState<string>("hot");
  const [selectedDate, setDate] = useState<Date>(new Date());

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
    <div className="pt-6" key={1}>
      <div className="grid grid-cols-1 md:grid-cols-3">

        <div className="">
          <label className="label">
            <span className="label-text">No of post</span>
          </label>
          <select
            className="input input-bordered input-primary w-full max-w-xs"
            aria-label="Number of post"
            onChange={(e) => {
              const noOfPost: number = parseInt(e.target.value);
              setNoOfPost(noOfPost);
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
            onChange={(date: Date) => setDate(date)}
            maxDate={new Date()}
          />
        </div>
      </div>
      {
        submissions
      }
    </div>
  );
}
