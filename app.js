require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

let iterationCount = 0;
const submitButton = document.querySelector("#generate-btn")
const inputElement = document.querySelector("#adventure-input")

const getImages = async (prompt) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer: ${process.env.API_KEY}`,
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
        console.log(data)
        let imageUrl = data.choices[0].image; // adjust based on actual response structure
        document.querySelector("#adventure-image").style.backgroundImage = `url(${imageUrl})`;
    } catch (error) {
        console.error(error)
    }
}

const getChoices = async (prompt) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer: ${API_KEY}`,
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
        console.log(data)
        let choices = data.choices.map(choice => choice.text); // adjust based on actual response structure

        let choicesElement = document.querySelector("#choices");
        choicesElement.innerHTML = "";

        for (let choice of choices) {
            let choiceElement = document.createElement("div");
            choiceElement.classList.add("choice");
            choiceElement.innerText = choice;
            choiceElement.addEventListener("click", () => {
                if (iterationCount < 10) {
                    iterationCount++;
                    processAdventure(choice);
                }
            });
            choicesElement.appendChild(choiceElement);
        }
    } catch (error) {
        console.error(error)
    }
}

const processAdventure = async (prompt) => {
    await getChoices(prompt);
    await getImages(prompt);
}

submitButton.addEventListener("click", () => {
    let initialPrompt = inputElement.value;
    processAdventure(initialPrompt);
});
