import { Routes, Route } from "react-router-dom";
import LoginForm from "./pages/login/index";
import MainpageApp from "./pages/mainpage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />}></Route>
      <Route path="/page" element={<MainpageApp />}></Route>
    </Routes>
  );
}

export default App;
