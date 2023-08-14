export default function About() {
  return (
    <div className="p-2 prose max-w-none">
       <h3>General Flow</h3>
      <div className="flex w-full justify-center items-center">
      <img className="" src="/about.png" title="Overview of project" alt="Overview of projet"></img>
      </div>
      <div className="">
        <h1></h1>
        <p>Technologies used for this project</p>
        <p>Back End</p>
        <ul>
          <li>
            <strong>SQLite3</strong> - Currently with over 16,000 submissions
            and over 5 million comments (1.9 GB SQLite3 file size) with earliest
            data on November 1st 2022
          </li>
          <li>
            <strong>Python Scripts</strong> - Used to data crawl Reddit API,
            Data Analysis and Sentiment Analysis via libraries. (Done by
            initially creating a simple data warehouse)
          </li>
          <li>
            <strong>End Points</strong> - The Python scripts will also create
            summary end points will be consumed by the front end.
          </li>
          <li>
            <strong>Bash</strong> - Bash Scripts and cron jobs are used to
            automate the running of these processes. (These scripts are deployed
            on my RaspberryPi) and run every 2 hours
          </li>
          <li>
            <strong>GH Pages</strong> - GH Pages are used to host these pages
            and cached with CloudFlare - (So, this is actually a static site)
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
          <li>
            <strong>Tensorflow JS</strong> - Used for toxicity analysis.
          </li>
        </ul>

        <p>
          <strong>Why not live data?</strong>
        </p>
        <p>
          The original idea of this project used live data. The old idea can be
          found <a href="https://jianliew.me/posts/2019/amitheasshole/">here</a>
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
          Click <a href="https://jianliew.me/projects">here</a> to return to
          projects page
        </p>
      </div>
      
    </div>
  );
}
