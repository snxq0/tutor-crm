import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Students from "./pages/Students";
import Lessons from "./pages/Lessons";
import Invoices from "./pages/Invoices";



function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Students />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/invoices" element={<Invoices />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;