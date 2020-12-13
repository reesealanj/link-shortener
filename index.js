const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const yup = require("yup");
const { nanoid } = require("nanoid");
const { nextTick } = require("process");

const app = express();
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(express.json());
app.use(express.static("./public"));

// app.get("/url/:id", (req, res) => {
//     // TODO get information regarding a url
// });

// app.get("/:id", (req, res) => {
//     // TODO Redirect to URL
// });

// Validate input using this schema
const schema = yup.object().shape({
    slug: yup
        .string()
        .trim()
        .matches(/^[\w\-]+$/i),
    url: yup.string().trim().url().required(),
});

app.post("/url", async (req, res, next) => {
    let { slug, url } = req.body;
    if (!url) {
        res.status(400);
        res.json({
            message: "Invalid Format, missing URL",
        });
        return;
    }
    try {
        await schema.validate({
            slug,
            url,
        });
        if (!slug) {
            slug = nanoid(7);
        }
        slug = slug.toLowerCase();
        res.json({
            slug,
            url,
        });
    } catch (error) {
        next(error);
    }
});

app.use((error, req, res, next) => {
    if (error.status) {
        res.status(error.status);
    } else {
        res.status(500);
    }
    if (error.stack.startsWith("ValidationError: slug")) {
        error.message = "Invalid Slug format!";
    } else if (error.stack.startsWith("ValidationError: url")) {
        error.message = "Invalid URL format!";
    }
    res.json({
        message: error.message,
        stack:
            process.env.NODE_ENV === "production" ? "Error Stack" : error.stack,
    });
});

const port = process.env.PORT || 4848;
app.listen(port, () => {
    console.log(`Listening on Port: ${port}`);
});
