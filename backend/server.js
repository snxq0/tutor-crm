const express = require('express');
const cors = require('cors');

const studentsRoutes = require('./src/routes/students.routes');
const lessonsRoutes = require('./src/routes/lessons.routes');
const invoicesRoutes = require('./src/routes/invoices.routes'); 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/students', studentsRoutes);
app.use('/lessons', lessonsRoutes);
app.use('/invoices', invoicesRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});