import { Routes, Route, Link } from "react-router-dom";
import Task1 from "./tasks/task1";
import Task2 from "./tasks/task2";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <nav>
              <Link to="/task1">
                <p>♨️ Task 1 "Warmup"</p>
              </Link>
              <Link to="/task2">
                <p>📖 Task 2 "API"</p>
              </Link>
            </nav>
          }
        />
        <Route path="/task1" element={<Task1 />} />
        <Route path="/task2" element={<Task2 />} />
      </Routes>
    </div>
  );
}

export default App;
