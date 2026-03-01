const service = require('../services/students.service');

function getAll(req, res) {
  res.json(service.getAll());
}

function getOne(req, res) {
  const student = service.getById(req.params.id);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.json(student);
}

function create(req, res) {
  const student = service.create(req.body);
  res.status(201).json(student);
}

function update(req, res) {
  const updated = service.update(req.params.id, req.body);

  if (!updated) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.json(updated);
}

function remove(req, res) {
  service.remove(req.params.id);
  res.json({ message: 'Deleted' });
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove
};