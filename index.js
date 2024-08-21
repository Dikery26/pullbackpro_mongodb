import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

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

// Define a Mongoose schema for the email data
const emailSchema = new mongoose.Schema({
  subject: String,
  body: String,
  attachments: [
    {
      filename: String,
      mimeType: String,
      data: Buffer
    }
  ]
});

// Create Mongoose models for different alert types
const AllInOneAlerts = mongoose.model('All-in-One_Alerts', emailSchema);
const CryptoAlerts = mongoose.model('Crypto_Alerts', emailSchema);
const LSE_NSE_BSEAlerts = mongoose.model('LSE/NSE/BSE_Alerts', emailSchema);
const USEquitiesAlerts = mongoose.model('US-Equities_Alerts', emailSchema);

// Route to retrieve all documents from a specific collection
app.get('/getContents/:collectionName', async (req, res) => {
  const { collectionName } = req.params;

  let Model;
  switch (collectionName) {
    case 'All-in-One_Alerts':
      Model = AllInOneAlerts;
      break;
    case 'Crypto_Alerts':
      Model = CryptoAlerts;
      break;
    case 'LSE/NSE/BSE_Alerts':
      Model = LSE_NSE_BSEAlerts;
      break;
    case 'US-Equities_Alerts':
      Model = USEquitiesAlerts;
      break;
    default:
      return res.status(400).send('Invalid collection name');
  }

  try {
    console.log(`Fetching documents from collection: ${collectionName}`);
    const contents = await Model.find(); // Fetch all documents from the specified collection
    console.log(`Found ${contents.length} documents`);
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
