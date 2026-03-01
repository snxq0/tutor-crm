const { readData, writeData } = require('../utils/fileStorage');
const { generateId } = require('../utils/idGenerator');

const lessonsFile = 'lessons.json';
const studentsFile = 'students.json';
const invoicesFile = 'invoices.json';

function getAll() {
  return readData(invoicesFile);
}

function generateInvoice(studentId, yearMonth) {
  const lessons = readData(lessonsFile);
  const students = readData(studentsFile);
  const invoices = readData(invoicesFile);

  const student = students.find(s => s.id === studentId);
  if (!student) throw new Error('Student not found');

  const filteredLessons = lessons.filter(l =>
    l.studentId === studentId &&
    l.status === 'completed' &&
    l.date.startsWith(yearMonth)
  );

  const lessonsCount = filteredLessons.length;
  const total = lessonsCount * student.pricePerLesson;

  const newInvoice = {
    id: generateId('inv'),
    studentId,
    period: yearMonth,
    lessonsCount,
    pricePerLesson: student.pricePerLesson,
    total,
    status: 'unpaid',
    createdAt: new Date().toISOString()
  };

  invoices.push(newInvoice);
  writeData(invoicesFile, invoices);

  return newInvoice;
}

function markAsPaid(id) {
  const invoices = readData(invoicesFile);
  const index = invoices.findIndex(inv => inv.id === id);

  if (index === -1) return null;

  invoices[index].status = 'paid';
  writeData(invoicesFile, invoices);

  return invoices[index];
}

module.exports = {
  getAll,
  generateInvoice,
  markAsPaid
};