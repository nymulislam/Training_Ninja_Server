const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();

const port = process.env.PORT || 5000;


app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tloczwa.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)

        const servicesCollection = client.db("servicesDB").collection("services");

        // read data 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find();
            const result = await cursor.toArray()
            res.send(result);
        })

        // get data
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Training Ninja Server is Running...")
})

app.listen(port, () => {
    console.log(`Training Ninja Server is Running on ${port}`);
})