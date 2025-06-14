import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { ConnectionProvider } from "./context/ConnectionContext";

export default function App() {
  return (
    <ConnectionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ConnectionProvider>
  );
}