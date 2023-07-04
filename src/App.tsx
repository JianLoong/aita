import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SearchSubmission from "./components/SearchSubmission";
import ViewSubmissions from "./components/ViewSubmissions";
import About from "./components/About";
import ViewSubmission from "./components/ViewSubmission";

function App() {
  return (
    <div>
      <div className="">
        <BrowserRouter>
          <Navbar />
          <div className="container h-screen mx-auto">
            <Routes>
              <Route path="/aita/" element={<ViewSubmissions />} />
              <Route path="/aita/search" element={<SearchSubmission />} />
              <Route path="/aita/about" element={<About />} />
              <Route path="/aita/submission/:id" element={<ViewSubmission id={0} created_utc={0} score={0} />} />
              <Route path="/aita/*" element={<Navigate to="/aita/" />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
