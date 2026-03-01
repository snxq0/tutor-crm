import { useEffect, useState } from "react";
import api from "../services/api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    parentName: "",
    email: "",
    pricePerLesson: ""
  });

  const fetchStudents = () => {
    api.get("/students").then(res => {
      setStudents(res.data);
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/students", {
      ...form,
      pricePerLesson: Number(form.pricePerLesson)
    });

    setForm({
      name: "",
      parentName: "",
      email: "",
      pricePerLesson: ""
    });

    setIsOpen(false);
    fetchStudents();
  };

  return (
    <div className="max-w-5xl mx-auto">

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Students</h2>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition"
        >
          + Add Student
        </button>
      </div>

      {students.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-400">
          No students yet
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {students.map(student => (
            <div
              key={student.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-2">
                {student.name}
              </h3>

              <p className="text-gray-400 text-sm mb-1">
                Parent: {student.parentName}
              </p>

              <p className="text-gray-300">
                {student.pricePerLesson}€ per lesson
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md border border-gray-800">
            
            <h3 className="text-xl font-semibold mb-6">
              Add Student
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Student name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg outline-none"
                required
              />

              <input
                name="parentName"
                placeholder="Parent name"
                value={form.parentName}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg outline-none"
              />

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg outline-none"
              />

              <input
                name="pricePerLesson"
                type="number"
                placeholder="Price per lesson (€)"
                value={form.pricePerLesson}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg outline-none"
                required
              />

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}