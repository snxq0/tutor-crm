import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Students from "./pages/Students";
import Lessons from "./pages/Lessons";
import Invoices from "./pages/Invoices";
import Materials from "./pages/Materials";
import Classes from "./pages/Classes"



function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Students />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/classes" element={<Classes />}></Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;