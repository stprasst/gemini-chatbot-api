import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {GoogleGenerativeAI} from "@google/generative-ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({error: 'Message is required'});
    }

    try {
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        let text = response.text();

        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        res.json({reply: text});
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({error: 'Failed to generate response'});
    }
});
app.listen(port, () => {
    console.log(`Gemini Chatbot is running on http://localhost:${port}`);
})
