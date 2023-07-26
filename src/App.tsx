import { Navigate, Route, Routes, HashRouter  } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SearchSubmission from "./components/SearchSubmission";
import ViewSubmissions from "./components/ViewSubmissions";
import About from "./components/About";
import ViewSubmission from "./components/ViewSubmission";
import ViewTop from "./components/ViewTop";
import Random from "./components/Random";

function App() {
  return (
    <div>
      <div className="">
        <HashRouter>
          <Navbar />
          <div className="container h-screen mx-auto">
            <Routes>
              <Route path="/" element={<ViewSubmissions />} />
              <Route path="/search" element={<SearchSubmission />} />
              <Route path="/top" element={<ViewTop />} />
              <Route path="/random" element={<Random />} />
              <Route path="/about" element={<About />} />
              <Route path="/submission/:id" element={<ViewSubmission id={0} created_utc={0} score={0} />} />
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
