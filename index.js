import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;

// Enable CORS for your specific frontend URL
app.use(cors({
  origin: 'https://automate-emails-test.webflow.io' // Replace this with your frontend URL
}));

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Define a Mongoose schema for the content collection
const contentSchema = new mongoose.Schema({
  paragraph: String,
  imgurl: String
});

// Create a Mongoose model for the content collection
const Content = mongoose.model('Content', contentSchema);

// Route to retrieve all documents from the content collection
app.get('/getContents', async (req, res) => {
  try {
    const contents = await Content.find(); // Fetch all documents from the content collection
    res.json(contents); // Send the fetched documents as JSON response
  } catch (error) {
    console.error('Error fetching contents:', error);
    res.status(500).send('Error fetching contents');
  }
});

// Optional: Add a route for the root to test if the server is running
app.get('/', (req, res) => {
  res.send('Hello, this is the pullbackpro API!');
});
