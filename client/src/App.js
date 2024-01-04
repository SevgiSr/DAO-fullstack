import { HashRouter, Route, Routes } from "react-router-dom";

import { Home } from "./pages";
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
