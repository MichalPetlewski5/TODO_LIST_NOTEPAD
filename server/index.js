require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jsonServer = require("json-server");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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


app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const db = JSON.parse(fs.readFileSync(dbFile));
    const userExists = db.users.find(u => u.email === email);

    if (userExists) {
        return res.status(400).json({ message : "Email is already registred" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), name, email, password: hashed };

    db.users.push(newUser);
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));

    res.json({ message: "User registered" });
});

app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    const db = JSON.parse(fs.readFileSync(dbFile));
    const user = db.users.find(u => u.email === email);

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" })

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
        expiresIn: "2h"
    });

    res.json({ token });
});
// hashing already existing passwords in db
const db = JSON.parse(fs.readFileSync("db.json"));

(async () => {
  for (let u of db.users) {
    if (!u.password.startsWith("$2a$")) {
      u.password = await bcrypt.hash(u.password, 10);
    }
  }
  fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
})();


app.get("/api/todos", auth, (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbFile));
    const todos = db.todos.filter(t => t.userId === req.user.id);
    res.json(todos);
});

app.post("/api/todos", auth, (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbFile));

    const newTodo = {
        id: Date.now(),
        userId: req.user.id,
        text: req.body.text,
        done: false
    };

    db.todos.push(newTodo);
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));

    res.json(newTodo);
});

app.get("/api/accounts", auth, (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbFile));
    const user = db.users.find(u => u.id === req.user.id)

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ id: user.id, email: user.email })
})
app.use("/api", auth, router);
module.exports = { app, router };

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => 
    console.log(`API is runnin' at http://localhost:${PORT}`)
);


