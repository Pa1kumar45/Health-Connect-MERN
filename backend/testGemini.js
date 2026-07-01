import model from "./src/lib/gemini.js";

const result = await model.generateContent(
    "Say Hello in one sentence."
);

console.log(result.response.text());