require("dotenv").config();
const fetch = require("node-fetch");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const getImages = async (prompt) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: prompt,
            max_tokens: 256
        })
    }

    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', options)
        const data = await response.json()
        let imageUrl = data.choices[0].image; // adjust based on actual response structure
        return imageUrl;
    } catch (error) {
        console.error(error)
    }
}

const getChoices = async (prompt) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            prompt: prompt,
            max_responses: 3
        })  
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        let choices = data.choices.map(choice => choice.text); // adjust based on actual response structure
        return choices;
    } catch (error) {
        console.error(error)
    }
}

app.post("/startAdventure", async (req, res) => {
    const {prompt} = req.body;

    // Call your getChoices and getImages functions here
    const imageUrl = await getImages(prompt);
    const choices = await getChoices(prompt);

    // Once you have the data, send it back in the response
    res.json({
        imageUrl,
        choices
    });
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
