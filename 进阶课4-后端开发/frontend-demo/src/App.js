import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import LoginForm from "./pages/login/index";
import Task from "./pages/task/index";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />}></Route>
      <Route path="/task" element={<Task />}></Route>
    </Routes>
  );
}

export default App;
