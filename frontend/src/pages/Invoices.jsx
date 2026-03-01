import { useEffect, useState } from "react";
import api from "../services/api";

export default function Invoices() {
  const [students, setStudents] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [month, setMonth] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const studentsRes = await api.get("/students");
    const invoicesRes = await api.get("/invoices");

    setStudents(studentsRes.data);
    setInvoices(invoicesRes.data);
  };

  const generateInvoice = async () => {
    if (!studentId || !month) {
      alert("Select student and month");
      return;
    }

    try {
      await api.post("/invoices/generate", {
        studentId,
        yearMonth: month
      });

      const invoicesRes = await api.get("/invoices");
      setInvoices(invoicesRes.data);

      setStudentId("");
      setMonth("");
    } catch (err) {
      console.error(err);
      alert("Error generating invoice");
    }
  };

  const markAsPaid = async (id) => {
    await api.patch(`/invoices/${id}/pay`);
    const invoicesRes = await api.get("/invoices");
    setInvoices(invoicesRes.data);
  };

  const getStudentName = (id) => {
    return students.find(s => s.id === id)?.name || "—";
  };

  return (
    <div className="max-w-6xl mx-auto">

      <h2 className="text-2xl font-semibold mb-6">Invoices</h2>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8">

        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="bg-gray-800 p-3 rounded-lg"
        >
          <option value="">Select student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-gray-800 p-3 rounded-lg"
        />

        <button
          onClick={generateInvoice}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
        >
          Generate
        </button>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-800 rounded-xl overflow-hidden">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Period</th>
              <th className="p-3 text-left">Lessons</th>
              <th className="p-3 text-left">Total (€)</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t border-gray-800">
                <td className="p-3">{getStudentName(inv.studentId)}</td>
                <td className="p-3">{inv.period}</td>
                <td className="p-3">{inv.lessonsCount}</td>
                <td className="p-3 font-semibold">{inv.total}</td>

                <td className="p-3 space-x-2">

                  {inv.status === "paid" ? (
                    <span className="bg-green-600 px-2 py-1 rounded text-sm">
                      Paid
                    </span>
                  ) : (
                    <button
                      onClick={() => markAsPaid(inv.id)}
                      className="bg-yellow-600 hover:bg-yellow-500 px-2 py-1 rounded text-sm"
                    >
                      Mark as Paid
                    </button>
                  )}

                  <a
                    href={`http://localhost:3000/invoices/${inv.id}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded text-sm"
                  >
                    PDF
                  </a>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}