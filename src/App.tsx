import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MiniView from "./pages/MiniView";
import { ConnectionProvider } from "./context/ConnectionContext";
import { RoomProvider } from "./context/RoomContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/mini" element={<MiniView />} />
        <Route path="/" element={
          <ConnectionProvider>
            <RoomProvider>
              <ThemeProvider>
                <Home />
              </ThemeProvider>
            </RoomProvider>
          </ConnectionProvider>
        } />
      </Routes>
    </BrowserRouter>
  );
}