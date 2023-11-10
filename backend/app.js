const express = require('express');
var cors = require('cors')
const app = express();
const port = 2000;
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection URL
const url = 'mongodb://root:example@db:27017';
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/message.html');
});

app.post('/insert', async (req, res) => {
    try {
        // Connect to the MongoDB database
        const client = new MongoClient(url);
        await client.connect();
        console.log('Connected to the MongoDB database');
        // Access the database and collection
        const db = client.db('chatbot');
        const collection = db.collection('conversation');
        let result = {};
        const { id } = req.body;
        if (id) {
            const filter = { _id: new ObjectId(id) };
            const update = {
                $set: { data: req.body },
            };

            result = await collection.updateOne(filter, update);
        } else {
            const data = { data: req.body };
            result = await collection.insertOne(data);
        }
        // Close the MongoDB connection
        await client.close();
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.post('/user-details', async (req, res) => {
    try {
        // Connect to the MongoDB database
        const client = new MongoClient(url);
        await client.connect();
        console.log('Connected to the MongoDB database');
        // Access the database and collection
        const db = client.db('chatbot');
        const collection = db.collection('users');
        let result = {};
        const { id } = req.body;
        console.log({body: req.body});
        if (id) {
            const filter = { _id: new ObjectId(id) };
            const update = {
                $set: req.body,
            };
            result = await collection.updateOne(filter, update);
        } else {
            const userName = req.body.name;
            if (userName) {
                const data = {
                    name: userName
                 };
                result = await collection.insertOne(data);
            }
        }
        // Close the MongoDB connection
        await client.close();
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.get('/display', async (req, res) => {
    try {
        // Connect to the MongoDB database
        const client = new MongoClient(url);
        await client.connect();
        console.log('Connected to the MongoDB database');

        // Access the database and collection
        const db = client.db('chatbot');
        const collection = db.collection('conversation');
        let result = {};
        const { cId } = req.query;
        if (cId) {
            const objectId = new ObjectId(cId);
            // Find and retrieve data from MongoDB
            result = await collection.findOne({ _id: objectId });
        } else {
            result = await collection.find({}).toArray();
        }
        // Close the MongoDB connection
        await client.close();

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error connecting to MongoDB ' + err);
    }
});

app.get('/user-data', async (req, res) => {
    try {
        // Connect to the MongoDB database
        const client = new MongoClient(url);
        await client.connect();
        console.log('Connected to the MongoDB database');

        // Access the database and collection
        const db = client.db('chatbot');
        const collection = db.collection('users');
        let result = {};
        const { uId } = req.query;
        if (uId) {
            const objectId = new ObjectId(uId);
            // Find and retrieve data from MongoDB
            result = await collection.findOne({ _id: objectId });
        } else {
            result = await collection.find({}).toArray();
        }
        // Close the MongoDB connection
        await client.close();

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error connecting to MongoDB ' + err);
    }
});

app.get('/clear-conversation', async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();

        const database = client.db('chatbot'); // Replace with your actual database name
        const collection = database.collection('conversation'); // Replace with your actual collection name

        // Delete all documents from the collection
        const result = await collection.deleteMany({});
        console.log(`${result.deletedCount} document(s) deleted from the collection.`);
        await client.close();
        res.status(200).json({ "status": "OK", "message": "Deleting conversation Success." });
    } catch {
        console.error(err);
        res.status(500).send('Error connecting to MongoDB ' + err);
    }

});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
