const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();
app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("./public"));

/*
app.get("/:id", (req, res) => {
    // TODO Redirect to URL
});

app.post("/url", (req, res) => {
    // TODO Create Shortened URL
});

app.get("/url/:id", (req, res) => {
    // TODO get information regarding a url
});
*/
const port = process.env.PORT || 4848;
app.listen(port, () => {
    console.log(`Listening on Port: ${port}`);
});
