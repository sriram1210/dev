
const express = require("express");

const app = express();
app.use(express.json());

let tasks = [
    { id: 1, title: "Learn Git", completed: false },
    { id: 2, title: "Learn Docker", completed: false }
];

// GET - Retrieve all tasks
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// GET - Retrieve task by ID
app.get("/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id === Number(req.params.id));

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
});

// POST - Create a new task
app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "Valid title required" });
    }

    const task = {
        id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        title: title.trim(),
        completed: false
    };

    tasks.push(task);
    res.status(201).json(task);
});

// PATCH - Update a task
app.patch("/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id === Number(req.params.id));

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    if (req.body.title !== undefined) {
        if (typeof req.body.title !== "string" || !req.body.title.trim()) {
            return res.status(400).json({ message: "Invalid title" });
        }
        task.title = req.body.title.trim();
    }

    if (req.body.completed !== undefined) {
        if (typeof req.body.completed !== "boolean") {
            return res.status(400).json({ message: "Invalid completed value" });
        }
        task.completed = req.body.completed;
    }

    res.json(task);
});

// DELETE - Delete a task
app.delete("/tasks/:id", (req, res) => {
    const index = tasks.findIndex(t => t.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ message: "Task not found" });
    }

    tasks.splice(index, 1);
    res.json({ message: "Task deleted success" });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
