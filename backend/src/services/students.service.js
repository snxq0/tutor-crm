const { readData, writeData } = require("../utils/fileStorage");
const { generateId } = require("../utils/idGenerator");

const FILE = "students.json";

function getAll() {
  return readData(FILE);
}

function create(data) {
  const { name, grade, price, miroLink } = data;

  if (!name) {
    throw new Error("Name is required");
  }

  const students = readData(FILE);

  const newStudent = {
    id: generateId("st"),
    name,
    grade: grade || "",
    price: Number(price) || 0,
    miroLink: miroLink || ""
  };

  students.push(newStudent);
  writeData(FILE, students);

  return newStudent;
}

function update(id, data) {
  const students = readData(FILE);
  const index = students.findIndex(s => s.id === id);

  if (index === -1) return null;

  students[index] = {
    ...students[index],
    name: data.name ?? students[index].name,
    grade: data.grade ?? students[index].grade,
    price: data.price ?? students[index].price,
    miroLink: data.miroLink ?? students[index].miroLink
  };

  writeData(FILE, students);

  return students[index];
}

function remove(id) {
  const students = readData(FILE);
  const filtered = students.filter(s => s.id !== id);
  writeData(FILE, filtered);
}

module.exports = {
  getAll,
  create,
  update,
  remove
};