import { tickers, timeEndDate, timeStartDate } from './constant.js';

import axios from 'axios';
import getAllStockAnalysis from './getAllStockAnalysis.js';
import { getGPTSummaryAnalysis } from './getGPTSummaryAnalysis.js';

// Function to introduce a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to post the generated summary to the database
async function postTickerSummary(ticker, summary) {
    try {
        const response = await axios.post('http://localhost:5556/tickerSummary/', {
            ticker,
            summary,
            createAt: new Date().toISOString()
        });
        console.log("Summary posted:", response.data);
        // console.log("Post!!!")
        // console.log(summary)
    } catch (error) {
        console.error('Error posting summary:', error);
    }
}

// Main function to tie everything together
async function analyzeAndSaveSummaries(ticker, startDate, endDate) {
    try {
        const analyses = await getAllStockAnalysis(ticker, startDate, endDate);

        // Combine all analysis content into one string
        let combinedContent = analyses.map(([publishedUTC, { shortTermPrediction, longTermPrediction }]) => 
            `Short-term prediction as of ${publishedUTC}: ${shortTermPrediction}\nLong-term prediction: ${longTermPrediction}`
        ).join('\n\n');
        //console.log("combinedContent:", combinedContent);

        // If combinedContent is not empty, call the GPT-3 API
        if (combinedContent) {
            const summary = await getGPTSummaryAnalysis(combinedContent);

            if (summary) {
                await postTickerSummary(ticker, summary);
            } else {
                console.log("No summary generated for:", combinedContent);
            }
        } else {
            console.log("No data to analyze.");
        }
    } catch (error) {
        console.error('Error in analyzeAndSaveSummaries:', error);
    }
}

// Iterate over each ticker and analyze/save summaries with a delay
(async () => {
  for (const ticker of tickers) {
      await analyzeAndSaveSummaries(ticker, timeStartDate, timeEndDate);
      await delay(3000);
  }
})();

