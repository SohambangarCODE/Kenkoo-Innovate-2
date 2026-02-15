import React from "react";
import Navbar from "./Components/Navbar";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import FooterForAssistance from "./Components/FooterForAssistance";
import Records from "./Pages/Records";
import Insights from "./Pages/Insights";
import CarePlan from "./Pages/CarePlan";
import ContactPage from "./Pages/ContactPage";
import Profile from "./Pages/Profile";
import Assistant from "./Pages/Assistant";

const App = () => {
  return (
    <>
      <Navbar />

      <div className="App min-h-screen">
        <Routes>
          <Route path="/" element={<Assistant />} />
          <Route path="/Records" element={<Records />} />
          <Route path="/Insights" element={<Insights />} />
          <Route path="/careplan" element={<CarePlan />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>

      {/* <Footer/> */}
      {/* <FooterForAssistance /> */}
    </>
  );
};

export default App;
