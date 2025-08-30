const express = require('express');
const users = require('./MOCK_DATA.json');
const fs = require('fs');


const app = express();
const PORT = 8000;

//Middleware - Plugin
app.use(express.urlencoded({extended: false}))




// Routes

app.get('/users', (req, res) => {
  const html = `
    <ul>
      ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
  `;
  res.send(html);
});

// REST API
app.get('/api/users', (req, res) => {
    return res.json(users);
});

app.get('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);  // ✅ req.params use karo
    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
});


app
  .route("/api/users/:id")
  .get((req, res) =>{
    const id = Number(req.params.id); 
    const user = users.find((user) => user.id === id);

  })
  .patch((req, res) => {
    // edit user with the id
    return res.json({status: "pending"});
  })
  .delete((req, res) => {
    // delete user with the id
    return res.json({status: "pending"});
  })

app.use(express.json())
app.post('/api/users', (req, res) => {
    const body = req.body;

    // Add new user with auto id
    users.push({ ...body, id: users.length + 1 });

    // Save updated users list into JSON file
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ status: "error", message: err.message });
        }
        return res.json({ status: "success", user: body });
    });
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
