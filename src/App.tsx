import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import About from "./pages/About";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Random from "./components/Random";
import SearchSubmission from "./pages/SearchSubmission";
import { ViewSubmission } from "./components/ViewSubmission";
import ViewSubmissions from "./components/ViewSubmissions";
import ViewTop from "./components/ViewTop";

function App() {
  return (
    <div>
      <div className="">
        <HashRouter>
          <Navbar />
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<ViewSubmissions />} />
              <Route path="/search" element={<SearchSubmission />} />
              <Route path="/top" element={<ViewTop />} />
              <Route path="/random" element={<Random />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/submission/:id"
                element={<ViewSubmission id={0} submission_id={""} title={""} selftext={""} created_utc={0} permalink={""} score={0} replies={[]} />}
              />
              <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          <Footer />
        </HashRouter>
      </div>
    </div>
  );
}

export default App;
