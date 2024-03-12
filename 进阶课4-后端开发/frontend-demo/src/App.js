import { Routes, Route } from "react-router-dom";
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
