const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bsdjaxv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri , { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 } );

async function run(){
    try{
        await client.connect();
        // all collection
        const homeCollection = client.db('collegeDB').collection('homedata');
        const collegeCollection = client.db('collegeDB').collection('college');
        const usersCollection = client.db('collegeDB').collection('users');
        const admissionCollection = client.db('collegeDB').collection('admission');
        
        // all functions

        // admission collection
        app.post('/admission', async(req, res)=>{
            const newAdmission = req.body;
            const result = await admissionCollection.insertOne(newAdmission);
            res.send(result);
        } )

        // post user both email, google, github
        app.post('/users', async(req, res)=>{
            const user = req.body;
            const query = {email: user.email};
            const existingUser = await usersCollection.findOne(query);
            console.log( 'existingUser: ', existingUser);
             if(existingUser){
                return res.send({ message: 'user already exists!' })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        // get all users
        app.get('/users', async(req, res)=>{
            const result = await usersCollection.find().toArray();
            res.send(result);
        } )

        // get home data
        app.get('/homedata', async(req, res)=>{
            const result = await homeCollection.find().toArray();
            res.send(result);
        } )

        // get all college
        app.get('/college', async(req, res)=>{
            const result = await collegeCollection.find().toArray();
            res.send(result);
        } )

        // dynamic route for home data
        app.get('/homedata/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await homeCollection.findOne(query);
            res.send(result);
        })

        // dynamic route for college data
        app.get('/college/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await collegeCollection.findOne(query);
            res.send(result);
        })

        // searching college
        app.get('/search/:name', async(req, res)=>{
            let result = await homeCollection.find({
                "$or":[
                    {collegeName: { $regex: req.params.name, $options: 'i'}},
                ]
            }).toArray()
            console.log(result)
            res.send(result)
        })
        
    }
    finally{

    }
}
run().catch(console.dir);
// connection end

app.get('/', (req, res) => {
    res.send('college running');
})

app.listen(port, ()=> {
    console.log(`college server running at ${port}` );
}) 

run().catch(err => console.log(err));