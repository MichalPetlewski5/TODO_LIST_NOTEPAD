require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jsonServer = require("json-server");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const dbFile = path.join(__dirname, "db.json"); 

const router = jsonServer.router(dbFile);
const middlewares = jsonServer.defaults();
app.use(middlewares);

const SECRET = process.env.JWT_SECRET || "supersecretkey123";

function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token" });

    const token = header.split(" ")[1];

    try{
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch{
        res.status(401).json({ message: "Invalid token" });
    }
}


app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body;

    const db = JSON.parse(fs.readFileSync(dbFile));
    const userExists = db.accounts.find(u => u.email === email);

    if (userExists) {
        return res.status(400).json({ message : "Email is already registred" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), name, email, password: hashed };

    db.accounts.push(newUser);
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));

    res.json({ message: "User registered" });
});

app.post("/api/login", async (req, res) => {
    const {email, password} = req.body;

    const db = JSON.parse(fs.readFileSync(dbFile));
    const user = db.accounts.find(u => u.email === email);

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" })

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
        expiresIn: "2h"
    });

    res.json({ token });
});



app.get("/api/todos", auth, (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbFile));
    // Support both old structure (accountID) and new structure (userId)
    const todos = db.todos.filter(t => 
        (t.accountID && t.accountID.toString() === req.user.id.toString()) ||
        (t.userId && t.userId.toString() === req.user.id.toString())
    );
    res.json(todos);
});

app.post("/api/todos", auth, (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbFile));

    const newTodo = {
        id: Date.now().toString(),
        content: req.body.content || req.body.text || "",
        priority: req.body.priority !== undefined ? req.body.priority : 0,
        date: req.body.date || new Date().toJSON().slice(0, 10),
        status: req.body.status || "TODO",
        accountID: req.user.id.toString()
    };

    db.todos.push(newTodo);
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));

    res.json(newTodo);
});

app.put("/api/todos/:id", auth, (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbFile));
    const todoId = req.params.id;
    const todo = db.todos.find(t => t.id.toString() === todoId.toString());
    
    if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
    }

    // Check if user owns this todo
    const userOwnsTodo = (todo.accountID && todo.accountID.toString() === req.user.id.toString()) ||
                         (todo.userId && todo.userId.toString() === req.user.id.toString());
    
    if (!userOwnsTodo) {
        return res.status(403).json({ message: "Forbidden" });
    }

    // Update todo with new data
    Object.assign(todo, req.body);
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));

    res.json(todo);
});

app.delete("/api/todos/:id", auth, (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbFile));
    const todoId = req.params.id;
    const todoIndex = db.todos.findIndex(t => t.id.toString() === todoId.toString());
    
    if (todoIndex === -1) {
        return res.status(404).json({ message: "Todo not found" });
    }

    const todo = db.todos[todoIndex];
    // Check if user owns this todo
    const userOwnsTodo = (todo.accountID && todo.accountID.toString() === req.user.id.toString()) ||
                         (todo.userId && todo.userId.toString() === req.user.id.toString());
    
    if (!userOwnsTodo) {
        return res.status(403).json({ message: "Forbidden" });
    }

    db.todos.splice(todoIndex, 1);
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));

    res.json({ message: "Todo deleted" });
});

app.get("/api/accounts", auth, (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbFile));
    const user = db.accounts.find(u => u.id.toString() === req.user.id.toString())

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ id: user.id.toString(), name: user.name, email: user.email })
})
app.use("/api", auth, router);
module.exports = { app, router };

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => 
    console.log(`API is runnin' at http://localhost:${PORT}`)
);


