const express = require('express')
const fs = require('fs');
const { brotliCompress } = require('zlib');
const app = express()
const port = 3000
var cors = require('cors')

function readUsers() {
    let rawdata = fs.readFileSync('users.json');
    let users = JSON.parse(rawdata);
    return users
}

function writeUsers(users) {
    let data = JSON.stringify(users, null, 4);
    fs.writeFileSync('users.json', data);
}


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.get('/users', (req, res) => {
    users = readUsers()
    res.send(users)
})

app.get('/users/:name', (req, res) => {
    users = readUsers()
    for (let i = 0; i < users.users.length; i++) {
        if(req.params.name == users.users[i].name) {
            return res.send({user:users.users[i],success:true})
        }
    }
    res.send({user:null,success:false})
})

app.post('/login', (req, res) => {
    users = readUsers()
    for (let i = 0; i < users.users.length; i++) {
        if(req.body.name == users.users[i].name && req.body.password == users.users[i].password) {
            return res.send({user:users.users[i],success:true})
        }
    }
    return res.send({message:"Login failed",success:false})
})

app.post('/signup', (req, res) => {
    users = readUsers()
    newUser = {name: req.body.name, password: req.body.password, favorites: []}
    users.users.push(newUser)
    writeUsers(users)
    return res.send({message:"Success",success:false})
})

app.post('/addFav', (req, res) => {
    users = readUsers()
    console.log(req.body);
    for (let i = 0; i < users.users.length; i++) {
        if(req.body.name == users.users[i].name) {
            users.users[i].favorites.push(req.body.favorite)
        }
    }

    writeUsers(users)
    return res.send({message:"Added",success:false})
})

app.post('/removeFav', (req, res) => {
    users = readUsers()

    for (let i = 0; i < users.users.length; i++) {
        if(req.body.name == users.users[i].name) {
            for (let j = 0; j < users.users[i].favorites.length; j++) {
                if(users.users[i].favorites[j] == req.body.favorite) {
                    users.users[i].favorites.splice(j, 1)
                }
            }
        }
    }

    writeUsers(users)
    return res.send({message:"Removed",success:false})
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



