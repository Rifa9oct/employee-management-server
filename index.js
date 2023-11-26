const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6vyreuj.mongodb.net/?retryWrites=true&w=majority`;


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
    //await client.connect();

   

   //auth related api (generate token)
   app.post('/jwt', async (req, res) => {
    const user = req.body;
    console.log("user for token", user);
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })
    res.send({ success: true });
  })

  //clear token from cookie
  app.post('/logout', async (req, res) => {
    const user = req.body;
    res.clearCookie('token', { maxAge: 0 }).send({ success: true })
  })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req, res)=>{
    res.send("EMPLOYEE MANAGEMENT SERVER IS RUNNING....")
})

app.listen(port, ()=>{
    console.log(`Employee Management server is running, ${port}`)
})