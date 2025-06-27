export default function About() {
  return (
    <div className="p-2 prose max-w-none">
       <h3>General Flow</h3>
      <div className="flex w-full justify-center items-center">
      </div>
      <div className="">
        <h1></h1>
        <p>Technologies used for this project</p>
        <p>Back End</p>
        <ul>
          <li>
            <strong>SQLite3</strong> - Currently with nearing 35,000 submissions
            and nearing 10 million comments (3.8 GB SQLite3 file size) with earliest
            data on November 1st 2022
          </li>
          <li>
            <strong>Python Scripts</strong> - Used to data crawl Reddit API,
            Data Analysis done using various libraries including OpenAI libraries.
          </li>
          <li>
            <strong>FastAPI</strong> - FastAPI used for RESTful API backend. 
            Link can be found <a href={`${import.meta.env.VITE_API_BASE_URL}/docs`}>here</a>
          </li>
          <li>
            <strong>GH Pages</strong> - GH Pages are used to host these pages
            and cached with CloudFlare.
          </li>
          
          <li>
            <strong>CI/CD pipeline</strong> Using GH actions to automate deploying is also done.
          </li>
          <li>
            <strong>Cron</strong> Cron job is set to run every hour to crawl Reddit and do data analytics
          </li>
        </ul>
        <p>Front End</p>
        <ul>
          <li>
            <strong>React + Vite + TypeScript</strong> Using Vite toolkit with
            React as well as TypeScript
          </li>
          <li>
            <strong>React Word Cloud</strong> - is used to generate the word cloud
          </li>
          <li>
            <strong>Daisy UI</strong> - Used to generate a responsive front end.
          </li>
          <li>
            <strong>ChartJS</strong> - Used to generate the various charts.
          </li>
        </ul>

        <p>
          <strong>Why not live data?</strong>
        </p>
        <p>
          The original idea of this project used live data. The old idea can be
          found <a href="https://jian.sh/posts/2019/amitheasshole/">here</a>
        </p>
        <p>
          It is possible to obtain live data for this current project but it was
          decided due to the number of comments and the ease of using Python
          libraries at the backend, it would be better if the architecture was
          done this way. (The backend is responsible for creating API that would
          be consumed by the front end - There is no server as the hosting is
          done via GHpages.)
        </p>

        <p>
          For more information please visit the project page{" "}
          <a href="http://github.com/JianLoong/reddit-store">here</a>
        </p>
        <p>
          Click <a href="https://jian.sh/projects">here</a> to return to
          projects page
        </p>
      </div>
      
    </div>
  );
}
