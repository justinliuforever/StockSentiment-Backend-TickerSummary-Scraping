import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.CHAT_GPT_API_KEY;

async function getGPTSummaryAnalysis_Company(articleContent, model = 'gpt-3.5-turbo-1106') {
    // Format the prompt to list the major events affecting the company in a concise manner
    const prompt = `
        Provide a summary of the key events or developments influencing the company's performance, as detailed in the provided content. 
        Present the summary as a list of sentences, each highlighting a significant event or development. Limit the list to a maximum of five items. 
        Avoid using terms like 'short term' or 'long term' and focus on delivering clear, impactful information about the company's current status and foreseeable future.

        Provided Information: ${articleContent}
    `;

    const messages = [
        {
            "role": "system",
            "content": "You are a financial analyst. Your task is to succinctly list the most significant recent events affecting the company, in a format of a numbered list, with a maximum of five items."
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
//getGPTSummaryAnalysis_Company(content).then(response => console.log(response));

export { getGPTSummaryAnalysis_Company };
