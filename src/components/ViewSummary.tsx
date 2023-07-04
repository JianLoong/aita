import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ViewSummary({ id }: Index) {
  function useSummary(id: number) {
    const summaryEndPoint = `https://jianliew.me/reddit-store/api/summary/${id}.json`;

    const { data, error, isLoading } = useSWR(summaryEndPoint, fetcher);

    return {
      summary: data,
      isLoading,
      isError: error,
    };
  }

  const { summary, isLoading, isError } = useSummary(id);

  console.log(summary);

  return (
    <div className="" key={summary?.id}>
      <p>{summary?.id}</p>
      <p>{summary?.afinn}</p>

      <table className="table-auto">
        <thead>
          <tr>
            <th>Emotion</th>
            <th>Raw Emotion Score</th>
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
    </div>
  );
}