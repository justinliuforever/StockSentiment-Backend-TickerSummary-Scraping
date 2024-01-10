import { tickers, timePeriod } from './constant.js';

import axios from 'axios';
import dotenv from 'dotenv';
import getAllStockAnalysis from './getAllStockAnalysis.js';
import { getGPTSummaryAnalysis_Company } from './getGPTSummaryAnalysis_Company.js';
import { getGPTSummaryAnalysis_Predict } from './getGPTSummaryAnalysis_Predict.js';

dotenv.config();

const BASE_URL = process.env.STOCK_ANALYSIS_BACKEND_URL || 'http://localhost:5556';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function getStartAndEndDates() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - timePeriod);

    return {
        timeStartDate: formatDate(startDate),
        timeEndDate: formatDate(endDate)
    };
}

async function postTickerSummary(ticker, summaryCompany, summaryPredict) {
    try {
        const response = await axios.post(`${BASE_URL}/tickerSummary/`, {
            ticker,
            summaryCompany,
            summaryPredict,
            createAt: new Date().toISOString()
        });
        console.log("Summary posted:", response.data);
    } catch (error) {
        console.error('Error posting summary:', error);
    }
}

async function analyzeAndSaveSummaries(ticker, startDate, endDate) {
    try {
        const analyses = await getAllStockAnalysis(ticker, startDate, endDate);

        let combinedContent = analyses.map(([publishedUTC, title, description,{ shortTermPrediction, longTermPrediction }]) => 
            `Information about stock ticker: ${ticker}, ${title}: ${description}. Short-term inform of ${publishedUTC}: ${shortTermPrediction}, Long-term inform: ${longTermPrediction}`
        ).join('\n\n');

        console.log("Combined content:", combinedContent);
        if (combinedContent) {
            const summaryCompany = await getGPTSummaryAnalysis_Company(combinedContent);

            await delay(1000); // Wait for 1 second

            const summaryPredict = await getGPTSummaryAnalysis_Predict(combinedContent);

            if (summaryCompany || summaryPredict) {
                await postTickerSummary(ticker, summaryCompany, summaryPredict);
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

(async () => {
    for (const ticker of tickers) {
        const { timeStartDate, timeEndDate } = getStartAndEndDates();
        await analyzeAndSaveSummaries(ticker, timeStartDate, timeEndDate);
        await delay(3000); // Delay between each ticker analysis
    }
})();
