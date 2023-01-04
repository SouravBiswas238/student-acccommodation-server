const express = require('express')
const app = express();
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 5000;

// middle wire
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v51th2o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        const userCollection = client.db("student-info").collection("user");
        // const taskCollection = client.db("task-manager").collection("tasks");
        // const taskCompleted = client.db("task-manager").collection("completed");

        // post user information
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            // const token = jwt.sign({ email: newUser.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' });
            const result = await userCollection.insertOne(newUser);
            res.send({ success: true, result });
        });
        // get alluser
        app.get('/user', async (req, res) => {

            const query = {};
            const result = userCollection.find(query);
            users = await result.toArray();
            res.send(users);
        });


        // get single user
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const result = await userCollection.findOne(query);
            res.send(result);
        })
        // put or update single user info
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })


    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})