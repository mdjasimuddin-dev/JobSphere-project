const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 9000
const { MongoClient, ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')


const app = express()

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    optionSuccessStatus: true
}


app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())


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



        // jwt token create 
        app.post('/jwt', async (req, res) => {
            const user = req.body
            const token = await jwt.sign(user, process.env.TOKEN_SECRET_KEY, {
                expiresIn: '7d'
            })
            res.cookie('jobSphere', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
            })
                .send({ token, message: "token create successful." })
        })





        // Token verify middleware
        const tokenVerify = (req, res, next) => {
            //    step-01 : Token received
            const token = req.cookies.jobSphere

            //    step-02 : Token don't received
            if (!token) {
                return res.status(403).send({ message: "Unauthorize access!" })
            }

            //    step-03 : Token verify && next step start
            jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decode) => {
                if (err) {
                    return res.status(403).send({ message: "Unauthorize access!" })
                } else {
                    req.user = decode;
                    next()
                }
            })
        }

        app.get('/logout', async (req, res) => {
            res.clearCookie('jobSphere', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 0
            })
                .send({ message: "token remove done." })
        })



        app.get('/jobs', async (req, res) => {
            const result = await jobsCollection.find().toArray()
            res.status(200).send(result)
        })

        app.get('/job/:id', async (req, res) => {
            const id = req?.params?.id
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

        // ===> Protected Route : get my-posted-job by specific user  
        app.get('/jobs/:email', tokenVerify, async (req, res) => {
            const tokenValue = req?.user?.email
            const email = req?.params?.email

            try {
                if (tokenValue !== email) {
                    return res.status(403).send({ message: "Forbidden access!" })
                }

                const query = { 'buyer.email': email }
                const result = await jobsCollection.find(query).toArray()
                res.status(200).send(result)
            } catch (error) {
                return res.status(404).send({ message: "something is wrong!" })
            }
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




        // ===> Protected Route : get my-bids by specific user 
        app.get('/my-bids/:email', tokenVerify, async (req, res) => {
            const email = req?.params?.email
            const tokenEmail = req?.user?.email
            try {
                if (email !== tokenEmail) {
                    return res.status(403).send({ message: 'Forbidden access!' })
                }
                const query = { email }
                const result = await bidsCollection.find(query).toArray()
                res.status(200).send(result)
            } catch (error) {
                return res.status(404).send({ message: "something is wrong" })
            }
        })

        // ===> Protected Route : get bid-request by specific user 
        app.get('/bid-request/:email', async (req, res) => {
            const email = req?.params?.email
            const tokenEmail = req?.user?.email
            try {
                if (email !== tokenEmail) {
                    return res.status(403).send({ message: 'Forbidden access!' })
                }
                const query = { buyer_email: email }
                const result = await bidsCollection.find(query).toArray()
                res.status(200).send(result)
            } catch (error) {
                return res.status(404).send({ message: "something is wrong" })
            }
        })

        // status update by id 
        app.patch('/bid-status/:id', async (req, res) => {
            const id = req.params.id
            const reqBody = req.body
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }

            const updateDoc = {
                $set: {
                    status: reqBody.currentStatus
                }
            }

            const result = await bidsCollection.updateOne(query, updateDoc, options)
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