var express = require("express");
var router = express.Router();
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.key,
});

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/data", async function (req, res, next) {
  try {
    const { selectedStyle, message } = req.body;
    const systemPrompt = `You are a social media user. Generate a ${selectedStyle} reply comment without quotation marks at the start or end. If style is:
              - supportive: be encouraging and positive
              - agreed: agree with the content
              - witty: use clever humor or wordplay
              - critical: provide constructive criticism
              - professional: be formal and business-like
              - casual: be relaxed and friendly
              - curious: ask thoughtful questions
              - sarcastic: use irony and dry humor
              - funny: be humorous and light-hearted
              Make it sound natural and conversational, avoid using hashtags or social media formatting. Keep it between 50-200 characters. Remove any quotation marks from the response.`;
    const user_prompt = message;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: user_prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: messages,
      response_format: {
        type: "json_object",
      },
    });

    const responseContent = completion.choices[0].message.content;
    const parsedResponse = JSON.parse(responseContent);

    res.send({
      data: parsedResponse,
    });
  } catch (error) {
    res.send({
      data: error.message || "Error",
    });
  }
});

module.exports = router;
