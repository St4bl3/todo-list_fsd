const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Create a new task
app.post("/tasks", async (req, res) => {
  const { title } = req.body;
  const task = await prisma.task.create({ data: { title } });
  res.json(task);
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const task = await prisma.task.update({
    where: { id },
    data: { completed },
  });
  res.json(task);
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({ where: { id } });
  res.json({ message: "Task deleted" });
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});