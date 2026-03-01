const { readData, writeData } = require('../utils/fileStorage');
const { generateId } = require('../utils/idGenerator');

const FILE = 'students.json';

function getAll() {
  return readData(FILE);
}

function getById(id) {
  const students = readData(FILE);
  return students.find(s => s.id === id);
}

function create(data) {
  const students = readData(FILE);

  const newStudent = {
    id: generateId('st'),
    name: data.name,
    parentName: data.parentName,
    email: data.email,
    pricePerLesson: data.pricePerLesson
  };

  students.push(newStudent);
  writeData(FILE, students);

  return newStudent;
}

function update(id, data) {
  const students = readData(FILE);
  const index = students.findIndex(s => s.id === id);

  if (index === -1) return null;

  students[index] = { ...students[index], ...data };
  writeData(FILE, students);

  return students[index];
}

function remove(id) {
  const students = readData(FILE);
  const filtered = students.filter(s => s.id !== id);

  writeData(FILE, filtered);

  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};