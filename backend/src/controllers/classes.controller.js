const service = require("../services/classes.service");

function getAll(req, res) {
  const { studentId } = req.query;
  res.json(service.getAll(studentId));
}

function create(req, res) {
  const classes = service.create(req.body);
  res.status(201).json(classes);
}

function update(req, res) {
  const updated = service.update(req.params.id, req.body);

  if (!updated) {
    return res.status(404).json({ message: "Material not found" });
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