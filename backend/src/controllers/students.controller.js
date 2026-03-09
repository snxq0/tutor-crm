const service = require("../services/students.service");

function getAll(req, res) {
  res.json(service.getAll());
}

function create(req, res) {
  try {
    const student = service.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

function update(req, res) {
  const updated = service.update(req.params.id, req.body);

  if (!updated) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(updated);
}

function remove(req, res) {
  service.remove(req.params.id);
  res.json({ message: "Deleted" });
}

module.exports = {
  getAll,
  create,
  update,
  remove
};