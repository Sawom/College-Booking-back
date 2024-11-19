const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const { MongoClient, ServerApiVersion } = require('mongodb');
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

        // all functions

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

        // searching college
        app.get('/search/:name', async(req, res)=>{
            let result = await homeCollection.find({
                "$or":[
                    {collegeName: { $regex: req.params.name, $options: 'i'}},
                ]
            }).toArray()
            // console.log(result)
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