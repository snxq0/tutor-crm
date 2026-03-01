const service = require("../services/lessons.service");

function getAll(req, res) {
  const { studentId } = req.query;

  try {
    if (studentId) {
      return res.json(service.getByStudent(studentId));
    }

    res.json(service.getAll());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

function create(req, res) {
  try {
    const lesson = service.create(req.body);
    res.status(201).json(lesson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

function update(req, res) {
  const updated = service.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ message: "Lesson not found" });
  }
  res.json(updated);
}

function updateStatus(req, res) {
  try {
    const updated = service.updateStatus(
      req.params.id,
      req.body.status
    );

    if (!updated) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

function remove(req, res) {
  service.remove(req.params.id);
  res.json({ message: "Deleted" });
}

module.exports = {
  getAll,
  create,
  update,
  updateStatus,
  remove,
};