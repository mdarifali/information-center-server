const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


app.use(cors());
app.use(express.json());

// Mongodb Connection //

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASS}@cluster0.eosns.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const salesLeadCollection = client.db('information-center').collection('sales-lead');
    const adminCollection = client.db('information-center').collection('admin');
    const addProducts = client.db('information-center').collection('add-products');

    // Get Admin Api data //
    app.get('/admin', async (req, res) => {
      const query = {};
      const cursor = adminCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get leads Api data //
    app.get('/leads', async (req, res) => {
      const query = {};
      const cursor = salesLeadCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

      // Insert Products Api data //
      app.post('/leads', async (req, res) => {
        const leads = req.body;
        const result = await salesLeadCollection.insertOne(leads);
        return res.send({ success: true, result });
    });

    // Get Products Api data //
    app.get('/product', async (req, res) => {
      const query = {};
      const cursor = addProducts.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

      // Insert New Products Api data //
      app.post('/product', async (req, res) => {
        const product = req.body;
        const result = await addProducts.insertOne(product);
        return res.send({ success: true, result });
    });

    // Delete Products Api data server //
    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await addProducts.deleteOne(query);
      res.send(result);
  });

  // Update Api data server//
  app.put('/product/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = { 
        $set:updatedData
     };
    const result = await addProducts.updateOne(filter, updateDoc, options);
    res.send(result);
  });


  }

  finally {
    console.log('MongoDB is Connected');
  }

}

run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Welcome *Infromations-Center-Server*')
})

app.listen(port, () => {
  console.log(`Localhost server on port ${port}`)
})