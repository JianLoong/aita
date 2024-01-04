export const EmotionTable = (summary) => {
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
            <td>{summary?.emotion?.positive}</td>
          </tr>
          <tr>
            <td>Trust</td>
            <td>{summary?.emotion?.trust}</td>
          </tr>
          <tr>
            <td>Anger</td>
            <td>{summary?.emotion?.anger}</td>
          </tr>
          <tr>
            <td>Disgust</td>
            <td>{summary?.emotion?.disgust}</td>
          </tr>
          <tr>
            <td>Negative</td>
            <td>{summary?.emotion?.negative}</td>
          </tr>
          <tr>
            <td>Joy</td>
            <td>{summary?.emotion?.joy}</td>
          </tr>
          <tr>
            <td>Anticipation</td>
            <td>{summary?.emotion?.anticipation}</td>
          </tr>
          <tr>
            <td>Sadness</td>
            <td>{summary?.emotion?.sadness}</td>
          </tr>
          <tr>
            <td>Surprise</td>
            <td>{summary?.emotion?.surprise}</td>
          </tr>
          <tr>
            <td>Fear</td>
            <td>{summary?.emotion?.fear}</td>
          </tr>
        </tbody>
      </table>
    );
  };
