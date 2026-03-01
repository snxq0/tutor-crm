const { readData, writeData } = require("../utils/fileStorage");
const { generateId } = require("../utils/idGenerator");

const FILE = "lessons.json";
const VALID_STATUSES = ["planned", "completed", "cancelled", "no_show"];

function getAll() {
  return readData(FILE);
}

function getByStudent(studentId) {
  const lessons = readData(FILE);
  return lessons
    .filter(l => l.studentId === studentId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function create(data) {
  const { studentId, date, duration, note, status } = data;

  if (!studentId || !date) {
    throw new Error("studentId and date are required");
  }

  const lessons = readData(FILE);

  const newLesson = {
    id: generateId("ls"),
    studentId,
    date,
    duration: Number(duration) || 60,
    note: note || "",
    status: VALID_STATUSES.includes(status) ? status : "planned",
  };

  lessons.push(newLesson);
  writeData(FILE, lessons);

  return newLesson;
}

function update(id, data) {
  const lessons = readData(FILE);
  const index = lessons.findIndex(l => l.id === id);

  if (index === -1) return null;

  lessons[index] = {
    ...lessons[index],
    date: data.date || lessons[index].date,
    duration: Number(data.duration) || lessons[index].duration,
    note: data.note ?? lessons[index].note,
  };

  writeData(FILE, lessons);
  return lessons[index];
}

function updateStatus(id, status) {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Invalid status");
  }

  const lessons = readData(FILE);
  const index = lessons.findIndex(l => l.id === id);
  if (index === -1) return null;

  lessons[index].status = status;
  writeData(FILE, lessons);

  return lessons[index];
}

function remove(id) {
  const lessons = readData(FILE);
  const filtered = lessons.filter(l => l.id !== id);
  writeData(FILE, filtered);
  return true;
}

module.exports = {
  getAll,
  getByStudent,
  create,
  update,
  updateStatus,
  remove,
};