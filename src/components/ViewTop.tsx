import queryString from "query-string";
import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import useSWRInfinite from 'swr/infinite';
import { ShowAlert } from "./ShowAlert";
import { ViewSubmission } from "./ViewSubmission";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useGetCounts(
  selectedMonth: string,
  selectedYear: number) {

  const keys: string[] = ["yta", "nta", "nah", "info", "esh"];
  const { data, isLoading, error } = useSWRInfinite((index) => `${import.meta.env.VITE_API_BASE_URL}/submissions/top?year=${selectedYear}&month=${selectedMonth}&type=${keys[index]}`, fetcher, {
    initialSize: keys.length,
    parallel: true,
  });


  return {
    data: data,
    isLoading: isLoading,
    isError: error
  }

}

function useSubmission(
  counts
) {
  if (counts === undefined)
    return {
      submissions: [],
    };

  if (counts.length == 0)
    return {
      submissions: []
    }

  const values = [];
  for (const s of counts) {
      if (s[0] != undefined)
        values.push(s[0]);
  }

  if (values.length == 0) {
    return {
      submissions: []
    }
  }


  const submissions = [];

  submissions.push(
    <strong key={Math.random()}>
      <ShowAlert payload={"Highest number of YTA"} type={"error"}></ShowAlert>
    </strong>
  );

  submissions.push(<ViewSubmission {...values[0]} key={values[0]?.id} />);

  submissions.push(
    <strong key="nta-alert">
      <ShowAlert payload={"Highest number of NTA"} type={"success"}></ShowAlert>
    </strong>
  );
  submissions.push(<ViewSubmission {...values[1]} key={values[1]?.id} />);

  submissions.push(
    <strong key="nah-alert">
      <ShowAlert payload={"Highest number of NAH"} type={"warning"}></ShowAlert>
    </strong>
  );
  submissions.push(<ViewSubmission {...values[2]} key={values[2]?.id} />);

  submissions.push(
    <strong key="info-alert">
      <ShowAlert payload={"Highest number of INFO"} type={"info"}></ShowAlert>
    </strong>
  );
  submissions.push(<ViewSubmission {...values[3]} key={values[3]?.id} />);

  submissions.push(
    <strong key="esh-alert">
      <ShowAlert payload={"Highest Number of ESH"} type={"base"}></ShowAlert>
    </strong>
  );

  submissions.push(<ViewSubmission {...values[4]} key={values[4]?.id} />);

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

  let month = searchParams.get("month") || new Date().toLocaleString('default', { month: 'long' });
  const year = searchParams.get("year") || new Date().getFullYear();

  // Hack for bad API call
  if (month == "June")
    month = "Jun" 


  const [selectedMonth, setMonth] = useState<string>(month);
  const [selectedYear, setYear] = useState<number>(Number(year));


  const { data, isLoading, isError } = useGetCounts(selectedMonth, selectedYear);


  const { submissions } = useSubmission(data);

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
    <div className="pt-6 p-2" key="view-top-container">
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

                const month: string = e.target.value;
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
              <option value="January">Jan</option>
              <option value="February">Feb</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">Sep</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
              <option value="allMonths">All time</option>
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
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
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
