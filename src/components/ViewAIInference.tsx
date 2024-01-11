import parse from "html-react-parser";
import { useLocation } from "react-router-dom";
import useSWR from "swr";
import { ShowAlert } from "./ShowAlert";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useInference(id: Number){
  const summaryEndPoint = `https://vmi1592589.contaboserver.net/aita/api/v2/openai-analysis/${id}`;

  const {data, error, isLoading} = useSWR(summaryEndPoint, fetcher);

  return {
    inference: data,
    isError: error,
    isLoading: isLoading
  }
}

export const ViewAIInference = (inf) => {

  
  const location = useLocation();

  const submissionId = Number(location["pathname"].split("/")[2]) || inf.id;

  const { inference, isLoading, isError } = useInference(submissionId);

  if (inference?.detail)
    return;

  if (isLoading)
    return (
      <div>
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
    <>
   
    <div key={inference?.id}>
      <div id={"section" + inference?.id} className=""></div>
      <div className="card mb-2 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">
            <strong>OpenAI Analytics</strong>
          </h2>
          <p></p>

          <article className="max-w-none" style={{whiteSpace: "pre-line"}}>{parse(inference?.text)}</article>


        </div>
      </div>
    </div>
    </>
  );
};
