import queryString from "query-string";
import { useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import useSWR from "swr";
import { ViewSubmission } from "./ViewSubmission";
import { ShowAlert } from "./ShowAlert";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function getYTA(
  selectedMonth: string,
  selectedYear: number) {

  const submissionEndPoint = `http://localhost:8000/api/v2/top?year=${selectedYear}&month=${selectedMonth}&type=yta`;

  let { data } = useSWR(submissionEndPoint, fetcher);

  return {
    yta: data,
  }

}

function getINFO(
  selectedMonth: string,
  selectedYear: number) {

  const submissionEndPoint = `http://localhost:8000/api/v2/top?year=${selectedYear}&month=${selectedMonth}&type=info`;

  let { data } = useSWR(submissionEndPoint, fetcher);

  return {
    info: data,
  }

}


function getNAH(
  selectedMonth: string,
  selectedYear: number) {

  const submissionEndPoint = `http://localhost:8000/api/v2/top?year=${selectedYear}&month=${selectedMonth}&type=nah`;

  let { data } = useSWR(submissionEndPoint, fetcher);

  return {
    nah: data,
  }

}

function getNTA(
  selectedMonth: string,
  selectedYear: number) {

  const submissionEndPoint = `http://localhost:8000/api/v2/top?year=${selectedYear}&month=${selectedMonth}&type=nta`;

  let { data } = useSWR(submissionEndPoint, fetcher);

  return {
    nta: data,
  }

}

function useSubmission(
  yta,
  nta,
  nah,
  info
) {
  if (yta === undefined || nta === undefined || nah === undefined || info === undefined)
    return {
      submissions: [],
    };

  if (yta.length == 0 || nta.length == 0 || nah.length == 0 || info.length == 0)
    return {
      submissions: []
    }

  let values = [];
  for (const s of yta) {
    values.push(s);
  }

  for (const s of nta) {
    values.push(s);
  }

  for (const s of nah) {
    values.push(s);
  }


  const submissions = [];

  submissions.push(
    <strong key={Math.random()}>
      <ShowAlert payload={"Highest number of YTA"} type={"error"}></ShowAlert>
    </strong>
  );



  submissions.push(<ViewSubmission {...values[0]} key={Math.random()} />);

  submissions.push(
    <strong key={Math.random()}>
      <ShowAlert payload={"Highest number of NTA"} type={"success"}></ShowAlert>
    </strong>
  );
  submissions.push(<ViewSubmission {...values[1]} key={Math.random()} />);

  submissions.push(
    <strong key={Math.random()}>
      <ShowAlert payload={"Highest number of NAH"} type={"warning"}></ShowAlert>
    </strong>
  );
  submissions.push(<ViewSubmission {...values[2]} key={values[2]?.id} />);

  // submissions.push(
  //   <strong key={Math.random()}>
  //     <ShowAlert payload={"Highest number of INFO"} type={"info"}></ShowAlert>
  //   </strong>
  // );
  // submissions.push(<ViewSubmission {...results[3]} key={results[3]?.id} />);

  // submissions.push(
  //   <strong key={Math.random()}>
  //     <ShowAlert payload={"Highest Number of ESH"} type={"base"}></ShowAlert>
  //   </strong>
  // );

  // submissions.push(<ViewSubmission {...results[4]} key={results[4]?.id} />);

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

  const month = searchParams.get("month") || new Date().toLocaleString('default', { month: 'long' });
  const year = searchParams.get("year") || new Date().getFullYear();


  const [selectedMonth, setMonth] = useState<string>(month);
  const [selectedYear, setYear] = useState<number>(Number(year));


  const { yta } = getYTA(selectedMonth, selectedYear);
  const { nta } = getNTA(selectedMonth, selectedYear);
  const { nah } = getNAH(selectedMonth, selectedYear);
  const { info } = getINFO(selectedMonth, selectedYear);

  const { submissions } = useSubmission(yta, nta, nah, info);

  // if (isLoading)
  //   return (
  //     <div className="p-2">
  //       <span className="loading loading-dots loading-lg"></span>
  //     </div>
  //   );

  // if (isError) {
  //   return (
  //     <ShowAlert
  //       payload={"Please try again later, there has been an error"}
  //       type={"error"}
  //     />
  //   );
  // }

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
              <option value="Jun">Jun</option>
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
