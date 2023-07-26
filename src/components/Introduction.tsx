"use client";

export default function Introduction() {
  return (
    <div className="p-2">
      <p>
        This site periodically obtains data from Reddit and shows a summary of
        each post on the subreddit IATA.
      </p>
      <br />
      <p>
        It currently has over 23,000 submissions and over 6.9 million top level
        comments with a total size of 2.7 GB in SQLite format.
      </p>
      <br />
      <p>
        The collection start date is approximately 1st November 2022 until the
        present.
      </p>
    </div>
  );
}
