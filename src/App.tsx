import { BrowserRouter, Routes, Route } from "react-router-dom";
import Room from "./pages/Room";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}