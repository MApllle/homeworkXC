import { BrowserRouter, Routes, Route,HashRouter } from "react-router-dom";
import Home from "./component/home/home";
import Page1 from "./component/page1/page1";
import Page2 from "./component/page2/page2";
import "./App.less";
import React from "react";
export default function App() {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
        </Routes>
      </HashRouter>
    </div>
  );
}
