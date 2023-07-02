"use client";

import Introduction from "./components/Introduction";
import ViewSubmissions from "./components/ViewSubmissions";

export default function Home() {
  return (
    <div>
      <main>
        <Introduction />
        <ViewSubmissions />
      </main>
    </div>
  );
}
