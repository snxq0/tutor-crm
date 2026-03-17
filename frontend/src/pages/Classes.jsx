import { useEffect, useState } from "react";
import api from "../services/api";

export default function Classes() {

  const [materials, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    name: "",
    subject: "",
    link: "",
    studentId: ""
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadClasses();
    loadStudents();
  }, []);

  const loadMaterials = async () => {
    const res = await api.get("/classes");
    setClasses(res.data);
  };

  const loadStudents = async () => {
    const res = await api.get("/students");
    setStudents(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await api.patch(`/classes/${editingId}`, form);
    } else {
      await api.post("/classes", form);
    }

    setForm({
      name: "",
      subject: "",
      link: "",
      studentId: ""
    });

    setEditingId(null);
    loadMaterials();
  };

  const editClass = (m) => {
    setEditingId(m.id);

    setForm({
      name: m.name,
      subject: m.subject,
      link: m.link,
      studentId: m.studentId || ""
    });
  };

  const deleteMaterial = async (id) => {
    if (!window.confirm("Delete class?")) return;

    await api.delete(`/materials/${id}`);
    loadClass();
  };

  const getStudentName = (id) => {
    return students.find(s => s.id === id)?.name || "—";
  };

  return (
    <div className="max-w-6xl mx-auto">

      <h2 className="text-2xl font-semibold mb-6">
        Classes
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-4 gap-4 mb-8"
      >

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="bg-gray-800 p-3 rounded"
        />

        <input
          placeholder="Subject"
          value={form.subject}
          onChange={(e) =>
            setForm({ ...form, subject: e.target.value })
          }
          className="bg-gray-800 p-3 rounded"
        />

        <input
          placeholder="Link"
          value={form.link}
          onChange={(e) =>
            setForm({ ...form, link: e.target.value })
          }
          className="bg-gray-800 p-3 rounded"
        />

        <select
          value={form.studentId}
          onChange={(e) =>
            setForm({ ...form, studentId: e.target.value })
          }
          className="bg-gray-800 p-3 rounded"
        >
          <option value="">General</option>

          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <button
          className="col-span-4 bg-blue-600 hover:bg-blue-500 p-3 rounded"
        >
          {editingId ? "Update Class" : "Add Class"}
        </button>

      </form>

      <table className="w-full border border-gray-800 rounded-xl overflow-hidden">

        <thead className="bg-gray-900">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Subject</th>
            <th className="p-3 text-left">Student</th>
            <th className="p-3 text-left">Link</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {Classes.map(m => (
            <tr key={m.id} className="border-t border-gray-800">

              <td className="p-3">{m.name}</td>
              <td className="p-3">{m.subject}</td>
              <td className="p-3">{getStudentName(m.studentId)}</td>

              <td className="p-3">
                <a
                  href={m.link}
                  target="_blank"
                  className="text-blue-400 underline"
                >
                  Open
                </a>
              </td>

              <td className="p-3 space-x-2">

                <button
                  onClick={() => editMaterial(m)}
                  className="bg-blue-700 px-2 py-1 rounded text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteMaterial(m.id)}
                  className="bg-red-600 px-2 py-1 rounded text-sm"
                >
                  Delete
                </button>

              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}