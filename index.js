import { PORT } from './config.js';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import tickerSummaryRoutes from './routes/tickerSummaryRoutes.js'; // Import stockAnalysisRoutes

dotenv.config();
const mongoDBURL = process.env.MONGO_DBURL
const app = express();

// Middleware for parsing JSON data
app.use(express.json());

app.use(cors());

// Test route to check if the server is running
app.get('/', (req, res) => {
    return res.status(200).send('Ticker Summary Service is running!');
});

// Use the stockAnalysisRoutes for handling requests at the '/stockAnalysis' route
app.use('/TickerSummary', tickerSummaryRoutes);

// Connect to MongoDB and start the server
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('MongoDB connected...')

    app.listen(PORT, () => {  
      console.log(`Server listening on port ${PORT}`);
    });

  })
  .catch((err) => {
    console.log(err);
  });
