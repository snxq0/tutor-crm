const { readData, writeData } = require("../utils/fileStorage");
const { generateId } = require("../utils/idGenerator");

const FILE = "classes.json";

function getAll(studentId){
    const classes = readData(FILE);

    if (!studentId) return classes;

    return classes.filter(c => c.studentId === studentId);
}

function create(data){
    const classes = readData(FILE);

    const newClass = {
        id: generateId("mt"),
        name: data.name,
        subject: data.subject || "",
        link: data.link,
        studentId: data.studentId || null
    }

    classes.push(newClass);
    writeData(FILE, classes);
}

function update(id, data) {
  const classes = readData(FILE);
  const index = classes.findIndex(m => m.id === id);

  if (index === -1) return null;

  classes[index] = {
    ...classes[index],
    name: data.name ?? classes[index].name,
    subject: data.subject ?? classes[index].subject,
    link: data.link ?? classes[index].link,
    studentId: data.studentId ?? classes[index].studentId
  };

  writeData(FILE, classes);

  return classes[index];
}

function remove(id) {
  const classes = readData(FILE);
  const filtered = classes.filter(m => m.id !== id);
  writeData(FILE, filtered);
}

module.exports = {
  getAll,
  create,
  update,
  remove
};