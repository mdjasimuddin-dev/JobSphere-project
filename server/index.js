const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 9000
const { MongoClient, ObjectId } = require("mongodb");


const app = express()

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    optionSuccessStatus: true
}


app.use(cors(corsOptions))
app.use(express.json())


app.get('/', (req, res) => {
    res.send("JobSphere Server Running Start")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wukjrsy.mongodb.net/`
const client = new MongoClient(uri);

async function run() {
    try {
        const jobsCollection = client.db('JobSphereDB').collection('jobs');
        const bidsCollection = client.db('JobSphereDB').collection('bids');
        console.log("mongodb Database connection successful.");



        app.get('/jobs', async (req, res) => {
            const result = await jobsCollection.find().toArray()
            res.status(200).send(result)
        })

        app.get('/job/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await jobsCollection.findOne(query)
            res.status(200).send(result)
        })

        app.post('/bid', async (req, res) => {
            const reqBody = req.body
            const bids = await bidsCollection.insertOne(reqBody)
            res.status(200).send(bids)
        })

        app.post('/job', async (req, res) => {
            const reqBody = req.body
            const result = await jobsCollection.insertOne(reqBody)
            res.status(200).send(result)
        })

        // get posted job by specific user 
        app.get('/jobs/:email', async (req, res) => {
            const email = req.params.email
            const query = { 'buyer.email': email }
            const result = await jobsCollection.find(query).toArray()
            res.status(200).send(result)
        })

        // update job by specific id
        app.put('/job/:id', async (req, res) => {
            const id = req.params.id
            const jobData = req.body
            console.log(jobData);
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }

            const updateDoc = {
                $set: {
                    ...jobData
                }
            }

            const result = await jobsCollection.updateOne(query, updateDoc, options)
            res.status(200).send(result)
        })

        // delete job by specific id
        app.delete('/job/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await jobsCollection.deleteOne(query)
            res.status(200).send(result)
        })




        // get posted job by specific user 
        app.get('/bids/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await bidsCollection.find(query).toArray()
            res.status(200).send(result)
        })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Server running ${port} Successful.`);
})