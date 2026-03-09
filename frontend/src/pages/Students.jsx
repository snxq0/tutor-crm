import { useEffect, useState } from "react";
import api from "../services/api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    grade: "",
    price: "",
    miroLink: ""
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const res = await api.get("/students");
    setStudents(res.data);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      name: "",
      grade: "",
      price: "",
      miroLink: ""
    });
    setModalOpen(true);
  };

  const openEdit = (student) => {
    setEditingId(student.id);
    setForm({
      name: student.name,
      grade: student.grade,
      price: student.price,
      miroLink: student.miroLink || ""
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await api.patch(`/students/${editingId}`, form);
    } else {
      await api.post("/students", form);
    }

    setModalOpen(false);
    loadStudents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    await api.delete(`/students/${id}`);
    loadStudents();
  };

  return (
    <div className="max-w-6xl mx-auto">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Students</h2>

        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
        >
          + Add Student
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-800 rounded-xl overflow-hidden">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Miro</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-t border-gray-800">

                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.grade}</td>
                <td className="p-3">{s.price}€</td>

                <td className="p-3">
                  {s.miroLink ? (
                    <a
                      href={s.miroLink}
                      target="_blank"
                      className="text-blue-400 underline"
                    >
                      Open
                    </a>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() => openEdit(s)}
                    className="bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md border border-gray-800">

            <h3 className="text-xl mb-6">
              {editingId ? "Edit Student" : "Add Student"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full bg-gray-800 p-3 rounded-lg"
              />

              <input
                placeholder="Class"
                value={form.grade}
                onChange={(e) =>
                  setForm({ ...form, grade: e.target.value })
                }
                className="w-full bg-gray-800 p-3 rounded-lg"
              />

              <input
                type="number"
                placeholder="Price per lesson"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="w-full bg-gray-800 p-3 rounded-lg"
              />

              <input
                placeholder="Miro link"
                value={form.miroLink}
                onChange={(e) =>
                  setForm({ ...form, miroLink: e.target.value })
                }
                className="w-full bg-gray-800 p-3 rounded-lg"
              />

              <div className="flex justify-end gap-4 pt-4">

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
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