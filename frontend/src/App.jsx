import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import DetalleMeta from "./components/DetalleMeta"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/meta/:id" element={<DetalleMeta />} />
      </Routes>
    </BrowserRouter>
  )
}