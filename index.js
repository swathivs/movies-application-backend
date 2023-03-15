import * as dotenv from 'dotenv' 
dotenv.config()
import express from "express"; 
import { MongoClient } from "mongodb";
import cors from 'cors';
const app = express();

const PORT = process.env.PORT;
const Mongo_URL = process.env.Mongo_URL;
const client = new MongoClient(Mongo_URL);
await client.connect();
console.log("Mongo Connected!!!");
app.use(cors());
app.get("/", function (request, response) {
  response.send("Welcome to Movie Application");
});

app.use(express.json());

// Get all movies
app.get("/movies", async function (request, response) {
  const getmovies = await client.db("movies").collection("moviedata").find({}).toArray();
  console.log(getmovies)
  response.send(getmovies);
});
// Particular Movie
app.get("/movies/:id", async function (request, response) {
  const {id} = request.params;
  const movie = await client.db("movies").collection("moviedata").findOne({id:id});
  movie ? response.send(movie) : response.status(404).send({message: "Not Found"});
});

//POST // Create 
app.post("/movies", async function (request, response) {
  const data = request.body;
  const result = await client.db("movies").collection("moviedata").insertMany(data);
  response.send(result);
});

//DELETE
app.delete("/movies/:id", async function (request, response) {
  const {id} = request.params;
  const deletemovie = await client.db("movies").collection("moviedata").deleteOne({id:id});
  deletemovie.deletedCount ? response.send({message: "Movie deleted successfully"}) 
  : response.status(404).send({message: "Movie Not Found"});
});

//UPDATE
app.put("/movies/:id", async function (request, response) {
  const {id} = request.params;
  const data = request.body;
  console.log(data);
  const updatemovie = await client.db("movies").collection("moviedata").updateOne({id:id}, {$set: data });
  response.send(updatemovie);
});
app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
