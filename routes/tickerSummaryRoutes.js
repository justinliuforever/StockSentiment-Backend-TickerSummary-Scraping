import { TickerSummary } from '../models/tickerSummaryModel.js';
import express from 'express';

const router = express.Router();

// Route for saving a new ticker summary
router.post('/', async (req, res) => {
  try {
      // Check for required field
      if (!req.body.ticker || !req.body.summary || !req.body.createAt) {
          return res.status(400).send({ msg: 'Please include all required fields' });
      }

      const newTickerSummary = new TickerSummary(req.body);
      const tickerSummary = await newTickerSummary.save();
      return res.status(201).send(tickerSummary);
  } catch (error) {
      console.log(error);
      return res.status(500).send({ msg: 'Internal Server Error' });
  }
});

// Route for getting all ticker summaries
router.get('/', async (req, res) => {
  try {
      const tickerSummaries = await TickerSummary.find({});
      return res.status(200).json({
          count: tickerSummaries.length,
          data: tickerSummaries,
      });
  } catch (error) {
      console.log(error);
      return res.status(500).send({ msg: error.message });
  }
});

// Route for getting the most recent ticker summary by ticker
router.get('/:ticker', async (req, res) => {
  try {
      const { ticker } = req.params;
      
      // Find the most recent ticker summary by sorting in descending order based on the createdAt timestamp
      const tickerSummary = await TickerSummary.findOne({ ticker: ticker }).sort({ createdAt: -1 });

      if (!tickerSummary) {
          return res.status(404).send({ msg: 'Ticker Summary not found' });
      }

      return res.status(200).json(tickerSummary);
  } catch (error) {
      console.log(error);
      return res.status(500).send({ msg: error.message });
  }
});


// Route for deleting a ticker summary by ticker
router.delete('/:ticker', async (req, res) => {
  try {
      const { ticker } = req.params;
      const result = await TickerSummary.deleteMany({ ticker: ticker });

      if (!result) {
          return res.status(404).send({ msg: 'Ticker Summary not found' });
      }

      return res.status(200).send({ msg: 'Ticker Summary deleted' });
  } catch (error) {
      console.log(error);
      return res.status(500).send({ msg: error.message });
  }
});

// Export the router
export default router;
