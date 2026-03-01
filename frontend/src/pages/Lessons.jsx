import { useEffect, useState } from "react";
import api from "../services/api";

const STATUS_OPTIONS = ["planned", "completed", "cancelled", "no_show"];

export default function Lessons() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [lessons, setLessons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    date: "",
    duration: 60,
    note: ""
  });

  useEffect(() => {
    api.get("/students").then(res => setStudents(res.data));
  }, []);

  useEffect(() => {
    if (!studentId) {
      setLessons([]);
      return;
    }
    loadLessons(studentId);
  }, [studentId]);

  const loadLessons = async (id) => {
    const res = await api.get(`/lessons?studentId=${id}`);
    setLessons(res.data);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ date: "", duration: 60, note: "" });
    setModalOpen(true);
  };

  const openEditModal = (lesson) => {
    setEditingId(lesson.id);
    setForm({
      date: lesson.date,
      duration: lesson.duration,
      note: lesson.note
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId || !form.date) return;

    if (editingId) {
      await api.patch(`/lessons/${editingId}`, form);
    } else {
      await api.post("/lessons", {
        ...form,
        studentId,
        status: "planned"
      });
    }

    setModalOpen(false);
    setEditingId(null);
    loadLessons(studentId);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lesson?")) return;
    await api.delete(`/lessons/${id}`);
    loadLessons(studentId);
  };

  const changeStatus = async (id, status) => {
    await api.patch(`/lessons/${id}/status`, { status });
    loadLessons(studentId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-600";
      case "cancelled":
        return "bg-yellow-600";
      case "no_show":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Lessons</h2>

        {studentId && (
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
          >
            + Add Lesson
          </button>
        )}
      </div>

      <select
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        className="mb-6 bg-gray-800 p-3 rounded-lg w-full max-w-sm"
      >
        <option value="">Select student</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {studentId && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-800 rounded-xl overflow-hidden">
            <thead className="bg-gray-900">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Note</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="border-t border-gray-800">
                  <td className="p-3">{lesson.date}</td>
                  <td className="p-3">{lesson.duration} min</td>
                  <td className="p-3">
                    <div className="flex gap-2 flex-wrap">
                      {STATUS_OPTIONS.map((status) => (
                        <button
                          key={status}
                          onClick={() => changeStatus(lesson.id, status)}
                          className={`px-2 py-1 text-xs rounded ${getStatusColor(
                            status
                          )} ${
                            lesson.status === status
                              ? "ring-2 ring-white"
                              : "opacity-60"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">{lesson.note}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => openEditModal(lesson)}
                      className="bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(lesson.id)}
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
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md border border-gray-800">
            <h3 className="text-xl mb-6">
              {editingId ? "Edit Lesson" : "Add Lesson"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                className="w-full bg-gray-800 p-3 rounded-lg"
              />

              <input
                type="number"
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: e.target.value })
                }
                className="w-full bg-gray-800 p-3 rounded-lg"
              />

              <textarea
                value={form.note}
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
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