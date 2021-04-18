const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dcrxy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("services");

  const serviceOrderedCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("user");

  const reviewCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("reviews");

  app.get("/services", (req, res) => {
    serviceCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/addServices", (req, res) => {
    const newService = req.body;
    serviceCollection.insertOne(newService).then((result) => {
      res.send(result.insertedCount > 0);
      res.redirect("/");
    });
  });

  app.get("/book/:_id", (req, res) => {
    serviceCollection
      .find({ _id: ObjectId(req.params._id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.delete("/delete/:_id", (req, res) => {
    serviceCollection
      .deleteOne({ _id: ObjectId(req.params._id) })
      .then((result) => {
        res.send(result.deleteOne > 0);
      });
  });

  app.post("/addBooking", (req, res) => {
    const newBooking = req.body;
    serviceOrderedCollection.insertOne(newBooking).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/booking", (req, res) => {
    serviceOrderedCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/addReview", (req, res) => {
    const newReview = req.body;
    reviewCollection.insertOne(newReview).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/review", (req, res) => {
    reviewCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
});

app.get("/", (req, res) => {
  res.send("hello world");
});
app.listen(port);
