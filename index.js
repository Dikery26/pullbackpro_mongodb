import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

// Configure CORS
app.use(cors({
    origin: "https://automate-emails-test.webflow.io", // Your Webflow site URL
    methods: "GET,POST",
    allowedHeaders: "Content-Type",
}));

mongoose.connect(MONGOURL).then(() => {
    console.log("connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`server is running on PORT ${PORT}`);
    });
}).catch((error) => console.log(error));

const userSchema = mongoose.Schema({
    paragraph: String,
    imageURL: String,
});

const userModel = mongoose.model("contents", userSchema);

app.get("/getContents", async (req, res) => {
    console.log("Received request for contents");
    try {
        const userData = await userModel.find();
        console.log("Data fetched: ", userData);
        res.json(userData);
    } catch (error) {
        console.error("Error fetching content: ", error);
        res.status(500).json({ message: "Error fetching content" });
    }
});
