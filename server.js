import express from "express";
// import "./schedular2.js";
import "./schedular3.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;
app.use(express.json());

app.listen(port, () => {
  console.log("Server running on port: " + port);
  console.log(process.env.MY_SECRET_KEY);
});
