import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.CHAT_GPT_API_KEY;

// previous model: gpt-3.5-turbo-1106
async function getGPTSummaryAnalysis_Predict(articleContent, model = 'gpt-4-1106-preview') {
    // Format the prompt to provide a detailed financial analysis in paragraph form
    const prompt = `As a financial analyst, provide a comprehensive analysis of the stock's future direction. Assess the short-term and long-term prospects 
        based on recent events, company performance, and market trends. Include reasoning for each prediction, drawing from the supplied data on company leadership changes, 
        analyst downgrades, inflation data, earnings reports, and sector-specific developments. Aim for a cohesive, insightful analysis in paragraph format.\n\nPrevious 
        Ticker Information: ${articleContent}\n\nAnalysis:`;

    // Create the messages array with the formatted prompt
    const messages = [
        {
            "role": "system",
            "content": "You are an experienced financial analyst. Your task is to analyze stock data and provide insights on investment opportunities."
        },
        {
            "role": "user",
            "content": prompt
        }
    ];

    // Request body for the chat API
    const requestBody = {
        model: model,
        messages: messages
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', requestBody, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        //console.log(response.data);
        // Extract the last message from the response, which should be the assistant's reply
        const lastMessage = response.data.choices[0].message.content;
        return lastMessage.trim();
    } catch (error) {
        console.error('Error in making API call:', error);
        return null;
    }
}

// Example usage
//const content = "This is the information about stock ticker...";
//getGPTSummaryAnalysis(content).then(response => console.log(response));

export { getGPTSummaryAnalysis_Predict };
