import axios from 'axios';

// Define BASE_URL at the top of your file
const BASE_URL = process.env.STOCK_ANALYSIS_BACKEND_URL || 'http://localhost:5555';

async function getAllStockAnalysis(tickerName, startDate, endDate) {
    // Use the BASE_URL to construct the full endpoint URL
    const url = `${BASE_URL}/stockAnalysis/ticker/${tickerName}?minDate=${startDate}&maxDate=${endDate}`;

    try {
        const response = await axios.get(url);
        const analyses = response.data.data;

        const formattedData = analyses.map(analysis => {
            return [analysis.publishedUTC, analysis.title, analyses.description ,analysis.chatGPTAnalysis];
        });

        return formattedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

export default getAllStockAnalysis;
