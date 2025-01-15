const fs = require("fs");

const express = require("express");
const app = express();
const PORT = 8001;

const users = require("./MOCK_DATA.json");

// Middleware
app.use(express.urlencoded({ extended: false }));

// this Middleware(made by us) first do entry in log file then call the next() function
app.use((req, res, next) => {
    fs.appendFile("./log.txt", `${Date.now()} : ${req.ip} : ${req.method} : ${req.path}\n`, (err, data) => {
        next();
    });
});

/*************************Routes*************************/
app.get("/", (req, res) => {
    return res.end("This is Homepage");
});


// listing all users
app.get("/api/users", (req, res) => {
    return res.json(users);
});


// listing users with id
app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id); // getting the id and changeing it to int value
    const userWithId = users.find(user => user.id === id); // getting the user whose user.id is equal to id
    if(!userWithId){
        res.status(404).json({ERROR : "User Not Found"});
    }

    return res.json(userWithId);
});


// create New user
app.post("/api/users", (req, res) => {
    const body = req.body; // whatever data sent by front-end is avalible in req.body

    if (!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title) {
        res.status(400).json({ msg: 'All Field Required' });
    }

    const newItem = {
        id: users.length + 1,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        gender: body.gender,
        job_title: body.job_title
    };
    users.push(newItem);
    /*********************also writing it in MOCK_DATA.json file*********************/
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("successfully written in file");
        }
    });
    /*********************************************************************/
    return res.status(201).json({ status: "Success", id: users.length });
});


// update a user with id
app.put("/api/users/:id", (req, res) => {
    const id = Number(req.params.id); // getting the id and changeing it to int value
    const userWithId = users.find(user => user.id === id); // getting the user whose user.id is equal to id
    const body = req.body; // whatever data sent by front-end(i.e client) is avalible in req.body

    const updatedItem = {
        id: userWithId.id,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        gender: body.gender,
        job_title: body.job_title
    };

    const targetIndx = users.findIndex(user => user.id === id); // finding index of the data with the help of retrived id.
    users.splice(targetIndx, 1, updatedItem); /* the splice function's parameters are :
                                                 targetIndx : The zero-based location in the array from which to start removing elements 
                                                 1 : The number of elements to remove.
                                                 updatedItem : Elements to insert into the array in place of the deleted elements.
                                                 returns An array containing the elements that were deleted. */
    /*********************also updteing it in MOCK_DATA.json file*********************/
    // writing back to file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("successfully written in file");
        }
    });
    /*********************************************************************/
    return res.json({ status: "Successfully Updated", id: id });
});


// partially update a user with id
app.patch("/api/users/:id", (req, res) => {
    const id = Number(req.params.id); // getting the id and changeing it to int value

    const userWithId = users.find(user => user.id === id); // getting the user whose user.id is equal to id
    const body = req.body; // whatever data sent by front-end(i.e client) is avalible in req.body

    if (body.job_title) {
        userWithId.job_title = body.job_title;
    }
    if (body.email) {
        userWithId.email = body.email;
    }
    /*********************also updteing it in MOCK_DATA.json file*********************/
    // writing back to file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("successfully written in file");
        }
    });
    /*********************************************************************/
    return res.json({ status: "Successfully Updated", id: id });
});


// delete a user with id
app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id); // getting the id and changeing it to int value

    const userWithId = users.find(user => user.id === id); // getting the user whose user.id is equal to id

    const targetIndx = users.findIndex(user => user.id === id); // finding index of the data with the help of retrived id.

    users.splice(targetIndx, 1);

    // Update the IDs of the remaining users that come after the deleted user
    for (let i = targetIndx; i < users.length; i++) {
        users[i].id -= 1;
    }

    /*********************also updteing it in MOCK_DATA.json file*********************/
    // writing back to file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("successfully written in file");
        }
    });
    /*********************************************************************/

    return res.json({ status: "Deleted sucessfully", firstName: userWithId.first_name, lastName: userWithId.last_name });
});
/***************************************************************************/

app.listen(PORT, () => console.log(`server listening at PORT : ${PORT}`));
