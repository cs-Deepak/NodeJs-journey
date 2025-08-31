const express = require("express");

const fs = require("fs");
const { error } = require("console");
const mongoose = require("mongoose");
const { type } = require("os");

const app = express();
const PORT = 8000;

// Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/youtube-app-1")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error", err));
//Schema

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

// Model
const User = mongoose.model("user", userSchema);

//Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  // console.log('Hello From Middleware 1');
  fs.appendFile(
    "log.txt",
    `\n${Date.now()}: ${req.ip}: ${req.method}: ${req.path}`,
    (err, data) => {
      next();
    }
  );
});

app.use((req, res, next) => {
  console.log("Hello From Middleware 2");
  next();
});

// Routes

app.get("/users", async (req, res) => {
  const allDbUsers = await User.find({});

  const html = `
    <ul>
      ${allDbUsers
        .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
        .join("")}
    </ul>
  `;
  res.send(html);
});

// REST API
app.get("/api/users", async (req, res) => {
  const allDbUsers = await User.find({});

  return res.json(allDbUsers);
});

app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(user);
});

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
  })
  .patch(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { lastname: "changed" });
    return res.json({ status: "Success" });
  })
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "Success" });
  });

app.use(express.json());

app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({
      msg: "All Fields are req...",
    });
  }

  const result = await User.create({
    firstName: body.first_name,
    lastname: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });

  return res.status(201).json({ msg: "Success" });
});

// app.patch('/api/users/:id', (req, res) =>{
//     // TODO: edit the user with the id
//    return res.json({status: "pending"});
// } )

// app.delete('/api/users/:id', (req, res) =>{
//     // TODO: Delete the user with id
//    return res.json({status: "pending"});
// } )

app.listen(PORT, () => console.log(`Server Started on Port ${PORT}....`));
