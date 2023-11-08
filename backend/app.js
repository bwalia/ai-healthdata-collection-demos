const express = require('express');
const app = express();
const port = 2000;
const { MongoClient } = require('mongodb');

// MongoDB connection URL
const url = 'mongodb://root:example@db:27017';

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
        const db = client.db('mydb');
        const collection = db.collection('userData');
        // Insert data into MongoDB
        const data = {
            name: req.body.name,
            message: req.body.message,
        };

        await collection.insertOne(data);

        // Close the MongoDB connection
        await client.close();

        // Redirect to the /display route
        res.redirect('/display');
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
        const db = client.db('mydb');
        const collection = db.collection('userData');

        // Find and retrieve data from MongoDB
        const data = await collection.find({}).toArray();

        // Close the MongoDB connection
        await client.close();

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error connecting to MongoDB');
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
