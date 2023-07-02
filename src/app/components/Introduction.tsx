import Image from "next/image";

export default function Introduction() {
  return (
    <div className="">
      <p>
        Click <a href="https://jianliew.me/projects">here</a> to return to
        projects page
      </p>
      <p>The subreddit describes itself as…</p>
      <em>
        A catharsis for the frustrated moral philosopher in all of us, and a
        place to finally find out if you were wrong in an argument that’s been
        bothering you. Tell us about any non-violent conflict you have
        experienced; give us both sides of the story, and find out if you’re
        right, or you’re the asshole. See our Best Of “Most Controversial” at
        /r/AITAFiltered!
      </em>
      <p>
        For more information please visit the project page{" "}
        <a href="http://github.com/JianLoong/reddit-store">here</a>
      </p>

      <p>
        You can also search the submissions using{" "}
        <a href="./search.html">this</a>
      </p>
    </div>
  );
}
