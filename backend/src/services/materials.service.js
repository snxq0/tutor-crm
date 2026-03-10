const { readData, writeData } = require("../utils/fileStorage");
const { generateId } = require("../utils/idGenerator");

const FILE = "materials.json";

function getAll(studentId) {
  const materials = readData(FILE);

  if (!studentId) return materials;

  return materials.filter(m => m.studentId === studentId);
}

function create(data) {
  const materials = readData(FILE);

  const newMaterial = {
    id: generateId("mt"),
    name: data.name,
    subject: data.subject || "",
    link: data.link,
    studentId: data.studentId || null
  };

  materials.push(newMaterial);
  writeData(FILE, materials);

  return newMaterial;
}

function update(id, data) {
  const materials = readData(FILE);
  const index = materials.findIndex(m => m.id === id);

  if (index === -1) return null;

  materials[index] = {
    ...materials[index],
    name: data.name ?? materials[index].name,
    subject: data.subject ?? materials[index].subject,
    link: data.link ?? materials[index].link,
    studentId: data.studentId ?? materials[index].studentId
  };

  writeData(FILE, materials);

  return materials[index];
}

function remove(id) {
  const materials = readData(FILE);
  const filtered = materials.filter(m => m.id !== id);
  writeData(FILE, filtered);
}

module.exports = {
  getAll,
  create,
  update,
  remove
};